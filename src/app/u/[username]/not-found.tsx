import Link from 'next/link';
import Image from 'next/image';

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-black/5 dark:border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-primary-900 dark:text-white leading-none">
                SeeEvery<span className="text-accent-500">.</span>Place<span className="text-[10px] align-super">TM</span>
              </h1>
            </div>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-8xl mb-6">🔍</div>
        <h2 className="text-3xl font-bold text-primary-900 dark:text-white mb-4">
          Profile Not Found
        </h2>
        <p className="text-lg text-primary-600 dark:text-primary-300 mb-8">
          This profile doesn&apos;t exist or is set to private.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Create Your Own Map
          </Link>

          <p className="text-sm text-primary-500 dark:text-primary-400">
            Start tracking your travel adventures for free
          </p>
        </div>
      </main>
    </div>
  );
}
