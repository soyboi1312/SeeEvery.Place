'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Moon, ArrowRight, Shield, AlertTriangle, Check, X } from 'lucide-react';

export default function PrivacyPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground leading-none">
                SeeEvery<span className="text-blue-500">.</span>Place<span className="text-[10px] align-super">™</span>
              </h1>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase hidden sm:block">
                Free Travel Tracker
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button asChild>
              <Link href="/">Start Mapping</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-6">Privacy Policy</h1>

          <p className="text-lg text-muted-foreground mb-8">
            Last updated: December 2025
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              See Every Place is committed to protecting your privacy. This policy explains what data we collect,
              how we use it, and your rights regarding your personal information.
            </p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">The short version:</strong> We are an exploration-first platform.
              We store your travel selections (places you visited) and statistics. We do not host or store personal media libraries (photos or videos).
              Your data is stored locally on your device by default and is private. If you create an account, your data is encrypted and synced securely.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Data We Collect</h2>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Without an Account (Local Storage)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  If you use See Every Place without signing in, all your data is stored locally in your browser.
                  We do not have access to this data, and it never leaves your device. Please note that clearing your browser cache will delete this data.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">With an Account</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  When you create an account, we collect:
                </p>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong className="text-foreground">Email address</strong> - Used for authentication and account recovery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong className="text-foreground">Travel selections</strong> - Your visited/bucket list items, synced across devices. Private by default.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong className="text-foreground">Profile information</strong> - Optional username, display name, and bio if you choose to provide them</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong className="text-foreground">Achievements</strong> - Badges and XP earned through your travel progress</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Public Profiles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  <strong className="text-foreground">Important:</strong> If you enable a public profile, the following information becomes visible to anyone on the internet:
                </p>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Your username and profile URL (seeevery.place/u/yourname)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Your display name and bio (if provided)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Your travel statistics and visited locations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Your achievements and XP level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Your travel map visualization</span>
                  </li>
                </ul>
                <p className="text-muted-foreground text-sm mt-3">
                  Public profiles are <strong className="text-foreground">disabled by default</strong>. You must explicitly enable this feature in your profile settings. You can disable it at any time to make your profile private again.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  When you submit a category suggestion, we collect:
                </p>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong className="text-foreground">IP address (hashed)</strong> - Your IP is cryptographically hashed before storage for anti-spam rate limiting. We never store your raw IP address. Hash data is automatically deleted after 90 days.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong className="text-foreground">Email address (optional)</strong> - Only if you choose to provide it for follow-up communication about your suggestion</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Data</h2>
            <ul className="text-muted-foreground space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>To provide and maintain the See Every Place service</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>To sync your travel data across your devices</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>To send important account-related emails (password resets, security alerts)</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <span>We do <strong>not</strong> sell your data to third parties</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <span>We do <strong>not</strong> use your data for advertising</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Data Storage & Security</h2>
            <p className="text-muted-foreground mb-4">
              Account data is stored securely using Supabase, which provides:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Encryption in transit (TLS/SSL) and at rest</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Secure authentication with password hashing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Row-level security ensuring you can only access your own data</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Cookies</h2>
            <p className="text-muted-foreground">
              We use essential cookies for authentication purposes only. These cookies keep you signed in
              and are required for the app to function. We do not use tracking cookies or third-party
              advertising cookies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong className="text-foreground">Access your data</strong> - View all data associated with your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong className="text-foreground">Export your data</strong> - Download your travel selections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong className="text-foreground">Delete your data</strong> - Request complete deletion of your account and all associated data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong className="text-foreground">Opt out</strong> - Use See Every Place without an account (local storage only)</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground mb-4">
              See Every Place uses the following third-party services:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong className="text-foreground">Supabase</strong> - Authentication and database hosting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong className="text-foreground">Cloudflare</strong> - Website hosting and security</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this privacy policy or want to exercise your data rights,
              please contact us at{' '}
              <a href="mailto:hello@seeevery.place" className="text-primary hover:underline">
                hello@seeevery.place
              </a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will notify users of any material
              changes by posting the new policy on this page with an updated revision date.
            </p>
          </section>

          <section className="text-center py-8">
            <Button asChild size="lg" className="gap-2">
              <Link href="/">
                Back to See Every Place
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </section>
        </article>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <div className="flex justify-center gap-4 mb-2">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <span>•</span>
            <Link href="/suggest" className="hover:text-foreground transition-colors">Suggest</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
          <p>See Every Place - Free Travel Tracker</p>
        </div>
      </footer>
    </div>
  );
}
