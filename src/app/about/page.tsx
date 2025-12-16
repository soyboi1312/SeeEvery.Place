'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { useAuth } from '@/lib/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Globe, Trophy, Users, Flame, Share2, MapPin, Sparkles, Mail, Rocket } from 'lucide-react';

export default function AboutPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, signOut, isAdmin, username } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Header
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={signOut}
        isSignedIn={!!user}
        userEmail={user?.email}
        username={username}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        isAdmin={isAdmin}
        syncStatus="idle"
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 flex-grow">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-6">About See Every Place</h1>

          <p className="text-xl text-muted-foreground mb-8">
            Turn exploration into a game. Track progress, unlock achievements, and complete your bucket list—one destination at a time.
          </p>

          {/* What is it */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">What is See Every Place?</h2>
            <p className="text-muted-foreground mb-4">
              See Every Place is the massive multiplayer game for real-world travel. It transforms your travel history into a living RPG character sheet—complete with stats, levels, and achievements.
            </p>
            <p className="text-muted-foreground">
              Unlike traditional travel apps that focus on booking flights or perfect Instagram photos, we focus on <strong>the conquest</strong>. Did you actually visit all 50 states? Have you seen every MLB stadium? Track your progress, maintain your monthly adventure streak, and compete with friends to see who can explore the most.
            </p>
          </section>

          {/* The Story Section */}
          <Card className="mb-12 bg-blue-50/50 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-500" />
                The Story
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Remember completing your Pokédex? Or 100%-ing a video game? We wanted that same satisfying feeling—but for real-world travel.
                Not just checking off countries, but the mountain peaks, the weird roadside attractions, the stadiums that made the trip special.
              </p>
              <p>
                Most travel apps focus on social feeds and photos. We wanted a tool dedicated purely to <strong>progress</strong>—no pressure to curate the perfect post.
                Just the thrill of watching your map fill in, one conquest at a time.
              </p>
              <p>
                We built See Every Place as a quest log for explorers. Simple data-driven tracking. Visual progress bars. Achievements that actually mean something.
              </p>
              <p>
                <strong className="text-foreground">It&apos;s the video game for real-world travel.</strong> And now we&apos;re sharing it with you.
              </p>
              <p className="text-sm text-muted-foreground pt-2 border-t">
                See Every Place is free and works offline. Your data stays private by default.
                Sign up to unlock achievements, earn XP, and create a shareable public profile.
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <Users className="w-8 h-8 text-blue-500 mb-3" />
                  <h3 className="font-bold text-foreground mb-2">Social Competition</h3>
                  <p className="text-muted-foreground text-sm">
                    Follow friends and track their travels in real-time on the Activity Feed. Compete on global and category-specific Leaderboards to prove you&apos;re the ultimate explorer.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <MapPin className="w-8 h-8 text-purple-500 mb-3" />
                  <h3 className="font-bold text-foreground mb-2">Collaborative Quests</h3>
                  <p className="text-muted-foreground text-sm">
                    Planning a road trip? Create a custom Quest and invite friends to collaborate. Map out your route, set dates, and check off locations together.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Flame className="w-8 h-8 text-orange-500 mb-3" />
                  <h3 className="font-bold text-foreground mb-2">Streaks & Challenges</h3>
                  <p className="text-muted-foreground text-sm">
                    Keep your momentum alive with Login and Season Streaks. Participate in time-limited events like &quot;Summer of Parks&quot; to earn exclusive badges and bonus XP.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Trophy className="w-8 h-8 text-yellow-500 mb-3" />
                  <h3 className="font-bold text-foreground mb-2">Achievements & XP</h3>
                  <p className="text-muted-foreground text-sm">
                    Every new place earns you XP. Level up your profile from a &quot;Novice Explorer&quot; to a &quot;World Traveler&quot; and unlock hundreds of hidden achievements.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Globe className="w-8 h-8 text-green-500 mb-3" />
                  <h3 className="font-bold text-foreground mb-2">Complete the Set</h3>
                  <p className="text-muted-foreground text-sm">
                    Go beyond countries. Track progress across 25+ categories including National Parks, Ski Resorts, Michelin Cities, and Weird Americana.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Share2 className="w-8 h-8 text-pink-500 mb-3" />
                  <h3 className="font-bold text-foreground mb-2">Shareable Stats</h3>
                  <p className="text-muted-foreground text-sm">
                    Generate beautiful, instant visualizations of your travel map. Share your 100% completion status or your public profile link with the world.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Categories</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 text-muted-foreground">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Destinations</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🌍</span>
                    <span><strong className="text-foreground">Countries</strong> - All 197 countries worldwide</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🇺🇸</span>
                    <span><strong className="text-foreground">US States</strong> - 50 states plus DC and territories</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">✈️</span>
                    <span><strong className="text-foreground">Airports</strong> - Major hubs from JFK to Changi</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3 text-muted-foreground">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Nature</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏞️</span>
                    <span><strong className="text-foreground">National Parks</strong> - America&apos;s natural treasures</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🌲</span>
                    <span><strong className="text-foreground">State Parks</strong> - Hidden gems across all 50 states</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏔️</span>
                    <span><strong className="text-foreground">5000m+ Peaks</strong> - World&apos;s highest mountains</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">⛰️</span>
                    <span><strong className="text-foreground">US 14ers</strong> - Peaks over 14,000 feet</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">⛷️</span>
                    <span><strong className="text-foreground">Ski Resorts</strong> - Whistler, Zermatt, Niseko & more</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🌊</span>
                    <span><strong className="text-foreground">Surfing Reserves</strong> - Legendary breaks worldwide</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3 text-muted-foreground">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Sports</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏟️</span>
                    <span><strong className="text-foreground">Stadiums</strong> - MLB, NFL, NBA, NHL, Soccer, Cricket, Rugby, Tennis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏎️</span>
                    <span><strong className="text-foreground">F1 Tracks</strong> - Formula 1 race circuits worldwide</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏃</span>
                    <span><strong className="text-foreground">Marathons</strong> - World Marathon Majors</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3 text-muted-foreground">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Culture</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🎨</span>
                    <span><strong className="text-foreground">Museums</strong> - World-class art and history</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🎢</span>
                    <span><strong className="text-foreground">Theme Parks</strong> - Disney, Universal & more</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🗿</span>
                    <span><strong className="text-foreground">Weird Americana</strong> - Quirky roadside attractions</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Privacy</h2>
            <p className="text-muted-foreground">
              Your data belongs to you. By default, it lives on your device and is private. We don&apos;t track your travels, and we never sell your data.
              If you choose to create a public profile, only the information you explicitly choose to share will be visible.
              Sync is optional and encrypted. Read the full <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6" /> Contact
            </h2>
            <p className="text-muted-foreground">
              Have questions, feedback, or suggestions? Reach out at{' '}
              <a href="mailto:hello@seeevery.place" className="text-primary hover:underline">
                hello@seeevery.place
              </a>.
            </p>
          </section>

          {/* What's Next Section */}
          <Card className="mb-12 bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-6 h-6 text-amber-500" />
                New Quests Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                I&apos;m constantly adding new categories to conquer, and the community decides what comes first.
              </p>
              <p>
                Visit the{' '}
                <Link href="/suggest" className="text-primary hover:underline font-medium">
                  Suggestions Page
                </Link>{' '}
                to see what&apos;s in development, vote for your favorite categories, or submit a new quest idea. If enough explorers want it, I&apos;ll build it.
              </p>
            </CardContent>
          </Card>

          <section className="text-center py-8">
            <Button asChild size="lg" className="gap-2">
              <Link href="/">
                Start Your Adventure
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </section>
        </article>
      </div>

      <Footer user={user} onSignIn={() => setShowAuthModal(true)} showCategoryDirectory={false} />

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
