import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Settings2, 
  Heart, 
  Gem, 
  ShieldAlert, 
  CheckCheck, 
  X, 
  Clock, 
  Sparkles,
  Inbox,
  Filter,
  Check
} from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from '../services/notification.service';
import { useApp } from '../contexts/AppContext';
import { storage } from '../utils/storage';

type TimeGroupKey = 'today' | 'yesterday' | 'this_week' | 'earlier';

export default function NotificationsPage() {
  const { lang, playSynthSound, currentUser } = useApp();
  const isAr = lang === 'ar';

  const { notifications: hookNotifications, loading, refresh, markAsRead } = useNotifications();

  // Seed rich realistic sample notifications for the 4 strict types if storage is empty
  useEffect(() => {
    const existing = storage.load<NotificationItem[]>('lodavia_notifications', []);
    if (!existing || existing.length <= 1) {
      const now = Date.now();
      const initialSeeds: NotificationItem[] = [
        {
          id: 'notif_social_1',
          title: isAr ? 'سارة المهندس تفاعلت مع منشورك الكوني ❤️' : 'Sarah Al-Mohandes liked your cosmic post ❤️',
          body: isAr ? 'أعجبها نموذج تصميمك الفضائي الجديد في مجتمع لودافيا.' : 'She loved your new cosmic design model in the Lodavia space.',
          type: 'social',
          timestamp: new Date(now - 1000 * 60 * 18).toISOString(), // 18m ago
          read: false,
          userId: currentUser?.id
        },
        {
          id: 'notif_points_1',
          title: isAr ? 'مكافأة يومية: +75 نقطة لودافيا 💎' : 'Daily Reward: +75 Lodavia Points 💎',
          body: isAr ? 'تمت إضافة نقاط تفاعل النشاط اليومي إلى محفظتك الكونية بنجاح.' : 'Daily activity engagement bonus has been credited to your cosmic wallet.',
          type: 'points',
          timestamp: new Date(now - 1000 * 60 * 60 * 2.5).toISOString(), // 2.5h ago
          read: false,
          userId: currentUser?.id
        },
        {
          id: 'notif_alert_1',
          title: isAr ? 'تنبيه أمني: تأكيد جلسة دخول جديدة 🛡️' : 'Security Alert: New login session confirmed 🛡️',
          body: isAr ? 'تم تسجيل دخول مشفر عبر متصفح ويب معتمد في نطاقك الآمن.' : 'Encrypted login confirmed from an authorized browser in your trusted perimeter.',
          type: 'alert',
          timestamp: new Date(now - 1000 * 60 * 60 * 25).toISOString(), // Yesterday (25h ago)
          read: true,
          userId: currentUser?.id
        },
        {
          id: 'notif_social_2',
          title: isAr ? 'فيصل الزهراني علّق: "نموذج رائع ومتقن!" 💬' : 'Faisal commented: "Stunning and well-crafted model!" 💬',
          body: isAr ? 'شارك فيصل رأيه حول تحديثات الغرف الصوتية فائقة النقاء.' : 'Faisal shared thoughts on the high-fidelity voice room updates.',
          type: 'social',
          timestamp: new Date(now - 1000 * 60 * 60 * 30).toISOString(), // Yesterday (30h ago)
          read: true,
          userId: currentUser?.id
        },
        {
          id: 'notif_system_1',
          title: isAr ? 'تحديث النظام: ترقية منصة Lodavia 2.5 ⚙️' : 'System Update: Lodavia 2.5 Platform Upgrade ⚙️',
          body: isAr ? 'تم تحسين محرك الصوتيات النقي، وتشفير المكالمات، وإشعارات الفضاء.' : 'Refined pure Web Audio engine, encrypted calls, and cosmic notifications.',
          type: 'system',
          timestamp: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago (This Week)
          read: true,
          userId: currentUser?.id
        },
        {
          id: 'notif_points_2',
          title: isAr ? 'إنجاز كونى: وسام المبدع الفضي 🌟' : 'Cosmic Milestone: Silver Creator Badge 🌟',
          body: isAr ? 'حصلت على 250 نقطة إضافية لترقية مستوى مساهماتك المجتمعية.' : 'Earned 250 bonus points for upgrading your community contribution rank.',
          type: 'points',
          timestamp: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago (This Week)
          read: true,
          userId: currentUser?.id
        }
      ];
      storage.save('lodavia_notifications', initialSeeds);
      storage.save('lumo_notifications', initialSeeds);
      refresh();
    }
  }, [currentUser?.id, isAr, refresh]);

  // Local dismissed IDs to support smooth instant removal upon swipe or delete click
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    return storage.load<string[]>('lodavia_dismissed_notifs', []);
  });

  // Local read IDs override to provide instantaneous zero-lag UI feedback
  const [locallyReadIds, setLocallyReadIds] = useState<Record<string, boolean>>({});

  // Active filter tab (optional quick filtering while preserving chronological groups)
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'system' | 'social' | 'points' | 'alert'>('all');

  // Filtered and un-dismissed notifications list
  const activeNotifications = useMemo(() => {
    return hookNotifications
      .filter(n => !dismissedIds.includes(n.id))
      .map(n => ({
        ...n,
        read: locallyReadIds[n.id] !== undefined ? locallyReadIds[n.id] : n.read
      }))
      .filter(n => {
        if (activeFilter === 'unread') return !n.read;
        if (activeFilter !== 'all') return n.type === activeFilter;
        return true;
      });
  }, [hookNotifications, dismissedIds, locallyReadIds, activeFilter]);

  const unreadCount = useMemo(() => {
    return hookNotifications
      .filter(n => !dismissedIds.includes(n.id))
      .filter(n => (locallyReadIds[n.id] !== undefined ? !locallyReadIds[n.id] : !n.read))
      .length;
  }, [hookNotifications, dismissedIds, locallyReadIds]);

  // Handle Mark All As Read
  const handleMarkAllAsRead = async () => {
    playSynthSound(920, 'sine', 0.12);
    
    // Find unread items
    const unreadItems = hookNotifications.filter(
      n => !dismissedIds.includes(n.id) && !(locallyReadIds[n.id] ?? n.read)
    );

    if (unreadItems.length === 0) return;

    // Instantly update local state
    const updatedMap: Record<string, boolean> = { ...locallyReadIds };
    unreadItems.forEach(item => {
      updatedMap[item.id] = true;
    });
    setLocallyReadIds(updatedMap);

    // Persist markAsRead through service/hook
    await Promise.all(unreadItems.map(item => markAsRead(item.id)));
  };

  // Handle single notification mark as read
  const handleItemClick = async (notif: NotificationItem) => {
    if (!notif.read) {
      playSynthSound(784, 'sine', 0.08);
      setLocallyReadIds(prev => ({ ...prev, [notif.id]: true }));
      await markAsRead(notif.id);
    }
  };

  // Handle dismiss/delete (swipe or button click)
  const handleDismiss = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playSynthSound(220, 'sine', 0.09);
    setDismissedIds(prev => {
      const next = [...prev, id];
      storage.save('lodavia_dismissed_notifs', next);
      return next;
    });
  };

  // Chronological grouping helper
  const groupedNotifications = useMemo(() => {
    const now = new Date();
    const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;

    const groups: Record<TimeGroupKey, NotificationItem[]> = {
      today: [],
      yesterday: [],
      this_week: [],
      earlier: []
    };

    activeNotifications.forEach(notif => {
      const notifDate = new Date(notif.timestamp);
      if (isNaN(notifDate.getTime())) {
        groups.today.push(notif);
        return;
      }
      const itemMid = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate()).getTime();
      const diffDays = Math.round((todayMid - itemMid) / oneDayMs);

      if (diffDays <= 0) {
        groups.today.push(notif);
      } else if (diffDays === 1) {
        groups.yesterday.push(notif);
      } else if (diffDays <= 7) {
        groups.this_week.push(notif);
      } else {
        groups.earlier.push(notif);
      }
    });

    return groups;
  }, [activeNotifications]);

  // Visual configuration for the 4 strict notification types
  const typeConfig: Record<
    NotificationItem['type'],
    {
      labelAr: string;
      labelEn: string;
      icon: React.ElementType;
      iconBg: string;
      iconColor: string;
      badgeBorder: string;
      accentGradient: string;
    }
  > = {
    system: {
      labelAr: 'نظام',
      labelEn: 'System',
      icon: Settings2,
      iconBg: 'bg-slate-100 dark:bg-slate-800/90',
      iconColor: 'text-slate-600 dark:text-slate-300',
      badgeBorder: 'border-slate-200 dark:border-slate-700',
      accentGradient: 'from-slate-500/20 to-transparent'
    },
    social: {
      labelAr: 'اجتماعي',
      labelEn: 'Social',
      icon: Heart,
      iconBg: 'bg-sky-50 dark:bg-cyan-500/10',
      iconColor: 'text-sky-600 dark:text-cyan-400',
      badgeBorder: 'border-sky-200 dark:border-cyan-500/30',
      accentGradient: 'from-cyan-500/20 to-transparent'
    },
    points: {
      labelAr: 'نقاط ومكافآت',
      labelEn: 'Points & Rewards',
      icon: Gem,
      iconBg: 'bg-amber-50 dark:bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
      badgeBorder: 'border-amber-200 dark:border-amber-500/30',
      accentGradient: 'from-amber-500/20 to-transparent'
    },
    alert: {
      labelAr: 'تنبيه أمني',
      labelEn: 'Alert',
      icon: ShieldAlert,
      iconBg: 'bg-rose-50 dark:bg-rose-500/10',
      iconColor: 'text-rose-600 dark:text-rose-400',
      badgeBorder: 'border-rose-200 dark:border-rose-500/30',
      accentGradient: 'from-rose-500/20 to-transparent'
    }
  };

  // Relative time formatter
  const formatTime = (timestampStr: string) => {
    const date = new Date(timestampStr);
    if (isNaN(date.getTime())) return timestampStr;

    const now = Date.now();
    const diffSec = Math.floor((now - date.getTime()) / 1000);

    if (diffSec < 60) return isAr ? 'الآن' : 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return isAr ? `منذ ${diffMin} دقيقة` : `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return isAr ? `منذ ${diffHours} س` : `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return isAr ? 'أمس' : 'Yesterday';
    if (diffDays < 7) return isAr ? `منذ ${diffDays} أيام` : `${diffDays}d ago`;

    return date.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const groupLabels: Record<TimeGroupKey, { ar: string; en: string }> = {
    today: { ar: 'اليوم', en: 'Today' },
    yesterday: { ar: 'أمس', en: 'Yesterday' },
    this_week: { ar: 'هذا الأسبوع', en: 'This Week' },
    earlier: { ar: 'سابقاً', en: 'Earlier' }
  };

  const timeGroupKeys: TimeGroupKey[] = ['today', 'yesterday', 'this_week', 'earlier'];

  return (
    <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 pb-24 transition-colors">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-2xl bg-sky-50 dark:bg-cyan-500/10 border border-sky-100 dark:border-cyan-500/20 text-sky-600 dark:text-cyan-400 shadow-sm">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {isAr ? 'مركز الإشعارات' : 'Notifications Center'}
              </h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-cyan-500/10 dark:bg-cyan-400/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                  {unreadCount} {isAr ? 'جديد' : 'new'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr
                ? 'تحديثات مجتمع لودافيا، مكافآت النقاط، والتنبيهات الكونية'
                : 'Lodavia cosmic updates, point rewards, and alerts'}
            </p>
          </div>
        </div>

        {/* Action: Mark all as read */}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            id="mark-all-read-btn"
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800/90 text-cyan-700 dark:text-cyan-300 border border-slate-200 dark:border-cyan-500/30 hover:border-cyan-500/60 shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-cyan-500" />
            <span>{isAr ? 'تحديد الكل كمقروء' : 'Mark all as read'}</span>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
          }`}
        >
          {isAr ? 'الكل' : 'All'}
        </button>

        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'unread'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
          }`}
        >
          <span>{isAr ? 'غير المقروءة' : 'Unread'}</span>
          {unreadCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-300"></span>
          )}
        </button>

        <button
          onClick={() => setActiveFilter('social')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'social'
              ? 'bg-sky-500 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>{isAr ? 'اجتماعي' : 'Social'}</span>
        </button>

        <button
          onClick={() => setActiveFilter('points')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'points'
              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
          }`}
        >
          <Gem className="w-3.5 h-3.5" />
          <span>{isAr ? 'النقاط' : 'Points'}</span>
        </button>

        <button
          onClick={() => setActiveFilter('alert')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'alert'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{isAr ? 'تنبيهات' : 'Alerts'}</span>
        </button>

        <button
          onClick={() => setActiveFilter('system')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'system'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>{isAr ? 'نظام' : 'System'}</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeNotifications.length === 0 ? (
        /* Requirement 6: Elegant Empty State */
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-10 sm:p-14 text-center flex flex-col items-center justify-center bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/5 backdrop-blur-md shadow-sm mt-4"
        >
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-inner">
              <Inbox className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isAr ? 'فضاء الإشعارات هادئ تماماً 🌌' : 'All Caught Up 🌌'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1.5 leading-relaxed">
            {isAr
              ? 'ليس لديك أي إشعارات جديدة في هذه الفئة. ستظهر هنا أي تفاعلات أو مكافآت نقاط أو تنبيهات نظام فور حدوثها.'
              : 'You have no notifications in this view. Social interactions, point bonuses, and system alerts will appear here seamlessly.'}
          </p>

          {activeFilter !== 'all' && (
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-5 px-4 py-2 rounded-xl text-xs font-bold text-cyan-600 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all cursor-pointer border border-cyan-200 dark:border-cyan-500/30"
            >
              {isAr ? 'عرض كل الإشعارات' : 'Show all notifications'}
            </button>
          )}
        </motion.div>
      ) : (
        /* Requirement 2: Chronological Grouping */
        <div className="space-y-6">
          {timeGroupKeys.map(groupKey => {
            const items = groupedNotifications[groupKey];
            if (items.length === 0) return null;

            return (
              <div key={groupKey} className="space-y-2.5">
                {/* Time Group Header */}
                <div className="flex items-center gap-2 px-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {groupLabels[groupKey][lang === 'ar' ? 'ar' : 'en']}
                  </span>
                  <div className="h-px flex-1 bg-slate-200/70 dark:bg-white/5" />
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    {items.length}
                  </span>
                </div>

                {/* Notifications List with swipe/dismiss capability */}
                <div className="space-y-2.5">
                  <AnimatePresence initial={false}>
                    {items.map(notif => {
                      const cfg = typeConfig[notif.type] || typeConfig.system;
                      const IconComponent = cfg.icon;
                      const isUnread = !notif.read;

                      return (
                        <motion.div
                          key={notif.id}
                          layout
                          initial={{ opacity: 0, scale: 0.98, y: 6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, x: isAr ? 120 : -120, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.2 }}
                          drag="x"
                          dragConstraints={{ left: -100, right: 100 }}
                          dragElastic={0.15}
                          onDragEnd={(_, info) => {
                            if (Math.abs(info.offset.x) > 85 || Math.abs(info.velocity.x) > 400) {
                              handleDismiss(notif.id);
                            }
                          }}
                          onClick={() => handleItemClick(notif)}
                          className={`group relative overflow-hidden rounded-2xl p-4 border transition-all cursor-pointer select-none ${
                            isUnread
                              ? 'bg-white dark:bg-slate-800/95 border-sky-300/60 dark:border-cyan-500/35 shadow-sm hover:border-cyan-400'
                              : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/70 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800/60'
                          }`}
                        >
                          {/* Accent Gradient Border Hint */}
                          <div
                            className={`absolute inset-y-0 ${isAr ? 'right-0' : 'left-0'} w-1 bg-gradient-to-b ${cfg.accentGradient}`}
                          />

                          <div className="flex items-start gap-3.5">
                            {/* Requirement 1: Distinct Icon & Color per notification type */}
                            <div className="relative shrink-0 mt-0.5">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-2xs ${cfg.iconBg} ${cfg.iconColor} ${cfg.badgeBorder}`}
                              >
                                <IconComponent className="w-5 h-5" />
                              </div>

                              {/* Requirement 3: Glowing unread dot indicator */}
                              {isUnread && (
                                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.9)]"></span>
                                </span>
                              )}
                            </div>

                            {/* Content Body */}
                            <div className="flex-1 min-w-0 pr-6">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${cfg.iconBg} ${cfg.iconColor} ${cfg.badgeBorder}`}
                                >
                                  {isAr ? cfg.labelAr : cfg.labelEn}
                                </span>
                                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(notif.timestamp)}
                                </span>
                              </div>

                              <h3
                                className={`text-xs sm:text-sm font-bold leading-snug break-words ${
                                  isUnread
                                    ? 'text-slate-900 dark:text-white'
                                    : 'text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {notif.title}
                              </h3>

                              {notif.body && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                                  {notif.body}
                                </p>
                              )}
                            </div>

                            {/* Requirement 5: Dismiss / Remove Action (visible on hover / touch) */}
                            <button
                              type="button"
                              onClick={(e) => handleDismiss(notif.id, e)}
                              className="opacity-0 group-hover:opacity-100 sm:transition-opacity p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0 self-start"
                              title={isAr ? 'إخفاء الإشعار' : 'Dismiss notification'}
                              aria-label="Dismiss"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
