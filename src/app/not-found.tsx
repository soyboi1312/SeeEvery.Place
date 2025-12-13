'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Home, Info } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border">
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
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-lg text-center border-0 shadow-lg bg-background/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="text-8xl mb-4">🗺️</div>
            <CardTitle className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              404
            </CardTitle>
            <CardDescription className="text-2xl sm:text-3xl font-bold text-foreground pt-2">
              Page Not Found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Looks like this destination isn&apos;t on our map yet.
              Let&apos;s get you back to exploring!
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">
                <Info className="w-4 h-4" />
                Learn More
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <div className="flex justify-center items-center gap-4 mb-3">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/suggest" className="hover:text-foreground transition-colors">Suggest</Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
          <p>Made by people who really like maps.</p>
        </div>
      </footer>
    </div>
  );
}
