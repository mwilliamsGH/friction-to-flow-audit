'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { NeoCard } from '@/components/ui';
import {
  HeaderSection,
  EvolutionaryStrategy,
  SkillSignature,
  EvidenceLayer,
  MagicButtonSection,
  ToolkitSection,
} from '@/components/dashboard';
import { SurveyResponse, AIOutput, ToolConfig, SurveyResponses, ArchetypeId, User } from '@/types';
import Link from 'next/link';

export default function AdminAuditPage() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surveyResponse, setSurveyResponse] = useState<SurveyResponse | null>(null);
  const [aiOutput, setAiOutput] = useState<AIOutput | null>(null);
  const [toolConfigs, setToolConfigs] = useState<Record<string, string | null>>({});
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    loadAuditData();
  }, [id]);

  async function loadAuditData() {
    try {
      const supabase = createSupabaseBrowserClient();

      const { data: response, error: responseError } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('id', id)
        .single();

      if (responseError || !response) {
        setError('not_found');
        setLoading(false);
        return;
      }

      const surveyRow = response as SurveyResponse;
      setSurveyResponse(surveyRow);

      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', surveyRow.user_id)
        .single();

      if (user) {
        setUserName((user as User).name || (user as User).email);
      }

      const { data: aiData, error: aiError } = await supabase
        .from('ai_outputs')
        .select('*')
        .eq('response_id', id)
        .single();

      if (aiError && aiError.code !== 'PGRST116') {
        console.error('AI Output error:', aiError);
      }

      if (aiData) {
        setAiOutput(aiData as AIOutput);
      }

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
      console.error('Audit load error:', err);
      setError('Failed to load audit data');
      setLoading(false);
    }
  }

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
          <p className="text-gray-600">Loading audit...</p>
        </div>
      </div>
    );
  }

  if (error === 'not_found') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <NeoCard className="max-w-md text-center">
          <div className="w-16 h-16 neo-card rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="w-8 h-8 text-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Audit Not Found</h2>
          <p className="text-gray-600 mb-4">This audit response could not be found.</p>
          <Link href="/admin" className="text-primary font-medium hover:text-primary-hover">
            Back to Admin Dashboard
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
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Admin
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Friction-to-Flow Audit
            </h1>
            <p className="text-sm text-gray-500 uppercase tracking-wider">
              Autside Agency • {userName ? `Audit for ${userName}` : 'Individual Response'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Completed</p>
            <p className="text-sm text-gray-600">
              {surveyResponse.completed_at
                ? new Date(surveyResponse.completed_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Unknown'}
            </p>
          </div>
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

        {/* Evolutionary Strategy & Skill Signature */}
        <EvolutionaryStrategy
          narrative={aiOutput?.narrative || 'AI-generated analysis has not been produced for this audit yet.'}
          coreRecommendation={aiOutput?.core_recommendation || 'Pending generation.'}
          onExploreToolkit={aiOutput?.toolkit_recommendations?.toolkit ? scrollToToolkit : undefined}
        >
          <SkillSignature data={responses.q16_time_allocation || { creative: 25, production: 25, communication: 25, admin: 25 }} />
        </EvolutionaryStrategy>

        {/* Deep Insights Divider */}
        <div className="flex items-center gap-4 py-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Deep Insights & Data</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Evidence Layer */}
        <EvidenceLayer responses={responses} />

        {/* AI-Generated Sections */}
        {aiOutput?.automation_opportunities?.automations && (
          <MagicButtonSection
            automations={aiOutput.automation_opportunities.automations}
            frictionContext={`Based on high friction in ${responses.q13_friction_types?.slice(0, 2).join(' and ').replace(/-/g, ' ')}, these tailored automations are designed to reclaim ${Math.round((surveyResponse.weekly_friction_hours || 0) * 0.2)} hours of weekly capacity.`}
          />
        )}

        {aiOutput?.toolkit_recommendations?.toolkit && (
          <ToolkitSection
            toolkit={aiOutput.toolkit_recommendations.toolkit}
            tutorialUrls={toolConfigs}
          />
        )}

        {/* Placeholder when AI pipeline has not run for this response */}
        {!aiOutput && (
          <NeoCard className="p-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 neo-inset-circle flex items-center justify-center text-gray-400 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">AI Recommendations Not Yet Generated</h4>
                <p className="text-sm text-gray-500">
                  The Magic Button automations and Curated Toolkit for this audit have not been generated yet. They will appear here once the AI pipeline has run for this response.
                </p>
              </div>
            </div>
          </NeoCard>
        )}
      </div>
    </div>
  );
}
