import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mic, MicOff, Volume2, VolumeX, Radio, Sparkles, AlertCircle } from "lucide-react";
import LodaviaMascot from "./LodaviaMascot";

interface VoiceLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  currentUser: any;
  playSynthSound: (frequency: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', duration?: number) => void;
}

export default function VoiceLiveModal({
  isOpen,
  onClose,
  lang,
  currentUser,
  playSynthSound,
}: VoiceLiveModalProps) {
  const [status, setStatus] = useState<"connecting" | "idle" | "listening" | "thinking" | "speaking" | "error">("connecting");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [aiTranscript, setAiTranscript] = useState("");
  const [soundIntensity, setSoundIntensity] = useState(1);

  // Audio & Speech states
  const [recognition, setRecognition] = useState<any>(null);
  const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Audio animation interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "speaking") {
      interval = setInterval(() => {
        setSoundIntensity(1 + Math.random() * 0.45);
      }, 100);
    } else if (status === "listening") {
      interval = setInterval(() => {
        setSoundIntensity(1 + Math.random() * 0.15);
      }, 150);
    } else {
      setSoundIntensity(1);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Init Speech Recognition and Voice loop
  useEffect(() => {
    if (!isOpen) {
      cleanup();
      return;
    }

    playSynthSound(600, "sine", 0.15);
    setTimeout(() => {
      playSynthSound(900, "sine", 0.2);
    }, 120);

    // Initial delay for cosmic effect
    setStatus("idle");

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus("error");
      setErrorMessage(lang === "ar" ? "متصفحك لا يدعم التعرف على الصوت." : "Browser Speech Recognition not supported.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = lang === "ar" ? "ar-SA" : "en-US";

    rec.onstart = () => {
      if (isMutedRef.current) {
        rec.stop();
        return;
      }
      setStatus("listening");
      setUserTranscript("");
    };

    rec.onerror = (e: any) => {
      console.warn("Speech recognition error:", e.error);
      if (e.error === "no-speech") {
        // restart silently or keep idle
        setStatus("idle");
      } else {
        // generic error, fall back to idle
        setStatus("idle");
      }
    };

    rec.onend = () => {
      // Loop or proceed based on state
    };

    rec.onresult = async (event: any) => {
      const speechToText = event.results[0][0].transcript;
      if (!speechToText || speechToText.trim() === "") {
        setStatus("idle");
        return;
      }

      setUserTranscript(speechToText);
      setStatus("thinking");
      playSynthSound(450, "sine", 0.1);

      // Call AI to respond
      await sendVoiceQueryToAI(speechToText);
    };

    setRecognition(rec);

    // Initial greeting
    setTimeout(() => {
      triggerInitialGreeting();
    }, 800);

    return () => {
      cleanup();
    };
  }, [isOpen]);

  const cleanup = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (recognition) {
      try { recognition.stop(); } catch(e) {}
    }
    window.speechSynthesis.cancel();
  };

  const triggerInitialGreeting = async () => {
    const greeting = lang === "ar"
      ? `أهلاً بك يا ${currentUser?.name || "مستكشف الكون"}. أنا معك الآن في الاتصال الصوتي المباشر لومو. تحدث، وسأستمع إليك فوراً.`
      : `Hello, ${currentUser?.name || "cosmic explorer"}. I am here in real-time Voice mode. Speak freely, I am listening.`;
    
    setAiTranscript(greeting);
    await speakResponse(greeting);
  };

  // Main API voice chat handler
  const sendVoiceQueryToAI = async (query: string) => {
    try {
      // Get AI text response
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          lang,
          history: [],
          context: {
            user: currentUser,
            activeTab: "voice-live"
          }
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const replyText = data.text || "";
      setAiTranscript(replyText);

      // Synthesize TTS
      await speakResponse(replyText);

    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(lang === "ar" ? "حدث اضطراب في الاتصال بالشبكة الكونية." : "Cosmic neural network disrupted.");
      playSynthSound(150, "sawtooth", 0.3);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const speakResponse = async (text: string) => {
    setStatus("speaking");
    const cleanText = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '');

    try {
      const response = await fetch("/api/ai/voice-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanText,
          voice: lang === "ar" ? "Kore" : "Zephyr"
        })
      });
      const data = await response.json();

      if (data.audio) {
        const audio = new Audio("data:audio/wav;base64," + data.audio);
        activeAudioRef.current = audio;
        setActiveAudio(audio);
        audio.play();

        audio.onended = () => {
          setStatus("idle");
          setActiveAudio(null);
          activeAudioRef.current = null;
          // Auto start listening after AI finishes speaking
          startListeningLoop();
        };
      } else {
        throw new Error("No audio payload");
      }

    } catch (err) {
      console.warn("TTS API failed, fallback to native Web Speech:", err);
      // Fallback
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang === "ar" ? "ar-SA" : "en-US";
      
      utterance.onend = () => {
        setStatus("idle");
        startListeningLoop();
      };
      
      utterance.onerror = () => {
        setStatus("idle");
        startListeningLoop();
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const startListeningLoop = () => {
    if (isMutedRef.current || !recognition) return;
    try {
      recognition.start();
    } catch (e) {
      // already running
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    playSynthSound(nextMuted ? 300 : 700, "sine", 0.08);

    if (nextMuted) {
      if (recognition) {
        try { recognition.stop(); } catch (e) {}
      }
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
      window.speechSynthesis.cancel();
      setStatus("idle");
    } else {
      setTimeout(() => {
        startListeningLoop();
      }, 500);
    }
  };

  const handleManualTriggerListen = () => {
    if (isMuted) return;
    cleanup();
    playSynthSound(800, "sine", 0.08);
    startListeningLoop();
  };

  const handleClose = () => {
    cleanup();
    playSynthSound(350, "sine", 0.12);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-md h-[550px] bg-gradient-to-b from-slate-950 via-purple-950/80 to-slate-950 border border-purple-500/30 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(124,58,237,0.3)] flex flex-col justify-between p-6 text-center select-none"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 font-mono">
                Lodavia Voice Live
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title={lang === "ar" ? "إغلاق" : "Close"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Central Pulsating Sphere */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 relative">
            <div className="relative flex items-center justify-center">
              {/* Outer Glowing Rings */}
              <motion.div
                animate={{
                  scale: [1, 1.1 * soundIntensity, 1],
                  opacity: [0.15, 0.45 * soundIntensity, 0.15],
                }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 blur-2xl opacity-20"
              />
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.05 * soundIntensity, 1],
                }}
                transition={{
                  rotate: { repeat: Infinity, duration: 15, ease: "linear" },
                  scale: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                }}
                className="absolute w-36 h-36 rounded-full border border-purple-500/30 border-dashed scale-105"
              />
              <motion.div
                animate={{
                  rotate: -360,
                }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute w-40 h-40 rounded-full border border-cyan-400/20 scale-110"
              />

              {/* Central fluid circle */}
              <motion.div
                animate={{
                  scale: status === "thinking" ? [1, 1.15, 1] : [1, 1.08 * soundIntensity, 1],
                  borderRadius: ["42% 58% 70% 30% / 45% 45% 55% 55%", "70% 30% 52% 48% / 60% 40% 60% 40%", "42% 58% 70% 30% / 45% 45% 55% 55%"]
                }}
                transition={{
                  scale: { repeat: Infinity, duration: status === "thinking" ? 0.6 : 2.2, ease: "easeInOut" },
                  borderRadius: { repeat: Infinity, duration: 5, ease: "easeInOut" }
                }}
                className={`w-28 h-28 bg-gradient-to-tr ${
                  status === "speaking" ? "from-purple-600 via-pink-500 to-indigo-500" :
                  status === "thinking" ? "from-yellow-500 via-amber-600 to-orange-500" :
                  status === "listening" ? "from-cyan-500 via-teal-400 to-emerald-500" :
                  "from-slate-800 to-slate-900 border border-white/10"
                } shadow-[0_0_50px_rgba(124,58,237,0.4)] flex items-center justify-center z-10 overflow-hidden p-2`}
              >
                <LodaviaMascot 
                  size={84} 
                  animated={true} 
                  interactive={true} 
                  showAura={false}
                  isThinking={status === "thinking"}
                  isSpeaking={status === "speaking"}
                />
              </motion.div>
            </div>

            {/* Status indicators */}
            <div className="space-y-1.5 z-10">
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">
                {status === "connecting" && (lang === "ar" ? "جاري الاتصال..." : "CONNECTING...")}
                {status === "idle" && (lang === "ar" ? "جاهز للاستماع" : "LODAVIA READY")}
                {status === "listening" && (lang === "ar" ? "أنا أستمع إليك..." : "LISTENING...")}
                {status === "thinking" && (lang === "ar" ? "أفكر في الإجابة..." : "ALIGNING THOUGHTS...")}
                {status === "speaking" && (lang === "ar" ? "أنا أتحدث..." : "SPEAKING...")}
                {status === "error" && (lang === "ar" ? "خطأ في الاتصال" : "ERROR OCCURRED")}
              </h3>
              <p className="text-[10px] text-slate-400 font-medium px-6 max-w-sm mx-auto line-clamp-2 h-8">
                {status === "listening" && (lang === "ar" ? "تحدث بنبرة واضحة" : "Speak naturally, cosmic friend")}
                {status === "thinking" && (lang === "ar" ? "نظام لودافيا يترجم موجاتك الصوتية..." : "Lodavia translating your stellar frequencies...")}
                {status === "error" && errorMessage}
                {status === "idle" && !isMuted && (lang === "ar" ? "اضغط على الزر للحديث" : "Click mic or tap sphere to speak")}
                {status === "idle" && isMuted && (lang === "ar" ? "قم بإلغاء الكتم للحديث" : "Unmute to start speaking")}
              </p>
            </div>
          </div>

          {/* Subtitles & Transcripts Panel */}
          <div className="h-28 bg-black/40 border border-white/5 rounded-2xl p-3 flex flex-col justify-center text-left space-y-1.5 overflow-hidden mx-2 text-xs">
            <div className="line-clamp-2">
              <span className="text-[9px] font-black uppercase text-cyan-400 font-mono tracking-wider block mb-0.5">
                {lang === "ar" ? "صوتك:" : "YOUR VOICE:"}
              </span>
              <p className="text-slate-300 italic truncate text-[11px]">
                {userTranscript || "..."}
              </p>
            </div>
            <div className="line-clamp-2">
              <span className="text-[9px] font-black uppercase text-purple-400 font-mono tracking-wider block mb-0.5">
                {lang === "ar" ? "لودافيا:" : "LODAVIA AI:"}
              </span>
              <p className="text-white font-bold truncate text-[11px]">
                {aiTranscript || "..."}
              </p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-center gap-6 mt-4 pb-2">
            {/* Mute button */}
            <button
              onClick={handleToggleMute}
              className={`p-3.5 rounded-full border transition-all active:scale-95 cursor-pointer ${
                isMuted
                  ? "bg-red-500/20 border-red-500/40 text-red-400"
                  : "bg-white/5 border-white/10 text-slate-300 hover:text-white"
              }`}
              title={isMuted ? (lang === "ar" ? "تشغيل الميكروفون" : "Unmute Mic") : (lang === "ar" ? "كتم الميكروفون" : "Mute Mic")}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Tap to force recognition / Pulsating activator */}
            <button
              onClick={handleManualTriggerListen}
              disabled={isMuted || status === "thinking" || status === "speaking"}
              className={`p-5 rounded-full text-white shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-40 ${
                status === "listening"
                  ? "bg-emerald-600 animate-pulse border-emerald-400/30 border"
                  : "bg-gradient-to-tr from-purple-600 to-indigo-600"
              }`}
            >
              <Mic className="w-6 h-6" />
            </button>

            {/* Volume feedback indicator placeholder */}
            <div className="p-3.5 rounded-full bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
