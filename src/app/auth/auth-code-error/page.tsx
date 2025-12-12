'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sun, Moon, AlertTriangle } from 'lucide-react';

export default function AuthCodeErrorPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-background/90 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground leading-none">
                SeeEvery<span className="text-primary">.</span>Place<span className="text-[10px] align-super text-muted-foreground">™</span>
              </span>
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
            <Button asChild size="sm">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Error Content */}
      <main className="max-w-2xl mx-auto px-4 py-16">
        <Card>
          <CardContent className="p-8 text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-4">
              Authentication Error
            </h1>

            <p className="text-muted-foreground mb-6">
              We couldn&apos;t complete the sign-in process. This can happen if:
            </p>

            <ul className="text-left text-muted-foreground mb-8 space-y-2 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground/50 mt-1">•</span>
                <span>The authentication link expired</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground/50 mt-1">•</span>
                <span>The link was already used</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground/50 mt-1">•</span>
                <span>There was a temporary network issue</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/">Try Again</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Continue Without Account</Link>
              </Button>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              Your travel data is saved locally and will sync once you sign in successfully.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
