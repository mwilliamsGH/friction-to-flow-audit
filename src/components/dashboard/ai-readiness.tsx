'use client';

import { NeoCard } from '@/components/ui';
import { BRAND_COLORS } from '@/lib/colors';
import { SURVEY_QUESTIONS, ARCHETYPES } from '@/lib/constants';

interface ResponseData {
    responses: Record<string, unknown>;
    archetype: string | null;
    ai_readiness_score: number | null;
    users?: { name: string | null } | null;
}

interface AIReadinessProps {
    responses: ResponseData[];
}

// Readable labels for AI flavors
const FLAVOR_LABELS: Record<string, { label: string; emoji: string }> = {
    'the-chat': { label: 'The Chat', emoji: '💬' },
    'the-canvas': { label: 'The Canvas', emoji: '🎨' },
    'the-voice': { label: 'The Voice', emoji: '🎤' },
    'the-analyst': { label: 'The Analyst', emoji: '📊' },
    'the-researcher': { label: 'The Researcher', emoji: '🔍' },
    'the-builder': { label: 'The Builder', emoji: '🔧' },
};

const ADOPTION_ORDER = ['pioneer', 'fast-follower', 'pragmatist', 'skeptic'];
const ADOPTION_LABELS: Record<string, string> = {
    'pioneer': 'Pioneer',
    'fast-follower': 'Fast Follower',
    'pragmatist': 'Pragmatist',
    'skeptic': 'Skeptic',
};
const ADOPTION_COLORS: Record<string, string> = {
    'pioneer': '#2dd4bf',
    'fast-follower': BRAND_COLORS.primary,
    'pragmatist': BRAND_COLORS.dark,
    'skeptic': '#94a3b8',
};

const AI_ROLE_LABELS: Record<string, string> = {};
SURVEY_QUESTIONS.q28?.options?.forEach((opt) => {
    AI_ROLE_LABELS[opt.value] = opt.label;
});

const CONCERN_LABELS: Record<string, string> = {};
SURVEY_QUESTIONS.q29?.options?.forEach((opt) => {
    CONCERN_LABELS[opt.value] = opt.label;
});

const ROLE_LABELS: Record<string, string> = {};
SURVEY_QUESTIONS.q3?.options?.forEach((opt) => {
    ROLE_LABELS[opt.value] = opt.label;
});

function aggregateReadiness(responses: ResponseData[]) {
    const adoptionCounts: Record<string, number> = {};
    const flavorCounts: Record<string, number> = {};
    const knowledgeScores: { name: string; role: string; score: number }[] = [];
    const concernCounts: Record<string, number> = {};
    const aiRoleCounts: Record<string, number> = {};
    const sacredQuotes: { name: string; role: string; quote: string }[] = [];
    const workingTools: { name: string; tools: string }[] = [];
    let totalReadiness = 0;
    let readinessCount = 0;

    responses.forEach((r) => {
        const resp = r.responses || {};
        const name = (resp.q1_name as string) || 'Anonymous';
        const role = (resp.q3_role as string) || 'unknown';
        const adoptionSpeed = (resp.q27_adoption_speed as string) || '';
        const aiFlavors = (resp.q25_ai_flavors as string[]) || [];
        const aiKnowledge = (resp.q26_ai_knowledge as number) || 0;
        const aiRole = (resp.q28_ai_role as string) || '';
        const aiConcerns = (resp.q29_ai_concerns as string[]) || [];
        const sacred = (resp.q30_sacred as string) || '';
        const working = (resp.q31_working_ai_tools as string) || '';

        // Adoption
        if (adoptionSpeed) {
            adoptionCounts[adoptionSpeed] = (adoptionCounts[adoptionSpeed] || 0) + 1;
        }

        // Flavors
        aiFlavors.forEach((f) => {
            if (f !== 'none') {
                flavorCounts[f] = (flavorCounts[f] || 0) + 1;
            }
        });

        // Knowledge
        if (aiKnowledge > 0) {
            knowledgeScores.push({ name, role, score: aiKnowledge });
        }

        // AI role beliefs
        if (aiRole) {
            aiRoleCounts[aiRole] = (aiRoleCounts[aiRole] || 0) + 1;
        }

        // Concerns
        aiConcerns.forEach((c) => {
            concernCounts[c] = (concernCounts[c] || 0) + 1;
        });

        // Sacred quotes
        if (sacred.length > 10) {
            sacredQuotes.push({ name, role, quote: sacred });
        }

        // Working tools
        if (working.length > 5 && working.toLowerCase() !== 'n/a') {
            workingTools.push({ name, tools: working });
        }

        // Readiness
        if (r.ai_readiness_score != null) {
            totalReadiness += r.ai_readiness_score;
            readinessCount++;
        }
    });

    const avgReadiness = readinessCount > 0 ? totalReadiness / readinessCount : 0;

    return {
        adoptionCounts,
        flavorCounts,
        knowledgeScores,
        concernCounts,
        aiRoleCounts,
        sacredQuotes,
        workingTools,
        avgReadiness,
    };
}

export function AIReadiness({ responses }: AIReadinessProps) {
    const totalRespondents = responses.length;
    const {
        adoptionCounts,
        flavorCounts,
        knowledgeScores,
        concernCounts,
        aiRoleCounts,
        sacredQuotes,
        workingTools,
        avgReadiness,
    } = aggregateReadiness(responses);

    // Sort concerns by count
    const sortedConcerns = Object.entries(concernCounts)
        .sort(([, a], [, b]) => b - a);

    // All 6 flavors for radar display
    const allFlavors = Object.keys(FLAVOR_LABELS);
    const maxFlavorCount = Math.max(...allFlavors.map((f) => flavorCounts[f] || 0), 1);

    // AI Role distribution for donut
    const aiRoleEntries = Object.entries(aiRoleCounts).sort(([, a], [, b]) => b - a);
    const aiRoleColors = [BRAND_COLORS.primary, BRAND_COLORS.dark, BRAND_COLORS.medium, '#94a3b8'];

    if (totalRespondents === 0) {
        return (
            <div className="space-y-8">
                <NeoCard>
                    <div className="text-center py-12 text-gray-400">
                        <p className="text-lg">No responses yet</p>
                        <p className="text-sm mt-2">AI Readiness data will appear once surveys are completed.</p>
                    </div>
                </NeoCard>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Team Readiness Gauge + Adoption Curve Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Team Readiness Gauge */}
                <NeoCard className="flex flex-col items-center justify-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                        Team AI Readiness
                    </p>
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                            <circle
                                cx="50" cy="50" r="42" fill="transparent"
                                stroke={avgReadiness > 50 ? BRAND_COLORS.primary : avgReadiness > 25 ? '#f59e0b' : '#ef4444'}
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={`${(avgReadiness / 100) * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                                style={{ transition: 'stroke-dasharray 1s ease-out' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-gray-900">{Math.round(avgReadiness)}%</span>
                            <span className="text-xs text-gray-400">Average</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 text-center">
                        {avgReadiness < 25
                            ? 'Early stage — focus on awareness'
                            : avgReadiness < 50
                                ? 'Growing — accelerate with champions'
                                : avgReadiness < 75
                                    ? 'Maturing — expand use cases'
                                    : 'Advanced — optimize & innovate'}
                    </p>
                </NeoCard>

                {/* Adoption Curve */}
                <NeoCard className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Adoption Curve</h3>
                    <p className="text-sm text-gray-400 mb-6">Where does your team fall on the technology adoption spectrum?</p>
                    <div className="flex items-end gap-3 h-40">
                        {ADOPTION_ORDER.map((speed) => {
                            const count = adoptionCounts[speed] || 0;
                            const pct = totalRespondents > 0 ? (count / totalRespondents) * 100 : 0;
                            const barHeight = Math.max(pct * 1.2, count > 0 ? 15 : 4);
                            return (
                                <div key={speed} className="flex-1 flex flex-col items-center gap-2">
                                    <span className="text-lg font-bold text-gray-900">{count}</span>
                                    <div
                                        className="w-full rounded-t-xl transition-all duration-700 ease-out"
                                        style={{
                                            height: `${barHeight}%`,
                                            backgroundColor: ADOPTION_COLORS[speed],
                                            opacity: count > 0 ? 1 : 0.2,
                                        }}
                                    />
                                    <span className="text-xs font-medium text-gray-500 text-center">
                                        {ADOPTION_LABELS[speed]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-4 px-2">
                        <span className="text-xs text-gray-400">← Early adopters</span>
                        <span className="text-xs text-gray-400">Late adopters →</span>
                    </div>
                </NeoCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Flavors Breakdown */}
                <NeoCard>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Flavors Adopted</h3>
                    <p className="text-sm text-gray-400 mb-6">Which categories of AI tools has the team tried?</p>
                    <div className="space-y-3">
                        {allFlavors.map((flavor) => {
                            const count = flavorCounts[flavor] || 0;
                            const pct = (count / totalRespondents) * 100;
                            const info = FLAVOR_LABELS[flavor];
                            return (
                                <div key={flavor}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <span>{info?.emoji}</span>
                                            {info?.label || flavor}
                                        </span>
                                        <span className="text-sm text-gray-500">{count}/{totalRespondents}</span>
                                    </div>
                                    <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                                        <div
                                            className="h-full rounded-lg transition-all duration-700 ease-out flex items-center"
                                            style={{
                                                width: `${Math.max(pct, 2)}%`,
                                                background: count > 0
                                                    ? `linear-gradient(90deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.dark} 100%)`
                                                    : '#e2e8f0',
                                                opacity: count > 0 ? 0.5 + (count / maxFlavorCount) * 0.5 : 0.3,
                                            }}
                                        >
                                            {pct >= 20 && (
                                                <span className="text-xs font-semibold text-white pl-3">
                                                    {Math.round(pct)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4 p-3 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-500">
                            <span className="font-semibold">Gap alert:</span>{' '}
                            {allFlavors.filter((f) => !flavorCounts[f]).length > 0
                                ? `${allFlavors.filter((f) => !flavorCounts[f]).map((f) => FLAVOR_LABELS[f].label).join(', ')} — untouched by the team. Training opportunity.`
                                : 'Team has explored all AI categories. Great breadth!'}
                        </p>
                    </div>
                </NeoCard>

                {/* Knowledge Distribution */}
                <NeoCard>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Knowledge Spread</h3>
                    <p className="text-sm text-gray-400 mb-6">Self-rated AI knowledge (1-10 scale)</p>

                    {/* Scale visualization */}
                    <div className="relative mt-4 mb-8">
                        {/* Scale bar */}
                        <div className="h-3 bg-gradient-to-r from-gray-200 via-yellow-200 to-green-300 rounded-full" />

                        {/* Scale labels */}
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-gray-400">&quot;What&apos;s a prompt?&quot;</span>
                            <span className="text-xs text-gray-400">&quot;I could teach a workshop&quot;</span>
                        </div>

                        {/* Dots for each person */}
                        {knowledgeScores.map((item, index) => (
                            <div
                                key={index}
                                className="absolute -top-1"
                                style={{
                                    left: `${((item.score - 1) / 9) * 100}%`,
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                <div className="relative group cursor-pointer">
                                    <div
                                        className="w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white"
                                        style={{ backgroundColor: BRAND_COLORS.primary }}
                                    >
                                        {item.score}
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-gray-300">{ROLE_LABELS[item.role] || item.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats summary */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                        <div className="text-center p-3 rounded-xl bg-gray-50">
                            <p className="text-xs text-gray-400">Low</p>
                            <p className="text-lg font-bold text-gray-900">
                                {Math.min(...knowledgeScores.map((k) => k.score))}
                            </p>
                        </div>
                        <div className="text-center p-3 rounded-xl" style={{ backgroundColor: `${BRAND_COLORS.primary}10` }}>
                            <p className="text-xs text-gray-400">Average</p>
                            <p className="text-lg font-bold" style={{ color: BRAND_COLORS.primary }}>
                                {(knowledgeScores.reduce((s, k) => s + k.score, 0) / knowledgeScores.length).toFixed(1)}
                            </p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-gray-50">
                            <p className="text-xs text-gray-400">High</p>
                            <p className="text-lg font-bold text-gray-900">
                                {Math.max(...knowledgeScores.map((k) => k.score))}
                            </p>
                        </div>
                    </div>
                </NeoCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Concerns */}
                <NeoCard>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Top AI Concerns</h3>
                    <p className="text-sm text-gray-400 mb-4">What worries your team about AI adoption?</p>
                    <div className="space-y-3">
                        {sortedConcerns.map(([concern, count], index) => (
                            <div
                                key={concern}
                                className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                                style={{ backgroundColor: index === 0 ? `${BRAND_COLORS.primary}08` : 'transparent' }}
                            >
                                <span
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                                    style={{
                                        backgroundColor: `${BRAND_COLORS.primary}15`,
                                        color: BRAND_COLORS.primary,
                                    }}
                                >
                                    {count}
                                </span>
                                <span className="text-sm font-medium text-gray-700 flex-1">
                                    {CONCERN_LABELS[concern] || concern.replace(/-/g, ' ')}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {Math.round((count / totalRespondents) * 100)}%
                                </span>
                            </div>
                        ))}
                        {sortedConcerns.length === 0 && (
                            <p className="text-sm text-gray-400 italic">No concerns reported.</p>
                        )}
                    </div>
                </NeoCard>

                {/* AI Role Beliefs Donut */}
                <NeoCard>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Role Beliefs</h3>
                    <p className="text-sm text-gray-400 mb-6">What role should AI play in creative work?</p>
                    <div className="flex items-center justify-center">
                        <div className="relative w-44 h-44">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {aiRoleEntries.map(([, count], index) => {
                                    const pct = (count / totalRespondents) * 100;
                                    const circumference = 2 * Math.PI * 38;
                                    const previousPct = aiRoleEntries
                                        .slice(0, index)
                                        .reduce((sum, [, c]) => sum + (c / totalRespondents) * 100, 0);
                                    return (
                                        <circle
                                            key={index}
                                            cx="50" cy="50" r="38" fill="transparent"
                                            stroke={aiRoleColors[index % aiRoleColors.length]}
                                            strokeWidth="18"
                                            strokeDasharray={`${(pct / 100) * circumference} ${circumference}`}
                                            strokeDashoffset={-(previousPct / 100) * circumference}
                                        />
                                    );
                                })}
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm text-gray-400 text-center leading-tight">
                                    {totalRespondents}<br />
                                    <span className="text-xs">votes</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2 mt-6">
                        {aiRoleEntries.map(([role, count], index) => (
                            <div key={role} className="flex items-center gap-2 text-sm">
                                <span
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: aiRoleColors[index % aiRoleColors.length] }}
                                />
                                <span className="text-gray-600 flex-1 text-xs leading-tight">
                                    {AI_ROLE_LABELS[role] || role.replace(/-/g, ' ')}
                                </span>
                                <span className="font-semibold text-gray-800">{Math.round((count / totalRespondents) * 100)}%</span>
                            </div>
                        ))}
                    </div>
                </NeoCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sacred Quotes */}
                <NeoCard>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">What&apos;s Sacred</h3>
                    <p className="text-sm text-gray-400 mb-4">What your team wants to keep human</p>
                    <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                        {sacredQuotes.length > 0 ? sacredQuotes.map((item, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-xl relative"
                                style={{ backgroundColor: `${BRAND_COLORS.primary}08` }}
                            >
                                <div className="absolute top-3 left-4 text-2xl opacity-20" style={{ color: BRAND_COLORS.primary }}>
                                    ✦
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed pl-5 italic">
                                    &ldquo;{item.quote}&rdquo;
                                </p>
                                <p className="text-xs text-gray-400 mt-2 pl-5">
                                    — {item.name}, {ROLE_LABELS[item.role] || item.role.replace(/-/g, ' ')}
                                </p>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-400 italic">No sacred elements shared yet.</p>
                        )}
                    </div>
                </NeoCard>

                {/* Working AI Tools */}
                <NeoCard>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Already Working 🚀</h3>
                    <p className="text-sm text-gray-400 mb-4">AI tools your team is successfully using today</p>
                    <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                        {workingTools.length > 0 ? workingTools.map((item, index) => (
                            <div key={index} className="p-4 rounded-xl bg-gray-50">
                                <p className="text-sm text-gray-700 leading-relaxed">{item.tools}</p>
                                <p className="text-xs text-gray-400 mt-2">— {item.name}</p>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-400 italic">No AI tools reported as working well yet.</p>
                        )}
                    </div>
                    {workingTools.length > 0 && (
                        <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: `${BRAND_COLORS.primary}08` }}>
                            <p className="text-xs" style={{ color: BRAND_COLORS.primary }}>
                                💡 <span className="font-semibold">Insight:</span> Build on these existing wins — the team already trusts AI for these tasks.
                            </p>
                        </div>
                    )}
                </NeoCard>
            </div>
        </div>
    );
}
