# Friction-to-Flow AI Audit
## AI Toolkit Engine Specification

**Version:** 1.0  
**Last Updated:** January 2026

---

## Related Documents

- `friction-to-flow-prd.md` - Product requirements and UI specifications
- `friction-to-flow-questionnaire.md` - Survey questions and archetype scoring

---

## Table of Contents

1. [Overview](#1-overview)
2. [Generation Pipeline](#2-generation-pipeline)
3. [Tool Definitions](#3-tool-definitions)
4. [Prompt 1: Toolkit Recommendations](#4-prompt-1-toolkit-recommendations)
5. [Prompt 2: Automation Opportunities](#5-prompt-2-automation-opportunities)
6. [Prompt 3: Evolutionary Narrative](#6-prompt-3-evolutionary-narrative)
7. [Output Schemas](#7-output-schemas)
8. [Configuration & Updates](#8-configuration--updates)
9. [Error Handling](#9-error-handling)

---

## 1. Overview

### 1.1 Purpose

The AI Toolkit Engine generates personalized recommendations for each user based on their survey responses. It produces three outputs:

1. **Toolkit Recommendations** - 5 tool cards with tailored use cases
2. **Automation Opportunities** - 3 ranked automation projects
3. **Evolutionary Narrative** - Personalized analysis with core recommendation

### 1.2 AI Provider

**Primary:** Google Gemini (with web search capability)

Gemini is required for Prompt 1 (Toolkit Recommendations) due to the web search requirement for current use cases. Prompts 2 and 3 can use Gemini or Claude.

### 1.3 Design Principles

- **Deterministic where possible** - Archetype scoring is rule-based, not AI
- **Specific over generic** - Reference user's actual data (client names, hour counts, tools)
- **Actionable** - Every recommendation should be something they can do this week
- **Respectful** - Honor "sacred" elements; don't recommend automating what they want human

---

## 2. Generation Pipeline

### 2.1 Sequence

```
Survey Completed
       │
       ▼
┌──────────────────────────────────────┐
│ Step 1: Calculate Archetype          │
│ ─────────────────────────────────────│
│ Input: Survey responses              │
│ Process: Rule-based scoring          │
│ Output: archetype (string)           │
│ Duration: < 100ms                    │
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Step 2: Generate Toolkit Recs        │
│ ─────────────────────────────────────│
│ Input: Survey responses + archetype  │
│ Process: Gemini API + web search     │
│ Output: toolkit_recommendations      │
│ Duration: 5-10 seconds               │
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Step 3: Generate Automation Opps     │
│ ─────────────────────────────────────│
│ Input: Survey responses + archetype  │
│ Process: Gemini/Claude API           │
│ Output: automation_opportunities     │
│ Duration: 3-5 seconds                │
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Step 4: Generate Narrative           │
│ ─────────────────────────────────────│
│ Input: Survey responses + archetype  │
│        + toolkit_recommendations     │
│ Process: Gemini/Claude API           │
│ Output: narrative + core_rec         │
│ Duration: 2-3 seconds                │
└──────────────────────────────────────┘
       │
       ▼
Store All Outputs → Dashboard Ready
```

### 2.2 Total Generation Time

Target: < 20 seconds total

### 2.3 Failure Handling

If any step fails:
1. Retry once with exponential backoff
2. If retry fails, store partial results and flag for manual review
3. Display dashboard with available data; show "Generating..." for pending sections

---

## 3. Tool Definitions

### 3.1 The 5 Tools

These definitions provide context for AI prompts and serve as the source of truth for tool capabilities.

---

#### Tool 1: NotebookLM

**Category:** RAG Research Hub

**What It Does:**
NotebookLM lets users upload documents (PDFs, docs, websites) and interact with them through AI. It can answer questions about the content, generate summaries, and create various outputs from the source material.

**Key Capabilities:**
- Upload and query documents (brand guidelines, past work, client briefs)
- Generate Audio Overviews (podcast-style summaries)
- Create mind maps from complex documents
- Build FAQ sections from source material
- Cross-reference multiple documents
- Generate study guides and briefing docs

**Best For:**
- Looking up brand guidelines and specifications
- Onboarding freelancers or new team members
- Creating briefings from lengthy documents
- Building searchable knowledge bases
- Answering "what did the client say about X?" questions

**Tutorial URL:** `[YOUTUBE_LINK_NOTEBOOKLM]`

---

#### Tool 2: Claude / Gemini / ChatGPT / Perplexity

**Category:** General AI Assistants

**What It Does:**
Conversational AI tools for writing, research, brainstorming, and analysis. Each has strengths:

| Tool | Best For |
|------|----------|
| **Claude** | Long-form writing, nuanced editing, complex documents (200K+ token context) |
| **ChatGPT** | Creative content, image generation (DALL-E), memory across sessions |
| **Gemini** | Deep research with citations, Google Workspace integration, current information |
| **Perplexity** | Quick research with sources, fact-checking, real-time data |

**Key Capabilities:**
- Draft and edit written content (emails, proposals, briefs)
- Brainstorm concepts and campaign ideas
- Research competitors, trends, industry data
- Generate images (ChatGPT, Gemini)
- Analyze data and create summaries
- Translate and localize content

**Best For:**
- First drafts of client communications
- Research and competitive analysis
- Brainstorming sessions
- Quick fact-finding with citations
- Polishing and editing existing content

**Tutorial URL:** `[YOUTUBE_LINK_CHAT_AI]`

---

#### Tool 3: AI Studio (Vibe Coding)

**Category:** Custom Utility Builder

**What It Does:**
AI Studio (Google) allows users to build functional web applications by describing what they want in natural language. No traditional coding required—describe the tool, and AI generates working code.

**Key Capabilities:**
- Build internal tools (calculators, checkers, converters)
- Create workflow utilities (naming convention validators, spec checkers)
- Generate landing pages and prototypes
- Build data visualization dashboards
- Create client-facing demos quickly
- Annotation mode: point at elements and describe changes

**Best For:**
- "I wish I had a tool that..." situations
- Repetitive calculations or checks
- Quick prototypes for client presentations
- Internal utilities the team would use daily
- Solving specific workflow bottlenecks

**Example Tools to Build:**
- Asset naming convention checker
- Print spec calculator (DPI, bleed, color mode)
- Social media size converter
- Brand color palette validator
- Project deadline calculator

**Tutorial URL:** `[YOUTUBE_LINK_AI_STUDIO]`

---

#### Tool 4: Claude Cowork

**Category:** Desktop Agent for File Operations

**What It Does:**
Claude Cowork is a desktop application that can interact with your local files, browser, and applications. It performs actual work—renaming files, creating documents, extracting data—not just providing instructions.

**Key Capabilities:**
- Batch rename hundreds of files with consistent naming
- Convert documents (notes → Word, meeting notes → PowerPoint)
- Extract data from images, PDFs, screenshots
- Organize files by client, campaign, date
- Create formatted documents from raw input
- Browser automation (navigate, fill forms, post content)
- Record workflows and repeat them

**Best For:**
- File organization and cleanup
- Batch processing repetitive tasks
- Converting between document formats
- Data extraction from messy sources
- Tasks that require touching many files

**Key Differentiator:** Actually DOES the work, not just tells you how.

**Tutorial URL:** `[YOUTUBE_LINK_CLAUDE_COWORK]`

---

#### Tool 5: Custom Agents (Projects / GPTs / Gems)

**Category:** Personalized AI Assistants

**What It Does:**
Custom agents are AI assistants configured with specific instructions and knowledge for repeated workflows. Upload reference documents, set behavior rules, and the agent consistently performs that specialized task.

**Platforms:**
| Platform | Best For |
|----------|----------|
| **Claude Projects** | Deep document analysis, team collaboration, long context |
| **Custom GPTs** | Sharing (GPT Store), external API connections |
| **Gemini Gems** | Google Workspace integration, live Drive sync, 1M token context |

**Key Capabilities:**
- Brand voice assistant (always writes in client's tone)
- Client-specific expert (upload all their requirements)
- Email template generator (your style + context)
- Brief generator (key details → formatted output)
- Quality checker (review against uploaded standards)
- Meeting prep assistant (past notes → next meeting prep)

**Best For:**
- Any task you do repeatedly with the same context
- Maintaining consistency across team members
- Client-specific requirements and preferences
- Onboarding (new hire Q&A from uploaded SOPs)
- Quality control against documented standards

**Tutorial URL:** `[YOUTUBE_LINK_CUSTOM_AGENTS]`

---

### 3.2 No-Code Automation (Covered in Magic Button Only)

**Note:** No-code automation tools (Zapier, Make, n8n) are NOT included in the 5 toolkit cards. They appear only in the Magic Button automation opportunities section.

**Capabilities for Prompt 2 context:**
- Trigger-based workflows (file uploaded → notify team)
- Scheduled automations (end of week → compile report)
- Multi-step sequences (approval received → update tracker → notify client)
- Cross-tool data sync (spreadsheet → CRM → Slack)
- Conditional logic (if urgent → escalate, else → queue)

---

## 4. Prompt 1: Toolkit Recommendations

### 4.1 Purpose

Generate personalized use cases for all 5 tools based on user's friction profile.

### 4.2 Prompt Template

```
You are an AI toolkit advisor creating personalized recommendations for a creative agency employee. You must recommend ALL 5 tools with use cases tailored to their specific workflow friction.

## User Data
- Name: {{name}}
- Role: {{role}}
- Primary Client: {{primary_client}}
- Work Type: {{work_type}}
- Top Friction Types: {{friction_types}}
- Weekly Friction Hours: {{weekly_friction_hours}}
- Repeated Tasks: {{repeated_task}}
- Handoff Pain Points: {{handoff_pain}}
- Manual Data Movement: {{data_movement}}
- Notification Wishes: {{notification_wish}}
- Tech Stack: {{tools}}
- Tech Walls: {{tech_walls}}
- AI Adoption Speed: {{adoption_speed}}
- AI Flavors Used: {{ai_flavors}}
- AI Knowledge Level: {{ai_knowledge}} / 10
- Learning Style: {{learning_style}}
- Sacred Elements: {{sacred}}
- Archetype: {{archetype}}

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
- Role ({{role}})
- Friction type ({{friction_types}})

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
}
```

### 4.3 Example Output

```json
{
  "toolkit": [
    {
      "tool": "NotebookLM",
      "subtitle": "Nike Brand Intelligence",
      "use_cases": [
        "Upload all Nike brand guidelines to instantly answer spec questions instead of hunting through PDFs",
        "Generate audio briefings for freelancers joining seasonal rollout projects",
        "Build searchable archive of past Nike campaign rationales for reference during pivots"
      ],
      "why_this_matters": "Eliminates the 3.8 hours you spend weekly hunting for asset specifications and brand guidelines."
    },
    {
      "tool": "Claude / Gemini / ChatGPT / Perplexity",
      "subtitle": "Research & First Drafts",
      "use_cases": [
        "Use Perplexity to quickly find current retail signage trends with citations for Nike briefs",
        "Draft client status emails in Claude—paste rough notes, get polished copy in your voice",
        "Generate quick mockup variations in ChatGPT before committing to full production"
      ],
      "why_this_matters": "Reduces the context-switching overhead that's currently fragmenting your production time."
    },
    {
      "tool": "AI Studio",
      "subtitle": "Resizing Utility Builder",
      "use_cases": [
        "Build a Nike social banner resizer that outputs all 12 formats from one master file",
        "Create a print spec calculator that validates DPI, bleed, and color mode before handoff",
        "Build an internal tool that checks file naming against Nike's convention requirements"
      ],
      "why_this_matters": "Directly addresses your 6.5 hours weekly on format conversion and seasonal rollouts."
    },
    {
      "tool": "Claude Cowork",
      "subtitle": "Batch Asset Processing",
      "use_cases": [
        "Rename thousands of Nike assets with consistent client_campaign_size_version naming",
        "Extract delivery specs from messy email briefs into structured spreadsheets",
        "Organize your project folders by sorting files into client/campaign/date structure automatically"
      ],
      "why_this_matters": "Handles the repetitive file tasks you mentioned doing 'in your sleep'—freeing you for actual creative work."
    },
    {
      "tool": "Custom Agents",
      "subtitle": "Nike Compliance Expert",
      "use_cases": [
        "Build a 'Nike Asset Sentinel' GPT with all brand guidelines to check work before final render",
        "Create a brief generator that formats your rough notes into Nike's required brief template",
        "Set up a meeting prep agent that pulls relevant past Nike decisions before client calls"
      ],
      "why_this_matters": "Gives you a consistent quality check without the 4.2 hours spent chasing approvals and revisions."
    }
  ]
}
```

---

## 5. Prompt 2: Automation Opportunities

### 5.1 Purpose

Generate 5 potential automations, select top 3, and assign complexity tiers.

### 5.2 Prompt Template

```
You are an AI automation strategist identifying workflow automation opportunities for a creative agency employee.

## User Data
- Role: {{role}}
- Primary Client: {{primary_client}}
- Work Type: {{work_type}}
- Top Friction Types: {{friction_types}}
- Weekly Friction Hours: {{weekly_friction_hours}}
- Repeated Tasks: {{repeated_task}}
- Handoff Pain Points: {{handoff_pain}}
- Things Waiting on Others: {{handoff_pain}}
- Notification Wishes: {{notification_wish}}
- Manual Data Movement: {{data_movement}}
- Tech Stack: {{tools}}
- Tech Walls: {{tech_walls}}
- Archetype: {{archetype}}

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
}
```

### 5.3 Example Output

```json
{
  "automations": [
    {
      "rank": 1,
      "title": "Instant Asset Adaptation",
      "complexity": "Project",
      "description": "One-click resizing for Nike social banners that automatically adapts layout, typography, and safe zones across 12 formats using AI Studio.",
      "tools": ["AI Studio", "Claude Cowork"],
      "friction_addressed": "The Seasonal Rollout"
    },
    {
      "rank": 2,
      "title": "Approval Reminder Bot",
      "complexity": "Quick Win",
      "description": "Auto-ping stakeholders when assets await approval for 24+ hours, escalating to their manager after 48 hours.",
      "tools": ["Zapier", "Slack"],
      "friction_addressed": "The Approval Chase"
    },
    {
      "rank": 3,
      "title": "Brand Compliance Agent",
      "complexity": "Initiative",
      "description": "RAG-powered agent that scans 2,000+ pages of Nike brand guidelines to answer technical compliance questions instantly before handoff.",
      "tools": ["NotebookLM", "Custom GPT"],
      "friction_addressed": "The Asset Hunt"
    }
  ]
}
```

---

## 6. Prompt 3: Evolutionary Narrative

### 6.1 Purpose

Generate personalized 3-4 sentence analysis with a core recommendation pulled from the toolkit.

### 6.2 Prompt Template

```
You are an AI workflow consultant presenting audit findings to a creative agency employee.

## User Data
- Name: {{name}}
- Role: {{role}}
- Primary Client: {{primary_client}}
- Work Type: {{work_type}}
- Top Friction Types: {{friction_types}}
- Weekly Friction Hours: {{weekly_friction_hours}}
- Repeated Tasks: {{repeated_task}}
- Handoff Pain Points: {{handoff_pain}}
- Time Allocation: {{time_allocation}}
- AI Adoption Speed: {{adoption_speed}}
- AI Flavors Used: {{ai_flavors}}
- Sacred Elements: {{sacred}}
- Magic Button Priority: {{magic_button}}
- Archetype: {{archetype}}

## Toolkit Recommendations (from previous step)
{{toolkit_recommendations}}

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
}
```

### 6.3 Example Output

```json
{
  "narrative": "Your audit indicates high technical proficiency with significant friction in asset management workflows. Manual handoffs during Nike Global production sprints represent your primary efficiency gap, consuming approximately 6.5 hours weekly in format conversion alone. Your time allocation shows 45% in production execution—well above the creative work you're optimized for. To bridge the gap between your current output and your potential as a Workflow Architect, the focus should shift from reactive file processing to proactive media governance.",
  "core_recommendation": "Start with AI Studio to build a Nike social banner resizer that outputs all 12 formats from one master file—directly addressing your seasonal rollout friction."
}
```

---

## 7. Output Schemas

### 7.1 Toolkit Recommendations Schema

```typescript
interface ToolkitRecommendations {
  toolkit: ToolCard[];
}

interface ToolCard {
  tool: string;           // One of the 5 tool names
  subtitle: string;       // 2-4 word personalized descriptor
  use_cases: string[];    // Exactly 3 bullet points
  why_this_matters: string; // One sentence with data reference
}
```

### 7.2 Automation Opportunities Schema

```typescript
interface AutomationOpportunities {
  automations: Automation[];
}

interface Automation {
  rank: number;           // 1, 2, or 3
  title: string;          // 5 words max
  complexity: "Quick Win" | "Project" | "Initiative";
  description: string;    // One sentence
  tools: string[];        // Tools involved
  friction_addressed: string; // Which friction type this solves
}
```

### 7.3 Narrative Schema

```typescript
interface NarrativeOutput {
  narrative: string;          // 3-4 sentences
  core_recommendation: string; // 1 actionable sentence
}
```

---

## 8. Configuration & Updates

### 8.1 Tutorial URLs

Tutorial URLs are stored in the `tool_config` database table and injected into toolkit output after AI generation.

**To update a tutorial URL:**

1. Update the `tool_config` table:
```sql
UPDATE tool_config 
SET tutorial_url = 'https://youtube.com/watch?v=NEW_VIDEO_ID',
    updated_at = NOW()
WHERE tool_name = 'NotebookLM';
```

2. New surveys will use the updated URL immediately.

**Current placeholders:**
| Tool | Config Key |
|------|------------|
| NotebookLM | `[YOUTUBE_LINK_NOTEBOOKLM]` |
| Claude/Gemini/ChatGPT/Perplexity | `[YOUTUBE_LINK_CHAT_AI]` |
| AI Studio | `[YOUTUBE_LINK_AI_STUDIO]` |
| Claude Cowork | `[YOUTUBE_LINK_CLAUDE_COWORK]` |
| Custom Agents | `[YOUTUBE_LINK_CUSTOM_AGENTS]` |

### 8.2 Base Use Cases

Base use cases in Prompt 1 serve as examples and fallbacks. To update:

1. Edit the prompt template in the codebase
2. Modify the "Base Use Cases Reference" section
3. Deploy updated code

**When to update base use cases:**
- New tool features released
- New common workflows discovered
- User feedback indicates gaps

### 8.3 Tool Definitions

If tool capabilities change significantly:

1. Update Section 3 of this document
2. Update the tool descriptions in Prompt 1
3. Consider if archetype scoring logic needs adjustment

### 8.4 Adding a New Tool

To add a 6th tool (or replace an existing one):

1. Add tool definition to Section 3
2. Update Prompt 1:
   - Add to "The 5 Tools" list
   - Add base use cases
   - Update output format to include 6 tools
3. Add `tool_config` entry for tutorial URL
4. Update PRD UI specs for 6 cards

---

## 9. Error Handling

### 9.1 JSON Parse Failures

If AI returns invalid JSON:

1. Log the raw response for debugging
2. Retry with same prompt (sometimes transient)
3. If retry fails, attempt to extract JSON from markdown code fences
4. If still failing, use fallback content

### 9.2 Fallback Content

**Toolkit fallback:** Generic recommendations based on archetype only (no personalization)

```json
{
  "toolkit": [
    {
      "tool": "NotebookLM",
      "subtitle": "Research Hub",
      "use_cases": [
        "Upload brand guidelines for quick reference",
        "Generate audio summaries of lengthy documents",
        "Build searchable knowledge base for your team"
      ],
      "why_this_matters": "Reduces time spent searching for information."
    }
    // ... generic entries for other tools
  ]
}
```

**Automation fallback:** Three generic automations

```json
{
  "automations": [
    {
      "rank": 1,
      "title": "Approval Reminder System",
      "complexity": "Quick Win",
      "description": "Automated notifications when items await approval for more than 24 hours.",
      "tools": ["Zapier", "Slack"],
      "friction_addressed": "Approval delays"
    }
    // ... 2 more generic automations
  ]
}
```

**Narrative fallback:** Generic archetype-based message

```json
{
  "narrative": "Based on your audit responses, you have opportunities to reduce workflow friction through targeted AI tool adoption. Your current friction points are common in creative agency environments and addressable with the right toolkit.",
  "core_recommendation": "Start by exploring the toolkit recommendations below to find the best fit for your workflow."
}
```

### 9.3 Timeout Handling

If generation exceeds 30 seconds per step:

1. Cancel the request
2. Use fallback content
3. Flag for async regeneration
4. Notify user: "Some recommendations are still generating. Check back in a few minutes."

### 9.4 Rate Limiting

If API rate limits are hit:

1. Queue the generation request
2. Process when capacity available
3. Notify user of delay
4. Consider caching common archetype patterns

---

## Appendix A: Variable Reference

### User Data Variables (from survey responses)

| Variable | Source | Type |
|----------|--------|------|
| `{{name}}` | Q1 | string |
| `{{role}}` | Q3 | string |
| `{{primary_client}}` | Q8 | string |
| `{{work_type}}` | Q7 | string |
| `{{friction_types}}` | Q13 | array |
| `{{weekly_friction_hours}}` | Q15 | number |
| `{{repeated_task}}` | Q18 | string |
| `{{handoff_pain}}` | Q19 | string |
| `{{notification_wish}}` | Q20 | string |
| `{{data_movement}}` | Q21 | string |
| `{{tools}}` | Q5 | array |
| `{{tech_walls}}` | Q6 | array |
| `{{adoption_speed}}` | Q27 | string |
| `{{ai_flavors}}` | Q25 | array |
| `{{ai_knowledge}}` | Q26 | number |
| `{{learning_style}}` | Q32 | string |
| `{{sacred}}` | Q30 | string |
| `{{magic_button}}` | Q33 | string |
| `{{time_allocation}}` | Q16 | object |
| `{{archetype}}` | Calculated | string |

### Calculated Variables

| Variable | Source |
|----------|--------|
| `{{archetype}}` | Rule-based scoring (see questionnaire.md) |
| `{{toolkit_recommendations}}` | Output from Prompt 1 |

---

*End of AI Toolkit Engine Specification*
