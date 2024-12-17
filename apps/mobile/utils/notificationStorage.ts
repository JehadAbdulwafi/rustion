import { store } from '@/hooks/storage';

export interface Notification {
  id: string;
  title: string;
  body: string;
  picture?: string;
  timestamp: number;
  read: boolean;
}

const NOTIFICATIONS_STORAGE_KEY = '@notifications';

export const saveNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
  try {
    const existingNotifications = getNotifications();
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read: false,
    };

    const updatedNotifications = [newNotification, ...existingNotifications];
    store.set(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
    return newNotification;
  } catch (error) {
    console.error('Error saving notification:', error);
    return null;
  }
};

export const getNotifications = (): Notification[] => {
  try {
    const notifications = store.getString(NOTIFICATIONS_STORAGE_KEY);
    return notifications ? JSON.parse(notifications) : [];
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    store.set(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const clearAllNotifications = () => {
  try {
    store.set(NOTIFICATIONS_STORAGE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
};
