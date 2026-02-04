'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { BRAND_GRADIENT } from '@/lib/colors';

interface SidebarProps {
    user: User | null;
    isAdmin: boolean;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    handleLogout: () => Promise<void>;
}

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
            </svg>
        ),
    },
];

interface SidebarLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

function SidebarLink({ href, icon, label, isActive, onClick }: SidebarLinkProps) {
    return (
        <Link
            href={href}
            className={`
        flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-200
        ${isActive
                    ? 'text-white neo-button-raised shadow-lg shadow-brand-primary/20'
                    : 'text-slate-500 hover:text-brand-medium'
                }
      `}
            style={{ background: isActive ? BRAND_GRADIENT : undefined }}
            onClick={onClick}
        >
            {isActive ? (
                <div className="text-white">
                    {icon}
                </div>
            ) : (
                <div className="neo-inset-circle w-10 h-10 flex-shrink-0 flex items-center justify-center">
                    <div className="text-slate-400 group-hover:text-slate-600">
                        {icon}
                    </div>
                </div>
            )}

            <span className={`font-bold text-sm ${isActive ? 'text-white' : ''}`}>{label}</span>
        </Link>
    );
}

export function Sidebar({ user, isAdmin, sidebarOpen, setSidebarOpen, handleLogout }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={`
        fixed inset-y-0 left-0 z-50
        w-72 neo-sidebar flex flex-col h-screen overflow-hidden
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
        >
            {/* Logo */}
            <div className="p-8">
                <h1 className="text-2xl font-display font-black tracking-tight gradient-text">Friction-to-Flow</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400 mt-2">AI Audit Platform</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 space-y-4 overflow-y-auto mt-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                    return (
                        <SidebarLink
                            key={item.name}
                            href={item.href}
                            icon={item.icon}
                            label={item.name}
                            isActive={isActive}
                            onClick={() => setSidebarOpen(false)}
                        />
                    );
                })}

                {/* Admin links */}
                {isAdmin && (
                    <>
                        <SidebarLink
                            href="/admin"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            }
                            label="Admin"
                            isActive={pathname === '/admin'}
                            onClick={() => setSidebarOpen(false)}
                        />

                        <SidebarLink
                            href="/admin/feedback"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            }
                            label="Feedback"
                            isActive={pathname === '/admin/feedback'}
                            onClick={() => setSidebarOpen(false)}
                        />
                    </>
                )}
            </nav>

            {/* User section & Logout */}
            <div className="p-6 mt-auto border-t border-slate-200/40">
                {/* User info */}
                <div className="flex items-center gap-4 p-4 neo-inset-circle rounded-3xl mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-dark flex items-center justify-center text-white font-bold shadow-md">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 truncate">{user?.user_metadata?.full_name || 'User'}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                    </div>
                </div>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-black text-slate-400 hover:text-red-400 transition-colors uppercase tracking-widest"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    Logout
                </button>
            </div>
        </aside>
    );
}
