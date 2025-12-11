'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadSelections } from '@/lib/storage';
import {
  ACHIEVEMENTS,
  isAchievementUnlocked,
  calculateTotalXp,
  calculateLevel,
  AchievementDefinition
} from '@/lib/achievements';

const KNOWN_ACHIEVEMENTS_KEY = 'seeeveryplace_known_achievements';

export default function AchievementToast() {
  const [queue, setQueue] = useState<AchievementDefinition[]>([]);
  const [current, setCurrent] = useState<AchievementDefinition | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Check for new achievements
  const checkAchievements = useCallback(() => {
    const selections = loadSelections();
    if (!selections) return;

    const totalXp = calculateTotalXp(selections);
    const level = calculateLevel(totalXp);

    // Get currently unlocked IDs
    const currentUnlocked = ACHIEVEMENTS.filter(a =>
      isAchievementUnlocked(a, selections, level)
    );
    const currentIds = currentUnlocked.map(a => a.id);

    // Get known IDs from storage
    const stored = localStorage.getItem(KNOWN_ACHIEVEMENTS_KEY);
    const knownIds: string[] = stored ? JSON.parse(stored) : [];

    // Find new unlocks
    const newUnlocks = currentUnlocked.filter(a => !knownIds.includes(a.id));

    if (newUnlocks.length > 0) {
      // Add to queue
      setQueue(prev => [...prev, ...newUnlocks]);

      // Update known list immediately so we don't notify again
      const updatedKnown = Array.from(new Set([...knownIds, ...currentIds]));
      localStorage.setItem(KNOWN_ACHIEVEMENTS_KEY, JSON.stringify(updatedKnown));
    }
  }, []);

  // Listen for changes
  useEffect(() => {
    // Initial check
    checkAchievements();

    // Listen for local updates (same tab)
    const handleLocalUpdate = () => checkAchievements();
    window.addEventListener('selections-updated', handleLocalUpdate);

    // Listen for storage updates (other tabs)
    window.addEventListener('storage', handleLocalUpdate);

    return () => {
      window.removeEventListener('selections-updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
    };
  }, [checkAchievements]);

  // Process queue
  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue(prev => prev.slice(1));
      setIsVisible(true);
    }
  }, [queue, current]);

  // Auto-dismiss
  useEffect(() => {
    if (current && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Wait for animation to finish before clearing current
        setTimeout(() => setCurrent(null), 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [current, isVisible]);

  if (!current) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
    }`}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-l-4 border-yellow-500 p-4 flex items-center gap-4 max-w-sm">
        <div className="text-4xl animate-bounce">
          {current.icon}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-0.5">
            Achievement Unlocked!
          </h4>
          <p className="font-bold text-primary-600 dark:text-primary-400 text-lg leading-tight">
            {current.name}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            +{current.xpReward} XP &bull; {current.description}
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
