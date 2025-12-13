'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Trophy, Flame, CheckCircle2 } from 'lucide-react';
import { Category, categoryLabels } from '@/lib/types';

interface Challenge {
  id: string;
  name: string;
  description: string;
  type: string;
  category: Category | null;
  requiredCount: number;
  badgeIcon: string;
  badgeName: string;
  xpReward: number;
  daysRemaining: number | null;
  currentCount: number;
  progress: number;
  isCompleted: boolean;
}

interface ChallengesCardProps {
  filterCategory?: Category; // Optional: only show challenges for this category
  showCompleted?: boolean;
  className?: string;
}

/**
 * Displays active time-bound challenges
 */
export function ChallengesCard({ filterCategory, showCompleted = false, className = '' }: ChallengesCardProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const response = await fetch('/api/challenges');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setChallenges(data.challenges || []);
      } catch (err) {
        console.error('Failed to load challenges:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="w-5 h-5 text-amber-500" />
            Active Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter challenges
  let filteredChallenges = challenges;

  if (filterCategory) {
    filteredChallenges = challenges.filter(
      c => c.category === null || c.category === filterCategory
    );
  }

  if (!showCompleted) {
    filteredChallenges = filteredChallenges.filter(c => !c.isCompleted);
  }

  if (filteredChallenges.length === 0) {
    return null; // Hide if no challenges to show
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-amber-500" />
          Active Challenges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredChallenges.map(challenge => (
          <ChallengeItem key={challenge.id} challenge={challenge} />
        ))}
      </CardContent>
    </Card>
  );
}

function ChallengeItem({ challenge }: { challenge: Challenge }) {
  const progressColor = challenge.isCompleted
    ? 'bg-green-500'
    : challenge.progress >= 66
    ? 'bg-amber-500'
    : 'bg-blue-500';

  return (
    <div className="relative border rounded-lg p-3 bg-slate-50 dark:bg-slate-800/50">
      {/* Badge icon */}
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{challenge.badgeIcon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-sm">{challenge.name}</h4>
            {challenge.isCompleted && (
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {challenge.description}
          </p>

          {/* Category badge */}
          {challenge.category && (
            <Badge variant="secondary" className="text-xs mt-1">
              {categoryLabels[challenge.category]}
            </Badge>
          )}

          {/* Progress bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-600 dark:text-slate-300">
                {challenge.currentCount} / {challenge.requiredCount}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                +{challenge.xpReward} XP
              </span>
            </div>
            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${progressColor} transition-all duration-500`}
                style={{ width: `${challenge.progress}%` }}
              />
            </div>
          </div>

          {/* Time remaining */}
          {challenge.daysRemaining !== null && !challenge.isCompleted && (
            <div className="flex items-center gap-1 mt-2 text-xs">
              <Clock className="w-3 h-3 text-amber-500" />
              <span className={challenge.daysRemaining <= 7 ? 'text-amber-600 font-medium' : 'text-slate-500'}>
                {challenge.daysRemaining === 0
                  ? 'Last day!'
                  : challenge.daysRemaining === 1
                  ? '1 day left'
                  : `${challenge.daysRemaining} days left`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version for sidebar or header
 */
export function ChallengesCompact({ className = '' }: { className?: string }) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const response = await fetch('/api/challenges');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setChallenges(data.challenges || []);
      } catch (err) {
        console.error('Failed to load challenges:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, []);

  const activeChallenges = challenges.filter(c => !c.isCompleted);

  if (loading || activeChallenges.length === 0) {
    return null;
  }

  // Show the challenge closest to completion or with least time remaining
  const priorityChallenge = activeChallenges.sort((a, b) => {
    // Prioritize nearly complete
    if (a.progress !== b.progress) return b.progress - a.progress;
    // Then by time remaining
    if (a.daysRemaining !== null && b.daysRemaining !== null) {
      return a.daysRemaining - b.daysRemaining;
    }
    return 0;
  })[0];

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <Flame className="w-4 h-4 text-amber-500" />
      <span className="text-slate-600 dark:text-slate-300">
        <strong>{priorityChallenge.name}</strong>: {priorityChallenge.currentCount}/{priorityChallenge.requiredCount}
      </span>
      {priorityChallenge.daysRemaining !== null && priorityChallenge.daysRemaining <= 7 && (
        <Badge variant="outline" className="text-xs text-amber-600 border-amber-500">
          {priorityChallenge.daysRemaining}d left
        </Badge>
      )}
    </div>
  );
}

export default ChallengesCard;
