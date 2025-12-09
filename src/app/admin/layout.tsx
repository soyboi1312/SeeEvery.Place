import Link from 'next/link';
import Image from 'next/image';
import AdminNav from './components/AdminNav';

export const metadata = {
  title: 'Admin Panel - SeeEvery.Place',
  description: 'Admin dashboard for SeeEvery.Place',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Shared Header for ALL Admin pages */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-primary-900 dark:text-white leading-none">
                SeeEvery<span className="text-accent-500">.</span>Place<span className="text-[10px] align-super text-primary-400">TM</span>
              </h1>
              <span className="text-[10px] text-primary-500 dark:text-primary-400 font-medium tracking-wider uppercase">
                Admin Panel
              </span>
            </div>
          </Link>

          {/* Navigation and controls */}
          <AdminNav />
        </div>
      </header>

      {/* Page Content */}
      <main>
        {children}
      </main>

      {/* Shared Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-primary-500 dark:text-primary-400">
          <p>Admin Panel - SeeEvery.Place</p>
        </div>
      </footer>
    </div>
  );
}
