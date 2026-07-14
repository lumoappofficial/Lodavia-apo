import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Bell, Heart, MessageSquare, UserPlus, Flame, Sparkles, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const { lang, playSynthSound } = useApp();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      titleAr: 'سارة المهندس قامت بالإعجاب بمنشورك ❤️',
      titleEn: 'Sarah Al-Mohandes liked your post ❤️',
      timeAr: 'منذ دقيقة',
      timeEn: '1m ago',
      unread: true,
      category: 'social'
    },
    {
      id: 2,
      type: 'comment',
      titleAr: 'علق فيصل الزهراني: "هذا النموذج مذهل جداً!" 💬',
      titleEn: 'Faisal Al-Zahrani commented: "This model is absolutely stunning!" 💬',
      timeAr: 'منذ ١٠ دقائق',
      timeEn: '10m ago',
      unread: true,
      category: 'social'
    },
    {
      id: 3,
      type: 'friend',
      titleAr: 'صالح العمري انضم الآن إلى لودافيا! 🚀',
      titleEn: 'Saleh Omri joined Lodavia universe! 🚀',
      timeAr: 'منذ ساعة',
      timeEn: '1h ago',
      unread: false,
      category: 'system'
    },
    {
      id: 4,
      type: 'event',
      titleAr: 'تبدأ الآن الغرفة الصوتية "كود ومستقبل رست" 🎤',
      titleEn: '"Code & future of Rust" voice room is starting now 🎤',
      timeAr: 'منذ ساعتين',
      timeEn: '2h ago',
      unread: false,
      category: 'live'
    }
  ]);

  const markAllAsRead = () => {
    playSynthSound(900, 'sine', 0.15);
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    playSynthSound(150, 'sawtooth', 0.1);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-lg mx-auto w-full pb-12 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-cyan-400" />
          <h1 className="text-lg font-black text-white">
            {lang === 'ar' ? 'التنبيهات والإشعارات الكونية 🔔' : 'Cosmic Notifications 🔔'}
          </h1>
        </div>
        
        {notifications.some(n => n.unread) && (
          <button 
            onClick={markAllAsRead}
            className="text-[10px] text-cyan-400 hover:underline font-bold cursor-pointer"
          >
            {lang === 'ar' ? 'تحديد الكل كمقروء ✓' : 'Mark all as read ✓'}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="glass-panel rounded-3xl p-8 text-center flex flex-col items-center justify-center border border-white/5">
          <Bell className="w-12 h-12 text-slate-600 mb-3 animate-bounce" />
          <h3 className="text-sm font-bold text-slate-400">
            {lang === 'ar' ? 'فضاء الإشعارات هادئ جداً 🌌' : 'Your notifications orbit is empty 🌌'}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">
            {lang === 'ar' ? 'عندما يتفاعل الآخرون معك أو تبدأ أحداثك المفضلة، ستظهر هنا.' : 'When peers react to your updates, notifications appear instantly.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`glass-panel p-4 rounded-2xl border transition-all flex justify-between items-center gap-4 ${
                notif.unread 
                  ? 'border-cyan-500/25 bg-cyan-500/5' 
                  : 'border-white/5 bg-slate-950/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {notif.type === 'like' && (
                    <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      <Heart className="w-4 h-4 fill-pink-400" />
                    </div>
                  )}
                  {notif.type === 'comment' && (
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  )}
                  {notif.type === 'friend' && (
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <UserPlus className="w-4 h-4" />
                    </div>
                  )}
                  {notif.type === 'event' && (
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Bell className="w-4 h-4 animate-ring" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white leading-relaxed">
                    {lang === 'ar' ? notif.titleAr : notif.titleEn}
                  </h3>
                  <span className="text-[9px] text-slate-500 font-semibold mt-1 block">
                    {lang === 'ar' ? notif.timeAr : notif.timeEn}
                  </span>
                </div>
              </div>

              <button
                onClick={() => deleteNotification(notif.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer shrink-0"
                title={lang === 'ar' ? 'حذف' : 'Delete'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
