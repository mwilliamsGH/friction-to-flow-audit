'use client';

import { NeoCard } from '@/components/ui';
import { BRAND_COLORS } from '@/lib/colors';
import { SURVEY_QUESTIONS } from '@/lib/constants';

interface ResponseData {
    responses: Record<string, unknown>;
    archetype: string | null;
    weekly_friction_hours: number | null;
}

interface ProcessGapsProps {
    responses: ResponseData[];
}

const ROLE_LABELS: Record<string, string> = {};
SURVEY_QUESTIONS.q3?.options?.forEach((opt) => {
    ROLE_LABELS[opt.value] = opt.label;
});

const KNOWLEDGE_LABELS: Record<string, { label: string; risk: 'high' | 'medium' | 'low' }> = {
    'in-my-head': { label: 'Keeps it in their head', risk: 'high' },
    'nowhere': { label: "Doesn't retain it — solves again next time", risk: 'high' },
    'personal-notes': { label: 'Personal notes only', risk: 'medium' },
    'teach-directly': { label: 'Teaches others directly', risk: 'medium' },
    'shared-documentation': { label: 'Shared team documentation', risk: 'low' },
};

const DOC_BENEFIT_LABELS: Record<string, string> = {
    'just-me': 'Just me',
    'immediate-team': 'My immediate team',
    'other-departments': 'Other departments',
    'new-hires-freelancers': 'New hires / Freelancers',
    'everyone': 'Everyone at the agency',
};

const RISK_COLORS = {
    high: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: '🔴 High Risk' },
    medium: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: '🟡 Medium Risk' },
    low: { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', label: '🟢 Low Risk' },
};

interface ProcessGap {
    name: string;
    role: string;
    knowledgeStorage: string;
    risk: 'high' | 'medium' | 'low';
    repeatedTask: string;
    specificTask: string;
    docBenefit: string;
    frictionHours: number;
}

function analyzeGaps(responses: ResponseData[]): ProcessGap[] {
    return responses.map((r) => {
        const resp = r.responses || {};
        const storage = (resp.q10_knowledge_storage as string) || '';
        const knowledgeInfo = KNOWLEDGE_LABELS[storage] || { label: storage, risk: 'medium' as const };

        return {
            name: (resp.q1_name as string) || 'Anonymous',
            role: (resp.q3_role as string) || 'unknown',
            knowledgeStorage: storage,
            risk: knowledgeInfo.risk,
            repeatedTask: (resp.q18_repeated_task as string) || '',
            specificTask: (resp.q17_specific_task as string) || '',
            docBenefit: (resp.q22_documentation_benefit as string) || '',
            frictionHours: r.weekly_friction_hours || 0,
        };
    }).sort((a, b) => {
        const riskOrder = { high: 0, medium: 1, low: 2 };
        return riskOrder[a.risk] - riskOrder[b.risk] || b.frictionHours - a.frictionHours;
    });
}

export function ProcessGaps({ responses }: ProcessGapsProps) {
    const gaps = analyzeGaps(responses);

    const riskCounts = {
        high: gaps.filter((g) => g.risk === 'high').length,
        medium: gaps.filter((g) => g.risk === 'medium').length,
        low: gaps.filter((g) => g.risk === 'low').length,
    };

    // Undocumented processes from high-friction people
    const undocumentedProcesses = gaps
        .filter((g) => g.risk !== 'low' && (g.repeatedTask.length > 5 || g.specificTask.length > 5))
        .sort((a, b) => b.frictionHours - a.frictionHours);

    // Who benefits from documentation
    const benefitCounts: Record<string, number> = {};
    gaps.forEach((g) => {
        if (g.docBenefit) {
            benefitCounts[g.docBenefit] = (benefitCounts[g.docBenefit] || 0) + 1;
        }
    });
    const sortedBenefits = Object.entries(benefitCounts).sort(([, a], [, b]) => b - a);

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
            {/* Risk Distribution */}
            <div className="grid grid-cols-3 gap-4">
                {(['high', 'medium', 'low'] as const).map((risk) => {
                    const config = RISK_COLORS[risk];
                    return (
                        <NeoCard
                            key={risk}
                            className="text-center"
                            style={{ borderLeft: `4px solid ${config.color}` } as React.CSSProperties}
                        >
                            <p className="text-sm font-semibold mb-1" style={{ color: config.color }}>
                                {config.label}
                            </p>
                            <p className="text-3xl font-bold text-gray-900">{riskCounts[risk]}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {risk === 'high'
                                    ? 'Knowledge lost when they leave'
                                    : risk === 'medium'
                                        ? 'Known by individual only'
                                        : 'Documented & shared'}
                            </p>
                        </NeoCard>
                    );
                })}
            </div>

            {/* Knowledge Storage Breakdown */}
            <NeoCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Knowledge Storage Map</h3>
                <p className="text-sm text-gray-400 mb-6">Where team knowledge lives today — and who holds it</p>
                <div className="space-y-3">
                    {gaps.map((person, index) => {
                        const riskConfig = RISK_COLORS[person.risk];
                        const knowledgeInfo = KNOWLEDGE_LABELS[person.knowledgeStorage];
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-4 rounded-xl border transition-all"
                                style={{ backgroundColor: riskConfig.bg, borderColor: riskConfig.border }}
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                    style={{ backgroundColor: riskConfig.color }}
                                >
                                    {person.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900">{person.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {ROLE_LABELS[person.role] || person.role.replace(/-/g, ' ')}
                                        <span className="mx-1 text-gray-300">•</span>
                                        {person.frictionHours}h/wk friction
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs font-medium" style={{ color: riskConfig.color }}>
                                        {knowledgeInfo?.label || person.knowledgeStorage.replace(/-/g, ' ')}
                                    </p>
                                    {person.docBenefit && (
                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                            Would help: {DOC_BENEFIT_LABELS[person.docBenefit] || person.docBenefit}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </NeoCard>

            {/* Undocumented Processes to Capture */}
            {undocumentedProcesses.length > 0 && (
                <NeoCard>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Processes to Document First</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Repeated tasks from team members with undocumented knowledge — these are SOPs waiting to be written
                    </p>
                    <div className="space-y-4">
                        {undocumentedProcesses.map((person, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-semibold text-gray-900">{person.name}</span>
                                    <span className="text-xs text-gray-400">
                                        {ROLE_LABELS[person.role] || person.role.replace(/-/g, ' ')}
                                    </span>
                                    <span
                                        className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto"
                                        style={{
                                            backgroundColor: RISK_COLORS[person.risk].bg,
                                            color: RISK_COLORS[person.risk].color,
                                        }}
                                    >
                                        {person.frictionHours}h/wk
                                    </span>
                                </div>

                                {person.repeatedTask.length > 5 && person.repeatedTask.toLowerCase() !== 'none' && (
                                    <div className="mb-2">
                                        <p className="text-xs font-medium text-gray-500 mb-0.5">Repeated Task:</p>
                                        <p className="text-sm text-gray-700 italic">&ldquo;{person.repeatedTask}&rdquo;</p>
                                    </div>
                                )}

                                {person.specificTask.length > 10 && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-0.5">Time-Consuming Task:</p>
                                        <p className="text-sm text-gray-700 italic">
                                            &ldquo;{person.specificTask.substring(0, 200)}{person.specificTask.length > 200 ? '...' : ''}&rdquo;
                                        </p>
                                    </div>
                                )}

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{
                                        backgroundColor: `${BRAND_COLORS.primary}10`,
                                        color: BRAND_COLORS.primary,
                                    }}>
                                        📋 SOP Candidate
                                    </span>
                                    {person.docBenefit && person.docBenefit !== 'just-me' && (
                                        <span className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-600">
                                            Benefits: {DOC_BENEFIT_LABELS[person.docBenefit]}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </NeoCard>
            )}

            {/* Documentation Impact */}
            <NeoCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Documentation Impact</h3>
                <p className="text-sm text-gray-400 mb-4">Who would benefit from documented processes?</p>
                <div className="space-y-3">
                    {sortedBenefits.map(([benefit, count]) => {
                        const pct = (count / responses.length) * 100;
                        return (
                            <div key={benefit}>
                                <div className="flex justify-between mb-1.5">
                                    <span className="text-sm font-medium text-gray-700">
                                        {DOC_BENEFIT_LABELS[benefit] || benefit}
                                    </span>
                                    <span className="text-sm text-gray-500">{count} ({Math.round(pct)}%)</span>
                                </div>
                                <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                                    <div
                                        className="h-full rounded-lg transition-all duration-500"
                                        style={{
                                            width: `${pct}%`,
                                            background: `linear-gradient(90deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.dark} 100%)`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: `${BRAND_COLORS.primary}08` }}>
                    <p className="text-xs" style={{ color: BRAND_COLORS.primary }}>
                        💡 <span className="font-semibold">Key Insight:</span>{' '}
                        {riskCounts.high > 0
                            ? `${riskCounts.high} team member${riskCounts.high > 1 ? 's' : ''} hold knowledge that disappears when they're unavailable. Documenting their top tasks protects the agency.`
                            : riskCounts.medium > 0
                                ? `${riskCounts.medium} team member${riskCounts.medium > 1 ? 's' : ''} keep knowledge in personal notes. Converting these to shared documentation multiplies team capacity.`
                                : 'Great coverage — team knowledge is well documented and shared.'}
                    </p>
                </div>
            </NeoCard>
        </div>
    );
}
