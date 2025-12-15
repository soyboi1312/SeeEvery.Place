'use client';

import { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  getTierColor,
  ACHIEVEMENTS,
  AchievementDefinition,
} from '@/lib/achievements';
import {
  UserSelections,
  ALL_CATEGORIES,
  categoryLabels,
  categoryIcons,
  emptySelections,
  CATEGORY_SCHEMA,
} from '@/lib/types';

// Dynamic imports for maps - skip SSR to reduce Cloudflare Worker CPU usage
const StaticWorldMap = dynamic(
  () => import('@/components/share').then(mod => mod.StaticWorldMap),
  { ssr: false, loading: () => <MapPlaceholder /> }
);
const StaticUSMap = dynamic(
  () => import('@/components/share').then(mod => mod.StaticUSMap),
  { ssr: false, loading: () => <MapPlaceholder /> }
);

// Lightweight placeholder during map loading
function MapPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/50 animate-pulse">
      <span className="text-muted-foreground">Loading map...</span>
    </div>
  );
}
import { PROFILE_ICONS } from '@/components/ProfileIcons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Globe, ArrowRight, Instagram, Users } from 'lucide-react';
import { FollowButton } from '@/components/FollowButton';
import { FollowersList } from '@/components/FollowersList';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PublicProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_public: boolean;
  total_xp: number;
  level: number;
  created_at: string;
  // Social links
  website_url: string | null;
  instagram_handle: string | null;
  twitter_handle: string | null;
  // Home base
  home_city: string | null;
  home_state: string | null;
  home_country: string | null;
  show_home_base: boolean;
  // Privacy settings
  privacy_settings: {
    hide_categories?: string[];
    hide_bucket_list?: boolean;
  } | null;
  // Social stats (from get_public_profile RPC)
  follower_count?: number;
  following_count?: number;
  is_following?: boolean;
}

interface UnlockedAchievement {
  id: string;
  achievement_id: string;
  unlocked_at: string;
  category: string | null;
}

interface PublicProfileClientProps {
  profile: PublicProfile;
  selections: Record<string, unknown>;
  achievements: UnlockedAchievement[];
  username: string;
}

// Mini achievement badge for display
function MiniBadge({ achievement }: { achievement: AchievementDefinition }) {
  return (
    <div
      className={`w-12 h-12 rounded-full bg-gradient-to-br ${getTierColor(achievement.tier)} flex items-center justify-center shadow-lg`}
      title={achievement.name}
    >
      <span className="text-xl">{achievement.icon}</span>
    </div>
  );
}

export default function PublicProfileClient({
  profile,
  selections: rawSelections,
  achievements: dbAchievements,
  username,
}: PublicProfileClientProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, signOut, isAdmin } = useAuth();
  const [activeMap, setActiveMap] = useState<'world' | 'usa'>('world');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Social state (so counts update instantly on follow/unfollow)
  const [followerCount, setFollowerCount] = useState(profile.follower_count || 0);
  const [isFollowing, setIsFollowing] = useState(profile.is_following || false);

  const handleFollowChange = (newIsFollowing: boolean) => {
    setIsFollowing(newIsFollowing);
    setFollowerCount(prev => newIsFollowing ? prev + 1 : Math.max(0, prev - 1));
  };

  // Parse selections safely
  const selections: UserSelections = useMemo(() => {
    if (!rawSelections || typeof rawSelections !== 'object') {
      return emptySelections;
    }

    return {
      ...emptySelections,
      ...rawSelections,
    } as UserSelections;
  }, [rawSelections]);

  // Calculate stats using lightweight computations
  // These use pre-computed profile data where possible
  const stats = useMemo(() => {
    // Count visited places across all categories
    let totalVisited = 0;
    let categoriesStarted = 0;

    for (const category of ALL_CATEGORIES) {
      const categorySelections = selections[category] || [];
      const visitedCount = categorySelections.filter(
        (s) => s.status === 'visited' && !s.deleted
      ).length;
      if (visitedCount > 0) {
        totalVisited += visitedCount;
        categoriesStarted++;
      }
    }

    return {
      // Use pre-computed values from database where available
      totalXp: profile.total_xp,
      level: profile.level,
      totalVisited,
      categoriesStarted,
    };
  }, [selections, profile.total_xp, profile.level]);

  // Get category stats (respecting privacy settings) - lightweight version
  const categoryStats = useMemo(() => {
    const hiddenCategories = profile.privacy_settings?.hide_categories || [];
    const hideBucketList = profile.privacy_settings?.hide_bucket_list || false;

    return ALL_CATEGORIES.map((category) => {
      if (hiddenCategories.includes(category)) return null;

      const categorySelections = selections[category] || [];
      const visited = categorySelections.filter(
        (s) => s.status === 'visited' && !s.deleted
      ).length;
      const bucketList = hideBucketList ? 0 : categorySelections.filter(
        (s) => s.status === 'bucketList' && !s.deleted
      ).length;
      const total = CATEGORY_SCHEMA[category].total;
      const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;

      return { category, visited, bucketList, total, percentage };
    }).filter((s): s is NonNullable<typeof s> => s !== null && (s.visited > 0 || s.bucketList > 0));
  }, [selections, profile.privacy_settings]);

  // Use pre-fetched achievements from database instead of recalculating
  // This avoids expensive getUnlockedAchievements() computation on SSR
  const unlockedAchievements = useMemo(() => {
    const dbAchievementIds = new Set(dbAchievements.map(a => a.achievement_id));
    return ACHIEVEMENTS.filter(a => dbAchievementIds.has(a.id));
  }, [dbAchievements]);

  const displayName = profile.full_name || username;
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Shared Header */}
      <Header
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={signOut}
        isSignedIn={!!user}
        userEmail={user?.email}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        isAdmin={isAdmin}
        syncStatus="idle"
      />

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex-grow w-full">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-xl">
                {(() => {
                  const iconName = profile.avatar_url;
                  const IconComponent = iconName && PROFILE_ICONS[iconName]
                    ? PROFILE_ICONS[iconName]
                    : null;

                  if (IconComponent) {
                    return <IconComponent className="w-12 h-12 md:w-16 md:h-16" />;
                  }

                  return (
                    <span className="font-bold text-4xl md:text-5xl">
                      {displayName[0].toUpperCase()}
                    </span>
                  );
                })()}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                      {displayName}
                    </h1>
                    <p className="text-muted-foreground">
                      @{username} | Member since {memberSince}
                    </p>
                  </div>
                  {/* Follow Button (Desktop) */}
                  <div className="hidden md:block">
                    <FollowButton
                      userId={profile.id}
                      initialIsFollowing={isFollowing}
                      onFollowChange={handleFollowChange}
                    />
                  </div>
                </div>

                {/* Social Stats Row */}
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4 text-sm">
                  <Dialog>
                    <DialogTrigger className="hover:opacity-70 transition-opacity cursor-pointer">
                      <span className="font-bold text-foreground">{followerCount}</span>{' '}
                      <span className="text-muted-foreground">Followers</span>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Followers
                        </DialogTitle>
                      </DialogHeader>
                      <FollowersList userId={profile.id} type="followers" showFollowButtons />
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger className="hover:opacity-70 transition-opacity cursor-pointer">
                      <span className="font-bold text-foreground">{profile.following_count || 0}</span>{' '}
                      <span className="text-muted-foreground">Following</span>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Following
                        </DialogTitle>
                      </DialogHeader>
                      <FollowersList userId={profile.id} type="following" showFollowButtons />
                    </DialogContent>
                  </Dialog>

                  {/* Follow Button (Mobile) */}
                  <div className="md:hidden">
                    <FollowButton
                      userId={profile.id}
                      initialIsFollowing={isFollowing}
                      onFollowChange={handleFollowChange}
                      size="sm"
                    />
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-muted-foreground mb-4 max-w-lg">
                    {profile.bio}
                  </p>
                )}

                {/* Home Base */}
                {profile.show_home_base && (profile.home_city || profile.home_state || profile.home_country) && (
                  <p className="text-muted-foreground text-sm mb-3 flex items-center gap-1 justify-center md:justify-start">
                    <MapPin className="w-4 h-4" />
                    Based in {[profile.home_city, profile.home_state, profile.home_country].filter(Boolean).join(', ')}
                  </p>
                )}

                {/* Social Links */}
                {(profile.website_url || profile.instagram_handle || profile.twitter_handle) && (
                  <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                    {profile.website_url && (
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        title="Website"
                      >
                        <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-5 h-5" />
                        </a>
                      </Button>
                    )}
                    {profile.instagram_handle && (
                      <Button
                        size="icon"
                        className="bg-gradient-to-br from-purple-500 to-pink-500 hover:opacity-90"
                        asChild
                        title={`@${profile.instagram_handle}`}
                      >
                        <a href={`https://instagram.com/${profile.instagram_handle}`} target="_blank" rel="noopener noreferrer">
                          <Instagram className="w-5 h-5" />
                        </a>
                      </Button>
                    )}
                    {profile.twitter_handle && (
                      <Button
                        size="icon"
                        className="bg-black hover:bg-black/90"
                        asChild
                        title={`@${profile.twitter_handle}`}
                      >
                        <a href={`https://x.com/${profile.twitter_handle}`} target="_blank" rel="noopener noreferrer">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </a>
                      </Button>
                    )}
                  </div>
                )}

                {/* Level Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 px-4 py-2 rounded-full">
                  <span className="text-2xl">🎖️</span>
                  <span className="font-bold text-foreground">Level {stats.level}</span>
                  <span className="text-muted-foreground">|</span>
                  <span className="text-muted-foreground">{stats.totalXp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Visualization */}
        {stats.totalVisited > 0 && (
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Travel Map</CardTitle>
              <Tabs value={activeMap} onValueChange={(v) => setActiveMap(v as 'world' | 'usa')}>
                <TabsList className="h-8">
                  <TabsTrigger value="world" className="text-xs px-3">World</TabsTrigger>
                  <TabsTrigger value="usa" className="text-xs px-3">USA</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <div className="relative w-full aspect-[2/1] bg-muted flex items-center justify-center p-4">
              {activeMap === 'world' ? (
                <StaticWorldMap selections={selections} />
              ) : (
                <StaticUSMap selections={selections} />
              )}
            </div>

            {/* Map Legend */}
            <div className="flex justify-center gap-6 py-3 px-4 bg-muted/50 border-t">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></span>
                <span className="text-xs font-medium text-muted-foreground">Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></span>
                <span className="text-xs font-medium text-muted-foreground">Bucket List</span>
              </div>
            </div>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-3xl font-bold text-foreground">
                {stats.totalVisited}
              </div>
              <div className="text-sm text-muted-foreground">Places Visited</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-3xl font-bold text-foreground">
                {stats.categoriesStarted}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-3xl font-bold text-foreground">
                {unlockedAchievements.length}
              </div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-3xl font-bold text-foreground">
                {stats.level}
              </div>
              <div className="text-sm text-muted-foreground">Level</div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Showcase */}
        {unlockedAchievements.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Achievements ({unlockedAchievements.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {unlockedAchievements.slice(0, 12).map((achievement) => (
                  <MiniBadge key={achievement.id} achievement={achievement} />
                ))}
                {unlockedAchievements.length > 12 && (
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                    +{unlockedAchievements.length - 12}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Progress */}
        {categoryStats.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Travel Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {categoryStats.map(({ category, visited, bucketList, total, percentage }) => (
                  <div key={category} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                      {categoryIcons[category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground truncate">
                          {categoryLabels[category]}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {visited} / {total}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {bucketList > 0 && (
                        <span className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                          +{bucketList} on bucket list
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-foreground">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="py-6 text-center">
            <h2 className="text-xl font-bold mb-2">Create Your Own Travel Map</h2>
            <p className="text-white/80 mb-4">
              Track your adventures, earn achievements, and share your journey with the world.
            </p>
            <Button asChild variant="secondary" className="gap-2">
              <Link href="/">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Shared Footer */}
      <Footer user={user} onSignIn={() => setShowAuthModal(true)} showCategoryDirectory={false} />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
