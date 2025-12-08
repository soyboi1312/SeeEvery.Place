'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { createClient } from '@/lib/supabase/client';
import { loadSelections, clearAllSelections } from '@/lib/storage';
import type { User } from '@supabase/supabase-js';

export default function SettingsPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'done'>('idle');

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleExportData = () => {
    setExportStatus('exporting');

    let url: string | null = null;
    let a: HTMLAnchorElement | null = null;

    try {
      const selections = loadSelections();
      const exportData = {
        exportedAt: new Date().toISOString(),
        email: user?.email,
        selections,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      url = URL.createObjectURL(blob);
      a = document.createElement('a');
      a.href = url;
      a.download = `seeevery-place-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();

      setExportStatus('done');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('idle');
    } finally {
      // Always clean up blob URL and DOM element to prevent memory leaks
      if (a && document.body.contains(a)) {
        document.body.removeChild(a);
      }
      if (url) {
        URL.revokeObjectURL(url);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;

    setIsDeleting(true);

    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Clear local data
      clearAllSelections();

      // Sign out and redirect
      const supabase = createClient();
      await supabase.auth.signOut();

      router.push('/?deleted=true');
    } catch (error) {
      console.error('Delete account failed:', error);
      alert('Failed to delete account. Please try again or contact support.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800">
        <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
                <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-none">
                  SeeEvery<span className="text-purple-500">.</span>Place<span className="text-[10px] align-super">™</span>
                </h1>
              </div>
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">Sign in required</h2>
          <p className="text-primary-600 dark:text-primary-300 mb-6">You need to be signed in to access settings.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Go Home
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-primary-900 dark:text-white leading-none">
                SeeEvery<span className="text-accent-500">.</span>Place<span className="text-[10px] align-super">™</span>
              </h1>
              <span className="text-[10px] text-primary-500 dark:text-primary-400 font-medium tracking-wider uppercase hidden sm:block">
                Free Travel Tracker
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
            >
              Back to Map
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-primary-900 dark:text-white mb-2">Settings</h2>
        <p className="text-primary-600 dark:text-primary-300 mb-8">Manage your account and data</p>

        {/* Account Info */}
        <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium border border-black/5 dark:border-white/10 mb-6">
          <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-4">Account</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-primary-900 dark:text-white">{user.email}</p>
              <p className="text-sm text-primary-500 dark:text-primary-400">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium border border-black/5 dark:border-white/10 mb-6">
          <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-4">Data & Privacy</h3>

          {/* Export Data */}
          <div className="mb-6">
            <h4 className="font-medium text-primary-900 dark:text-white mb-2">Export Your Data</h4>
            <p className="text-sm text-primary-600 dark:text-primary-300 mb-3">
              Download all your travel selections as a JSON file. This includes all countries, states, parks, and other locations you&apos;ve marked.
            </p>
            <button
              onClick={handleExportData}
              disabled={exportStatus !== 'idle'}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportStatus === 'exporting' ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Exporting...
                </>
              ) : exportStatus === 'done' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Downloaded!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Data
                </>
              )}
            </button>
          </div>

          {/* Privacy Policy Link */}
          <div>
            <h4 className="font-medium text-primary-900 dark:text-white mb-2">Privacy Policy</h4>
            <p className="text-sm text-primary-600 dark:text-primary-300 mb-3">
              Learn how we handle your data and protect your privacy.
            </p>
            <Link
              href="/privacy"
              className="text-primary-700 dark:text-primary-400 hover:underline text-sm font-medium"
            >
              Read Privacy Policy →
            </Link>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-4">Danger Zone</h3>

          <div>
            <h4 className="font-medium text-red-900 dark:text-red-300 mb-2">Delete Account</h4>
            <p className="text-sm text-red-700 dark:text-red-400 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
              Your local data will also be cleared.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete My Account
              </button>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-red-300 dark:border-red-700">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Type <strong>DELETE</strong> to confirm:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-primary-500 dark:text-primary-400">
          <div className="flex justify-center gap-4 mb-2">
            <Link href="/about" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">About</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/suggest" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Suggest</Link>
          </div>
          <p>See Every Place - Free Travel Tracker</p>
        </div>
      </footer>
    </div>
  );
}
