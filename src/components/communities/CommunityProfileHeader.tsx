import React from "react";
import { Users, Flame, Share2 } from "lucide-react";
import { AppUser, CommunityItem } from "../../types";

interface CommunityProfileHeaderProps {
  currentUser: AppUser;
  lang: string;
  activeCommunity: CommunityItem;
  handleToggleJoin: (commId: string) => void;
  playSynthSound: (frequency: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', duration?: number) => void;
}

export default function CommunityProfileHeader({
  currentUser,
  lang,
  activeCommunity,
  handleToggleJoin,
  playSynthSound
}: CommunityProfileHeaderProps) {
  const isJoined = currentUser.joinedCommunities.includes(activeCommunity.id);

  const handleInviteMembers = () => {
    // Generate beautiful invite link
    const inviteLink = `${window.location.origin}/community/${activeCommunity.slug}/invite?ref=${currentUser.id}`;
    navigator.clipboard.writeText(inviteLink);
    
    // Play celebratory synth arpeggio
    playSynthSound(523.25, "sine", 0.08);
    setTimeout(() => playSynthSound(659.25, "sine", 0.08), 80);
    setTimeout(() => playSynthSound(783.99, "sine", 0.15), 160);

    alert(
      lang === "ar"
        ? `🌌 تم نسخ رابط الدعوة الكوني بنجاح!\n\nرابط الدعوة:\n${inviteLink}\n\nشاركه مع أصدقائك لبناء المعرفة معاً!`
        : `🌌 Cosmic invitation link copied successfully!\n\nInvite link:\n${inviteLink}\n\nShare it with your network to collaborate together!`
    );
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-xl bg-slate-950/80">
      {/* Banner cover */}
      <div className="h-32 md:h-44 w-full relative overflow-hidden">
        <img src={activeCommunity.banner} alt={activeCommunity.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
      </div>

      {/* Profile Avatar & Info layout */}
      <div className="p-6 pt-0 relative flex flex-col md:flex-row justify-between items-start md:items-end gap-4 -mt-10 md:-mt-12">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-slate-950 border-2 border-purple-500/40 flex items-center justify-center text-4xl shadow-2xl relative z-10 shrink-0">
            {activeCommunity.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] bg-cyan-500 text-slate-900 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">{activeCommunity.category}</span>
              <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                <Flame className="w-3 h-3 text-purple-400 animate-pulse" />
                {lang === "ar" ? "قناة تفاعلية نشطة" : "Active Galaxy Hub"}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-black text-white mt-1.5 flex items-center gap-2">
              {activeCommunity.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {activeCommunity.description}
            </p>
            
            {/* Metadata display */}
            <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <strong>{activeCommunity.membersCount}</strong> {lang === "ar" ? "عضو" : "members"}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <strong className="text-emerald-400">{Math.max(1, Math.floor(activeCommunity.membersCount / 8) + 1)}</strong> {lang === "ar" ? "متصل" : "online"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Join/Leave + Invite) */}
        <div className="flex gap-2 w-full md:w-auto shrink-0 mt-4 md:mt-0">
          <button
            onClick={handleInviteMembers}
            className="flex-1 md:flex-initial p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            title={lang === "ar" ? "دعوة أعضاء" : "Invite members"}
          >
            <Share2 className="w-4 h-4" />
            <span>{lang === "ar" ? "دعوة للأصدقاء" : "Invite Friends"}</span>
          </button>

          <button
            onClick={() => handleToggleJoin(activeCommunity.id)}
            className={`flex-1 md:flex-initial px-6 py-3 rounded-2xl font-black text-xs transition-all cursor-pointer ${
              isJoined
                ? "bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400"
                : "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/10"
            }`}
          >
            {isJoined 
              ? (lang === "ar" ? "مغادرة المجتمع" : "Leave Space") 
              : (lang === "ar" ? "انضمام للرابط" : "Join Connection")}
          </button>
        </div>
      </div>
    </div>
  );
}
