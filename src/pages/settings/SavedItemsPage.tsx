import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  Bookmark, 
  Trash2,
  Volume2,
  Sparkles,
  Info,
  Check,
  User
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

interface MockSavedRoom {
  id: string;
  type: 'room';
  titleAr: string;
  titleEn: string;
  host: string;
  listeners: number;
}

export default function SavedItemsPage() {
  const { lang, playSynthSound, homePosts, handleSaveHomePost } = useApp();
  const navigate = useNavigate();

  const isRtl = lang === 'ar';

  // Get real saved posts from context
  const savedPostsFromContext = homePosts.filter(p => p.savedByMe);

  // Mock saved rooms for variety
  const [savedRooms, setSavedRooms] = useState<MockSavedRoom[]>([
    {
      id: 'room_saved_1',
      type: 'room',
      titleAr: 'سحر البرمجة بالذكاء الاصطناعي 🧙‍♂️',
      titleEn: 'AI Coding Sorcery 🧙‍♂️',
      host: 'Bader Al-Mutairi',
      listeners: 142
    },
    {
      id: 'room_saved_2',
      type: 'room',
      titleAr: 'نقاش مفتوح: سدم وتلسكوبات الهواة 🌌',
      titleEn: 'Open Space: Nebulas & Telescope Chat 🌌',
      host: 'Lina Drake',
      listeners: 89
    }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUnsavePost = (postId: string) => {
    playSynthSound(500, 'sine', 0.08);
    handleSaveHomePost(postId);
    setToastMessage(isRtl ? 'تمت إزالة المنشور من المحفوظات 🗑️' : 'Post removed from saved archive 🗑️');
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleUnsaveRoom = (roomId: string) => {
    playSynthSound(500, 'sine', 0.08);
    setSavedRooms(prev => prev.filter(r => r.id !== roomId));
    setToastMessage(isRtl ? 'تمت إزالة الغرفة من المحفوظات 🗑️' : 'Voice room removed from saved archive 🗑️');
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const totalItemsCount = savedPostsFromContext.length + savedRooms.length;

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'المحفوظات الكونية 🔖' : 'Stellar Bookmark Vault 🔖'}
        description={isRtl ? 'المنشورات ومجالس الصوت التي قمت بحفظها للرجوع إليها لاحقاً' : 'Your safe haven for stored publications and saved live audio rooms'}
        icon={Bookmark}
        iconColorClass="text-purple-600 dark:text-purple-400"
        iconBgClass="bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/20"
      />

      <div className="relative z-10 flex flex-col gap-6 text-start">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Feedback Alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.25s_ease-out]">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {totalItemsCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Real saved posts */}
            {savedPostsFromContext.map((post) => (
              <div 
                key={post.id}
                className="bg-white dark:bg-[#182232] rounded-2xl p-5 border border-[#E2E8F0] dark:border-white/10 flex flex-col justify-between gap-4 transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20 relative group shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-3.5">
                    <img 
                      src={post.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                      alt={isRtl ? `الصورة الشخصية لـ ${post.authorName}` : `${post.authorName}'s avatar`} 
                      className="w-7 h-7 rounded-full object-cover border border-[#E2E8F0] dark:border-white/10"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#111827] dark:text-white block">{post.authorName}</span>
                      <span className="text-[9px] text-[#64748B] dark:text-slate-500 block font-mono">{post.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#111827] dark:text-slate-200 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] dark:border-white/5 mt-2">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/20 text-sky-700 dark:text-cyan-400 font-extrabold uppercase tracking-wider">
                    {isRtl ? 'منشور كوني' : 'Stellar Post'}
                  </span>

                  <button
                    onClick={() => handleUnsavePost(post.id)}
                    className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs transition-all flex items-center gap-1 cursor-pointer"
                    title={isRtl ? 'إلغاء الحفظ' : 'Unsave Item'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">{isRtl ? 'إلغاء الحفظ' : 'Unsave'}</span>
                  </button>
                </div>
              </div>
            ))}

            {/* 2. Mock saved rooms */}
            {savedRooms.map((room) => (
              <div 
                key={room.id}
                className="bg-white dark:bg-[#182232] rounded-2xl p-5 border border-[#E2E8F0] dark:border-white/10 flex flex-col justify-between gap-4 transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20 relative group shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-emerald-600 dark:text-emerald-400">
                      <Volume2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wider">
                      {isRtl ? 'غرفة صوتية مجدولة' : 'Saved Audio Room'}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-[#111827] dark:text-white line-clamp-2 leading-snug">
                    {isRtl ? room.titleAr : room.titleEn}
                  </h3>

                  <div className="flex items-center gap-1.5 mt-2.5 text-[#475569] dark:text-slate-400 text-[11px]">
                    <User className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-500" />
                    <span>{isRtl ? `المضيف: ${room.host}` : `Host: ${room.host}`}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] dark:border-white/5 mt-2">
                  <span className="text-[10px] text-[#64748B] dark:text-slate-500 font-mono">
                    {room.listeners} {isRtl ? 'مستمع' : 'listeners'}
                  </span>

                  <button
                    onClick={() => handleUnsaveRoom(room.id)}
                    className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs transition-all flex items-center gap-1 cursor-pointer"
                    title={isRtl ? 'إلغاء الحفظ' : 'Unsave Item'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">{isRtl ? 'إلغاء الحفظ' : 'Unsave'}</span>
                  </button>
                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="bg-white dark:bg-[#182232] rounded-2xl p-12 border border-[#E2E8F0] dark:border-white/5 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="p-3 rounded-full bg-slate-100 dark:bg-white/5 text-[#64748B] dark:text-slate-500 mb-4 border border-[#E2E8F0] dark:border-white/10">
              <Bookmark className="w-6 h-6 text-[#475569] dark:text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] dark:text-slate-300">
              {isRtl ? 'المحفوظات فارغة تماماً' : 'Bookmark Vault is Empty'}
            </h3>
            <p className="text-xs text-[#475569] dark:text-slate-500 mt-1 max-w-sm leading-relaxed">
              {isRtl 
                ? 'لم تقم بحفظ أي منشورات أو غرف صوتية كوكبية حتى الآن. اضغط على أيقونة الحفظ بالمنشورات لتظهر هنا.' 
                : 'Bookmark interesting publications or voice lounges around the platform to keep them cached here.'}
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
