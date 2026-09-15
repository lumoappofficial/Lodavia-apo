import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Image, 
  Mic, 
  Check, 
  CheckCheck, 
  Smile, 
  Flame, 
  Play, 
  Pause,
  StopCircle,
  Loader2,
  Paperclip
} from "lucide-react";
import { db, isFirebaseConfigured } from "../../firebase/config";
import { collection, doc, addDoc, onSnapshot, query, orderBy, limit, updateDoc } from "firebase/firestore";
import { AppUser, CommunityItem, ChatMessage } from "../../types";

interface CommunityChatProps {
  currentUser: AppUser;
  lang: string;
  activeCommunity: CommunityItem;
  playSynthSound: (frequency: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', duration?: number) => void;
}

export default function CommunityChat({
  currentUser,
  lang,
  activeCommunity,
  playSynthSound
}: CommunityChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [showMediaPopup, setShowMediaPopup] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<any>(null);

  const collPath = `communities/${activeCommunity.id}/chat_messages`;

  // Real-time listener for messages
  useEffect(() => {
    setIsLoading(true);
    let unsub = () => {};

    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, collPath), orderBy("timestamp", "asc"), limit(100));
        unsub = onSnapshot(q, (snap) => {
          const loaded: ChatMessage[] = [];
          snap.forEach((d) => {
            loaded.push({ id: d.id, ...d.data() } as ChatMessage);
          });
          setMessages(loaded);
          setIsLoading(false);
        }, (err) => {
          console.warn("Firestore error reading chat room:", err);
          loadLocalStorageFallback();
        });
      } catch (err) {
        console.error("Firestore init error", err);
        loadLocalStorageFallback();
      }
    } else {
      loadLocalStorageFallback();
    }

    return () => {
      unsub();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [activeCommunity.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadLocalStorageFallback = () => {
    const key = `lumo_comm_chat_${activeCommunity.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch (e) {
        setMessages(getInitialMockMessages());
      }
    } else {
      const initial = getInitialMockMessages();
      setMessages(initial);
      localStorage.setItem(key, JSON.stringify(initial));
    }
    setIsLoading(false);
  };

  const saveLocalStorageFallback = (updated: ChatMessage[]) => {
    const key = `lumo_comm_chat_${activeCommunity.id}`;
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const getInitialMockMessages = (): ChatMessage[] => {
    const isAr = lang === "ar";
    return [
      {
        id: "msg_init_1",
        senderId: "user_2",
        text: isAr ? "مرحباً بالجميع في صالون المحادثة الفورية الكونية للمجتمع! 👋✨" : "Welcome everyone to our live community cosmic salon! 👋✨",
        type: "text",
        timestamp: "08:15 PM"
      },
      {
        id: "msg_init_2",
        senderId: "user_3",
        text: isAr ? "أهلاً بك! لقد قمت للتو بمراجعة هاكاثون المطورين القادم ومتحمس جداً للتسجيل." : "Hello! I just reviewed the upcoming developer hackathon details and I am so excited to register.",
        type: "text",
        timestamp: "08:17 PM"
      }
    ];
  };

  // Actions
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playSynthSound(783.99, "sine", 0.08);

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: inputText.trim(),
      type: "text",
      timestamp: new Date().toLocaleTimeString(lang === "ar" ? "ar-SA" : "en-US", { hour: "2-digit", minute: "2-digit" }),
      reactions: {}
    };

    await saveMessage(newMsg);
    setInputText("");
  };

  const handleSendMedia = async () => {
    if (!mediaUrl.trim()) return;

    playSynthSound(880, "sine", 0.1);

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: mediaType === "image" ? (lang === "ar" ? "صورة مبرهنة 📷" : "Cosmic Image 📷") : (lang === "ar" ? "فيديو مسجل 📹" : "Cosmic Video 📹"),
      type: mediaType,
      mediaUrl: mediaUrl.trim(),
      timestamp: new Date().toLocaleTimeString(lang === "ar" ? "ar-SA" : "en-US", { hour: "2-digit", minute: "2-digit" }),
      reactions: {}
    };

    await saveMessage(newMsg);
    setMediaUrl("");
    setShowMediaPopup(false);
  };

  // Voice Message simulation
  const startRecording = () => {
    playSynthSound(523.25, "triangle", 0.1);
    setIsRecording(true);
    setRecordingSeconds(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
      // Play brief ambient tracking ticks
      playSynthSound(440, "sine", 0.01);
    }, 1000);
  };

  const stopAndSendRecording = async () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);

    if (recordingSeconds < 1) {
      playSynthSound(200, "sawtooth", 0.15);
      return;
    }

    playSynthSound(1046.5, "sine", 0.15);

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: lang === "ar" ? "رسالة صوتية كوكبية" : "Cosmic Voice Note",
      type: "audio",
      duration: `${Math.floor(recordingSeconds / 60)}:${(recordingSeconds % 60).toString().padStart(2, "0")}`,
      timestamp: new Date().toLocaleTimeString(lang === "ar" ? "ar-SA" : "en-US", { hour: "2-digit", minute: "2-digit" }),
      reactions: {}
    };

    await saveMessage(newMsg);
  };

  const playVoiceMessage = (msgId: string, durationStr: string) => {
    if (isPlayingAudio === msgId) {
      setIsPlayingAudio(null);
      return;
    }
    
    setIsPlayingAudio(msgId);
    playSynthSound(659.25, "sawtooth", 0.6);
    setTimeout(() => playSynthSound(783.99, "sine", 0.4), 300);

    // Stop animation after mock delay
    setTimeout(() => {
      setIsPlayingAudio(null);
    }, 2000);
  };

  // Emoji Reactions
  const handleToggleReaction = async (msgId: string, emoji: string) => {
    playSynthSound(880, "sine", 0.05);

    if (isFirebaseConfigured && db) {
      try {
        const msgRef = doc(db, collPath, msgId);
        const msg = messages.find(m => m.id === msgId);
        if (msg) {
          const reactions = { ...(msg.reactions || {}) };
          const usersList = reactions[emoji] ? [...reactions[emoji]] : [];
          if (usersList.includes(currentUser.id)) {
            reactions[emoji] = usersList.filter(id => id !== currentUser.id);
          } else {
            reactions[emoji] = [...usersList, currentUser.id];
          }
          await updateDoc(msgRef, { reactions });
        }
      } catch (err) {
        console.error("Firestore update reaction error:", err);
      }
    } else {
      const updated = messages.map(m => {
        if (m.id === msgId) {
          const reactions = { ...(m.reactions || {}) };
          const usersList = reactions[emoji] ? [...reactions[emoji]] : [];
          if (usersList.includes(currentUser.id)) {
            reactions[emoji] = usersList.filter(id => id !== currentUser.id);
          } else {
            reactions[emoji] = [...usersList, currentUser.id];
          }
          return { ...m, reactions };
        }
        return m;
      });
      setMessages(updated);
      saveLocalStorageFallback(updated);
    }
  };

  const saveMessage = async (newMsg: ChatMessage) => {
    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, collPath), newMsg);
      } catch (err) {
        console.warn("Firestore save error, fall backing to local storage:", err);
        const updated = [...messages, newMsg];
        setMessages(updated);
        saveLocalStorageFallback(updated);
      }
    } else {
      const updated = [...messages, newMsg];
      setMessages(updated);
      saveLocalStorageFallback(updated);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-slate-900/40 flex flex-col h-[520px] shadow-lg relative overflow-hidden">
      
      {/* HEADER BAR */}
      <div className="flex justify-between items-center border-b border-white/5 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h4 className="text-xs font-black text-slate-200">{lang === "ar" ? "قناة المحادثة الفورية الكونية" : "Live Cosmic Chatroom"}</h4>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{lang === "ar" ? "مشفرة ببروتوكول آمن" : "Secure Node Encrypted"}</span>
          </div>
        </div>
        
        <button
          onClick={() => {
            playSynthSound(600, "sine", 0.05);
            setShowMediaPopup(true);
          }}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 transition-all border border-white/5 cursor-pointer flex items-center justify-center"
          title={lang === "ar" ? "مشاركة وسائط" : "Share media"}
        >
          <Paperclip className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* MESSAGES scrolling list */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-600 text-xs py-10">
            {lang === "ar" ? "صالون المحادثة فارغ. ابدأ بإرسال فكرة ملهمة!" : "Chat room empty. Initiate the conversation!"}
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${isMe ? "self-end ml-auto items-end" : "self-start mr-auto items-start"}`}
              >
                {/* Bubble */}
                <div
                  className={`p-3.5 rounded-2xl text-xs relative group transition-all duration-200 shadow-md ${
                    isMe
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-white/5 text-slate-300 rounded-bl-none border border-white/5"
                  }`}
                >
                  {/* Sender title if not me */}
                  {!isMe && (
                    <span className="text-[8px] text-purple-400 font-black block mb-1 uppercase tracking-wider">
                      {msg.senderId === "user_2" ? (lang === "ar" ? "د. نورة" : "Dr. Nora") : (lang === "ar" ? "ياسر العتيبي" : "Yasser Otaibi")}
                    </span>
                  )}

                  {/* Message body rendering */}
                  {msg.type === "image" && msg.mediaUrl ? (
                    <div className="space-y-2">
                      <img src={msg.mediaUrl} alt="media" className="rounded-xl max-h-48 object-cover border border-white/5" />
                      <span className="block mt-1">{msg.text}</span>
                    </div>
                  ) : msg.type === "video" && msg.mediaUrl ? (
                    <div className="space-y-2">
                      <video src={msg.mediaUrl} controls className="rounded-xl max-h-48 aspect-video object-cover" />
                      <span className="block mt-1">{msg.text}</span>
                    </div>
                  ) : msg.type === "audio" ? (
                    <div className="flex items-center gap-3 py-1 px-1 min-w-[150px]">
                      <button
                        onClick={() => playVoiceMessage(msg.id, msg.duration || "0:00")}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow transition-all cursor-pointer ${
                          isPlayingAudio === msg.id ? "bg-red-500 text-white animate-pulse" : "bg-cyan-500 text-slate-950"
                        }`}
                      >
                        {isPlayingAudio === msg.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <div className="flex-1">
                        <span className="text-[10px] font-black block">{lang === "ar" ? "تسجيل صوتي كوني" : "Celestial Audio"}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[8px] text-slate-400 font-bold">{msg.duration}</span>
                          {/* Simulated sound waves */}
                          <div className="flex gap-0.5 h-2 items-center">
                            <div className={`w-0.5 bg-cyan-400/50 rounded-full h-full ${isPlayingAudio === msg.id ? "animate-bounce" : ""}`} />
                            <div className={`w-0.5 bg-cyan-400/50 rounded-full h-2/3 ${isPlayingAudio === msg.id ? "animate-bounce [animation-delay:0.1s]" : ""}`} />
                            <div className={`w-0.5 bg-cyan-400/50 rounded-full h-full ${isPlayingAudio === msg.id ? "animate-bounce [animation-delay:0.2s]" : ""}`} />
                            <div className={`w-0.5 bg-cyan-400/50 rounded-full h-1/2 ${isPlayingAudio === msg.id ? "animate-bounce [animation-delay:0.3s]" : ""}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span>{msg.text}</span>
                  )}

                  {/* Reactions floating tray */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {msg.reactions && Object.keys(msg.reactions).map((emoji) => {
                      const uList = msg.reactions?.[emoji] || [];
                      if (uList.length === 0) return null;
                      const hasMyReaction = uList.includes(currentUser.id);

                      return (
                        <button
                          key={emoji}
                          onClick={() => handleToggleReaction(msg.id, emoji)}
                          className={`text-[9px] py-0.5 px-1.5 rounded-full border flex items-center gap-1 font-bold cursor-pointer transition-all ${
                            hasMyReaction
                              ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-300"
                              : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span>{emoji}</span>
                          <span>{uList.length}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Hover inline reactions chooser */}
                  <div className={`absolute top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1.5 bg-slate-900 border border-white/10 p-1 rounded-full shadow-lg z-20 ${
                    isMe ? "right-full mr-2" : "left-full ml-2"
                  }`}>
                    {["❤️", "👍", "🔥", "😂", "🚀"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleToggleReaction(msg.id, emoji)}
                        className="hover:scale-125 transition-transform p-0.5 cursor-pointer text-xs"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                </div>

                {/* Date-time block */}
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[8px] text-slate-500 font-bold">{msg.timestamp}</span>
                  {isMe && (
                    <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </div>

              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER MESSAGE BAR */}
      <div className="border-t border-white/5 pt-3.5 shrink-0 flex gap-2 relative">
        {isRecording ? (
          <div className="flex-1 bg-red-600/10 border border-red-500/20 rounded-2xl py-2.5 px-4 text-xs font-bold text-red-400 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
              <span>{lang === "ar" ? "جاري التسجيل الصوتي..." : "Recording live audio..."}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{recordingSeconds}s</span>
              <button
                type="button"
                onClick={stopAndSendRecording}
                className="p-1 rounded bg-red-600 hover:bg-red-500 text-white cursor-pointer flex items-center justify-center shrink-0"
                title={lang === "ar" ? "إيقاف وحفظ" : "Stop and send"}
              >
                <StopCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
            <button
              type="button"
              onClick={startRecording}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-cyan-400 cursor-pointer flex items-center justify-center shrink-0"
              title={lang === "ar" ? "تسجيل صوتي" : "Record voice message"}
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={lang === "ar" ? "أرسل مناقشة كوكبية إلى الصالون..." : "Send an inspiring thought..."}
              className="flex-1 py-3 px-4 bg-black/40 text-xs text-white border border-white/5 rounded-2xl focus:border-purple-500/40 focus:outline-none placeholder-slate-600"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 flex items-center justify-center cursor-pointer shrink-0 transition-all duration-200 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* MEDIA PASTE POPUP PANEL */}
      <AnimatePresence>
        {showMediaPopup && (
          <div className="absolute inset-0 z-30 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-slate-950 border border-white/10 rounded-3xl p-5 w-full max-w-xs space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] font-black text-white uppercase tracking-wider">{lang === "ar" ? "إرسال رابط وسائط كوكبي" : "Broadcast cosmic media"}</span>
                <button
                  type="button"
                  onClick={() => setShowMediaPopup(false)}
                  className="text-slate-500 hover:text-white font-bold text-xs cursor-pointer"
                >
                  X
                </button>
              </div>

              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setMediaType("image")}
                  className={`py-1 px-3 rounded text-[10px] font-black cursor-pointer uppercase ${
                    mediaType === "image" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
                  }`}
                >
                  IMAGE
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType("video")}
                  className={`py-1 px-3 rounded text-[10px] font-black cursor-pointer uppercase ${
                    mediaType === "video" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
                  }`}
                >
                  VIDEO
                </button>
              </div>

              <input
                type="url"
                required
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder={lang === "ar" ? "ألصق رابط الصورة أو الفيديو..." : "Paste secure media URL..."}
                className="w-full py-2 px-3 bg-black/40 text-xs text-white border border-white/5 rounded-xl focus:outline-none"
              />

              <button
                type="button"
                onClick={handleSendMedia}
                className="w-full py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 cursor-pointer shadow-lg shadow-cyan-500/10"
              >
                {lang === "ar" ? "إرسال" : "Broadcast"}
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
