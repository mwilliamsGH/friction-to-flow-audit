'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NeoCard } from '@/components/ui';
import { createSupabaseBrowserClient } from '@/lib/supabase';

interface FeedbackItem {
  id: string;
  user_id: string | null;
  user_email: string | null;
  type: 'question' | 'bug' | 'feature' | 'other';
  message: string;
  created_at: string;
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  question: { label: 'Question', color: 'bg-brand-lightest text-brand-primary' },
  bug: { label: 'Bug Report', color: 'bg-brand-lightest text-brand-dark' },
  feature: { label: 'Feature Request', color: 'bg-brand-light text-brand-dark' },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-700' },
};

export default function AdminFeedbackPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const supabase = createSupabaseBrowserClient();

      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if user is admin
      const { data: userData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!userData || !(userData as { is_admin?: boolean }).is_admin) {
        router.push('/dashboard');
        return;
      }

      setIsAdmin(true);

      // Fetch feedback
      try {
        const response = await fetch('/api/feedback');
        const data = await response.json();

        if (data.success) {
          setFeedback(data.data || []);
        } else {
          setError(data.error || 'Failed to load feedback');
        }
      } catch {
        setError('Failed to load feedback');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetch();
  }, [router]);

  if (!isAdmin || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">User Feedback</h1>
        </div>

        <NeoCard className="p-8 text-center">
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">
            Make sure the feedback table exists in your database.
          </p>
        </NeoCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Feedback</h1>
            <p className="text-sm text-gray-500">{feedback.length} submissions</p>
          </div>
        </div>
      </div>

      {/* Feedback list */}
      {feedback.length === 0 ? (
        <NeoCard className="p-8 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-500">No feedback submitted yet.</p>
        </NeoCard>
      ) : (
        <div className="space-y-4">
          {feedback.map((item) => {
            const typeInfo = TYPE_LABELS[item.type] || TYPE_LABELS.other;
            const date = new Date(item.created_at);

            return (
              <NeoCard key={item.id} className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <span className="text-sm text-gray-500">
                      {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 whitespace-pre-wrap mb-3">{item.message}</p>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{item.user_email || 'Anonymous'}</span>
                </div>
              </NeoCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
