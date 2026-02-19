'use client';

import { useState } from 'react';
import { NeoCard } from '@/components/ui';
import { BRAND_COLORS } from '@/lib/colors';
import { SURVEY_QUESTIONS } from '@/lib/constants';

interface ResponseData {
    responses: Record<string, unknown>;
    archetype: string | null;
    weekly_friction_hours: number | null;
}

interface ROISimulatorProps {
    responses: ResponseData[];
}

const FRICTION_LABELS: Record<string, string> = {};
SURVEY_QUESTIONS.q13?.options?.forEach((opt) => {
    FRICTION_LABELS[opt.value] = opt.label;
});

const ROLE_LABELS: Record<string, string> = {};
SURVEY_QUESTIONS.q3?.options?.forEach((opt) => {
    ROLE_LABELS[opt.value] = opt.label;
});

function calculateROI(responses: ResponseData[], hourlyRate: number, reductionPct: number) {
    const totalFrictionHoursPerWeek = responses.reduce(
        (sum, r) => sum + (r.weekly_friction_hours || 0), 0
    );
    const avgFrictionPerPerson = totalFrictionHoursPerWeek / (responses.length || 1);

    // Friction by type
    const frictionByType: Record<string, { count: number; totalHours: number }> = {};
    responses.forEach((r) => {
        const resp = r.responses || {};
        const frictionTypes = (resp.q13_friction_types as string[]) || [];
        const totalHrs = (r.weekly_friction_hours || 0);
        const frictionAlloc = (resp.q14_friction_hours as Record<string, number>) || {};

        frictionTypes.forEach((ft) => {
            if (!frictionByType[ft]) frictionByType[ft] = { count: 0, totalHours: 0 };
            frictionByType[ft].count += 1;
            frictionByType[ft].totalHours += frictionAlloc[ft] || (totalHrs / frictionTypes.length);
        });
    });

    // By role
    const roleData: Record<string, { count: number; totalHours: number }> = {};
    responses.forEach((r) => {
        const resp = r.responses || {};
        const role = (resp.q3_role as string) || 'unknown';
        if (!roleData[role]) roleData[role] = { count: 0, totalHours: 0 };
        roleData[role].count += 1;
        roleData[role].totalHours += (r.weekly_friction_hours || 0);
    });

    const weeklyReclaim = totalFrictionHoursPerWeek * (reductionPct / 100);
    const monthlyReclaim = weeklyReclaim * 4.33;
    const quarterlyReclaim = monthlyReclaim * 3;
    const annualReclaim = monthlyReclaim * 12;

    return {
        totalFrictionHoursPerWeek,
        avgFrictionPerPerson,
        weeklyReclaim,
        monthlyReclaim,
        quarterlyReclaim,
        annualReclaim,
        weeklySavings: weeklyReclaim * hourlyRate,
        monthlySavings: monthlyReclaim * hourlyRate,
        quarterlySavings: quarterlyReclaim * hourlyRate,
        annualSavings: annualReclaim * hourlyRate,
        frictionByType,
        roleData,
    };
}

export function ROISimulator({ responses }: ROISimulatorProps) {
    const [hourlyRate, setHourlyRate] = useState(75);
    const [reductionPct, setReductionPct] = useState(30);

    const roi = calculateROI(responses, hourlyRate, reductionPct);

    const sortedFriction = Object.entries(roi.frictionByType)
        .filter(([key]) => key !== 'other')
        .sort(([, a], [, b]) => b.totalHours - a.totalHours);

    const sortedRoles = Object.entries(roi.roleData)
        .sort(([, a], [, b]) => b.totalHours - a.totalHours);

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
            {/* Controls */}
            <NeoCard className="relative overflow-hidden">
                <div className="neo-top-accent" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">ROI Configuration</h3>
                <p className="text-sm text-gray-400 mb-6">Adjust parameters to model the impact of AI-driven friction reduction</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Average Hourly Rate (blended cost)
                        </label>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-lg">$</span>
                            <input
                                type="number"
                                value={hourlyRate}
                                onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value)))}
                                className="neo-inset px-4 py-2.5 rounded-xl text-lg font-semibold w-28 text-center"
                                min={0}
                                step={5}
                            />
                            <span className="text-sm text-gray-400">/hour</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Include salary, overhead, and opportunity cost</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Estimated Friction Reduction
                        </label>
                        <p className="text-xs text-gray-400 mb-2">What % of reported friction hours could AI tools and process improvements eliminate?</p>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                value={reductionPct}
                                onChange={(e) => setReductionPct(Number(e.target.value))}
                                min={10}
                                max={70}
                                step={5}
                                className="flex-1 accent-teal-600"
                            />
                            <span
                                className="text-lg font-bold w-14 text-center"
                                style={{ color: BRAND_COLORS.primary }}
                            >
                                {reductionPct}%
                            </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Conservative (10%)</span>
                            <span>Aggressive (70%)</span>
                        </div>
                    </div>
                </div>
            </NeoCard>

            {/* Impact Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Weekly Savings', hours: roi.weeklyReclaim, dollars: roi.weeklySavings },
                    { label: 'Monthly Savings', hours: roi.monthlyReclaim, dollars: roi.monthlySavings },
                    { label: 'Quarterly Savings', hours: roi.quarterlyReclaim, dollars: roi.quarterlySavings },
                    { label: 'Annual Savings', hours: roi.annualReclaim, dollars: roi.annualSavings },
                ].map((item) => (
                    <NeoCard key={item.label} className="text-center">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{item.label}</p>
                        <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.primary }}>
                            ${item.dollars >= 1000 ? `${(item.dollars / 1000).toFixed(1)}k` : Math.round(item.dollars)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{item.hours.toFixed(1)} hours</p>
                    </NeoCard>
                ))}
            </div>

            {/* Before/After Comparison */}
            <NeoCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Before → After</h3>
                <p className="text-sm text-gray-400 mb-6">Projected impact of {reductionPct}% friction reduction</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current State */}
                    <div className="p-5 rounded-xl bg-red-50/60 border border-red-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-3">Current State</p>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Total friction / week</span>
                                <span className="font-bold text-red-600">{roi.totalFrictionHoursPerWeek.toFixed(1)}h</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Per person / week</span>
                                <span className="font-bold text-red-600">{roi.avgFrictionPerPerson.toFixed(1)}h</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Monthly cost</span>
                                <span className="font-bold text-red-600">
                                    ${(roi.totalFrictionHoursPerWeek * 4.33 * hourlyRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Annual cost</span>
                                <span className="font-bold text-red-600">
                                    ${(roi.totalFrictionHoursPerWeek * 52 * hourlyRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* After State */}
                    <div
                        className="p-5 rounded-xl border"
                        style={{ backgroundColor: `${BRAND_COLORS.primary}08`, borderColor: `${BRAND_COLORS.primary}20` }}
                    >
                        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: BRAND_COLORS.primary }}>
                            After AI Intervention
                        </p>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Total friction / week</span>
                                <span className="font-bold" style={{ color: BRAND_COLORS.primary }}>
                                    {(roi.totalFrictionHoursPerWeek - roi.weeklyReclaim).toFixed(1)}h
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Per person / week</span>
                                <span className="font-bold" style={{ color: BRAND_COLORS.primary }}>
                                    {(roi.avgFrictionPerPerson * (1 - reductionPct / 100)).toFixed(1)}h
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Monthly cost</span>
                                <span className="font-bold" style={{ color: BRAND_COLORS.primary }}>
                                    ${((roi.totalFrictionHoursPerWeek - roi.weeklyReclaim) * 4.33 * hourlyRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Annual cost</span>
                                <span className="font-bold" style={{ color: BRAND_COLORS.primary }}>
                                    ${((roi.totalFrictionHoursPerWeek - roi.weeklyReclaim) * 52 * hourlyRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </NeoCard>

            {/* ROI by Friction Type */}
            <NeoCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Savings by Friction Type</h3>
                <p className="text-sm text-gray-400 mb-4">Where the biggest ROI opportunities live</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Friction Type</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-600">People</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-600">Hours/Week</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-600">Reclaimable</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">Monthly Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedFriction.map(([type, data]) => {
                                const reclaimable = data.totalHours * (reductionPct / 100);
                                const monthlyValue = reclaimable * 4.33 * hourlyRate;
                                return (
                                    <tr key={type} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-gray-900">
                                            {FRICTION_LABELS[type] || type.replace(/-/g, ' ')}
                                        </td>
                                        <td className="text-center py-3 px-4 text-gray-600">{data.count}</td>
                                        <td className="text-center py-3 px-4 text-gray-800 font-semibold">{data.totalHours.toFixed(1)}h</td>
                                        <td className="text-center py-3 px-4" style={{ color: BRAND_COLORS.primary }}>
                                            {reclaimable.toFixed(1)}h
                                        </td>
                                        <td className="text-right py-3 px-4 font-bold" style={{ color: BRAND_COLORS.primary }}>
                                            ${monthlyValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </NeoCard>

            {/* ROI by Role */}
            <NeoCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Savings by Role</h3>
                <p className="text-sm text-gray-400 mb-4">Which roles benefit most from intervention?</p>
                <div className="space-y-4">
                    {sortedRoles.map(([role, data]) => {
                        const reclaimable = data.totalHours * (reductionPct / 100);
                        const monthlyValue = reclaimable * 4.33 * hourlyRate;
                        const barPct = (data.totalHours / (sortedRoles[0]?.[1]?.totalHours || 1)) * 100;
                        return (
                            <div key={role}>
                                <div className="flex justify-between mb-1.5">
                                    <span className="text-sm font-medium text-gray-700">
                                        {ROLE_LABELS[role] || role.replace(/-/g, ' ')}
                                        <span className="text-gray-400 ml-1">({data.count})</span>
                                    </span>
                                    <span className="text-sm font-bold" style={{ color: BRAND_COLORS.primary }}>
                                        ${monthlyValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                                    </span>
                                </div>
                                <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                                    <div
                                        className="h-full rounded-lg transition-all duration-500"
                                        style={{
                                            width: `${barPct}%`,
                                            background: `linear-gradient(90deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.dark} 100%)`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </NeoCard>
        </div>
    );
}
