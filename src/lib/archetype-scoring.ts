// Archetype Scoring Logic
// Deterministic, rule-based scoring for the 6 archetypes
// Based on the scoring rules from friction-to-flow-questionnaire.md

import { SurveyResponses, ArchetypeId, ArchetypeScore } from '@/types';

// Archetype definitions with scoring thresholds
const ARCHETYPE_DEFINITIONS = {
  'efficiency-specialist': {
    name: 'Efficiency Specialist',
    description: 'High friction hours, speed priority, production-focused',
    // Score Threshold: 2+ primary signals OR (2 primary + 2 secondary)
    thresholdPrimary: 2,
    thresholdAltPrimary: 2,
    thresholdAltSecondary: 2,
  },
  'workflow-architect': {
    name: 'Workflow Architect',
    description: 'Pioneer adopter, uses multiple AI flavors, sees automation opportunities',
    thresholdPrimary: 2,
    thresholdAltPrimary: 2,
    thresholdAltSecondary: 2,
  },
  'craft-guardian': {
    name: 'Craft Guardian',
    description: 'Quality-focused, human touch concerns, protective of creative process',
    thresholdPrimary: 2,
    thresholdAltPrimary: 2,
    thresholdAltSecondary: 2,
  },
  'curious-explorer': {
    name: 'Curious Explorer',
    description: 'Interested but early stage, uses chat AI only, learning-oriented',
    thresholdPrimary: 2,
    thresholdAltPrimary: 2,
    thresholdAltSecondary: 2,
  },
  'steady-guide': {
    name: 'Steady Guide',
    description: 'Adopts when mandatory, prefers known tools, organization priority',
    thresholdPrimary: 2,
    thresholdAltPrimary: 2,
    thresholdAltSecondary: 2,
  },
  'strategic-navigator': {
    name: 'Strategic Navigator',
    description: 'Leadership role, balanced profile, clarity priority',
    // Lower threshold: 2+ primary signals OR (1 primary + 3 secondary)
    thresholdPrimary: 2,
    thresholdAltPrimary: 1,
    thresholdAltSecondary: 3,
  },
};

// Tie-breaker priority (highest potential for AI adoption first)
const TIEBREAKER_PRIORITY: ArchetypeId[] = [
  'workflow-architect',
  'strategic-navigator',
  'efficiency-specialist',
  'craft-guardian',
  'curious-explorer',
  'steady-guide',
];

// Default fallback archetype
const FALLBACK_ARCHETYPE: ArchetypeId = 'curious-explorer';

/**
 * Check if a text field has substantive content
 */
function hasSubstantiveContent(text: string | undefined, minLength: number = 20): boolean {
  return !!text && text.trim().length >= minLength;
}

/**
 * Score Efficiency Specialist signals
 */
function scoreEfficiencySpecialist(responses: SurveyResponses): ArchetypeScore {
  let primarySignals = 0;
  let secondarySignals = 0;

  // Primary Signals
  // Q13 includes "The Pivot" OR "The Seasonal Rollout" OR "The Format Shuffle"
  const frictionTypes = responses.q13_friction_types || [];
  if (
    frictionTypes.some((f) =>
      ['The Pivot', 'The Seasonal Rollout', 'The Format Shuffle'].includes(f)
    )
  ) {
    primarySignals++;
  }

  // Q14: Worst friction hours >= 6 (max value from friction hours object)
  const frictionHoursValues = responses.q14_friction_hours ? Object.values(responses.q14_friction_hours) : [];
  const worstFrictionHours = frictionHoursValues.length > 0 ? Math.max(...frictionHoursValues) : 0;
  if (worstFrictionHours >= 6) {
    primarySignals++;
  }

  // Q14: Total friction hours >= 12 (sum of all friction hours)
  const totalFrictionHours = frictionHoursValues.reduce((sum, hours) => sum + hours, 0);
  if (totalFrictionHours >= 12) {
    primarySignals++;
  }

  // Q33 = "Speed"
  if (responses.q33_magic_button === 'Speed') {
    primarySignals++;
  }

  // Secondary Signals
  // Q7 = "Digital / Social content" OR "Print / In-store materials"
  if (
    responses.q7_work_type === 'Digital / Social content' ||
    responses.q7_work_type === 'Print / In-store materials'
  ) {
    secondarySignals++;
  }

  // Q16 Production/Execution >= 40%
  if (responses.q16_time_allocation?.production >= 40) {
    secondarySignals++;
  }

  return {
    archetypeId: 'efficiency-specialist',
    primarySignals,
    secondarySignals,
    totalScore: primarySignals * 2 + secondarySignals,
  };
}

/**
 * Score Workflow Architect signals
 */
function scoreWorkflowArchitect(responses: SurveyResponses): ArchetypeScore {
  let primarySignals = 0;
  let secondarySignals = 0;

  // Primary Signals
  // Q27 = "Pioneer" OR "Fast Follower"
  if (
    responses.q27_adoption_speed === 'Pioneer' ||
    responses.q27_adoption_speed === 'Fast Follower'
  ) {
    primarySignals++;
  }

  // Q25 count >= 3 AI flavors
  const aiFlavors = responses.q25_ai_flavors || [];
  if (aiFlavors.length >= 3) {
    primarySignals++;
  }

  // Q20 OR Q21 has substantive content (>= 30 characters)
  if (
    hasSubstantiveContent(responses.q20_notification_wish, 30) ||
    hasSubstantiveContent(responses.q21_data_movement, 30)
  ) {
    primarySignals++;
  }

  // Q26 >= 6 (AI knowledge)
  if (responses.q26_ai_knowledge >= 6) {
    primarySignals++;
  }

  // Secondary Signals
  // Q28 = "AI should handle as much as possible..."
  if (
    responses.q28_ai_role ===
    'AI should handle as much as possible so I can focus on high-level thinking'
  ) {
    secondarySignals++;
  }

  // Q18 has substantive content (repeated task identified)
  if (hasSubstantiveContent(responses.q18_repeated_task, 20)) {
    secondarySignals++;
  }

  // Q10 = "Shared team documentation"
  if (responses.q10_knowledge_storage === 'Shared team documentation') {
    secondarySignals++;
  }

  return {
    archetypeId: 'workflow-architect',
    primarySignals,
    secondarySignals,
    totalScore: primarySignals * 2 + secondarySignals,
  };
}

/**
 * Score Craft Guardian signals
 */
function scoreCraftGuardian(responses: SurveyResponses): ArchetypeScore {
  let primarySignals = 0;
  let secondarySignals = 0;

  // Primary Signals
  // Q30 has substantive content (>= 50 characters)
  if (hasSubstantiveContent(responses.q30_sacred, 50)) {
    primarySignals++;
  }

  // Q29 includes "Losing the human touch"
  const aiConcerns = responses.q29_ai_concerns || [];
  if (aiConcerns.includes('Losing the human touch')) {
    primarySignals++;
  }

  // Q33 = "Quality"
  if (responses.q33_magic_button === 'Quality') {
    primarySignals++;
  }

  // Q28 = "AI should only handle purely mechanical/administrative tasks" OR "AI has no place in creative work"
  if (
    responses.q28_ai_role === 'AI should only handle purely mechanical/administrative tasks' ||
    responses.q28_ai_role === 'AI has no place in creative work'
  ) {
    primarySignals++;
  }

  // Secondary Signals
  // Q7 = "Brand development" OR "Campaign strategy"
  if (
    responses.q7_work_type === 'Brand development' ||
    responses.q7_work_type === 'Campaign strategy'
  ) {
    secondarySignals++;
  }

  // Q23 = "Proud of both the work and the process"
  if (responses.q23_process_feeling === 'Proud of both the work and the process') {
    secondarySignals++;
  }

  // Q29 includes "Brand accuracy and consistency"
  if (aiConcerns.includes('Brand accuracy and consistency')) {
    secondarySignals++;
  }

  return {
    archetypeId: 'craft-guardian',
    primarySignals,
    secondarySignals,
    totalScore: primarySignals * 2 + secondarySignals,
  };
}

/**
 * Score Curious Explorer signals
 */
function scoreCuriousExplorer(responses: SurveyResponses): ArchetypeScore {
  let primarySignals = 0;
  let secondarySignals = 0;

  // Primary Signals
  // Q24 = "A few times a month" OR "Rarely"
  if (
    responses.q24_ai_frequency === 'A few times a month' ||
    responses.q24_ai_frequency === 'Rarely'
  ) {
    primarySignals++;
  }

  // Q25 = only "The Chat" selected (or empty)
  const aiFlavors = responses.q25_ai_flavors || [];
  const onlyChatOrEmpty =
    aiFlavors.length === 0 ||
    (aiFlavors.length === 1 &&
      aiFlavors[0] === 'The Chat – ChatGPT, Claude, Gemini for conversation/writing');
  if (onlyChatOrEmpty) {
    primarySignals++;
  }

  // Q26 <= 4 (AI knowledge)
  if (responses.q26_ai_knowledge <= 4) {
    primarySignals++;
  }

  // Q36 = "I learn new skills and stay relevant"
  if (responses.q36_ai_success === 'I learn new skills and stay relevant') {
    primarySignals++;
  }

  // Secondary Signals
  // Q27 = "Pragmatist"
  if (responses.q27_adoption_speed === 'Pragmatist') {
    secondarySignals++;
  }

  // Q32 = "Watch YouTube tutorials" OR "Take a structured course"
  if (
    responses.q32_learning_style === 'Watch YouTube tutorials' ||
    responses.q32_learning_style === 'Take a structured course'
  ) {
    secondarySignals++;
  }

  // Q29 includes "Learning curve"
  const aiConcerns = responses.q29_ai_concerns || [];
  if (aiConcerns.includes('Learning curve')) {
    secondarySignals++;
  }

  return {
    archetypeId: 'curious-explorer',
    primarySignals,
    secondarySignals,
    totalScore: primarySignals * 2 + secondarySignals,
  };
}

/**
 * Score Steady Guide signals
 */
function scoreSteadyGuide(responses: SurveyResponses): ArchetypeScore {
  let primarySignals = 0;
  let secondarySignals = 0;

  // Primary Signals
  // Q27 = "Skeptic" OR "Pragmatist"
  if (
    responses.q27_adoption_speed === 'Skeptic' ||
    responses.q27_adoption_speed === 'Pragmatist'
  ) {
    primarySignals++;
  }

  // Q33 = "Organization"
  if (responses.q33_magic_button === 'Organization') {
    primarySignals++;
  }

  // Q24 = "Rarely" OR "Never"
  if (responses.q24_ai_frequency === 'Rarely' || responses.q24_ai_frequency === 'Never') {
    primarySignals++;
  }

  // Q10 = "I keep it in my head" OR "It doesn't go anywhere—I solve it again next time"
  if (
    responses.q10_knowledge_storage === 'I keep it in my head' ||
    responses.q10_knowledge_storage === "It doesn't go anywhere—I solve it again next time"
  ) {
    primarySignals++;
  }

  // Secondary Signals
  // Q25 count <= 1 AI flavor
  const aiFlavors = responses.q25_ai_flavors || [];
  if (aiFlavors.length <= 1) {
    secondarySignals++;
  }

  // Q28 = "AI should assist, but humans should drive creative decisions"
  if (responses.q28_ai_role === 'AI should assist, but humans should drive creative decisions') {
    secondarySignals++;
  }

  // Q4 = "2 – 5 years" OR "5+ years" (tenure)
  if (responses.q4_tenure === '2 – 5 years' || responses.q4_tenure === '5+ years') {
    secondarySignals++;
  }

  return {
    archetypeId: 'steady-guide',
    primarySignals,
    secondarySignals,
    totalScore: primarySignals * 2 + secondarySignals,
  };
}

/**
 * Score Strategic Navigator signals
 */
function scoreStrategicNavigator(responses: SurveyResponses): ArchetypeScore {
  let primarySignals = 0;
  let secondarySignals = 0;

  // Primary Signals
  // Q3 includes "Director" OR "Manager" OR "Founder / Leadership"
  const role = responses.q3_role || '';
  if (
    role.includes('Director') ||
    role.includes('Manager') ||
    role === 'Founder / Leadership'
  ) {
    primarySignals++;
  }

  // Q33 = "Clarity"
  if (responses.q33_magic_button === 'Clarity') {
    primarySignals++;
  }

  // Q22 = "Other departments" OR "Everyone at the agency"
  if (
    responses.q22_documentation_benefit === 'Other departments' ||
    responses.q22_documentation_benefit === 'Everyone at the agency'
  ) {
    primarySignals++;
  }

  // Secondary Signals
  // Q16 Communication/Meetings >= 25%
  if (responses.q16_time_allocation?.communication >= 25) {
    secondarySignals++;
  }

  // Q7 = "Campaign strategy" OR "Account / Client management" OR "Mix of everything"
  if (
    responses.q7_work_type === 'Campaign strategy' ||
    responses.q7_work_type === 'Account / Client management' ||
    responses.q7_work_type === 'Mix of everything'
  ) {
    secondarySignals++;
  }

  // Q36 = "I achieve better work-life balance" OR "The quality of my work improves"
  if (
    responses.q36_ai_success === 'I achieve better work-life balance' ||
    responses.q36_ai_success === 'The quality of my work improves'
  ) {
    secondarySignals++;
  }

  // Q13 includes "The Approval Chase" OR "The Handoff Gap"
  const frictionTypes = responses.q13_friction_types || [];
  if (frictionTypes.some((f) => ['The Approval Chase', 'The Handoff Gap'].includes(f))) {
    secondarySignals++;
  }

  return {
    archetypeId: 'strategic-navigator',
    primarySignals,
    secondarySignals,
    totalScore: primarySignals * 2 + secondarySignals,
  };
}

/**
 * Check if an archetype meets its scoring threshold
 */
function meetsThreshold(score: ArchetypeScore): boolean {
  const def = ARCHETYPE_DEFINITIONS[score.archetypeId];

  // Check standard threshold: X+ primary signals
  if (score.primarySignals >= def.thresholdPrimary) {
    return true;
  }

  // Check alternate threshold: Y primary + Z secondary
  if (
    score.primarySignals >= def.thresholdAltPrimary &&
    score.secondarySignals >= def.thresholdAltSecondary
  ) {
    return true;
  }

  return false;
}

/**
 * Calculate archetype scores for all 6 archetypes
 */
export function calculateAllArchetypeScores(responses: SurveyResponses): ArchetypeScore[] {
  return [
    scoreEfficiencySpecialist(responses),
    scoreWorkflowArchitect(responses),
    scoreCraftGuardian(responses),
    scoreCuriousExplorer(responses),
    scoreSteadyGuide(responses),
    scoreStrategicNavigator(responses),
  ];
}

/**
 * Determine the winning archetype based on scores
 * Uses highest score wins with tie-breaker priority list
 */
export function determineArchetype(responses: SurveyResponses): ArchetypeId {
  const scores = calculateAllArchetypeScores(responses);

  // Filter to only archetypes that meet their threshold
  const qualifyingScores = scores.filter(meetsThreshold);

  // If no archetype qualifies, return fallback
  if (qualifyingScores.length === 0) {
    return FALLBACK_ARCHETYPE;
  }

  // Sort by total score (descending)
  qualifyingScores.sort((a, b) => b.totalScore - a.totalScore);

  // Get the highest score
  const highestScore = qualifyingScores[0].totalScore;

  // Find all archetypes tied at the highest score
  const tiedArchetypes = qualifyingScores
    .filter((s) => s.totalScore === highestScore)
    .map((s) => s.archetypeId);

  // If only one archetype, return it
  if (tiedArchetypes.length === 1) {
    return tiedArchetypes[0];
  }

  // Use tie-breaker priority to resolve ties
  for (const archetype of TIEBREAKER_PRIORITY) {
    if (tiedArchetypes.includes(archetype)) {
      return archetype;
    }
  }

  // This shouldn't happen, but fallback just in case
  return FALLBACK_ARCHETYPE;
}

/**
 * Get detailed scoring information for debugging/display
 */
export function getArchetypeScoringDetails(responses: SurveyResponses): {
  winner: ArchetypeId;
  scores: ArchetypeScore[];
  qualifyingArchetypes: ArchetypeId[];
} {
  const scores = calculateAllArchetypeScores(responses);
  const qualifyingScores = scores.filter(meetsThreshold);
  const winner = determineArchetype(responses);

  return {
    winner,
    scores,
    qualifyingArchetypes: qualifyingScores.map((s) => s.archetypeId),
  };
}

export { ARCHETYPE_DEFINITIONS, TIEBREAKER_PRIORITY, FALLBACK_ARCHETYPE };
