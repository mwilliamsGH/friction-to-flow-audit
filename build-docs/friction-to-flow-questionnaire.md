# Friction-to-Flow AI Audit
## Questionnaire Specification

**Version:** 1.0  
**Last Updated:** January 2026

---

## Related Documents

- `friction-to-flow-prd.md` - Product requirements and UI specifications
- `friction-to-flow-ai-toolkit-engine.md` - Recommendation engine prompts and tool definitions

---

## Table of Contents

1. [Survey Overview](#1-survey-overview)
2. [Section A: The Foundation](#2-section-a-the-foundation)
3. [Section B: The Friction](#3-section-b-the-friction)
4. [Section C: AI Sentiment](#4-section-c-ai-sentiment)
5. [Section D: The Magic Button](#5-section-d-the-magic-button)
6. [Archetype Scoring](#6-archetype-scoring)
7. [Calculated Metrics](#7-calculated-metrics)
8. [Implementation Notes](#8-implementation-notes)

---

## 1. Survey Overview

### 1.1 Structure

| Section | Name | Questions | Focus |
|---------|------|-----------|-------|
| A | The Foundation | 12 | Role, tools, tech walls, research habits |
| B | The Friction | 11 | Friction points, hours lost, handoffs, automation signals |
| C | AI Sentiment | 9 | Current usage, comfort level, concerns |
| D | The Magic Button | 4 | Priorities, aspirations, success definition |

**Total Questions:** 36

### 1.2 Estimated Completion Time

10-15 minutes

### 1.3 UX Requirements

- Progress bar displays sections (A / B / C / D), not question count
- Each section begins with an intro card (see section headers below)
- Auto-save on section navigation
- All multi-select questions include "Other (specify)" option
- Required fields validated before section progression

---

## 2. Section A: The Foundation

### Section Intro Card

> **Let's start with the basics.**
> 
> This section helps us understand who you are, what tools you use daily, and where technology helps—or gets in the way.

---

### Q1. Name

| Property | Value |
|----------|-------|
| Type | Text input |
| Required | Yes |
| Placeholder | "Your full name" |
| Validation | Min 2 characters |

---

### Q2. Email

| Property | Value |
|----------|-------|
| Type | Email input |
| Required | Yes |
| Placeholder | "you@autside.com" |
| Validation | Valid email format |

---

### Q3. What's your role?

| Property | Value |
|----------|-------|
| Type | Single select (dropdown) |
| Required | Yes |

**Options:**
- Production Designer
- Senior Production Designer
- Art Director
- Creative Director
- Account Coordinator
- Account Manager
- Account Director
- Media Production Specialist
- Studio Manager
- Founder / Leadership
- Other (specify)

---

### Q4. How long have you been in your current role?

| Property | Value |
|----------|-------|
| Type | Single select (radio) |
| Required | Yes |

**Options:**
- Less than 6 months
- 6 months – 1 year
- 1 – 2 years
- 2 – 5 years
- 5+ years

---

### Q5. What tools do you use daily?

| Property | Value |
|----------|-------|
| Type | Multi-select (checkboxes) |
| Required | Yes (min 1) |

**Options:**
- Adobe Photoshop
- Adobe Illustrator
- Adobe InDesign
- Adobe After Effects
- Adobe Premiere Pro
- Figma
- Canva
- Microsoft PowerPoint
- Microsoft Excel
- Google Slides
- Google Sheets
- Slack
- Microsoft Teams
- Asana
- Monday.com
- Frame.io
- Dropbox
- Google Drive
- Box
- Other (specify)

---

### Q6. Where do you hit a "Tech Wall"?

*Select any friction points you experience regularly.*

| Property | Value |
|----------|-------|
| Type | Multi-select (checkboxes) |
| Required | No |
| Conditional | Shows only tools selected in Q5 as potential wall sources |

**Options:**
- Adobe → PowerPoint conversions
- Receiving files in wrong formats
- Marking up approvals and revisions
- Searching the server for assets
- Version control confusion
- File naming inconsistencies
- Handoff miscommunication
- Software compatibility issues
- Other (specify)

---

### Q7. What type of work fills most of your day?

| Property | Value |
|----------|-------|
| Type | Single select (radio) |
| Required | Yes |

**Options:**
- Digital / Social content
- Print / In-store materials
- Video / Animation
- Presentation decks
- Brand development
- Campaign strategy
- Account / Client management
- Mix of everything

---

### Q8. Who is your primary client or account?

| Property | Value |
|----------|-------|
| Type | Text input |
| Required | No |
| Placeholder | "e.g., Nike, TD Bank, Northeast Grocers" |

---

### Q9. What slows you down most often?

| Property | Value |
|----------|-------|
| Type | Single select (radio) |
| Required | Yes |

**Options:**
- Waiting for assets or information
- Unclear briefs or requirements
- Too many revision rounds
- Technical/software issues
- Context switching between projects
- Approval bottlenecks
- Other (specify)

---

### Q10. When you figure something out, where does that knowledge go?

| Property | Value |
|----------|-------|
| Type | Single select (radio) |
| Required | Yes |

**Options:**
- I keep it in my head
- Personal notes (Notion, docs, etc.)
- Shared team documentation
- I teach it to others directly
- It doesn't go anywhere—I solve it again next time

---

### Q11. What do you find yourself Googling or asking colleagues about?

| Property | Value |
|----------|-------|
| Type | Textarea |
| Required | No |
| Placeholder | "e.g., file specs, brand guidelines, software shortcuts, client preferences..." |
| Max length | 500 characters |

**Purpose:** Surfaces research habits for NotebookLM/Perplexity/Gemini recommendations.

---

### Q12. How would you rate your current workload?

| Property | Value |
|----------|-------|
| Type | Slider |
| Required | Yes |
| Range | 1–10 |
| Labels | 1 = "Manageable" / 10 = "Overwhelming" |

---

## 3. Section B: The Friction

### Section Intro Card

> **Now let's talk about the friction.**
> 
> We're looking for the tasks that drain your energy—the repetitive work that feels like walking through mud. Be honest; this is where we find the opportunities.

---

### Q13. Which of these "friction loops" hit you hardest?

*Select all that apply.*

| Property | Value |
|----------|-------|
| Type | Multi-select (checkboxes) |
| Required | Yes (min 1) |

**Options:**

| Option | Description |
|--------|-------------|
| **The Pivot** | Last-minute satisfies that satisfies require reworking completed files |
| **The Asset Hunt** | Searching through folders, servers, or emails to find the right file |
| **The Versioning Loop** | Tracking changes across v1, v2, v2_final, v2_final_FINAL |
| **The Seasonal Rollout** | Adapting one asset across dozens of sizes, formats, or regions |
| **The Approval Chase** | Following up on reviews that sit in someone's inbox |
| **The Format Shuffle** | Converting between file types, color modes, or specs |
| **The Handoff Gap** | Miscommunication between teams or roles causing rework |
| Other (specify) | |

---

### Q14. How many hours per week does your worst friction loop consume?

| Property | Value |
|----------|-------|
| Type | Slider |
| Required | Yes |
| Range | 0–20 |
| Step | 0.5 |
| Labels | 0 = "None" / 20 = "20+ hours" |

---

### Q15. Roughly how many total hours per week do ALL friction loops consume?

| Property | Value |
|----------|-------|
| Type | Slider |
| Required | Yes |
| Range | 0–40 |
| Step | 1 |
| Labels | 0 = "None" / 40 = "40+ hours" |

---

### Q16. How do you spend your time? (Must total 100%)

*Drag sliders or enter percentages.*

| Property | Value |
|----------|-------|
| Type | Percentage allocation (4-way) |
| Required | Yes |
| Validation | Must sum to 100% |

**Categories:**
- Creative / Thinking
- Production / Execution
- Communication / Meetings
- Admin / Searching

---

### Q17. Describe a specific task that eats up your time.

| Property | Value |
|----------|-------|
| Type | Textarea |
| Required | No |
| Placeholder | "e.g., Every Monday I manually resize 40+ social banners for different platforms..." |
| Max length | 500 characters |

---

### Q18. What task do you do so often you could do it in your sleep?

| Property | Value |
|----------|-------|
| Type | Textarea |
| Required | No |
| Placeholder | "e.g., Exporting assets with specific naming conventions..." |
| Max length | 300 characters |

**Purpose:** Identifies candidates for Custom Agent automation.

---

### Q19. Where do things get stuck waiting on someone else?

| Property | Value |
|----------|-------|
| Type | Textarea |
| Required | No |
| Placeholder | "e.g., Creative review sits for 3+ days, client feedback delays..." |
| Max length | 300 characters |

**Purpose:** Identifies automation trigger points for notifications/escalations.

---

### Q20. What do you wish you got notified about automatically?

| Property | Value |
|----------|-------|
| Type | Textarea |
| Required | No |
| Placeholder | "e.g., When assets are uploaded, when approvals are pending, when deadlines approach..." |
| Max length | 300 characters |

**Purpose:** Identifies automation notification needs.

---

### Q21. What information do you manually move between tools?

| Property | Value |
|----------|-------|
| Type | Textarea |
| Required | No |
| Placeholder | "e.g., Copy data from emails into spreadsheets, update multiple trackers..." |
| Max length | 300 characters |

**Purpose:** Identifies automation data flow opportunities.

---

### Q22. Who else would benefit if your workflow was documented?

| Property | Value |
|----------|-------|
| Type | Single select (radio) |
| Required | Yes |

**Options:**
- Just me
- My immediate team
- Other departments
- New hires / Freelancers
- Everyone at the agency

---

### Q23. When you finish a project, how do you feel about the process?

| Property | Value |
|----------|-------|
| Type | Single select (radio) |
| Required | Yes |

**Options:**
- Proud of both the work and the process
- Happy with the output, frustrated with the process
- The process was fine, but I could've done better work
- Relieved it's over

---

## 4. Section C: AI Sentiment

### Section Intro Card

> **Let's talk about AI.**
> 
> No judgment here—whether you're a daily user or completely skeptical, we want to understand your honest perspective.

---

### Q24. How often do you currently use AI tools?

| Property | Value |
|----------|-------|
| Type | Single select (radio) |
| Required | Yes |

**Options:**
- Daily
- A few times a week
- A few times a month
- Rarely
- Never

---

### Q25. Which "AI flavors" have you tried?

*Select all that apply.*

| Property | Value |
|----------|-------|
| Type | Multi-select (checkboxes) |
| Required | No |

**Options:**
- **The Chat** – ChatGPT, Claude, Gemini for conversation/writing
- **The Canvas** – Image generation (Midjourney, DALL-E, Firefly)
- **The Voice** – Voice/video AI (ElevenLabs, Synthesia, Descript)
- **The Analyst** – Data analysis or spreadsheet AI
- **The Researcher** – Perplexity, Gemini, or AI-powered search
- **The Builder** – No-code tools, AI app builders, vibe coding
- None of these

---

### Q26. How would you rate your AI knowledge?

| Property | Value |
|----------|-------|
| Type | Slider |
| Required | Yes |
| Range | 1–10 |
| Labels | 1 = "What's a prompt?" / 10 = "I could teach a workshop" |

---

### Q27. When it comes to new tools and technology, you typically:

| Property | Value |
|----------|-------|
| Type | Single select (radio) |
| Required | Yes |

**Options:**
- Pioneer – I try everything first and figure it out
- Fast Follower – I jump in once I see it works
- Pragmatist – I adopt when there's clear proof of value
- Skeptic – I wait until it's mandatory or unavoidable

---

### Q28. What role should AI play in creative work?

| Property | Value |
|----------|-------|
| Type | Single select (radio) |
| Required | Yes |

**Options:**
- AI should handle as much as possible so I can focus on high-level thinking
- AI should assist, but humans should drive creative decisions
- AI should only handle purely mechanical/administrative tasks
- AI has no place in creative work

---

### Q29. What concerns you most about AI in the workplace?

*Select up to 3.*

| Property | Value |
|----------|-------|
| Type | Multi-select (checkboxes) |
| Required | No |
| Max selections | 3 |

**Options:**
- Brand accuracy and consistency
- Legal or copyright issues
- Losing the human touch
- Job security
- Client perception or pushback
- Data privacy
- Quality control
- Learning curve
- None—I'm excited about it
- Other (specify)

---

### Q30. What's "sacred" to you?

*What part of your work should stay human, no matter what?*

| Property | Value |
|----------|-------|
| Type | Textarea |
| Required | No |
| Placeholder | "e.g., Client relationships, final creative judgment, strategic thinking..." |
| Max length | 500 characters |

**Purpose:** Feeds the "Your Voice" pull quote and ensures recommendations respect boundaries.

---

### Q31. Are there any AI tools or prompts that already work well for you?

| Property | Value |
|----------|-------|
| Type | Textarea |
| Required | No |
| Placeholder | "e.g., I use ChatGPT for first-draft copy, Midjourney for mood boards..." |
| Max length | 300 characters |

---

### Q32. When you need to learn something new for work, you typically:

| Property | Value |
|----------|-------|
| Type | Single select (radio) |
| Required | Yes |

**Options:**
- Watch YouTube tutorials
- Read documentation or articles
- Ask a colleague to show me
- Jump in and figure it out through trial and error
- Take a structured course

**Purpose:** Calibrates tutorial recommendations and learning style indicator.

---

## 5. Section D: The Magic Button

### Section Intro Card

> **Last section—let's dream a little.**
> 
> If you could snap your fingers and change one thing about how you work, what would it be?

---

### Q33. If you could press a magic button, what would it give you?

| Property | Value |
|----------|-------|
| Type | Single select (radio) |
| Required | Yes |

**Options:**
- **Speed** – Get things done faster without sacrificing quality
- **Quality** – More time to craft and perfect my work
- **Organization** – Everything in its place, easy to find
- **Clarity** – Clear priorities, fewer surprises

---

### Q34. What task do you keep putting off because it's tedious?

| Property | Value |
|----------|-------|
| Type | Textarea |
| Required | No |
| Placeholder | "e.g., Organizing my files, updating project trackers, cleaning up old versions..." |
| Max length | 300 characters |

---

### Q35. If AI gave you 5-10 extra hours per week, what would you do with them?

| Property | Value |
|----------|-------|
| Type | Textarea |
| Required | No |
| Placeholder | "e.g., More concept exploration, learning new skills, better work-life balance..." |
| Max length | 300 characters |

---

### Q36. How would you define "AI success" for yourself?

| Property | Value |
|----------|-------|
| Type | Single select (radio) |
| Required | Yes |

**Options:**
- I get more done in less time
- The quality of my work improves
- I spend less time on tasks I don't enjoy
- I learn new skills and stay relevant
- I achieve better work-life balance

---

## 6. Archetype Scoring

### 6.1 Overview

Archetype assignment is **rule-based** (deterministic), not AI-generated. The same inputs will always produce the same archetype.

### 6.2 Scoring Factors

| Factor | Source | Weight |
|--------|--------|--------|
| AI Flavor Range | Q25 (count of selections) | High |
| Friction Profile | Q13 (which friction types selected) | High |
| Handoff Pain | Q19 (presence of content) | High |
| Automation Signals | Q20 + Q21 (presence of content) | High |
| Repeated Tasks | Q18 (presence of content) | High |
| Tech Wall Friction | Q6 (count and types) | Medium |
| Adoption Speed | Q27 | Medium |
| AI Concerns | Q29 (types selected) | Medium |
| Magic Button Priority | Q33 | Medium |
| Sacred Response | Q30 (length and content) | Medium |
| Research Habits | Q11 (presence of content) | Low |
| Learning Style | Q32 | Low |

### 6.3 Archetype Definitions and Rules

#### Efficiency Specialist

**Profile:** High friction hours, speed priority, production-focused

**Primary Signals:**
- Q13 includes "The Pivot" OR "The Seasonal Rollout" OR "The Format Shuffle"
- Q14 ≥ 6 hours (worst friction)
- Q15 ≥ 12 hours (total friction)
- Q33 = "Speed"

**Secondary Signals:**
- Q7 = "Digital / Social content" OR "Print / In-store materials"
- Q16 Production/Execution ≥ 40%

**Score Threshold:** 3+ primary signals OR (2 primary + 2 secondary)

---

#### Workflow Architect

**Profile:** Pioneer adopter, uses multiple AI flavors, sees automation opportunities

**Primary Signals:**
- Q27 = "Pioneer" OR "Fast Follower"
- Q25 count ≥ 3 AI flavors
- Q20 OR Q21 has substantive content (≥ 30 characters)
- Q26 ≥ 6 (AI knowledge)

**Secondary Signals:**
- Q28 = "AI should handle as much as possible..."
- Q18 has substantive content (repeated task identified)
- Q10 = "Shared team documentation"

**Score Threshold:** 3+ primary signals OR (2 primary + 2 secondary)

---

#### Craft Guardian

**Profile:** Quality-focused, human touch concerns, protective of creative process

**Primary Signals:**
- Q30 has substantive content (≥ 50 characters)
- Q29 includes "Losing the human touch"
- Q33 = "Quality"
- Q28 = "AI should only handle purely mechanical/administrative tasks" OR "AI has no place in creative work"

**Secondary Signals:**
- Q7 = "Brand development" OR "Campaign strategy"
- Q23 = "Proud of both the work and the process"
- Q29 includes "Brand accuracy and consistency"

**Score Threshold:** 3+ primary signals OR (2 primary + 2 secondary)

---

#### Curious Explorer

**Profile:** Interested but early stage, uses chat AI only, learning-oriented

**Primary Signals:**
- Q24 = "A few times a month" OR "Rarely"
- Q25 = only "The Chat" selected (or empty)
- Q26 ≤ 4 (AI knowledge)
- Q36 = "I learn new skills and stay relevant"

**Secondary Signals:**
- Q27 = "Pragmatist"
- Q32 = "Watch YouTube tutorials" OR "Take a structured course"
- Q29 includes "Learning curve"

**Score Threshold:** 3+ primary signals OR (2 primary + 2 secondary)

---

#### Steady Guide

**Profile:** Adopts when mandatory, prefers known tools, organization priority

**Primary Signals:**
- Q27 = "Skeptic" OR "Pragmatist"
- Q33 = "Organization"
- Q24 = "Rarely" OR "Never"
- Q10 = "I keep it in my head" OR "It doesn't go anywhere—I solve it again next time"

**Secondary Signals:**
- Q25 count ≤ 1 AI flavor
- Q28 = "AI should assist, but humans should drive creative decisions"
- Q4 = "2 – 5 years" OR "5+ years" (tenure)

**Score Threshold:** 3+ primary signals OR (2 primary + 2 secondary)

---

#### Strategic Navigator

**Profile:** Leadership role, balanced profile, clarity priority

**Primary Signals:**
- Q3 includes "Director" OR "Manager" OR "Founder / Leadership"
- Q33 = "Clarity"
- Q22 = "Other departments" OR "Everyone at the agency"

**Secondary Signals:**
- Q16 Communication/Meetings ≥ 25%
- Q7 = "Campaign strategy" OR "Account / Client management" OR "Mix of everything"
- Q36 = "I achieve better work-life balance" OR "The quality of my work improves"
- Q13 includes "The Approval Chase" OR "The Handoff Gap"

**Score Threshold:** 2+ primary signals OR (1 primary + 3 secondary)

---

### 6.4 Conflict Resolution

If a user qualifies for multiple archetypes:

1. **Highest match wins** - Count total matching signals (primary × 2 + secondary × 1)
2. **Tie-breaker priority:**
   1. Workflow Architect (highest potential for AI adoption)
   2. Strategic Navigator (leadership visibility)
   3. Efficiency Specialist (clear ROI opportunity)
   4. Craft Guardian (important to respect boundaries)
   5. Curious Explorer (growth potential)
   6. Steady Guide (default)

### 6.5 Fallback

If no archetype reaches threshold: **Curious Explorer** (neutral, growth-oriented)

---

## 7. Calculated Metrics

These metrics appear in the dashboard header and are calculated from survey responses.

### 7.1 Weekly Friction Hours

**Source:** Q14 + Q15

**Calculation:**
```
weekly_friction_hours = Q15 (total friction hours)
```

**Display:** `XX.Xh` (e.g., "14.5h")

---

### 7.2 AI Readiness Score

**Source:** Q24, Q25, Q26, Q27

**Calculation:**
```
usage_score = {
  "Daily": 25,
  "A few times a week": 20,
  "A few times a month": 15,
  "Rarely": 10,
  "Never": 0
}[Q24]

flavor_score = min(Q25.count * 5, 25)  # Max 25 points for 5+ flavors

knowledge_score = Q26 * 2.5  # 1-10 → 2.5-25 points

adoption_score = {
  "Pioneer": 25,
  "Fast Follower": 20,
  "Pragmatist": 12,
  "Skeptic": 5
}[Q27]

ai_readiness = usage_score + flavor_score + knowledge_score + adoption_score
# Range: 0-100
```

**Display:** `XX%` (e.g., "84%")

---

### 7.3 Automation Potential Score

**Source:** Q18, Q19, Q20, Q21

**Calculation:**
```
has_repeated_task = len(Q18) >= 20  # 20+ characters
has_handoff_pain = len(Q19) >= 20
has_notification_wish = len(Q20) >= 20
has_data_movement = len(Q21) >= 20

signals_count = sum([has_repeated_task, has_handoff_pain, has_notification_wish, has_data_movement])

automation_potential = signals_count * 25  # Each signal = 25%
# Range: 0-100
```

**Display:** `XX%` (e.g., "75%")

---

## 8. Implementation Notes

### 8.1 Question Numbering

Questions are numbered sequentially (Q1-Q36) across all sections. No sub-numbering (e.g., Q11.5) is used.

### 8.2 Conditional Logic

| Condition | Behavior |
|-----------|----------|
| Q6 (Tech Walls) | Only shows tools selected in Q5 as potential friction sources |

### 8.3 Validation Rules

| Rule | Questions Affected |
|------|-------------------|
| Required | Q1, Q2, Q3, Q4, Q5, Q7, Q9, Q10, Q12, Q13, Q14, Q15, Q16, Q22, Q23, Q24, Q26, Q27, Q28, Q32, Q33, Q36 |
| Min selections | Q5 (min 1), Q13 (min 1) |
| Max selections | Q29 (max 3) |
| Sum to 100% | Q16 |
| Email format | Q2 |
| Min characters | Q1 (min 2) |

### 8.4 Data Storage

All responses stored in `survey_responses.responses` as JSONB with keys matching question IDs:

```json
{
  "q1_name": "string",
  "q2_email": "string",
  "q3_role": "string",
  "q4_tenure": "string",
  "q5_tools": ["array", "of", "strings"],
  "q6_tech_walls": ["array", "of", "strings"],
  "q7_work_type": "string",
  "q8_primary_client": "string",
  "q9_slowdown": "string",
  "q10_knowledge_storage": "string",
  "q11_research_habits": "string",
  "q12_workload": 7,
  "q13_friction_types": ["array", "of", "strings"],
  "q14_worst_friction_hours": 6.5,
  "q15_total_friction_hours": 14,
  "q16_time_allocation": {
    "creative": 25,
    "production": 45,
    "communication": 20,
    "admin": 10
  },
  "q17_specific_task": "string",
  "q18_repeated_task": "string",
  "q19_handoff_pain": "string",
  "q20_notification_wish": "string",
  "q21_data_movement": "string",
  "q22_documentation_benefit": "string",
  "q23_process_feeling": "string",
  "q24_ai_frequency": "string",
  "q25_ai_flavors": ["array", "of", "strings"],
  "q26_ai_knowledge": 7,
  "q27_adoption_speed": "string",
  "q28_ai_role": "string",
  "q29_ai_concerns": ["array", "of", "strings"],
  "q30_sacred": "string",
  "q31_working_ai_tools": "string",
  "q32_learning_style": "string",
  "q33_magic_button": "string",
  "q34_tedious_task": "string",
  "q35_extra_time": "string",
  "q36_ai_success": "string"
}
```

### 8.5 Section Progress

| Section | Questions |
|---------|-----------|
| A: The Foundation | Q1 – Q12 |
| B: The Friction | Q13 – Q23 |
| C: AI Sentiment | Q24 – Q32 |
| D: The Magic Button | Q33 – Q36 |

### 8.6 UI Copy Tone

- Conversational and warm, not corporate
- Use "you" and "your" directly
- Section intros set context and reduce anxiety
- Placeholders provide concrete examples
- Avoid jargon; explain terms where needed

---

*End of Questionnaire Specification*
