'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  const errorMessages: Record<string, { title: string; message: string }> = {
    invalid: {
      title: 'Invalid Link',
      message: 'The link you clicked appears to be invalid or incomplete. Please check your email and try again.',
    },
    not_found: {
      title: 'Subscription Not Found',
      message: 'We couldn\'t find a subscription matching this link. It may have already been processed.',
    },
    failed: {
      title: 'Something Went Wrong',
      message: 'We encountered an error processing your request. Please try again later.',
    },
    error: {
      title: 'Unexpected Error',
      message: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
    },
  };

  const { title, message } = errorMessages[reason || 'error'] || errorMessages.error;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-black/5 dark:border-white/10">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">
            {title}
          </h1>

          <p className="text-primary-600 dark:text-primary-300 mb-6">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              <Image src="/logo.svg" alt="" width={20} height={20} />
              Go to Homepage
            </Link>
            <a
              href="mailto:hello@seeevery.place"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-primary-200 rounded-xl font-medium hover:bg-primary-200 dark:hover:bg-slate-600 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewsletterErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
