'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, UserPlus, Check, Loader2 } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils/formatTimeAgo';
import { PROFILE_ICONS } from '@/components/ProfileIcons';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  actor_id: string | null;
  actor_username: string | null;
  actor_avatar_url: string | null;
  data: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

function getNotificationIcon(type: string) {
  // Extensible: add new cases as notification types are implemented
  if (type === 'follow') {
    return <UserPlus className="w-4 h-4 text-blue-500" />;
  }
  return <Bell className="w-4 h-4" />;
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications?limit=10');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      });
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs"
              onClick={(e) => {
                e.preventDefault();
                markAllAsRead();
              }}
            >
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-3 p-3 cursor-pointer ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                }`}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id);
                  }
                }}
              >
                {(() => {
                  const avatarUrl = notification.actor_avatar_url;
                  // Check if avatarUrl is a profile icon name
                  if (avatarUrl && PROFILE_ICONS[avatarUrl]) {
                    const IconComponent = PROFILE_ICONS[avatarUrl];
                    return (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                    );
                  }
                  // Check if it's a URL (for backwards compatibility)
                  if (avatarUrl && (avatarUrl.startsWith('http') || avatarUrl.startsWith('/'))) {
                    return (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback>
                          {notification.actor_username?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                    );
                  }
                  // Default fallback
                  return (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                  );
                })()}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(notification.created_at)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
