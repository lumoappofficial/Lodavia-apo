import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Share2, 
  Check, 
  Mic, 
  MicOff, 
  UserPlus, 
  UserMinus,
  Sliders,
  Shield,
  Volume2
} from 'lucide-react';
import { VoiceUser, ScheduledRoom, VoiceRoomItem } from '../types/voice';
import { VoiceRoomsHome } from './VoiceRoomsHome';
import { VoiceRoomActive } from './VoiceRoomActive';

interface VoiceRoomsSystemProps {
  currentUser: any;
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>;
  lang: 'ar' | 'en';
  playSynthSound: (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number) => void;
  setActiveTab: (tab: any) => void;
}

export default function VoiceRoomsSystem({
  currentUser,
  setCurrentUser,
  lang,
  playSynthSound,
  setActiveTab
}: VoiceRoomsSystemProps) {

  // State Management
  const [activeRoom, setActiveRoom] = useState<VoiceRoomItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [roomNotification, setRoomNotification] = useState<string | null>(null);

  // Modal displays
  const [showRoomCreator, setShowRoomCreator] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<VoiceUser | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Create Room form states
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomCategory, setNewRoomCategory] = useState('programming');
  const [newRoomLang, setNewRoomLang] = useState('ar');

  // Schedule Room form states
  const [schedTitle, setSchedTitle] = useState('');
  const [schedCat, setSchedCat] = useState('ai');
  const [schedTime, setSchedTime] = useState('');

  // Categories
  const categories = [
    { id: 'all', label: 'All Galaxies 🌌', labelAr: 'كل المجرات 🌌' },
    { id: 'programming', label: 'Programming 💻', labelAr: 'البرمجة 💻' },
    { id: 'ai', label: 'Artificial Intelligence 🧠', labelAr: 'الذكاء الاصطناعي 🧠' },
    { id: 'gaming', label: 'Gaming 🎮', labelAr: 'الألعاب 🎮' },
    { id: 'science', label: 'Quantum Physics 🪐', labelAr: 'فيزياء الكم 🪐' }
  ];

  // Preloaded Rooms List (Discord/Clubhouse level design specs)
  const [rooms, setRooms] = useState<VoiceRoomItem[]>([
    {
      id: 'room-1',
      title: 'Next-Gen Quantum Dev: React 19 + Rust Compiler',
      titleAr: 'مستقبل تطوير الكوانتم: React 19 ومترجمات Rust',
      category: 'programming',
      categoryAr: 'البرمجة 💻',
      coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      hostName: 'صالح العمري',
      hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      hostBio: 'Senior system architect specializing in low latency WebAssembly architectures and localized Node.js pipelines.',
      hostBioAr: 'كبير مهندسي النظم متخصص في بنيات WebAssembly فائقة السرعة وأنظمة الحوسبة الموزعة.',
      listenersCount: 312,
      speakersCount: 4,
      language: 'English/Arabic',
      languageAr: 'إنجليزي/عربي',
      communityName: 'Web Quantum Core',
      communityNameAr: 'نواة الكوانتم البرمجية',
      isFeatured: true,
      isRecommended: true,
      pinnedMessage: {
        text: 'Link to git repo is available in chat settings. Feel free to pull the rust-compiler branch.',
        textAr: 'رابط الكود المصدري متوفر في المحادثة الجانبية. لا تتردد في تحميل فرع مترجم Rust.',
        author: 'صالح العمري'
      },
      announcement: {
        text: 'Live Q&A starts in 10 minutes. Raise hands to request promoting to the stage.',
        textAr: 'الأسئلة والأجوبة تبدأ بعد 10 دقائق. ارفع يدك للمشاركة وطرح الأسئلة المباشرة.'
      },
      participants: [
        {
          id: 'p-1',
          name: 'صالح العمري',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          bio: 'Stage Creator and moderator. Systems enthusiast.',
          bioAr: 'منشئ الصالون ومنسق الحوار. شغوف بتطوير النظم السحابية.',
          badges: ['👑 Host', '🪐 Lodavia Architect'],
          badgesAr: ['👑 المضيف', '🪐 مهندس لودافيا المعتمد'],
          isHost: true,
          isSpeaker: true,
          isMuted: false,
          handRaised: false,
          isOnline: true,
          isSpeaking: true
        },
        {
          id: 'p-2',
          name: 'سارة المهندس',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          bio: 'AI researcher and developer. Enjoys reactive patterns.',
          bioAr: 'باحثة ذكاء اصطناعي ومطورة برمجيات تفاعلية.',
          badges: ['🎙️ Speaker', '🧠 AI Oracle'],
          badgesAr: ['🎙️ متحدث', '🧠 عراب الذكاء الاصطناعي'],
          isHost: false,
          isSpeaker: true,
          isMuted: false,
          handRaised: false,
          isOnline: true,
          isSpeaking: false
        },
        {
          id: 'p-3',
          name: 'أحمد القحطاني',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          bio: 'UI/UX visual designer. Focuses on spatial interfaces and glassmorphism curves.',
          bioAr: 'مصمم واجهات وتجربة مستخدم. يركز على التصاميم الزجاجية ثلاثية الأبعاد.',
          badges: ['🎙️ Speaker', '🎨 Curve Master'],
          badgesAr: ['🎙️ متحدث', '🎨 خبير الانكسارات'],
          isHost: false,
          isSpeaker: true,
          isMuted: true,
          handRaised: false,
          isOnline: true,
          isSpeaking: false
        },
        {
          id: 'p-4',
          name: 'Emily Watson',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          bio: 'Rust compiler engineer at Tech Core.',
          bioAr: 'مهندسة مترجمات لغة Rust في شركة تك كور العالمية.',
          badges: ['🎙️ Speaker', '🦀 Rustacean'],
          badgesAr: ['🎙️ متحدث', '🦀 مطور رست المعتمد'],
          isHost: false,
          isSpeaker: true,
          isMuted: false,
          handRaised: false,
          isOnline: true,
          isSpeaking: false
        },
        {
          id: 'p-5',
          name: 'خالد المطيري',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
          bio: 'Quantum explorer and regular Lodavia listener.',
          bioAr: 'مستكشف فيزياء الكم ومستمع منتظم في مجتمع لودافيا.',
          badges: ['🎧 Listener'],
          badgesAr: ['🎧 مستمع نشط'],
          isHost: false,
          isSpeaker: false,
          isMuted: false,
          handRaised: false,
          isOnline: true,
          isSpeaking: false
        }
      ]
    },
    {
      id: 'room-2',
      title: 'Decentralized Intelligence: Gemini Flash in Mobile UX',
      titleAr: 'الذكاء اللامركزي: نماذج Gemini Flash في واجهات الهواتف',
      category: 'ai',
      categoryAr: 'الذكاء الاصطناعي 🧠',
      coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
      hostName: 'نورة السديري',
      hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      hostBio: 'Leading Mobile UX at Lodavia Labs. Optimizing local model invocations and high speed client analytics.',
      hostBioAr: 'رئيسة تجربة مستخدم الهاتف في مختبرات لودافيا. متخصصة في تسريع تشغيل الذكاء المحلي.',
      listenersCount: 189,
      speakersCount: 3,
      language: 'English/Arabic',
      languageAr: 'إنجليزي/عربي',
      communityName: 'AI Explorers Hub',
      communityNameAr: 'مركز مستكشفي الذكاء الاصطناعي',
      isTrending: true,
      pinnedMessage: null,
      announcement: null,
      participants: [
        {
          id: 'p-10',
          name: 'نورة السديري',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
          bio: 'UX Lead and stage host. Passionate about AI integrations.',
          bioAr: 'قائدة تجربة مستخدم ومضيفة الحوار. شغوفة بدمج الذكاء الاصطناعي.',
          badges: ['👑 Host', '🧠 UX Pioneer'],
          badgesAr: ['👑 المضيف', '🧠 رائدة الواجهات الذكية'],
          isHost: true,
          isSpeaker: true,
          isMuted: false,
          handRaised: false,
          isOnline: true,
          isSpeaking: true
        }
      ]
    },
    {
      id: 'room-3',
      title: 'Gaming Hub: CS3 Esports tactics & Lodavia Points farming',
      titleAr: 'مركز الألعاب: تكتيكات بطولات CS3 وجني نقاط لودافيا',
      category: 'gaming',
      categoryAr: 'الألعاب 🎮',
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
      hostName: 'طارق الحربي',
      hostAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      hostBio: 'Professional Esports athlete and regular streamer on Lodavia Gaming platform.',
      hostBioAr: 'لاعب محترف في بطولات الرياضات الإلكترونية ومذيع ألعاب نشط في لودافيا.',
      listenersCount: 220,
      speakersCount: 2,
      language: 'Arabic',
      languageAr: 'عربي',
      communityName: 'Lodavia Cyber Arena',
      communityNameAr: 'ساحة لودافيا الإلكترونية',
      isTrending: true,
      pinnedMessage: null,
      announcement: null,
      participants: [
        {
          id: 'p-20',
          name: 'طارق الحربي',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
          bio: 'Host and professional gamer.',
          bioAr: 'المستضيف ولاعب محترف.',
          badges: ['👑 Host', '🎮 Pro Player'],
          badgesAr: ['👑 المضيف', '🎮 لاعب محترف'],
          isHost: true,
          isSpeaker: true,
          isMuted: false,
          handRaised: false,
          isOnline: true,
          isSpeaking: true
        }
      ]
    }
  ]);

  // Preloaded Scheduled Rooms
  const [scheduledRooms, setScheduledRooms] = useState<ScheduledRoom[]>([
    {
      id: 'sched-1',
      title: 'Cosmic Ray Physics: Simulating Black Hole horizons with D3',
      titleAr: 'فيزياء الأشعة الكونية: محاكاة أفق الثقوب السوداء عبر D3',
      hostName: 'د. ليلى قطان',
      hostAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      time: 'Tomorrow, 9:00 PM UTC',
      timeAr: 'غداً، 9:00 مساءً بالتوقيت العالمي',
      date: '2026-07-10',
      category: 'science',
      categoryAr: 'فيزياء الكم 🪐',
      reminded: false
    },
    {
      id: 'sched-2',
      title: 'Decentralized Networks: Hosting node microservers on Cloud Run',
      titleAr: 'الشبكات اللامركزية: استضافة الخوادم الدقيقة عبر Cloud Run',
      hostName: 'المهندس ياسر الرويلي',
      hostAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      time: 'Friday, 4:00 PM UTC',
      timeAr: 'الجمعة، 4:00 مساءً بالتوقيت العالمي',
      date: '2026-07-11',
      category: 'programming',
      categoryAr: 'البرمجة 💻',
      reminded: true
    }
  ]);

  // Friends Speaking online tracker simulation
  const friendsSpeaking = [
    {
      id: 'friend-1',
      name: 'ياسين الفيفي',
      nameEn: 'Yasin Al-Fifi',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      roomTitle: 'Next-Gen Quantum Dev: React 19 + Rust Compiler',
      roomTitleAr: 'مستقبل تطوير الكوانتم: React 19 ومترجمات Rust',
      roomId: 'room-1',
      isSpeaking: true,
    },
    {
      id: 'friend-2',
      name: 'لينا حداد',
      nameEn: 'Lina Haddad',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      roomTitle: 'Decentralized Intelligence: Gemini Flash in Mobile UX',
      roomTitleAr: 'الذكاء اللامركزي: نماذج Gemini Flash في واجهات الهواتف',
      roomId: 'room-2',
      isSpeaking: true,
    },
    {
      id: 'friend-3',
      name: 'طارق الحربي',
      nameEn: 'Tariq Al-Harbi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      roomTitle: 'Gaming Hub: CS3 Esports tactics & Lodavia Points farming',
      roomTitleAr: 'مركز الألعاب: تكتيكات بطولات CS3 وجني نقاط لودافيا',
      roomId: 'room-3',
      isSpeaking: false,
    }
  ];

  // Global floating notifications
  const triggerRoomNotification = (msg: string) => {
    setRoomNotification(msg);
    setTimeout(() => {
      setRoomNotification(null);
    }, 4500);
  };

  // Sync active room changes with general rooms state (so lists are updated)
  useEffect(() => {
    if (!activeRoom) return;
    const currentSynced = rooms.find(r => r.id === activeRoom.id);
    if (currentSynced) {
      setActiveRoom(currentSynced);
    }
  }, [rooms, activeRoom?.id]);

  // Handle Joining an Audio Stage
  const handleJoinRoom = (room: VoiceRoomItem) => {
    if (room.isLocked) {
      playSynthSound(150, 'sawtooth', 0.25);
      alert(lang === 'ar' 
        ? '⚠️ هذا الصالون الصوتي مغلق حالياً من قبل المضيف 🔒' 
        : '⚠️ This stage is locked by the Host 🔒\nYou need an active invitation or host permissions to join.'
      );
      return;
    }

    playSynthSound(800, 'sine', 0.15);
    
    // Check if the user is already inside participant list
    const hasMe = room.participants.some(p => p.id === 'user-me');
    let updatedParticipants = [...room.participants];

    if (!hasMe) {
      // Add user-me as a listener
      const meParticipant: VoiceUser = {
        id: 'user-me',
        name: currentUser.name,
        avatar: currentUser.avatar,
        bio: currentUser.bio || 'Galactic traveler exploring premium audio networks.',
        bioAr: currentUser.bio || 'مسافر كوني يستكشف القنوات الصوتية فائقة الدقة.',
        badges: ['🪐 Explorer', '🛡️ Listener'],
        badgesAr: ['🪐 رائد كوني', '🛡️ مستمع'],
        isHost: false,
        isSpeaker: false,
        isMuted: false,
        handRaised: false,
        isOnline: true,
        isSpeaking: false
      };
      updatedParticipants.push(meParticipant);
    }

    setRooms(prev => prev.map(r => {
      if (r.id === room.id) {
        return {
          ...r,
          listenersCount: hasMe ? r.listenersCount : r.listenersCount + 1,
          participants: updatedParticipants
        };
      }
      return r;
    }));

    setActiveRoom({
      ...room,
      listenersCount: hasMe ? room.listenersCount : room.listenersCount + 1,
      participants: updatedParticipants
    });

    triggerRoomNotification(lang === 'ar' 
      ? `انضممت إلى مسرح: ${room.titleAr}` 
      : `Connected to stage: ${room.title}`
    );
  };

  // Leaving Active Room
  const handleLeaveRoom = () => {
    if (!activeRoom) return;
    playSynthSound(400, 'sine', 0.1);

    const hasMe = activeRoom.participants.some(p => p.id === 'user-me');

    setRooms(prev => prev.map(r => {
      if (r.id === activeRoom.id) {
        return {
          ...r,
          listenersCount: Math.max(0, hasMe ? r.listenersCount - 1 : r.listenersCount),
          participants: r.participants.filter(p => p.id !== 'user-me')
        };
      }
      return r;
    }));

    setActiveRoom(null);
  };

  // Creating a new Stage Salon
  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) return;

    playSynthSound(1046, 'sine', 0.2);

    const newId = `room-custom-${Date.now()}`;
    const myCreator: VoiceUser = {
      id: 'user-me',
      name: currentUser.name,
      avatar: currentUser.avatar,
      bio: currentUser.bio || 'Creator of this premium stage.',
      bioAr: currentUser.bio || 'منشئ هذا الصالون الصوتي المميز.',
      badges: ['👑 Host', '🎙️ Speaker'],
      badgesAr: ['👑 المستضيف', '🎙️ متحدث رئيسي'],
      isHost: true,
      isSpeaker: true,
      isMuted: false,
      handRaised: false,
      isOnline: true,
      isSpeaking: false
    };

    const newRoom: VoiceRoomItem = {
      id: newId,
      title: newRoomTitle,
      titleAr: newRoomTitle,
      category: newRoomCategory,
      categoryAr: categories.find(c => c.id === newRoomCategory)?.labelAr || 'عام 🪐',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      hostName: currentUser.name,
      hostAvatar: currentUser.avatar,
      hostBio: currentUser.bio || 'Space stage director.',
      hostBioAr: currentUser.bio || 'قائد صالون فضاء.',
      listenersCount: 1,
      speakersCount: 1,
      language: newRoomLang === 'ar' ? 'Arabic' : 'English',
      languageAr: newRoomLang === 'ar' ? 'عربي' : 'إنجليزي',
      communityName: 'My Private Constellation',
      communityNameAr: 'مجموعتي النجمية الخاصة',
      isFeatured: false,
      isRecommended: false,
      pinnedMessage: null,
      announcement: null,
      participants: [myCreator]
    };

    setRooms(prev => [newRoom, ...prev]);
    setShowRoomCreator(false);
    setNewRoomTitle('');
    
    // Instantly join our created room
    setActiveRoom(newRoom);
    triggerRoomNotification(lang === 'ar' ? 'تم إنشاء صالونك الصوتي بنجاح! أنت المستضيف 👑' : 'Your Stage is live! Welcome host 👑');
  };

  // Scheduling Submit
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedTitle.trim() || !schedTime) return;

    playSynthSound(880, 'sine', 0.15);

    const newSched: ScheduledRoom = {
      id: `sched-custom-${Date.now()}`,
      title: schedTitle,
      titleAr: schedTitle,
      hostName: currentUser.name,
      hostAvatar: currentUser.avatar,
      time: new Date(schedTime).toLocaleString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit' }),
      timeAr: new Date(schedTime).toLocaleString('ar-SA', { weekday: 'long', hour: '2-digit', minute: '2-digit' }),
      date: schedTime.split('T')[0],
      category: schedCat,
      categoryAr: categories.find(c => c.id === schedCat)?.labelAr || 'عام 🪐',
      reminded: false
    };

    setScheduledRooms(prev => [newSched, ...prev]);
    setShowScheduleModal(false);
    setSchedTitle('');
    alert(lang === 'ar' ? 'تمت الجدولة ونشرها للشبكة 🛰️' : 'Stage listed on upcoming calendars successfully! 🛰️');
  };

  // Virtual Gift sending logic
  const handleSendGift = (giftName: string, cost: number, icon: string) => {
    if (currentUser.points < cost) {
      playSynthSound(150, 'sawtooth', 0.2);
      alert(lang === 'ar' ? '💎 رصيد نقاط لودافيا غير كافٍ لإرسال هذه الهدية الكونية.' : '💎 Inadequate Lodavia points in your wallet.');
      return;
    }

    playSynthSound(950, 'sine', 0.25);
    
    // Deduct points from current user
    setCurrentUser(prev => ({ ...prev, points: Math.max(0, prev.points - cost) }));
    setShowGiftModal(false);

    triggerRoomNotification(lang === 'ar' 
      ? `أرسلت هدية ${icon} ${giftName} لجميع المتحدثين! 🌟` 
      : `Sent a spatial ${icon} ${giftName} gift! Bouncing spatial graphics spawned. 🌟`
    );
  };

  return (
    <div className="w-full relative min-h-screen">
      
      {/* Inline animations definition */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sw-bar-1 { 0%, 100% { height: 3px; } 50% { height: 11px; } }
        @keyframes sw-bar-2 { 0%, 100% { height: 4px; } 50% { height: 15px; } }
        @keyframes sw-bar-3 { 0%, 100% { height: 2px; } 50% { height: 8px; } }
        @keyframes sw-bar-4 { 0%, 100% { height: 3px; } 50% { height: 13px; } }
        @keyframes pulse-ring-grow { 
          0% { transform: scale(1); opacity: 0.65; } 
          50% { transform: scale(1.18); opacity: 0.35; } 
          100% { transform: scale(1.35); opacity: 0; } 
        }
        .animate-sw-1 { animation: sw-bar-1 0.7s ease-in-out infinite; }
        .animate-sw-2 { animation: sw-bar-2 0.5s ease-in-out infinite; }
        .animate-sw-3 { animation: sw-bar-3 0.9s ease-in-out infinite; }
        .animate-sw-4 { animation: sw-bar-4 0.6s ease-in-out infinite; }
        .animate-pulse-ring { animation: pulse-ring-grow 1.6s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      ` }} />

      {/* Primary Routing between Discover Hub (Home) and Active Room Stage */}
      {!activeRoom ? (
        <VoiceRoomsHome
          lang={lang}
          playSynthSound={playSynthSound}
          rooms={rooms}
          scheduledRooms={scheduledRooms}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleJoinRoom={handleJoinRoom}
          setShowRoomCreator={setShowRoomCreator}
          setShowScheduleModal={setShowScheduleModal}
          setScheduledRooms={setScheduledRooms}
          friendsSpeaking={friendsSpeaking}
        />
      ) : (
        <VoiceRoomActive
          lang={lang}
          playSynthSound={playSynthSound}
          activeRoom={activeRoom}
          handleLeaveRoom={handleLeaveRoom}
          setSelectedUser={setSelectedUser}
          setShowGiftModal={setShowGiftModal}
          setShowInviteModal={setShowInviteModal}
          currentUser={currentUser}
          setRooms={setRooms}
          triggerRoomNotification={triggerRoomNotification}
          roomNotification={roomNotification}
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL WINDOWS & SLIDERS OVERLAYS */}
      {/* ---------------------------------------------------- */}

      {/* 1. STAGE CREATOR MODAL */}
      {showRoomCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full border border-white/10 shadow-2xl flex flex-col gap-4 animate-[scaleIn_0.25s_ease-out]">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                {lang === 'ar' ? 'إطلاق صالون صوتي فائق المدار 🎙️' : 'Start Futuristic Stage Salon 🎙️'}
              </h3>
              <button 
                onClick={() => {
                  playSynthSound(440, 'sine', 0.1);
                  setShowRoomCreator(false);
                }}
                className="p-1.5 hover:bg-white/5 rounded-full text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoomSubmit} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'ar' ? 'عنوان الصالون الصوتي' : 'Stage Salon Title'}
                </label>
                <input
                  type="text"
                  required
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: الذكاء الموزع والتطبيقات السحابية' : 'Example: Deep-Dive on Reactive State'}
                  className="glass-input w-full py-2.5 px-3 rounded-xl text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'ar' ? 'التصنيف والمجرة البرمجية' : 'Category / Galaxy Domain'}
                </label>
                <select
                  value={newRoomCategory}
                  onChange={(e) => setNewRoomCategory(e.target.value)}
                  className="glass-input w-full py-2.5 px-3 rounded-xl text-xs bg-slate-950"
                >
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {lang === 'ar' ? cat.labelAr : cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'ar' ? 'لغة الصالون الأساسية' : 'Primary Language'}
                </label>
                <select
                  value={newRoomLang}
                  onChange={(e) => setNewRoomLang(e.target.value)}
                  className="glass-input w-full py-2.5 px-3 rounded-xl text-xs bg-slate-950"
                >
                  <option value="ar">{lang === 'ar' ? 'العربية' : 'Arabic'}</option>
                  <option value="en">{lang === 'ar' ? 'الإنجليزية' : 'English'}</option>
                  <option value="mix">{lang === 'ar' ? 'مزيج (عربي/إنجليزي)' : 'Mixed (AR/EN)'}</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-bold text-xs cursor-pointer shadow-lg active:scale-95 transition-transform"
              >
                {lang === 'ar' ? 'إطلاق المسرح فوراً 🚀' : 'Confirm & Launch Stage 🚀'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. SCHEDULE STAGE MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full border border-white/10 shadow-2xl flex flex-col gap-4 animate-[scaleIn_0.25s_ease-out]">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-sm font-extrabold text-white">
                {lang === 'ar' ? 'جدولة صالون صوتي مستقبلي 📅' : 'Schedule Future Audio Stage 📅'}
              </h3>
              <button 
                onClick={() => {
                  playSynthSound(440, 'sine', 0.1);
                  setShowScheduleModal(false);
                }}
                className="p-1.5 hover:bg-white/5 rounded-full text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'ar' ? 'عنوان الغرفة الصوتية المجدولة' : 'Scheduled Stage Title'}
                </label>
                <input
                  type="text"
                  required
                  value={schedTitle}
                  onChange={(e) => setSchedTitle(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: تقنيات الكوانتوم مع د. ليلى' : 'Example: Astro-physics panel'}
                  className="glass-input w-full py-2.5 px-3 rounded-xl text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'ar' ? 'التصنيف' : 'Category'}
                </label>
                <select
                  value={schedCat}
                  onChange={(e) => setSchedCat(e.target.value)}
                  className="glass-input w-full py-2.5 px-3 rounded-xl text-xs bg-slate-950"
                >
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {lang === 'ar' ? cat.labelAr : cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'ar' ? 'موعد وتاريخ البدء الكوني' : ' Cosmic Start Date & Time'}
                </label>
                <input
                  type="datetime-local"
                  required
                  value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  className="glass-input w-full py-2.5 px-3 rounded-xl text-xs bg-slate-950"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-bold text-xs cursor-pointer shadow-lg"
              >
                {lang === 'ar' ? 'تأكيد وحفظ الجدولة 🚀' : 'Confirm & Schedule 🚀'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. VIRTUAL GIFT SHOP */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full border border-white/10 shadow-2xl flex flex-col gap-4 animate-[scaleIn_0.25s_ease-out]">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-spin-slow" />
                <h3 className="text-sm font-extrabold text-white">
                  {lang === 'ar' ? 'إرسال هدايا كوانتوم حية 💎🎁' : 'Send Immersive Cosmic Gifts 💎🎁'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  playSynthSound(440, 'sine', 0.1);
                  setShowGiftModal(false);
                }}
                className="p-1.5 hover:bg-white/5 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              {lang === 'ar' 
                ? 'عبّر عن تقديرك للمتحدثين على المسرح. يتم خصم النقاط من محفظة Lodavia الخاصة بك وإشعاع طيف الهدية فورا!'
                : 'Praise speakers for their contributions. Gifts trigger dynamic spatial animations and sound effects immediately.'}
            </p>

            <div className="grid grid-cols-2 gap-3.5 mt-2">
              {[
                { name: 'Lodavia Comet', nameAr: 'مذنب لودافيا', cost: 50, icon: '☄️' },
                { name: 'Quantum Laser', nameAr: 'ليزر كوانتوم', cost: 100, icon: '⚡' },
                { name: 'Star Surge', nameAr: 'شحن النجوم', cost: 150, icon: '💫' },
                { name: 'Cyber Crown', nameAr: 'تاج الفضاء الملكي', cost: 200, icon: '👑' }
              ].map((g) => (
                <button
                  key={g.name}
                  onClick={() => handleSendGift(lang === 'ar' ? g.nameAr : g.name, g.cost, g.icon)}
                  className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:border-yellow-500/30 text-center flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                >
                  <span className="text-3xl">{g.icon}</span>
                  <span className="text-xs font-black text-slate-200 block">{lang === 'ar' ? g.nameAr : g.name}</span>
                  <span className="text-[10px] bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-2 py-0.5 rounded-full font-bold">
                    {g.cost} 💎
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-2 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500">
              <span>{lang === 'ar' ? 'رصيد محفظتك الحالي:' : 'Your Wallet Balance:'}</span>
              <strong className="text-yellow-400 font-black">{currentUser.points} 💎</strong>
            </div>
          </div>
        </div>
      )}

      {/* 4. USER PROFILE DETAILS & HOST-MODERATOR COMMAND PANEL OVERLAYS */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel rounded-3xl p-6 max-w-sm w-full border border-white/10 shadow-2xl flex flex-col gap-4 animate-[scaleIn_0.25s_ease-out] relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />

            <div className="flex justify-between items-center pb-2 border-b border-white/5 relative z-10">
              <span className="text-[10px] bg-purple-500/20 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded font-bold">
                {lang === 'ar' ? 'الملف الشخصي الكوني' : 'Lodavia Stage Profile'}
              </span>
              <button 
                onClick={() => {
                  playSynthSound(440, 'sine', 0.1);
                  setSelectedUser(null);
                }}
                className="p-1.5 hover:bg-white/5 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center gap-3 mt-2 relative z-10">
              <img src={selectedUser.avatar} alt={selectedUser.name} className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400/50 shadow-xl" />
              
              <div>
                <h3 className="text-sm font-black text-white">{selectedUser.name}</h3>
                <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">● Active in this social room</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                {(lang === 'ar' ? selectedUser.badgesAr : selectedUser.badges).map((b) => (
                  <span key={b} className="text-[8px] bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                    {b}
                  </span>
                ))}
              </div>

              {/* Bio */}
              <p className="text-[11px] text-slate-300 leading-relaxed max-w-xs bg-black/40 p-3 rounded-2xl border border-white/5 mt-1">
                {lang === 'ar' ? selectedUser.bioAr : selectedUser.bio}
              </p>

              {/* 🛡️ HOST & MODERATOR CONTROLS OVERLAY PANEL (Activated in sandbox sandbox context!) */}
              {selectedUser.id !== 'user-me' && activeRoom && (
                <div className="w-full flex flex-col gap-2 mt-2 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 mb-1 justify-between">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block">
                      {lang === 'ar' ? 'صلاحيات المنسق والمشرف 👑' : 'Host & Moderator Actions 👑'}
                    </span>
                    <span className="text-[7px] bg-yellow-500/10 text-yellow-500 px-1 py-0.2 rounded font-black uppercase">Host Active</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Speaker Promotion Toggle */}
                    <button
                      onClick={() => {
                        playSynthSound(800, 'sine', 0.1);
                        setRooms(prev => prev.map(r => {
                          if (r.id === activeRoom.id) {
                            const targetP = r.participants.find(p => p.id === selectedUser.id);
                            const updatedSpeakers = targetP?.isSpeaker ? r.speakersCount - 1 : r.speakersCount + 1;
                            return {
                              ...r,
                              speakersCount: Math.max(1, updatedSpeakers),
                              participants: r.participants.map(p => {
                                if (p.id === selectedUser.id) {
                                  return { ...p, isSpeaker: !p.isSpeaker, handRaised: false };
                                }
                                return p;
                              })
                            };
                          }
                          return r;
                        }));
                        triggerRoomNotification(lang === 'ar' 
                          ? `تم تعديل رتبة ${selectedUser.name} على المسرح.` 
                          : `Stage status modified for ${selectedUser.name}.`
                        );
                        setSelectedUser(null);
                      }}
                      className="py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500/10 hover:text-cyan-400 text-[10px] font-black text-slate-300 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{selectedUser.isSpeaker ? (lang === 'ar' ? 'تنزيل للمستمعين' : 'Demote Speaker') : (lang === 'ar' ? 'ترفيع لمتحدث' : 'Make Speaker')}</span>
                    </button>

                    {/* Force Mute User */}
                    <button
                      onClick={() => {
                        playSynthSound(300, 'sine', 0.1);
                        setRooms(prev => prev.map(r => {
                          if (r.id === activeRoom.id) {
                            return {
                              ...r,
                              participants: r.participants.map(p => {
                                if (p.id === selectedUser.id) {
                                  return { ...p, isMuted: !p.isMuted, isSpeaking: false };
                                }
                                return p;
                              })
                            };
                          }
                          return r;
                        }));
                        triggerRoomNotification(selectedUser.isMuted 
                          ? (lang === 'ar' ? `تم إلغاء كتم ${selectedUser.name}` : `Unmuted ${selectedUser.name} stage feed`)
                          : (lang === 'ar' ? `تم كتم صوت المايك لـ ${selectedUser.name}` : `Force Muted ${selectedUser.name} stage feed`)
                        );
                        setSelectedUser(null);
                      }}
                      className="py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:text-red-400 text-[10px] font-black text-slate-300 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {selectedUser.isMuted ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-red-400" />}
                      <span>{selectedUser.isMuted ? (lang === 'ar' ? 'إلغاء الكتم' : 'Force Unmute') : (lang === 'ar' ? 'كتم المايك' : 'Force Mute')}</span>
                    </button>
                  </div>

                  {/* Kick/Remove Participant completely */}
                  <button
                    onClick={() => {
                      playSynthSound(200, 'sawtooth', 0.12);
                      setRooms(prev => prev.map(r => {
                        if (r.id === activeRoom.id) {
                          return {
                            ...r,
                            listenersCount: selectedUser.isSpeaker ? r.listenersCount : Math.max(0, r.listenersCount - 1),
                            speakersCount: selectedUser.isSpeaker ? Math.max(1, r.speakersCount - 1) : r.speakersCount,
                            participants: r.participants.filter(p => p.id !== selectedUser.id)
                          };
                        }
                        return r;
                      }));
                      triggerRoomNotification(lang === 'ar' ? `طُرد ${selectedUser.name} من الصالون.` : `Removed ${selectedUser.name} from stage.`);
                      setSelectedUser(null);
                    }}
                    className="w-full py-2 rounded-xl bg-red-600/15 border border-red-500/20 hover:bg-red-600 text-[10px] font-black text-red-400 hover:text-white transition-all text-center cursor-pointer mt-1"
                  >
                    {lang === 'ar' ? 'طرد العضو من الصالون ✕' : 'Kick User From Stage ✕'}
                  </button>
                </div>
              )}

              {/* Standard interaction buttons */}
              <div className="w-full flex gap-2.5 mt-2">
                <button
                  onClick={() => {
                    playSynthSound(900, 'sine', 0.1);
                    alert(lang === 'ar' ? `لقد قمت بمتابعة ${selectedUser.name} عبر مجرة Lodavia! ✨` : `Successfully followed ${selectedUser.name}! ✨`);
                  }}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs cursor-pointer"
                >
                  {lang === 'ar' ? 'متابعة' : 'Follow'}
                </button>

                <button
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.08);
                    alert(lang === 'ar' ? `تم فتح موجة تواصل مباشرة لإرسال رسالة لـ ${selectedUser.name}` : `Direct laser connection synced to message ${selectedUser.name}`);
                  }}
                  className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  {lang === 'ar' ? 'رسالة' : 'Message'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 5. INVITE FRIENDS & PING TO STAGE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel rounded-3xl p-6 max-w-sm w-full border border-white/10 shadow-2xl flex flex-col gap-4 animate-[scaleIn_0.25s_ease-out]">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-sm font-extrabold text-white">
                  {lang === 'ar' ? 'دعوة الأصدقاء وصعود المسرح 🔗' : 'Invite Friends & Stage Pings 🔗'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  playSynthSound(440, 'sine', 0.1);
                  setShowInviteModal(false);
                }}
                className="p-1.5 hover:bg-white/5 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              {lang === 'ar' 
                ? 'شارك رابط هذا الصالون الصوتي مع أصدقائك أو ادعُ أعضاء Lodavia المتصلين وصعدهم للمسرح فوراً!'
                : 'Share this stage link with your peers or directly ping active network friends to join the Speaker panels!'}
            </p>

            <div className="flex gap-2 items-center bg-black/40 p-2.5 rounded-xl border border-white/5">
              <input 
                type="text" 
                readOnly 
                value={`https://lodavia.app/voice/room/${activeRoom?.id || 'live'}`}
                className="bg-transparent text-[10px] text-cyan-400 focus:outline-none flex-1 font-mono select-all w-full"
              />
              <button
                type="button"
                onClick={() => {
                  playSynthSound(1000, 'sine', 0.1);
                  navigator.clipboard.writeText(`https://lodavia.app/voice/room/${activeRoom?.id || 'live'}`);
                  triggerRoomNotification(lang === 'ar' ? 'تم نسخ الرابط لمحفظتك 📋' : 'Link copied to clipboard 📋');
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[9px] font-black cursor-pointer transition-all active:scale-95 flex items-center gap-1 shrink-0"
              >
                <Check className="w-3 h-3" />
                <span>{lang === 'ar' ? 'نسخ' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5 mt-1">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">
                {lang === 'ar' ? 'الأصدقاء النشطون بالشبكة 📡' : 'Active Network Friends 📡'}
              </span>

              {[
                { name: 'ياسين الفيفي', nameEn: 'Yasin Al-Fifi', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', status: 'Online' },
                { name: 'لينا حداد', nameEn: 'Lina Haddad', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', status: 'Online' },
                { name: 'طارق الحربي', nameEn: 'Tariq Al-Harbi', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Coding' }
              ].map((f, i) => (
                <div key={i} className="flex justify-between items-center bg-white/5 p-2 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <img src={f.avatar} alt={f.name} className="w-7 h-7 rounded-full object-cover border border-white/10" />
                    <div>
                      <span className="text-[11px] font-black text-slate-200 block">{lang === 'ar' ? f.name : f.nameEn}</span>
                      <span className="text-[8px] text-slate-500 block">{f.status}</span>
                    </div>
                  </div>
                  
                  {/* Ping to stage: adds them to the speakers section directly after a short mock timeout! */}
                  <button
                    type="button"
                    onClick={(e) => {
                      playSynthSound(900, 'sine', 0.08);
                      const btn = e.currentTarget;
                      btn.disabled = true;
                      btn.textContent = lang === 'ar' ? 'بانتظار القبول...' : 'Pinging...';
                      btn.className = "px-2.5 py-1 rounded-lg bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-[9px] font-black";
                      
                      triggerRoomNotification(lang === 'ar' 
                        ? `تم إرسال دعوة صعود المسرح لـ ${f.name}...` 
                        : `Invited ${f.nameEn} to join stage...`
                      );

                      // Mock accepted behavior
                      setTimeout(() => {
                        if (!activeRoom) return;

                        // Create friend participant as a Speaker
                        const newSpeaker: VoiceUser = {
                          id: `p-friend-${Date.now()}`,
                          name: lang === 'ar' ? f.name : f.nameEn,
                          avatar: f.avatar,
                          bio: 'Galactic stage regular. Enjoys deep dives on tech.',
                          bioAr: 'مستكشف دائم في مجرة لودافيا. مهتم بالنقاشات الهندسية المباشرة.',
                          badges: ['🎙️ Speaker', '🪐 Lodavia Active'],
                          badgesAr: ['🎙️ متحدث', '🪐 عضو متميز'],
                          isHost: false,
                          isSpeaker: true,
                          isMuted: false,
                          handRaised: false,
                          isOnline: true,
                          isSpeaking: true // starts speaking instantly!
                        };

                        setRooms(prev => prev.map(r => {
                          if (r.id === activeRoom.id) {
                            const filtered = r.participants.filter(p => p.name !== f.name && p.name !== f.nameEn);
                            return {
                              ...r,
                              speakersCount: r.speakersCount + 1,
                              participants: [newSpeaker, ...filtered]
                            };
                          }
                          return r;
                        }));

                        triggerRoomNotification(lang === 'ar' 
                          ? `قَبِل ${f.name} الدعوة وصعد إلى المسرح! 🎙️` 
                          : `${f.nameEn} accepted stage invitation and is live! 🎙️`
                        );
                        playSynthSound(1046, 'sine', 0.15);
                        setShowInviteModal(false);
                      }, 2000);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-400 text-[9px] font-black transition-all cursor-pointer"
                  >
                    {lang === 'ar' ? 'دعوة للمسرح' : 'Ping Stage'}
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
export { VoiceRoomsSystem };
