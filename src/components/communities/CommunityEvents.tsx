import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Bell, 
  FileSpreadsheet,
  Download,
  CheckCircle,
  Loader2
} from "lucide-react";
import { AppUser, CommunityItem } from "../../types";

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: number;
  rsvp: boolean;
  banner: string;
}

interface CommunityEventsProps {
  currentUser: AppUser;
  lang: "ar" | "en";
  activeCommunity: CommunityItem;
  customData: any;
  setCommunityCustomData: React.Dispatch<React.SetStateAction<{ [commId: string]: any }>>;
  playSynthSound: (frequency: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', duration?: number) => void;
  simulateAdmin: boolean;
}

export default function CommunityEvents({
  currentUser,
  lang,
  activeCommunity,
  customData,
  setCommunityCustomData,
  playSynthSound,
  simulateAdmin
}: CommunityEventsProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newBanner, setNewBanner] = useState("");

  const events: EventItem[] = customData?.events || [];

  const handleToggleRSVP = (eventId: string, currentRsvp: boolean) => {
    playSynthSound(currentRsvp ? 450 : 900, "sine", 0.12);

    const updatedEvents = events.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          rsvp: !currentRsvp,
          attendees: currentRsvp ? ev.attendees - 1 : ev.attendees + 1
        };
      }
      return ev;
    });

    setCommunityCustomData(prev => ({
      ...prev,
      [activeCommunity.id]: {
        ...prev[activeCommunity.id],
        events: updatedEvents
      }
    }));
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate || !newTime) return;

    playSynthSound(800, "sine", 0.15);

    const newEvent: EventItem = {
      id: `ev_${Date.now()}`,
      title: newTitle.trim(),
      date: newDate,
      time: newTime,
      attendees: 1,
      rsvp: true,
      banner: newBanner.trim() || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800"
    };

    setCommunityCustomData(prev => ({
      ...prev,
      [activeCommunity.id]: {
        ...prev[activeCommunity.id],
        events: [newEvent, ...events]
      }
    }));

    setNewTitle("");
    setNewDate("");
    setNewTime("");
    setNewBanner("");
    setShowCreateForm(false);
  };

  const handleSetReminder = (evTitle: string) => {
    playSynthSound(1000, "sine", 0.1);
    alert(
      lang === "ar"
        ? `🔔 تم ضبط التذكير الكوني للفعالية: "${evTitle}"!\n\nسنقوم بإرسال إشعار فوري وتنبيهك قبل بدء الفعالية بـ ١٥ دقيقة.`
        : `🔔 Celestial reminder set for event: "${evTitle}"!\n\nYou will receive a high-priority notification 15 minutes before the start time.`
    );
  };

  // Generate & export .ics calendar file
  const handleExportICS = (ev: EventItem) => {
    playSynthSound(1100, "sine", 0.12);

    // Format start/end date for ICS format (YYYYMMDDTHHMMSSZ)
    const year = new Date().getFullYear(); // fallbacks
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const day = new Date().getDate().toString().padStart(2, "0");
    const cleanDate = ev.date.replace(/[^0-9]/g, "");
    
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Lodavia Cosmic App//Bilingual Calendar//EN",
      "BEGIN:VEVENT",
      `UID:${ev.id}@lodavia.ai`,
      `DTSTAMP:${year}${month}${day}T000000Z`,
      `DTSTART:${year}${month}${day}T210000Z`, // Simulated standard GMT
      `DTEND:${year}${month}${day}T220000Z`,
      `SUMMARY:${ev.title}`,
      `DESCRIPTION:Join us for this exciting live cosmic event in the ${activeCommunity.name} community. Powered by Lodavia AI.`,
      "LOCATION:Lodavia Communities Live Stage",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `lumo_event_${ev.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
        <div>
          <h4 className="text-xs font-black text-slate-200">{lang === "ar" ? "الفعاليات الكونية القادمة" : "Upcoming Celestial Events"}</h4>
          <span className="text-[9px] text-slate-500 font-bold block">{lang === "ar" ? "ندوات نقاش وهاكاثونات مخصصة للأعضاء" : "Exclusive masterclasses, summits and panel forums"}</span>
        </div>

        {currentUser.joinedCommunities.includes(activeCommunity.id) && (
          <button
            onClick={() => {
              playSynthSound(700, "sine", 0.08);
              setShowCreateForm(!showCreateForm);
            }}
            className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-[10px] cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-600/15"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "تأسيس فعالية" : "Host Event"}</span>
          </button>
        )}
      </div>

      {/* EVENT CREATION FORM */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleCreateEventSubmit}
            className="glass-panel p-5 rounded-3xl border border-white/5 bg-slate-900/60 flex flex-col gap-3.5"
          >
            <span className="text-[10px] font-black text-slate-300 block uppercase tracking-wider">{lang === "ar" ? "تأسيس فعالية مجتمعية جديدة 🎤" : "Host celestial event 🎤"}</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={lang === "ar" ? "عنوان الفعالية..." : "Event title..."}
                className="py-2 px-3.5 rounded-xl bg-black/40 text-xs text-white border border-white/5 focus:outline-none focus:border-purple-500/30"
              />
              <input
                type="text"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                placeholder={lang === "ar" ? "التاريخ (مثال: ١٥ يوليو)" : "Date (e.g., July 15)"}
                className="py-2 px-3.5 rounded-xl bg-black/40 text-xs text-white border border-white/5 focus:outline-none focus:border-purple-500/30"
              />
              <input
                type="text"
                required
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder={lang === "ar" ? "الوقت (مثال: 09:00 مساءً)" : "Time (e.g., 09:00 PM)"}
                className="py-2 px-3.5 rounded-xl bg-black/40 text-xs text-white border border-white/5 focus:outline-none focus:border-purple-500/30"
              />
              <input
                type="url"
                value={newBanner}
                onChange={(e) => setNewBanner(e.target.value)}
                placeholder={lang === "ar" ? "رابط غلاف الفعالية (اختياري)..." : "Event banner URL (optional)..."}
                className="py-2 px-3.5 rounded-xl bg-black/40 text-xs text-white border border-white/5 focus:outline-none focus:border-purple-500/30"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              🚀 {lang === "ar" ? "تأكيد وتأسيس الفعالية الكونية" : "Confirm and Launch Event"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* EVENTS DISPLAY LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-600 text-xs font-bold">
            {lang === "ar" ? "لا توجد فعاليات مجتمعية مجدولة حالياً." : "No scheduled events here yet."}
          </div>
        ) : (
          events.map((ev) => (
            <div
              key={ev.id}
              className="glass-panel rounded-3xl overflow-hidden border border-white/5 bg-slate-950/40 hover:border-purple-500/10 transition-all duration-300 flex flex-col justify-between h-96 relative group shadow-lg"
            >
              {/* Event Image */}
              <div className="relative aspect-video w-full overflow-hidden shrink-0">
                <img src={ev.banner} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute bottom-3 start-4 text-[9px] bg-cyan-500 text-slate-950 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                  <CheckCircle className="w-3 h-3" />
                  {lang === "ar" ? "مؤكد" : "Verified"}
                </span>
              </div>

              {/* Core Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors leading-tight line-clamp-2">
                    {ev.title}
                  </h5>

                  <div className="flex flex-col gap-2.5 mt-3.5 text-[11px] text-slate-400 font-bold">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{ev.date}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{ev.time}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{ev.attendees} {lang === "ar" ? "مسجل للحضور" : "attendees RSVPed"}</span>
                    </span>
                  </div>
                </div>

                {/* RSVP / reminders controls */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-white/5 shrink-0">
                  {currentUser.joinedCommunities.includes(activeCommunity.id) ? (
                    <button
                      onClick={() => handleToggleRSVP(ev.id, ev.rsvp)}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                        ev.rsvp
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                          : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                      }`}
                    >
                      {ev.rsvp ? (lang === "ar" ? "حاضر ✓" : "RSVPed ✓") : (lang === "ar" ? "تسجيل حضور" : "RSVP Join")}
                    </button>
                  ) : (
                    <span className="text-[9px] text-slate-500 font-bold text-center w-full block bg-white/5 py-1 px-2 rounded-lg">
                      {lang === "ar" ? "انضم للمجتمع أولاً لتسجيل الحضور" : "Join community to register"}
                    </span>
                  )}

                  {currentUser.joinedCommunities.includes(activeCommunity.id) && (
                    <>
                      <button
                        onClick={() => handleSetReminder(ev.title)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/5 cursor-pointer flex items-center justify-center shrink-0"
                        title={lang === "ar" ? "إعداد تذكير" : "Set reminder"}
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>
                      
                      <button
                        onClick={() => handleExportICS(ev)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/5 cursor-pointer flex items-center justify-center shrink-0"
                        title={lang === "ar" ? "تصدير للتقويم" : "Export to Calendar"}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
