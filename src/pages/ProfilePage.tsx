import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { MapPin, Sparkles, Users, UserCheck, Award, Tv, X, LogOut, Settings, Rocket, ShoppingBag, Trophy, Gift, Flame, Camera, Eye, Upload, Image as ImageIcon, Check, Edit3, Heart, Plus, Send, Share2, MessageSquare, EyeOff, UserPlus, Trash2, MoreVertical } from 'lucide-react';
import { firestoreService, authService } from '../firebase/services';
import { themeStyles } from '../styles/theme';
import SocialLinksCard from '../components/SocialLinksCard';
import MyPostsGrid from '../components/MyPostsGrid';
import ReferralCard from '../components/ReferralCard';
import RetentionHubModal from '../components/retention/RetentionHubModal';
import DailyRewardsModal from '../components/games/DailyRewardsModal';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
];

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80',
];

const POPULAR_HOBBIES = [
  'كرة القدم ⚽',
  'القراءة 📚',
  'التصوير 📸',
  'ألعاب الفيديو 🎮',
  'السفر والرحلات ✈️',
  'السباحة 🏊‍♂️',
  'الرسم والتصميم 🎨',
  'الطبخ والتذوق 🍳',
  'الموسيقى والعزف 🎸',
  'الكتابة والتدوين ✍️',
  'البرمجة والتقنية 💻',
  'الشطرنج ♟️',
  'قيادة السيارات 🚗',
  'رياضة المشي 🚶‍♂️',
  'التأمل واليوغا 🧘‍♀️',
  'كرة السلة 🏀'
];

export default function ProfilePage() {
  const {
    currentUser,
    setCurrentUser,
    lang,
    playSynthSound
  } = useApp();

  const navigate = useNavigate();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showRetentionHub, setShowRetentionHub] = useState(false);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  
  // View As Mode (View profile as seen by others)
  const [isViewAsMode, setIsViewAsMode] = useState(false);
  const [isFollowingPublic, setIsFollowingPublic] = useState(false);

  // Hobbies state
  const [showHobbiesModal, setShowHobbiesModal] = useState(false);
  const [newHobbyInput, setNewHobbyInput] = useState('');
  
  // Image Viewing & Editing states
  const [activeImageViewer, setActiveImageViewer] = useState<'avatar' | 'cover' | null>(null);
  const [showAvatarPickerModal, setShowAvatarPickerModal] = useState(false);
  const [showCoverPickerModal, setShowCoverPickerModal] = useState(false);
  
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [tempAvatar, setTempAvatar] = useState(currentUser?.avatar || AVATAR_PRESETS[0]);
  const [tempCover, setTempCover] = useState(currentUser?.coverImage || COVER_PRESETS[0]);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const userHobbies = currentUser?.hobbies && currentUser.hobbies.length > 0
    ? currentUser.hobbies
    : ['القراءة 📚', 'التصوير الفوتوغرافي 📸', 'ألعاب الفيديو 🎮', 'السفر والترحال ✈️', 'السباحة 🏊‍♂️'];

  const saveHobbies = (updated: string[]) => {
    playSynthSound(880, 'sine', 0.1);
    setCurrentUser(prev => ({ ...prev, hobbies: updated }));
    if (currentUser?.id) {
      firestoreService.updateProfile(currentUser.id, { hobbies: updated });
    }
    const saved = localStorage.getItem('lodavia_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.hobbies = updated;
        localStorage.setItem('lodavia_current_user', JSON.stringify(parsed));
      } catch (e) {}
    }
  };

  const handleAddHobby = (hobbyToAdd: string) => {
    if (!hobbyToAdd.trim()) return;
    const trimmed = hobbyToAdd.trim();
    if (userHobbies.includes(trimmed)) return;
    const updated = [...userHobbies, trimmed];
    saveHobbies(updated);
    setNewHobbyInput('');
  };

  const handleRemoveHobby = (hobbyToRemove: string) => {
    const updated = userHobbies.filter(h => h !== hobbyToRemove);
    saveHobbies(updated);
  };

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditBio(currentUser.bio || '');
      setTempAvatar(currentUser.avatar || AVATAR_PRESETS[0]);
      setTempCover(currentUser.coverImage || COVER_PRESETS[0]);
    }
  }, [currentUser]);

  const saveAvatarChange = (newAvatarUrl: string) => {
    playSynthSound(880, 'sine', 0.1);
    setCurrentUser(prev => ({ ...prev, avatar: newAvatarUrl }));
    firestoreService.updateProfile(currentUser.id, { avatar: newAvatarUrl });
    // Also save in localStorage
    const saved = localStorage.getItem('lodavia_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.avatar = newAvatarUrl;
        localStorage.setItem('lodavia_current_user', JSON.stringify(parsed));
      } catch (e) {}
    }
    setShowAvatarPickerModal(false);
  };

  const saveCoverChange = (newCoverUrl: string) => {
    playSynthSound(880, 'sine', 0.1);
    setCurrentUser(prev => ({ ...prev, coverImage: newCoverUrl }));
    firestoreService.updateProfile(currentUser.id, { coverImage: newCoverUrl });
    const saved = localStorage.getItem('lodavia_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.coverImage = newCoverUrl;
        localStorage.setItem('lodavia_current_user', JSON.stringify(parsed));
      } catch (e) {}
    }
    setShowCoverPickerModal(false);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const url = event.target.result as string;
        setTempAvatar(url);
        saveAvatarChange(url);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const url = event.target.result as string;
        setTempCover(url);
        saveCoverChange(url);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    playSynthSound(150, 'sawtooth', 0.25);
    try {
      await authService.logout();
      localStorage.removeItem('lumo_current_user');
      localStorage.removeItem('lodavia_current_user');
      setCurrentUser({
        id: '', name: '', email: '', phone: '', avatar: '', coverImage: '',
        bio: '', country: '', language: '', interests: [], achievements: [],
        joinedCommunities: [], enrolledCourses: [], followersCount: 0,
        followingCount: 0, points: 0, purchasedItems: []
      });
      navigate('/welcome');
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const startWatchingAd = () => {
    playSynthSound(440, 'triangle', 0.15);
    const adCompaniesAr = [
      'محرك Lodavia الفائق للذكاء الاصطناعي 🤖',
      'غرف Lodavia الصوتية ثلاثية الأبعاد 🎧',
      'سحابة Lodavia للحوسبة الكمومية 🌌',
      'مسارات Lodavia لتعلم ريأكت وتطوير البرمجيات 📚'
    ];
    const adCompaniesEn = [
      'Lodavia Core AI Neural Engine 🤖',
      'Lodavia 3D Spatial Sound Spaces 🎧',
      'Lodavia Quantum Ledger Database 🌌',
      'Lodavia Professional Full Stack Path 📚'
    ];
    const index = Math.floor(Math.random() * adCompaniesAr.length);
    alert(lang === 'ar' ? `جاري تشغيل إعلان: ${adCompaniesAr[index]}` : `Streaming ad sponsor: ${adCompaniesEn[index]}`);
    setTimeout(() => {
      playSynthSound(880, 'sine', 0.1);
      setTimeout(() => playSynthSound(1046.5, 'sine', 0.1), 80);
      setTimeout(() => playSynthSound(1318.51, 'sine', 0.3), 160);
      setCurrentUser(prev => ({ ...prev, points: prev.points + 50 }));
      alert(lang === 'ar' ? 'تمت إضافة +50 نقطة إلى محفظتك بنجاح! 🎉' : '+50 Lodavia Points added successfully! 🎉');
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-5 animate-[fadeIn_0.4s_ease-out] pb-12">

      {/* ---- View As Public Banner (Sticky Top Notice) ---- */}
      {isViewAsMode && (
        <div className="sticky top-0 z-40 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-[slideDown_0.3s_ease-out] border-2 border-white/30 backdrop-blur-md">
          <div className="flex items-center gap-3 text-xs font-bold">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-black block leading-tight">
                {lang === 'ar' ? 'وضع المعاينة العامة (كيف يراه الآخرون 👁️)' : 'Public Preview Mode (View As Others 👁️)'}
              </span>
              <span className="text-[10px] text-white/90 font-normal block mt-0.5">
                {lang === 'ar'
                  ? 'أنت تشاهد بروفايلك الآن تماماً كما يظهر لعامة الزوار والأصدقاء في لودافيا.'
                  : 'Viewing your profile exactly as it appears to other members and public visitors.'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              playSynthSound(400, 'sine', 0.1);
              setIsViewAsMode(false);
            }}
            className="px-4 py-2 rounded-xl bg-white text-[#1A1F2C] hover:bg-white/90 text-xs font-black transition-all active:scale-95 cursor-pointer shadow-lg shrink-0 flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'خروج من المعاينة' : 'Exit View As'}</span>
          </button>
        </div>
      )}

      {/* ---- Hidden File Inputs ---- */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarFileUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={coverInputRef}
        onChange={handleCoverFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* ---- Profile Header Card ---- */}
      <div className={`overflow-hidden ${themeStyles.glassCard}`}>
        {/* Cover Photo Container */}
        <div 
          onClick={() => {
            playSynthSound(600, 'sine', 0.1);
            setActiveImageViewer('cover');
          }}
          className="relative h-44 w-full group cursor-pointer overflow-hidden"
        >
          <img 
            src={currentUser.coverImage || COVER_PRESETS[0]} 
            alt={lang === 'ar' ? 'صورة الغلاف' : 'Cover Image'} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 group-hover:bg-black/40 transition-colors" />
          
          {/* Cover Action Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {!isViewAsMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSynthSound(600, 'sine', 0.1);
                  setShowCoverPickerModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer shadow-lg"
              >
                <Camera className="w-3.5 h-3.5 text-[#48B8FF]" />
                <span>{lang === 'ar' ? 'تغيير الغلاف' : 'Change Cover'}</span>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSynthSound(600, 'sine', 0.1);
                setActiveImageViewer('cover');
              }}
              className="p-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer shadow-lg"
              title={lang === 'ar' ? 'عرض الغلاف مكبراً' : 'View Cover'}
            >
              <Eye className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              id="btn-profile-cover-settings-dots"
              onClick={(e) => {
                e.stopPropagation();
                playSynthSound(600, 'sine', 0.1);
                navigate('/settings');
              }}
              className="p-1.5 px-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer shadow-lg hover:border-sky-400"
              title={lang === 'ar' ? 'الإعدادات العامة (•••)' : 'Settings (•••)'}
            >
              <MoreVertical className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'الإعدادات' : 'Settings'}</span>
            </button>
          </div>

          {/* Quick Settings Three-Dots in Top Left Corner */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <button
              id="btn-profile-corner-dots"
              onClick={(e) => {
                e.stopPropagation();
                playSynthSound(600, 'sine', 0.1);
                navigate('/settings');
              }}
              className="p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg hover:border-sky-400"
              title={lang === 'ar' ? 'الإعدادات العامة (•••)' : 'Settings (•••)'}
              aria-label="Settings"
            >
              <MoreVertical className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-16 gap-4">
            <div className="flex items-end gap-4">
              
              {/* Profile Avatar Container */}
              <div 
                onClick={() => {
                  playSynthSound(600, 'sine', 0.1);
                  setActiveImageViewer('avatar');
                }}
                className="relative group cursor-pointer shrink-0"
              >
                <img
                  src={currentUser.avatar}
                  alt={lang === 'ar' ? 'صورة الملف الشخصي' : 'Profile Picture'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-[#182232] shadow-xl bg-white dark:bg-[#182232] group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Avatar Hover Camera Badge */}
                {!isViewAsMode && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Camera className="w-6 h-6 text-[#48B8FF] drop-shadow-md" />
                      <span className="text-[9px] font-black mt-0.5">{lang === 'ar' ? 'عرض/تعديل' : 'View/Edit'}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSynthSound(600, 'sine', 0.1);
                        setShowAvatarPickerModal(true);
                      }}
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-[#48B8FF] hover:bg-[#38A8EF] text-white shadow-lg border-2 border-white dark:border-[#182232] transition-transform active:scale-95 cursor-pointer"
                      title={lang === 'ar' ? 'تعديل الصورة الشخصية' : 'Edit Avatar'}
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>

              <div className="mb-2">
                <h2 className="text-xl font-black text-[#1A1F2C] dark:text-[#F8FAFC] flex items-center gap-2">
                  <span>{currentUser?.name || ''}</span>
                  {isViewAsMode && (
                    <span className="text-[9px] bg-sky-500/10 text-sky-600 dark:text-cyan-400 border border-sky-500/30 px-2 py-0.5 rounded-full font-bold">
                      {lang === 'ar' ? 'منظور الزائر 👁️' : 'Public View 👁️'}
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2 text-[#6E7685] dark:text-[#94A3B8] text-xs mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#48B8FF]" />
                  <span>{currentUser?.country || ''}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0 flex-wrap w-full md:w-auto">
              {!isViewAsMode ? (
                <>
                  <button
                    onClick={() => {
                      playSynthSound(700, 'sine', 0.1);
                      setIsViewAsMode(true);
                    }}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-600 dark:text-cyan-400 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    title={lang === 'ar' ? 'شاهد كيف يظهر بروفايلك للآخرين' : 'View profile as seen by others'}
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-500" />
                    <span>{lang === 'ar' ? 'كيف يراه الآخرون' : 'View As Public'}</span>
                  </button>

                  <button
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.1);
                      setEditName(currentUser.name);
                      setEditBio(currentUser.bio);
                      setShowEditProfile(true);
                    }}
                    className={`flex-1 md:flex-initial px-4 py-2 ${themeStyles.buttonSecondary}`}
                  >
                    {lang === 'ar' ? 'تعديل البروفايل' : 'Edit Profile'}
                  </button>

                  <button
                    onClick={() => { playSynthSound(600, 'sine', 0.1); navigate('/settings'); }}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447] hover:bg-[#E6EAF0]/50 dark:hover:bg-[#202B3D] text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#48B8FF]" />
                    <span>{lang === 'ar' ? 'الإعدادات' : 'Settings'}</span>
                  </button>

                  <button
                    onClick={() => { playSynthSound(300, 'sawtooth', 0.1); setShowLogoutConfirm(true); }}
                    className="p-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-bold text-red-600 dark:text-red-400 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                    title={lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      playSynthSound(880, 'sine', 0.1);
                      setIsFollowingPublic(!isFollowingPublic);
                    }}
                    className={`flex-1 md:flex-initial px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md ${
                      isFollowingPublic
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-[#48B8FF] text-white hover:bg-[#38A8EF]'
                    }`}
                  >
                    {isFollowingPublic ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                    <span>{isFollowingPublic ? (lang === 'ar' ? 'مُتابَع ✓' : 'Following ✓') : (lang === 'ar' ? 'متابعة 👤+' : 'Follow 👤+')}</span>
                  </button>

                  <button
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.1);
                      navigate('/messages');
                    }}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447] hover:bg-[#E6EAF0] dark:hover:bg-[#202B3D] text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-[#48B8FF]" />
                    <span>{lang === 'ar' ? 'مراسلة' : 'Message'}</span>
                  </button>

                  <button
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.1);
                      if (navigator.share) {
                        navigator.share({ title: currentUser.name, url: window.location.href }).catch(() => {});
                      } else {
                        alert(lang === 'ar' ? 'تم نسخ رابط البروفايل!' : 'Profile link copied!');
                      }
                    }}
                    className="p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447] text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] transition-all cursor-pointer"
                    title={lang === 'ar' ? 'مشاركة البروفايل' : 'Share Profile'}
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#48B8FF]" />
                  </button>

                  <button
                    onClick={() => {
                      playSynthSound(400, 'sine', 0.1);
                      setIsViewAsMode(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-500 text-white font-bold text-xs hover:bg-purple-600 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'خروج من المعاينة' : 'Exit View As'}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-extrabold text-[#1A1F2C] dark:text-[#F8FAFC] uppercase tracking-wider">{lang === 'ar' ? 'النبذة التعريفية' : 'Biography'}</h3>
            <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] leading-relaxed mt-1.5 whitespace-pre-line max-w-2xl">{currentUser.bio}</p>
          </div>

          <div className="flex gap-6 mt-6 pt-4 border-t border-[#E6EAF0] dark:border-[#2A3447] text-xs text-[#6E7685] dark:text-[#94A3B8] font-bold">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#48B8FF]" />
              <strong className="text-[#1A1F2C] dark:text-[#F8FAFC]">{currentUser.followersCount}</strong> {lang === 'ar' ? 'متابع' : 'Followers'}
            </span>
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#00B8D9]" />
              <strong className="text-[#1A1F2C] dark:text-[#F8FAFC]">{currentUser.followingCount}</strong> {lang === 'ar' ? 'يتابع' : 'Following'}
            </span>
          </div>
        </div>
      </div>

      {/* ---- Private Management Cards (Only shown to profile owner) ---- */}
      {!isViewAsMode && (
        <>
          {/* ---- Daily Rewards & Mastery Hub Action Cards ---- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => { playSynthSound(500, 'sine', 0.1); setShowDailyRewards(true); }}
              className={`p-5 text-start ${themeStyles.glassCard} ${themeStyles.glassCardHover} flex items-center justify-between gap-4`}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#48B8FF]/15 border border-[#48B8FF]/30 text-[#48B8FF] rounded-2xl">
                  <Gift className="w-6 h-6 text-[#48B8FF]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#1A1F2C] dark:text-[#F8FAFC]">
                    {lang === 'ar' ? 'المكافآت والمهام اليومية 🎁' : 'Daily Rewards & Streaks 🎁'}
                  </h3>
                  <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] font-medium mt-0.5">
                    {lang === 'ar' ? 'سجل دخولك يومياً واكسب النقاط والخبرة' : 'Claim daily streak rewards & earn points'}
                  </p>
                </div>
              </div>
              <Flame className="w-5 h-5 text-amber-500 shrink-0" />
            </button>

            <button
              onClick={() => { playSynthSound(500, 'sine', 0.1); setShowRetentionHub(true); }}
              className={`p-5 text-start ${themeStyles.glassCard} ${themeStyles.glassCardHover} flex items-center justify-between gap-4`}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-[#48B8FF] to-[#00B8D9] text-white rounded-2xl">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#1A1F2C] dark:text-[#F8FAFC]">
                    {lang === 'ar' ? 'مركز التقدم والإنجازات 🏆' : 'Progress & Mastery Hub 🏆'}
                  </h3>
                  <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] font-medium mt-0.5">
                    {lang === 'ar' ? 'تذكرة الموسم، المهام الأسبوعية والصدارة' : 'Season pass, weekly missions & leaderboard'}
                  </p>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-[#48B8FF] shrink-0" />
            </button>
          </div>
        </>
      )}

      {/* ---- Hobbies & Passions Section (Public & Owner) ---- */}
      <div className={`p-5 ${themeStyles.glassCard}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Heart className="w-5 h-5 fill-rose-500/20" />
            </div>
            <div>
              <h3 className="text-xs font-black text-[#1A1F2C] dark:text-[#F8FAFC] uppercase tracking-wider">
                {lang === 'ar' ? 'الهوايات والشغف 🎨' : 'Hobbies & Passions 🎨'}
              </h3>
              <p className="text-[10px] text-[#6E7685] dark:text-[#94A3B8] mt-0.5">
                {lang === 'ar' ? 'الأنشطة والاهتمامات الشخصية التي تحب ممارستها' : 'Personal hobbies and activities defining your lifestyle'}
              </p>
            </div>
          </div>

          {!isViewAsMode && (
            <button
              onClick={() => {
                playSynthSound(600, 'sine', 0.1);
                setShowHobbiesModal(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#48B8FF]/10 hover:bg-[#48B8FF]/20 border border-[#48B8FF]/30 text-[#48B8FF] text-xs font-extrabold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إدارة الهوايات' : 'Edit Hobbies'}</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {userHobbies.map((hobby, index) => (
            <span
              key={index}
              className="px-3.5 py-2 rounded-2xl bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447] text-[#1A1F2C] dark:text-[#F8FAFC] text-xs font-black flex items-center gap-1.5 shadow-2xs hover:border-[#48B8FF]/50 transition-all hover:scale-102 cursor-default"
            >
              <span>{hobby}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ---- My Posts — Instagram-style grid (Public & Owner) ---- */}
      <MyPostsGrid currentUser={currentUser} lang={lang} navigate={navigate} />

      {/* ---- Private Owner Features (Hidden in Public View Mode) ---- */}
      {!isViewAsMode && (
        <>
          {/* ---- Lodavia Journey — the living planet ---- */}
          <button
            onClick={() => { playSynthSound(600, 'sine', 0.1); navigate('/journey'); }}
            className={`p-5 text-start ${themeStyles.glassCard} ${themeStyles.glassCardHover}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3.5 rounded-2xl bg-[#48B8FF]/15 text-[#48B8FF] border border-[#48B8FF]/30 text-xl">🪐</div>
                <div>
                  <h3 className="text-xs font-black text-[#1A1F2C] dark:text-[#F8FAFC] uppercase tracking-wider">
                    {lang === 'ar' ? 'رحلة لودافيا — كوكبك الحي' : 'Lodavia Journey — Your Living Planet'}
                  </h3>
                  <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1 max-w-md">
                    {lang === 'ar' ? 'حسابك ليس صفحة — إنه عالم ينمو مع نشاطك. شوف كوكبك الآن.' : 'Your account isn\'t a page — it\'s a growing world. See your planet now.'}
                  </p>
                </div>
              </div>
              <Rocket className="w-5 h-5 text-[#48B8FF] shrink-0" />
            </div>
          </button>

          {/* ---- Creator Hub ---- */}
          <button
            onClick={() => { playSynthSound(523.25, 'triangle', 0.15); navigate('/creator-economy'); }}
            className={`p-5 text-start ${themeStyles.glassCard} ${themeStyles.glassCardHover}`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3.5 rounded-2xl bg-[#00B8D9]/15 text-[#00B8D9] border border-[#00B8D9]/30">
                  <Sparkles className="w-6 h-6 text-[#00B8D9]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#1A1F2C] dark:text-[#F8FAFC] uppercase tracking-wider">
                    {lang === 'ar' ? 'بوابة ريادة الأعمال وصناع المحتوى 🚀' : 'Creator & Economy Hub 🚀'}
                  </h3>
                  <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1 max-w-md">
                    {lang === 'ar' ? 'فعل بعدك الإبداعي وابدأ بتحقيق عوائد مالية حقيقية عبر الغرف الصوتية والقنوات المدفوعة.' : 'Activate your creative side and start earning from exclusive rooms and paid channels.'}
                  </p>
                </div>
              </div>
              <span className={`px-5 py-3 shrink-0 ${themeStyles.buttonPrimary}`}>
                {lang === 'ar' ? 'دخول ✨' : 'Enter ✨'}
              </span>
            </div>
          </button>

          {/* ---- Achievements ---- */}
          <div className={`p-5 ${themeStyles.glassCard}`}>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-[#D9B66F]" />
              <h3 className="text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] uppercase tracking-wider">{lang === 'ar' ? 'شارات الإنجاز والتفاعل 🏆' : 'Achievements & Badges 🏆'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(currentUser?.achievements || []).map((ach) => (
                <div key={ach.id} className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447] flex gap-3 items-center">
                  <span className="text-3xl">{ach.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC]">{ach.title}</h4>
                    <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-0.5 leading-snug">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SocialLinksCard currentUser={currentUser} setCurrentUser={setCurrentUser} lang={lang} playSynthSound={playSynthSound} navigate={navigate} />

          {/* ---- Invite a friend & earn points ---- */}
          <ReferralCard currentUser={currentUser} lang={lang} playSynthSound={playSynthSound} navigate={navigate} />

          {/* ---- Points wallet ---- */}
          <div className={`p-5 ${themeStyles.glassCard}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3.5 rounded-2xl bg-[#D9B66F]/15 text-[#D9B66F] border border-[#D9B66F]/30">
                  <Sparkles className="w-6 h-6 text-[#D9B66F]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#1A1F2C] dark:text-[#F8FAFC] uppercase tracking-wider">
                    {lang === 'ar' ? 'محفظة نقاط لودافيا 💎' : 'Lodavia Points Wallet 💎'}
                  </h3>
                  <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1 max-w-sm">
                    {lang === 'ar' ? 'اجمع النقاط واستبدلها بأوسمة وإطارات وألقاب مميزة من المتجر.' : 'Collect points and trade them for badges, frames, and exclusive titles at the store.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
                <div className="px-4 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447] text-center">
                  <span className="text-[10px] text-[#6E7685] dark:text-[#94A3B8] block uppercase font-bold">{lang === 'ar' ? 'رصيدك الحالي' : 'Balance'}</span>
                  <strong className="text-sm font-black text-[#D9B66F]">{currentUser.points} 💎</strong>
                </div>

                <button
                  onClick={() => { playSynthSound(750, 'sine', 0.1); navigate('/store'); }}
                  className={`px-5 py-3 flex items-center justify-center gap-1.5 ${themeStyles.buttonPrimary}`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'فتح المتجر' : 'Open Store'}</span>
                </button>

                <button
                  onClick={startWatchingAd}
                  className={`px-5 py-3 flex items-center justify-center gap-1.5 ${themeStyles.buttonPrimaryWarm}`}
                >
                  <Tv className="w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'ar' ? 'شاهد إعلانًا (+50)' : 'Watch Ad (+50)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ---- Interests & account info ---- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`p-5 ${themeStyles.glassCard}`}>
              <h3 className="text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] uppercase tracking-wider mb-4">{lang === 'ar' ? 'الاهتمامات الرئيسية 🏷️' : 'Core Interests 🏷️'}</h3>
              <div className="flex flex-wrap gap-2">
                {(currentUser?.interests || []).map((interest) => (
                  <span key={interest} className="px-3.5 py-1.5 rounded-full bg-[#48B8FF]/10 border border-[#48B8FF]/25 text-[#48B8FF] text-xs font-bold">
                    #{interest}
                  </span>
                ))}
              </div>
            </div>

            <div className={`p-5 flex flex-col gap-3 justify-center ${themeStyles.glassCard}`}>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6E7685] dark:text-[#94A3B8]">{lang === 'ar' ? 'اللغة الافتراضية:' : 'Default Language:'}</span>
                <span className="text-[#1A1F2C] dark:text-[#F8FAFC] font-bold">{currentUser.language}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6E7685] dark:text-[#94A3B8]">{lang === 'ar' ? 'رقم الاتصال المرتبط:' : 'Linked Phone:'}</span>
                <span className="text-[#1A1F2C] dark:text-[#F8FAFC] font-bold">{currentUser.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6E7685] dark:text-[#94A3B8]">{lang === 'ar' ? 'طريقة الربط:' : 'Sync Protocol:'}</span>
                <span className="text-emerald-500 font-bold">TLS-Quantum Direct</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ---- Image Viewer Modal (Enlarged View) ---- */}
      {activeImageViewer && (
        <div 
          onClick={() => setActiveImageViewer(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out] cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-xl w-full bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-3xl overflow-hidden shadow-2xl p-6 text-center cursor-default animate-[scaleIn_0.25s_ease-out]"
          >
            <button
              onClick={() => setActiveImageViewer(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-black text-[#1A1F2C] dark:text-[#F8FAFC] mb-4 uppercase tracking-wider">
              {activeImageViewer === 'avatar' 
                ? (lang === 'ar' ? 'صورة الملف الشخصي 👤' : 'Profile Picture 👤')
                : (lang === 'ar' ? 'صورة الغلاف 🖼️' : 'Cover Image 🖼️')}
            </h3>

            {/* Enlarged Image Preview */}
            <div className="relative w-full flex items-center justify-center my-2 overflow-hidden rounded-2xl bg-black/5 dark:bg-black/40 border border-[#E6EAF0] dark:border-[#2A3447] p-2">
              <img
                src={activeImageViewer === 'avatar' ? currentUser.avatar : (currentUser.coverImage || COVER_PRESETS[0])}
                alt="Enlarged view"
                className={`max-h-[60vh] w-auto object-contain shadow-2xl transition-transform ${activeImageViewer === 'avatar' ? 'rounded-full border-4 border-[#48B8FF]' : 'rounded-xl'}`}
              />
            </div>

            {/* Action Bar */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  setActiveImageViewer(null);
                  if (activeImageViewer === 'avatar') {
                    setShowAvatarPickerModal(true);
                  } else {
                    setShowCoverPickerModal(true);
                  }
                }}
                className={`flex-1 py-3 ${themeStyles.buttonPrimary}`}
              >
                <Camera className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تعديل / تغيير الصورة' : 'Change Photo'}</span>
              </button>
              
              <button
                onClick={() => setActiveImageViewer(null)}
                className={`px-5 py-3 ${themeStyles.buttonSecondary}`}
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Avatar Picker / Uploader Modal ---- */}
      {showAvatarPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md p-6 relative bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-3xl shadow-2xl animate-[scaleIn_0.25s_ease-out] text-start">
            <button
              onClick={() => setShowAvatarPickerModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] rounded-full text-[#6E7685] dark:text-[#94A3B8] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black text-[#1A1F2C] dark:text-[#F8FAFC] mb-1">
              {lang === 'ar' ? 'تغيير الصورة الشخصية 📸' : 'Change Profile Picture 📸'}
            </h3>
            <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mb-5">
              {lang === 'ar' ? 'اختر صورة من جهازك، اختر رمزًا جاهزًا، أو أدخل رابط صورة.' : 'Upload from your device, choose a ready avatar, or enter a URL.'}
            </p>

            {/* Option 1: File Upload */}
            <div className="mb-5">
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#48B8FF]/10 hover:bg-[#48B8FF]/20 border border-[#48B8FF]/30 text-[#48B8FF] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{lang === 'ar' ? 'رفع صورة من الجهاز 📁' : 'Upload Image from Device 📁'}</span>
              </button>
            </div>

            {/* Option 2: Preset Avatars */}
            <div className="mb-5">
              <label className="text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] block mb-2">
                {lang === 'ar' ? 'اختر من الأيقونات الجاهزة:' : 'Choose from presets:'}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => saveAvatarChange(preset)}
                    className={`relative rounded-2xl overflow-hidden border-2 aspect-square cursor-pointer transition-all hover:scale-105 ${
                      currentUser.avatar === preset ? 'border-[#48B8FF] ring-2 ring-[#48B8FF]/30' : 'border-[#E6EAF0] dark:border-[#2A3447]'
                    }`}
                  >
                    <img src={preset} alt={`Avatar preset ${idx}`} className="w-full h-full object-cover" />
                    {currentUser.avatar === preset && (
                      <div className="absolute inset-0 bg-[#48B8FF]/30 flex items-center justify-center text-white">
                        <Check className="w-5 h-5 drop-shadow-md" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Option 3: URL Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#6E7685] dark:text-[#94A3B8]">
                {lang === 'ar' ? 'أو أدخل رابط الصورة (URL):' : 'Or paste image URL:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={tempAvatar}
                  onChange={(e) => setTempAvatar(e.target.value)}
                  className={`flex-1 px-3 py-2 text-xs ${themeStyles.glassInput}`}
                />
                <button
                  onClick={() => {
                    if (tempAvatar.trim()) saveAvatarChange(tempAvatar.trim());
                  }}
                  className={`px-4 py-2 text-xs ${themeStyles.buttonPrimary}`}
                >
                  {lang === 'ar' ? 'تطبيق' : 'Apply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Cover Picker / Uploader Modal ---- */}
      {showCoverPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md p-6 relative bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-3xl shadow-2xl animate-[scaleIn_0.25s_ease-out] text-start">
            <button
              onClick={() => setShowCoverPickerModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] rounded-full text-[#6E7685] dark:text-[#94A3B8] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black text-[#1A1F2C] dark:text-[#F8FAFC] mb-1">
              {lang === 'ar' ? 'تغيير صورة الغلاف 🖼️' : 'Change Cover Photo 🖼️'}
            </h3>
            <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mb-5">
              {lang === 'ar' ? 'اختر غلافًا يناسب ذوقك أو ارفع صورة خاصة من جهازك.' : 'Select a cosmic cover preset or upload a custom image.'}
            </p>

            {/* Option 1: File Upload */}
            <div className="mb-5">
              <button
                onClick={() => coverInputRef.current?.click()}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#48B8FF]/10 hover:bg-[#48B8FF]/20 border border-[#48B8FF]/30 text-[#48B8FF] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{lang === 'ar' ? 'رفع غلاف من الجهاز 📁' : 'Upload Cover from Device 📁'}</span>
              </button>
            </div>

            {/* Option 2: Cover Presets */}
            <div className="mb-5">
              <label className="text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] block mb-2">
                {lang === 'ar' ? 'أغلفة كونية مسبقة الإعداد:' : 'Cosmic Cover Presets:'}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {COVER_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => saveCoverChange(preset)}
                    className={`relative rounded-xl overflow-hidden h-20 border-2 cursor-pointer transition-all hover:scale-102 ${
                      currentUser.coverImage === preset ? 'border-[#48B8FF] ring-2 ring-[#48B8FF]/30' : 'border-[#E6EAF0] dark:border-[#2A3447]'
                    }`}
                  >
                    <img src={preset} alt={`Cover preset ${idx}`} className="w-full h-full object-cover" />
                    {currentUser.coverImage === preset && (
                      <div className="absolute inset-0 bg-[#48B8FF]/30 flex items-center justify-center text-white">
                        <Check className="w-5 h-5 drop-shadow-md" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Option 3: URL Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#6E7685] dark:text-[#94A3B8]">
                {lang === 'ar' ? 'رابط الصورة (URL):' : 'Cover Image URL:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={tempCover}
                  onChange={(e) => setTempCover(e.target.value)}
                  className={`flex-1 px-3 py-2 text-xs ${themeStyles.glassInput}`}
                />
                <button
                  onClick={() => {
                    if (tempCover.trim()) saveCoverChange(tempCover.trim());
                  }}
                  className={`px-4 py-2 text-xs ${themeStyles.buttonPrimary}`}
                >
                  {lang === 'ar' ? 'تطبيق' : 'Apply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Edit Profile Modal ---- */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className={`w-full max-w-md p-6 relative bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-3xl shadow-2xl`}>
            <button
              onClick={() => { playSynthSound(300, 'sine', 0.05); setShowEditProfile(false); }}
              className="absolute top-4 right-4 p-1.5 hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] rounded-full text-[#6E7685] dark:text-[#94A3B8] hover:text-[#1A1F2C] dark:hover:text-[#F8FAFC] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black text-[#1A1F2C] dark:text-[#F8FAFC] mb-4 tracking-wide uppercase">
              {lang === 'ar' ? 'تعديل الملف الشخصي ⚙️' : 'Edit Profile ⚙️'}
            </h3>

            {/* Quick Avatar/Cover Change Row inside Edit Profile Modal */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447] mb-4">
              <img src={currentUser.avatar} alt="Avatar preview" className="w-12 h-12 rounded-full object-cover border-2 border-[#48B8FF]" />
              <div className="flex-1 text-start">
                <span className="text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] block">{lang === 'ar' ? 'الصور الشخصية' : 'Profile Photos'}</span>
                <span className="text-[10px] text-[#6E7685] dark:text-[#94A3B8]">{lang === 'ar' ? 'تخصيص الرمز والغلاف' : 'Customize avatar & cover'}</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProfile(false);
                    setShowAvatarPickerModal(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-[#48B8FF]/15 text-[#48B8FF] text-[11px] font-bold hover:bg-[#48B8FF]/25 transition-all cursor-pointer"
                >
                  {lang === 'ar' ? 'الرمز' : 'Avatar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProfile(false);
                    setShowCoverPickerModal(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-purple-500/15 text-purple-500 text-[11px] font-bold hover:bg-purple-500/25 transition-all cursor-pointer"
                >
                  {lang === 'ar' ? 'الغلاف' : 'Cover'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProfile(false);
                    setShowHobbiesModal(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-500/15 text-rose-500 text-[11px] font-bold hover:bg-rose-500/25 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Heart className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'الهوايات' : 'Hobbies'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs text-[#1A1F2C] dark:text-[#F8FAFC] text-start">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#6E7685] dark:text-[#94A3B8]">{lang === 'ar' ? 'الاسم' : 'Name'}</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`px-3 py-2 text-xs ${themeStyles.glassInput}`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#6E7685] dark:text-[#94A3B8]">{lang === 'ar' ? 'النبذة التعريفية' : 'Biography'}</label>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className={`px-3 py-2 text-xs resize-none ${themeStyles.glassInput}`}
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => { playSynthSound(300, 'sine', 0.05); setShowEditProfile(false); }}
                  className={`flex-1 py-2.5 ${themeStyles.buttonSecondary}`}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSynthSound(880, 'sine', 0.1);
                    firestoreService.updateProfile(currentUser.id, { name: editName, bio: editBio });
                    setCurrentUser(prev => ({ ...prev, name: editName, bio: editBio }));
                    setShowEditProfile(false);
                  }}
                  className={`flex-1 py-2.5 ${themeStyles.buttonPrimary}`}
                >
                  {lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Hobbies Manager Modal ---- */}
      {showHobbiesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-lg p-6 relative bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-3xl shadow-2xl text-start animate-[scaleIn_0.25s_ease-out] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { playSynthSound(300, 'sine', 0.05); setShowHobbiesModal(false); }}
              className="absolute top-4 right-4 p-1.5 hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] rounded-full text-[#6E7685] dark:text-[#94A3B8] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
              <h3 className="text-base font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                {lang === 'ar' ? 'إدارة الهوايات والشغف 🎨' : 'Manage Hobbies & Passions 🎨'}
              </h3>
            </div>
            <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mb-5 leading-relaxed">
              {lang === 'ar'
                ? 'حدد هواياتك واهتماماتك الشخصية ليتمكن الأصدقاء وأعضاء لودافيا من التعرف على شغفك وطبيعة شخصيتك.'
                : 'Select your hobbies and personal interests so peers can connect with your lifestyle.'}
            </p>

            {/* Added Hobbies chips */}
            <div className="mb-5">
              <label className="text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] block mb-2">
                {lang === 'ar' ? 'الهوايات المضافة حالياً في بروفايلك:' : 'Currently Added Hobbies:'}
              </label>
              {userHobbies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userHobbies.map((hobby, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-[#48B8FF]/15 border border-[#48B8FF]/30 text-[#1A1F2C] dark:text-[#F8FAFC] text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <span>{hobby}</span>
                      <button
                        onClick={() => handleRemoveHobby(hobby)}
                        className="p-0.5 rounded-full hover:bg-rose-500 hover:text-white text-rose-500 transition-colors cursor-pointer"
                        title={lang === 'ar' ? 'حذف الهواية' : 'Remove hobby'}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] italic">
                  {lang === 'ar' ? 'لم تضف أية هواية بعد.' : 'No hobbies added yet.'}
                </p>
              )}
            </div>

            {/* Input custom hobby */}
            <div className="mb-5">
              <label className="text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] block mb-2">
                {lang === 'ar' ? 'أضف هواية جديدة خاصة بأسلوبك:' : 'Add Custom Hobby:'}
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddHobby(newHobbyInput);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'مثال: صنع العطور 🧪، التخييم ⛺، الخط العربي ✍️' : 'e.g., Camping ⛺, Calligraphy ✍️'}
                  value={newHobbyInput}
                  onChange={(e) => setNewHobbyInput(e.target.value)}
                  className={`flex-1 px-3 py-2 text-xs ${themeStyles.glassInput}`}
                />
                <button
                  type="submit"
                  disabled={!newHobbyInput.trim()}
                  className={`px-4 py-2 text-xs font-bold flex items-center gap-1 ${themeStyles.buttonPrimary}`}
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إضافة' : 'Add'}</span>
                </button>
              </form>
            </div>

            {/* Popular Hobbies Suggestions */}
            <div className="mb-6">
              <label className="text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] block mb-2">
                {lang === 'ar' ? 'مقترحات هوايات شائعة (اضغط للإضافة السريعة):' : 'Popular Suggestions (Click to add):'}
              </label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {POPULAR_HOBBIES.map((presetHobby, idx) => {
                  const isAdded = userHobbies.includes(presetHobby);
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAdded}
                      onClick={() => handleAddHobby(presetHobby)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isAdded
                          ? 'bg-[#E6EAF0] dark:bg-[#202B3D] text-[#6E7685] opacity-50 cursor-not-allowed'
                          : 'bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447] text-[#1A1F2C] dark:text-[#F8FAFC] hover:border-[#48B8FF] hover:text-[#48B8FF]'
                      }`}
                    >
                      <span>{presetHobby}</span>
                      {isAdded ? <Check className="w-3 h-3 text-emerald-500" /> : <Plus className="w-3 h-3 text-[#48B8FF]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E6EAF0] dark:border-[#2A3447]">
              <button
                onClick={() => { playSynthSound(880, 'sine', 0.1); setShowHobbiesModal(false); }}
                className={`px-6 py-2.5 text-xs ${themeStyles.buttonPrimary}`}
              >
                {lang === 'ar' ? 'حفظ وإغلاق ✨' : 'Save & Close ✨'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Logout Confirm Modal ---- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-sm p-6 relative text-center bg-white dark:bg-[#182232] border border-red-100 dark:border-red-900/40 rounded-3xl shadow-2xl">
            <button
              onClick={() => { playSynthSound(300, 'sine', 0.05); setShowLogoutConfirm(false); }}
              className="absolute top-4 right-4 p-1.5 hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] rounded-full text-[#6E7685] dark:text-[#94A3B8] hover:text-[#1A1F2C] dark:hover:text-[#F8FAFC] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-[#1A1F2C] dark:text-[#F8FAFC] mb-2 tracking-wide">
              {lang === 'ar' ? 'تسجيل الخروج 🚪' : 'Sign Out 🚪'}
            </h3>

            <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] leading-relaxed mb-6">
              {lang === 'ar'
                ? 'هل أنت متأكد من رغبتك في الخروج؟ سيتم حفظ كافة بياناتك ونقاطك بأمان.'
                : 'Are you sure you want to exit? Your data and points will be securely preserved.'}
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={() => { playSynthSound(300, 'sine', 0.05); setShowLogoutConfirm(false); }}
                className={`flex-1 py-2.5 text-xs ${themeStyles.buttonSecondary}`}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all cursor-pointer text-center text-xs shadow-md shadow-red-500/20"
              >
                {lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Daily Rewards Modal ---- */}
      {showDailyRewards && (
        <DailyRewardsModal
          onClose={() => setShowDailyRewards(false)}
          onClaimCoinsAndXp={(coins, xp) => {
            setCurrentUser(prev => ({ ...prev, points: prev.points + coins }));
          }}
        />
      )}

      {/* ---- Retention Hub Modal ---- */}
      {showRetentionHub && (
        <RetentionHubModal
          onClose={() => setShowRetentionHub(false)}
        />
      )}
    </div>
  );
}
