// Survey Types

export type QuestionType =
  | 'text'
  | 'email'
  | 'dropdown'
  | 'radio'
  | 'multi-select'
  | 'slider'
  | 'textarea'
  | 'percentage-allocation'
  | 'friction-hours-allocation';

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface QuestionConfig {
  id: string;
  key: string;
  section: SurveySection;
  type: QuestionType;
  question: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: QuestionOption[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    step?: number;
    minSelections?: number;
    maxSelections?: number;
    sumTo?: number;
  };
  sliderLabels?: {
    min: string;
    max: string;
  };
  conditionalOn?: {
    questionKey: string;
    showWhenHasValue?: boolean;
  };
  categories?: string[];
  // Key for storing "Other (specify)" text when user selects "other" option
  otherKey?: string;
  // Key for storing dynamically calculated friction hours (for friction-hours-allocation type)
  frictionSourceKey?: string;
}

export type SurveySection = 'foundation' | 'friction' | 'ai-sentiment' | 'magic-button';

export interface SectionConfig {
  id: SurveySection;
  title: string;
  subtitle: string;
  introTitle: string;
  introDescription: string;
  questions: string[];
}

// Type for storing per-friction hour allocations
export type FrictionHours = Record<string, number>;

export interface SurveyResponses {
  q1_name: string;
  q2_email: string;
  q3_role: string;
  q3_role_other?: string;
  q4_tenure: string;
  q5_tools: string[];
  q5_tools_other?: string;
  q6_tech_walls: string[];
  q6_tech_walls_other?: string;
  q7_work_type: string;
  q8_primary_client: string;
  q9_slowdown: string;
  q9_slowdown_other?: string;
  q10_knowledge_storage: string;
  q11_research_habits: string;
  q12_workload: number;
  q13_friction_types: string[];
  q13_friction_types_other?: string;
  q14_friction_hours: FrictionHours;
  q16_time_allocation: TimeAllocation;
  q17_specific_task: string;
  q18_repeated_task: string;
  q19_handoff_pain: string;
  q20_notification_wish: string;
  q21_data_movement: string;
  q22_documentation_benefit: string;
  q23_process_feeling: string;
  q24_ai_frequency: string;
  q25_ai_flavors: string[];
  q26_ai_knowledge: number;
  q27_adoption_speed: string;
  q28_ai_role: string;
  q29_ai_concerns: string[];
  q29_ai_concerns_other?: string;
  q30_sacred: string;
  q31_working_ai_tools: string;
  q32_learning_style: string;
  q33_magic_button: string;
  q34_tedious_task: string;
  q35_extra_time: string;
  q36_ai_success: string;
}

export interface TimeAllocation {
  creative: number;
  production: number;
  communication: number;
  admin: number;
}

export type PartialSurveyResponses = Partial<SurveyResponses>;

export interface SurveyProgress {
  currentSection: SurveySection;
  completedSections: SurveySection[];
  responses: PartialSurveyResponses;
}

// Archetype Types
export type ArchetypeId =
  | 'efficiency-specialist'
  | 'workflow-architect'
  | 'craft-guardian'
  | 'curious-explorer'
  | 'steady-guide'
  | 'strategic-navigator';

export interface ArchetypeConfig {
  id: ArchetypeId;
  name: string;
  description: string;
  philosophy: string;
  color: string;
  icon: string;
}

export interface ArchetypeScore {
  archetypeId: ArchetypeId;
  primarySignals: number;
  secondarySignals: number;
  totalScore: number;
}

// Calculated Metrics
export interface CalculatedMetrics {
  weeklyFrictionHours: number;
  aiReadinessScore: number;
  automationPotential: number;
}
