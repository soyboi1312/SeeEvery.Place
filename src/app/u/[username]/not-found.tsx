import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
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
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-8xl mb-6">🔍</div>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Profile Not Found
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          This profile doesn&apos;t exist or is set to private.
        </p>

        <div className="space-y-4">
          <Button asChild size="lg">
            <Link href="/">
              <MapPin className="w-5 h-5 mr-2" />
              Create Your Own Map
            </Link>
          </Button>

          <p className="text-sm text-muted-foreground">
            Start tracking your travel adventures for free
          </p>
        </div>
      </main>
    </div>
  );
}
