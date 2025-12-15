'use client';

import Link from 'next/link';
import { Calendar, MapPin, Users, Lock, Globe, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Itinerary, ItineraryStatus } from '@/lib/types';
import { PROFILE_ICONS } from '@/components/ProfileIcons';
import { User } from 'lucide-react';

interface ItineraryCardProps {
  itinerary: Itinerary;
  showOwner?: boolean;
  onEdit?: (itinerary: Itinerary) => void;
  onDelete?: (itinerary: Itinerary) => void;
}

const STATUS_STYLES: Record<ItineraryStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  planned: { label: 'Planned', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  in_progress: { label: 'In Progress', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
};

function formatDateRange(startDate?: string | null, endDate?: string | null): string {
  if (!startDate && !endDate) return '';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (startDate && endDate) {
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');

    // Same year
    if (start.getFullYear() === end.getFullYear()) {
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  if (startDate) return `Starting ${formatDate(startDate)}`;
  if (endDate) return `Until ${formatDate(endDate)}`;
  return '';
}

export function ItineraryCard({
  itinerary,
  showOwner = false,
  onEdit,
  onDelete,
}: ItineraryCardProps) {
  const dateRange = formatDateRange(itinerary.start_date, itinerary.end_date);
  const statusStyle = STATUS_STYLES[itinerary.status];
  const canManage = itinerary.is_owner || itinerary.user_role === 'editor';

  const renderAvatar = () => {
    const avatarUrl = itinerary.owner_avatar_url;
    if (avatarUrl && PROFILE_ICONS[avatarUrl]) {
      const IconComponent = PROFILE_ICONS[avatarUrl];
      return (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
          <IconComponent className="w-3 h-3" />
        </div>
      );
    }
    if (avatarUrl && (avatarUrl.startsWith('http') || avatarUrl.startsWith('/'))) {
      return (
        <img
          src={avatarUrl}
          alt={itinerary.owner_username || 'Owner'}
          className="w-6 h-6 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
        <User className="w-3 h-3 text-slate-400" />
      </div>
    );
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/trips/${itinerary.id}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {itinerary.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 flex-shrink-0">
            {itinerary.is_public ? (
              <Globe className="w-4 h-4 text-green-500" aria-label="Public" />
            ) : (
              <Lock className="w-4 h-4 text-slate-400" aria-label="Private" />
            )}
            {canManage && (onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(itinerary)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && itinerary.is_owner && (
                    <DropdownMenuItem
                      onClick={() => onDelete(itinerary)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <Link href={`/trips/${itinerary.id}`} className="block">
          {itinerary.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
              {itinerary.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary" className={statusStyle.className}>
              {statusStyle.label}
            </Badge>

            {dateRange && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>{dateRange}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{itinerary.item_count || 0} places</span>
            </div>

            {(itinerary.collaborator_count || 0) > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{itinerary.collaborator_count} collaborator{itinerary.collaborator_count !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {showOwner && itinerary.owner_username && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              {renderAvatar()}
              <span className="text-xs text-slate-500">@{itinerary.owner_username}</span>
            </div>
          )}
        </Link>
      </CardContent>
    </Card>
  );
}

export default ItineraryCard;
