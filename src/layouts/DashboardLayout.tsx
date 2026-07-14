import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  Globe, 
  Users, 
  Mic, 
  Plus, 
  Compass, 
  MessageSquare, 
  Search, 
  Sparkles, 
  Languages, 
  Bell, 
  X, 
  Info, 
  CheckCircle2, 
  Check, 
  Phone, 
  Camera, 
  Brain,
  Tv 
} from 'lucide-react';
import AIAssistant from '../components/AIAssistant';
import { firestoreService } from '../firebase/services';

export default function DashboardLayout() {
  const {
    currentUser,
    setCurrentUser,
    communities,
    setCommunities,
    setHomePosts,
    setNewPostText,
    lang,
    setLang,
    theme,
    setTheme,
    playSynthSound,
    showCreateModal,
    setShowCreateModal,
    showStoreModal,
    setShowStoreModal,
    showAdPlayer,
    setShowAdPlayer,
    adCountdown,
    setAdCountdown,
    adRewardClaimable,
    setAdRewardClaimable,
    currentAdCompany,
    setCurrentAdCompany,
    storeMessage,
    setStoreMessage,
    activeCall,
    setActiveCall,
    startWatchingAd,
    claimAdReward,
    handlePurchaseItem,
    handleCreateSubmit,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  // Local state for profile edit modal (since it is profile page related but can live here)
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio);

  // Local states for create modal
  const [selectedCreateType, setSelectedCreateType] = useState<'post' | 'voice' | 'video' | 'stream' | 'course' | 'community'>('post');
  const [postContent, setPostContent] = useState('');
  const [newRoomTitle, setNewRoomTitle] = useState('');

  // Sync edit profile local fields with currentUser
  useEffect(() => {
    setEditName(currentUser.name);
    setEditBio(currentUser.bio);
  }, [currentUser]);

  // Determine active tab based on current URL path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/home' || path === '/') return 'home';
    if (path.startsWith('/communities')) return 'communities';
    if (path.startsWith('/voice-rooms')) return 'voice-rooms';
    if (path.startsWith('/lodavia-world')) return 'lodavia-world';
    if (path.startsWith('/messages')) return 'messages';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/creator-economy')) return 'creator-economy';
    if (path.startsWith('/ai-daily')) return 'ai-daily';
    return '';
  };

  const activeTab = getActiveTab();

  const handleEndCall = () => {
    playSynthSound(150, 'sawtooth', 0.25);
    setActiveCall(null);
  };

  const createOptions = [
    { id: 'post', labelAr: 'منشور جديد 📝', labelEn: 'New Post 📝' },
    { id: 'voice', labelAr: 'صالون صوتي 🎤', labelEn: 'Audio Room 🎤' },
    { id: 'video', labelAr: 'غرفة مرئية 📹', labelEn: 'Video Room 📹' },
    { id: 'stream', labelAr: 'بث مباشر 📡', labelEn: 'Live Stream 📡' },
    { id: 'course', labelAr: 'مادة تعليمية 📚', labelEn: 'Academic Course 📚' },
    { id: 'community', labelAr: 'مجتمع جديد 🌍', labelEn: 'New Space 🌍' }
  ];

  const storeItems = [
    {
      id: 'badge_crown',
      nameAr: 'وسام التاج الملكي 👑',
      nameEn: 'Royal Crown Badge 👑',
      descriptionAr: 'يعرض تاجاً ملكياً بجانب اسمك في غرف الدردشة والتعليقات والملف الشخصي.',
      descriptionEn: 'Displays a golden royal crown next to your name in rooms, chats, and profile.',
      price: 100,
      icon: '👑',
      category: 'badge' as const
    },
    {
      id: 'frame_neon',
      nameAr: 'إطار هالة النيون المشعة ✨',
      nameEn: 'Neon Aura Frame ✨',
      descriptionAr: 'يحيط صورتك الرمزية بإطار متوهج ثلاثي الأبعاد بألوان الطيف الترددي المتغير.',
      descriptionEn: 'Wraps your avatar in a premium colorful spinning neon holographic aura.',
      price: 150,
      icon: '✨',
      category: 'avatar_frame' as const
    },
    {
      id: 'color_gold',
      nameAr: 'تأثير الاسم الذهبي المتألق 🌟',
      nameEn: 'Golden Glow Name 🌟',
      descriptionAr: 'يحوّل لون اسمك إلى تدرج لوني ذهبي متوهج مفعم بالحياة يجذب الأنظار.',
      descriptionEn: 'Converts your display name color into a gorgeous golden gradient animation.',
      price: 200,
      icon: '🌟',
      category: 'name_color' as const
    },
    {
      id: 'feature_vip_rooms',
      nameAr: 'مفتاح الغرف الصوتية الخاصة 🔑',
      nameEn: 'Confidential Rooms Pass 🔑',
      descriptionAr: 'يمنحك الصلاحية لإنشاء والدخول لغرف صوتية مغلقة مشفرة بالكامل.',
      descriptionEn: 'Grants credentials to create & access fully confidential, secure voice rooms.',
      price: 300,
      icon: '🔑',
      category: 'feature' as const
    },
    {
      id: 'title_cosmic',
      nameAr: 'اللقب الملكي "المؤثر الكوني" 🪐',
      nameEn: 'Cosmic Influencer Title 🪐',
      descriptionAr: 'يضيف تسمية فريدة تحت اسمك لتبدو كقائد ريادي ملهم للمجتمع.',
      descriptionEn: 'Adds a prestigious title badge below your name across the platform.',
      price: 250,
      icon: '🪐',
      category: 'feature' as const
    },
    {
      id: 'lodavia_pro',
      nameAr: 'اشتراك لودافيا برو الكوني 👑🚀',
      nameEn: 'Lodavia Pro Subscription 👑🚀',
      descriptionAr: 'تحليل ذكي غير محدود للتعليقات، صياغة ردود جماعية ذكية بلهجات عربية متعددة، ونبرات صوت مخصصة للعلامة التجارية.',
      descriptionEn: 'Unlimited AI comments analysis, batch neural reply-all, custom brand voice tone, and local dialects.',
      price: 500,
      icon: '🚀',
      category: 'feature' as const
    }
  ];

  return (
    <div className="flex-1 flex flex-col justify-between w-full min-h-screen relative z-10 animate-[fadeIn_0.6s_ease-out]">
      
      {/* Header */}
      <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/5 py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          
          {/* User Identity info */}
          <div className="flex items-center gap-3">
            <div 
              className="relative group cursor-pointer"
              onClick={() => {
                playSynthSound(600, 'sine', 0.1);
                navigate('/profile');
              }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full blur-[2px] opacity-75 group-hover:opacity-100 transition" />
              
              {/* Neon Aura Frame support */}
              <div className={`relative p-[2px] rounded-full ${currentUser.purchasedItems.includes('frame_neon') ? 'bg-gradient-to-r from-purple-500 via-pink-400 to-cyan-400 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.85)]' : 'bg-transparent'}`}>
                <img 
                  src={currentUser.avatar} 
                  alt="User Avatar" 
                  className="relative w-9 h-9 rounded-full object-cover border border-white/20" 
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#07070a] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                {/* Golden Glow Name support & Crown Badge support */}
                <span className={`text-xs font-bold flex items-center gap-1 ${
                  currentUser.purchasedItems.includes('color_gold') 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 font-extrabold drop-shadow-[0_1px_4px_rgba(245,158,11,0.4)]' 
                    : 'text-slate-200'
                }`}>
                  {lang === 'ar' ? `مرحباً ${currentUser.name.split(' ')[0]}` : `Hi ${currentUser.name.split(' ')[0]}`}
                  {currentUser.purchasedItems.includes('badge_crown') && <span className="text-[12px] animate-bounce">👑</span>}
                </span>
                <span className="text-[9px] bg-purple-500/15 text-purple-400 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Level 12</span>
              </div>
              
              {/* Cosmic Title support */}
              <span className="text-[10px] text-slate-400 block -mt-0.5 font-semibold">
                {currentUser.purchasedItems.includes('title_cosmic') ? (
                  <span className="text-cyan-400 font-bold">🪐 {lang === 'ar' ? 'المؤثر الكوني' : 'Cosmic Influencer'}</span>
                ) : (
                  lang === 'ar' ? 'العضوية الكونية النشطة' : 'Cosmic Link Active'
                )}
              </span>
            </div>
          </div>

          {/* Central Search bar */}
          <div className="hidden md:flex items-center bg-black/40 border border-white/5 rounded-full px-3.5 py-1.5 w-80 cursor-pointer" onClick={() => navigate('/search')}>
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-xs text-slate-500 px-2 select-none">
              {lang === 'ar' ? 'البحث عن مجتمعات، غرف صوتية...' : 'Search communities, audio rooms...'}
            </span>
          </div>

          {/* Controls right/left */}
          <div className="flex items-center gap-2">
            
            {/* Clickable points status pill to open Lodavia Store */}
            <button 
              onClick={() => {
                playSynthSound(750, 'sine', 0.1);
                setStoreMessage('');
                setShowStoreModal(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/15 border border-yellow-500/30 text-[10px] font-black text-yellow-400 hover:from-amber-500/25 hover:to-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 cursor-pointer animate-pulse shrink-0"
            >
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>{currentUser.points} {lang === 'ar' ? 'نقطة 💎' : 'Pts 💎'}</span>
            </button>

            <button 
              onClick={() => {
                playSynthSound(600, 'sine', 0.08);
                navigate('/creator-economy');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/15 via-cyan-500/15 to-purple-500/10 border border-purple-500/30 text-[10px] font-black text-purple-300 hover:border-purple-400/60 hover:from-purple-500/25 transition-all cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>{lang === 'ar' ? 'فضاء المبدعين 🚀' : 'Creator Hub 🚀'}</span>
            </button>

            <button 
              onClick={() => {
                playSynthSound(600, 'sine', 0.08);
                navigate('/ai-daily');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-cyan-500/10 border border-cyan-500/30 text-[10px] font-black text-cyan-300 hover:border-cyan-400/60 hover:from-cyan-500/25 transition-all cursor-pointer shrink-0"
            >
              <Brain className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{lang === 'ar' ? 'ملخص لودافيا 🌌' : 'Lodavia Daily 🌌'}</span>
            </button>

            <button 
              onClick={() => {
                setLang(lang === 'ar' ? 'en' : 'ar');
                playSynthSound(600, 'sine', 0.05);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 shrink-0"
            >
              <Languages className="w-3 h-3 text-cyan-400" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            <div className="relative cursor-pointer shrink-0" onClick={() => {
              playSynthSound(500, 'sine', 0.08);
              navigate('/notifications');
            }}>
              <div className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 relative">
                <Bell className="w-4 h-4 text-purple-400" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Core Content Body depending on Route */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:py-8 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* Bottom Tabs Navigation bar */}
      <nav className="fixed bottom-0 z-40 w-full glass-panel border-t border-white/5 py-2.5 px-4">
        <div className="max-w-md mx-auto flex justify-between items-center relative">
          
          <button 
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              navigate('/home');
            }}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'home' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-5 h-5" />
            <span className="text-[9px] font-medium">{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
          </button>

          <button 
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              navigate('/communities');
            }}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'communities' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[9px] font-medium">{lang === 'ar' ? 'المجتمعات' : 'Communities'}</span>
          </button>

          <button 
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              navigate('/voice-rooms');
            }}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'voice-rooms' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-5 h-5" />
            <span className="text-[9px] font-medium">{lang === 'ar' ? 'الصوتيات' : 'Voice'}</span>
          </button>

          {/* Central Floating Action Plus button (➕ Tab/Action) */}
          <div className="relative -mt-6">
            <button 
              onClick={() => {
                playSynthSound(600, 'sine', 0.1);
                setShowCreateModal(true);
              }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 border-2 border-[#07070a] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          <button 
            onClick={() => {
              playSynthSound(550, 'sine', 0.05);
              navigate('/lodavia-world');
            }}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'lodavia-world' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[9px] font-medium">{lang === 'ar' ? 'العالم الكوني' : 'World'}</span>
          </button>

          <button 
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              navigate('/messages');
            }}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'messages' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[8px] font-black flex items-center justify-center">2</span>
            </div>
            <span className="text-[9px] font-medium">{lang === 'ar' ? 'الرسائل' : 'Messages'}</span>
          </button>

          <button 
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              navigate('/profile');
            }}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'profile' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <img src={currentUser.avatar} alt="Me" className="w-5 h-5 rounded-full object-cover border border-white/20" />
            <span className="text-[9px] font-medium">{lang === 'ar' ? 'الملف الشخصي' : 'Profile'}</span>
          </button>

        </div>
      </nav>

      {/* ----------------- GLOBAL CREATIVE MODAL (➕) ----------------- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full border border-white/10 shadow-2xl flex flex-col gap-4 animate-[scaleIn_0.25s_ease-out]">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-sm font-extrabold text-white">{lang === 'ar' ? 'ماذا ترغب في إنشائه اليوم؟' : 'What to build/post today?'}</h3>
              <button 
                onClick={() => {
                  playSynthSound(440, 'sine', 0.1);
                  setShowCreateModal(false);
                }}
                className="p-1.5 hover:bg-white/5 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-2">
              {createOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.05);
                    setSelectedCreateType(opt.id as any);
                  }}
                  className={`p-3 rounded-xl border text-[11px] text-start font-bold transition-all ${
                    selectedCreateType === opt.id 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white' 
                      : 'border-white/5 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? opt.labelAr : opt.labelEn}
                </button>
              ))}
            </div>

            {/* Render contextual inputs based on selected choice */}
            <form onSubmit={(e) => {
              handleCreateSubmit(e, selectedCreateType, postContent, newRoomTitle);
              setPostContent('');
              setNewRoomTitle('');
            }} className="flex flex-col gap-4 mt-2">
              
              {selectedCreateType === 'post' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">{lang === 'ar' ? 'محتوى المنشور' : 'Post Content'}</label>
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder={lang === 'ar' ? 'اكتب أفكارك وخبراتك هنا ليراها المجتمع...' : 'Write your experiences here...'}
                    className="glass-input w-full py-2.5 px-3 rounded-xl text-xs h-24 resize-none"
                  />
                </div>
              )}

              {selectedCreateType === 'voice' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">{lang === 'ar' ? 'عنوان الغرفة الصوتية' : 'Voice Room Title'}</label>
                  <input
                    type="text"
                    value={newRoomTitle}
                    onChange={(e) => setNewRoomTitle(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: مناقشة كود ريأكت وتطوير الهوية' : 'Example: Design system debate'}
                    className="glass-input w-full py-2.5 px-3 rounded-xl text-xs"
                  />
                </div>
              )}

              {/* Fallback mock alert if selecting complex creation styles */}
              {(selectedCreateType !== 'post' && selectedCreateType !== 'voice') && (
                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>
                    {lang === 'ar' 
                      ? 'تم تبسيط إنشاء هذا النوع للنسخة التجريبية وسيتم حفظه في خوادم Lodavia مباشرة عند التأكيد.' 
                      : 'This type is mock-saved to Lodavia Cloud database instantly on submission.'}
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-bold text-xs cursor-pointer"
              >
                {lang === 'ar' ? 'تأكيد ونشر الآن 🚀' : 'Confirm & Publish 🚀'}
              </button>

            </form>

          </div>
        </div>
      )}

      {/* ----------------- PROFILE EDIT MODAL ----------------- */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full border border-white/10 shadow-2xl flex flex-col gap-4 animate-[scaleIn_0.25s_ease-out]">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-sm font-extrabold text-white">{lang === 'ar' ? 'تعديل بيانات الملف الشخصي' : 'Edit Profile Settings'}</h3>
              <button 
                onClick={() => {
                  playSynthSound(440, 'sine', 0.1);
                  setShowEditProfile(false);
                }}
                className="p-1.5 hover:bg-white/5 rounded-full text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">{lang === 'ar' ? 'الاسم' : 'Name'}</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="glass-input w-full py-2.5 px-3 rounded-xl text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">{lang === 'ar' ? 'النبذة التعريفية' : 'Bio'}</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="glass-input w-full py-2.5 px-3 rounded-xl text-xs h-20 resize-none"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  playSynthSound(880, 'sine', 0.2);
                  firestoreService.updateProfile(currentUser.id, { name: editName, bio: editBio });
                  setCurrentUser(prev => ({
                    ...prev,
                    name: editName,
                    bio: editBio
                  }));
                  setShowEditProfile(false);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-bold text-xs cursor-pointer"
              >
                {lang === 'ar' ? 'حفظ التعديلات ✨' : 'Save Changes ✨'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ----------------- LODAVIA REWARDS & COSMETIC STORE MODAL ----------------- */}
      {showStoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel rounded-3xl p-6 max-w-lg w-full border border-white/10 shadow-2xl flex flex-col gap-4 animate-[scaleIn_0.25s_ease-out] max-h-[85vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-black text-white">
                    {lang === 'ar' ? 'متجر مكافآت لودافيا 🪐' : 'Lodavia Rewards & Cosmetic Store 🪐'}
                  </h3>
                  <span className="text-[10px] text-slate-400 block -mt-0.5 font-medium">
                    {lang === 'ar' ? 'أكمل المهام أو شاهد الإعلانات واقتنِ أروع الميزات!' : 'Watch ads to earn points & unlock custom cosmetic upgrades!'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => {
                  playSynthSound(440, 'sine', 0.1);
                  setShowStoreModal(false);
                }}
                className="p-1.5 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Points Balance Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20 border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  <Sparkles className="w-6 h-6 animate-spin-slow" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-widest">{lang === 'ar' ? 'الرصيد الحالي' : 'Current Balance'}</span>
                  <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
                    {currentUser.points} {lang === 'ar' ? 'نقطة 💎' : 'Lodavia Pts 💎'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={startWatchingAd}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Tv className="w-4 h-4 shrink-0" />
                <span>{lang === 'ar' ? 'شاهد إعلانًا (+50 نقطة) 📺' : 'Watch Ad (+50 Pts) 📺'}</span>
              </button>
            </div>

            {storeMessage && (
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center gap-2 animate-bounce">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{storeMessage}</span>
              </div>
            )}

            {/* Store items list */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                {lang === 'ar' ? 'قائمة المشتريات المتاحة 💎' : 'Available Cosmetic Enhancements 💎'}
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {storeItems.map((item) => {
                  const isOwned = currentUser.purchasedItems.includes(item.id);
                  return (
                    <div 
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        isOwned 
                          ? 'border-emerald-500/20 bg-emerald-950/5' 
                          : 'border-white/5 bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-xl bg-[#07070a] border border-white/10 text-xl flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-white flex items-center gap-1.5">
                            <span>{lang === 'ar' ? item.nameAr : item.nameEn}</span>
                            {isOwned && (
                              <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                                {lang === 'ar' ? 'ممتلك' : 'Owned'}
                              </span>
                            )}
                          </h5>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                            {lang === 'ar' ? item.descriptionAr : item.descriptionEn}
                          </p>
                        </div>
                      </div>

                      <div className="text-end shrink-0">
                        {!isOwned ? (
                          <button
                            onClick={() => handlePurchaseItem(item)}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 text-[11px] font-black text-white transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                          >
                            <span>{item.price}</span>
                            <span className="text-yellow-400">💎</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{lang === 'ar' ? 'مفعّل' : 'Active'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Purchases History */}
            <div className="pt-2 border-t border-white/5 text-center">
              <span className="text-[10px] text-slate-500 font-bold">
                {lang === 'ar' 
                  ? `مجموع مشترياتك النشطة: ${currentUser.purchasedItems.length} عناصر` 
                  : `Your active cosmetic unlocks: ${currentUser.purchasedItems.length} items`}
              </span>
            </div>

          </div>
        </div>
      )}

      {/* ----------------- FULLSCREEN IMMERSIVE AD ADVERTISEMENT PLAYER ----------------- */}
      {showAdPlayer && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between p-8 bg-slate-950/95 backdrop-blur-md animate-[fadeIn_0.3s_ease-out] text-center">
          
          {/* Ad Top Header Info */}
          <div className="flex justify-between items-center w-full max-w-xl mx-auto mt-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-yellow-400 bg-yellow-500/10 px-2.5 py-1 rounded-full animate-pulse">
                {lang === 'ar' ? 'إعلان كوني ممول' : 'Sponsored Cosmic Ad'}
              </span>
            </div>
            <div className="text-xs font-bold text-slate-400">
              {adCountdown > 0 ? (
                <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  {lang === 'ar' ? `المكافأة تظهر بعد: ${adCountdown} ثوانٍ` : `Reward in: ${adCountdown}s`}
                </span>
              ) : (
                <span className="text-emerald-400 font-black animate-bounce flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'ar' ? 'المكافأة جاهزة للمطالبة!' : 'Reward ready to claim!'}
                </span>
              )}
            </div>
          </div>

          {/* Immersive ad frame */}
          <div className="my-auto max-w-xl mx-auto w-full glass-panel border border-cyan-500/30 rounded-3xl overflow-hidden aspect-video relative bg-black/80 shadow-2xl flex flex-col justify-between p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-slate-950/60 to-cyan-950/20 z-0" />
            
            <div className="absolute inset-x-0 bottom-0 top-1/4 flex items-end justify-center gap-1 px-4 opacity-30 z-0">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  style={{ height: `${Math.sin(i * 0.5 + adCountdown) * 40 + 50}%` }}
                  className="bg-gradient-to-t from-cyan-400 to-purple-500 w-1.5 rounded-t transition-all duration-300"
                />
              ))}
            </div>

            <div className="relative z-10 flex justify-between items-start w-full">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-400 p-[1px]">
                  <div className="w-full h-full bg-[#0a0a0f] rounded-lg flex items-center justify-center">
                    <span className="text-cyan-400 font-bold text-[10px]">L</span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold tracking-widest text-slate-200">LODAVIA SPONSOR</span>
              </div>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
            </div>

            <div className="relative z-10 my-auto text-center flex flex-col items-center justify-center px-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg mb-4">
                <div className="w-full h-full bg-[#0d0d15] rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
              </div>
              
              <h3 className="text-lg font-black text-white tracking-wide line-clamp-1">
                {currentAdCompany}
              </h3>
              <p className="text-xs text-slate-300 mt-2 max-w-sm leading-relaxed">
                {lang === 'ar' 
                  ? 'اكتشف التقنيات الفائقة وعش الابتكار الرقمي في مجتمعاتنا الكونية المتصلة بذكاء.' 
                  : 'Experience modern engineering and infinite scaling inside our unified neural hubs.'}
              </p>
            </div>

            <div className="relative z-10 w-full flex justify-between items-center text-[9px] text-slate-500 font-mono">
              <span>IP: 104.18.23.210</span>
              <span>AES-256 Quantum Shield</span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mb-12 max-w-xl mx-auto w-full flex justify-center gap-4">
            {adCountdown > 0 ? (
              <button 
                disabled
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>{lang === 'ar' ? `يرجى المشاهدة للحصول على 50 نقطة (${adCountdown})` : `Please watch to receive 50 Pts (${adCountdown})`}</span>
              </button>
            ) : (
              <button 
                onClick={claimAdReward}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer animate-bounce"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>{lang === 'ar' ? 'المطالبة بـ 50 نقطة الآن! 🎉' : 'Claim 50 Points Now! 🎉'}</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* ----------------- INTERACTIVE CALL / VIDEO OVERLAY ----------------- */}
      {activeCall && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between items-center p-8 bg-[#040406]/95 backdrop-blur-md animate-[fadeIn_0.3s_ease-out] text-center">
          
          <div className="mt-12 flex flex-col items-center">
            <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full animate-pulse mb-6">
              {activeCall.type === 'voice' 
                ? (lang === 'ar' ? 'مكالمة voice مشفرة' : 'Encrypted Voice Link')
                : (lang === 'ar' ? 'مكالمة فيديو ثلاثية الأبعاد' : '3D Video Link')}
            </span>
 
            <div className="relative mb-6">
              <div className="absolute -inset-8 rounded-full border border-cyan-500/25 animate-ping duration-3000" />
              <div className="absolute -inset-4 rounded-full border border-purple-500/20 animate-ping duration-2000" />
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-purple-900/40 to-cyan-900/40 p-1 border border-cyan-400/30 flex items-center justify-center shadow-2xl">
                <Globe className="w-12 h-12 text-cyan-400 animate-spin" />
              </div>
            </div>

            <h3 className="text-xl font-black text-white">{activeCall.contactName}</h3>
            <span className="text-xs text-slate-400 mt-1.5">
              {activeCall.status === 'ringing' 
                ? (lang === 'ar' ? 'جاري الاتصال عبر شبكة Lodavia...' : 'Syncing via Lodavia node...')
                : (lang === 'ar' ? 'متصل ومؤمن بالكامل 🟢' : 'Securely connected 🟢')}
            </span>
          </div>

          {/* Video stream container */}
          {activeCall.type === 'video' && activeCall.status === 'connected' && (
            <div className="w-full max-w-sm aspect-video rounded-3xl overflow-hidden relative border border-cyan-500/30 bg-black/50 shadow-2xl my-4">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-cyan-900/10 flex items-center justify-center">
                <Camera className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white">My Camera</div>
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-cyan-500 text-slate-950 text-[9px] font-bold">{activeCall.contactName}</div>
            </div>
          )}

          {/* End call button */}
          <div className="mb-12 flex items-center gap-6">
            <button 
              onClick={handleEndCall}
              className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-500 transition-all active:scale-90 cursor-pointer"
            >
              <Phone className="w-6 h-6 rotate-[135deg]" />
            </button>
          </div>

        </div>
      )}

      {/* Floating AI Assistant overlay */}
      <AIAssistant 
        currentUser={currentUser}
        lang={lang}
        activeTab={activeTab}
        communities={communities}
        setCommunities={setCommunities}
        setHomePosts={setHomePosts}
        setNewPostText={setNewPostText}
        setShowCreateModal={setShowCreateModal}
        playSynthSound={playSynthSound}
      />

    </div>
  );
}
