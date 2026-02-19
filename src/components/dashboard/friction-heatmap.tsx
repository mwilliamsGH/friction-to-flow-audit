'use client';

import { NeoCard } from '@/components/ui';
import { BRAND_COLORS } from '@/lib/colors';
import { SURVEY_QUESTIONS } from '@/lib/constants';

interface ResponseData {
    responses: Record<string, unknown>;
    archetype: string | null;
    weekly_friction_hours: number | null;
    users?: { name: string | null } | null;
}

interface FrictionHeatmapProps {
    responses: ResponseData[];
}

// Readable labels for friction loop values
const FRICTION_LABELS: Record<string, string> = {
    'the-pivot': 'The Pivot',
    'the-asset-hunt': 'The Asset Hunt',
    'the-versioning-loop': 'The Versioning Loop',
    'the-seasonal-rollout': 'The Seasonal Rollout',
    'the-approval-chase': 'The Approval Chase',
    'the-format-shuffle': 'The Format Shuffle',
    'the-handoff-gap': 'The Handoff Gap',
};

// Readable labels for roles
const ROLE_LABELS: Record<string, string> = {};
SURVEY_QUESTIONS.q3?.options?.forEach((opt) => {
    ROLE_LABELS[opt.value] = opt.label;
});

// Readable labels for slowdowns
const SLOWDOWN_LABELS: Record<string, string> = {};
SURVEY_QUESTIONS.q9?.options?.forEach((opt) => {
    SLOWDOWN_LABELS[opt.value] = opt.label;
});

function aggregateFriction(responses: ResponseData[]) {
    const frictionCounts: Record<string, number> = {};
    const frictionByRole: Record<string, Record<string, number>> = {};
    const frictionHours: Record<string, number[]> = {};
    const slowdownCounts: Record<string, number> = {};
    const roleHours: Record<string, number[]> = {};
    const specificTasks: { name: string; role: string; task: string }[] = [];

    responses.forEach((r) => {
        const resp = r.responses || {};
        const role = (resp.q3_role as string) || 'unknown';
        const frictionTypes = (resp.q13_friction_types as string[]) || [];
        const totalFriction = (resp.q15_total_friction_hours as number) || (r.weekly_friction_hours || 0);
        const frictionAlloc = (resp.q14_friction_hours as Record<string, number>) || {};
        const slowdown = (resp.q9_slowdown as string) || '';
        const name = (resp.q1_name as string) || 'Anonymous';
        const specificTask = (resp.q17_specific_task as string) || '';

        // Count friction types
        frictionTypes.forEach((ft) => {
            frictionCounts[ft] = (frictionCounts[ft] || 0) + 1;

            // By role
            if (!frictionByRole[ft]) frictionByRole[ft] = {};
            frictionByRole[ft][role] = (frictionByRole[ft][role] || 0) + 1;

            // Hours per friction type
            if (!frictionHours[ft]) frictionHours[ft] = [];
            const hours = frictionAlloc[ft] || (totalFriction / frictionTypes.length);
            frictionHours[ft].push(hours);
        });

        // Slowdowns
        if (slowdown) {
            slowdownCounts[slowdown] = (slowdownCounts[slowdown] || 0) + 1;
        }

        // Role hours
        if (!roleHours[role]) roleHours[role] = [];
        roleHours[role].push(totalFriction);

        // Specific tasks
        if (specificTask.length > 10) {
            specificTasks.push({ name, role, task: specificTask });
        }
    });

    return { frictionCounts, frictionByRole, frictionHours, slowdownCounts, roleHours, specificTasks };
}

export function FrictionHeatmap({ responses }: FrictionHeatmapProps) {
    const totalRespondents = responses.length;
    const {
        frictionCounts,
        frictionHours,
        slowdownCounts,
        roleHours,
        specificTasks,
    } = aggregateFriction(responses);

    // Sort friction types by frequency
    const sortedFriction = Object.entries(frictionCounts)
        .filter(([key]) => key !== 'other')
        .sort(([, a], [, b]) => b - a);

    const topFriction = sortedFriction[0];

    // Sort roles by avg hours
    const roleAvgHours = Object.entries(roleHours)
        .map(([role, hours]) => ({
            role,
            avg: hours.reduce((s, h) => s + h, 0) / hours.length,
            count: hours.length,
        }))
        .sort((a, b) => b.avg - a.avg);

    // Max for scaling bars
    const maxFrictionCount = sortedFriction.length > 0 ? sortedFriction[0][1] : 1;
    const maxRoleAvg = roleAvgHours.length > 0 ? roleAvgHours[0].avg : 1;

    // Sorted slowdowns
    const sortedSlowdowns = Object.entries(slowdownCounts)
        .sort(([, a], [, b]) => b - a);

    if (totalRespondents === 0) {
        return (
            <div className="space-y-8">
                <NeoCard>
                    <div className="text-center py-12 text-gray-400">
                        <p className="text-lg">No responses yet</p>
                        <p className="text-sm mt-2">Friction data will appear once surveys are completed.</p>
                    </div>
                </NeoCard>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Hero Drain Card */}
            {topFriction && (
                <NeoCard className="relative overflow-hidden">
                    <div className="neo-top-accent" />
                    <div className="flex items-start gap-6">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                            style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
                        >
                            🔥
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                                #1 Agency Drain
                            </p>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {FRICTION_LABELS[topFriction[0]] || topFriction[0]}
                            </h3>
                            <div className="flex flex-wrap gap-4 mt-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Affects</span>
                                    <span className="text-lg font-bold" style={{ color: BRAND_COLORS.primary }}>
                                        {Math.round((topFriction[1] / totalRespondents) * 100)}%
                                    </span>
                                    <span className="text-sm text-gray-500">of team</span>
                                </div>
                                <div className="text-gray-300">|</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Avg</span>
                                    <span className="text-lg font-bold" style={{ color: BRAND_COLORS.primary }}>
                                        {frictionHours[topFriction[0]]
                                            ? (frictionHours[topFriction[0]].reduce((s, h) => s + h, 0) / frictionHours[topFriction[0]].length).toFixed(1)
                                            : '–'}h
                                    </span>
                                    <span className="text-sm text-gray-500">per person/week</span>
                                </div>
                                <div className="text-gray-300">|</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">{topFriction[1]} of {totalRespondents}</span>
                                    <span className="text-sm text-gray-500">respondents</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </NeoCard>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Friction Frequency Chart */}
                <NeoCard>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Friction Frequency</h3>
                    <p className="text-sm text-gray-400 mb-6">How often each friction loop is reported</p>
                    <div className="space-y-4">
                        {sortedFriction.map(([frictionType, count], index) => {
                            const pct = (count / maxFrictionCount) * 100;
                            const affectedPct = Math.round((count / totalRespondents) * 100);
                            return (
                                <div key={frictionType}>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-sm font-medium text-gray-700">
                                            {FRICTION_LABELS[frictionType] || frictionType}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {count} ({affectedPct}%)
                                        </span>
                                    </div>
                                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                                        <div
                                            className="h-full rounded-lg transition-all duration-700 ease-out"
                                            style={{
                                                width: `${pct}%`,
                                                background: `linear-gradient(90deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.dark} 100%)`,
                                                opacity: 1 - index * 0.12,
                                            }}
                                        />
                                        {frictionHours[frictionType] && (
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
                                                ~{(frictionHours[frictionType].reduce((s, h) => s + h, 0) / frictionHours[frictionType].length).toFixed(1)}h avg
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </NeoCard>

                {/* Friction Hours by Role */}
                <NeoCard>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Friction by Role</h3>
                    <p className="text-sm text-gray-400 mb-6">Average weekly friction hours per role</p>
                    <div className="space-y-4">
                        {roleAvgHours.map(({ role, avg, count }) => {
                            const pct = (avg / maxRoleAvg) * 100;
                            return (
                                <div key={role}>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-sm font-medium text-gray-700">
                                            {ROLE_LABELS[role] || role.replace(/-/g, ' ')}
                                        </span>
                                        <span className="text-sm font-bold" style={{ color: BRAND_COLORS.primary }}>
                                            {avg.toFixed(1)}h/wk
                                        </span>
                                    </div>
                                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                                        <div
                                            className="h-full rounded-lg transition-all duration-700 ease-out"
                                            style={{
                                                width: `${pct}%`,
                                                background: avg > 10
                                                    ? `linear-gradient(90deg, #e97451 0%, #c44536 100%)`
                                                    : `linear-gradient(90deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.dark} 100%)`,
                                            }}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                            {count} {count === 1 ? 'person' : 'people'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </NeoCard>
            </div>

            {/* Hours Breakdown Table */}
            <NeoCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Hours Breakdown</h3>
                <p className="text-sm text-gray-400 mb-4">Detailed time cost per friction type</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Friction Type</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-600">Affected</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-600">% of Team</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-600">Avg Hours/Week</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-600">Total Hours/Week</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedFriction.map(([frictionType, count]) => {
                                const hours = frictionHours[frictionType] || [];
                                const avgHrs = hours.length > 0 ? hours.reduce((s, h) => s + h, 0) / hours.length : 0;
                                const totalHrs = hours.reduce((s, h) => s + h, 0);
                                return (
                                    <tr key={frictionType} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-gray-900">
                                            {FRICTION_LABELS[frictionType] || frictionType}
                                        </td>
                                        <td className="text-center py-3 px-4 text-gray-600">{count}</td>
                                        <td className="text-center py-3 px-4">
                                            <span
                                                className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                                style={{
                                                    backgroundColor: `${BRAND_COLORS.primary}15`,
                                                    color: BRAND_COLORS.primary,
                                                }}
                                            >
                                                {Math.round((count / totalRespondents) * 100)}%
                                            </span>
                                        </td>
                                        <td className="text-center py-3 px-4 font-semibold text-gray-800">{avgHrs.toFixed(1)}h</td>
                                        <td className="text-center py-3 px-4 font-bold" style={{ color: BRAND_COLORS.primary }}>
                                            {totalHrs.toFixed(1)}h
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </NeoCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Slowdowns */}
                <NeoCard>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Top Slowdowns</h3>
                    <p className="text-sm text-gray-400 mb-4">What slows your team down most (Q9)</p>
                    <div className="space-y-3">
                        {sortedSlowdowns.map(([slowdown, count]) => (
                            <div key={slowdown} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                                        style={{ backgroundColor: `${BRAND_COLORS.primary}15`, color: BRAND_COLORS.primary }}
                                    >
                                        {count}
                                    </span>
                                    <span className="text-sm font-medium text-gray-700">
                                        {SLOWDOWN_LABELS[slowdown] || slowdown.replace(/-/g, ' ')}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {Math.round((count / totalRespondents) * 100)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </NeoCard>

                {/* Task Quotes */}
                <NeoCard>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">In Their Words</h3>
                    <p className="text-sm text-gray-400 mb-4">Real friction descriptions from your team</p>
                    <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                        {specificTasks.length > 0 ? specificTasks.map((item, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-xl relative"
                                style={{ backgroundColor: `${BRAND_COLORS.primary}08` }}
                            >
                                <div className="absolute top-3 left-4 text-2xl opacity-20" style={{ color: BRAND_COLORS.primary }}>
                                    &ldquo;
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed pl-5 italic">
                                    {item.task}
                                </p>
                                <p className="text-xs text-gray-400 mt-2 pl-5">
                                    — {item.name}, {ROLE_LABELS[item.role] || item.role.replace(/-/g, ' ')}
                                </p>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-400 italic">No specific task descriptions yet.</p>
                        )}
                    </div>
                </NeoCard>
            </div>
        </div>
    );
}
