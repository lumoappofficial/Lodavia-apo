import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  X, 
  Send, 
  Brain, 
  Languages, 
  FileText, 
  Orbit, 
  Copy, 
  Plus, 
  Check, 
  Users, 
  Compass, 
  MessageSquare, 
  CornerDownLeft, 
  RefreshCw,
  Zap,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Trash,
  Download,
  UploadCloud,
  Sparkle,
  Mic,
  MicOff,
  Pin,
  PinOff,
  Search,
  Share2,
  FileCode,
  Edit3,
  Trash2,
  Paperclip,
  Settings,
  Headphones,
  Sliders,
  HelpCircle,
  CheckSquare,
  Play,
  Pause,
  Square,
  Scale
} from "lucide-react";
import { AppUser, CommunityItem, Post } from "../types";

// Import modular premium components
import MarkdownRenderer from "./MarkdownRenderer";
import VoiceLiveModal from "./VoiceLiveModal";
import SuggestedPrompts from "./SuggestedPrompts";
import SubscriptionUpgradeModal from "./SubscriptionUpgradeModal";
import ProjectJuryModal from "./ProjectJuryModal";
import LodaviaMascot, { MascotConfig, MascotGender, MascotSkin, SKIN_DEFINITIONS } from "./LodaviaMascot";
import MascotSelectorModal from "./MascotSelectorModal";
import Ray3DViewer from "./Ray3DViewer";
import RayLockerModal from "./RayLockerModal";
import { checkFeatureAccess, recordUsage } from "../services/subscriptionService";
import { SubscriptionTier, SUBSCRIPTION_PLANS } from "../types/subscription";

interface AIAssistantProps {
  currentUser: AppUser;
  lang: string;
  activeTab: string;
  communities: CommunityItem[];
  setCommunities: React.Dispatch<React.SetStateAction<CommunityItem[]>>;
  setHomePosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setNewPostText: (text: string) => void;
  setShowCreateModal: (show: boolean) => void;
  playSynthSound: (frequency: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', duration?: number) => void;
  startOpen?: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  image?: string; // Base64 image
  isStreaming?: boolean;
}

interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  isPinned: boolean;
  updatedAt: string;
}

interface AttachedFile {
  name: string;
  type: string;
  size: number;
  content?: string; // Read contents for plain text documents
  base64?: string; // Read contents for images
}

export default function AIAssistant({
  currentUser,
  lang,
  activeTab,
  communities,
  setCommunities,
  setHomePosts,
  setNewPostText,
  setShowCreateModal,
  playSynthSound,
  startOpen,
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => { if (startOpen) setIsOpen(true); }, [startOpen]);
  const [activePanel, setActivePanel] = useState<"chat" | "post" | "tools" | "orbit" | "mascot">("chat");
  const [loading, setLoading] = useState(false);

  // Mascot Companion State (Male Lumo / Female Nova)
  const [mascotConfig, setMascotConfig] = useState<MascotConfig>(() => {
    const saved = localStorage.getItem('lodavia_ai_mascot_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.gender === 'male' || parsed.gender === 'female')) {
          return parsed;
        }
      } catch (e) {}
    }
    return { gender: 'male', skin: 'default', isConfigured: false };
  });

  const [showMascotSelectorModal, setShowMascotSelectorModal] = useState(false);
  const [showProjectJuryModal, setShowProjectJuryModal] = useState(false);
  const [isLockerOpen, setIsLockerOpen] = useState(false);

  const handleSelectMascot = (gender: MascotGender, skin: MascotSkin) => {
    const updated: MascotConfig = { gender, skin, isConfigured: true };
    setMascotConfig(updated);
    localStorage.setItem('lodavia_ai_mascot_config', JSON.stringify(updated));
    if (playSynthSound) playSynthSound(750, 'sine', 0.1);
  };

  const handleFabClick = () => {
    if (playSynthSound) playSynthSound(680, 'sine', 0.08);
    toggleAssistant();
  };

  // Conversations History States
  const [conversations, setConversations] = useState<ChatThread[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState("");
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  // Chat Input & Voice states
  const [chatInput, setChatInput] = useState("");
  const [speechStatus, setSpeechStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [activeSpeechMsgId, setActiveSpeechMsgId] = useState<string | null>(null);
  const [activeSpeechText, setActiveSpeechText] = useState<string>("");
  const [showVoiceSettingsModal, setShowVoiceSettingsModal] = useState<boolean>(false);
  const [isDictating, setIsDictating] = useState(false);
  const [dictationRecognition, setDictationRecognition] = useState<any>(null);

  // Local voice settings for pitch, rate, and auto-speak
  const [voiceSettings, setVoiceSettings] = useState<{
    pitch: number;
    rate: number;
    autoSpeak: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem("lodavia_voice_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          pitch: typeof parsed.pitch === "number" ? parsed.pitch : 1.15,
          rate: typeof parsed.rate === "number" ? parsed.rate : 1.05,
          autoSpeak: !!parsed.autoSpeak,
        };
      }
    } catch (e) {}
    return { pitch: 1.15, rate: 1.05, autoSpeak: false };
  });

  const updateVoiceSettings = (newSettings: Partial<typeof voiceSettings>) => {
    setVoiceSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("lodavia_voice_settings", JSON.stringify(updated));
      return updated;
    });
  };

  // Advanced Voice Live Modal state
  const [isVoiceLiveOpen, setIsVoiceLiveOpen] = useState(false);

  // Freemium Subscription Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [requiredModalTier, setRequiredModalTier] = useState<SubscriptionTier>("pro");
  const [modalFeatureTitle, setModalFeatureTitle] = useState<string>("");

  // Attachment states (Drag and Drop / Document Analysis)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Accessibility States
  const [fontScale, setFontScale] = useState<"standard" | "medium" | "large">("standard");
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  // Feedback/Error States
  const [apiError, setApiError] = useState<string | null>(null);

  // Post Wizard States
  const [postTopic, setPostTopic] = useState("");
  const [postTone, setPostTone] = useState("cosmic");
  const [generatedPost, setGeneratedPost] = useState("");
  const [copiedPost, setCopiedPost] = useState(false);

  // Tools Panel States
  const [toolText, setToolText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [translationDirection, setTranslationDirection] = useState<"to_ar" | "to_en">("to_ar");
  const [summarizedText, setSummarizedText] = useState("");
  const [summarizeSource, setSummarizeSource] = useState<"custom" | "home_feed">("custom");

  // Orbit Panel States
  const [recommendations, setRecommendations] = useState<{
    communityRecommendations: Array<{ id: string; name: string; reason: string }>;
    friendRecommendations: Array<{ name: string; avatar: string; bio: string; interests: string[]; matchScore: number }>;
    cosmicTip: string;
  } | null>(null);
  const [recsLoading, setRecsLoading] = useState(false);

  // Local storage recent prompts state
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 1. Initial configuration loading (localStorage)
  useEffect(() => {
    // Load conversations
    const stored = localStorage.getItem("lumo_cosmic_conversations");
    const storedActive = localStorage.getItem("lumo_cosmic_active_thread_id");
    const storedRecent = localStorage.getItem("lumo_cosmic_recent_prompts");
    const storedFont = localStorage.getItem("lumo_cosmic_font_scale");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConversations(parsed);
      } catch (e) {
        console.warn("Could not parse conversations history:", e);
      }
    }
    if (storedActive) {
      setActiveConversationId(storedActive);
    }
    if (storedRecent) {
      try {
        setRecentPrompts(JSON.parse(storedRecent));
      } catch (e) {}
    }
    if (storedFont) {
      setFontScale(storedFont as any);
    }

    // Init speech recognition for input dictation
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      const speechLangMap: Record<string, string> = {
        ar: 'ar-SA',
        en: 'en-US',
        fr: 'fr-FR',
        es: 'es-ES',
        de: 'de-DE',
        zh: 'zh-CN',
        ja: 'ja-JP'
      };
      rec.lang = speechLangMap[lang] || 'en-US';

      rec.onstart = () => setIsDictating(true);
      rec.onend = () => setIsDictating(false);
      rec.onerror = () => setIsDictating(false);
      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        if (resultText) {
          setChatInput(prev => (prev ? prev + " " + resultText : resultText));
          playSynthSound(900, "sine", 0.08);
        }
      };
      setDictationRecognition(rec);
    }
  }, [lang]);

  // Sync conversations to LocalStorage
  const saveConversations = (updated: ChatThread[]) => {
    setConversations(updated);
    localStorage.setItem("lumo_cosmic_conversations", JSON.stringify(updated));
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Escape to close
      if (e.key === "Escape") {
        if (isVoiceLiveOpen) {
          setIsVoiceLiveOpen(false);
        } else {
          toggleAssistant();
        }
      }

      // Ctrl + Shift + N for New Chat
      if (e.ctrlKey && e.shiftKey && e.key === "N") {
        e.preventDefault();
        handleCreateNewConversation();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, conversations, isVoiceLiveOpen]);

  // Drag constraints for floating action button
  const [dragLimits, setDragLimits] = useState({ left: -400, right: 10, top: -500, bottom: 10 });

  useEffect(() => {
    const updateLimits = () => {
      if (typeof window !== "undefined") {
        setDragLimits({
          left: -window.innerWidth + 100,
          right: 10,
          top: -window.innerHeight + 100,
          bottom: 10
        });
      }
    };
    updateLimits();
    window.addEventListener("resize", updateLimits);
    return () => window.removeEventListener("resize", updateLimits);
  }, []);

  // Auto scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, activeConversationId, loading]);

  // Auto generate welcome conversation if empty and opened
  useEffect(() => {
    if (isOpen && conversations.length === 0) {
      handleCreateNewConversation();
    }
  }, [isOpen, conversations]);

  // Stop speech synthesis on close
  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setSpeechStatus("idle");
      setActiveSpeechMsgId(null);
    }
  }, [isOpen]);

  // Helper: toggle assistant
  const toggleAssistant = () => {
    playSynthSound(isOpen ? 400 : 800, "sine", 0.12);
    setIsOpen(!isOpen);
    setApiError(null);
  };

  // 2. CONVERSATION HISTORIES OPERATIONS
  const handleCreateNewConversation = () => {
    const newId = `thread_${Date.now()}`;
    const welcomeText = lang === "ar"
      ? "مرحباً بك يا مستكشف الكون! 🌌 أنا مرشدك الذكي Lodavia Premium AI. كيف يمكنني إشعال شغفك اليوم؟"
      : "Welcome, cosmic explorer! 🌌 I am your upgraded Lodavia Premium AI Guide. How can I inspire your journey today?";
    
    const newThread: ChatThread = {
      id: newId,
      title: lang === "ar" ? "محادثة كونية جديدة" : "New Cosmic Conversation",
      isPinned: false,
      updatedAt: new Date().toLocaleDateString(),
      messages: [
        {
          id: `msg_welcome_${Date.now()}`,
          role: "model",
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]
    };

    const updated = [newThread, ...conversations];
    saveConversations(updated);
    setActiveConversationId(newId);
    localStorage.setItem("lumo_cosmic_active_thread_id", newId);
    playSynthSound(900, "sine", 0.15);
    setAttachedFiles([]);
    setApiError(null);
  };

  const handleSelectThread = (id: string) => {
    setActiveConversationId(id);
    localStorage.setItem("lumo_cosmic_active_thread_id", id);
    playSynthSound(600, "sine", 0.08);
    setShowHistoryPanel(false);
    setAttachedFiles([]);
    setApiError(null);
  };

  const handleDeleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    saveConversations(updated);
    playSynthSound(300, "sawtooth", 0.12);

    if (activeConversationId === id) {
      if (updated.length > 0) {
        setActiveConversationId(updated[0].id);
        localStorage.setItem("lumo_cosmic_active_thread_id", updated[0].id);
      } else {
        setActiveConversationId("");
        localStorage.removeItem("lumo_cosmic_active_thread_id");
      }
    }
  };

  const handleTogglePinThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.map(c => {
      if (c.id === id) {
        return { ...c, isPinned: !c.isPinned };
      }
      return c;
    });
    // Sort so pinned are at the top
    const sorted = [...updated].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
    saveConversations(sorted);
    playSynthSound(850, "sine", 0.06);
  };

  const handleStartRenameThread = (thread: ChatThread, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingThreadId(thread.id);
    setEditTitleText(thread.title);
  };

  const handleSaveRenameThread = (id: string) => {
    if (!editTitleText.trim()) return;
    const updated = conversations.map(c => {
      if (c.id === id) {
        return { ...c, title: editTitleText.trim() };
      }
      return c;
    });
    saveConversations(updated);
    setEditingThreadId(null);
    playSynthSound(700, "sine", 0.08);
  };

  // 3. ATTACHMENTS & DRAG AND DROP HANDLER
  const processUploadedFile = (file: File) => {
    if (!file) return;

    // Check sizes - maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert(lang === "ar" ? "أقصى حجم للملف هو 5 ميجابايت." : "Max file size is 5MB.");
      return;
    }

    const reader = new FileReader();

    // Check if it's an image
    if (file.type.startsWith("image/")) {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAttachedFiles(prev => [...prev, {
          name: file.name,
          type: "image",
          size: file.size,
          base64
        }]);
        playSynthSound(800, "sine", 0.1);
      };
      reader.readAsDataURL(file);
    } else {
      // It's a document (PDF, TXT, etc.)
      reader.onloadend = () => {
        const textContent = reader.result as string;
        setAttachedFiles(prev => [...prev, {
          name: file.name,
          type: file.type.includes("pdf") ? "pdf" : "document",
          size: file.size,
          content: textContent
        }]);
        playSynthSound(750, "sine", 0.1);
      };
      // Read as text
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleRemoveAttachedFile = (idx: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
    playSynthSound(300, "sawtooth", 0.08);
  };

  // 4. DICTATION (STT) HANDLER
  const handleToggleDictation = () => {
    if (!dictationRecognition) {
      alert(lang === "ar" ? "التعرف على الصوت غير مدعوم في متصفحك." : "Speech recognition is not supported in this browser.");
      return;
    }

    if (isDictating) {
      dictationRecognition.stop();
      playSynthSound(300, "sine", 0.08);
    } else {
      dictationRecognition.start();
      playSynthSound(800, "sine", 0.08);
    }
  };

  // 5. NATIVE LODAVIA COSMIC VOICE (WEB SPEECH API)
  const sanitizeTextForSpeech = (rawText: string, isAr: boolean): string => {
    return rawText
      .replace(/```[\s\S]*?```/g, isAr ? "كود برمجي" : "code block")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/[*#_~>\[\]()]/g, " ")
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const handleSpeakText = (rawText: string, msgId: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setApiError(
        lang === "ar"
          ? "ميزة القراءة الصوتية غير مدعومة في متصفحك الحالي."
          : "Native speech synthesis is not supported in this browser."
      );
      return;
    }

    const synth = window.speechSynthesis;

    // Toggle play/pause if clicking the same message
    if (activeSpeechMsgId === msgId) {
      if (speechStatus === "playing") {
        synth.pause();
        setSpeechStatus("paused");
        if (playSynthSound) playSynthSound(500, "sine", 0.05);
        return;
      } else if (speechStatus === "paused") {
        synth.resume();
        setSpeechStatus("playing");
        if (playSynthSound) playSynthSound(700, "sine", 0.05);
        return;
      }
    }

    // Stop any active speech
    synth.cancel();

    const isArabic = /[\u0600-\u06FF]/.test(rawText) || lang === "ar";
    const cleanText = sanitizeTextForSpeech(rawText, isArabic);

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isArabic ? "ar-SA" : "en-US";
    utterance.pitch = voiceSettings.pitch; // Lodavia cosmic pitch (1.15)
    utterance.rate = voiceSettings.rate;   // Lodavia cosmic rate (1.05)

    // Try to pick best available native voice
    const voices = synth.getVoices();
    if (voices && voices.length > 0) {
      const matchedVoice = voices.find(v =>
        isArabic
          ? (v.lang.startsWith("ar") || v.name.toLowerCase().includes("arabic"))
          : (v.lang.startsWith("en") || v.name.toLowerCase().includes("english"))
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    utterance.onstart = () => {
      setSpeechStatus("playing");
      setActiveSpeechMsgId(msgId);
      setActiveSpeechText(cleanText);
    };

    utterance.onpause = () => {
      setSpeechStatus("paused");
    };

    utterance.onresume = () => {
      setSpeechStatus("playing");
    };

    utterance.onend = () => {
      setSpeechStatus("idle");
      setActiveSpeechMsgId(null);
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      setSpeechStatus("idle");
      setActiveSpeechMsgId(null);
    };

    if (playSynthSound) playSynthSound(800, "sine", 0.05);
    synth.speak(utterance);
  };

  const handlePauseSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setSpeechStatus("paused");
      if (playSynthSound) playSynthSound(500, "sine", 0.05);
    }
  };

  const handleResumeSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setSpeechStatus("playing");
      } else if (activeSpeechMsgId && activeSpeechText) {
        handleSpeakText(activeSpeechText, activeSpeechMsgId);
      }
      if (playSynthSound) playSynthSound(700, "sine", 0.05);
    }
  };

  const handleStopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeechStatus("idle");
    setActiveSpeechMsgId(null);
    if (playSynthSound) playSynthSound(400, "sine", 0.05);
  };

  // 6. CUSTOM TYPEWRITER STREAMER
  const simulateStreaming = (originalText: string, threadId: string, msgId: string) => {
    let currentIdx = 0;
    const words = originalText.split(" ");
    let typedText = "";
    
    // Dynamically chunk words so total animation never exceeds ~0.8s
    const stepSize = Math.max(1, Math.ceil(words.length / 30));
    const intervalMs = 15; // ultra fast fluid speed

    const timer = setInterval(() => {
      if (currentIdx >= words.length) {
        clearInterval(timer);
        // Mark streaming finished
        setConversations(prev => prev.map(c => {
          if (c.id === threadId) {
            return {
              ...c,
              messages: c.messages.map(m => {
                if (m.id === msgId) {
                  return { ...m, text: originalText, isStreaming: false };
                }
                return m;
              })
            };
          }
          return c;
        }));

        // Auto-speak if enabled in user preferences
        if (voiceSettings.autoSpeak) {
          setTimeout(() => {
            handleSpeakText(originalText, msgId);
          }, 200);
        }

        return;
      }

      const nextBatch = words.slice(currentIdx, currentIdx + stepSize).join(" ");
      typedText += (currentIdx === 0 ? "" : " ") + nextBatch;
      currentIdx += stepSize;

      setConversations(prev => prev.map(c => {
        if (c.id === threadId) {
          return {
            ...c,
            messages: c.messages.map(m => {
              if (m.id === msgId) {
                return { ...m, text: typedText };
              }
              return m;
            })
          };
        }
        return c;
      }));
    }, intervalMs);
  };

  // 7. MESSAGE SENDER & REGENERATOR
  const handleSendMessage = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    if (loading) return;
    
    const userPrompt = customPrompt ? customPrompt.trim() : chatInput.trim();
    if (!userPrompt && attachedFiles.length === 0) {
      setApiError(lang === "ar" ? "يرجى كتابة رسالة أو إرفاق ملف للبدء." : "Please type a message or attach a file.");
      return;
    }

    setLoading(true);
    setChatInput("");
    setApiError(null);
    playSynthSound(600, "sine", 0.08);

    // Save prompt to recently used
    if (userPrompt && !recentPrompts.includes(userPrompt)) {
      const updatedRecent = [userPrompt, ...recentPrompts.slice(0, 5)];
      setRecentPrompts(updatedRecent);
      localStorage.setItem("lumo_cosmic_recent_prompts", JSON.stringify(updatedRecent));
    }

    // Attachments details
    const activeFiles = [...attachedFiles];
    setAttachedFiles([]);

    const activeThreadId = activeConversationId || `thread_${Date.now()}`;
    const userMsgId = `msg_${Date.now()}_user`;
    const modelMsgId = `msg_${Date.now()}_model`;

    const imageAttachment = activeFiles.find(f => f.type === "image");
    const docAttachment = activeFiles.find(f => f.type !== "image");

    let finalPromptText = userPrompt;
    
    // If a document was uploaded, inject text or details
    if (docAttachment) {
      if (docAttachment.content) {
        finalPromptText = `[Attached Document: ${docAttachment.name}]\n=== CONTENT START ===\n${docAttachment.content.substring(0, 6000)}\n=== CONTENT END ===\n\nUser request: ${userPrompt || "Analyze this document and summarize its content."}`;
      } else {
        finalPromptText = `[Attached Binary Document: ${docAttachment.name} (${Math.round(docAttachment.size / 1024)} KB)]\n\nUser request: ${userPrompt || "Analyze this document details."}`;
      }
    }

    const currentMsgTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Create message list updates
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      text: userPrompt || (lang === "ar" ? "تحليل الملف المرفق 📂" : "Analyze attached file 📂"),
      timestamp: currentMsgTimestamp,
      image: imageAttachment?.base64 || undefined
    };

    const newModelMsg: ChatMessage = {
      id: modelMsgId,
      role: "model",
      text: lang === "ar" ? "جارٍ التفكير والإجابة..." : "Thinking...",
      timestamp: currentMsgTimestamp,
      isStreaming: true
    };

    let updatedThreads = conversations;
    if (conversations.length === 0 || !activeConversationId) {
      const newThread: ChatThread = {
        id: activeThreadId,
        title: userPrompt.substring(0, 24) || (lang === "ar" ? "محادثة مخصصة" : "Custom chat"),
        isPinned: false,
        updatedAt: new Date().toLocaleDateString(),
        messages: [newUserMsg, newModelMsg]
      };
      updatedThreads = [newThread, ...conversations];
      setActiveConversationId(activeThreadId);
      localStorage.setItem("lumo_cosmic_active_thread_id", activeThreadId);
    } else {
      updatedThreads = conversations.map(c => {
        if (c.id === activeThreadId) {
          // Update title if it was the default "New Cosmic Conversation"
          const title = c.title.includes("Conversation") || c.title.includes("محادثة")
            ? (userPrompt.substring(0, 28) + (userPrompt.length > 28 ? "..." : ""))
            : c.title;

          return {
            ...c,
            title,
            updatedAt: new Date().toLocaleDateString(),
            messages: [...c.messages, newUserMsg, newModelMsg]
          };
        }
        return c;
      });
    }

    saveConversations(updatedThreads);

    try {
      let response;
      if (imageAttachment) {
        response = await fetch("/api/ai/analyze-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: imageAttachment.base64,
            prompt: userPrompt,
            lang
          })
        });
      } else {
        // Find past messages in thread (excluding current turn: newUserMsg and newModelMsg)
        const currentThread = updatedThreads.find(t => t.id === activeThreadId);
        const priorMessages = currentThread ? currentThread.messages.slice(0, -2) : [];
        const history = priorMessages
          .filter(h => h.text && h.text.trim() && h.text !== "..." && !h.isStreaming)
          .slice(-8); // send last 8 completed turns

        response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: finalPromptText,
            lang,
            history: history.map(h => ({ role: h.role, text: h.text })),
            context: {
              user: currentUser,
              activeTab,
            }
          })
        });
      }

      let data: any = {};
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error(lang === "ar"
          ? "تعذر الاتصال بخادم الذكاء الاصطناعي (استجابة غير صالحة). يرجى إعادة المحاولة."
          : "Failed to connect to AI server (invalid response format). Please retry.");
      }

      if (response.status === 403 || response.status === 429 || data.error === 'SUBSCRIPTION_REQUIRED' || data.error === 'QUOTA_EXCEEDED') {
        setRequiredModalTier(data.minTier || 'pro');
        setModalFeatureTitle(lang === "ar" ? "رصيد استخدام الذكاء الاصطناعي" : "AI Quota Upgrade");
        setShowUpgradeModal(true);
        throw new Error(lang === "ar" ? (data.messageAr || data.messageEn || data.error) : (data.messageEn || data.messageAr || data.error));
      }

      if (!response.ok || data.error) {
        const errorMsg = lang === "ar"
          ? (data.messageAr || data.message || data.error || "خطأ في الاتصال بالخادم")
          : (data.messageEn || data.message || data.error || "Server connection error");
        throw new Error(errorMsg);
      }

      if (!data.text || typeof data.text !== "string" || !data.text.trim()) {
        throw new Error(lang === "ar" 
          ? "لم يتم استلام رد من نموذج الذكاء الاصطناعي." 
          : "No text returned from AI model.");
      }

      // Record daily usage increment in client state
      recordUsage(currentUser);

      // Successfully received full text. Now trigger smooth character typewriter animation!
      simulateStreaming(data.text, activeThreadId, modelMsgId);
      playSynthSound(1000, "sine", 0.15);

    } catch (err: any) {
      console.error("AI Chat Error:", err);
      let displayErrMsg = err?.message;
      if (!displayErrMsg || displayErrMsg === "Failed to fetch" || displayErrMsg.includes("fetch")) {
        displayErrMsg = lang === "ar"
          ? "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت وإعادة المحاولة."
          : "Could not connect to server. Please check your network connection and retry.";
      }
      
      setApiError(displayErrMsg);

      // Update model text in state with error message
      setConversations(prev => prev.map(c => {
        if (c.id === activeThreadId) {
          return {
            ...c,
            messages: c.messages.map(m => {
              if (m.id === modelMsgId) {
                return { ...m, text: displayErrMsg, isStreaming: false };
              }
              return m;
            })
          };
        }
        return c;
      }));
      playSynthSound(150, "sawtooth", 0.3);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateResponse = async () => {
    const thread = conversations.find(t => t.id === activeConversationId);
    if (!thread || thread.messages.length < 2) return;

    // Find the last user message text
    const rev = [...thread.messages].reverse();
    const lastUserMsg = rev.find(m => m.role === "user");
    if (!lastUserMsg) return;

    // Delete the last model response and send again
    const updatedMsgs = thread.messages.filter(m => m.id !== thread.messages[thread.messages.length - 1].id);
    setConversations(prev => prev.map(c => {
      if (c.id === activeConversationId) {
        return { ...c, messages: updatedMsgs };
      }
      return c;
    }));

    // Trigger sending again
    await handleSendMessage(undefined, lastUserMsg.text);
  };

  // 8. OTHER CORE ACTIONS (Copy, Share, Join Community)
  const handleCopyMessage = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    playSynthSound(1300, "sine", 0.1);
    
    // Temporary feedback
    const icon = document.getElementById(`copy-icon-${msgId}`);
    if (icon) {
      const orig = icon.innerHTML;
      icon.innerHTML = `<span class="text-emerald-400 font-bold">✓</span>`;
      setTimeout(() => { icon.innerHTML = orig; }, 2000);
    }
  };

  const handleShareMessage = (text: string) => {
    const shareText = `Shared from Lodavia AI Cosmic Assistant:\n\n"${text}"\n\nJoin Lodavia premium experiences now! 🪐`;
    navigator.clipboard.writeText(shareText);
    playSynthSound(1100, "sine", 0.1);
    alert(lang === "ar" ? "تم نسخ رابط المشاركة الفلكي والمحتوى بنجاح!" : "Cosmic share card copied to clipboard!");
  };

  const handleGeneratePost = async () => {
    if (!postTopic.trim() || loading) return;
    setLoading(true);
    setGeneratedPost("");
    playSynthSound(500, "sine", 0.1);

    try {
      const response = await fetch("/api/ai/write-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: postTopic,
          tone: postTone,
          lang
        })
      });
      const data = await response.json();
      setGeneratedPost(data.text || "");
      playSynthSound(1000, "sine", 0.2);
    } catch (err) {
      console.error(err);
      setGeneratedPost(lang === "ar" ? "فشل توليد المنشور. يرجى التحقق من الاتصال." : "Failed to generate post. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!toolText.trim() || loading) return;
    setLoading(true);
    setTranslatedText("");
    playSynthSound(550, "sine", 0.1);

    try {
      const targetLang = translationDirection === "to_ar" ? "ar" : "en";
      const response = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: toolText, targetLang })
      });
      const data = await response.json();
      setTranslatedText(data.text || "");
      playSynthSound(850, "sine", 0.15);
    } catch (err) {
      console.error(err);
      setTranslatedText(lang === "ar" ? "تعذر إتمام الترجمة الكونية." : "Could not complete cosmic translation.");
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    let textToSummarize = toolText;

    if (summarizeSource === "home_feed") {
      textToSummarize = "Here is the current home feed discussions:\n";
      textToSummarize += lang === "ar" 
        ? "نقاشات متميزة للمطورين حول تصميم الواجهات بأسلوب نيومورفيزم تساهم في الارتقاء بتجربة المستخدم وصوتيات الميتافيرس." 
        : "Developer pathways discussions about glassmorphism designs, metaverse voice rooms, and premium UI engineering.";
    }

    if (!textToSummarize.trim() || loading) return;
    setLoading(true);
    setSummarizedText("");
    playSynthSound(550, "sine", 0.1);

    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: textToSummarize, lang })
      });
      const data = await response.json();
      setSummarizedText(data.text || "");
      playSynthSound(1100, "sine", 0.2);
    } catch (err) {
      console.error(err);
      setSummarizedText(lang === "ar" ? "تعذر تلخيص المحتوى." : "Failed to summarize content.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadRecommendations = async () => {
    if (recsLoading) return;
    setRecsLoading(true);
    playSynthSound(700, "sine", 0.1);

    try {
      const avail = communities.map(c => ({ id: c.id, name: c.name, description: c.description, category: c.category }));
      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: currentUser,
          lang,
          availableCommunities: avail
        })
      });
      const data = await response.json();
      setRecommendations(data);
      playSynthSound(1200, "sine", 0.25);
    } catch (err) {
      console.error(err);
    } finally {
      setRecsLoading(false);
    }
  };

  useEffect(() => {
    if (activePanel === "orbit" && !recommendations) {
      handleLoadRecommendations();
    }
  }, [activePanel]);

  const handleApplyPostToCreate = () => {
    if (!generatedPost) return;
    playSynthSound(950, "sine", 0.15);
    setNewPostText(generatedPost);
    setShowCreateModal(true);
    setIsOpen(false);
  };

  const handleJoinRecommendedCommunity = (communityId: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        const isJoined = currentUser.joinedCommunities.includes(communityId);
        if (!isJoined) {
          currentUser.joinedCommunities.push(communityId);
        }
        return {
          ...c,
          membersCount: isJoined ? c.membersCount : c.membersCount + 1
        };
      }
      return c;
    }));
    playSynthSound(1100, "sine", 0.2);
  };

  // Find active chat thread
  const activeThread = conversations.find(c => c.id === activeConversationId);
  
  // Search threads
  const filteredConversations = conversations.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const inTitle = c.title.toLowerCase().includes(q);
    const inMsgs = c.messages.some(m => m.text.toLowerCase().includes(q));
    return inTitle || inMsgs;
  });

  // Font sizing helper class
  const getFontSizeClass = () => {
    if (fontScale === "medium") return "text-sm";
    if (fontScale === "large") return "text-base";
    return "text-xs";
  };

  return (
    <>
      {/* Floating Action Button - Interactive Lodavia Mascot Companion */}
      <motion.button
        id="lodavia-ai-fab"
        drag
        dragConstraints={dragLimits}
        dragElastic={0.15}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92, rotate: -4 }}
        onClick={handleFabClick}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 p-1.5 rounded-full bg-white/90 dark:bg-slate-950/90 border-2 border-sky-400/80 dark:border-cyan-400/40 shadow-xl dark:shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center justify-center cursor-grab active:cursor-grabbing group touch-none select-none backdrop-blur-md"
        aria-label="Lodavia Mascot AI"
      >
        <LodaviaMascot
          gender={mascotConfig.gender}
          skin={mascotConfig.skin}
          size={56}
          animated={true}
          interactive={false}
          showAura={true}
        />
        <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-3 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-cyan-500/30 text-[9.5px] font-bold text-slate-800 dark:text-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-2xl backdrop-blur-md">
          {lang === "ar"
            ? `🪐 رفيقك الكوني (${mascotConfig.gender === 'male' ? 'لوماً' : 'نوفا'}) - اضغط للتحدث`
            : `🪐 Lodavia Companion (${mascotConfig.gender === 'male' ? 'Lumo' : 'Nova'}) - Tap to talk`}
        </div>
      </motion.button>

      {/* Side-out Glassmorphism Assistant Overlay Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm pointer-events-auto">
            <div className="absolute inset-0 cursor-pointer" onClick={toggleAssistant} />

            <motion.div
              id="lodavia-ai-sidebar"
              ref={sidebarRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-lg md:max-w-xl h-full bg-white dark:bg-gradient-to-b dark:from-slate-950/95 dark:via-purple-950/90 dark:to-slate-950/95 border-l border-slate-200 dark:border-purple-500/20 shadow-[-10px_0_40px_rgba(0,0,0,0.3)] dark:shadow-[-10px_0_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col z-10 text-slate-900 dark:text-white"
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              {/* Sparkle Header */}
              <div className="p-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50/80 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-xl bg-slate-900 border border-cyan-500/30 text-white shadow-md flex items-center justify-center shrink-0">
                    <LodaviaMascot 
                      gender={mascotConfig.gender} 
                      skin={mascotConfig.skin} 
                      size={32} 
                      animated={true} 
                      interactive={true} 
                      showAura={true}
                      isThinking={loading}
                      isSpeaking={speechStatus === 'playing'}
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5 select-none">
                      <span>{lang === "ar" ? "مساعد لودافيا بريميوم" : "Lodavia Premium AI"}</span>
                      <span className="text-[8px] bg-sky-500/10 text-sky-600 dark:bg-cyan-400/20 dark:text-cyan-300 py-0.5 px-2 rounded-full border border-sky-500/20 dark:border-cyan-400/30 font-black uppercase tracking-wider">
                        Live 3.5
                      </span>
                      <button
                        onClick={() => {
                          setRequiredModalTier('pro');
                          setModalFeatureTitle(lang === "ar" ? "اشتراكات الذكاء الاصطناعي" : "AI Subscription");
                          setShowUpgradeModal(true);
                        }}
                        className={`text-[8px] py-0.5 px-2 rounded-full font-black uppercase tracking-wider cursor-pointer transition-transform hover:scale-105 border ${
                          (currentUser.subscription?.tier || 'free') === 'ultra'
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40'
                            : (currentUser.subscription?.tier || 'free') === 'pro'
                            ? 'bg-sky-500/15 text-sky-700 dark:bg-purple-500/20 dark:text-purple-300 border-sky-300 dark:border-purple-500/40'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-white/10 hover:border-sky-500 dark:hover:border-cyan-400/50'
                        }`}
                      >
                        {(currentUser.subscription?.tier || 'free').toUpperCase()} • {lang === "ar" ? "ترقية 🔥" : "Upgrade 🔥"}
                      </button>
                    </h2>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 select-none">
                      {lang === "ar" ? "أداء خارق، صوتيات متقدمة، وتحليل شامل للملفات" : "Ultra-fast streaming, Live Voice, and Document analysis"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  {/* Accessibility Font scale setting */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      title={lang === "ar" ? "تعديل حجم الخط" : "Aesthetic Settings"}
                    >
                      <Sliders className="w-4 h-4" />
                    </button>
                    {showSettingsDropdown && (
                      <div className={`absolute top-full mt-2 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-2.5 rounded-xl shadow-2xl z-50 w-36 space-y-1.5 ${lang === "ar" ? "left-0" : "right-0"}`}>
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                          {lang === "ar" ? "حجم الخط:" : "Font Scaling:"}
                        </span>
                        {[
                          { key: "standard", name: "Standard" },
                          { key: "medium", name: "Medium" },
                          { key: "large", name: "Large" }
                        ].map(sz => (
                          <button
                            key={sz.key}
                            onClick={() => {
                              setFontScale(sz.key as any);
                              localStorage.setItem("lumo_cosmic_font_scale", sz.key);
                              setShowSettingsDropdown(false);
                              playSynthSound(800, "sine", 0.05);
                            }}
                            className={`w-full text-left px-2 py-1 rounded text-[10px] flex items-center justify-between cursor-pointer ${fontScale === sz.key ? "bg-sky-100 dark:bg-purple-600/30 text-sky-900 dark:text-white font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"}`}
                          >
                            <span>{sz.name}</span>
                            {fontScale === sz.key && <Check className="w-3 h-3 text-sky-600 dark:text-purple-400" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Advanced Voice Mode Activation Button */}
                  <button
                    onClick={() => setIsVoiceLiveOpen(true)}
                    className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:bg-cyan-600/20 dark:text-cyan-300 border border-sky-500/20 dark:border-cyan-500/30 hover:bg-sky-500 hover:text-white dark:hover:bg-cyan-600 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] font-black tracking-wider uppercase"
                    title={lang === "ar" ? "الاتصال الصوتي لومو" : "Voice Live"}
                  >
                    <Headphones className="w-3.5 h-3.5 animate-bounce" />
                    <span className="hidden sm:inline">{lang === "ar" ? "مباشر" : "Live"}</span>
                  </button>

                  <button
                    onClick={toggleAssistant}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 dark:border-white/5 bg-slate-100/90 dark:bg-slate-950/50 p-2 gap-1 overflow-x-auto select-none">
                <button
                  onClick={() => { playSynthSound(500, "sine", 0.05); setActivePanel("chat"); }}
                  className={`flex-1 min-w-[80px] py-2 px-1 rounded-xl text-[11px] font-black tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    activePanel === "chat"
                      ? "bg-sky-500 text-white shadow-md dark:bg-gradient-to-tr dark:from-purple-600 dark:to-indigo-600 dark:shadow-purple-600/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{lang === "ar" ? "محادثات بريميوم" : "Premium Chat"}</span>
                </button>
                <button
                  onClick={() => { playSynthSound(500, "sine", 0.05); setActivePanel("post"); }}
                  className={`flex-1 min-w-[80px] py-2 px-1 rounded-xl text-[11px] font-black tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    activePanel === "post"
                      ? "bg-sky-500 text-white shadow-md dark:bg-gradient-to-tr dark:from-purple-600 dark:to-indigo-600 dark:shadow-purple-600/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === "ar" ? "صانع المنشورات" : "Post Wizard"}</span>
                </button>
                <button
                  onClick={() => { playSynthSound(500, "sine", 0.05); setActivePanel("tools"); }}
                  className={`flex-1 min-w-[80px] py-2 px-1 rounded-xl text-[11px] font-black tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    activePanel === "tools"
                      ? "bg-sky-500 text-white shadow-md dark:bg-gradient-to-tr dark:from-purple-600 dark:to-indigo-600 dark:shadow-purple-600/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  <span>{lang === "ar" ? "الترجمة والتلخيص" : "Translator"}</span>
                </button>
                <button
                  onClick={() => { playSynthSound(500, "sine", 0.05); setActivePanel("orbit"); }}
                  className={`flex-1 min-w-[80px] py-2 px-1 rounded-xl text-[11px] font-black tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    activePanel === "orbit"
                      ? "bg-sky-500 text-white shadow-md dark:bg-gradient-to-tr dark:from-purple-600 dark:to-indigo-600 dark:shadow-purple-600/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
                  }`}
                >
                  <Orbit className="w-4 h-4 animate-spin-slow" />
                  <span>{lang === "ar" ? "مداري الكوني" : "Cosmic Orbit"}</span>
                </button>
                <button
                  onClick={() => { playSynthSound(500, "sine", 0.05); setActivePanel("mascot"); }}
                  className={`flex-1 min-w-[80px] py-2 px-1 rounded-xl text-[11px] font-black tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    activePanel === "mascot"
                      ? "bg-sky-500 text-white shadow-md dark:bg-gradient-to-tr dark:from-purple-600 dark:to-indigo-600 dark:shadow-purple-600/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <LodaviaMascot gender={mascotConfig.gender} skin={mascotConfig.skin} size={20} animated={false} interactive={false} showAura={false} />
                  </div>
                  <span>{lang === "ar" ? "الرفيق والمظاهر" : "Companion & Skins"}</span>
                </button>
              </div>

              {/* Main Active Panel Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
                
                {/* Drag and Drop Hover overlay */}
                {isDraggingOver && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="absolute inset-0 bg-purple-950/90 backdrop-blur-md border-4 border-dashed border-purple-500 rounded-2xl flex flex-col items-center justify-center p-6 text-center z-50 space-y-4 m-2"
                  >
                    <UploadCloud className="w-16 h-16 text-cyan-400 animate-bounce" />
                    <h3 className="text-lg font-black text-white">
                      {lang === "ar" ? "أفلت ملفاتك للتحليل الكوني 🌌" : "Drop files to analyze instantly 🌌"}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm">
                      {lang === "ar" ? "ندعم الصور والملفات النصية والـ PDF لتحليل متعدد الوسائط ذكي" : "Supports images, plain text documents, and PDFs for full AI processing context."}
                    </p>
                  </div>
                )}

                {/* 1. CHAT PANEL */}
                {activePanel === "chat" && (
                  <div
                    onDragOver={handleDragOver}
                    className="h-full flex flex-col justify-between -m-4"
                  >
                    
                    {/* Sliding Conversations History Drawer overlay inside Sidebar */}
                    <AnimatePresence>
                      {showHistoryPanel && (
                        <motion.div
                          initial={{ x: "-100%" }}
                          animate={{ x: 0 }}
                          exit={{ x: "-100%" }}
                          className="absolute inset-y-0 left-0 w-80 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/5 z-40 p-4 flex flex-col justify-between shadow-2xl text-slate-900 dark:text-white"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                              <span className="text-xs font-black uppercase text-sky-600 dark:text-purple-400 font-mono tracking-widest flex items-center gap-1.5">
                                <MessageSquare className="w-4 h-4" />
                                {lang === "ar" ? "سجل المحادثات" : "Chat History"}
                              </span>
                              <button
                                onClick={() => setShowHistoryPanel(false)}
                                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Search conversations */}
                            <div className="relative">
                              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                              <input
                                type="text"
                                placeholder={lang === "ar" ? "ابحث في المحادثات..." : "Search discussions..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-2 pl-9 pr-4 bg-slate-100 dark:bg-white/5 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/5 focus:border-sky-500 dark:focus:border-purple-500/40 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
                              />
                            </div>

                            {/* New Chat Button in History */}
                            <button
                              onClick={() => {
                                handleCreateNewConversation();
                                setShowHistoryPanel(false);
                              }}
                              className="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-600 dark:bg-purple-600/20 dark:hover:bg-purple-600 border border-sky-500/30 dark:border-purple-500/30 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                            >
                              <Plus className="w-4 h-4" />
                              <span>{lang === "ar" ? "محادثة جديدة" : "New Chat"}</span>
                            </button>

                            {/* List of chat threads */}
                            <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/5">
                              {filteredConversations.map((thread) => (
                                <div
                                  key={thread.id}
                                  onClick={() => handleSelectThread(thread.id)}
                                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                                    activeConversationId === thread.id
                                      ? "bg-sky-50 dark:bg-purple-600/15 border-sky-300 dark:border-purple-500/40 text-sky-900 dark:text-white"
                                      : "bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200"
                                  }`}
                                >
                                  <div className="flex-1 min-w-0 flex items-center gap-1.5">
                                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                                    {editingThreadId === thread.id ? (
                                      <input
                                        type="text"
                                        value={editTitleText}
                                        onChange={(e) => setEditTitleText(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") handleSaveRenameThread(thread.id);
                                        }}
                                        className="bg-white dark:bg-black/60 text-xs text-slate-900 dark:text-white p-1 rounded border border-sky-500 dark:border-purple-500 focus:outline-none w-full"
                                      />
                                    ) : (
                                      <span className="text-xs truncate block font-sans font-medium">
                                        {thread.title}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {/* Inline Save button if renaming */}
                                    {editingThreadId === thread.id ? (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleSaveRenameThread(thread.id); }}
                                        className="p-1 hover:text-emerald-500 text-slate-500"
                                      >
                                        <Check className="w-3 h-3" />
                                      </button>
                                    ) : (
                                      <>
                                        {/* Pin Button */}
                                        <button
                                          onClick={(e) => handleTogglePinThread(thread.id, e)}
                                          className={`p-0.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 ${thread.isPinned ? "text-sky-500 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500"}`}
                                          title={thread.isPinned ? "Unpin" : "Pin"}
                                        >
                                          <Pin className="w-3 h-3" />
                                        </button>
                                        {/* Rename Button */}
                                        <button
                                          onClick={(e) => handleStartRenameThread(thread, e)}
                                          className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white"
                                          title="Rename"
                                        >
                                          <Edit3 className="w-3 h-3" />
                                        </button>
                                        {/* Delete Button */}
                                        <button
                                          onClick={(e) => handleDeleteThread(thread.id, e)}
                                          className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                                          title="Delete"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {filteredConversations.length === 0 && (
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center py-4">
                                  {lang === "ar" ? "لا توجد محادثات مطابقة" : "No matching chats"}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Chat Messages Panel */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-225px)]">
                      
                      {/* Active conversation control header */}
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                        <button
                          onClick={() => { playSynthSound(500, "sine", 0.05); setShowHistoryPanel(true); }}
                          className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{lang === "ar" ? "المحفوظات" : "History"}</span>
                        </button>
                        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px] font-mono">
                          {activeThread ? activeThread.title : (lang === "ar" ? "جاري التمكين..." : "Starting...")}
                        </span>
                        <button
                          onClick={handleCreateNewConversation}
                          className="p-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 dark:bg-gradient-to-r dark:from-purple-600 dark:to-indigo-600 text-white hover:scale-105 active:scale-95 transition-all text-[10px] font-black flex items-center gap-1 cursor-pointer shadow-sm"
                          title="New Chat"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{lang === "ar" ? "جديد" : "New Chat"}</span>
                        </button>
                      </div>

                      {/* Messages rendering */}
                      {activeThread && activeThread.messages.length > 0 ? (
                        activeThread.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex gap-3 max-w-[90%] ${
                              msg.role === "user" ? (lang === "ar" ? "mr-auto flex-row-reverse" : "ml-auto flex-row-reverse") : ""
                            }`}
                          >
                            {msg.role !== "user" && (
                              <div className="w-8 h-8 rounded-full bg-slate-900 border border-cyan-500/30 text-white flex items-center justify-center shrink-0 shadow select-none overflow-hidden">
                                <LodaviaMascot 
                                  gender={mascotConfig.gender} 
                                  skin={mascotConfig.skin} 
                                  size={28} 
                                  animated={true} 
                                  interactive={false} 
                                  showAura={false}
                                  isThinking={msg.isStreaming}
                                  isSpeaking={activeSpeechMsgId === msg.id && speechStatus === 'playing'}
                                />
                              </div>
                            )}
                            <div
                              className={`p-3.5 rounded-2xl leading-relaxed relative group ${
                                msg.role === "user"
                                  ? "bg-sky-500 text-white dark:bg-gradient-to-r dark:from-purple-600 dark:to-indigo-600 rounded-tr-none shadow-sm"
                                  : "bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-white/5 rounded-tl-none shadow-sm"
                              }`}
                            >
                              {/* Message Text with customized markdown and syntax coloring */}
                              <MarkdownRenderer text={msg.text} fontSizeClass={getFontSizeClass()} />
                              
                              {/* Attached Image inside conversation bubble */}
                              {msg.image && (
                                <div className="mt-2.5 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 relative group bg-slate-200/50 dark:bg-black/25">
                                  <img 
                                    src={msg.image} 
                                    alt="Cosmic context" 
                                    className="max-w-full max-h-48 object-contain rounded-lg mx-auto" 
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              )}

                              <div className="flex items-center justify-between mt-2 gap-4">
                                <span className={`block text-[8px] select-none ${msg.role === "user" ? "text-white/80" : "text-slate-400 dark:text-white/30"}`}>
                                  {msg.timestamp}
                                </span>
                                
                                <div className={`flex items-center gap-1.5 transition-opacity ${activeSpeechMsgId === msg.id ? "opacity-100" : "opacity-90 sm:opacity-0 sm:group-hover:opacity-100"}`}>
                                  {/* Copy message button */}
                                  <button
                                    id={`copy-icon-${msg.id}`}
                                    onClick={() => handleCopyMessage(msg.text, msg.id)}
                                    className={`p-1 rounded transition-colors ${msg.role === "user" ? "hover:bg-white/20 text-white/80 hover:text-white" : "hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                                    title="Copy Response"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>

                                  {/* Share message button */}
                                  <button
                                    onClick={() => handleShareMessage(msg.text)}
                                    className={`p-1 rounded transition-colors ${msg.role === "user" ? "hover:bg-white/20 text-white/80 hover:text-white" : "hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                                    title="Share Card"
                                  >
                                    <Share2 className="w-3 h-3" />
                                  </button>

                                  {/* Voice speech synthesis toggle */}
                                  {msg.role !== "user" && (
                                    <button
                                      onClick={() => handleSpeakText(msg.text, msg.id)}
                                      className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 transition-colors ${
                                        activeSpeechMsgId === msg.id 
                                          ? 'text-sky-600 dark:text-cyan-400 font-bold' 
                                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                      }`}
                                      title={
                                        activeSpeechMsgId === msg.id
                                          ? (speechStatus === 'playing' ? (lang === "ar" ? "إيقاف مؤقت" : "Pause") : (lang === "ar" ? "استئناف" : "Resume"))
                                          : (lang === "ar" ? "استماع للرد بصوت لودافيا 🔊" : "Speak response with Lodavia Voice 🔊")
                                      }
                                    >
                                      {activeSpeechMsgId === msg.id ? (
                                        speechStatus === 'playing' ? (
                                          <Pause className="w-3 h-3 animate-pulse text-sky-600 dark:text-cyan-400" />
                                        ) : (
                                          <Play className="w-3 h-3 text-sky-600 dark:text-cyan-400" />
                                        )
                                      ) : (
                                        <Volume2 className="w-3 h-3" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Welcome screenEmpty State Dashboard with Sugested Prompts bento cards
                        <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
                          <div className="p-5 rounded-3xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-gradient-to-b dark:from-purple-950/10 dark:to-transparent text-center space-y-3 shadow-sm">
                            <div className="w-12 h-12 bg-sky-500 dark:bg-gradient-to-tr dark:from-purple-600 dark:to-indigo-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold mx-auto shadow-md">
                              🌌
                            </div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white select-none">
                              {lang === "ar" ? `مرحباً بك يا ${currentUser.name} 🪐` : `Welcome, ${currentUser.name} 🪐`}
                            </h3>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 max-w-sm mx-auto select-none">
                              {lang === "ar" ? "أنت متصل الآن بمحرك لودافيا الكوني الممتاز. اختر اقتراحاً لبدء المغامرة الفكرية." : "You are connected to Lodavia's supercharged premium core. Select a query below to start exploring."}
                            </p>
                          </div>

                          <SuggestedPrompts
                            lang={lang}
                            onSelectPrompt={(text) => handleSendMessage(undefined, text)}
                            recentPrompts={recentPrompts}
                            onClearRecent={() => setRecentPrompts([])}
                            playSynthSound={playSynthSound}
                          />
                        </div>
                      )}

                      {/* Loading skeletons for response generation */}
                      {loading && (
                        <div className="flex gap-3 max-w-[85%] animate-pulse">
                          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-sm">
                            🌌
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-tl-none space-y-2 flex-1">
                            <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-1/3" />
                            <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-5/6" />
                            <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-2/3" />
                          </div>
                        </div>
                      )}

                      {/* Error State with Retry Button */}
                      {apiError && (
                        <div className="p-3.5 rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 text-[11px] text-red-700 dark:text-red-300 flex items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5">
                            <X className="w-4 h-4 text-red-500 shrink-0" />
                            <span>{apiError}</span>
                          </span>
                          <button
                            onClick={handleRegenerateResponse}
                            className="py-1 px-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>{lang === "ar" ? "إعادة المحاولة" : "Retry"}</span>
                          </button>
                        </div>
                      )}

                      <div ref={chatEndRef} />
                    </div>

                    {/* Image / Document Attachments Preview Drawer Queue */}
                    {attachedFiles.length > 0 && (
                      <div className="px-4 py-2.5 border-t border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-900/90 flex flex-wrap items-center gap-2 animate-[fadeIn_0.2s_ease-out] select-none">
                        {attachedFiles.map((file, i) => (
                          <div key={i} className="relative flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10 max-w-[150px]">
                            {file.type === "image" ? (
                              <img src={file.base64} alt="attached" className="w-6 h-6 object-cover rounded" />
                            ) : (
                              <Paperclip className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400 shrink-0" />
                            )}
                            <span className="text-[9px] text-slate-700 dark:text-slate-300 truncate flex-1">{file.name}</span>
                            <button
                              onClick={() => handleRemoveAttachedFile(i)}
                              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 rounded cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Active Lodavia Voice Control Dock Bar */}
                    {activeSpeechMsgId && (
                      <div className="px-3.5 py-2 border-t border-sky-500/30 dark:border-cyan-500/30 bg-slate-900/95 text-white flex items-center justify-between gap-2.5 shadow-md animate-[fadeIn_0.2s_ease-out] backdrop-blur-md select-none">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative flex items-center justify-center shrink-0">
                            <span className={`w-2.5 h-2.5 rounded-full bg-cyan-400 ${speechStatus === 'playing' ? 'animate-ping opacity-75' : 'opacity-40'}`} />
                            <span className="absolute w-2 h-2 rounded-full bg-cyan-300" />
                          </div>
                          <div className="min-w-0 flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 truncate">
                              {lang === "ar" ? "صوت لودافيا الكوني 🪐" : "Lodavia Voice 🪐"}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 shrink-0">
                              {speechStatus === 'playing' ? (lang === "ar" ? "جاري القراءة..." : "Speaking...") : (lang === "ar" ? "متوقف مؤقتاً" : "Paused")}
                            </span>
                          </div>
                        </div>

                        {/* Speech Action Controls */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {speechStatus === 'playing' ? (
                            <button
                              type="button"
                              onClick={handlePauseSpeech}
                              className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 cursor-pointer transition-all"
                              title={lang === "ar" ? "إيقاف مؤقت" : "Pause"}
                            >
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResumeSpeech}
                              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 cursor-pointer transition-all"
                              title={lang === "ar" ? "تشغيل" : "Play"}
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={handleStopSpeech}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer transition-all"
                            title={lang === "ar" ? "إيقاف نهائي" : "Stop"}
                          >
                            <Square className="w-3.5 h-3.5 fill-current" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowVoiceSettingsModal(true)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 cursor-pointer transition-all"
                            title={lang === "ar" ? "إعدادات الصوت الكوني" : "Voice Parameters"}
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Chat Input Bar */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/80 flex gap-2 items-center">
                      
                      {/* Paperclip attachment triggers */}
                      <input 
                        type="file" 
                        id="ai-universal-attachment-trigger" 
                        accept="image/*,.txt,.md,.json,.js,.py" 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                      <label 
                        htmlFor="ai-universal-attachment-trigger" 
                        className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center cursor-pointer transition-all shrink-0 shadow-2xs"
                        title={lang === "ar" ? "إرفاق صورة أو مستند 📎" : "Attach image or document 📎"}
                      >
                        <Paperclip className="w-4 h-4" />
                      </label>

                      {/* Dictation Voice Input Button */}
                      <button
                        type="button"
                        onClick={handleToggleDictation}
                        className={`p-2.5 rounded-xl border transition-all shrink-0 cursor-pointer ${
                          isDictating
                            ? "bg-red-500/20 border-red-500/40 text-red-500 dark:text-red-400 animate-pulse"
                            : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-2xs"
                        }`}
                        title={lang === "ar" ? "إدخال صوتي" : "Voice Dictate"}
                      >
                        <Mic className="w-4 h-4" />
                      </button>

                      {/* Cosmic Voice Settings Trigger */}
                      <button
                        type="button"
                        onClick={() => setShowVoiceSettingsModal(true)}
                        className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center cursor-pointer transition-all shrink-0 shadow-2xs"
                        title={lang === "ar" ? "إعدادات القراءة الصوتية" : "Voice Output Parameters"}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={lang === "ar" ? "اسأل لودافيا بريميوم أو اكتب..." : "Ask Lodavia Premium or type..."}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white border border-slate-300 dark:border-white/5 focus:border-sky-500 dark:focus:border-purple-500/40 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 min-w-0 shadow-2xs"
                        disabled={loading}
                      />

                      {/* Send / Regenerate Responses triggers */}
                      {activeThread && activeThread.messages.length > 1 && !loading && !chatInput.trim() ? (
                        <button
                          type="button"
                          onClick={handleRegenerateResponse}
                          className="p-2.5 bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5 rounded-xl shadow-2xs transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0"
                          title="Regenerate last response"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="p-2.5 bg-sky-500 hover:bg-sky-600 dark:bg-gradient-to-tr dark:from-purple-600 dark:to-indigo-600 dark:hover:from-purple-500 dark:hover:to-indigo-500 text-white rounded-xl shadow transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0 disabled:opacity-40"
                          disabled={loading || (!chatInput.trim() && attachedFiles.length === 0)}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                    </form>
                  </div>
                )}

                {/* 2. POST WIZARD PANEL */}
                {activePanel === "post" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 space-y-3 shadow-sm">
                      <h3 className="text-xs font-black text-sky-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-sky-600 dark:text-purple-400" />
                        <span>{lang === "ar" ? "مساعد صياغة المنشورات" : "Post Writing Companion"}</span>
                      </h3>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300">
                        {lang === "ar" ? "أدخل فكرة أو موضوعاً وسيقوم الذكاء الاصطناعي بصياغته بشكل كوني رائع ورموز تعبيرية جذابة!" : "Enter a topic and watch Lodavia AI craft a premium post for your personal feed!"}
                      </p>

                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">{lang === "ar" ? "موضوع المنشور:" : "Post Topic:"}</label>
                        <textarea
                          value={postTopic}
                          onChange={(e) => setPostTopic(e.target.value)}
                          placeholder={lang === "ar" ? "مثال: رحلة استكشاف مريخية أو درس تعلم ريأكت..." : "e.g. A space journey or a tutorial on React components..."}
                          className="w-full h-24 p-3 rounded-xl bg-white dark:bg-black/40 text-xs text-slate-900 dark:text-white border border-slate-300 dark:border-white/5 focus:border-sky-500 dark:focus:border-purple-500/40 focus:outline-none"
                        />
                      </div>

                      {/* Tone Selection */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">{lang === "ar" ? "نبرة الصوت الكونية:" : "Cosmic Tone:"}</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: "cosmic", nameAr: "🌌 كوني", nameEn: "🌌 Cosmic" },
                            { id: "professional", nameAr: "🎓 مهني", nameEn: "🎓 Professional" },
                            { id: "poetic", nameAr: "✨ شاعري", nameEn: "✨ Poetic" },
                          ].map((t) => (
                            <button
                              key={t.id}
                              onClick={() => { playSynthSound(600, "sine", 0.05); setPostTone(t.id); }}
                              className={`py-1.5 px-2 rounded-lg text-[9px] font-black text-center border transition-all cursor-pointer ${
                                postTone === t.id
                                  ? "bg-sky-500 text-white border-sky-500 dark:bg-purple-600/20 dark:border-purple-500/50 dark:text-white shadow"
                                  : "bg-white dark:bg-black/30 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                              }`}
                            >
                              {lang === "ar" ? t.nameAr : t.nameEn}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleGeneratePost}
                        disabled={loading || !postTopic.trim()}
                        className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 dark:bg-gradient-to-r dark:from-purple-600 dark:to-indigo-600 text-white font-black text-xs shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Brain className="w-4 h-4" />
                            <span>{lang === "ar" ? "توليد المنشور الكوني 📥" : "Generate Cosmic Post 📥"}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Output area */}
                    {generatedPost && (
                      <div className="p-4 rounded-2xl border border-sky-200 dark:border-purple-500/20 bg-sky-50/50 dark:bg-purple-950/20 space-y-3 animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 px-2 py-0.5 rounded-full">
                            {lang === "ar" ? "جاهز للنشر!" : "Ready!"}
                          </span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(generatedPost);
                                setCopiedPost(true);
                                playSynthSound(1300, "sine", 0.1);
                                setTimeout(() => setCopiedPost(false), 2000);
                              }}
                              className="p-1.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-[10px] flex items-center gap-1"
                            >
                              {copiedPost ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedPost ? (lang === "ar" ? "تم النسخ" : "Copied") : (lang === "ar" ? "نسخ" : "Copy")}</span>
                            </button>
                            <button
                              onClick={handleApplyPostToCreate}
                              className="p-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 dark:bg-gradient-to-r dark:from-purple-600 dark:to-indigo-600 text-white font-black transition-colors cursor-pointer text-[10px] flex items-center gap-1 hover:scale-105 active:scale-95"
                            >
                              <Plus className="w-3 h-3" />
                              <span>{lang === "ar" ? "إدراج للمنشورات ✍️" : "Apply to Feed ✍️"}</span>
                            </button>
                          </div>
                        </div>
                        <div className="p-3 bg-white dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-sans shadow-2xs">
                          {generatedPost}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. TOOLS PANEL */}
                {activePanel === "tools" && (
                  <div className="space-y-4">
                    {/* Lodavia AI Project Jury Card */}
                    <div className="p-4 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-slate-900/60 to-slate-900/60 space-y-3 shadow-lg shadow-purple-950/20">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Scale className="w-4 h-4 text-purple-400" />
                          <span>{lang === "ar" ? "⚖️ لجنة Lodavia AI (التقييم الأولي للمشروع)" : "⚖️ Lodavia AI Project Jury"}</span>
                        </h3>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          {lang === "ar" ? "7 أعضاء متخصصين" : "7 Specialized Personas"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        {lang === "ar" 
                          ? "محاكاة ذكية متقدمة لتقييم فكرتك أو مشروعك الناشئ عبر 7 وجهات نظر تحليلية مختلفة: مالي، تقني، تسويق، قانوني، استراتيجي، وتجربة عميل، مع سيناريوهات واقعية وتوصيات فورية." 
                          : "Advanced simulated evaluation of your project through 7 distinct analytical perspectives: financial, technical, marketing, legal, strategic, and user experience."}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          if (playSynthSound) playSynthSound(800, "sine", 0.08);
                          setShowProjectJuryModal(true);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                      >
                        <Scale className="w-4 h-4" />
                        <span>{lang === "ar" ? "فتح منصة التقييم ⚖️" : "Launch Project Jury ⚖️"}</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 space-y-3 shadow-sm">
                      <h3 className="text-xs font-black text-sky-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Languages className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                        <span>{lang === "ar" ? "الترجمة الكونية المزدوجة" : "Cosmic Bilingual Translator"}</span>
                      </h3>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300">
                        {lang === "ar" ? "ترجم أي نص أو رسالة فوراً بين العربية والإنجليزية بدقة فائقة." : "Translate any content immediately between Arabic and English with absolute precision."}
                      </p>

                      <textarea
                        value={toolText}
                        onChange={(e) => setToolText(e.target.value)}
                        placeholder={lang === "ar" ? "اكتب أو الصق النص المُراد ترجمته أو تلخيصه..." : "Type or paste text to translate or summarize..."}
                        className="w-full h-24 p-3 rounded-xl bg-white dark:bg-black/40 text-xs text-slate-900 dark:text-white border border-slate-300 dark:border-white/5 focus:border-sky-500 dark:focus:border-cyan-500/40 focus:outline-none"
                      />

                      <div className="flex items-center justify-between gap-3 bg-white dark:bg-black/40 p-2 rounded-xl border border-slate-200 dark:border-white/5">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{lang === "ar" ? "اتجاه الترجمة:" : "Direction:"}</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => { playSynthSound(600, "sine", 0.05); setTranslationDirection("to_ar"); }}
                            className={`py-1 px-2.5 rounded-lg text-[9px] font-black cursor-pointer ${
                              translationDirection === "to_ar" ? "bg-sky-500/20 text-sky-700 dark:bg-cyan-500/20 dark:text-cyan-300 border border-sky-500/30 dark:border-cyan-500/30" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            English ➔ العربية
                          </button>
                          <button
                            onClick={() => { playSynthSound(600, "sine", 0.05); setTranslationDirection("to_en"); }}
                            className={`py-1 px-2.5 rounded-lg text-[9px] font-black cursor-pointer ${
                              translationDirection === "to_en" ? "bg-sky-500/20 text-sky-700 dark:bg-cyan-500/20 dark:text-cyan-300 border border-sky-500/30 dark:border-cyan-500/30" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            العربية ➔ English
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleTranslate}
                          disabled={loading || !toolText.trim()}
                          className="py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
                        >
                          <Languages className="w-4 h-4" />
                          <span>{lang === "ar" ? "ترجمة الآن" : "Translate"}</span>
                        </button>
                        <button
                          onClick={handleSummarize}
                          disabled={loading || (!toolText.trim() && summarizeSource === "custom")}
                          className="py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
                        >
                          <FileText className="w-4 h-4" />
                          <span>{lang === "ar" ? "تلخيص ذكي" : "Summarize"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Summarizer Shortcut */}
                    <div className="bg-slate-100 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center justify-between gap-3 text-[10px] text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1 font-bold">
                        <Info className="w-3.5 h-3.5 text-amber-500" />
                        <span>{lang === "ar" ? "هل تود تلخيص نقاشات الصفحة الرئيسية الحالية؟" : "Want to summarize active Home Feed?"}</span>
                      </span>
                      <button
                        onClick={() => {
                          playSynthSound(700, "sine", 0.05);
                          setSummarizeSource("home_feed");
                          handleSummarize();
                        }}
                        className="py-1 px-2.5 rounded-lg bg-sky-50 dark:bg-purple-600/20 hover:bg-sky-100 dark:hover:bg-purple-600/40 text-sky-700 dark:text-purple-300 border border-sky-200 dark:border-purple-500/30 font-black cursor-pointer"
                      >
                        {lang === "ar" ? "تلخيص الفيد ⚡" : "Summarize Feed ⚡"}
                      </button>
                    </div>

                    {/* Results Displays */}
                    {(translatedText || summarizedText) && (
                      <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3 bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 animate-[fadeIn_0.3s_ease-out] shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
                          {translatedText ? (lang === "ar" ? "الترجمة الناتجة:" : "Translated Result:") : (lang === "ar" ? "الملخص الذكي الكوني:" : "Cosmic Summary:")}
                        </h4>
                        <div className="p-3 bg-white dark:bg-black/50 rounded-xl text-xs text-slate-800 dark:text-slate-100 leading-relaxed font-sans border border-slate-200 dark:border-white/5 whitespace-pre-line shadow-2xs">
                          {translatedText || summarizedText}
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(translatedText || summarizedText);
                            playSynthSound(1300, "sine", 0.1);
                          }}
                          className="py-1 px-2 rounded-lg bg-slate-200/60 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-[10px] flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{lang === "ar" ? "نسخ النتيجة 📋" : "Copy Result 📋"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. COSMIC ORBIT */}
                {activePanel === "orbit" && (
                  <div className="space-y-4">
                    {recsLoading ? (
                      <div className="py-12 flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
                        <span className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">
                          {lang === "ar" ? "جاري محاذاة المجرات لحساب ترشيحاتك الكونية..." : "Aligning celestial bodies for customized advice..."}
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* Daily cosmic tip */}
                        {recommendations?.cosmicTip && (
                          <div className="p-4 rounded-2xl border border-amber-300 dark:border-yellow-500/20 bg-amber-50 dark:bg-gradient-to-r dark:from-yellow-500/10 dark:via-amber-500/5 dark:to-transparent text-xs text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5 shadow-sm">
                            <Star className="w-4 h-4 text-amber-500 dark:text-yellow-400 animate-pulse shrink-0 mt-0.5" />
                            <div>
                              <strong className="block text-[10px] font-black text-amber-600 dark:text-yellow-400 uppercase tracking-wider mb-0.5">
                                {lang === "ar" ? "التوجيه الكوني اليومي 🪐" : "Daily Cosmic Alignment 🪐"}
                              </strong>
                              {recommendations.cosmicTip}
                            </div>
                          </div>
                        )}

                        {/* Community Recommendations */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-black text-sky-600 dark:text-purple-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <Compass className="w-4 h-4" />
                            <span>{lang === "ar" ? "مجتمعات كوكبية مقترحة لك:" : "Recommended Communities:"}</span>
                          </h4>

                          <div className="grid grid-cols-1 gap-3">
                            {recommendations?.communityRecommendations?.map((rec, i) => (
                              <div key={i} className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/60 flex items-start justify-between gap-3 hover:border-sky-400 dark:hover:border-purple-500/30 transition-all shadow-sm">
                                <div>
                                  <h5 className="text-xs font-black text-slate-900 dark:text-white">{rec.name}</h5>
                                  <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{rec.reason}</p>
                                </div>
                                <button
                                  onClick={() => handleJoinRecommendedCommunity(rec.id)}
                                  className="py-1.5 px-3 rounded-lg bg-sky-500 dark:bg-gradient-to-tr dark:from-purple-600 dark:to-indigo-600 text-white text-[9px] font-black hover:scale-105 transition-all cursor-pointer shadow-sm"
                                >
                                  {currentUser.joinedCommunities.includes(rec.id) ? (lang === "ar" ? "عضو ✓" : "Joined ✓") : (lang === "ar" ? "انضمام 🚀" : "Join 🚀")}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Friends recommendations */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-black text-sky-600 dark:text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <Users className="w-4 h-4" />
                            <span>{lang === "ar" ? "رواد فضاء مقترحون لتوصيلك بها:" : "Recommended Cosmic Pilots:"}</span>
                          </h4>

                          <div className="grid grid-cols-1 gap-3">
                            {recommendations?.friendRecommendations?.map((friend, i) => (
                              <div key={i} className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/60 flex flex-col gap-3 hover:border-sky-400 dark:hover:border-cyan-500/30 transition-all shadow-sm">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-lg flex items-center justify-center shrink-0 border border-slate-300 dark:border-white/10 shadow-inner">
                                      {friend.avatar.startsWith("http") ? (
                                        <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-full object-cover" />
                                      ) : (
                                        <span>{friend.avatar}</span>
                                      )}
                                    </div>
                                    <div>
                                      <h5 className="text-xs font-black text-slate-900 dark:text-white">{friend.name}</h5>
                                      <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{friend.bio}</span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                      <Zap className="w-3 h-3 text-emerald-500 dark:text-emerald-400 fill-emerald-500 dark:fill-emerald-400 animate-pulse" />
                                      {friend.matchScore}%
                                    </span>
                                    <span className="text-[7px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">{lang === "ar" ? "توافق" : "Match"}</span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                  {friend.interests.map((int, j) => (
                                    <span key={j} className="text-[8px] bg-sky-50 dark:bg-cyan-500/10 text-sky-700 dark:text-cyan-300 py-0.5 px-1.5 rounded border border-sky-200 dark:border-cyan-500/20 font-medium">
                                      #{int}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Force reload recommendations */}
                        <button
                          onClick={handleLoadRecommendations}
                          className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{lang === "ar" ? "تحديث الترشيحات الكونية 🪐" : "Recalculate recommendations 🪐"}</span>
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* --- 5. MASCOT COMPANION FULL-SCREEN CHARACTER STAGE --- */}
                {activePanel === "mascot" && (
                  <div className="w-full flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out]">
                    {/* Full Character Stage */}
                    <div className="w-full h-[540px] md:h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-sky-500/30 relative">
                      <Ray3DViewer
                        currentSkin={mascotConfig.skin}
                        lang={lang}
                        height="100%"
                        showControls={true}
                        autoRotateDefault={true}
                        interactive={true}
                        isStageMode={true}
                        onOpenLocker={() => {
                          setIsLockerOpen(true);
                          if (playSynthSound) playSynthSound(700, 'sine', 0.1);
                        }}
                        onInteract={() => {
                          if (playSynthSound) playSynthSound(680, 'sine', 0.1);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ray 3D Dedicated Cosmic Locker Modal */}
      <RayLockerModal
        isOpen={isLockerOpen}
        onClose={() => setIsLockerOpen(false)}
        currentSkin={mascotConfig.skin}
        onSelectSkin={(skin) => handleSelectMascot(mascotConfig.gender, skin)}
        userPoints={currentUser?.points || 0}
        lang={lang}
        playSynthSound={playSynthSound}
      />

      {/* Futuristic Advanced Voice Live overlay Modal */}
      <VoiceLiveModal
        isOpen={isVoiceLiveOpen}
        onClose={() => setIsVoiceLiveOpen(false)}
        lang={lang}
        currentUser={currentUser}
        playSynthSound={playSynthSound}
      />

      {/* Subscription Upgrade Modal */}
      <SubscriptionUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        requiredTier={requiredModalTier}
        featureTitle={modalFeatureTitle}
      />

      {/* Companion Character Selector Modal */}
      <MascotSelectorModal
        isOpen={showMascotSelectorModal}
        onClose={() => setShowMascotSelectorModal(false)}
        currentGender={mascotConfig.gender}
        currentSkin={mascotConfig.skin}
        onSelect={handleSelectMascot}
        lang={lang}
      />

      {/* Lodavia Cosmic Voice Parameters Modal */}
      <AnimatePresence>
        {showVoiceSettingsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-slate-900 border border-cyan-500/30 text-white p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">
                      {lang === "ar" ? "صوت لودافيا الكوني 🪐" : "Lodavia Cosmic Voice 🪐"}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {lang === "ar" ? "تخصيص نبرة وسرعة القراءة الصوتية" : "Customize pitch, speed & auto-read settings"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVoiceSettingsModal(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Pitch Parameter Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">
                    {lang === "ar" ? "نبرة الصوت (Pitch)" : "Voice Pitch"}
                  </span>
                  <span className="font-mono text-cyan-400 text-[11px] font-bold">
                    {voiceSettings.pitch.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.05"
                  value={voiceSettings.pitch}
                  onChange={(e) => updateVoiceSettings({ pitch: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>{lang === "ar" ? "عميق" : "Deep"}</span>
                  <span>{lang === "ar" ? "مستقبلي كوني" : "Futuristic"}</span>
                  <span>{lang === "ar" ? "حاد" : "High"}</span>
                </div>
              </div>

              {/* Speed/Rate Parameter Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">
                    {lang === "ar" ? "سرعة القراءة (Rate)" : "Speech Rate"}
                  </span>
                  <span className="font-mono text-cyan-400 text-[11px] font-bold">
                    {voiceSettings.rate.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.05"
                  value={voiceSettings.rate}
                  onChange={(e) => updateVoiceSettings({ rate: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>{lang === "ar" ? "بطيء" : "Slow"}</span>
                  <span>{lang === "ar" ? "متوازن" : "Normal"}</span>
                  <span>{lang === "ar" ? "سريع" : "Fast"}</span>
                </div>
              </div>

              {/* Auto-Speak Toggle */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    {lang === "ar" ? "قراءة الردود تلقائياً" : "Auto-read AI Responses"}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {lang === "ar" ? "تشغيل القراءة فور اكتمال كتابة الرد" : "Automatically speak when AI finishes responding"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateVoiceSettings({ autoSpeak: !voiceSettings.autoSpeak })}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    voiceSettings.autoSpeak ? "bg-cyan-500 justify-end" : "bg-slate-700 justify-start"
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              {/* Action Buttons: Test & Save */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSpeakText(
                    lang === "ar" 
                      ? "مرحباً بك في شبكة لودافيا الكونية! الصوت يعمل بدقة ممتازة." 
                      : "Welcome to Lodavia Cosmic Network! Native voice test completed.",
                    "voice-sample-test"
                  )}
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{lang === "ar" ? "تجربة الصوت" : "Test Voice"}</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => updateVoiceSettings({ pitch: 1.15, rate: 1.05, autoSpeak: false })}
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-xs font-medium cursor-pointer transition-all"
                  title={lang === "ar" ? "إعادة الضبط" : "Reset"}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Jury Modal */}
      <ProjectJuryModal
        isOpen={showProjectJuryModal}
        onClose={() => setShowProjectJuryModal(false)}
        lang={lang}
        onTriggerTool={(toolId, context) => {
          if (toolId === 'market_analysis' || toolId === 'business_plan') {
            setActivePanel('chat');
            setChatInput(
              lang === 'ar' 
                ? `بناءً على تقييم لجنة Lodavia AI لمشروع "${context?.name || ''}": قم بإعداد خطة عمل وتحليل سوق مفصل مع مراعاة النقاط الحرجة.`
                : `Based on the Lodavia AI Jury evaluation for "${context?.name || ''}": create a detailed business plan and market analysis addressing the critical findings.`
            );
          }
        }}
      />
    </>
  );
}
