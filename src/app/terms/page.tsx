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
import { ArrowRight, AlertTriangle, X } from 'lucide-react';

export default function TermsPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, signOut, isAdmin } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
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
      <div className="max-w-4xl mx-auto px-4 py-12 flex-grow">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-6">Terms of Service</h1>

          <p className="text-lg text-muted-foreground mb-8">
            Last updated: December 2025
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using See Every Place™ (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the Service.
            </p>
            <p className="text-muted-foreground">
              We reserve the right to update these terms at any time. Continued use of the Service after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              See Every Place™ is a free travel tracking application focused on map-based exploration and statistics.
              Unlike social media platforms, our Service is designed for tracking visited locations and achievements, not for hosting or sharing user photo galleries.
              The Service includes:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Interactive maps for tracking countries, states, parks, mountains, and other destinations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Local storage for anonymous usage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Optional cloud sync with account creation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Achievements and XP gamification system</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Optional public profiles for sharing your travels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Community suggestion features</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Eligibility &amp; User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              You must be at least 13 years of age to create an account. If you are under 18, you may use the Service only with the involvement of a parent or guardian.
            </p>
            <p className="text-muted-foreground mb-4">
              Account creation is optional. If you create an account:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>You are responsible for maintaining the security of your account credentials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>You must provide accurate information during registration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>You are responsible for all activity that occurs under your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>You must notify us immediately of any unauthorized use</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. User-Generated Content</h2>
            <p className="text-muted-foreground mb-4">
              When you submit public content to See Every Place™ (such as category suggestions, public votes, general feedback, or public profile information):
            </p>
            <Card className="mb-4">
              <CardContent className="pt-6">
                <ul className="text-muted-foreground space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>You grant us a perpetual, worldwide, royalty-free license to use, modify, and incorporate your submissions into the Service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>You represent that you have the right to submit such content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>You waive any claims of ownership over suggestions that are implemented as features</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Public Profile Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  If you create a public profile, the following content guidelines apply:
                </p>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong className="text-foreground">Usernames</strong> - Must be 3-20 characters, contain only letters, numbers, and underscores. Must not impersonate others, contain offensive language, or violate trademarks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong className="text-foreground">Display names and bios</strong> - Must not contain offensive, harmful, or misleading content. Must not include personal information of others without consent.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong className="text-foreground">Travel data</strong> - When you enable a public profile, your travel statistics and map data become publicly visible.</span>
                  </li>
                </ul>
                <p className="text-muted-foreground text-sm mt-3">
                  We reserve the right to remove usernames, bios, or disable public profiles that violate these guidelines.
                </p>
              </CardContent>
            </Card>

            <p className="text-muted-foreground text-sm">
              This ensures we can freely implement community suggestions and maintain a safe environment for all users.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Prohibited Uses</h2>
            <p className="text-muted-foreground mb-4">You agree not to:</p>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <span>Use the Service for any illegal purpose</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <span>Submit spam, offensive content, or malicious suggestions</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <span>Attempt to gain unauthorized access to our systems</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <span>Interfere with or disrupt the Service</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <span>Scrape or harvest data from the Service without permission</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <span>Impersonate others or misrepresent your affiliation</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Account Termination</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to suspend or terminate your account at any time, with or without notice, for:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Violation of these Terms of Service</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Abuse of the suggestion or voting system</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Any conduct we deem harmful to other users or the Service</span>
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You may delete your account at any time through the app settings.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Disclaimer of Warranties</h2>
            <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4 font-medium">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>
                <p className="text-muted-foreground text-sm mb-3">
                  We do not warrant that:
                </p>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>The Service will be uninterrupted, secure, or error-free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Location data (coordinates, trail information, etc.) is accurate or complete</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Your data will never be lost (always maintain your own backups)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Important
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  See Every Place™ provides location and travel information for reference purposes only.
                </p>
                <ul className="text-muted-foreground space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span><strong className="text-foreground">Outdoor Activities:</strong> Information about mountains, hiking trails, ski resorts, and other outdoor destinations is for general reference. Always verify conditions, obtain proper permits, and exercise appropriate caution. We are not responsible for injuries, accidents, or deaths resulting from reliance on our data.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span><strong className="text-foreground">Travel Decisions:</strong> We are not responsible for travel decisions made based on the Service, including but not limited to flight bookings, accommodations, or itinerary planning.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span><strong className="text-foreground">Data Loss:</strong> We are not liable for loss of your travel tracking data due to technical issues, account deletion, or service discontinuation.</span>
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4 text-sm">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, SEE EVERY PLACE™ SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless See Every Place™, its operators, and affiliates from any claims,
              damages, losses, or expenses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              The See Every Place™ name, logo, and original content are protected by trademark and copyright law.
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Map data is sourced from Natural Earth and public domain sources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Location data has been compiled from various public sources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>The Service uses open-source libraries under their respective licenses</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of the United States,
              without regard to conflict of law principles. Any disputes shall be resolved in the appropriate courts.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:hello@seeevery.place" className="text-primary hover:underline">
                hello@seeevery.place
              </a>.
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

      <Footer user={user} onSignIn={() => setShowAuthModal(true)} showCategoryDirectory={false} />

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
