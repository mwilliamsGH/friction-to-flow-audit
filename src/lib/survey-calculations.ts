// Survey Calculations
// Calculate metrics: friction hours, AI readiness, automation potential
// Based on the calculation rules from friction-to-flow-questionnaire.md

import { SurveyResponses, CalculatedMetrics, FrictionHours } from '@/types';

/**
 * Calculate Weekly Friction Hours
 *
 * Source: Q14 (friction hours per friction type)
 * The total friction hours is the sum of all per-friction hours
 *
 * @returns Weekly friction hours (0-40+)
 */
export function calculateWeeklyFrictionHours(responses: Partial<SurveyResponses>): number {
  // Q14 contains per-friction hours
  const frictionHours = responses.q14_friction_hours;

  if (frictionHours && typeof frictionHours === 'object') {
    // Sum all friction hours
    const total = Object.values(frictionHours as FrictionHours).reduce(
      (sum, hours) => sum + (hours || 0),
      0
    );
    return Math.max(0, total);
  }

  // Fallback to 0 if no friction hours data
  return 0;
}

/**
 * Calculate AI Readiness Score
 *
 * Source: Q24, Q25, Q26, Q27
 *
 * Components:
 * - Usage score (Q24): 0-25 points based on frequency
 * - Flavor score (Q25): 0-25 points based on AI tools tried (5 pts each, max 25)
 * - Knowledge score (Q26): 2.5-25 points (1-10 scaled to 2.5-25)
 * - Adoption score (Q27): 5-25 points based on adoption speed
 *
 * @returns AI readiness score (0-100)
 */
export function calculateAIReadinessScore(responses: Partial<SurveyResponses>): number {
  // Usage score based on Q24 (AI frequency)
  const usageScoreMap: Record<string, number> = {
    Daily: 25,
    'A few times a week': 20,
    'A few times a month': 15,
    Rarely: 10,
    Never: 0,
  };
  const usageScore = usageScoreMap[responses.q24_ai_frequency ?? ''] ?? 0;

  // Flavor score based on Q25 (AI flavors used)
  // Each flavor = 5 points, max 25 points for 5+ flavors
  const aiFlavors = responses.q25_ai_flavors ?? [];
  // Filter out "None of these" if present
  const validFlavors = aiFlavors.filter((f) => f !== 'None of these');
  const flavorScore = Math.min(validFlavors.length * 5, 25);

  // Knowledge score based on Q26 (1-10 scale to 2.5-25 points)
  const aiKnowledge = responses.q26_ai_knowledge ?? 1;
  const knowledgeScore = aiKnowledge * 2.5;

  // Adoption score based on Q27
  const adoptionScoreMap: Record<string, number> = {
    Pioneer: 25,
    'Fast Follower': 20,
    Pragmatist: 12,
    Skeptic: 5,
  };
  // Handle full adoption speed text variations
  const adoptionSpeed = responses.q27_adoption_speed ?? '';
  let adoptionScore = 0;
  if (adoptionSpeed.includes('Pioneer')) {
    adoptionScore = 25;
  } else if (adoptionSpeed.includes('Fast Follower')) {
    adoptionScore = 20;
  } else if (adoptionSpeed.includes('Pragmatist')) {
    adoptionScore = 12;
  } else if (adoptionSpeed.includes('Skeptic')) {
    adoptionScore = 5;
  } else {
    adoptionScore = adoptionScoreMap[adoptionSpeed] ?? 0;
  }

  // Total AI readiness (0-100)
  const total = usageScore + flavorScore + knowledgeScore + adoptionScore;

  // Clamp to 0-100 range
  return Math.min(100, Math.max(0, Math.round(total)));
}

/**
 * Calculate Automation Potential Score
 *
 * Source: Q18, Q19, Q20, Q21
 *
 * Each signal (substantive content >= 20 characters) = 25%
 * - Q18: Repeated task identified
 * - Q19: Handoff pain points
 * - Q20: Notification wishes
 * - Q21: Data movement needs
 *
 * @returns Automation potential score (0-100)
 */
export function calculateAutomationPotential(responses: Partial<SurveyResponses>): number {
  const MIN_CONTENT_LENGTH = 20;

  // Check each signal for substantive content
  const hasRepeatedTask =
    (responses.q18_repeated_task?.trim().length ?? 0) >= MIN_CONTENT_LENGTH;
  const hasHandoffPain =
    (responses.q19_handoff_pain?.trim().length ?? 0) >= MIN_CONTENT_LENGTH;
  const hasNotificationWish =
    (responses.q20_notification_wish?.trim().length ?? 0) >= MIN_CONTENT_LENGTH;
  const hasDataMovement =
    (responses.q21_data_movement?.trim().length ?? 0) >= MIN_CONTENT_LENGTH;

  // Count signals (each = 25%)
  const signalsCount = [
    hasRepeatedTask,
    hasHandoffPain,
    hasNotificationWish,
    hasDataMovement,
  ].filter(Boolean).length;

  // Each signal = 25%
  return signalsCount * 25;
}

/**
 * Calculate all metrics at once
 */
export function calculateAllMetrics(responses: Partial<SurveyResponses>): CalculatedMetrics {
  return {
    weeklyFrictionHours: calculateWeeklyFrictionHours(responses),
    aiReadinessScore: calculateAIReadinessScore(responses),
    automationPotential: calculateAutomationPotential(responses),
  };
}

/**
 * Format friction hours for display
 * @returns Formatted string like "14.5h"
 */
export function formatFrictionHours(hours: number): string {
  if (hours === 0) return '0h';
  if (hours >= 40) return '40+h';
  return `${hours.toFixed(1).replace(/\.0$/, '')}h`;
}

/**
 * Format percentage for display
 * @returns Formatted string like "84%"
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Get friction level label based on hours
 */
export function getFrictionLevel(hours: number): 'low' | 'moderate' | 'high' | 'critical' {
  if (hours < 5) return 'low';
  if (hours < 10) return 'moderate';
  if (hours < 20) return 'high';
  return 'critical';
}

/**
 * Get AI readiness level label
 */
export function getAIReadinessLevel(
  score: number
): 'beginner' | 'developing' | 'proficient' | 'advanced' {
  if (score < 25) return 'beginner';
  if (score < 50) return 'developing';
  if (score < 75) return 'proficient';
  return 'advanced';
}

/**
 * Get automation potential level label
 */
export function getAutomationPotentialLevel(score: number): 'low' | 'moderate' | 'high' | 'very-high' {
  if (score < 25) return 'low';
  if (score < 50) return 'moderate';
  if (score < 75) return 'high';
  return 'very-high';
}

/**
 * Estimate time savings based on automation potential and friction hours
 * This is a rough estimate for display purposes
 */
export function estimateTimeSavings(
  weeklyFrictionHours: number,
  automationPotential: number
): { hoursPerWeek: number; hoursPerYear: number } {
  // Assume automation can save a percentage of friction hours
  // based on the automation potential score
  const savingsPercentage = automationPotential / 100;
  // Conservative estimate: 50-70% of potential savings are realistically achievable
  const conservativeFactor = 0.6;

  const hoursPerWeek = weeklyFrictionHours * savingsPercentage * conservativeFactor;
  const hoursPerYear = hoursPerWeek * 50; // 50 working weeks

  return {
    hoursPerWeek: Math.round(hoursPerWeek * 10) / 10,
    hoursPerYear: Math.round(hoursPerYear),
  };
}
