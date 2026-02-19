'use client';

import { NeoCard } from '@/components/ui';
import { BRAND_COLORS } from '@/lib/colors';
import { SURVEY_QUESTIONS, ARCHETYPES } from '@/lib/constants';

interface ResponseData {
    responses: Record<string, unknown>;
    archetype: string | null;
    ai_readiness_score: number | null;
    automation_potential: number | null;
    users?: { name: string | null } | null;
}

interface AIChampionsProps {
    responses: ResponseData[];
}

const ROLE_LABELS: Record<string, string> = {};
SURVEY_QUESTIONS.q3?.options?.forEach((opt) => {
    ROLE_LABELS[opt.value] = opt.label;
});

const ADOPTION_LABELS: Record<string, string> = {
    'pioneer': 'Pioneer',
    'fast-follower': 'Fast Follower',
    'pragmatist': 'Pragmatist',
    'skeptic': 'Skeptic',
};

const FLAVOR_LABELS: Record<string, string> = {
    'the-chat': 'Chat',
    'the-canvas': 'Canvas',
    'the-voice': 'Voice',
    'the-analyst': 'Analyst',
    'the-researcher': 'Researcher',
    'the-builder': 'Builder',
};

interface ChampionScore {
    name: string;
    role: string;
    archetype: string;
    compositeScore: number;
    aiReadiness: number;
    aiKnowledge: number;
    flavorCount: number;
    flavors: string[];
    adoptionSpeed: string;
    frequency: string;
    workingTools: string;
    automationPotential: number;
    tier: 'champion' | 'accelerator' | 'learner';
}

function scoreChampions(responses: ResponseData[]): ChampionScore[] {
    return responses.map((r) => {
        const resp = r.responses || {};
        const name = (resp.q1_name as string) || 'Anonymous';
        const role = (resp.q3_role as string) || 'unknown';
        const archetype = r.archetype || 'unknown';
        const aiReadiness = r.ai_readiness_score || 0;
        const aiKnowledge = (resp.q26_ai_knowledge as number) || 0;
        const aiFlavors = (resp.q25_ai_flavors as string[]) || [];
        const adoptionSpeed = (resp.q27_adoption_speed as string) || '';
        const frequency = (resp.q24_ai_frequency as string) || '';
        const workingTools = (resp.q31_working_ai_tools as string) || '';
        const automationPotential = r.automation_potential || 0;

        // Composite score (0-100)
        let score = 0;

        // AI readiness (max 35 points based on stored score)
        score += Math.min(aiReadiness, 35);

        // AI knowledge (max 20 points)
        score += (aiKnowledge / 10) * 20;

        // Flavor breadth (max 15 points, 2.5 per flavor)
        score += Math.min(aiFlavors.filter((f) => f !== 'none').length * 2.5, 15);

        // Adoption speed (max 15 points)
        const adoptionScores: Record<string, number> = {
            'pioneer': 15,
            'fast-follower': 11,
            'pragmatist': 6,
            'skeptic': 2,
        };
        score += adoptionScores[adoptionSpeed] || 0;

        // Usage frequency (max 10 points)
        const freqScores: Record<string, number> = {
            'daily': 10,
            'few-times-week': 7,
            'few-times-month': 4,
            'rarely': 2,
            'never': 0,
        };
        score += freqScores[frequency] || 0;

        // Working tools bonus (max 5 points)
        if (workingTools.length > 10 && workingTools.toLowerCase() !== 'n/a') {
            score += 5;
        }

        score = Math.min(Math.round(score), 100);

        // Tier classification
        let tier: 'champion' | 'accelerator' | 'learner';
        if (score >= 55) tier = 'champion';
        else if (score >= 35) tier = 'accelerator';
        else tier = 'learner';

        return {
            name,
            role,
            archetype,
            compositeScore: score,
            aiReadiness,
            aiKnowledge,
            flavorCount: aiFlavors.filter((f) => f !== 'none').length,
            flavors: aiFlavors.filter((f) => f !== 'none'),
            adoptionSpeed,
            frequency,
            workingTools,
            automationPotential,
            tier,
        };
    }).sort((a, b) => b.compositeScore - a.compositeScore);
}

const TIER_CONFIG = {
    champion: {
        label: '🏆 Champion',
        color: '#059669',
        bg: '#ecfdf5',
        border: '#a7f3d0',
        description: 'Can lead workshops, pilot new tools, mentor others',
    },
    accelerator: {
        label: '🚀 Accelerator',
        color: BRAND_COLORS.primary,
        bg: `${BRAND_COLORS.primary}08`,
        border: `${BRAND_COLORS.primary}30`,
        description: 'Ready to expand with guidance and structured paths',
    },
    learner: {
        label: '📚 Learner',
        color: '#d97706',
        bg: '#fffbeb',
        border: '#fde68a',
        description: 'Needs awareness building and low-barrier entry points',
    },
};

export function AIChampions({ responses }: AIChampionsProps) {
    const champions = scoreChampions(responses);

    const tierCounts = {
        champion: champions.filter((c) => c.tier === 'champion').length,
        accelerator: champions.filter((c) => c.tier === 'accelerator').length,
        learner: champions.filter((c) => c.tier === 'learner').length,
    };

    if (responses.length === 0) {
        return (
            <NeoCard>
                <div className="text-center py-12 text-gray-400">
                    <p className="text-lg">No responses yet</p>
                </div>
            </NeoCard>
        );
    }

    return (
        <div className="space-y-6">
            {/* Tier Distribution */}
            <div className="grid grid-cols-3 gap-4">
                {(['champion', 'accelerator', 'learner'] as const).map((tier) => {
                    const config = TIER_CONFIG[tier];
                    return (
                        <NeoCard
                            key={tier}
                            className="text-center"
                            style={{ borderLeft: `4px solid ${config.color}` } as React.CSSProperties}
                        >
                            <p className="text-sm font-semibold mb-1" style={{ color: config.color }}>
                                {config.label}
                            </p>
                            <p className="text-3xl font-bold text-gray-900">{tierCounts[tier]}</p>
                            <p className="text-xs text-gray-400 mt-2 leading-tight">{config.description}</p>
                        </NeoCard>
                    );
                })}
            </div>

            {/* Champion Leaderboard */}
            <NeoCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Readiness Leaderboard</h3>
                <p className="text-sm text-gray-400 mb-6">Ranked by composite AI readiness score</p>
                <div className="space-y-4">
                    {champions.map((person, index) => {
                        const config = TIER_CONFIG[person.tier];
                        return (
                            <div
                                key={index}
                                className="p-4 rounded-xl border transition-all hover:shadow-sm"
                                style={{
                                    backgroundColor: config.bg,
                                    borderColor: config.border,
                                }}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Rank */}
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                                        style={{
                                            backgroundColor: index === 0 ? '#059669' : index === 1 ? BRAND_COLORS.primary : BRAND_COLORS.dark,
                                        }}
                                    >
                                        {index + 1}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-gray-900">{person.name}</span>
                                            <span
                                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                style={{ backgroundColor: config.border, color: config.color }}
                                            >
                                                {config.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {ROLE_LABELS[person.role] || person.role.replace(/-/g, ' ')}
                                            <span className="mx-1.5 text-gray-300">•</span>
                                            {ARCHETYPES[person.archetype]?.name || person.archetype}
                                        </p>

                                        {/* Stats Row */}
                                        <div className="flex flex-wrap gap-3 mt-3">
                                            <div className="text-xs">
                                                <span className="text-gray-400">Knowledge</span>
                                                <span className="ml-1 font-semibold text-gray-700">{person.aiKnowledge}/10</span>
                                            </div>
                                            <div className="text-xs">
                                                <span className="text-gray-400">Flavors</span>
                                                <span className="ml-1 font-semibold text-gray-700">{person.flavorCount}/6</span>
                                            </div>
                                            <div className="text-xs">
                                                <span className="text-gray-400">Adoption</span>
                                                <span className="ml-1 font-semibold text-gray-700">
                                                    {ADOPTION_LABELS[person.adoptionSpeed] || person.adoptionSpeed}
                                                </span>
                                            </div>
                                            <div className="text-xs">
                                                <span className="text-gray-400">Auto. Potential</span>
                                                <span className="ml-1 font-semibold text-gray-700">{person.automationPotential}%</span>
                                            </div>
                                        </div>

                                        {/* Flavors used */}
                                        {person.flavors.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {person.flavors.map((f) => (
                                                    <span
                                                        key={f}
                                                        className="text-xs px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600"
                                                    >
                                                        {FLAVOR_LABELS[f] || f}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Working tools */}
                                        {person.workingTools.length > 10 && person.workingTools.toLowerCase() !== 'n/a' && (
                                            <p className="text-xs text-gray-500 mt-2 italic">
                                                &ldquo;{person.workingTools.substring(0, 120)}{person.workingTools.length > 120 ? '...' : ''}&rdquo;
                                            </p>
                                        )}
                                    </div>

                                    {/* Score Gauge */}
                                    <div className="flex-shrink-0 text-center">
                                        <div className="relative w-14 h-14">
                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                <circle cx="18" cy="18" r="15" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                                                <circle
                                                    cx="18" cy="18" r="15" fill="transparent"
                                                    stroke={config.color}
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${(person.compositeScore / 100) * 94.2} 94.2`}
                                                />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
                                                {person.compositeScore}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-0.5 block">Score</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </NeoCard>

            {/* Strategy Recommendations */}
            <NeoCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Rollout Strategy</h3>
                <p className="text-sm text-gray-400 mb-4">Recommended actions based on team composition</p>
                <div className="space-y-3">
                    {tierCounts.champion > 0 && (
                        <div className="p-4 rounded-xl" style={{ backgroundColor: '#ecfdf5' }}>
                            <p className="text-sm font-semibold text-emerald-700 mb-1">
                                🏆 Activate {tierCounts.champion} Champion{tierCounts.champion > 1 ? 's' : ''}
                            </p>
                            <p className="text-sm text-emerald-600">
                                Pair {champions.filter((c) => c.tier === 'champion').map((c) => c.name).join(' and ')} with
                                team members for peer-led tool exploration. Champions adopt 3-5x faster than top-down mandates.
                            </p>
                        </div>
                    )}
                    {tierCounts.accelerator > 0 && (
                        <div className="p-4 rounded-xl" style={{ backgroundColor: `${BRAND_COLORS.primary}08` }}>
                            <p className="text-sm font-semibold mb-1" style={{ color: BRAND_COLORS.primary }}>
                                🚀 Guide {tierCounts.accelerator} Accelerator{tierCounts.accelerator > 1 ? 's' : ''}
                            </p>
                            <p className="text-sm" style={{ color: BRAND_COLORS.dark }}>
                                Give structured learning paths and specific use case assignments. These team members are
                                primed for the &ldquo;aha moment&rdquo; — they just need the right entry point.
                            </p>
                        </div>
                    )}
                    {tierCounts.learner > 0 && (
                        <div className="p-4 rounded-xl" style={{ backgroundColor: '#fffbeb' }}>
                            <p className="text-sm font-semibold text-amber-700 mb-1">
                                📚 Support {tierCounts.learner} Learner{tierCounts.learner > 1 ? 's' : ''}
                            </p>
                            <p className="text-sm text-amber-600">
                                Start with low-barrier, high-impact wins. Focus on &ldquo;The Chat&rdquo; for daily tasks they
                                already understand before introducing more specialized AI categories.
                            </p>
                        </div>
                    )}
                </div>
            </NeoCard>
        </div>
    );
}
