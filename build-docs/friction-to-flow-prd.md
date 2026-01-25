# Friction-to-Flow AI Audit
## Product Requirements Document

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** January 2026  
**Prepared by:** Proptimized

---

## Related Documents

- `questionnaire.md` - Complete survey specification with scoring rules
- `ai-toolkit-engine.md` - Recommendation engine prompts and tool definitions
- UI Mockups (attached) - Visual design reference

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [User Experience](#3-user-experience)
4. [UI Specifications](#4-ui-specifications)
5. [Functional Requirements](#5-functional-requirements)
6. [Technical Requirements](#6-technical-requirements)
7. [Data Schema](#7-data-schema)
8. [Screen Inventory](#8-screen-inventory)
9. [Out of Scope](#9-out-of-scope)
10. [Future Considerations](#10-future-considerations)

---

## 1. Executive Summary

### 1.1 Purpose

This PRD defines the requirements for the Friction-to-Flow AI Audit application—an AI-driven assessment tool that identifies workflow friction and delivers personalized AI toolkit recommendations for creative agency teams.

### 1.2 Problem Statement

Creative agencies lose significant productive hours to repetitive tasks, manual handoffs, and underutilized AI tools. Team members lack guidance on which specific AI tools could address their particular workflow friction points.

### 1.3 Solution Overview

A web application with three core experiences:

- **Survey Flow** - Captures workflow friction, AI sentiment, and automation opportunities across 4 sections
- **Individual Dashboard** - Displays personalized results, AI-generated narrative, and toolkit recommendations
- **Admin Dashboard** - Provides team-wide insights, friction heatmaps, and response exploration

### 1.4 Success Metrics

| Metric | Target |
|--------|--------|
| Survey completion rate | 90%+ |
| User relevance rating (post-survey) | 4+ out of 5 |
| Time to first insight (admin) | < 1 week |
| Dashboard load time | < 5 seconds |

---

## 2. Product Overview

### 2.1 Target Users

**Primary: Autside Agency Team**

| Role | Key Friction Points |
|------|---------------------|
| Production Designers | File conversion, asset hunting, versioning |
| Creative/Art Directors | Quality control, approval bottlenecks |
| Account Directors | Communication overhead, approval chasing |
| Media Production | Format conversion, compliance checking |
| Leadership/Founders | Strategic visibility, team-wide patterns |

**Secondary: Admin Users**

- Proptimized consultants - Analyze results, identify opportunities
- Autside leadership - Review team trends, prioritize initiatives

### 2.2 Core Value Proposition

Transform generic AI awareness into personalized, actionable guidance. Instead of overwhelming users with tool options, the system maps their specific friction points to concrete use cases across five curated AI tools.

### 2.3 AI Toolkit (5 Tools)

| Tool | Primary Use Cases |
|------|-------------------|
| **NotebookLM** | RAG research, audio summaries, mind maps, brand guideline lookup |
| **Claude / Gemini / ChatGPT / Perplexity** | Writing, deep research, brainstorming, image generation |
| **AI Studio (Vibe Coding)** | Internal tools, workflow utilities, custom calculators |
| **Claude Cowork** | File management, batch processing, document creation |
| **Custom Agents** | Claude Projects, GPTs, Gems for repeated workflows |

*Note: No-Code Automation (Zapier/Make/n8n) is covered in the Magic Button automation opportunities, not in the toolkit cards.*

### 2.4 Archetype System (6 Types)

| Archetype | Profile |
|-----------|---------|
| **Efficiency Specialist** | High friction hours, speed priority, production-focused |
| **Workflow Architect** | Pioneer adopter, uses multiple AI flavors, sees automation opportunities |
| **Craft Guardian** | Quality-focused, human touch concerns, protective of creative process |
| **Curious Explorer** | Interested but early stage, uses chat AI only, learning-oriented |
| **Steady Guide** | Adopts when mandatory, prefers known tools, organization priority |
| **Strategic Navigator** | Leadership role, balanced profile, clarity priority |

---

## 3. User Experience

### 3.1 User Journey

```
┌─────────────────┐
│  Email/Slack    │
│  Invitation     │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Create Account │
│  (before survey)│
└────────┬────────┘
         ↓
┌─────────────────┐
│  Complete Survey│
│  (~10-15 min)   │
└────────┬────────┘
         ↓
┌─────────────────┐
│  AI Generation  │
│  (background)   │
└────────┬────────┘
         ↓
┌─────────────────┐
│  View Dashboard │
│  + Toolkit Recs │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Optional:      │
│  Retake Survey  │
└─────────────────┘
```

### 3.2 Survey Flow

**Structure:** 4 sections, ~35 questions total

| Section | Name | Questions | Focus |
|---------|------|-----------|-------|
| A | The Foundation | 12 | Role, tools, tech walls, research habits |
| B | The Friction | 11 | Friction points, handoffs, automation signals |
| C | AI Sentiment | 9 | Current usage, comfort, concerns |
| D | The Magic Button | 4 | Aspirations, success definition |

**Key UX Requirements:**

- Sectioned progress bar showing A / B / C / D (not question count)
- Save and resume capability via session persistence
- Warm, conversational section intro copy
- Conditional logic: Q6 shows only tools selected in Q5
- All multi-selects include "Other (specify)" option
- Account creation required before starting survey

### 3.3 AI Generation Pipeline

Triggered at survey completion:

```
Step 1: Calculate Archetype (rule-based)
         ↓
Step 2: Generate Toolkit Recommendations (AI)
         ↓
Step 3: Generate Automation Opportunities (AI)
         ↓
Step 4: Generate Narrative (AI, uses toolkit output)
         ↓
Dashboard Ready
```

See `ai-toolkit-engine.md` for prompt specifications.

### 3.4 Results History

- Users can retake the survey at any time
- All past results are stored with timestamps
- Dropdown in dashboard header to view historical results
- Current result shown by default

---

## 4. UI Specifications

*Reference attached mockups for visual design. This section defines component behavior and data mapping.*

### 4.1 Individual Dashboard

#### Header Section

| Component | Data Source | Display |
|-----------|-------------|---------|
| User Avatar | Account | Profile image or generated avatar |
| Archetype Title | Step 1 calculation | e.g., "Workflow Architect" |
| Archetype Description | Static per archetype | 1-2 sentence philosophy |
| **Weekly Friction** | Q14 + Q15 | `XX.Xh` - Total hours lost per week |
| **AI Readiness** | Q24 + Q25 + Q26 + Q27 | `XX%` - Composite score |
| **Automation Potential** | Q18 + Q19 + Q20 + Q21 | `XX%` - Based on handoff/notification/data signals |

#### Evolutionary Strategy Section

| Component | Data Source | Display |
|-----------|-------------|---------|
| Narrative | Step 4 AI output | 3-4 sentence professional analysis |
| Core Recommendation | Step 4 AI output (from toolkit) | Single actionable sentence |
| Skill Signature Radar | Q16 | 4-axis chart: Creative / Production / Communication / Admin |
| CTA Link | — | "Explore Your Recommended Toolkit →" scrolls to toolkit |

#### Evidence Layer (3 Cards)

**Card 1: Highest Friction**

| Element | Data Source |
|---------|-------------|
| Bar chart items | Q13 selections |
| Hour labels | Q14 (worst) + calculated distribution |
| Total Lost Weekly | Q15 |

**Card 2: Core Tech Stack**

| Element | Data Source |
|---------|-------------|
| Tool tags | Q5 selections |
| Tech Wall callout | Q6 selections |

**Card 3: Your Voice**

| Element | Data Source |
|---------|-------------|
| Pull quote | Q30 (Sacred) |
| AI Sentiment | Q27 (Adoption speed) |
| Learning Style | Q32 |
| Success Metric | Q33 (Magic Button priority) |

#### Magic Button Section

| Component | Data Source | Display |
|-----------|-------------|---------|
| Section intro | Static + Q13/Q15 data | "Based on your high friction in X and Y..." |
| Automation Card 1 | Step 3 AI output | Title, complexity tier, description, tools |
| Automation Card 2 | Step 3 AI output | Title, complexity tier, description, tools |
| Automation Card 3 | Step 3 AI output | Title, complexity tier, description, tools |

**Complexity Tiers:**

| Tier | Label | Visual |
|------|-------|--------|
| Quick Win | Low complexity | Green indicator |
| Project | Medium complexity | Yellow/Orange indicator |
| Initiative | High complexity | Blue/Purple indicator |

#### Curated Toolkit Section

| Component | Data Source | Display |
|-----------|-------------|---------|
| Tool Card (×5) | Step 2 AI output | Tool name, subtitle, 3 use cases, tutorial CTA |
| Tutorial CTA | Config file | "Watch Tutorial Video" → YouTube link |
| Selection indicator | — | "Tailored Selection (X/5)" |

**Tool Card Structure:**

```
┌─────────────────────────────────┐
│ [Icon]  Tool Name               │
│         SUBTITLE (from AI)      │
│                                 │
│ • Use case 1                    │
│ • Use case 2                    │
│ • Use case 3                    │
│                                 │
│ ┌─────────────────────────────┐ │
│ │   Watch Tutorial Video  ▶   │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### 4.2 Admin Dashboard

#### Navigation

- Title: "Agency Control Center"
- Subtitle: "AUTSIDE AGENCY • EXECUTIVE INSIGHTS"
- Tab switcher: Agency Overview | Friction Heatmap | AI Readiness

#### Tab A: Agency Overview

| Component | Data Source | Display |
|-----------|-------------|---------|
| Respondents | Count of completed surveys | Number + growth % |
| Completion | Completed / Started | Percentage + target |
| Avg. Friction | Average of all Q15 responses | Hours per person/week |
| Potential | Sum of all Q15 × efficiency factor | Monthly hours reclaimable |
| Archetype Mix | Distribution of Step 1 results | Donut chart (6 segments) |
| Recent Responses | Latest 10 submissions | Table with name, role, archetype, "View Audit" link |

#### Tab B: Friction Heatmap

| Component | Data Source | Display |
|-----------|-------------|---------|
| #1 Drain Highlight | Most common Q13 selection | Large callout card |
| Frequency Chart | All Q13 responses aggregated | Horizontal bar chart |
| Hours by Friction Type | Q13 × Q14 correlation | Breakdown table |

#### Tab C: AI Readiness

| Component | Data Source | Display |
|-----------|-------------|---------|
| Adoption Curve | Q27 distribution | Area chart (Pioneer → Steady) |
| AI Flavors Used | Q25 aggregated | Stacked bar or breakdown |
| Team Voice | Random Q30 response | Pull quote card |
| Concerns Summary | Q29 aggregated | Tag cloud or ranked list |

#### Response Explorer (All Tabs)

| Feature | Behavior |
|---------|----------|
| Filter by role | Dropdown from Q3 responses |
| Filter by archetype | Dropdown (6 options) |
| Filter by client | Dropdown from Q6 responses |
| View toggle | Summary view ↔ Full responses |
| Export | CSV download |

---

## 5. Functional Requirements

### 5.1 Authentication

| ID | Requirement |
|----|-------------|
| FR-AUTH-01 | Users can create account with email and password |
| FR-AUTH-02 | Users can log in and log out |
| FR-AUTH-03 | Password reset via email |
| FR-AUTH-04 | Session persistence for save/resume |
| FR-AUTH-05 | Admin role distinction (is_admin flag) |
| FR-AUTH-06 | Account creation required before survey access |

### 5.2 Survey

| ID | Requirement |
|----|-------------|
| FR-SURV-01 | Display questions by section with progress indicator (A/B/C/D) |
| FR-SURV-02 | Support input types: text, email, radio, multi-select, slider, textarea, percentage allocation |
| FR-SURV-03 | Conditional logic: Q6 displays based on Q5 selections |
| FR-SURV-04 | Auto-save responses on navigation between sections |
| FR-SURV-05 | Allow survey retake while preserving historical results |
| FR-SURV-06 | Validate required fields before section progression |
| FR-SURV-07 | Display section intro card before questions begin |

### 5.3 AI Generation

| ID | Requirement |
|----|-------------|
| FR-AI-01 | Calculate archetype using rule-based scoring at survey completion |
| FR-AI-02 | Generate toolkit recommendations (5 tools) via AI prompt |
| FR-AI-03 | Generate automation opportunities (3 ranked) via AI prompt |
| FR-AI-04 | Generate narrative + core recommendation via AI prompt |
| FR-AI-05 | Execute prompts in sequence: Archetype → Toolkit → Automations → Narrative |
| FR-AI-06 | Store all AI outputs with survey response |
| FR-AI-07 | Include web search in toolkit generation for current use cases |

### 5.4 Individual Dashboard

| ID | Requirement |
|----|-------------|
| FR-DASH-01 | Display header stats: Weekly Friction, AI Readiness, Automation Potential |
| FR-DASH-02 | Display archetype badge and description |
| FR-DASH-03 | Render AI-generated narrative and core recommendation |
| FR-DASH-04 | Display Skill Signature radar chart (4-axis from Q10) |
| FR-DASH-05 | Display Evidence Layer: Highest Friction, Tech Stack, Your Voice |
| FR-DASH-06 | Display Magic Button section with 3 automation opportunity cards |
| FR-DASH-07 | Display 5 toolkit cards with personalized use cases |
| FR-DASH-08 | Tutorial CTA links to YouTube (from config) |
| FR-DASH-09 | Dropdown to view historical survey results |

### 5.5 Admin Dashboard

| ID | Requirement |
|----|-------------|
| FR-ADMIN-01 | Display KPI cards: Respondents, Completion, Avg. Friction, Potential |
| FR-ADMIN-02 | Render archetype distribution donut chart |
| FR-ADMIN-03 | Display recent responses table with View Audit action |
| FR-ADMIN-04 | Friction Heatmap tab: #1 drain highlight + frequency chart |
| FR-ADMIN-05 | AI Readiness tab: adoption curve + concerns summary |
| FR-ADMIN-06 | Filter responses by role, archetype, client |
| FR-ADMIN-07 | Toggle between summary and full response view |
| FR-ADMIN-08 | Export responses as CSV |

---

## 6. Technical Requirements

### 6.1 Platform

- Web application (responsive, mobile-friendly)
- Modern browser support: Chrome, Safari, Firefox, Edge
- No native mobile app for v1

### 6.2 Recommended Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js or React |
| Backend | Node.js / Next.js API routes / Serverless |
| Database | PostgreSQL or Supabase |
| Auth | Supabase Auth |
| AI | Gemini API (with web search capability) |
| Hosting | Vercel or similar |

### 6.3 Performance Requirements

| Metric | Target |
|--------|--------|
| Survey page load | < 2 seconds |
| Auto-save response | < 500ms |
| AI generation (total) | < 30 seconds |
| Dashboard load | < 5 seconds |

### 6.4 Security Requirements

- HTTPS only
- Encrypted passwords (bcrypt or Supabase default)
- Admin access restricted by role flag
- No PII in URLs
- API keys stored in environment variables

---

## 7. Data Schema

### 7.1 Entity Relationship

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   users     │───1:N─│ survey_responses│───1:1─│ ai_outputs      │
└─────────────┘       └─────────────────┘       └─────────────────┘
```

### 7.2 Tables

#### users

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| email | varchar | Unique, required |
| password_hash | varchar | Encrypted |
| name | varchar | From Q1 |
| is_admin | boolean | Default false |
| created_at | timestamp | |
| updated_at | timestamp | |

#### survey_responses

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key → users |
| responses | jsonb | All question answers |
| archetype | varchar | Calculated result |
| weekly_friction_hours | decimal | Calculated from Q8+Q9 |
| ai_readiness_score | integer | Calculated percentage |
| automation_potential | integer | Calculated percentage |
| completed_at | timestamp | |
| created_at | timestamp | |

**responses JSONB structure:**
```json
{
  "q1_name": "Jordan Smith",
  "q2_email": "jordan@autside.com",
  "q3_role": "Production Designer",
  "q4_tenure": "2 – 5 years",
  "q5_tools": ["Adobe After Effects", "Figma", "Slack"],
  "q6_tech_walls": ["Adobe to PowerPoint"],
  "q7_work_type": "Digital/Social",
  "q8_primary_client": "Nike",
  "q9_slowdown": "Waiting for assets or information",
  "q10_knowledge_storage": "Shared team documentation",
  "q11_research_habits": "File specs, brand guidelines...",
  "q12_workload": 7,
  "q13_friction_types": ["The Format Shuffle", "The Asset Hunt"],
  "q14_worst_friction_hours": 6.5,
  "q15_total_friction_hours": 14.5,
  "q16_time_allocation": {
    "creative": 25,
    "production": 45,
    "communication": 20,
    "admin": 10
  },
  "q17_specific_task": "Every Monday I manually resize 40+ social banners...",
  "q18_repeated_task": "Exporting assets with specific naming conventions",
  "q19_handoff_pain": "Creative review sits for 3+ days",
  "q20_notification_wish": "When assets are uploaded, when approvals are pending",
  "q21_data_movement": "Copy data from emails into spreadsheets",
  "q22_documentation_benefit": "My immediate team",
  "q23_process_feeling": "Happy with the output, frustrated with the process",
  "q24_ai_frequency": "A few times a week",
  "q25_ai_flavors": ["The Chat", "The Canvas"],
  "q26_ai_knowledge": 7,
  "q27_adoption_speed": "Fast Follower",
  "q28_ai_role": "AI should assist, but humans should drive creative decisions",
  "q29_ai_concerns": ["Brand accuracy and consistency", "Quality control"],
  "q30_sacred": "Final creative judgment, client relationships",
  "q31_working_ai_tools": "I use ChatGPT for first-draft copy",
  "q32_learning_style": "Watch YouTube tutorials",
  "q33_magic_button": "Speed",
  "q34_tedious_task": "Organizing my files",
  "q35_extra_time": "More concept exploration",
  "q36_ai_success": "I get more done in less time"
}
```

#### ai_outputs

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| response_id | uuid | Foreign key → survey_responses |
| toolkit_recommendations | jsonb | 5 tool cards |
| automation_opportunities | jsonb | 3 ranked automations |
| narrative | text | Generated analysis |
| core_recommendation | text | Single actionable sentence |
| generated_at | timestamp | |

**toolkit_recommendations JSONB structure:**
```json
{
  "toolkit": [
    {
      "tool": "NotebookLM",
      "subtitle": "Brand Intelligence Hub",
      "use_cases": [
        "Ingest entire Nike brand history...",
        "Generate audio briefings...",
        "Build searchable archive..."
      ],
      "why_this_matters": "Eliminates the 3.8 hours...",
      "tutorial_url": "https://youtube.com/..."
    }
  ]
}
```

**automation_opportunities JSONB structure:**
```json
{
  "automations": [
    {
      "rank": 1,
      "title": "Instant Asset Adaptation",
      "complexity": "Project",
      "description": "One-click resizing for Nike social banners...",
      "tools": ["AI Studio", "Claude Cowork"],
      "friction_addressed": "File Conversion"
    }
  ]
}
```

#### tool_config (for editable tutorial links)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| tool_name | varchar | e.g., "NotebookLM" |
| tutorial_url | varchar | YouTube link |
| updated_at | timestamp | |

### 7.3 Archetype Scoring

Stored in application code (not database). See `questionnaire.md` for full scoring rules.

---

## 8. Screen Inventory

| Screen | Route | Auth Required |
|--------|-------|---------------|
| Login | `/login` | No |
| Sign Up | `/signup` | No |
| Survey Welcome | `/survey` | Yes |
| Survey Section A | `/survey/foundation` | Yes |
| Survey Section B | `/survey/friction` | Yes |
| Survey Section C | `/survey/ai-sentiment` | Yes |
| Survey Section D | `/survey/magic-button` | Yes |
| Survey Complete | `/survey/complete` | Yes |
| Individual Dashboard | `/dashboard` | Yes |
| Admin Dashboard | `/admin` | Yes (admin only) |

**Total: 10 screens**

---

## 9. Out of Scope (v1)

- Native mobile applications
- Real-time collaboration features
- External integrations (Slack notifications, calendar)
- Team comparison views
- Multi-language support
- SSO / OAuth login
- Custom branding per client

---

## 10. Future Considerations (v2+)

### User Features
- Progress tracking over time (quarterly retakes with trend visualization)
- Tool adoption tracking ("I tried this" checkboxes)
- Peer comparison (anonymized benchmarks)
- Export personal results as PDF

### Admin Features
- AI-powered pattern detection across responses
- Natural language query of data ("Show me all Craft Guardians with high friction")
- Automated trend alerts
- Change management recommendations

### Integration
- Slack notifications for survey invites and completions
- Calendar integration for follow-up scheduling
- Export to project management tools (Asana, Monday)

### Platform
- White-label capability for other agencies
- Custom archetype definitions per client
- API access for enterprise integrations

---

## Appendix A: Mockup Reference

The following mockups are attached as visual reference:

1. **FrictionFlow-SurveyUI-Kit.png** - Survey component library
2. **FrictionFlow-UserDashboard-top.png** - Individual dashboard header and strategy
3. **FrictionFlow-UserDashboard-Bottom.png** - Evidence layer, magic button, toolkit
4. **FrictionFlow-AdminDashboardUI.png** - Admin control center

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| Friction | Low-value, repetitive tasks that consume productive time |
| Tech Wall | Points where technology creates barriers instead of enabling work |
| AI Flavors | Categories of AI tool usage: Chat, Image, Voice/Video, Data, Search, Builder |
| Vibe Coding | Building apps through natural language descriptions without traditional coding |
| Custom Agent | Personalized AI assistant with custom instructions (GPT, Gem, Project) |
| RAG | Retrieval-Augmented Generation - AI that searches uploaded documents |

---

*End of PRD*
