'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { FeedbackModal, FeedbackButton } from '@/components/ui';
import { Sidebar } from '@/components/dashboard';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    // Get initial user
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Check if user is admin
      const { data: userData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (userData && (userData as { is_admin?: boolean }).is_admin) {
        setIsAdmin(true);
      }

      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push('/login');
        return;
      }
      setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--neo-bg)]">
        <div className="neo-card p-8">
          <div className="flex items-center gap-3">
            <svg
              className="animate-spin h-6 w-6 text-[var(--accent-soft)]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-[var(--text-main)]">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--neo-bg)]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar
        user={user}
        isAdmin={isAdmin}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex flex-col min-w-0 min-h-screen lg:ml-72 bg-[var(--neo-bg)]">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[var(--neo-bg)] border-b border-[var(--brand-light)] sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-display font-black text-[var(--text-heading)] tracking-tight">Friction-to-Flow</h1>
            <p className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[var(--brand-primary)]">AI Audit Platform</p>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 neo-button flex items-center justify-center text-[var(--accent-soft)]"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-12 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Feedback button and modal */}
      <FeedbackButton onClick={() => setFeedbackOpen(true)} />
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
