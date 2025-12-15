'use client';

import Link from 'next/link';
import { Category, categoryLabels } from '@/lib/types';

interface FooterProps {
  user?: { email?: string } | null;
  onSignIn?: () => void;
  onSignInHover?: () => void;
  showCategoryDirectory?: boolean;
}

export default function Footer({ user, onSignIn, onSignInHover, showCategoryDirectory = true }: FooterProps) {
  return (
    <footer className="py-8 pb-24 text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700 mt-auto bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        {/* Category Directory - Internal Links for SEO */}
        {showCategoryDirectory && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
              Track Your Adventures
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-left">
              {(Object.keys(categoryLabels) as Category[]).map((cat) => (
                <Link
                  key={cat}
                  href={`/track/${cat}`}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {categoryLabels[cat]}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <p>Made by people who really like maps.</p>
          <p className="mt-1">
            {user ? (
              <>Signed in as {user.email}. Your data syncs across devices.</>
            ) : (
              <>
                {onSignIn ? (
                  <button
                    onClick={onSignIn}
                    onMouseEnter={onSignInHover}
                    onFocus={onSignInHover}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Sign in
                  </button>
                ) : (
                  <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Sign in
                  </Link>
                )}
                {' '}to sync across devices.
              </>
            )}
          </p>
          <div className="mt-3 flex justify-center gap-4 flex-wrap">
            <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">About</Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/community" className="text-blue-600 dark:text-blue-400 hover:underline">Community</Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/suggest" className="text-blue-600 dark:text-blue-400 hover:underline">Suggest</Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy</Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
