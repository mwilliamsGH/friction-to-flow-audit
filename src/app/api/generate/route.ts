// AI Generation Pipeline API Route
// Orchestrates: archetype scoring, toolkit recommendations, automation opportunities, narrative generation

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { generateJsonContent, TIMEOUT_MS } from '@/lib/gemini';
import { determineArchetype, getArchetypeScoringDetails } from '@/lib/archetype-scoring';
import { calculateAllMetrics } from '@/lib/survey-calculations';
import {
  SurveyResponses,
  ToolkitRecommendations,
  AutomationOpportunities,
  NarrativeOutput,
  ArchetypeId,
  SurveyResponse,
  AIOutput,
} from '@/types';

// Request body type
interface GenerateRequest {
  responseId: string;
}

// Response type
interface GenerateResponse {
  success: boolean;
  data?: {
    archetype: ArchetypeId;
    metrics: {
      weeklyFrictionHours: number;
      aiReadinessScore: number;
      automationPotential: number;
    };
    toolkit: ToolkitRecommendations | null;
    automations: AutomationOpportunities | null;
    narrative: NarrativeOutput | null;
  };
  error?: string;
  partialResults?: boolean;
}

// Fallback content for when AI generation fails
const FALLBACK_TOOLKIT: ToolkitRecommendations = {
  toolkit: [
    {
      tool: 'NotebookLM',
      subtitle: 'Research Hub',
      use_cases: [
        'Upload brand guidelines for quick reference',
        'Generate audio summaries of lengthy documents',
        'Build searchable knowledge base for your team',
      ],
      why_this_matters: 'Reduces time spent searching for information.',
    },
    {
      tool: 'Claude / Gemini / ChatGPT / Perplexity',
      subtitle: 'AI Assistant Suite',
      use_cases: [
        'Draft and edit written content quickly',
        'Research competitors and industry trends',
        'Brainstorm concepts and campaign ideas',
      ],
      why_this_matters: 'Accelerates your creative process with AI-powered assistance.',
    },
    {
      tool: 'AI Studio',
      subtitle: 'Custom Tool Builder',
      use_cases: [
        'Build internal utilities for common calculations',
        'Create workflow tools without coding',
        'Prototype ideas quickly for validation',
      ],
      why_this_matters: 'Empowers you to create solutions for your specific needs.',
    },
    {
      tool: 'Claude Cowork',
      subtitle: 'Desktop Automation',
      use_cases: [
        'Batch rename and organize files automatically',
        'Extract data from documents into structured formats',
        'Automate repetitive file processing tasks',
      ],
      why_this_matters: 'Handles tedious file tasks so you can focus on creative work.',
    },
    {
      tool: 'Custom Agents',
      subtitle: 'Personalized AI',
      use_cases: [
        'Create a brand voice assistant with your guidelines',
        'Build client-specific experts for quick answers',
        'Set up quality checkers for consistent output',
      ],
      why_this_matters: 'Provides consistent, context-aware assistance for repeated tasks.',
    },
  ],
};

const FALLBACK_AUTOMATIONS: AutomationOpportunities = {
  automations: [
    {
      rank: 1,
      title: 'Approval Reminder System',
      complexity: 'Quick Win',
      description:
        'Automated notifications when items await approval for more than 24 hours.',
      tools: ['Zapier', 'Slack'],
      friction_addressed: 'Approval delays',
    },
    {
      rank: 2,
      title: 'File Organization Bot',
      complexity: 'Project',
      description: 'Automatically organize incoming files into proper folder structures.',
      tools: ['Claude Cowork', 'Google Drive'],
      friction_addressed: 'Asset management',
    },
    {
      rank: 3,
      title: 'Status Update Automation',
      complexity: 'Quick Win',
      description:
        'Auto-post project status updates to team channels at scheduled intervals.',
      tools: ['Zapier', 'Slack'],
      friction_addressed: 'Communication overhead',
    },
  ],
};

const FALLBACK_NARRATIVE: NarrativeOutput = {
  narrative:
    'Based on your audit responses, you have opportunities to reduce workflow friction through targeted AI tool adoption. Your current friction points are common in creative agency environments and addressable with the right toolkit.',
  core_recommendation:
    'Start by exploring the toolkit recommendations below to find the best fit for your workflow.',
};

/**
 * Build the toolkit recommendations prompt
 */
function buildToolkitPrompt(
  responses: SurveyResponses,
  archetype: ArchetypeId
): string {
  return `You are an AI toolkit advisor creating personalized recommendations for a creative agency employee. You must recommend ALL 5 tools with use cases tailored to their specific workflow friction.

## User Data
- Name: ${responses.q1_name || 'User'}
- Role: ${responses.q3_role || 'Creative Professional'}
- Primary Client: ${responses.q8_primary_client || 'Various clients'}
- Work Type: ${responses.q7_work_type || 'Mix of everything'}
- Top Friction Types: ${(responses.q13_friction_types || []).join(', ') || 'Various friction points'}
- Weekly Friction Hours: ${responses.q15_total_friction_hours || 0}
- Repeated Tasks: ${responses.q18_repeated_task || 'Not specified'}
- Handoff Pain Points: ${responses.q19_handoff_pain || 'Not specified'}
- Manual Data Movement: ${responses.q21_data_movement || 'Not specified'}
- Notification Wishes: ${responses.q20_notification_wish || 'Not specified'}
- Tech Stack: ${(responses.q5_tools || []).join(', ') || 'Standard tools'}
- Tech Walls: ${(responses.q6_tech_walls || []).join(', ') || 'None specified'}
- AI Adoption Speed: ${responses.q27_adoption_speed || 'Pragmatist'}
- AI Flavors Used: ${(responses.q25_ai_flavors || []).join(', ') || 'None'}
- AI Knowledge Level: ${responses.q26_ai_knowledge || 5} / 10
- Learning Style: ${responses.q32_learning_style || 'Jump in and figure it out'}
- Sacred Elements: ${responses.q30_sacred || 'Not specified'}
- Archetype: ${archetype}

## The 5 Tools (MUST recommend all)

1. **NotebookLM** - RAG research hub for ingesting documents and generating audio summaries, mind maps, briefings
2. **Claude / Gemini / ChatGPT / Perplexity** - General AI assistants for writing, research, brainstorming, image generation
3. **AI Studio (Vibe Coding)** - Build custom internal tools and utilities through natural language
4. **Claude Cowork** - Desktop agent for file management, batch processing, document creation
5. **Custom Agents** - Claude Projects, Custom GPTs, Gemini Gems for repeated workflows with uploaded context

## Base Use Cases Reference

### NotebookLM
- Upload brand guidelines for instant compliance answers
- Generate audio briefings for freelancers or new team members
- Create searchable archive of past campaign rationales
- Build FAQ from lengthy client documentation
- Cross-reference multiple briefs to find conflicts

### Claude / Gemini / ChatGPT / Perplexity
- Draft client emails from rough notes (Claude)
- Quick competitive research with citations (Perplexity)
- Generate mockup variations before full production (ChatGPT)
- Research industry trends with current data (Gemini)
- Brainstorm campaign concepts with constraints

### AI Studio
- Build asset naming convention checker
- Create print spec calculator (DPI, bleed, safe zones)
- Build social media size converter tool
- Create internal brief generator form
- Build deadline/workback calculator

### Claude Cowork
- Batch rename hundreds of assets with consistent naming
- Extract data from messy briefs into structured format
- Organize project folders by client/campaign/date
- Convert meeting notes into formatted action items
- Clean up and consolidate version files

### Custom Agents
- Brand voice assistant with uploaded guidelines
- Client-specific expert (all their requirements in one place)
- Email template generator in your personal style
- Quality checker against brand standards
- Meeting prep assistant with historical context

## Instructions

### For each tool, generate:

1. **Subtitle**: 2-4 word descriptor of how THIS USER would use it
   - NOT generic (e.g., "File Management")
   - Specific to their friction (e.g., "Nike Asset Organization")

2. **Use Cases**: Exactly 3 bullet points
   - Start with action verb
   - Reference their specific context (client names, tools, task types)
   - Solve their actual friction points
   - Be implementable this week

3. **Why This Matters**: One sentence connecting tool to their specific pain
   - Reference their data (hours, friction type)
   - Make the ROI clear

### Calibration Rules

**If Pioneer/Fast Follower (high AI readiness):**
- Include advanced use cases
- Technical language acceptable
- Suggest combining tools

**If Pragmatist/Skeptic (lower readiness):**
- Focus on simple entry points
- Emphasize ease of use
- One tool at a time approach

**If specific repeated task identified (Q18):**
- Reference that exact task in Custom Agents recommendation

**If specific tech walls identified (Q6):**
- Address how tools bypass those barriers

**Always respect sacred elements (Q30):**
- Never recommend automating what they want human
- Acknowledge boundaries in "why this matters"

### Web Search Requirement

For each tool, search the web for 1-2 current, creative use cases that match this user's:
- Industry (creative agency / retail / advertising)
- Role (${responses.q3_role || 'Creative Professional'})
- Friction type (${(responses.q13_friction_types || []).join(', ') || 'workflow friction'})

Blend web-sourced ideas with base use cases. Prioritize novel applications over obvious ones.

## Response Rules
- Return ONLY valid JSON
- No markdown code fences
- No preamble or explanation
- No trailing text after JSON
- Response must be parseable by JSON.parse() directly

## Output Format

{
  "toolkit": [
    {
      "tool": "NotebookLM",
      "subtitle": "string (2-4 words)",
      "use_cases": [
        "string (action verb + specific task)",
        "string",
        "string"
      ],
      "why_this_matters": "string (one sentence with data reference)"
    },
    {
      "tool": "Claude / Gemini / ChatGPT / Perplexity",
      "subtitle": "string",
      "use_cases": ["string", "string", "string"],
      "why_this_matters": "string"
    },
    {
      "tool": "AI Studio",
      "subtitle": "string",
      "use_cases": ["string", "string", "string"],
      "why_this_matters": "string"
    },
    {
      "tool": "Claude Cowork",
      "subtitle": "string",
      "use_cases": ["string", "string", "string"],
      "why_this_matters": "string"
    },
    {
      "tool": "Custom Agents",
      "subtitle": "string",
      "use_cases": ["string", "string", "string"],
      "why_this_matters": "string"
    }
  ]
}`;
}

/**
 * Build the automation opportunities prompt
 */
function buildAutomationPrompt(
  responses: SurveyResponses,
  archetype: ArchetypeId
): string {
  return `You are an AI automation strategist identifying workflow automation opportunities for a creative agency employee.

## User Data
- Role: ${responses.q3_role || 'Creative Professional'}
- Primary Client: ${responses.q8_primary_client || 'Various clients'}
- Work Type: ${responses.q7_work_type || 'Mix of everything'}
- Top Friction Types: ${(responses.q13_friction_types || []).join(', ') || 'Various friction points'}
- Weekly Friction Hours: ${responses.q15_total_friction_hours || 0}
- Repeated Tasks: ${responses.q18_repeated_task || 'Not specified'}
- Handoff Pain Points: ${responses.q19_handoff_pain || 'Not specified'}
- Things Waiting on Others: ${responses.q19_handoff_pain || 'Not specified'}
- Notification Wishes: ${responses.q20_notification_wish || 'Not specified'}
- Manual Data Movement: ${responses.q21_data_movement || 'Not specified'}
- Tech Stack: ${(responses.q5_tools || []).join(', ') || 'Standard tools'}
- Tech Walls: ${(responses.q6_tech_walls || []).join(', ') || 'None specified'}
- Archetype: ${archetype}

## Instructions

### Step 1: Generate 5 Automation Opportunities

Based on the user's friction points, repeated tasks, and handoff pain, generate 5 specific automation opportunities.

Each automation must:
- Solve a real problem evident in their data
- Be technically feasible with no-code tools (Zapier, Make, n8n) or AI tools
- Reference their specific context (client names, tools, task types)
- Be described concretely, not abstractly

### Step 2: Select Top 3 by Impact

From the 5 candidates, select the 3 with highest potential impact based on:
- Time savings (reference their friction hours)
- Frequency (daily/weekly tasks beat monthly)
- Feasibility (can implement with their current tech stack)

### Step 3: Assign Complexity Tier

For each selected automation:

**Quick Win**
- Can implement this week
- Uses existing tools or simple Zapier/Make setup
- Minimal learning curve
- Examples: Slack notification, simple trigger, basic GPT prompt

**Project**
- Needs dedicated setup time (days to a week)
- May require new tool adoption or configuration
- Some learning required
- Examples: Custom GPT with docs, multi-step Make workflow, NotebookLM knowledge base

**Initiative**
- Requires workflow redesign or multi-tool integration
- May need stakeholder buy-in or process change
- Significant setup investment
- Examples: End-to-end asset pipeline, cross-team automation, custom internal app

### Ranking Criteria

Rank the 3 selected automations by:
1. Time savings potential (highest first)
2. Implementation speed (faster is better for equal savings)
3. User's AI readiness (match complexity to their comfort level)

## Response Rules
- Return ONLY valid JSON
- No markdown code fences
- No preamble or explanation
- No trailing text after JSON
- Response must be parseable by JSON.parse() directly

## Output Format

{
  "automations": [
    {
      "rank": 1,
      "title": "string (5 words max, descriptive)",
      "complexity": "Quick Win | Project | Initiative",
      "description": "string (one sentence: what it does + how it helps)",
      "tools": ["Tool 1", "Tool 2"],
      "friction_addressed": "string (which friction type from their data)"
    },
    {
      "rank": 2,
      "title": "string",
      "complexity": "string",
      "description": "string",
      "tools": ["string"],
      "friction_addressed": "string"
    },
    {
      "rank": 3,
      "title": "string",
      "complexity": "string",
      "description": "string",
      "tools": ["string"],
      "friction_addressed": "string"
    }
  ]
}`;
}

/**
 * Build the narrative prompt
 */
function buildNarrativePrompt(
  responses: SurveyResponses,
  archetype: ArchetypeId,
  toolkitRecommendations: ToolkitRecommendations
): string {
  return `You are an AI workflow consultant presenting audit findings to a creative agency employee.

## User Data
- Name: ${responses.q1_name || 'User'}
- Role: ${responses.q3_role || 'Creative Professional'}
- Primary Client: ${responses.q8_primary_client || 'Various clients'}
- Work Type: ${responses.q7_work_type || 'Mix of everything'}
- Top Friction Types: ${(responses.q13_friction_types || []).join(', ') || 'Various friction points'}
- Weekly Friction Hours: ${responses.q15_total_friction_hours || 0}
- Repeated Tasks: ${responses.q18_repeated_task || 'Not specified'}
- Handoff Pain Points: ${responses.q19_handoff_pain || 'Not specified'}
- Time Allocation: Creative ${responses.q16_time_allocation?.creative || 25}%, Production ${responses.q16_time_allocation?.production || 25}%, Communication ${responses.q16_time_allocation?.communication || 25}%, Admin ${responses.q16_time_allocation?.admin || 25}%
- AI Adoption Speed: ${responses.q27_adoption_speed || 'Pragmatist'}
- AI Flavors Used: ${(responses.q25_ai_flavors || []).join(', ') || 'None'}
- Sacred Elements: ${responses.q30_sacred || 'Not specified'}
- Magic Button Priority: ${responses.q33_magic_button || 'Speed'}
- Archetype: ${archetype}

## Toolkit Recommendations (from previous step)
${JSON.stringify(toolkitRecommendations, null, 2)}

## Instructions

Write a professional analysis that:

1. **Acknowledge Strength** (1 sentence)
   - Reference their role, archetype, or time allocation
   - Be specific, not generic flattery

2. **Name the Friction** (1-2 sentences)
   - Call out their specific friction types
   - Include hour counts for impact
   - Reference their client/context if relevant

3. **Propose the Shift** (1 sentence)
   - Based on their archetype, suggest a strategic transition
   - Frame it as moving FROM something TO something
   - Align with their magic button priority

4. **Core Recommendation** (1 sentence)
   - Must reference ONE specific tool from the toolkit recommendations
   - Pull a concrete use case from the toolkit output
   - Make it actionable ("Start with...", "Build a...", "Set up...")

## Tone

Professional and data-forward. Speak as a consultant presenting findings:
- Direct about inefficiencies without being harsh
- Reference specific data points (hours, client names, task types)
- Avoid cheerleading or excessive enthusiasm
- Respect their sacred elements—don't dismiss their values

## Archetype-Specific Framing

**Efficiency Specialist:** Focus on time savings, ROI, speed gains
**Workflow Architect:** Focus on systems thinking, scaling, automation potential
**Craft Guardian:** Acknowledge quality concerns, position AI as quality enhancer not replacer
**Curious Explorer:** Encouraging but practical, emphasize learning path
**Steady Guide:** Low-pressure, proven approaches, emphasize reliability
**Strategic Navigator:** Big picture, team impact, clarity and alignment

## Response Rules
- Return ONLY valid JSON
- No markdown code fences
- No preamble or explanation
- No trailing text after JSON
- Response must be parseable by JSON.parse() directly

## Output Format

{
  "narrative": "string (3-4 sentences, the analysis)",
  "core_recommendation": "string (1 sentence, actionable, references specific tool)"
}`;
}

/**
 * POST /api/generate
 * Generate AI recommendations for a completed survey
 */
export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse>> {
  const supabase = createSupabaseServerClient();

  try {
    // Parse request body
    const body = (await request.json()) as GenerateRequest;
    const { responseId } = body;

    if (!responseId) {
      return NextResponse.json(
        { success: false, error: 'responseId is required' },
        { status: 400 }
      );
    }

    // Fetch the survey response
    const { data: surveyResponseData, error: fetchError } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('id', responseId)
      .single();

    if (fetchError || !surveyResponseData) {
      return NextResponse.json(
        { success: false, error: 'Survey response not found' },
        { status: 404 }
      );
    }

    const surveyResponse = surveyResponseData as SurveyResponse;
    const responses = surveyResponse.responses as unknown as SurveyResponses;

    // Step 1: Calculate Archetype (synchronous, rule-based)
    console.log('Step 1: Calculating archetype...');
    const archetype = determineArchetype(responses);
    const archetypeDetails = getArchetypeScoringDetails(responses);
    console.log('Archetype determined:', archetype, archetypeDetails);

    // Step 2: Calculate Metrics (synchronous)
    console.log('Step 2: Calculating metrics...');
    const metrics = calculateAllMetrics(responses);
    console.log('Metrics calculated:', metrics);

    // Update survey_responses with archetype and metrics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('survey_responses')
      .update({
        archetype,
        weekly_friction_hours: metrics.weeklyFrictionHours,
        ai_readiness_score: metrics.aiReadinessScore,
        automation_potential: metrics.automationPotential,
      })
      .eq('id', responseId);

    if (updateError) {
      console.error('Error updating survey response:', updateError);
    }

    // Track partial results
    let toolkit: ToolkitRecommendations | null = null;
    let automations: AutomationOpportunities | null = null;
    let narrative: NarrativeOutput | null = null;
    let hasPartialResults = false;

    // Step 3: Generate Toolkit Recommendations (with web search)
    console.log('Step 3: Generating toolkit recommendations...');
    const toolkitPrompt = buildToolkitPrompt(responses, archetype);
    const toolkitResult = await generateJsonContent<ToolkitRecommendations>(toolkitPrompt, {
      useWebSearch: true,
      timeout: TIMEOUT_MS,
    });

    if (toolkitResult.success && toolkitResult.data) {
      toolkit = toolkitResult.data;
      console.log('Toolkit generated successfully');
    } else {
      console.error('Toolkit generation failed:', toolkitResult.error);
      toolkit = FALLBACK_TOOLKIT;
      hasPartialResults = true;
    }

    // Step 4: Generate Automation Opportunities
    console.log('Step 4: Generating automation opportunities...');
    const automationPrompt = buildAutomationPrompt(responses, archetype);
    const automationResult = await generateJsonContent<AutomationOpportunities>(
      automationPrompt,
      {
        useWebSearch: false,
        timeout: TIMEOUT_MS,
      }
    );

    if (automationResult.success && automationResult.data) {
      automations = automationResult.data;
      console.log('Automations generated successfully');
    } else {
      console.error('Automation generation failed:', automationResult.error);
      automations = FALLBACK_AUTOMATIONS;
      hasPartialResults = true;
    }

    // Step 5: Generate Narrative (uses toolkit output)
    console.log('Step 5: Generating narrative...');
    const narrativePrompt = buildNarrativePrompt(
      responses,
      archetype,
      toolkit || FALLBACK_TOOLKIT
    );
    const narrativeResult = await generateJsonContent<NarrativeOutput>(narrativePrompt, {
      useWebSearch: false,
      timeout: TIMEOUT_MS,
    });

    if (narrativeResult.success && narrativeResult.data) {
      narrative = narrativeResult.data;
      console.log('Narrative generated successfully');
    } else {
      console.error('Narrative generation failed:', narrativeResult.error);
      narrative = FALLBACK_NARRATIVE;
      hasPartialResults = true;
    }

    // Step 6: Store results in ai_outputs table
    console.log('Step 6: Storing AI outputs...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any).from('ai_outputs').insert({
      response_id: responseId,
      toolkit_recommendations: toolkit,
      automation_opportunities: automations,
      narrative: narrative?.narrative || null,
      core_recommendation: narrative?.core_recommendation || null,
    });

    if (insertError) {
      console.error('Error storing AI outputs:', insertError);
      // Continue anyway - we have the results to return
    }

    // Return complete results
    console.log('Generation pipeline complete');
    return NextResponse.json({
      success: true,
      data: {
        archetype,
        metrics,
        toolkit,
        automations,
        narrative,
      },
      partialResults: hasPartialResults,
    });
  } catch (error) {
    console.error('Generation pipeline error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate?responseId=xxx
 * Retrieve existing AI outputs for a survey response
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const supabase = createSupabaseServerClient();

  try {
    const { searchParams } = new URL(request.url);
    const responseId = searchParams.get('responseId');

    if (!responseId) {
      return NextResponse.json(
        { success: false, error: 'responseId is required' },
        { status: 400 }
      );
    }

    // Fetch existing AI outputs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: aiOutputData, error: fetchError } = await (supabase as any)
      .from('ai_outputs')
      .select('*')
      .eq('response_id', responseId)
      .single();

    if (fetchError || !aiOutputData) {
      return NextResponse.json(
        { success: false, error: 'AI outputs not found' },
        { status: 404 }
      );
    }

    const aiOutput = aiOutputData as AIOutput;

    // Also fetch the survey response for archetype and metrics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: surveyResponseData } = await (supabase as any)
      .from('survey_responses')
      .select('archetype, weekly_friction_hours, ai_readiness_score, automation_potential')
      .eq('id', responseId)
      .single();

    const surveyResponse = surveyResponseData as SurveyResponse | null;

    return NextResponse.json({
      success: true,
      data: {
        archetype: surveyResponse?.archetype,
        metrics: {
          weeklyFrictionHours: surveyResponse?.weekly_friction_hours,
          aiReadinessScore: surveyResponse?.ai_readiness_score,
          automationPotential: surveyResponse?.automation_potential,
        },
        toolkit: aiOutput.toolkit_recommendations,
        automations: aiOutput.automation_opportunities,
        narrative: {
          narrative: aiOutput.narrative,
          core_recommendation: aiOutput.core_recommendation,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching AI outputs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
