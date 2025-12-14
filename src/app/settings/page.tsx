'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { createClient } from '@/lib/supabase/client';
import { loadSelections, saveSelections, clearAllSelections } from '@/lib/storage';
import { calculateTotalXp, calculateLevel, xpToNextLevel } from '@/lib/achievements';
import type { User } from '@supabase/supabase-js';
import type { UserSelections, Category } from '@/lib/types';
import { categoryLabels, categoryIcons, ALL_CATEGORIES } from '@/lib/types';
import ProfileIconSelector from '@/components/ProfileIconSelector';
import { PROFILE_ICONS } from '@/components/ProfileIcons';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Sun, Moon, ArrowLeft, Download, Upload, Trash2, ChevronRight, Check, Loader2, Users } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  is_public: boolean;
  bio: string | null;
  total_xp: number;
  level: number;
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
  // Preferences
  default_map_view: 'world' | 'usa';
}

export default function SettingsPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'done'>('idle');

  // Import states
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  const [importError, setImportError] = useState<string | null>(null);
  const [importStats, setImportStats] = useState<{ added: number; updated: number } | null>(null);

  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>('compass');

  // Social links
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');

  // Home base
  const [homeCity, setHomeCity] = useState('');
  const [homeState, setHomeState] = useState('');
  const [homeCountry, setHomeCountry] = useState('');
  const [showHomeBase, setShowHomeBase] = useState(false);

  // Privacy settings
  const [hiddenCategories, setHiddenCategories] = useState<string[]>([]);
  const [hideBucketList, setHideBucketList] = useState(false);

  // Preferences
  const [defaultMapView, setDefaultMapView] = useState<'world' | 'usa'>('world');

  // Reset progress states
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetCategory, setResetCategory] = useState<string | null>(null);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // XP and Level display
  const [selections, setSelections] = useState<UserSelections | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
      setDisplayName(data.full_name || '');
      setUsername(data.username || '');
      setBio(data.bio || '');
      setIsPublic(data.is_public || false);
      // If avatar_url exists and matches one of our icons, use it. Otherwise default.
      const savedIcon = data.avatar_url && PROFILE_ICONS[data.avatar_url] ? data.avatar_url : 'compass';
      setSelectedIcon(savedIcon);
      // Social links
      setWebsiteUrl(data.website_url || '');
      setInstagramHandle(data.instagram_handle || '');
      setTwitterHandle(data.twitter_handle || '');
      // Home base
      setHomeCity(data.home_city || '');
      setHomeState(data.home_state || '');
      setHomeCountry(data.home_country || '');
      setShowHomeBase(data.show_home_base || false);
      // Privacy settings
      const privacySettings = data.privacy_settings || {};
      setHiddenCategories(privacySettings.hide_categories || []);
      setHideBucketList(privacySettings.hide_bucket_list || false);
      // Preferences
      setDefaultMapView(data.default_map_view || 'world');
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        loadProfile(user.id);
        // Load selections for XP calculation
        const sel = await loadSelections();
        setSelections(sel);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const handleExportData = async () => {
    setExportStatus('exporting');

    let url: string | null = null;
    let a: HTMLAnchorElement | null = null;

    try {
      const selections = await loadSelections();
      const exportData = {
        exportedAt: new Date().toISOString(),
        email: user?.email,
        version: '1.0',
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
      if (a && document.body.contains(a)) {
        document.body.removeChild(a);
      }
      if (url) {
        URL.revokeObjectURL(url);
      }
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus('importing');
    setImportError(null);
    setImportStats(null);

    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      // Validate the import data structure
      if (!importData.selections || typeof importData.selections !== 'object') {
        throw new Error('Invalid file format: missing selections data');
      }

      // Load current selections
      const currentSelections = await loadSelections();
      let added = 0;
      let updated = 0;

      // Merge imported selections with current selections
      const mergedSelections = { ...currentSelections };

      for (const [category, selections] of Object.entries(importData.selections)) {
        if (!Array.isArray(selections)) continue;

        // Type assertion for the selections array
        const importedSelections = selections as Array<{
          id: string;
          status: string;
          updatedAt?: number;
          deleted?: boolean;
        }>;

        const existingMap = new Map(
          (mergedSelections[category as keyof UserSelections] || []).map(s => [s.id, s])
        );

        for (const importedSelection of importedSelections) {
          if (!importedSelection.id || !importedSelection.status) continue;

          const existing = existingMap.get(importedSelection.id);

          if (!existing) {
            // New selection - add it
            existingMap.set(importedSelection.id, {
              id: importedSelection.id,
              status: importedSelection.status as 'visited' | 'bucketList' | 'unvisited',
              updatedAt: importedSelection.updatedAt || Date.now(),
              deleted: importedSelection.deleted || false,
            });
            added++;
          } else {
            // Existing selection - use newer timestamp if available
            const importTime = importedSelection.updatedAt || 0;
            const existingTime = existing.updatedAt || 0;

            if (importTime > existingTime) {
              existingMap.set(importedSelection.id, {
                id: importedSelection.id,
                status: importedSelection.status as 'visited' | 'bucketList' | 'unvisited',
                updatedAt: importTime,
                deleted: importedSelection.deleted || false,
              });
              updated++;
            }
          }
        }

        mergedSelections[category as keyof UserSelections] = Array.from(existingMap.values());
      }

      // Save merged selections
      saveSelections(mergedSelections);
      setSelections(mergedSelections);

      setImportStats({ added, updated });
      setImportStatus('success');

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Auto-reset after 5 seconds
      setTimeout(() => {
        setImportStatus('idle');
        setImportStats(null);
      }, 5000);
    } catch (error) {
      console.error('Import failed:', error);
      setImportError(error instanceof Error ? error.message : 'Failed to import data');
      setImportStatus('error');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const validateUsername = (value: string): string | null => {
    if (value.length === 0) return null; // Empty is ok (means no username set)
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (value.length > 20) return 'Username must be 20 characters or less';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Only letters, numbers, and underscores allowed';
    return null;
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameError(validateUsername(value));
  };

  const handleSaveProfile = async () => {
    if (usernameError) return;

    setIsSavingProfile(true);
    setProfileSaveSuccess(false);

    try {
      const supabase = createClient();

      // Check username availability if changed
      if (username && username !== profile?.username) {
        const { data: available } = await supabase
          .rpc('is_username_available', { check_username: username });

        if (!available) {
          setUsernameError('Username is already taken');
          setIsSavingProfile(false);
          return;
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: displayName || null,
          username: username || null,
          bio: bio || null,
          is_public: isPublic,
          avatar_url: selectedIcon, // Save the icon name here
          // Social links
          website_url: websiteUrl || null,
          instagram_handle: instagramHandle ? instagramHandle.replace(/^@/, '') : null,
          twitter_handle: twitterHandle ? twitterHandle.replace(/^@/, '') : null,
          // Home base
          home_city: homeCity || null,
          home_state: homeState || null,
          home_country: homeCountry || null,
          show_home_base: showHomeBase,
          // Privacy settings
          privacy_settings: {
            hide_categories: hiddenCategories,
            hide_bucket_list: hideBucketList,
          },
          // Preferences
          default_map_view: defaultMapView,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user!.id);

      if (error) throw error;

      // Reload profile
      await loadProfile(user!.id);
      setIsEditingProfile(false);
      setProfileSaveSuccess(true);

      setTimeout(() => setProfileSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
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

      clearAllSelections();
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

  const handleResetCategory = async (category: string) => {
    if (resetConfirmText !== 'RESET') return;

    setIsResetting(true);

    try {
      // Load current selections
      const currentSelections = await loadSelections();

      // Clear the specific category
      const updatedSelections = {
        ...currentSelections,
        [category]: [],
      };

      // Save and update state
      saveSelections(updatedSelections);
      setSelections(updatedSelections);

      // Close modal and reset state
      setShowResetModal(false);
      setResetCategory(null);
      setResetConfirmText('');
    } catch (error) {
      console.error('Reset category failed:', error);
      alert('Failed to reset category. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setDisplayName(profile?.full_name || '');
    setUsername(profile?.username || '');
    setBio(profile?.bio || '');
    setIsPublic(profile?.is_public || false);
    setUsernameError(null);
    // Reset social links
    setWebsiteUrl(profile?.website_url || '');
    setInstagramHandle(profile?.instagram_handle || '');
    setTwitterHandle(profile?.twitter_handle || '');
    // Reset home base
    setHomeCity(profile?.home_city || '');
    setHomeState(profile?.home_state || '');
    setHomeCountry(profile?.home_country || '');
    setShowHomeBase(profile?.show_home_base || false);
    // Reset privacy settings
    const privacySettings = profile?.privacy_settings || {};
    setHiddenCategories(privacySettings.hide_categories || []);
    setHideBucketList(privacySettings.hide_bucket_list || false);
    // Reset preferences
    setDefaultMapView(profile?.default_map_view || 'world');
    // Reset travel badge
    const savedIcon = profile?.avatar_url && PROFILE_ICONS[profile.avatar_url] ? profile.avatar_url : 'compass';
    setSelectedIcon(savedIcon);
  };

  // Calculate XP and level from selections
  const totalXp = selections ? calculateTotalXp(selections) : 0;
  const currentLevel = calculateLevel(totalXp);
  const levelProgress = xpToNextLevel(totalXp);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                  SeeEvery<span className="text-purple-500">.</span>Place<span className="text-[10px] align-super">TM</span>
                </h1>
              </div>
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">Sign in required</h2>
          <p className="text-primary-600 dark:text-primary-300 mb-6">You need to be signed in to access settings.</p>
          <Button asChild size="lg">
            <Link href="/">Go Home</Link>
          </Button>
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
                SeeEvery<span className="text-accent-500">.</span>Place<span className="text-[10px] align-super">TM</span>
              </h1>
              <span className="text-[10px] text-primary-500 dark:text-primary-400 font-medium tracking-wider uppercase hidden sm:block">
                Free Travel Tracker
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden sm:flex gap-1.5 items-center">
              <Link href="/community">
                <Users className="w-4 h-4" />
                Community
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Map
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-primary-900 dark:text-white mb-2">Settings</h2>
        <p className="text-primary-600 dark:text-primary-300 mb-8">Manage your profile, account, and data</p>

        {/* Profile Card with XP */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile</CardTitle>
            {!isEditingProfile && (
              <Button variant="link" onClick={() => setIsEditingProfile(true)} className="p-0 h-auto">
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {profileSaveSuccess && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
                <Check className="h-4 w-4" />
                Profile saved successfully!
              </div>
            )}

            <div className="flex items-center gap-4">
              {/* Travel Badge Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                {(() => {
                  const Icon = PROFILE_ICONS[selectedIcon] || PROFILE_ICONS['compass'];
                  return <Icon className="w-8 h-8" />;
                })()}
              </div>
              <div className="flex-1">
                {isEditingProfile ? (
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display Name"
                    className="mb-2"
                  />
                ) : (
                  <p className="font-medium text-primary-900 dark:text-white text-lg">
                    {profile?.full_name || 'Set your display name'}
                  </p>
                )}
                <p className="text-sm text-primary-500 dark:text-primary-400">{user.email}</p>
                <p className="text-xs text-primary-400 dark:text-primary-500">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* XP and Level Display */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎖️</span>
                  <span className="font-bold text-primary-900 dark:text-white">Level {currentLevel}</span>
                </div>
                <span className="text-sm text-primary-600 dark:text-primary-300">{totalXp.toLocaleString()} XP</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress.progress}%` }}
                />
              </div>
              <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">
                {levelProgress.current.toLocaleString()} / {levelProgress.needed.toLocaleString()} XP to Level {currentLevel + 1}
              </p>
              <Link
                href="/achievements"
                className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
              >
                View Achievements
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {isEditingProfile && (
              <>
                {/* Travel Badge Selection */}
                <div>
                  <Label className="mb-3 block">Choose your Travel Badge</Label>
                  <ProfileIconSelector
                    selectedIcon={selectedIcon}
                    onSelect={setSelectedIcon}
                  />
                </div>

                {/* Public Profile Toggle - Moved above username for visibility */}
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-primary-900 dark:text-white">Public Profile</p>
                        <p className="text-sm text-primary-600 dark:text-primary-400">
                          Allow others to view your travel map and achievements
                        </p>
                      </div>
                      <Switch
                        checked={isPublic}
                        onCheckedChange={setIsPublic}
                      />
                    </div>
                    {isPublic && username && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                        Your profile will be visible at: seeevery.place/u/{username}
                      </p>
                    )}
                    {isPublic && !username && (
                      <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                        Set a username below to enable your public profile URL
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Username */}
                <div>
                  <Label htmlFor="username">Username</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-primary-500 dark:text-primary-400 text-sm">seeevery.place/u/</span>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value.toLowerCase())}
                      placeholder="username"
                      className={usernameError ? 'border-red-500' : ''}
                    />
                  </div>
                  {usernameError && (
                    <p className="text-sm text-red-500 mt-1">{usernameError}</p>
                  )}
                  <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">
                    This will be your public profile URL (if enabled)
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about your travels..."
                    maxLength={160}
                    rows={2}
                    className="mt-1"
                  />
                  <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">
                    {bio.length}/160 characters
                  </p>
                </div>

                {/* Social Media Links */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-medium text-primary-900 dark:text-white">Social Links</h4>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://yourblog.com"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="instagram">Instagram</Label>
                        <div className="flex items-center mt-1">
                          <span className="text-muted-foreground mr-1">@</span>
                          <Input
                            id="instagram"
                            value={instagramHandle}
                            onChange={(e) => setInstagramHandle(e.target.value.replace(/^@/, ''))}
                            placeholder="username"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter / X</Label>
                        <div className="flex items-center mt-1">
                          <span className="text-muted-foreground mr-1">@</span>
                          <Input
                            id="twitter"
                            value={twitterHandle}
                            onChange={(e) => setTwitterHandle(e.target.value.replace(/^@/, ''))}
                            placeholder="username"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Home Base */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-primary-900 dark:text-white">Home Base</h4>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="show-home" className="text-xs text-primary-600 dark:text-primary-400">
                          Show on profile
                        </Label>
                        <Switch
                          id="show-home"
                          checked={showHomeBase}
                          onCheckedChange={setShowHomeBase}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor="city" className="text-xs">City</Label>
                        <Input
                          id="city"
                          value={homeCity}
                          onChange={(e) => setHomeCity(e.target.value)}
                          placeholder="Denver"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-xs">State</Label>
                        <Input
                          id="state"
                          value={homeState}
                          onChange={(e) => setHomeState(e.target.value)}
                          placeholder="Colorado"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-xs">Country</Label>
                        <Input
                          id="country"
                          value={homeCountry}
                          onChange={(e) => setHomeCountry(e.target.value)}
                          placeholder="USA"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy Settings (only show if public profile is enabled) */}
                {isPublic && (
                  <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-medium text-primary-900 dark:text-white">Privacy Controls</h4>
                      <p className="text-xs text-primary-600 dark:text-primary-400">
                        Choose which categories to hide from your public profile
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {ALL_CATEGORIES.slice(0, 12).map((category) => (
                          <label
                            key={category}
                            className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <input
                              type="checkbox"
                              checked={hiddenCategories.includes(category)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setHiddenCategories([...hiddenCategories, category]);
                                } else {
                                  setHiddenCategories(hiddenCategories.filter(c => c !== category));
                                }
                              }}
                              className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                            />
                            <span className="text-sm">{categoryIcons[category]}</span>
                            <span className="text-xs text-primary-700 dark:text-primary-300 truncate">
                              {categoryLabels[category]}
                            </span>
                          </label>
                        ))}
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hideBucketList}
                          onChange={(e) => setHideBucketList(e.target.checked)}
                          className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                        />
                        <span className="text-sm text-primary-700 dark:text-primary-300">Hide bucket list items from public profile</span>
                      </label>
                    </CardContent>
                  </Card>
                )}

                {/* Preferences */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-medium text-primary-900 dark:text-white">Preferences</h4>
                    <div>
                      <Label className="mb-2 block">Default Map View</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={defaultMapView === 'world' ? 'default' : 'outline'}
                          onClick={() => setDefaultMapView('world')}
                          className="flex-1"
                        >
                          World Map
                        </Button>
                        <Button
                          type="button"
                          variant={defaultMapView === 'usa' ? 'default' : 'outline'}
                          onClick={() => setDefaultMapView('usa')}
                          className="flex-1"
                        >
                          USA Map
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Save/Cancel buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={!!usernameError || isSavingProfile}
                    className="flex-1"
                  >
                    {isSavingProfile && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {isSavingProfile ? 'Saving...' : 'Save Profile'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}

            {!isEditingProfile && profile?.is_public && profile?.username && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your public profile is live at:{' '}
                  <Link href={`/u/${profile.username}`} className="font-medium hover:underline">
                    seeevery.place/u/{profile.username}
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Export Data */}
            <div>
              <h4 className="font-medium text-primary-900 dark:text-white mb-2">Export Your Data</h4>
              <p className="text-sm text-primary-600 dark:text-primary-300 mb-3">
                Download all your travel selections as a JSON file. This includes all countries, states, parks, and other locations you&apos;ve marked.
              </p>
              <Button
                onClick={handleExportData}
                disabled={exportStatus !== 'idle'}
                variant={exportStatus === 'done' ? 'outline' : 'default'}
              >
                {exportStatus === 'exporting' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : exportStatus === 'done' ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Downloaded!
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
            </div>

            <Separator />

            {/* Import Data */}
            <div>
              <h4 className="font-medium text-primary-900 dark:text-white mb-2">Import Data</h4>
              <p className="text-sm text-primary-600 dark:text-primary-300 mb-3">
                Restore your data from a previously exported JSON file. New entries will be added, and existing entries will be updated if the import has newer data.
              </p>

              {importStatus === 'success' && importStats && (
                <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Import successful! Added {importStats.added} new entries, updated {importStats.updated} existing entries.
                </div>
              )}

              {importStatus === 'error' && importError && (
                <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                  {importError}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={importStatus === 'importing'}
              >
                {importStatus === 'importing' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </>
                )}
              </Button>
            </div>

            <Separator />

            {/* Reset Progress */}
            <div>
              <h4 className="font-medium text-primary-900 dark:text-white mb-2">Reset Progress</h4>
              <p className="text-sm text-primary-600 dark:text-primary-300 mb-3">
                Clear your progress for a specific category without losing other data. This cannot be undone.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_CATEGORIES.slice(0, 12).map((category) => {
                  const categorySelections = selections?.[category as keyof UserSelections] || [];
                  const visitedCount = categorySelections.filter(s => s.status === 'visited').length;
                  if (visitedCount === 0) return null;
                  return (
                    <Button
                      key={category}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setResetCategory(category);
                        setShowResetModal(true);
                      }}
                      className="justify-start"
                    >
                      <span className="mr-2">{categoryIcons[category as Category]}</span>
                      <span className="truncate text-xs">{categoryLabels[category as Category]}</span>
                      <span className="ml-auto text-xs text-muted-foreground">({visitedCount})</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Privacy Policy Link */}
            <div>
              <h4 className="font-medium text-primary-900 dark:text-white mb-2">Privacy Policy</h4>
              <p className="text-sm text-primary-600 dark:text-primary-300 mb-3">
                Learn how we handle your data and protect your privacy.
              </p>
              <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/privacy">Read Privacy Policy</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <h4 className="font-medium text-red-900 dark:text-red-300 mb-2">Delete Account</h4>
            <p className="text-sm text-red-700 dark:text-red-400 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
              Your local data will also be cleared. Consider exporting your data first.
            </p>

            {!showDeleteConfirm ? (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete My Account
              </Button>
            ) : (
              <Card className="bg-white dark:bg-gray-800 border-red-300 dark:border-red-700">
                <CardContent className="p-4 space-y-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Type <strong>DELETE</strong> to confirm:
                  </p>
                  <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE"
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                      className="flex-1"
                    >
                      {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-primary-500 dark:text-primary-400">
          <div className="flex justify-center items-center gap-4 mb-2">
            <Link href="/about" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">About</Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/achievements" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Achievements</Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/suggest" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Suggest</Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/privacy" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Privacy</Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/terms" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Terms</Link>
          </div>
          <p>See Every Place - Free Travel Tracker</p>
        </div>
      </footer>

      {/* Reset Category Modal */}
      <AlertDialog open={showResetModal} onOpenChange={setShowResetModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Reset {resetCategory ? categoryLabels[resetCategory as Category] : ''}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently clear all your progress for {resetCategory ? categoryLabels[resetCategory as Category] : ''}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Type <strong>RESET</strong> to confirm:
            </p>
            <Input
              value={resetConfirmText}
              onChange={(e) => setResetConfirmText(e.target.value)}
              placeholder="Type RESET"
            />
          </div>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowResetModal(false);
                setResetCategory(null);
                setResetConfirmText('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => resetCategory && handleResetCategory(resetCategory)}
              disabled={resetConfirmText !== 'RESET' || isResetting}
            >
              {isResetting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isResetting ? 'Resetting...' : 'Reset Progress'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
