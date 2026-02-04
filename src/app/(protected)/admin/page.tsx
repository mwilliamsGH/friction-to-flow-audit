'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { NeoCard, NeoButton } from '@/components/ui';
import { StatCard } from '@/components/dashboard';
import { SurveyResponse, User } from '@/types';
import { ARCHETYPES } from '@/lib/constants';
import { BRAND_COLORS } from '@/lib/colors';
import Link from 'next/link';

type TabId = 'overview' | 'heatmap' | 'readiness';

interface ResponseWithUser extends SurveyResponse {
  users?: User;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [responses, setResponses] = useState<ResponseWithUser[]>([]);
  const [stats, setStats] = useState({
    totalRespondents: 0,
    completionRate: 0,
    avgFrictionHours: 0,
    potentialHoursReclaimed: 0,
  });
  const [archetypeDistribution, setArchetypeDistribution] = useState<
    { archetype: string; count: number; percentage: number }[]
  >([]);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    try {
      const supabase = createSupabaseBrowserClient();

      // Fetch all completed survey responses with user data
      const { data: responsesData, error } = await supabase
        .from('survey_responses')
        .select('*, users(*)')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      const typedResponses = (responsesData || []) as ResponseWithUser[];
      setResponses(typedResponses);

      // Calculate stats
      const completed = typedResponses.length;
      const avgFriction =
        completed > 0
          ? typedResponses.reduce((sum, r) => sum + (r.weekly_friction_hours || 0), 0) /
          completed
          : 0;

      setStats({
        totalRespondents: completed,
        completionRate: 94, // Placeholder - would need started but not completed count
        avgFrictionHours: Math.round(avgFriction * 10) / 10,
        potentialHoursReclaimed: Math.round(avgFriction * completed * 4 * 0.3), // 30% reclaim estimate monthly
      });

      // Calculate archetype distribution
      const archetypeCounts: Record<string, number> = {};
      typedResponses.forEach((r) => {
        if (r.archetype) {
          archetypeCounts[r.archetype] = (archetypeCounts[r.archetype] || 0) + 1;
        }
      });

      const distribution = Object.entries(archetypeCounts)
        .map(([archetype, count]) => ({
          archetype,
          count,
          percentage: Math.round((count / completed) * 100),
        }))
        .sort((a, b) => b.count - a.count);

      setArchetypeDistribution(distribution);
      setLoading(false);
    } catch (err) {
      console.error('Admin data load error:', err);
      setLoading(false);
    }
  }

  const tabs = [
    { id: 'overview' as TabId, label: 'Agency Overview', icon: '📊' },
    { id: 'heatmap' as TabId, label: 'Friction Heatmap', icon: '🔥' },
    { id: 'readiness' as TabId, label: 'AI Readiness', icon: '🤖' },
  ];

  // Color palette for archetype distribution
  const archetypeColors = [
    BRAND_COLORS.primary,
    BRAND_COLORS.dark,
    BRAND_COLORS.medium,
    BRAND_COLORS.light,
    BRAND_COLORS.lightest,
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 neo-card rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse-soft">
            <svg
              className="w-8 h-8 text-primary animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Agency Control Center</h1>
        <p className="text-sm text-gray-500 uppercase tracking-wider">
          Autside Agency • Executive Insights
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${activeTab === tab.id
                ? 'neo-button-primary'
                : 'neo-button text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Respondents"
              value={stats.totalRespondents}
              sublabel="+12% growth"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
            />
            <StatCard
              label="Completion"
              value={`${stats.completionRate}%`}
              sublabel="90% target"
              color="green"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <StatCard
              label="Avg. Slog"
              value={`${stats.avgFrictionHours}h`}
              sublabel="Per person/week"
              color="orange"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <StatCard
              label="Potential"
              value={`${stats.potentialHoursReclaimed}h`}
              sublabel="Monthly reclaim"
              color="blue"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              }
            />
          </div>

          {/* Archetype Mix & Recent Responses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Archetype Mix */}
            <NeoCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Archetype Mix</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {/* Donut Chart */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {archetypeDistribution.map((item, index) => {
                      const previousPercentages = archetypeDistribution
                        .slice(0, index)
                        .reduce((sum, i) => sum + i.percentage, 0);
                      const circumference = 2 * Math.PI * 40;
                      const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                      const strokeDashoffset = -(previousPercentages / 100) * circumference;

                      return (
                        <circle
                          key={item.archetype}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke={archetypeColors[index % archetypeColors.length]}
                          strokeWidth="20"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {archetypeDistribution.map((item, index) => (
                  <div key={item.archetype} className="flex items-center gap-2 text-sm">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: archetypeColors[index % archetypeColors.length] }}
                    />
                    <span className="text-gray-600">
                      {ARCHETYPES[item.archetype]?.name || item.archetype}
                    </span>
                  </div>
                ))}
              </div>
            </NeoCard>

            {/* Recent Responses */}
            <NeoCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Responses</h3>
              <div className="space-y-3">
                {responses.slice(0, 5).map((response) => {
                  const surveyResponses = response.responses as Record<string, unknown>;
                  const name = surveyResponses?.q1_name as string || 'Unknown';
                  const role = surveyResponses?.q3_role as string || '';

                  return (
                    <div
                      key={response.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{name}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {role.replace(/-/g, ' ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600">
                          {ARCHETYPES[response.archetype || '']?.name || 'Processing'}
                        </p>
                      </div>
                      <Link
                        href={`/admin/audit/${response.id}`}
                        className="ml-4 text-primary text-sm font-medium hover:text-primary-hover"
                      >
                        View Audit
                      </Link>
                    </div>
                  );
                })}
              </div>
            </NeoCard>
          </div>
        </div>
      )}

      {activeTab === 'heatmap' && (
        <div className="space-y-8">
          <NeoCard>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Friction Heatmap</h3>
            <p className="text-gray-500">
              Friction heatmap visualization showing top pain points across the agency.
            </p>
            {/* Placeholder for heatmap - would use aggregated Q13 data */}
            <div className="mt-6 p-8 bg-gray-50 rounded-xl text-center text-gray-400">
              Heatmap visualization coming soon
            </div>
          </NeoCard>
        </div>
      )}

      {activeTab === 'readiness' && (
        <div className="space-y-8">
          <NeoCard>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Readiness Overview</h3>
            <p className="text-gray-500">
              Team adoption curve and AI concerns summary.
            </p>
            {/* Placeholder for AI readiness charts */}
            <div className="mt-6 p-8 bg-gray-50 rounded-xl text-center text-gray-400">
              AI readiness charts coming soon
            </div>
          </NeoCard>
        </div>
      )}

      {/* Export Button */}
      <div className="mt-8 flex justify-end">
        <NeoButton variant="secondary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export CSV
        </NeoButton>
      </div>
    </div>
  );
}
