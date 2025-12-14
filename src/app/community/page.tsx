import { Metadata } from 'next';
import { ActivityFeed } from '@/components/ActivityFeed';
import { Leaderboard } from '@/components/Leaderboard';
import { Users } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Community | SeeEvery.Place',
  description: 'See what other travelers are exploring and compete on the leaderboard.',
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Community
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            Discover where others are traveling and track your ranking.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <ActivityFeed
              defaultType="global"
              showTabs={true}
            />
          </div>

          {/* Sidebar: Leaderboard */}
          <div className="space-y-6">
            <div className="lg:sticky lg:top-20">
              <Leaderboard
                limit={10}
                defaultType="global"
                showPeriodTabs={true}
                showTypeTabs={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          ← Back to Map
        </Link>
      </div>
    </div>
  );
}
