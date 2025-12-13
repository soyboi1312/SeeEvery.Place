import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground leading-none">
                SeeEvery<span className="text-primary">.</span>Place<span className="text-[10px] align-super text-muted-foreground">™</span>
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-md text-center border-0 shadow-lg bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <div className="text-8xl mb-4">🔍</div>
            <CardTitle className="text-3xl font-bold">
              Profile Not Found
            </CardTitle>
            <CardDescription className="text-lg">
              This profile doesn&apos;t exist or is set to private.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <Link href="/">
                <MapPin className="w-4 h-4" />
                Create Your Own Map
              </Link>
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Start tracking your travel adventures for free
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
