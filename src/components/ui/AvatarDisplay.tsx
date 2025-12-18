'use client';

import { memo } from 'react';
import { User } from 'lucide-react';
import { PROFILE_ICONS } from '@/components/ProfileIcons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarDisplayProps {
  avatarUrl: string | null;
  username: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

/**
 * Shared avatar display component that handles:
 * - Profile icon avatars (from PROFILE_ICONS)
 * - URL-based avatars (http/https)
 * - Fallback to User icon or initials
 */
export const AvatarDisplay = memo(function AvatarDisplay({
  avatarUrl,
  username,
  size = 'md',
  className = '',
}: AvatarDisplayProps) {
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizeClasses[size];

  // Check if avatarUrl is a profile icon name
  if (avatarUrl && PROFILE_ICONS[avatarUrl]) {
    const IconComponent = PROFILE_ICONS[avatarUrl];
    return (
      <div
        className={`${sizeClass} rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0 ${className}`}
      >
        <IconComponent className={iconSize} />
      </div>
    );
  }

  // Check if it's a URL (for backwards compatibility)
  if (avatarUrl && (avatarUrl.startsWith('http') || avatarUrl.startsWith('/'))) {
    return (
      <Avatar className={`${sizeClass} ${className}`}>
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback>{username[0]?.toUpperCase() || '?'}</AvatarFallback>
      </Avatar>
    );
  }

  // Default fallback
  return (
    <div
      className={`${sizeClass} rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 ${className}`}
    >
      <User className={`${iconSize} text-slate-400`} />
    </div>
  );
});

export default AvatarDisplay;
