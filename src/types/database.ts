// Database Types - matches Supabase schema

export interface User {
  id: string;
  email: string;
  name: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface SurveyResponse {
  id: string;
  user_id: string;
  responses: Record<string, unknown>;
  archetype: string | null;
  weekly_friction_hours: number | null;
  ai_readiness_score: number | null;
  automation_potential: number | null;
  completed_at: string | null;
  created_at: string;
}

export interface AIOutput {
  id: string;
  response_id: string;
  toolkit_recommendations: ToolkitRecommendations | null;
  automation_opportunities: AutomationOpportunities | null;
  narrative: string | null;
  core_recommendation: string | null;
  generated_at: string;
}

export interface ToolConfig {
  id: string;
  tool_name: string;
  tutorial_url: string | null;
  updated_at: string;
}

// AI Output Structures
export interface ToolkitRecommendations {
  toolkit: ToolCard[];
}

export interface ToolCard {
  tool: string;
  use_cases: string[];
  why_this_matters: string;
}

export interface AutomationOpportunities {
  automations: Automation[];
}

export interface Automation {
  rank: number;
  title: string;
  complexity: 'Quick Win' | 'Project' | 'Initiative';
  description: string;
  tools: string[];
  friction_addressed: string;
}

export interface NarrativeOutput {
  narrative: string;
  core_recommendation: string;
}

// Database Tables type for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<User, 'id'>>;
      };
      survey_responses: {
        Row: SurveyResponse;
        Insert: Omit<SurveyResponse, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<SurveyResponse, 'id'>>;
      };
      ai_outputs: {
        Row: AIOutput;
        Insert: Omit<AIOutput, 'id' | 'generated_at'> & {
          id?: string;
          generated_at?: string;
        };
        Update: Partial<Omit<AIOutput, 'id'>>;
      };
      tool_config: {
        Row: ToolConfig;
        Insert: Omit<ToolConfig, 'id' | 'updated_at'> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ToolConfig, 'id'>>;
      };
    };
  };
}
