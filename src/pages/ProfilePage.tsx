import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { MapPin, Sparkles, Users, UserCheck, Award, Tv, ArrowLeft, X, LogOut } from 'lucide-react';
import { firestoreService, authService } from '../firebase/services';

export default function ProfilePage() {
  const {
    currentUser,
    setCurrentUser,
    lang,
    playSynthSound,
    setShowStoreModal,
    setStoreMessage
  } = useApp();

  const navigate = useNavigate();

  // Local state for profile editing
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio);

  // Sync state if currentUser changes externally
  useEffect(() => {
    setEditName(currentUser.name);
    setEditBio(currentUser.bio);
  }, [currentUser]);

  const handleLogout = async () => {
    playSynthSound(150, 'sawtooth', 0.25);
    try {
      await authService.logout();
      localStorage.removeItem('lumo_current_user');
      localStorage.removeItem('lodavia_current_user');
      setCurrentUser({
        id: '',
        name: '',
        email: '',
        phone: '',
        avatar: '',
        coverImage: '',
        bio: '',
        country: '',
        language: '',
        interests: [],
        achievements: [],
        joinedCommunities: [],
        enrolledCourses: [],
        followersCount: 0,
        followingCount: 0,
        points: 0,
        purchasedItems: []
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

      setCurrentUser(prev => ({
        ...prev,
        points: prev.points + 50
      }));
      alert(lang === 'ar' ? 'تمت إضافة +50 نقطة إلى محفظتك بنجاح! 🎉' : '+50 Lodavia Points added successfully! 🎉');
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-6 animate-[fadeIn_0.4s_ease-out] pb-12">
      {/* Profile Header Card */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        {/* Cover */}
        <div className="relative h-44 w-full">
          <img src={currentUser.coverImage} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        {/* Profile Specs */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-16 gap-4">
            
            <div className="flex items-end gap-4">
              <img 
                src={currentUser.avatar} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full object-cover border-4 border-[#07070a] shadow-xl animate-pulse" 
              />
              <div className="mb-2">
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>{currentUser.name}</span>
                </h2>
                <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{currentUser.country}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 shrink-0 flex-wrap w-full md:w-auto">
              <button 
                onClick={() => {
                  playSynthSound(600, 'sine', 0.1);
                  setEditName(currentUser.name);
                  setEditBio(currentUser.bio);
                  setShowEditProfile(true);
                }}
                className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-slate-200 transition-all active:scale-95 cursor-pointer"
              >
                {lang === 'ar' ? 'تعديل الملف الشخصي ⚙️' : 'Edit Profile ⚙️'}
              </button>
              
              <button 
                onClick={() => {
                  playSynthSound(523.25, 'triangle', 0.15);
                  navigate('/creator-economy');
                }}
                className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 text-xs font-black text-white transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-cyan-400/20 shadow-md shadow-cyan-500/5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span>{lang === 'ar' ? 'فضاء المبدعين 🚀' : 'Creator Hub 🚀'}</span>
              </button>

              <button 
                onClick={() => {
                  playSynthSound(300, 'sawtooth', 0.1);
                  setShowLogoutConfirm(true);
                }}
                className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 text-xs font-bold text-red-400 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
              </button>
            </div>

          </div>

          {/* Bio */}
          <div className="mt-6">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">{lang === 'ar' ? 'النبذة التعريفية' : 'Biography'}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-1.5 whitespace-pre-line max-w-2xl">{currentUser.bio}</p>
          </div>

          {/* Followers count row */}
          <div className="flex gap-6 mt-6 pt-4 border-t border-white/5 text-xs text-slate-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-400" />
              <strong className="text-white">{currentUser.followersCount}</strong> {lang === 'ar' ? 'متابع' : 'Followers'}
            </span>
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-cyan-400 text-slate-500" />
              <strong className="text-white">{currentUser.followingCount}</strong> {lang === 'ar' ? 'يتابع' : 'Following'}
            </span>
          </div>

        </div>
      </div>

      {/* Lodavia Creator Hub Gateway */}
      <div className="glass-panel p-5 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 via-[#0c0c14] to-indigo-950/20 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                {lang === 'ar' ? 'بوابة ريادة الأعمال وصناع المحتوى 🚀' : 'Cosmic Creator & Economy Hub 🚀'}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">
                {lang === 'ar' ? 'فعل بعدك الإبداعي وابدأ بتحقيق عوائد مالية حقيقية عبر الغرف الصوتية، القنوات المدفوعة، والهدايا الكونية.' : 'Activate your creative dimension and begin earning from exclusive subscriber circles, courses, and virtual gifts.'}
              </p>
            </div>
          </div>

          <button 
            onClick={() => {
              playSynthSound(523.25, 'triangle', 0.15);
              navigate('/creator-economy');
            }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-cyan-500/15 transition-all active:scale-95 text-center cursor-pointer shrink-0 w-full sm:w-auto"
          >
            {lang === 'ar' ? 'دخول فضاء صناع المحتوى 🌌' : 'Enter Creator Portal 🌌'}
          </button>
        </div>
      </div>

      {/* Achievements & Badges Grid */}
      <div className="glass-panel p-5 rounded-3xl border border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-yellow-400 animate-pulse" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">{lang === 'ar' ? 'شارات الإنجاز والتفاعل 🏆' : 'Achievements & Badges 🏆'}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentUser.achievements.map((ach) => (
            <div key={ach.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-3 items-center">
              <span className="text-3xl">{ach.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{ach.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lodavia Points & Store Quick Integration Widget */}
      <div className="glass-panel p-5 rounded-3xl border border-yellow-500/20 bg-gradient-to-r from-amber-950/10 via-[#0c0c14] to-yellow-950/10 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                {lang === 'ar' ? 'محفظة نقاط لودافيا الكونية 💎' : 'Lodavia Cosmic Points Wallet 💎'}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">
                {lang === 'ar' ? 'اجمع النقاط واستبدلها بهالة نيون متوهجة، شارات ملكية، وألقاب مميزة لتبرز في المجتمعات.' : 'Collect points and trade them for neon glowing frames, royal badges, and custom premium user names.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
            <div className="px-4 py-2 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[8px] text-slate-500 block uppercase font-bold">{lang === 'ar' ? 'رصيدك الحالي' : 'Current Balance'}</span>
              <strong className="text-sm font-black text-yellow-400">{currentUser.points} 💎</strong>
            </div>

            <button 
              onClick={() => {
                playSynthSound(750, 'sine', 0.1);
                setStoreMessage('');
                setShowStoreModal(true);
              }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-purple-500/15 transition-all active:scale-95 text-center cursor-pointer"
            >
              {lang === 'ar' ? 'فتح المتجر 🛒' : 'Open Store 🛒'}
            </button>

            <button 
              onClick={startWatchingAd}
              className="px-5 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs shadow-lg shadow-yellow-500/10 transition-all active:scale-95 text-center cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Tv className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'ar' ? 'شاهد إعلانًا (+50) 📺' : 'Watch Ad (+50) 📺'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enrolled Courses & Groups details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Subscribed Interests */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">{lang === 'ar' ? 'الاهتمامات المفضلة' : 'Favorite Interests'}</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.interests.map((interest) => (
              <span key={interest} className="px-3.5 py-1.5 rounded-full bg-gradient-to-br from-purple-600/20 to-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-bold">
                #{interest}
              </span>
            ))}
          </div>
        </div>

        {/* Registered State Info */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col gap-3 justify-center">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">{lang === 'ar' ? 'اللغة الافتراضية:' : 'Default Language:'}</span>
            <span className="text-white font-bold">{currentUser.language}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">{lang === 'ar' ? 'رقم الاتصال المرتبط:' : 'Linked Phone:'}</span>
            <span className="text-white font-bold">{currentUser.phone || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">{lang === 'ar' ? 'طريقة الربط:' : 'Sync Protocol:'}</span>
            <span className="text-emerald-400 font-bold">TLS-Quantum Direct</span>
          </div>
        </div>

      </div>

      {/* ----------------- INTERACTIVE GLASSMORPHIC PROFILE EDIT MODAL ----------------- */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md bg-[#0a0915]/95 border border-purple-500/30 rounded-3xl p-6 relative shadow-[0_0_50px_rgba(168,85,247,0.25)]">
            <button 
              onClick={() => { playSynthSound(300, 'sine', 0.05); setShowEditProfile(false); }}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black text-white mb-4 tracking-wide uppercase">
              {lang === 'ar' ? 'تعديل الملف الكوني ⚙️' : 'Edit Cosmic Profile ⚙️'}
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400">{lang === 'ar' ? 'الاسم الكوني' : 'Cosmic Name'}</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400/50 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400">{lang === 'ar' ? 'النبذة التعريفية' : 'Biography'}</label>
                <textarea 
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  onClick={() => { playSynthSound(300, 'sine', 0.05); setShowEditProfile(false); }}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-bold transition-all hover:bg-white/10 cursor-pointer text-center"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  onClick={() => {
                    playSynthSound(880, 'sine', 0.1);
                    firestoreService.updateProfile(currentUser.id, { name: editName, bio: editBio });
                    setCurrentUser(prev => ({ ...prev, name: editName, bio: editBio }));
                    setShowEditProfile(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-[1.02] text-white font-black transition-all cursor-pointer text-center"
                >
                  {lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- INTERACTIVE LOGOUT CONFIRM MODAL ----------------- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-sm bg-[#0a0915]/95 border border-red-500/30 rounded-3xl p-6 relative shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center">
            <button 
              onClick={() => { playSynthSound(300, 'sine', 0.05); setShowLogoutConfirm(false); }}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-red-500">
              <LogOut className="w-6 h-6 animate-pulse" />
            </div>

            <h3 className="text-base font-black text-white mb-2 tracking-wide">
              {lang === 'ar' ? 'تسجيل الخروج الكوني 🌌' : 'Cosmic Sign Out 🌌'}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              {lang === 'ar' 
                ? 'هل أنت متأكد من رغبتك في الخروج من مدار Lodavia الحالي؟ سيتم حفظ كافة بيانات تفاعلك ونقاطك بأمان.' 
                : 'Are you sure you want to exit the current Lodavia orbit? Your interaction logs and cosmic points will be securely preserved.'}
            </p>

            <div className="flex gap-2.5">
              <button 
                onClick={() => { playSynthSound(300, 'sine', 0.05); setShowLogoutConfirm(false); }}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-bold transition-all hover:bg-white/10 cursor-pointer text-center text-xs"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:scale-[1.02] text-white font-black transition-all cursor-pointer text-center text-xs shadow-md shadow-red-500/10"
              >
                {lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
