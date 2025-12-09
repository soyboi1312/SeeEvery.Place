'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function UnsubscribedContent() {
  const searchParams = useSearchParams();
  const alreadyUnsubscribed = searchParams.get('already') === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-black/5 dark:border-white/10">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">
            {alreadyUnsubscribed ? 'Already Unsubscribed' : 'Unsubscribed Successfully'}
          </h1>

          <p className="text-primary-600 dark:text-primary-300 mb-6">
            {alreadyUnsubscribed
              ? 'You\'ve already been unsubscribed from our newsletter.'
              : 'You\'ve been unsubscribed from the SeeEvery.Place newsletter. We\'re sorry to see you go!'}
          </p>

          <p className="text-sm text-primary-500 dark:text-primary-400 mb-6">
            Changed your mind? You can always subscribe again from our homepage.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            <Image src="/logo.svg" alt="" width={20} height={20} />
            Go to SeeEvery.Place
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function NewsletterUnsubscribedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    }>
      <UnsubscribedContent />
    </Suspense>
  );
}
