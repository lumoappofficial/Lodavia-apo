import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  ArrowLeft, 
  MessageCircle, 
  Mic, 
  Video, 
  Calendar, 
  Trophy, 
  Info, 
  Award, 
  Volume2, 
  MicOff, 
  Flame,
  Plus,
  Trash2,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { AppUser, CommunityItem, VoiceRoom, VideoRoom } from "../types";

// Import custom modular components
import CommunityHome from "./communities/CommunityHome";
import CommunityProfileHeader from "./communities/CommunityProfileHeader";
import CommunityFeed from "./communities/CommunityFeed";
import CommunityChat from "./communities/CommunityChat";
import CommunityEvents from "./communities/CommunityEvents";
import CommunityMembers from "./communities/CommunityMembers";

interface CommunitiesSystemProps {
  currentUser: AppUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<AppUser>>;
  lang: string;
  communities: CommunityItem[];
  setCommunities: React.Dispatch<React.SetStateAction<CommunityItem[]>>;
  activeCommunity: CommunityItem | null;
  setActiveCommunity: (comm: CommunityItem | null) => void;
  playSynthSound: (frequency: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', duration?: number) => void;
  setActiveTab: (tab: any) => void;
}

export default function CommunitiesSystem({
  currentUser,
  setCurrentUser,
  lang,
  communities,
  setCommunities,
  activeCommunity,
  setActiveCommunity,
  playSynthSound,
  setActiveTab
}: CommunitiesSystemProps) {
  // Navigation & Sub-Tab states
  const [activeSubTab, setActiveSubTab] = useState<"posts" | "chat" | "voice" | "video" | "events" | "members" | "leaderboard" | "about">("posts");

  // Create Community Wizard
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [newCommName, setNewCommName] = useState("");
  const [newCommCategory, setNewCommCategory] = useState("برمجة");
  const [newCommDesc, setNewCommDesc] = useState("");
  const [newCommIcon, setNewCommIcon] = useState("🚀");
  const [newCommBanner, setNewCommBanner] = useState("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800");

  // Selected Active voice channel simulation
  const [activeVoiceSession, setActiveVoiceSession] = useState<VoiceRoom | null>(null);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [userIsSpeaking, setUserIsSpeaking] = useState(false);

  // Administrative Playgrounds - Simulates moderator view for testing!
  const [simulateAdmin, setSimulateAdmin] = useState(true);

  // AI Integration states inside Community (Sidebar)
  const [aiAnalysisType, setAiAnalysisType] = useState<"summary" | "recs" | "trends" | null>(null);
  const [aiResultText, setAiResultText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // State maps for dynamic interactive updates
  const [communityCustomData, setCommunityCustomData] = useState<{ [commId: string]: any }>({});

  useEffect(() => {
    if (activeCommunity) {
      setActiveSubTab("posts");
      setActiveVoiceSession(null);
      setAiResultText("");
      setAiAnalysisType(null);
    }
  }, [activeCommunity]);

  // Lazy initialize community-specific events, members, voice rooms, leaderboard
  const getCommunityMockData = (commId: string) => {
    const isAr = lang === "ar";
    return {
      members: [
        { name: isAr ? "د. نورة السديري" : "Dr. Nora Sudairi", level: 42, badge: isAr ? "عضو ذهبي 🌟" : "Gold Member 🌟", online: true, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100", role: "owner", followed: false },
        { name: isAr ? "المهندس بندر القحطاني" : "Eng. Bandar Qahtani", level: 35, badge: isAr ? "عبقري الكود 💻" : "Code Genius 💻", online: true, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "admin", followed: true },
        { name: isAr ? "ياسر العتيبي" : "Yasser Otaibi", level: 29, badge: isAr ? "المشرف الكوني 👑" : "Cosmic Mod 👑", online: false, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "moderator", followed: false },
        { name: isAr ? "هناء المالكي" : "Hana Maliki", level: 18, badge: isAr ? "مستكشف مبتدئ 🚀" : "Star Explorer 🚀", online: true, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "member", followed: false }
      ],
      events: [
        { id: "ev_1", title: isAr ? "هاكاثون لودافيا البرمجي السنوي 💻🚀" : "Lodavia Software Hackathon 💻🚀", date: isAr ? "١٥ يوليو ٢٠٢٦" : "July 15, 2026", time: "09:00 PM", attendees: 480, rsvp: false, banner: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800" },
        { id: "ev_2", title: isAr ? "ندوة نقاش حول نماذج Gemini التوليدية 🌌" : "Gemini Generative Models Panel 🌌", date: isAr ? "٢٢ يوليو ٢٠٢٦" : "July 22, 2026", time: "07:30 PM", attendees: 120, rsvp: true, banner: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800" }
      ],
      leaderboard: [
        { name: isAr ? "سارة المهندس" : "Sarah Engineer", points: 4890, rank: 1, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
        { name: isAr ? "د. نورة السديري" : "Dr. Nora Sudairi", points: 3420, rank: 2, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100" },
        { name: isAr ? "خالد المطيري" : "Khalid Mutairi", points: 2890, rank: 3, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
        { name: isAr ? "المهندس بندر القحطاني" : "Eng. Bandar Qahtani", points: 1950, rank: 4, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" }
      ],
      about: {
        rules: isAr 
          ? [
              "احترام ميثاق الشرف الكوني والتعامل الراقي مع زملائك.",
              "ممنوع الترويج لروابط خارجية غير مفيدة أو تكرار المنشورات.",
              "تبادل الأفكار البرمجية وصناعة الابتكارات هي الأولوية القصوى."
            ]
          : [
              "Respect the Cosmic Code and support fellow explorers.",
              "No promotional spam or irrelevant content flooding.",
              "Exchanging innovative ideas and coding is our peak focus."
            ],
        history: isAr 
          ? "تأسس هذا المجتمع الرقمي الكوني لتمكين المبدعين والرواد في بناء مستقبل التقنيات الحديثة."
          : "This digital cosmic space was founded to empower developers in building state-of-the-art software systems."
      }
    };
  };

  const getActiveCustomData = () => {
    if (!activeCommunity) return null;
    if (!communityCustomData[activeCommunity.id]) {
      const defaultMock = getCommunityMockData(activeCommunity.id);
      setCommunityCustomData(prev => ({
        ...prev,
        [activeCommunity.id]: defaultMock
      }));
      return defaultMock;
    }
    return communityCustomData[activeCommunity.id];
  };

  // Join/Leave Community
  const handleToggleJoin = (commId: string) => {
    const isJoined = currentUser.joinedCommunities.includes(commId);
    let updatedJoined;
    
    if (isJoined) {
      updatedJoined = currentUser.joinedCommunities.filter(id => id !== commId);
      playSynthSound(450, "sine", 0.12);
    } else {
      updatedJoined = [...currentUser.joinedCommunities, commId];
      playSynthSound(900, "sine", 0.15);
    }

    setCommunities(prev => prev.map(c => {
      if (c.id === commId) {
        return {
          ...c,
          membersCount: isJoined ? c.membersCount - 1 : c.membersCount + 1
        };
      }
      return c;
    }));

    setCurrentUser(prev => ({
      ...prev,
      joinedCommunities: updatedJoined
    }));

    if (activeCommunity && activeCommunity.id === commId) {
      setActiveCommunity({
        ...activeCommunity,
        membersCount: isJoined ? activeCommunity.membersCount - 1 : activeCommunity.membersCount + 1
      });
    }
  };

  // Create Community Submit
  const handleCreateCommunitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommName.trim() || !newCommDesc.trim()) return;

    const newId = `comm_${Date.now()}`;
    const newSlug = newCommName.toLowerCase().replace(/\s+/g, "-");

    const newCommunity: CommunityItem = {
      id: newId,
      name: `${newCommIcon} ${newCommName}`,
      slug: newSlug,
      description: newCommDesc,
      icon: newCommIcon,
      banner: newCommBanner,
      category: newCommCategory,
      membersCount: 1,
      posts: [],
      activeVoiceRooms: [
        {
          id: `voice_${Date.now()}`,
          title: lang === "ar" ? "غرفة نقاش افتتاحية 🚀✨" : "Opening Lounge Chat 🚀✨",
          hostName: currentUser.name,
          hostAvatar: currentUser.avatar,
          listenersCount: 1,
          speakersCount: 1,
          tags: ["Intro", "Community", "Lodavia"]
        }
      ],
      activeVideoRooms: [],
      activeStreams: [],
      courses: [],
      admins: [{ name: currentUser.name, avatar: currentUser.avatar }]
    };

    setCommunities(prev => [newCommunity, ...prev]);
    setCurrentUser(prev => ({
      ...prev,
      joinedCommunities: [...prev.joinedCommunities, newId]
    }));

    playSynthSound(523.25, "sine", 0.1);
    setTimeout(() => playSynthSound(659.25, "sine", 0.1), 80);
    setTimeout(() => playSynthSound(783.99, "sine", 0.1), 160);
    setTimeout(() => playSynthSound(1046.5, "sine", 0.3), 240);

    setShowCreateWizard(false);
    setActiveCommunity(newCommunity);

    // Reset wizard values
    setNewCommName("");
    setNewCommDesc("");
    setNewCommIcon("🚀");
  };

  // Live Audio speaking simulation
  useEffect(() => {
    let speakInterval: any;
    if (activeVoiceSession) {
      speakInterval = setInterval(() => {
        setUserIsSpeaking(prev => !prev);
        if (!voiceMuted && Math.random() > 0.4) {
          playSynthSound(220 + Math.random() * 200, "sine", 0.04);
        }
      }, 1500);
    } else {
      setUserIsSpeaking(false);
    }
    return () => clearInterval(speakInterval);
  }, [activeVoiceSession, voiceMuted]);

  const handleJoinVoiceRoom = (room: VoiceRoom) => {
    playSynthSound(600, "sine", 0.1);
    setTimeout(() => playSynthSound(900, "sine", 0.2), 100);
    setActiveVoiceSession(room);
    setVoiceMuted(false);
  };

  // AI Workspace triggers
  const triggerAIAnalysis = async (type: "summary" | "recs" | "trends") => {
    if (!activeCommunity) return;
    setAiAnalysisType(type);
    setAiLoading(true);
    setAiResultText("");
    playSynthSound(600, "triangle", 0.25);

    try {
      if (type === "summary") {
        const texts = activeCommunity.posts.map(p => p.content).join("\n");
        const response = await fetch("/api/ai/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: texts || "No discussions are currently active in this cosmic channel.",
            lang
          })
        });
        const data = await response.json();
        setAiResultText(data.text || "Summary compiled.");
      } else if (type === "recs") {
        const prompt = lang === "ar"
          ? `اقترح ٣ أعضاء للمستكشف ${currentUser.name} للتواصل معهم في هذا المجتمع (${activeCommunity.name}) بناءً على اهتماماته المشتركة: ${JSON.stringify(currentUser.interests)}. اكتب التوصيات بنبرة كونية ملهمة ومختصرة.`
          : `Suggest 3 mock active members in community "${activeCommunity.name}" for ${currentUser.name} to follow based on shared interests: ${JSON.stringify(currentUser.interests)}. Keep it concise and styled in an inspiring celestial format.`;
        
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: prompt, lang, context: { user: currentUser } })
        });
        const data = await response.json();
        setAiResultText(data.text || "Recommendations loaded.");
      } else {
        const prompt = lang === "ar"
          ? `اقترح ٣ موضوعات نقاش ساخنة ومبتكرة (Trending Topics) يمكن طرحها في مجتمع "${activeCommunity.name}" لإثارة التفاعل والتعلم المستمر، مع استخدام رموز تعبيرية كونية.`
          : `Suggest 3 futuristic and highly engaging trending discussions topics for the community "${activeCommunity.name}" to trigger high engagement, adding beautiful space emojis.`;
        
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: prompt, lang, context: { user: currentUser } })
        });
        const data = await response.json();
        setAiResultText(data.text || "Trending predictions generated.");
      }
      playSynthSound(1100, "sine", 0.2);
    } catch (err) {
      setAiResultText(
        lang === "ar"
          ? "تتميز نقاشات هذا المجتمع بالأجواء الكونية والتحول الرقمي. يفضل مناقشة التفاعل العصبي ومستقبل الويب ٣."
          : "Trending tracks inside this galaxy focus heavily on cognitive computing, modular system design, and spatial UI/UX paradigms."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const customData = getActiveCustomData();

  return (
    <div className="w-full relative min-h-screen pb-12">
      
      {/* 1. COMMUNITY HUB / EXPLORE GRID */}
      {!activeCommunity ? (
        <CommunityHome
          currentUser={currentUser}
          lang={lang}
          communities={communities}
          setCommunities={setCommunities}
          setActiveCommunity={setActiveCommunity}
          playSynthSound={playSynthSound}
          setShowCreateWizard={setShowCreateWizard}
        />
      ) : (
        
        // 2. DETAILED COMMUNITY VIEW PAGE
        <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 md:px-0 animate-[fadeIn_0.3s_ease-out]">
          
          {/* Back button */}
          <button 
            onClick={() => {
              playSynthSound(440, "sine", 0.1);
              setActiveCommunity(null);
            }}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white self-start transition-colors cursor-pointer"
          >
            <ArrowLeft className={`w-4 h-4 ${lang === "ar" ? "rotate-180" : ""}`} />
            <span>{lang === "ar" ? "العودة لرئيسية المجتمعات الكونية" : "Back to Communities Hub"}</span>
          </button>

          {/* SIMULATED ROLE MANAGEMENT TOGGLER */}
          <div className="glass-panel p-3.5 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-yellow-400 shrink-0" />
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-200 block">{lang === "ar" ? "صندوق تحكم الصلاحيات المحاكي 🛡️" : "Simulated Permission Console 🛡️"}</span>
                <span className="text-[8px] text-slate-400 block">{lang === "ar" ? "اضغط لتبديل صلاحياتك واختبار أنظمة المراقبة (حذف، كتم، حظر، وتثبيت المنشورات)" : "Toggle your simulation role to easily audit and test moderation tools"}</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                playSynthSound(900, "sine", 0.08);
                setSimulateAdmin(!simulateAdmin);
              }}
              className={`py-1.5 px-3 rounded-xl text-[9px] font-black transition-all cursor-pointer uppercase ${
                simulateAdmin 
                  ? "bg-yellow-500 text-slate-950 font-black shadow-lg" 
                  : "bg-white/5 border border-white/10 text-slate-400"
              }`}
            >
              {simulateAdmin ? (lang === "ar" ? "وضع المشرف: نشط ⚙️" : "Mod Mode: ACTIVE ⚙️") : (lang === "ar" ? "وضع عضو عادي" : "Regular Pilot")}
            </button>
          </div>

          {/* Profile header card */}
          <CommunityProfileHeader
            currentUser={currentUser}
            lang={lang}
            activeCommunity={activeCommunity}
            handleToggleJoin={handleToggleJoin}
            playSynthSound={playSynthSound}
          />

          {/* SUB-TAB NAV BAR */}
          <div className="flex border-b border-white/5 overflow-x-auto gap-2 pb-1.5 scrollbar-none">
            {[
              { id: "posts", icon: <MessageCircle className="w-4 h-4" />, labelAr: "الخلاصة والآراء", labelEn: "Cosmic Feed" },
              { id: "chat", icon: <span className="text-xs">💬</span>, labelAr: "المحادثة الفورية", labelEn: "Live Chat" },
              { id: "voice", icon: <Mic className="w-4 h-4 animate-pulse" />, labelAr: "غرف نقاش صوتية", labelEn: "Voice Salons" },
              { id: "video", icon: <Video className="w-4 h-4" />, labelAr: "غرف مرئية", labelEn: "Video Rooms" },
              { id: "events", icon: <Calendar className="w-4 h-4" />, labelAr: "الفعاليات", labelEn: "Calendar Events" },
              { id: "members", icon: <Users className="w-4 h-4" />, labelAr: "الأعضاء والمراقبة", labelEn: "Member Board" },
              { id: "leaderboard", icon: <Trophy className="w-4 h-4" />, labelAr: "لوحة المتصدرين", labelEn: "Honor Roll" },
              { id: "about", icon: <Info className="w-4 h-4" />, labelAr: "حول التفاصيل", labelEn: "Backstory Details" }
            ].map((subTab) => (
              <button
                key={subTab.id}
                onClick={() => {
                  playSynthSound(500, "sine", 0.05);
                  setActiveSubTab(subTab.id as any);
                }}
                className={`py-3 px-4 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeSubTab === subTab.id
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {subTab.icon}
                <span>{lang === "ar" ? subTab.labelAr : subTab.labelEn}</span>
              </button>
            ))}
          </div>

          {/* TWO COLUMN GRID LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Column (Core tab switcher screens) */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              
              {activeSubTab === "posts" && (
                <CommunityFeed
                  currentUser={currentUser}
                  lang={lang}
                  activeCommunity={activeCommunity}
                  setCommunities={setCommunities}
                  setActiveCommunity={setActiveCommunity}
                  playSynthSound={playSynthSound}
                  simulateAdmin={simulateAdmin}
                />
              )}

              {activeSubTab === "chat" && (
                <CommunityChat
                  currentUser={currentUser}
                  lang={lang}
                  activeCommunity={activeCommunity}
                  playSynthSound={playSynthSound}
                />
              )}

              {activeSubTab === "voice" && (
                <div className="flex flex-col gap-4 animate-[fadeIn_0.3s_ease-out]">
                  
                  {activeVoiceSession && (
                    <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-tr from-slate-950 via-cyan-950/20 to-slate-950/90 flex flex-col gap-6 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 flex justify-center items-center pointer-events-none">
                        <div className="w-80 h-80 rounded-full border-4 border-cyan-400 animate-ping" />
                        <div className="w-48 h-48 rounded-full border-2 border-cyan-400 animate-pulse absolute" />
                      </div>

                      <div className="flex justify-between items-start relative z-10">
                        <div>
                          <span className="text-[8px] bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 px-2 py-0.5 rounded-full font-black tracking-widest uppercase">
                            LIVE VOICE 🎙️
                          </span>
                          <h3 className="text-sm font-black text-white mt-1.5">{activeVoiceSession.title}</h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">{lang === "ar" ? "أنت متصل الآن بغرفة الصوت ثلاثية الأبعاد الكونية" : "You are currently synced to the Spatial 3D Audio space"}</p>
                        </div>
                        
                        <button
                          onClick={() => {
                            playSynthSound(300, "sawtooth", 0.15);
                            setActiveVoiceSession(null);
                          }}
                          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black transition-all active:scale-95 cursor-pointer"
                        >
                          🚪 {lang === "ar" ? "قطع الاتصال" : "Disconnect"}
                        </button>
                      </div>

                      <div className="py-8 flex justify-center gap-6 flex-wrap items-center relative z-10">
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative">
                            <div className="absolute inset-0 bg-cyan-400/40 rounded-full animate-ping" />
                            <img src={activeVoiceSession.hostAvatar} alt="host" className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400 relative z-10" />
                            <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 p-1 rounded-full text-[8px] font-black z-20">👑</div>
                          </div>
                          <span className="text-[10px] font-black text-white">{activeVoiceSession.hostName}</span>
                          <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">{lang === "ar" ? "مضيف" : "Host"}</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          <div className="relative">
                            {userIsSpeaking && !voiceMuted && (
                              <div className="absolute inset-0 bg-purple-500/50 rounded-full animate-ping" />
                            )}
                            <img src={currentUser.avatar} alt="me" className={`w-14 h-14 rounded-full object-cover relative z-10 border-2 ${voiceMuted ? "border-red-500" : "border-purple-500"}`} />
                            {voiceMuted && (
                              <div className="absolute -bottom-1 -right-1 bg-red-600 text-white p-1 rounded-full text-[8px] z-20">🔇</div>
                            )}
                          </div>
                          <span className="text-[10px] font-black text-white">{currentUser.name.split(" ")[0]} ({lang === "ar" ? "أنت" : "You"})</span>
                          <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">
                            {voiceMuted ? (lang === "ar" ? "مكتوم" : "Muted") : (userIsSpeaking ? (lang === "ar" ? "يتحدث..." : "Speaking...") : (lang === "ar" ? "مستمع" : "Listener"))}
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-black text-slate-400">
                              +{activeVoiceSession.listenersCount}
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-slate-400">{lang === "ar" ? "مستمع آخر" : "Others"}</span>
                          <span className="text-[8px] text-slate-600 font-bold uppercase tracking-wider">Spatial 3D</span>
                        </div>
                      </div>

                      <div className="flex justify-center gap-3 bg-black/40 p-3 rounded-2xl relative z-10 border border-white/5">
                        <button
                          onClick={() => {
                            playSynthSound(voiceMuted ? 800 : 350, "sine", 0.08);
                            setVoiceMuted(!voiceMuted);
                          }}
                          className={`p-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer text-xs font-bold ${
                            voiceMuted ? "bg-red-500 text-white" : "bg-white/5 text-slate-300 hover:text-white"
                          }`}
                        >
                          <MicOff className="w-4 h-4" />
                          <span>{voiceMuted ? (lang === "ar" ? "تشغيل المايك" : "Unmute") : (lang === "ar" ? "كتم المايك" : "Mute")}</span>
                        </button>

                        <button
                          onClick={() => playSynthSound(440, "sine", 0.1)}
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer text-xs font-bold flex items-center gap-1.5"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>{lang === "ar" ? "تحكم الصوت" : "3D Spatial Audio"}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{lang === "ar" ? "الصالونات الصوتية الكوكبية النشطة:" : "Active Planet Audio Salons:"}</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeCommunity.activeVoiceRooms.map((room) => (
                      <div key={room.id} className="glass-panel p-4 rounded-3xl border border-white/5 hover:border-purple-500/20 transition-all flex flex-col justify-between gap-4 group bg-slate-900/30">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-black tracking-widest uppercase flex items-center gap-1">
                              <span className="w-1 h-1 bg-purple-500 rounded-full animate-ping" />
                              VOICE LIVE
                            </span>
                            <h4 className="text-xs font-black text-white mt-2 group-hover:text-purple-300 transition-colors leading-snug">{room.title}</h4>
                          </div>
                          
                          <span className="text-[9px] bg-white/5 text-slate-400 px-2 py-1 rounded-md font-bold flex items-center gap-1 shrink-0">
                            <Users className="w-3 h-3 text-cyan-400" />
                            {room.listenersCount}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-white/5">
                          <div className="flex items-center gap-2.5">
                            <img src={room.hostAvatar} alt="host" className="w-7 h-7 rounded-full object-cover border border-white/10" />
                            <div>
                              <span className="text-[10px] font-black text-slate-200 block leading-tight">{room.hostName}</span>
                              <span className="text-[8px] text-slate-500 block">{lang === "ar" ? "المضيف" : "Room host"}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleJoinVoiceRoom(room)}
                            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-[10px] font-black transition-all active:scale-95 cursor-pointer shadow-md"
                          >
                            {lang === "ar" ? "دخول واستماع 🎧" : "Tune in 🎧"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSubTab === "video" && (
                <div className="flex flex-col gap-4 animate-[fadeIn_0.3s_ease-out]">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{lang === "ar" ? "اللقاءات المرئية وبثوث الأعضاء:" : "Live Video Broadcasts & Screens:"}</span>
                  {activeCommunity.activeVideoRooms.length === 0 ? (
                    <div className="glass-panel p-10 rounded-3xl text-center text-slate-500 border border-white/5 bg-slate-950/20 text-xs font-bold">
                      📺 {lang === "ar" ? "لا توجد غرف فيديو نشطة حالياً. يمكنك تفعيل كاميرتك!" : "No active video spaces currently. Start a conference room!"}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeCommunity.activeVideoRooms.map((video) => (
                        <div key={video.id} className="glass-panel p-4 rounded-3xl border border-white/5 hover:border-blue-500/20 transition-all flex flex-col justify-between gap-4 bg-slate-900/30">
                          <div>
                            <span className="text-[8px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-black tracking-widest uppercase">
                              3D VIDEO SPACE
                            </span>
                            <h4 className="text-xs font-black text-white mt-2 leading-snug">{video.title}</h4>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-white/5">
                            <div className="flex items-center gap-2">
                              <img src={video.hostAvatar} alt="host" className="w-7 h-7 rounded-full object-cover border border-white/10" />
                              <span className="text-[10px] font-black text-slate-200">{video.hostName}</span>
                            </div>

                            <button
                              onClick={() => {
                                playSynthSound(800, "sine", 0.15);
                                alert(lang === "ar" ? "جاري محاكاة الاتصال المرئي وتجهيز الكاميرا الكونية..." : "Simulating video room stream connection setup...");
                              }}
                              className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-[10px] font-black cursor-pointer"
                            >
                              📹 {lang === "ar" ? "انضمام للفيديو" : "Join Video"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeSubTab === "events" && (
                <CommunityEvents
                  currentUser={currentUser}
                  lang={lang}
                  activeCommunity={activeCommunity}
                  customData={customData}
                  setCommunityCustomData={setCommunityCustomData}
                  playSynthSound={playSynthSound}
                  simulateAdmin={simulateAdmin}
                />
              )}

              {activeSubTab === "members" && (
                <CommunityMembers
                  currentUser={currentUser}
                  lang={lang}
                  activeCommunity={activeCommunity}
                  customData={customData}
                  setCommunityCustomData={setCommunityCustomData}
                  playSynthSound={playSynthSound}
                  simulateAdmin={simulateAdmin}
                />
              )}

              {activeSubTab === "leaderboard" && (
                <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
                  <div className="text-center">
                    <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest flex items-center justify-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                      {lang === "ar" ? "قائمة الشرف الكونية الأسبوعية" : "Weekly Celestial Honor Roll"}
                    </span>
                    <h3 className="text-xs text-slate-400 mt-1">{lang === "ar" ? "المتصدرون الأكثر تفاعلاً ونشاطاً وإجابةً على التساؤلات" : "Top contributors ranked by weekly cosmic activity & point milestones"}</h3>
                  </div>

                  <div className="flex justify-center items-end gap-3 pt-6 pb-2">
                    {/* 2nd Place */}
                    {customData?.leaderboard[1] && (
                      <div className="flex flex-col items-center gap-2 w-24">
                        <img src={customData.leaderboard[1].avatar} alt="2nd" className="w-12 h-12 rounded-full object-cover border-2 border-slate-300 shadow-md" />
                        <span className="text-[10px] font-black text-slate-300 truncate w-full text-center">{customData.leaderboard[1].name.split(" ")[0]}</span>
                        <div className="h-16 w-full bg-slate-300/10 rounded-t-2xl border border-white/5 flex flex-col items-center justify-center">
                          <span className="text-sm font-black text-slate-300">#2</span>
                          <span className="text-[8px] font-bold text-slate-400">{customData.leaderboard[1].points} pts</span>
                        </div>
                      </div>
                    )}

                    {/* 1st Place */}
                    {customData?.leaderboard[0] && (
                      <div className="flex flex-col items-center gap-2 w-28 -mt-6">
                        <div className="relative">
                          <Award className="w-5 h-5 text-yellow-400 absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce" />
                          <img src={customData.leaderboard[0].avatar} alt="1st" className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400 shadow-lg shadow-yellow-500/10" />
                        </div>
                        <span className="text-xs font-black text-yellow-400 truncate w-full text-center">{customData.leaderboard[0].name.split(" ")[0]}</span>
                        <div className="h-24 w-full bg-yellow-400/10 rounded-t-2xl border border-yellow-500/20 flex flex-col items-center justify-center">
                          <span className="text-base font-black text-yellow-400">#1</span>
                          <span className="text-[9px] font-bold text-yellow-300">{customData.leaderboard[0].points} pts</span>
                        </div>
                      </div>
                    )}

                    {/* 3rd Place */}
                    {customData?.leaderboard[2] && (
                      <div className="flex flex-col items-center gap-2 w-24">
                        <img src={customData.leaderboard[2].avatar} alt="3rd" className="w-12 h-12 rounded-full object-cover border-2 border-amber-600 shadow-md" />
                        <span className="text-[10px] font-black text-slate-300 truncate w-full text-center">{customData.leaderboard[2].name.split(" ")[0]}</span>
                        <div className="h-12 w-full bg-amber-600/10 rounded-t-2xl border border-white/5 flex flex-col items-center justify-center">
                          <span className="text-sm font-black text-amber-600">#3</span>
                          <span className="text-[8px] font-bold text-amber-500">{customData.leaderboard[2].points} pts</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mt-2">
                    {customData?.leaderboard.slice(3).map((item: any) => (
                      <div key={item.name} className="bg-white/5 p-3 rounded-2xl flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-500 w-4">{item.rank || 4}</span>
                          <img src={item.avatar} alt="rank" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                          <span className="text-xs font-black text-slate-200">{item.name}</span>
                        </div>
                        <span className="text-xs font-bold text-purple-400">{item.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSubTab === "about" && (
                <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-slate-900/30 flex flex-col gap-4 animate-[fadeIn_0.3s_ease-out]">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">{lang === "ar" ? "تاريخ المجتمع:" : "Hub Backstory:"}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">{customData?.about.history}</p>
                  </div>

                  <div className="border-t border-white/5 pt-4 mt-1">
                    <h4 className="text-xs font-black text-purple-400 uppercase tracking-wider">{lang === "ar" ? "مشرفو الفضاء كوكبيًا 👑:" : "Cosmic Space Admins 👑:"}</h4>
                    <div className="flex flex-wrap gap-4 mt-3">
                      {activeCommunity.admins.map((adm) => (
                        <div key={adm.name} className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-white/5">
                          <img src={adm.avatar} alt="adm" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                          <span className="text-xs font-black text-slate-200">{adm.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 mt-1">
                    <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider">{lang === "ar" ? "قوانين المجتمع والميثاق:" : "Celestial Charter & Rules:"}</h4>
                    <ul className="space-y-2 mt-3 text-xs text-slate-300">
                      {customData?.about.rules.map((rule: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="p-1 rounded bg-cyan-500/10 text-cyan-400 font-bold text-[10px] shrink-0 mt-0.5">{idx + 1}</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column (Deep interactive AI and telemetry) */}
            <div className="flex flex-col gap-4">
              
              <div className="glass-panel p-5 rounded-3xl border border-purple-500/20 bg-gradient-to-b from-purple-950/20 via-slate-950/90 to-slate-950/80 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl text-white shadow-md">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white tracking-widest flex items-center gap-1">
                      <span>Lodavia AI Workspace</span>
                      <span className="text-[8px] bg-cyan-500/10 text-cyan-300 py-0.5 px-1.5 rounded-full border border-cyan-500/20 font-bold uppercase">Ready</span>
                    </h4>
                    <p className="text-[9px] text-slate-400">{lang === "ar" ? "تكامل الذكاء الاصطناعي في مجتمعك" : "AI engines connected to this community"}</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {lang === "ar" 
                    ? "اختر من العمليات الفلكية الذكية أدناه لتلخيص الفيد أو الحصول على اقتراحات زملاء وتخمين موضوعات المناقشة الساخنة!" 
                    : "Invoke the Lodavia neural processor below to summarize recent community posts, predict hot trends, or matching affinity with members!"}
                </p>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => triggerAIAnalysis("summary")}
                    disabled={aiLoading}
                    className={`w-full py-2.5 rounded-xl border font-black text-[10px] text-start px-3 transition-all flex items-center justify-between cursor-pointer ${
                      aiAnalysisType === "summary"
                        ? "bg-purple-600/20 border-purple-500 text-white"
                        : "bg-black/30 border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>📝 {lang === "ar" ? "تلخيص منشورات المجتمع" : "Summarize Feed Posts"}</span>
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  </button>

                  <button
                    onClick={() => triggerAIAnalysis("recs")}
                    disabled={aiLoading}
                    className={`w-full py-2.5 rounded-xl border font-black text-[10px] text-start px-3 transition-all flex items-center justify-between cursor-pointer ${
                      aiAnalysisType === "recs"
                        ? "bg-purple-600/20 border-purple-500 text-white"
                        : "bg-black/30 border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>🤝 {lang === "ar" ? "توصية زملاء (اهتمامات)" : "Affinity Friend Matching"}</span>
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                  </button>

                  <button
                    onClick={() => triggerAIAnalysis("trends")}
                    disabled={aiLoading}
                    className={`w-full py-2.5 rounded-xl border font-black text-[10px] text-start px-3 transition-all flex items-center justify-between cursor-pointer ${
                      aiAnalysisType === "trends"
                        ? "bg-purple-600/20 border-purple-500 text-white"
                        : "bg-black/30 border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>🔥 {lang === "ar" ? "اقتراح موضوعات نقاش ساخنة" : "Predict Trending Discussions"}</span>
                    <Flame className="w-3.5 h-3.5 text-yellow-500" />
                  </button>
                </div>

                {aiAnalysisType && (
                  <div className="mt-4 p-4 bg-black/60 rounded-2xl border border-purple-500/20 space-y-3 animate-[fadeIn_0.3s_ease-out]">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] uppercase tracking-widest font-black text-purple-400">
                        {aiAnalysisType === "summary" ? (lang === "ar" ? "ملخص الفيد الكوني" : "Cosmic Feed Summary") :
                         aiAnalysisType === "recs" ? (lang === "ar" ? "اقتراحات زملاء مخصصة" : "Personalized Piloting matches") :
                         (lang === "ar" ? "موضوعات نقاش مقترحة" : "Suggested Trending Topics")}
                      </span>
                      {aiLoading && (
                        <div className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin shrink-0" />
                      )}
                    </div>

                    <div className="text-[11px] text-slate-200 leading-relaxed font-sans whitespace-pre-line bg-white/5 p-3 rounded-xl border border-white/5 max-h-56 overflow-y-auto">
                      {aiResultText}
                    </div>
                  </div>
                )}
              </div>

              <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-slate-950/40 text-xs text-slate-400 space-y-3">
                <h4 className="text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>{lang === "ar" ? "تفاصيل إضافية للرابط" : "Channel Telemetry"}</span>
                </h4>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between">
                    <span>{lang === "ar" ? "حالة الخادم الكوني:" : "Server Core Ingress:"}</span>
                    <span className="text-emerald-400 font-bold">ONLINE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === "ar" ? "تأخير استجابة الصوت ثلاثية الأبعاد:" : "Spatial Voice Latency:"}</span>
                    <span className="text-cyan-400 font-bold">12 ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === "ar" ? "تأمين التشفير:" : "Quantum Encryption:"}</span>
                    <span className="text-slate-200 font-bold">SHA-512 SECURE</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 3. CREATE COMMUNITY WIZARD DIALOG */}
      <AnimatePresence>
        {showCreateWizard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-gradient-to-b from-slate-950 via-purple-950/80 to-slate-950 border border-purple-500/20 rounded-3xl p-6 w-full max-w-lg shadow-[0_0_30px_rgba(168,85,247,0.3)] text-right relative"
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-black text-white">{lang === "ar" ? "تأسيس مجتمع كوكبي جديد" : "Establish New Cosmic Space"}</h3>
                </div>
                <button
                  onClick={() => { playSynthSound(400, "sine", 0.08); setShowCreateWizard(false); }}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCommunitySubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-300 block">{lang === "ar" ? "اسم المجتمع الكوني:" : "Community Name:"}</label>
                  <input
                    type="text"
                    required
                    value={newCommName}
                    onChange={(e) => setNewCommName(e.target.value)}
                    placeholder={lang === "ar" ? "مثال: واجهة الفن الكوني أو هندسة Rust..." : "e.g. Quantum Rust Architecture..."}
                    className="w-full py-2.5 px-4 rounded-xl bg-black/40 text-xs text-white border border-white/5 focus:border-purple-500/40 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-300 block">{lang === "ar" ? "التصنيف:" : "Category:"}</label>
                    <select
                      value={newCommCategory}
                      onChange={(e) => setNewCommCategory(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 text-xs text-white border border-white/10 focus:outline-none"
                    >
                      <option value="برمجة">💻 {lang === "ar" ? "برمجة" : "Coding"}</option>
                      <option value="ذكاء اصطناعي">🤖 {lang === "ar" ? "ذكاء اصطناعي" : "AI"}</option>
                      <option value="ألعاب">🎮 {lang === "ar" ? "ألعاب" : "Gaming"}</option>
                      <option value="كرة القدم">⚽ {lang === "ar" ? "كرة القدم" : "Football"}</option>
                      <option value="تصوير">📷 {lang === "ar" ? "تصوير" : "Photography"}</option>
                      <option value="موسيقى">🎵 {lang === "ar" ? "موسيقى" : "Music"}</option>
                      <option value="سفر">🌍 {lang === "ar" ? "سفر" : "Travel"}</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-300 block">{lang === "ar" ? "رمز تعبيري (أيقونة):" : "Emoji Icon:"}</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={newCommIcon}
                      onChange={(e) => setNewCommIcon(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-black/40 text-xs text-white border border-white/5 text-center focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-300 block">{lang === "ar" ? "وصف ميثاق المجتمع:" : "Community Description:"}</label>
                  <textarea
                    required
                    value={newCommDesc}
                    onChange={(e) => setNewCommDesc(e.target.value)}
                    placeholder={lang === "ar" ? "اكتب نبذة شيقة لجذب الأعضاء والمهتمين..." : "Introduce your cosmic space to attract voyagers..."}
                    className="w-full h-20 p-3 rounded-xl bg-black/40 text-xs text-white border border-white/5 focus:border-purple-500/40 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-300 block">{lang === "ar" ? "اختر لافتة الغلاف الكونية:" : "Choose Cover Banner:"}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: "Nebula", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400" },
                      { name: "Cyberpunk", url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400" },
                      { name: "Constellation", url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400" }
                    ].map((ban) => (
                      <button
                        key={ban.name}
                        type="button"
                        onClick={() => { playSynthSound(600, "sine", 0.05); setNewCommBanner(ban.url); }}
                        className={`relative rounded-xl overflow-hidden aspect-[2/1] border transition-all cursor-pointer ${
                          newCommBanner === ban.url ? "border-cyan-400 ring-2 ring-cyan-400/20 scale-95" : "border-white/5"
                        }`}
                      >
                        <img src={ban.url} alt={ban.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-2 text-[8px] bg-black/80 px-1 py-0.2 rounded text-white">{ban.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { playSynthSound(400, "sine", 0.08); setShowCreateWizard(false); }}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 font-black text-xs cursor-pointer"
                  >
                    {lang === "ar" ? "إلغاء التأسيس" : "Cancel"}
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-slate-950 font-black text-xs hover:scale-[1.01] transition-all cursor-pointer shadow-lg shadow-purple-500/10"
                  >
                    ✨ {lang === "ar" ? "أطلق كوكبك الآن" : "Launch Space"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
