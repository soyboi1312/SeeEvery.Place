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
import { ArrowRight, Globe, BarChart3, Trophy, User, Palette, Sparkles, Mail, Rocket, MapPin } from 'lucide-react';

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
            Track your adventures, build custom lists, and share beautiful maps with friends and family.
          </p>

          {/* What is it */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">What is See Every Place?</h2>
            <p className="text-muted-foreground mb-4">
              See Every Place is a free travel tracking app that helps you visualize everywhere you&apos;ve been
              and everywhere you want to go. Whether you&apos;re a seasoned globetrotter or just starting your
              travel journey, See Every Place makes it easy to keep track of your adventures.
            </p>
            <p className="text-muted-foreground">
              Track far more than just countries. From national parks and mountain peaks to stadiums and weird
              roadside attractions, we help you capture the full detail of your journey.
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
                Memories fade faster than we&apos;d like. We wanted a way to hold onto the places we&apos;ve seen, not just the countries, but the mountain peaks and the random roadside attractions that made the trip special.
              </p>
              <p>
                Most travel apps focus on social feeds and photos. We wanted a tool dedicated purely to the map itself—no pressure to curate the perfect post. Just the <strong>action</strong> of exploration.
              </p>
              <p>
                We wanted something simple: a visual way to see where we&apos;d been based on <em>data</em>, not media. A platform dedicated to the map itself.
              </p>
              <p>
                <strong className="text-foreground">So we built one.</strong> And now we&apos;re sharing it with you.
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
                  <Globe className="w-8 h-8 text-blue-500 mb-3" />
                  <h3 className="font-bold text-foreground mb-2">Interactive Maps</h3>
                  <p className="text-muted-foreground text-sm">
                    See your travels come to life on beautiful interactive world and US maps with countries
                    and states colored by visit status.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <BarChart3 className="w-8 h-8 text-green-500 mb-3" />
                  <h3 className="font-bold text-foreground mb-2">Track Everything</h3>
                  <p className="text-muted-foreground text-sm">
                    Go beyond countries - track parks, mountains, museums,
                    stadiums, airports, ski resorts, theme parks, and surf spots.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Trophy className="w-8 h-8 text-yellow-500 mb-3" />
                  <h3 className="font-bold text-foreground mb-2">Achievements & XP</h3>
                  <p className="text-muted-foreground text-sm">
                    Unlock achievements as you explore. Earn XP, level up, and collect badges from bronze
                    to legendary tier. Discover secret achievements along the way.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <User className="w-8 h-8 text-purple-500 mb-3" />
                  <h3 className="font-bold text-foreground mb-2">Public Profiles</h3>
                  <p className="text-muted-foreground text-sm">
                    Create a unique shareable profile at seeevery.place/u/yourname. Show off your map and stats.
                    No photo feeds, just pure exploration data.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Palette className="w-8 h-8 text-pink-500 mb-3" />
                  <h3 className="font-bold text-foreground mb-2">Shareable Graphics</h3>
                  <p className="text-muted-foreground text-sm">
                    Generate beautiful, customizable graphics to share your travel stats on social media
                    or with friends.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Sparkles className="w-8 h-8 text-cyan-500 mb-3" />
                  <h3 className="font-bold text-foreground mb-2">Bucket List</h3>
                  <p className="text-muted-foreground text-sm">
                    Plan your future adventures by adding destinations to your bucket list and watch
                    your dreams become reality.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <MapPin className="w-8 h-8 text-orange-500 mb-3" />
                  <h3 className="font-bold text-foreground mb-2">Custom Lists</h3>
                  <p className="text-muted-foreground text-sm">
                    Create place collections for any goal—national parks to conquer, stadiums to visit,
                    or road trip routes. Share with friends and track together.
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
                What&apos;s Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                I&apos;m constantly adding new maps and markers, and I let the community decide what comes first.
              </p>
              <p>
                Visit the{' '}
                <Link href="/suggest" className="text-primary hover:underline font-medium">
                  Suggestions Page
                </Link>{' '}
                to see what I&apos;m working on, vote for your favorite categories, or submit a new idea. If enough people want it, I&apos;ll build it.
              </p>
            </CardContent>
          </Card>

          <section className="text-center py-8">
            <Button asChild size="lg" className="gap-2">
              <Link href="/">
                Start Tracking Your Travels
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
