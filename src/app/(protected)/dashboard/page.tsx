'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { NeoCard, NeoButton } from '@/components/ui';
import {
  HeaderSection,
  EvolutionaryStrategy,
  SkillSignature,
  EvidenceLayer,
  MagicButtonSection,
  ToolkitSection,
} from '@/components/dashboard';
import { SurveyResponse, AIOutput, ToolConfig, SurveyResponses, ArchetypeId } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surveyResponse, setSurveyResponse] = useState<SurveyResponse | null>(null);
  const [aiOutput, setAiOutput] = useState<AIOutput | null>(null);
  const [toolConfigs, setToolConfigs] = useState<Record<string, string | null>>({});
  const [historicalResponses, setHistoricalResponses] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('Please log in to view your dashboard');
        setLoading(false);
        return;
      }

      // Fetch all survey responses for this user
      const { data: responsesData, error: responsesError } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (responsesError) throw responsesError;

      const responses = (responsesData || []) as SurveyResponse[];

      if (responses.length === 0) {
        setError('no_survey');
        setLoading(false);
        return;
      }

      // Get the most recent completed survey
      const completedResponses = responses.filter((r) => r.completed_at);
      if (completedResponses.length === 0) {
        setError('survey_incomplete');
        setLoading(false);
        return;
      }

      const latestResponse = completedResponses[0];
      setSurveyResponse(latestResponse);
      setHistoricalResponses(completedResponses);

      // Fetch AI outputs for the latest response
      const { data: aiData, error: aiError } = await supabase
        .from('ai_outputs')
        .select('*')
        .eq('response_id', latestResponse.id)
        .single();

      if (aiError && aiError.code !== 'PGRST116') {
        console.error('AI Output error:', aiError);
      }

      if (aiData) {
        setAiOutput(aiData);
      }

      // Fetch tool configurations
      const { data: configs } = await supabase
        .from('tool_config')
        .select('*');

      if (configs) {
        const configMap: Record<string, string | null> = {};
        configs.forEach((config: ToolConfig) => {
          configMap[config.tool_name] = config.tutorial_url;
        });
        setToolConfigs(configMap);
      }

      setLoading(false);
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  }

  const handleSelectHistoricalResponse = async (responseId: string) => {
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();

      const { data: response } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('id', responseId)
        .single();

      if (response) {
        setSurveyResponse(response);

        const { data: aiData } = await supabase
          .from('ai_outputs')
          .select('*')
          .eq('response_id', responseId)
          .single();

        setAiOutput(aiData || null);
      }
    } catch (err) {
      console.error('Error loading historical response:', err);
    }
    setLoading(false);
  };

  const scrollToToolkit = () => {
    document.getElementById('toolkit')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 neo-card rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse-soft">
            <svg className="w-8 h-8 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error === 'no_survey') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <NeoCard className="max-w-md text-center">
          <div className="w-16 h-16 neo-card rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Survey Yet</h2>
          <p className="text-gray-600 mb-6">
            Complete the Friction-to-Flow audit to receive your personalized AI toolkit recommendations.
          </p>
          <Link href="/survey">
            <NeoButton variant="primary" fullWidth>
              Start Your Audit
            </NeoButton>
          </Link>
        </NeoCard>
      </div>
    );
  }

  if (error === 'survey_incomplete') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <NeoCard className="max-w-md text-center">
          <div className="w-16 h-16 neo-card rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="w-8 h-8 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Survey In Progress</h2>
          <p className="text-gray-600 mb-6">
            You have an incomplete survey. Complete it to see your results.
          </p>
          <Link href="/survey/foundation">
            <NeoButton variant="primary" fullWidth>
              Continue Survey
            </NeoButton>
          </Link>
        </NeoCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <NeoCard className="max-w-md text-center">
          <div className="w-16 h-16 neo-card rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="w-8 h-8 text-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </NeoCard>
      </div>
    );
  }

  if (!surveyResponse) return null;

  const responses = surveyResponse.responses as unknown as SurveyResponses;
  const archetypeId = (surveyResponse.archetype || 'curious-explorer') as ArchetypeId;

  return (
    <div className="min-h-screen pb-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Friction-to-Flow Audit</h1>
            <p className="text-sm text-gray-500 uppercase tracking-wider">
              Autside Agency • Personal Performance
            </p>
          </div>

          {/* Historical dropdown */}
          {historicalResponses.length > 1 && (
            <select
              value={surveyResponse.id}
              onChange={(e) => handleSelectHistoricalResponse(e.target.value)}
              className="neo-input text-sm"
            >
              {historicalResponses.map((r, i) => (
                <option key={r.id} value={r.id}>
                  {i === 0 ? 'Current' : new Date(r.completed_at!).toLocaleDateString()}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Header Section */}
        <HeaderSection
          userName={responses.q1_name}
          archetypeId={archetypeId}
          weeklyFrictionHours={surveyResponse.weekly_friction_hours || 0}
          aiReadinessScore={surveyResponse.ai_readiness_score || 0}
          automationPotential={surveyResponse.automation_potential || 0}
        />

        {/* Evolutionary Strategy */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EvolutionaryStrategy
              narrative={aiOutput?.narrative || 'Your personalized analysis is being generated...'}
              coreRecommendation={aiOutput?.core_recommendation || 'Check back soon for your core recommendation.'}
              onExploreToolkit={scrollToToolkit}
            />
          </div>
          <div className="neo-card p-6">
            <SkillSignature data={responses.q16_time_allocation || { creative: 25, production: 25, communication: 25, admin: 25 }} />
          </div>
        </div>

        {/* Deep Insights Divider */}
        <div className="flex items-center gap-4 py-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Deep Insights & Data</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Evidence Layer */}
        <EvidenceLayer responses={responses} />

        {/* Magic Button Section */}
        {aiOutput?.automation_opportunities?.automations && (
          <MagicButtonSection
            automations={aiOutput.automation_opportunities.automations}
            frictionContext={`Based on your high friction in ${responses.q13_friction_types?.slice(0, 2).join(' and ').replace(/-/g, ' ')}, these tailored automations are designed to reclaim ${Math.round((surveyResponse.weekly_friction_hours || 0) * 0.2)} hours of your weekly capacity immediately.`}
          />
        )}

        {/* Toolkit Section */}
        {aiOutput?.toolkit_recommendations?.toolkit && (
          <ToolkitSection
            toolkit={aiOutput.toolkit_recommendations.toolkit}
            tutorialUrls={toolConfigs}
          />
        )}

        {/* Retake Survey CTA */}
        <NeoCard className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for a fresh perspective?</h3>
          <p className="text-gray-600 mb-4">
            Retake the audit to track your progress and get updated recommendations.
          </p>
          <Link href="/survey">
            <NeoButton variant="secondary">
              Retake Survey
            </NeoButton>
          </Link>
        </NeoCard>
      </div>
    </div>
  );
}
