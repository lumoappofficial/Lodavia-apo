import React from "react";
import { Users, Shield, Award, Ban, VolumeX, Check, AlertTriangle, Crown, Star } from "lucide-react";
import { AppUser, CommunityItem } from "../../types";

interface MemberItem {
  name: string;
  level: number;
  badge: string;
  online: boolean;
  avatar: string;
  role?: "owner" | "admin" | "moderator" | "member";
  isMuted?: boolean;
  isBanned?: boolean;
}

interface CommunityMembersProps {
  currentUser: AppUser;
  lang: string;
  activeCommunity: CommunityItem;
  customData: any;
  setCommunityCustomData: React.Dispatch<React.SetStateAction<{ [commId: string]: any }>>;
  playSynthSound: (frequency: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', duration?: number) => void;
  simulateAdmin: boolean;
}

export default function CommunityMembers({
  currentUser,
  lang,
  activeCommunity,
  customData,
  setCommunityCustomData,
  playSynthSound,
  simulateAdmin
}: CommunityMembersProps) {
  
  // Safeguard loading members. Assign default roles if they don't exist
  const members: MemberItem[] = (customData?.members || []).map((m: MemberItem, idx: number) => {
    if (m.role) return m;
    // Map initial static mock roles
    let assignedRole: "owner" | "admin" | "moderator" | "member" = "member";
    if (idx === 0) assignedRole = "owner";
    else if (idx === 1) assignedRole = "admin";
    else if (idx === 2) assignedRole = "moderator";
    return { ...m, role: assignedRole, isMuted: false, isBanned: false };
  });

  const handleUpdateMember = (memberName: string, updates: Partial<MemberItem>) => {
    const updatedMembers = members.map(m => {
      if (m.name === memberName) {
        return { ...m, ...updates };
      }
      return m;
    });

    setCommunityCustomData(prev => ({
      ...prev,
      [activeCommunity.id]: {
        ...prev[activeCommunity.id],
        members: updatedMembers
      }
    }));
  };

  const handlePromoteDemote = (member: MemberItem) => {
    playSynthSound(700, "sine", 0.1);
    let nextRole: "admin" | "moderator" | "member" = "member";
    if (member.role === "member") nextRole = "moderator";
    else if (member.role === "moderator") nextRole = "admin";
    else if (member.role === "admin") nextRole = "member";

    handleUpdateMember(member.name, { role: nextRole });
  };

  const handleToggleMute = (member: MemberItem) => {
    playSynthSound(440, "triangle", 0.12);
    const muted = !member.isMuted;
    handleUpdateMember(member.name, { isMuted: muted });
  };

  const handleToggleBan = (member: MemberItem) => {
    const isBanned = !member.isBanned;
    playSynthSound(300, "sawtooth", 0.15);
    
    if (isBanned) {
      if (confirm(lang === "ar" ? `هل أنت متأكد من حظر المستخدم الكوني: "${member.name}"؟` : `Are you sure you want to ban user: "${member.name}"?`)) {
        handleUpdateMember(member.name, { isBanned: true, online: false });
      }
    } else {
      handleUpdateMember(member.name, { isBanned: false });
    }
  };

  const handleReportMember = (member: MemberItem) => {
    playSynthSound(250, "triangle", 0.1);
    alert(
      lang === "ar"
        ? `⚠️ تم تسجيل الإبلاغ عن سلوك المستخدم "${member.name}". سيقوم المشرفون بمراجعته.`
        : `⚠️ Violation report filed for pilot "${member.name}". Administrators will evaluate behavioral history.`
    );
  };

  return (
    <div className="flex flex-col gap-5">
      
      {/* HEADER META */}
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
        <div>
          <h4 className="text-xs font-black text-slate-200">{lang === "ar" ? "أعضاء القناة الكونية" : "Galaxy Channel Pilots"}</h4>
          <span className="text-[9px] text-slate-500 font-bold block">
            {lang === "ar" ? `${members.filter(m => !m.isBanned).length} مستكشف مسجل في هذا الرابط` : `${members.filter(m => !m.isBanned).length} active pilots connected to this frequency`}
          </span>
        </div>
        <Users className="w-5 h-5 text-cyan-400" />
      </div>

      {/* MEMBERS TABLE / CARDS */}
      <div className="space-y-3.5">
        {members.map((member) => {
          const isBanned = member.isBanned;
          const isMuted = member.isMuted;

          return (
            <div
              key={member.name}
              className={`glass-panel p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-200 ${
                isBanned 
                  ? "border-red-500/20 bg-red-950/5 opacity-50" 
                  : member.online 
                    ? "border-white/10 bg-slate-900/40 hover:border-purple-500/10" 
                    : "border-white/5 bg-slate-950/30"
              }`}
            >
              
              {/* Left core profile info */}
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0" />
                  {member.online && !isBanned && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-slate-950 rounded-full animate-pulse" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black text-slate-200 leading-snug">{member.name}</span>
                    
                    {/* Role Tag indicators */}
                    {member.role === "owner" && (
                      <span className="text-[8px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 py-0.5 px-2 rounded-full font-black flex items-center gap-0.5 uppercase tracking-wide">
                        <Crown className="w-2.5 h-2.5" />
                        {lang === "ar" ? "المؤسس" : "Owner"}
                      </span>
                    )}
                    {member.role === "admin" && (
                      <span className="text-[8px] bg-purple-500/10 text-purple-400 border border-purple-500/20 py-0.5 px-2 rounded-full font-black flex items-center gap-0.5 uppercase tracking-wide">
                        <Shield className="w-2.5 h-2.5" />
                        {lang === "ar" ? "مشرف" : "Admin"}
                      </span>
                    )}
                    {member.role === "moderator" && (
                      <span className="text-[8px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 py-0.5 px-2 rounded-full font-black flex items-center gap-0.5 uppercase tracking-wide">
                        <Shield className="w-2.5 h-2.5" />
                        {lang === "ar" ? "وسيط" : "Mod"}
                      </span>
                    )}
                  </div>

                  <span className="text-[9px] text-slate-500 font-bold block mt-0.5">
                    Lv.{member.level} • {member.badge}
                  </span>
                </div>
              </div>

              {/* Right panel interactive controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                {isBanned && (
                  <span className="text-[8px] bg-red-600/20 text-red-400 border border-red-500/20 py-1 px-2.5 rounded-full font-black uppercase tracking-wider animate-pulse">
                    BANNED 🛑
                  </span>
                )}
                {isMuted && (
                  <span className="text-[8px] bg-orange-600/20 text-orange-400 border border-orange-500/20 py-1 px-2.5 rounded-full font-black uppercase tracking-wider">
                    MUTED 🔇
                  </span>
                )}

                {simulateAdmin && member.role !== "owner" ? (
                  <div className="flex gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5 w-full sm:w-auto justify-center">
                    
                    {/* Role changer */}
                    <button
                      onClick={() => handlePromoteDemote(member)}
                      disabled={isBanned}
                      className="py-1 px-2.5 rounded-lg text-[9px] font-black text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer disabled:opacity-40"
                    >
                      🛡️ {lang === "ar" ? "ترقية الدور" : "Cycle Role"}
                    </button>

                    {/* Mute toggle */}
                    <button
                      onClick={() => handleToggleMute(member)}
                      disabled={isBanned}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        isMuted ? "bg-orange-600/30 text-orange-300" : "text-slate-500 hover:text-white"
                      }`}
                      title={isMuted ? (lang === "ar" ? "إلغاء كتم الصوت" : "Unmute") : (lang === "ar" ? "كتم الصوت" : "Mute")}
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                    </button>

                    {/* Ban toggle */}
                    <button
                      onClick={() => handleToggleBan(member)}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        isBanned ? "bg-red-600/30 text-red-300" : "text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                      }`}
                      title={isBanned ? (lang === "ar" ? "فك الحظر" : "Unban") : (lang === "ar" ? "حظر" : "Ban")}
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </button>

                  </div>
                ) : (
                  member.name !== currentUser.name && member.role !== "owner" && !isBanned && (
                    <button
                      onClick={() => handleReportMember(member)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all cursor-pointer"
                      title={lang === "ar" ? "إبلاغ عن عضو" : "Report member"}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  )
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
