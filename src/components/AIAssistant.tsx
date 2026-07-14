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
  CheckSquare
} from "lucide-react";
import { AppUser, CommunityItem, Post } from "../types";

// Import modular premium components
import MarkdownRenderer from "./MarkdownRenderer";
import VoiceLiveModal from "./VoiceLiveModal";
import SuggestedPrompts from "./SuggestedPrompts";

interface AIAssistantProps {
  currentUser: AppUser;
  lang: "ar" | "en";
  activeTab: string;
  communities: CommunityItem[];
  setCommunities: React.Dispatch<React.SetStateAction<CommunityItem[]>>;
  setHomePosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setNewPostText: (text: string) => void;
  setShowCreateModal: (show: boolean) => void;
  playSynthSound: (frequency: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', duration?: number) => void;
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
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<"chat" | "post" | "tools" | "orbit">("chat");
  const [loading, setLoading] = useState(false);

  // Conversations History States
  const [conversations, setConversations] = useState<ChatThread[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState("");
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  // Chat Input & Voice states
  const [chatInput, setChatInput] = useState("");
  const [isPlayingSpeechIndex, setIsPlayingSpeechIndex] = useState<string | null>(null);
  const [speechAudio, setSpeechAudio] = useState<HTMLAudioElement | null>(null);
  const [isDictating, setIsDictating] = useState(false);
  const [dictationRecognition, setDictationRecognition] = useState<any>(null);

  // Advanced Voice Live Modal state
  const [isVoiceLiveOpen, setIsVoiceLiveOpen] = useState(false);

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
      rec.lang = lang === "ar" ? "ar-SA" : "en-US";

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
    if (!isOpen && speechAudio) {
      speechAudio.pause();
      setIsPlayingSpeechIndex(null);
      setSpeechAudio(null);
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

  // 5. TEXT-TO-SPEECH (TTS) HANDLER
  const handleSpeakText = async (text: string, msgId: string) => {
    if (isPlayingSpeechIndex === msgId) {
      if (speechAudio) {
        speechAudio.pause();
      }
      window.speechSynthesis.cancel();
      setIsPlayingSpeechIndex(null);
      setSpeechAudio(null);
      playSynthSound(400, "sine", 0.05);
      return;
    }

    if (speechAudio) {
      speechAudio.pause();
    }
    window.speechSynthesis.cancel();

    setIsPlayingSpeechIndex(msgId);
    playSynthSound(600, "sine", 0.05);

    try {
      const cleanText = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '');
      const response = await fetch("/api/ai/voice-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText, voice: lang === "ar" ? "Kore" : "Zephyr" })
      });
      const data = await response.json();
      
      if (data.audio) {
        const audio = new Audio("data:audio/wav;base64," + data.audio);
        setSpeechAudio(audio);
        audio.play();
        audio.onended = () => {
          setIsPlayingSpeechIndex(null);
          setSpeechAudio(null);
        };
      } else {
        throw new Error("No audio returned");
      }
    } catch (err) {
      console.warn("TTS API failed, falling back to Web Speech synthesis:", err);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "ar" ? "ar-SA" : "en-US";
      utterance.onend = () => {
        setIsPlayingSpeechIndex(null);
        setSpeechAudio(null);
      };
      window.speechSynthesis.speak(utterance);
      setSpeechAudio({ pause: () => window.speechSynthesis.cancel() } as any);
    }
  };

  // 6. CUSTOM TYPEWRITER STREAMER
  const simulateStreaming = (originalText: string, threadId: string, msgId: string) => {
    let currentIdx = 0;
    const intervalMs = 25; // extremely fluid speed
    const words = originalText.split(" ");
    let typedText = "";

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
        return;
      }

      typedText += (currentIdx === 0 ? "" : " ") + words[currentIdx];
      currentIdx++;

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
    
    const userPrompt = customPrompt ? customPrompt.trim() : chatInput.trim();
    if (!userPrompt && attachedFiles.length === 0) return;
    if (loading) return;

    setChatInput("");
    setLoading(true);
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
      text: lang === "ar" ? "يتأمل الذكاء الاصطناعي في ملكوت البيانات..." : "Consulting the cosmic network...",
      timestamp: currentMsgTimestamp,
      isStreaming: true
    };

    let updatedThreads = conversations;
    if (conversations.length === 0 || !activeConversationId) {
      const welcomeText = lang === "ar" ? "مرحبا بك في لودافيا" : "Welcome to Lodavia";
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
        // Find past messages in thread
        const currentThread = updatedThreads.find(t => t.id === activeThreadId);
        const history = currentThread ? currentThread.messages.slice(-8, -1) : []; // send last exchanges

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

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Successfully received full text. Now trigger smooth character typewriter animation!
      simulateStreaming(data.text, activeThreadId, modelMsgId);
      playSynthSound(1000, "sine", 0.15);

    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Failed to contact Lodavia's server.");
      const errorResponse = lang === "ar"
        ? "عذراً، حدث اضطراب في الاتصال بالشبكة العصبية الكونية. يرجى المحاولة لاحقاً."
        : "Apologies, there was a minor disruption in the cosmic neural network. Please check your credentials and retry.";
      
      // Update model text in state with error
      setConversations(prev => prev.map(c => {
        if (c.id === activeThreadId) {
          return {
            ...c,
            messages: c.messages.map(m => {
              if (m.id === modelMsgId) {
                return { ...m, text: errorResponse, isStreaming: false };
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
      {/* Floating Action Button - Futuristic Pulsing Orb */}
      <motion.button
        id="lodavia-ai-fab"
        drag
        dragConstraints={dragLimits}
        dragElastic={0.15}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 30px rgba(123,63,242,0.8)" }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAssistant}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 p-4 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(123,63,242,0.6)] flex items-center justify-center cursor-grab active:cursor-grabbing group touch-none select-none"
        aria-label="Lodavia Cosmic AI"
      >
        <div className="absolute inset-0 rounded-full bg-white/10 animate-ping group-hover:animate-none opacity-40 pointer-events-none"></div>
        <div className="absolute inset-0 rounded-full border border-cyan-400/30 scale-125 animate-[spin_10s_linear_infinite] pointer-events-none" />
        <div className="absolute inset-1 rounded-full border border-purple-400/20 scale-110 animate-[spin_6s_linear_infinite_reverse] pointer-events-none" />
        <Sparkles className="w-6 h-6 animate-pulse relative z-10" />
        <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-3 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-purple-500/30 text-[9px] font-bold text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl">
          {lang === "ar" ? "🪐 اسحب لتحريك الزر ذكياً" : "🪐 Drag to move me"}
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
              className="relative w-full max-w-lg md:max-w-xl h-full bg-gradient-to-b from-slate-950/95 via-purple-950/90 to-slate-950/95 border-l border-purple-500/20 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col z-10"
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              {/* Sparkle Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl text-white shadow-md">
                    <Brain className="w-5 h-5 animate-[spin_6s_linear_infinite]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white tracking-wider flex items-center gap-1.5 select-none">
                      <span>{lang === "ar" ? "مساعد لودافيا بريميوم" : "Lodavia Premium AI"}</span>
                      <span className="text-[8px] bg-cyan-400/20 text-cyan-300 py-0.5 px-2 rounded-full border border-cyan-400/30 font-black uppercase tracking-wider">
                        Live 3.5
                      </span>
                    </h2>
                    <p className="text-[10px] text-slate-400 select-none">
                      {lang === "ar" ? "أداء خارق، صوتيات متقدمة، وتحليل شامل للملفات" : "Ultra-fast streaming, Live Voice, and Document analysis"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  {/* Accessibility Font scale setting */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title={lang === "ar" ? "تعديل حجم الخط" : "Aesthetic Settings"}
                    >
                      <Sliders className="w-4 h-4" />
                    </button>
                    {showSettingsDropdown && (
                      <div className={`absolute top-full mt-2 right-0 bg-slate-900 border border-white/10 p-2.5 rounded-xl shadow-2xl z-50 w-36 space-y-1.5 ${lang === "ar" ? "left-0" : "right-0"}`}>
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1">
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
                            className={`w-full text-left px-2 py-1 rounded text-[10px] flex items-center justify-between cursor-pointer ${fontScale === sz.key ? "bg-purple-600/30 text-white font-bold" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
                          >
                            <span>{sz.name}</span>
                            {fontScale === sz.key && <Check className="w-3 h-3 text-purple-400" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Advanced Voice Mode Activation Button */}
                  <button
                    onClick={() => setIsVoiceLiveOpen(true)}
                    className="p-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] font-black tracking-wider uppercase"
                    title={lang === "ar" ? "الاتصال الصوتي لومو" : "Voice Live"}
                  >
                    <Headphones className="w-3.5 h-3.5 animate-bounce" />
                    <span className="hidden sm:inline">{lang === "ar" ? "مباشر" : "Live"}</span>
                  </button>

                  <button
                    onClick={toggleAssistant}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-white/5 bg-slate-950/50 p-2 gap-1 overflow-x-auto select-none">
                <button
                  onClick={() => { playSynthSound(500, "sine", 0.05); setActivePanel("chat"); }}
                  className={`flex-1 min-w-[80px] py-2 px-1 rounded-xl text-[11px] font-black tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    activePanel === "chat"
                      ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{lang === "ar" ? "محادثات بريميوم" : "Premium Chat"}</span>
                </button>
                <button
                  onClick={() => { playSynthSound(500, "sine", 0.05); setActivePanel("post"); }}
                  className={`flex-1 min-w-[80px] py-2 px-1 rounded-xl text-[11px] font-black tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    activePanel === "post"
                      ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === "ar" ? "صانع المنشورات" : "Post Wizard"}</span>
                </button>
                <button
                  onClick={() => { playSynthSound(500, "sine", 0.05); setActivePanel("tools"); }}
                  className={`flex-1 min-w-[80px] py-2 px-1 rounded-xl text-[11px] font-black tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    activePanel === "tools"
                      ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  <span>{lang === "ar" ? "الترجمة والتلخيص" : "Translator"}</span>
                </button>
                <button
                  onClick={() => { playSynthSound(500, "sine", 0.05); setActivePanel("orbit"); }}
                  className={`flex-1 min-w-[80px] py-2 px-1 rounded-xl text-[11px] font-black tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    activePanel === "orbit"
                      ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Orbit className="w-4 h-4 animate-spin-slow" />
                  <span>{lang === "ar" ? "مداري الكوني" : "Cosmic Orbit"}</span>
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
                          className="absolute inset-y-0 left-0 w-80 bg-slate-950 border-r border-white/5 z-40 p-4 flex flex-col justify-between shadow-2xl"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                              <span className="text-xs font-black uppercase text-purple-400 font-mono tracking-widest flex items-center gap-1.5">
                                <MessageSquare className="w-4 h-4" />
                                {lang === "ar" ? "سجل المحادثات" : "Chat History"}
                              </span>
                              <button
                                onClick={() => setShowHistoryPanel(false)}
                                className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Search conversations */}
                            <div className="relative">
                              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                              <input
                                type="text"
                                placeholder={lang === "ar" ? "ابحث في المحادثات..." : "Search discussions..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-2 pl-9 pr-4 bg-white/5 rounded-xl text-xs text-white border border-white/5 focus:border-purple-500/40 focus:outline-none placeholder-slate-500"
                              />
                            </div>

                            {/* New Chat Button in History */}
                            <button
                              onClick={() => {
                                handleCreateNewConversation();
                                setShowHistoryPanel(false);
                              }}
                              className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>{lang === "ar" ? "محادثة جديدة" : "New Chat"}</span>
                            </button>

                            {/* List of chat threads */}
                            <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
                              {filteredConversations.map((thread) => (
                                <div
                                  key={thread.id}
                                  onClick={() => handleSelectThread(thread.id)}
                                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                                    activeConversationId === thread.id
                                      ? "bg-purple-600/15 border-purple-500/40"
                                      : "bg-black/20 border-white/5 hover:bg-white/5"
                                  }`}
                                >
                                  <div className="flex-1 min-w-0 flex items-center gap-1.5">
                                    <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    {editingThreadId === thread.id ? (
                                      <input
                                        type="text"
                                        value={editTitleText}
                                        onChange={(e) => setEditTitleText(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") handleSaveRenameThread(thread.id);
                                        }}
                                        className="bg-black/60 text-xs text-white p-1 rounded border border-purple-500 focus:outline-none w-full"
                                      />
                                    ) : (
                                      <span className="text-xs text-slate-200 truncate block font-sans">
                                        {thread.title}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {/* Inline Save button if renaming */}
                                    {editingThreadId === thread.id ? (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleSaveRenameThread(thread.id); }}
                                        className="p-1 hover:text-emerald-400 text-slate-400"
                                      >
                                        <Check className="w-3 h-3" />
                                      </button>
                                    ) : (
                                      <>
                                        {/* Pin Button */}
                                        <button
                                          onClick={(e) => handleTogglePinThread(thread.id, e)}
                                          className={`p-0.5 rounded hover:bg-white/10 ${thread.isPinned ? "text-cyan-400" : "text-slate-500"}`}
                                          title={thread.isPinned ? "Unpin" : "Pin"}
                                        >
                                          <Pin className="w-3 h-3" />
                                        </button>
                                        {/* Rename Button */}
                                        <button
                                          onClick={(e) => handleStartRenameThread(thread, e)}
                                          className="p-0.5 rounded hover:bg-white/10 text-slate-500 hover:text-white"
                                          title="Rename"
                                        >
                                          <Edit3 className="w-3 h-3" />
                                        </button>
                                        {/* Delete Button */}
                                        <button
                                          onClick={(e) => handleDeleteThread(thread.id, e)}
                                          className="p-0.5 rounded hover:bg-white/10 text-slate-500 hover:text-red-400"
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
                                <p className="text-[10px] text-slate-500 text-center py-4">
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
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <button
                          onClick={() => { playSynthSound(500, "sine", 0.05); setShowHistoryPanel(true); }}
                          className="py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{lang === "ar" ? "المحفوظات" : "History"}</span>
                        </button>
                        <span className="text-[11px] font-semibold text-slate-300 truncate max-w-[200px] font-mono">
                          {activeThread ? activeThread.title : (lang === "ar" ? "جاري التمكين..." : "Starting...")}
                        </span>
                        <button
                          onClick={handleCreateNewConversation}
                          className="p-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 active:scale-95 transition-all text-[10px] font-black flex items-center gap-1 cursor-pointer"
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
                              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow select-none animate-[pulse_2s_infinite]">
                                🤖
                              </div>
                            )}
                            <div
                              className={`p-3.5 rounded-2xl leading-relaxed relative group ${
                                msg.role === "user"
                                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none"
                                  : "bg-white/5 text-slate-100 border border-white/5 rounded-tl-none"
                              }`}
                            >
                              {/* Message Text with customized markdown and syntax coloring */}
                              <MarkdownRenderer text={msg.text} fontSizeClass={getFontSizeClass()} />
                              
                              {/* Attached Image inside conversation bubble */}
                              {msg.image && (
                                <div className="mt-2.5 rounded-xl overflow-hidden border border-white/10 relative group bg-black/25">
                                  <img 
                                    src={msg.image} 
                                    alt="Cosmic context" 
                                    className="max-w-full max-h-48 object-contain rounded-lg mx-auto" 
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              )}

                              <div className="flex items-center justify-between mt-2 gap-4">
                                <span className="block text-[8px] text-white/30 select-none">
                                  {msg.timestamp}
                                </span>
                                
                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {/* Copy message button */}
                                  <button
                                    id={`copy-icon-${msg.id}`}
                                    onClick={() => handleCopyMessage(msg.text, msg.id)}
                                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                    title="Copy Response"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>

                                  {/* Share message button */}
                                  <button
                                    onClick={() => handleShareMessage(msg.text)}
                                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                    title="Share Card"
                                  >
                                    <Share2 className="w-3 h-3" />
                                  </button>

                                  {/* Voice speech synthesis toggle */}
                                  {msg.role !== "user" && (
                                    <button
                                      onClick={() => handleSpeakText(msg.text, msg.id)}
                                      className={`p-1 rounded hover:bg-white/10 transition-colors ${isPlayingSpeechIndex === msg.id ? 'text-cyan-400 font-bold animate-pulse' : 'text-slate-400 hover:text-white'}`}
                                      title="Listen response"
                                    >
                                      {isPlayingSpeechIndex === msg.id ? (
                                        <VolumeX className="w-3 h-3" />
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
                          <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-gradient-to-b from-purple-950/10 to-transparent text-center space-y-3">
                            <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold mx-auto shadow-lg shadow-purple-600/20">
                              🌌
                            </div>
                            <h3 className="text-sm font-black text-white select-none">
                              {lang === "ar" ? `مرحباً بك يا ${currentUser.name} 🪐` : `Welcome, ${currentUser.name} 🪐`}
                            </h3>
                            <p className="text-[11px] text-slate-400 max-w-sm mx-auto select-none">
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
                          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-sm">
                            🌌
                          </div>
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 rounded-tl-none space-y-2 flex-1">
                            <div className="h-3 bg-white/10 rounded w-1/3" />
                            <div className="h-3 bg-white/10 rounded w-5/6" />
                            <div className="h-3 bg-white/10 rounded w-2/3" />
                          </div>
                        </div>
                      )}

                      {/* Error State with Retry Button */}
                      {apiError && (
                        <div className="p-3.5 rounded-2xl border border-red-500/20 bg-red-500/10 text-[11px] text-red-300 flex items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5">
                            <X className="w-4 h-4 text-red-400 shrink-0" />
                            <span>{lang === "ar" ? "فشل الاتصال بموجة الذكاء الاصطناعي." : "Lodavia API wave failed."}</span>
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
                      <div className="px-4 py-2.5 border-t border-white/5 bg-slate-900/90 flex flex-wrap items-center gap-2 animate-[fadeIn_0.2s_ease-out] select-none">
                        {attachedFiles.map((file, i) => (
                          <div key={i} className="relative flex items-center gap-2 p-1.5 rounded-lg bg-black/60 border border-white/10 max-w-[150px]">
                            {file.type === "image" ? (
                              <img src={file.base64} alt="attached" className="w-6 h-6 object-cover rounded" />
                            ) : (
                              <Paperclip className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            )}
                            <span className="text-[9px] text-slate-300 truncate flex-1">{file.name}</span>
                            <button
                              onClick={() => handleRemoveAttachedFile(i)}
                              className="text-red-400 hover:text-red-300 rounded cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Chat Input Bar */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-slate-950/80 flex gap-2 items-center">
                      
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
                        className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer transition-all shrink-0"
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
                            ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse"
                            : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                        }`}
                        title={lang === "ar" ? "إدخال صوتي" : "Voice Dictate"}
                      >
                        <Mic className="w-4 h-4" />
                      </button>

                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={lang === "ar" ? "اسأل لودافيا بريميوم أو اكتب..." : "Ask Lodavia Premium or type..."}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 text-xs text-white border border-white/5 focus:border-purple-500/40 focus:outline-none placeholder-slate-500 min-w-0"
                        disabled={loading}
                      />

                      {/* Send / Regenerate Responses triggers */}
                      {activeThread && activeThread.messages.length > 1 && !loading && !chatInput.trim() ? (
                        <button
                          type="button"
                          onClick={handleRegenerateResponse}
                          className="p-2.5 bg-white/5 text-slate-400 hover:text-white rounded-xl shadow transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0"
                          title="Regenerate last response"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl shadow transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0 disabled:opacity-40"
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
                    <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-3">
                      <h3 className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>{lang === "ar" ? "مساعد صياغة المنشورات" : "Post Writing Companion"}</span>
                      </h3>
                      <p className="text-[10px] text-slate-300">
                        {lang === "ar" ? "أدخل فكرة أو موضوعاً وسيقوم الذكاء الاصطناعي بصياغته بشكل كوني رائع ورموز تعبيرية جذابة!" : "Enter a topic and watch Lodavia AI craft a premium post for your personal feed!"}
                      </p>

                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 block font-bold">{lang === "ar" ? "موضوع المنشور:" : "Post Topic:"}</label>
                        <textarea
                          value={postTopic}
                          onChange={(e) => setPostTopic(e.target.value)}
                          placeholder={lang === "ar" ? "مثال: رحلة استكشاف مريخية أو درس تعلم ريأكت..." : "e.g. A space journey or a tutorial on React components..."}
                          className="w-full h-24 p-3 rounded-xl bg-black/40 text-xs text-white border border-white/5 focus:border-purple-500/40 focus:outline-none"
                        />
                      </div>

                      {/* Tone Selection */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 block font-bold">{lang === "ar" ? "نبرة الصوت الكونية:" : "Cosmic Tone:"}</label>
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
                                  ? "bg-purple-600/20 border-purple-500/50 text-white shadow"
                                  : "bg-black/30 border-white/5 text-slate-400 hover:text-white"
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
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-lg flex items-center justify-center gap-1.5 hover:shadow-purple-500/10 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
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
                      <div className="glass-panel p-4 rounded-2xl border border-purple-500/20 bg-purple-950/20 space-y-3 animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
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
                              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer text-[10px] flex items-center gap-1"
                            >
                              {copiedPost ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedPost ? (lang === "ar" ? "تم النسخ" : "Copied") : (lang === "ar" ? "نسخ" : "Copy")}</span>
                            </button>
                            <button
                              onClick={handleApplyPostToCreate}
                              className="p-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black transition-colors cursor-pointer text-[10px] flex items-center gap-1 hover:scale-105 active:scale-95"
                            >
                              <Plus className="w-3 h-3" />
                              <span>{lang === "ar" ? "إدراج للمنشورات ✍️" : "Apply to Feed ✍️"}</span>
                            </button>
                          </div>
                        </div>
                        <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                          {generatedPost}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. TOOLS PANEL */}
                {activePanel === "tools" && (
                  <div className="space-y-4">
                    <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-3">
                      <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Languages className="w-4 h-4 text-cyan-400" />
                        <span>{lang === "ar" ? "الترجمة الكونية المزدوجة" : "Cosmic Bilingual Translator"}</span>
                      </h3>
                      <p className="text-[10px] text-slate-300">
                        {lang === "ar" ? "ترجم أي نص أو رسالة فوراً بين العربية والإنجليزية بدقة فائقة." : "Translate any content immediately between Arabic and English with absolute precision."}
                      </p>

                      <textarea
                        value={toolText}
                        onChange={(e) => setToolText(e.target.value)}
                        placeholder={lang === "ar" ? "اكتب أو الصق النص المُراد ترجمته أو تلخيصه..." : "Type or paste text to translate or summarize..."}
                        className="w-full h-24 p-3 rounded-xl bg-black/40 text-xs text-white border border-white/5 focus:border-cyan-500/40 focus:outline-none"
                      />

                      <div className="flex items-center justify-between gap-3 bg-black/40 p-2 rounded-xl border border-white/5">
                        <span className="text-[10px] text-slate-400">{lang === "ar" ? "اتجاه الترجمة:" : "Direction:"}</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => { playSynthSound(600, "sine", 0.05); setTranslationDirection("to_ar"); }}
                            className={`py-1 px-2.5 rounded-lg text-[9px] font-black cursor-pointer ${
                              translationDirection === "to_ar" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
                            }`}
                          >
                            English ➔ العربية
                          </button>
                          <button
                            onClick={() => { playSynthSound(600, "sine", 0.05); setTranslationDirection("to_en"); }}
                            className={`py-1 px-2.5 rounded-lg text-[9px] font-black cursor-pointer ${
                              translationDirection === "to_en" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
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
                          className="py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
                        >
                          <Languages className="w-4 h-4" />
                          <span>{lang === "ar" ? "ترجمة الآن" : "Translate"}</span>
                        </button>
                        <button
                          onClick={handleSummarize}
                          disabled={loading || (!toolText.trim() && summarizeSource === "custom")}
                          className="py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
                        >
                          <FileText className="w-4 h-4" />
                          <span>{lang === "ar" ? "تلخيص ذكي" : "Summarize"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Summarizer Shortcut */}
                    <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/5 flex items-center justify-between gap-3 text-[10px] text-slate-300">
                      <span className="flex items-center gap-1 font-bold">
                        <Info className="w-3.5 h-3.5 text-yellow-500" />
                        <span>{lang === "ar" ? "هل تود تلخيص نقاشات الصفحة الرئيسية الحالية؟" : "Want to summarize active Home Feed?"}</span>
                      </span>
                      <button
                        onClick={() => {
                          playSynthSound(700, "sine", 0.05);
                          setSummarizeSource("home_feed");
                          handleSummarize();
                        }}
                        className="py-1 px-2.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 font-black cursor-pointer"
                      >
                        {lang === "ar" ? "تلخيص الفيد ⚡" : "Summarize Feed ⚡"}
                      </button>
                    </div>

                    {/* Results Displays */}
                    {(translatedText || summarizedText) && (
                      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 animate-[fadeIn_0.3s_ease-out]">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-wider">
                          {translatedText ? (lang === "ar" ? "الترجمة الناتجة:" : "Translated Result:") : (lang === "ar" ? "الملخص الذكي الكوني:" : "Cosmic Summary:")}
                        </h4>
                        <div className="p-3 bg-black/50 rounded-xl text-xs text-slate-100 leading-relaxed font-sans border border-white/5 whitespace-pre-line">
                          {translatedText || summarizedText}
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(translatedText || summarizedText);
                            playSynthSound(1300, "sine", 0.1);
                          }}
                          className="py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer text-[10px] flex items-center gap-1"
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
                        <span className="text-xs text-slate-400 animate-pulse">
                          {lang === "ar" ? "جاري محاذاة المجرات لحساب ترشيحاتك الكونية..." : "Aligning celestial bodies for customized advice..."}
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* Daily cosmic tip */}
                        {recommendations?.cosmicTip && (
                          <div className="p-4 rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent text-xs text-amber-200 leading-relaxed flex items-start gap-2.5">
                            <Star className="w-4 h-4 text-yellow-400 animate-pulse shrink-0 mt-0.5" />
                            <div>
                              <strong className="block text-[10px] font-black text-yellow-400 uppercase tracking-wider mb-0.5">
                                {lang === "ar" ? "التوجيه الكوني اليومي 🪐" : "Daily Cosmic Alignment 🪐"}
                              </strong>
                              {recommendations.cosmicTip}
                            </div>
                          </div>
                        )}

                        {/* Community Recommendations */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-black text-purple-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <Compass className="w-4 h-4" />
                            <span>{lang === "ar" ? "مجتمعات كوكبية مقترحة لك:" : "Recommended Communities:"}</span>
                          </h4>

                          <div className="grid grid-cols-1 gap-3">
                            {recommendations?.communityRecommendations?.map((rec, i) => (
                              <div key={i} className="glass-panel p-4 rounded-2xl border border-white/5 bg-slate-900/60 flex items-start justify-between gap-3 hover:border-purple-500/30 transition-all">
                                <div>
                                  <h5 className="text-xs font-black text-white">{rec.name}</h5>
                                  <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">{rec.reason}</p>
                                </div>
                                <button
                                  onClick={() => handleJoinRecommendedCommunity(rec.id)}
                                  className="py-1.5 px-3 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white text-[9px] font-black hover:scale-105 transition-all cursor-pointer"
                                >
                                  {currentUser.joinedCommunities.includes(rec.id) ? (lang === "ar" ? "عضو ✓" : "Joined ✓") : (lang === "ar" ? "انضمام 🚀" : "Join 🚀")}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Friends recommendations */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-black text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <Users className="w-4 h-4" />
                            <span>{lang === "ar" ? "رواد فضاء مقترحون لتوصيلك بها:" : "Recommended Cosmic Pilots:"}</span>
                          </h4>

                          <div className="grid grid-cols-1 gap-3">
                            {recommendations?.friendRecommendations?.map((friend, i) => (
                              <div key={i} className="glass-panel p-4 rounded-2xl border border-white/5 bg-slate-900/60 flex flex-col gap-3 hover:border-cyan-500/30 transition-all">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 text-lg flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                                      {friend.avatar.startsWith("http") ? (
                                        <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-full object-cover" />
                                      ) : (
                                        <span>{friend.avatar}</span>
                                      )}
                                    </div>
                                    <div>
                                      <h5 className="text-xs font-black text-white">{friend.name}</h5>
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{friend.bio}</span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-emerald-400 flex items-center gap-0.5">
                                      <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400 animate-pulse" />
                                      {friend.matchScore}%
                                    </span>
                                    <span className="text-[7px] text-slate-500 uppercase font-bold tracking-wider">{lang === "ar" ? "توافق" : "Match"}</span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                  {friend.interests.map((int, j) => (
                                    <span key={j} className="text-[8px] bg-cyan-500/10 text-cyan-300 py-0.5 px-1.5 rounded border border-cyan-500/20">
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
                          className="w-full py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-slate-400 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{lang === "ar" ? "تحديث الترشيحات الكونية 🪐" : "Recalculate recommendations 🪐"}</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Futuristic Advanced Voice Live overlay Modal */}
      <VoiceLiveModal
        isOpen={isVoiceLiveOpen}
        onClose={() => setIsVoiceLiveOpen(false)}
        lang={lang}
        currentUser={currentUser}
        playSynthSound={playSynthSound}
      />
    </>
  );
}
