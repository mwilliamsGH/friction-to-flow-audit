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
import { TOOLS } from '@/lib/constants';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surveyResponse, setSurveyResponse] = useState<SurveyResponse | null>(null);
  const [aiOutput, setAiOutput] = useState<AIOutput | null>(null);
  const [toolConfigs, setToolConfigs] = useState<Record<string, string | null>>({});
  const [historicalResponses, setHistoricalResponses] = useState<SurveyResponse[]>([]);
  const [explanationOpen, setExplanationOpen] = useState(false);

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

      // Create default tutorial URLs mapping from TOOLS constants
      const defaultTutorialUrls: Record<string, string | null> = {};
      TOOLS.forEach((tool) => {
        if (tool.tutorialUrl) {
          defaultTutorialUrls[tool.name] = tool.tutorialUrl;
        }
      });

      // Fetch tool configurations from database and merge with defaults
      const { data: configs } = await supabase
        .from('tool_config')
        .select('*');

      const configMap: Record<string, string | null> = { ...defaultTutorialUrls };
      if (configs) {
        configs.forEach((config: ToolConfig) => {
          // Only override if database has a non-null value
          if (config.tutorial_url !== null) {
            configMap[config.tool_name] = config.tutorial_url;
          }
        });
      }
      setToolConfigs(configMap);

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
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-wrap">
          <div className="relative min-w-0">
            <h1 className="!text-xl md:!text-3xl font-display !font-bold md:!font-black text-gray-900 flex items-center gap-3 truncate">
              Audit Overview
              <button
                onClick={() => setExplanationOpen(!explanationOpen)}
                className="text-gray-400 hover:text-primary transition-colors focus:outline-none flex-shrink-0"
                aria-label="How was this generated?"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </h1>

            {/* Generation Explanation Popover */}
            {explanationOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setExplanationOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-[85vw] md:w-[400px] z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-6 animate-in fade-in slide-in-from-top-2">
                  <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                    How Your Recommendations Were Generated
                  </h4>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">1</span>
                      <p className="text-xs text-gray-600"><strong>Survey Analysis:</strong> Your responses analyzed for friction patterns, tool usage, and AI readiness.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">2</span>
                      <p className="text-xs text-gray-600"><strong>Archetype Matching:</strong> Matched to 1 of 6 workflow archetypes based on your working style.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">3</span>
                      <p className="text-xs text-gray-600"><strong>AI Generation:</strong> Custom recommendations generated considering your friction points and lost hours.</p>
                    </li>
                  </ul>
                  <button
                    onClick={() => setExplanationOpen(false)}
                    className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            )}

            <p className="text-sm text-gray-500 uppercase tracking-wider mt-1">
              Autside Agency • Personal Performance
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Retake Survey button */}
            <Link href="/survey" className="flex-1 md:flex-none">
              <NeoButton variant="primary" size="sm" className="whitespace-nowrap rounded-full w-full md:w-auto text-center justify-center">
                Retake Survey
              </NeoButton>
            </Link>

            {/* Historical dropdown */}
            {historicalResponses.length > 1 && (
              <select
                value={surveyResponse.id}
                onChange={(e) => handleSelectHistoricalResponse(e.target.value)}
                className="neo-input text-sm flex-1 md:flex-none md:!w-40"
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

        {/* Evolutionary Strategy & Skill Signature - Combined Card */}
        <EvolutionaryStrategy
          narrative={aiOutput?.narrative || 'Your personalized analysis is being generated...'}
          coreRecommendation={aiOutput?.core_recommendation || 'Check back soon for your core recommendation.'}
          onExploreToolkit={scrollToToolkit}
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
      </div>
    </div>
  );
}
