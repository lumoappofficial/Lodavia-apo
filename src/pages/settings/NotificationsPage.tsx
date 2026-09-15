import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  Bell, 
  MessageSquare,
  UserPlus,
  Heart,
  Volume2,
  Mail,
  Zap,
  Check
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

export default function NotificationsPage() {
  const { lang, playSynthSound } = useApp();

  const isRtl = lang === 'ar';

  // Toggle States saved or loaded locally
  const [messages, setMessages] = useState(() => {
    return localStorage.getItem('lodavia_notif_messages') !== 'false';
  });
  const [followers, setFollowers] = useState(() => {
    return localStorage.getItem('lodavia_notif_followers') !== 'false';
  });
  const [likesComments, setLikesComments] = useState(() => {
    return localStorage.getItem('lodavia_notif_likes') !== 'false';
  });
  const [voiceRooms, setVoiceRooms] = useState(() => {
    return localStorage.getItem('lodavia_notif_voice') !== 'false';
  });
  const [emails, setEmails] = useState(() => {
    return localStorage.getItem('lodavia_notif_emails') === 'true';
  });
  const [pushNotifs, setPushNotifs] = useState(() => {
    return localStorage.getItem('lodavia_notif_push') !== 'false';
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerSaveFeedback = (msgEn: string, msgAr: string) => {
    playSynthSound(700, 'sine', 0.08);
    setToastMessage(isRtl ? msgAr : msgEn);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('lodavia_notif_messages', messages.toString());
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('lodavia_notif_followers', followers.toString());
  }, [followers]);

  useEffect(() => {
    localStorage.setItem('lodavia_notif_likes', likesComments.toString());
  }, [likesComments]);

  useEffect(() => {
    localStorage.setItem('lodavia_notif_voice', voiceRooms.toString());
  }, [voiceRooms]);

  useEffect(() => {
    localStorage.setItem('lodavia_notif_emails', emails.toString());
  }, [emails]);

  useEffect(() => {
    localStorage.setItem('lodavia_notif_push', pushNotifs.toString());
  }, [pushNotifs]);

  const toggleItems = [
    {
      id: 'messages',
      state: messages,
      setter: setMessages,
      icon: MessageSquare,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      titleAr: 'إشعارات الرسائل المباشرة',
      titleEn: 'Direct Message Notifications',
      descAr: 'تنبيهك فوراً عند استلام رسائل خاصة جديدة في بريدك الكوني.',
      descEn: 'Alert you instantly upon receiving secure private signals.'
    },
    {
      id: 'followers',
      state: followers,
      setter: setFollowers,
      icon: UserPlus,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      titleAr: 'إشعارات المتابعين الجدد',
      titleEn: 'New Follower Alerts',
      descAr: 'إعلامك عندما يبدأ مستكشف كوني جديد في رصد ومتابعة فضاءاتك.',
      descEn: 'Get notified when a new cosmic explorer follows your trajectory.'
    },
    {
      id: 'likesComments',
      state: likesComments,
      setter: setLikesComments,
      icon: Heart,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      titleAr: 'إشعارات التفاعلات (الإعجابات والتعليقات)',
      titleEn: 'Interactions (Likes & Comments)',
      descAr: 'استقبال تنبيه عند تفاعل الأعضاء بالتعليق أو الإعجاب على منشوراتك.',
      descEn: 'Notify you when community members like or reply to your updates.'
    },
    {
      id: 'voiceRooms',
      state: voiceRooms,
      setter: setVoiceRooms,
      icon: Volume2,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      titleAr: 'إشعارات الغرف الصوتية والمجالس',
      titleEn: 'Voice Rooms & Hub Activities',
      descAr: 'تنبيهك عند بدء غرف صوتية بث مباشر في المجتمعات المشترك بها.',
      descEn: 'Receive beacon alerts when live audio channels spark inside your hubs.'
    },
    {
      id: 'emails',
      state: emails,
      setter: setEmails,
      icon: Mail,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      titleAr: 'إشعارات البريد الإلكتروني',
      titleEn: 'Electronic Mail Bulletins',
      descAr: 'استلام ملخصات أسبوعية وتحديثات أمنية كبرى على بريدك الإلكتروني.',
      descEn: 'Deliver weekly digest summaries and core security briefs to your inbox.'
    },
    {
      id: 'push',
      state: pushNotifs,
      setter: setPushNotifs,
      icon: Zap,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      titleAr: 'الإشعارات الفورية (Push Notifications)',
      titleEn: 'Direct Browser Push Beacons',
      descAr: 'تلقي إشعارات على المتصفح أو الهاتف حتى لو كنت خارج منصة Lodavia.',
      descEn: 'Broadcast floating desktop alerts even when you are off-radar.'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'إعدادات الإشعارات الكونية 🔔' : 'Cosmic Notifications 🔔'}
        description={isRtl ? 'إدارة مستوى البث والتنبيهات المستلمة من شبكة Lodavia' : 'Manage your beacon sensitivity and incoming transmissions'}
        icon={Bell}
        iconColorClass="text-purple-600 dark:text-purple-400"
        iconBgClass="bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/20"
      />

      <div className="relative z-10 flex flex-col gap-6 text-start">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Sync feedback */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.25s_ease-out]">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Toggles List */}
        <div className="flex flex-col gap-4">
          {toggleItems.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id} 
                className="bg-white dark:bg-[#182232] rounded-2xl p-5 border border-[#E2E8F0] dark:border-white/10 flex items-start justify-between gap-5 transition-all duration-300 hover:border-slate-300 dark:hover:border-white/15 shadow-sm"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#111827] dark:text-slate-100">
                      {isRtl ? item.titleAr : item.titleEn}
                    </h3>
                    <p className="text-[11px] text-[#475569] dark:text-slate-400 mt-1 leading-relaxed">
                      {isRtl ? item.descAr : item.descEn}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={(e) => {
                      const val = e.target.checked;
                      item.setter(val);
                      triggerSaveFeedback(
                        `${isRtl ? item.titleAr : item.titleEn}: ${val ? 'Enabled' : 'Disabled'}`,
                        `تم ${val ? 'تفعيل' : 'تعطيل'} ${item.titleAr} بنجاح`
                      );
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500" />
                </label>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
