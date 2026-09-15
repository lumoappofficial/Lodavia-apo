import { useState, useEffect, useRef } from 'react';
import { notificationService, NotificationItem } from '../services/notification.service';
import { useAuth } from './useAuth';
import { playNotificationSound } from '../utils/soundEffects';

export function useNotifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const previousUnreadCount = useRef<number | null>(null);

  const fetchNotifications = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const notifs = await notificationService.getNotifications(currentUser.id);
      const unreadCount = notifs.filter(n => !n.read).length;
      if (previousUnreadCount.current !== null && unreadCount > previousUnreadCount.current) {
        playNotificationSound();
      }
      previousUnreadCount.current = unreadCount;
      setNotifications(notifs);
    } catch (e) {
      console.error('Error fetching notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser?.id]);

  return {
    notifications,
    loading,
    refresh: fetchNotifications,
    markAsRead
  };
}
