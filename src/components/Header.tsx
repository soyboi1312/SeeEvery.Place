'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Category, categoryLabels, categoryIcons, CategoryGroup } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Cloud, CloudOff, Loader2, User, ChevronDown, Users, Lightbulb, MapPin, Settings } from 'lucide-react';

// Group definitions
const categoryGroups: Record<CategoryGroup, Category[]> = {
  destinations: ['countries', 'states', 'territories', 'usCities', 'worldCities', 'airports'],
  nature: ['nationalParks', 'nationalMonuments', 'stateParks', 'fiveKPeaks', 'fourteeners', 'skiResorts', 'surfingReserves'],
  sports: ['mlbStadiums', 'nflStadiums', 'nbaStadiums', 'nhlStadiums', 'soccerStadiums', 'f1Tracks', 'marathons'],
  culture: ['museums', 'themeParks', 'weirdAmericana'],
};

const groupLabels: Record<CategoryGroup, string> = {
  destinations: 'Destinations',
  nature: 'Nature & Parks',
  sports: 'Sports',
  culture: 'Culture',
};

type SyncStatus = 'idle' | 'syncing' | 'offline';

interface HeaderProps {
  onSignIn: () => void;
  onSignOut: () => void;
  isSignedIn: boolean;
  userEmail?: string;
  username?: string | null;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  isAdmin?: boolean;
  syncStatus?: SyncStatus;
  onPreloadAuth?: () => void;
}

function SyncStatusIcon({ status }: { status: SyncStatus }) {
  if (status === 'syncing') {
    return (
      <div className="p-2" title="Syncing...">
        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      </div>
    );
  }
  if (status === 'offline') {
    return (
      <div className="p-2" title="Offline">
        <CloudOff className="w-5 h-5 text-gray-400" />
      </div>
    );
  }
  return (
    <div className="p-2" title="Synced">
      <Cloud className="w-5 h-5 text-green-500" />
    </div>
  );
}

export default function Header({
  onSignIn,
  onSignOut,
  isSignedIn,
  userEmail,
  username,
  isDarkMode,
  onToggleDarkMode,
  isAdmin,
  syncStatus,
  onPreloadAuth
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategorySelect = (cat: Category) => {
    router.push(`/?category=${cat}`);
  };

  const userInitial = userEmail ? userEmail[0].toUpperCase() : 'U';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 backdrop-blur-md ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 border-b border-border shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      {/* Reduced px-4 to px-2 on mobile to prevent overflow on very small screens */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 shrink-0">
              <Image src="/logo.svg" alt="See Every Place" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg sm:text-xl font-bold text-foreground">
                SeeEvery<span className="text-blue-500">.</span>Place
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase hidden sm:block">
                Free Travel Tracker
              </span>
            </div>
          </Link>

          {/* Explore Dropdown (Shadcn) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden sm:flex gap-1 items-center font-medium">
                Explore <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-[80vh] overflow-y-auto" align="start">
              {(Object.keys(categoryGroups) as CategoryGroup[]).map((group) => (
                <DropdownMenuGroup key={group}>
                  <DropdownMenuLabel className="text-xs uppercase text-muted-foreground mt-2 first:mt-0">
                    {groupLabels[group]}
                  </DropdownMenuLabel>
                  {categoryGroups[group].map((cat) => (
                    <DropdownMenuItem
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className="cursor-pointer"
                    >
                      <span className="mr-2 text-lg">{categoryIcons[cat]}</span>
                      {categoryLabels[cat]}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </DropdownMenuGroup>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Community Link */}
          <Button variant="ghost" asChild className="hidden sm:flex gap-1.5 items-center font-medium">
            <Link href="/community">
              <Users className="w-4 h-4" />
              Community
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Sync Status */}
          {isSignedIn && syncStatus && <SyncStatusIcon status={syncStatus} />}

          {/* Dark Mode Toggle */}
          {onToggleDarkMode && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          )}

          {/* User Auth */}
          {!isSignedIn ? (
            <Button
              onClick={onSignIn}
              onMouseEnter={onPreloadAuth}
              onFocus={onPreloadAuth}
              size="sm"
              className="gap-2"
            >
              <User className="w-4 h-4" />
              {/* Hide 'Sign In' text on mobile to save space */}
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 text-white hover:text-white border-0"
                >
                  {userInitial}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none truncate">{userEmail}</p>
                    <p className="text-xs leading-none text-muted-foreground">Signed in</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="sm:hidden">
                  <Link href="/community">
                    <Users className="w-4 h-4 mr-2" />
                    Community
                  </Link>
                </DropdownMenuItem>
                {username && (
                  <DropdownMenuItem asChild>
                    <Link href={`/u/${username}`}>
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/trips">
                    <Trophy className="w-4 h-4 mr-2" />
                    My Quests
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/suggest">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Suggestions
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={onSignOut}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
