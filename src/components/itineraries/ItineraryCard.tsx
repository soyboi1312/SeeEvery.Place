'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Itinerary, ItineraryRole } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PROFILE_ICONS } from '@/components/ProfileIcons';
import {
  Calendar,
  MapPin,
  Users,
  Globe,
  Lock,
  Crown,
  Pencil,
  Eye,
} from 'lucide-react';

interface ItineraryCardProps {
  itinerary: Itinerary;
  showOwner?: boolean;
}

const getRoleBadge = (role: ItineraryRole) => {
  switch (role) {
    case 'owner':
      return (
        <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          <Crown className="w-3 h-3" />
          Owner
        </Badge>
      );
    case 'editor':
      return (
        <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          <Pencil className="w-3 h-3" />
          Editor
        </Badge>
      );
    case 'viewer':
      return (
        <Badge variant="secondary" className="gap-1 bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300">
          <Eye className="w-3 h-3" />
          Viewer
        </Badge>
      );
    default:
      return null;
  }
};

const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return null;

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };

  const start = startDate ? new Date(startDate).toLocaleDateString('en-US', options) : '';
  const end = endDate ? new Date(endDate).toLocaleDateString('en-US', options) : '';

  if (start && end) {
    return `${start} - ${end}`;
  }
  return start || end;
};

const ItineraryCard = memo(function ItineraryCard({
  itinerary,
  showOwner = false
}: ItineraryCardProps) {
  const dateRange = formatDateRange(itinerary.start_date, itinerary.end_date);
  const IconComponent = itinerary.owner_avatar_url && PROFILE_ICONS[itinerary.owner_avatar_url]
    ? PROFILE_ICONS[itinerary.owner_avatar_url]
    : null;

  return (
    <Link href={`/trips/${itinerary.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/30 cursor-pointer overflow-hidden">
        {/* Cover Image or Gradient */}
        <div className="h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative">
          {itinerary.cover_image_url && (
            <img
              src={itinerary.cover_image_url}
              alt={itinerary.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Visibility Badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className={`gap-1 text-xs ${
                itinerary.is_public
                  ? 'bg-green-100/90 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                  : 'bg-gray-100/90 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300'
              }`}
            >
              {itinerary.is_public ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {itinerary.is_public ? 'Public' : 'Private'}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title and Role */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {itinerary.title}
            </h3>
            {itinerary.user_role && getRoleBadge(itinerary.user_role)}
          </div>

          {/* Description */}
          {itinerary.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {itinerary.description}
            </p>
          )}

          {/* Date Range */}
          {dateRange && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
              <Calendar className="w-4 h-4" />
              <span>{dateRange}</span>
            </div>
          )}

          {/* Stats Row */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {/* Places Count */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{itinerary.item_count || 0} places</span>
            </div>

            {/* Collaborators Count */}
            {(itinerary.collaborator_count || 0) > 0 && (
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{itinerary.collaborator_count} collaborator{itinerary.collaborator_count !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Owner Info (for shared/public itineraries) */}
          {showOwner && itinerary.owner_username && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
                {IconComponent ? (
                  <IconComponent className="w-3 h-3" />
                ) : (
                  itinerary.owner_username[0].toUpperCase()
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                @{itinerary.owner_username}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
});

export default ItineraryCard;
