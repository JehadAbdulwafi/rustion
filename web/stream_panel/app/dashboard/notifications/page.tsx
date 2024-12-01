'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, Trash2, AlertCircle, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export default function NotificationsPage() {
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Stream Started Successfully',
      message: 'Your stream has started and is now live.',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
    },
    {
      id: '2',
      title: 'New Feature Available',
      message: 'Check out our new streaming quality options in settings!',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: false,
    },
    {
      id: '3',
      title: 'Connection Warning',
      message: 'Your stream experienced some connection issues. Please check your network.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
    },
    {
      id: '4',
      title: 'Stream Error',
      message: 'Your last stream ended unexpectedly. View logs for more details.',
      type: 'error',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "All notifications marked as read",
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "All notifications cleared",
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
    toast({
      title: "Notification deleted",
    });
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCheck className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Stay updated with your stream notifications
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={notifications.every(n => n.read)}
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear all
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up! Check back later for new updates.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start space-x-4 rounded-lg border p-4",
                    !notification.read && "bg-muted/50"
                  )}
                >
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <CheckCheck className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
