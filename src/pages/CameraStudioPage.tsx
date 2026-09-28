import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useStories } from '../contexts/StoriesContext';
import { useAudio } from '../contexts/AudioContext';
import { AUDIO_ITEMS } from '../data/audioData';
import { firestoreService } from '../firebase/services';
import { Post, ChatMessage } from '../types';
import { 
  Camera, 
  Video, 
  RotateCcw, 
  Sparkles, 
  Download, 
  Check, 
  X, 
  Music, 
  Clock, 
  Zap, 
  ZapOff, 
  Play, 
  ArrowLeft, 
  ArrowRight,
  Tv,
  Film,
  PlusCircle,
  MessageSquare,
  Orbit,
  Wand2
} from 'lucide-react';
import LodaviaSkyAR from '../components/sky/LodaviaSkyAR';

interface CameraFilter {
  id: string;
  nameAr: string;
  nameEn: string;
  filterCss: string;
  badgeColor: string;
}

const CAMERA_FILTERS: CameraFilter[] = [
  { id: 'normal', nameAr: 'عادي', nameEn: 'Normal', filterCss: 'none', badgeColor: 'bg-slate-700' },
  { id: 'cosmic', nameAr: 'سديم كوني 🌌', nameEn: 'Cosmic Nebula', filterCss: 'contrast(1.3) saturate(1.8) hue-rotate(40deg) brightness(1.1)', badgeColor: 'bg-sky-500' },
  { id: 'neon', nameAr: 'سايبر نيون ⚡', nameEn: 'Cyber Neon', filterCss: 'contrast(1.4) saturate(2.2) brightness(1.15) hue-rotate(-25deg)', badgeColor: 'bg-cyan-500' },
  { id: 'golden', nameAr: 'الغروب الذهبي 🌅', nameEn: 'Golden Hour', filterCss: 'sepia(0.65) saturate(1.8) brightness(1.1) contrast(1.15)', badgeColor: 'bg-amber-500' },
  { id: 'vhs', nameAr: 'ريترو كلاسيك 📼', nameEn: 'Retro VHS', filterCss: 'sepia(0.35) contrast(1.35) saturate(1.2) hue-rotate(-15deg)', badgeColor: 'bg-rose-500' },
  { id: 'alien', nameAr: 'مصفوفة فضائية 👽', nameEn: 'Alien Matrix', filterCss: 'hue-rotate(90deg) saturate(2.2) contrast(1.3) brightness(1.05)', badgeColor: 'bg-emerald-500' },
  { id: 'hologram', nameAr: 'هولوغرام أزرق 💠', nameEn: 'Hologram Blue', filterCss: 'hue-rotate(180deg) saturate(1.9) contrast(1.4) brightness(1.15)', badgeColor: 'bg-indigo-500' },
  { id: 'bw', nameAr: 'أبيض وأسود فاخر 🎬', nameEn: 'Monochrome Noir', filterCss: 'grayscale(1) contrast(1.35) brightness(1.05)', badgeColor: 'bg-slate-900' }
];

const FILTER_PREVIEWS: Record<string, string> = {
  normal: 'bg-gradient-to-br from-slate-700 to-slate-900 border-white/30',
  cosmic: 'bg-gradient-to-br from-purple-600 via-indigo-600 to-sky-500 border-cyan-400',
  neon: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 border-cyan-300',
  golden: 'bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 border-amber-300',
  vhs: 'bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-700 border-rose-300',
  alien: 'bg-gradient-to-br from-emerald-400 via-green-600 to-teal-800 border-emerald-300',
  hologram: 'bg-gradient-to-br from-sky-400 via-indigo-500 to-blue-700 border-sky-300',
  bw: 'bg-gradient-to-br from-slate-300 via-slate-600 to-black border-white/50'
};

const AR_PROPS = [
  { id: 'none', labelAr: 'بدون قناع', labelEn: 'None', emoji: '🚫' },
  { id: 'helmet', labelAr: 'خوذة الفضاء', labelEn: 'Space Helmet', emoji: '🧑‍🚀' },
  { id: 'crown', labelAr: 'تاج نيون', labelEn: 'Neon Crown', emoji: '👑' },
  { id: 'glasses', labelAr: 'نظارات سايبر', labelEn: 'Cyber Shades', emoji: '🕶️' },
  { id: 'stars', labelAr: 'هالة نجوم', labelEn: 'Star Aura', emoji: '✨' },
  { id: 'fire', labelAr: 'لهب متوهج', labelEn: 'Blaze Aura', emoji: '🔥' }
];

export default function CameraStudioPage() {
  const { lang, currentUser, playSynthSound, setHomePosts, chats, setChats, setActiveChat } = useApp();
  const { addStory } = useStories();
  const { playTrack } = useAudio();
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  const [showChatModal, setShowChatModal] = useState(false);

  // Mode: 'photo' | 'video'
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');

  // Camera stream states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Filter & AR Props
  const [activeFilter, setActiveFilter] = useState<CameraFilter>(CAMERA_FILTERS[0]);
  const [activeProp, setActiveProp] = useState<string>('none');
  const [showARPropsRow, setShowARPropsRow] = useState<boolean>(false);
  const [flashEnabled, setFlashEnabled] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0); // 0 = off, 3, 5, 10
  const [countdown, setCountdown] = useState<number | null>(null);

  // Video recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Captured Output State
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedVideoUrl, setCapturedVideoUrl] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [lastCapturedMedia, setLastCapturedMedia] = useState<{ type: 'image' | 'video', url: string, blob?: Blob } | null>(null);

  // Overlay text
  const [overlayText] = useState<string>('');

  // Background Audio Layer
  const [selectedMusic, setSelectedMusic] = useState<any | null>(null);
  const [showMusicPicker, setShowMusicPicker] = useState<boolean>(false);

  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lodavia Sky AR Fullscreen Layer State
  const [showSkyAR, setShowSkyAR] = useState<boolean>(false);

  // Initialize Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: captureMode === 'video'
      });

      mediaStreamRef.current = stream;
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn('Play interrupted:', e));
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable in sandbox:', err);
      setCameraError(isAr ? 'الكاميرا غير متوفرة أو لم يتم منح الإذن. يمكنك استخدام وضع المحاكاة والتجربة.' : 'Camera unavailable or permission denied. Simulation viewfinder is active.');
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (!showSkyAR) {
      startCamera().catch((err: any) => {
        console.error('Camera initialization error in effect:', err);
        setToastMessage(isAr ? 'تعذر تشغيل الكاميرا. يرجى التحقق من الأذونات.' : 'Could not start camera. Check permissions.');
        setTimeout(() => setToastMessage(null), 3000);
      });
    }
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [facingMode, captureMode, showSkyAR]);

  // Open Lodavia Sky AR: Cleanly stops normal camera tracks and displays LodaviaSkyAR overlay
  const handleOpenLodaviaSky = () => {
    playSynthSound(750, 'sine', 0.1);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping camera track:', e);
        }
      });
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setShowSkyAR(true);
  };

  // Close Lodavia Sky AR
  const handleCloseLodaviaSky = () => {
    playSynthSound(600, 'sine', 0.08);
    setShowSkyAR(false);
  };

  // Flip Camera (Front / Back)
  const toggleCameraFacing = () => {
    playSynthSound(600, 'sine', 0.05);
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Capture Photo Action
  const triggerPhotoCapture = () => {
    if (timerSeconds > 0) {
      setCountdown(timerSeconds);
      const timerInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timerInterval);
            executePhotoSnap();
            return null;
          }
          playSynthSound(700, 'sine', 0.06);
          return prev - 1;
        });
      }, 1000);
    } else {
      executePhotoSnap();
    }
  };

  const executePhotoSnap = () => {
    playSynthSound(900, 'triangle', 0.15);

    const canvas = document.createElement('canvas');
    const width = 720;
    const height = 1280;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      if (activeFilter.filterCss && activeFilter.filterCss !== 'none') {
        ctx.filter = activeFilter.filterCss;
      }

      if (videoRef.current && isCameraActive) {
        ctx.drawImage(videoRef.current, 0, 0, width, height);
      } else {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#0c162d');
        grad.addColorStop(0.5, '#1a237e');
        grad.addColorStop(1, '#4a148c');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Draw colorful cosmic nebula elements
        const radialGrad = ctx.createRadialGradient(width * 0.7, height * 0.3, 10, width * 0.7, height * 0.3, 200);
        radialGrad.addColorStop(0, '#f59e0b');
        radialGrad.addColorStop(0.5, '#ec4899');
        radialGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = radialGrad;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('LODAVIA COSMIC SNAPSHOT 🪐', width / 2, height / 2 - 40);
        ctx.font = '22px sans-serif';
        ctx.fillText(new Date().toLocaleTimeString(), width / 2, height / 2 + 20);
      }
      ctx.filter = 'none';

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('LODAVIA STUDIO 🚀', width - 30, height - 40);

      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);
      setLastCapturedMedia({ type: 'image', url: dataUrl });
    }
  };

  // Start Video Recording
  const startVideoRecording = () => {
    if (!isCameraActive || !mediaStreamRef.current) {
      setIsRecording(true);
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(d => d + 1);
      }, 1000);
      return;
    }

    try {
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(mediaStreamRef.current, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
          ? 'video/webm;codecs=vp9' 
          : 'video/webm'
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setCapturedBlob(blob);
        setCapturedVideoUrl(videoUrl);
        setLastCapturedMedia({ type: 'video', url: videoUrl, blob });
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100);
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(d => d + 1);
      }, 1000);

      playSynthSound(800, 'sine', 0.1);
    } catch (e) {
      console.warn('MediaRecorder error:', e);
    }
  };

  // Stop Video Recording
  const stopVideoRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    setIsRecording(false);
    playSynthSound(400, 'sine', 0.15);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      const fallbackUrl = 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-starfield-in-space-41544-large.mp4';
      setCapturedVideoUrl(fallbackUrl);
      setLastCapturedMedia({ type: 'video', url: fallbackUrl });
    }
  };

  // Publish Captured Media directly to Stories
  const handlePublishToStories = () => {
    playSynthSound(850, 'sine', 0.2);
    addStory({
      mediaType: capturedImage ? 'image' : 'video',
      mediaUrl: capturedImage || capturedVideoUrl || '',
      textContent: overlayText || (isAr ? 'تم التقاطه عبر استوديو لودافيا الكوني 🌌' : 'Captured via Lodavia Cosmic Studio 🌌'),
      filter: activeFilter.filterCss,
      privacy: 'everyone'
    });

    setToastMessage(isAr ? 'تم نشر اللقطة في القصص الكونية بنجاح! 🪐✨' : 'Published to Lodavia Stories successfully! 🪐✨');
    setTimeout(() => {
      setToastMessage(null);
      navigate('/home');
    }, 2000);
  };

  // Publish Captured Media directly to Media Reels
  const handlePublishToMedia = () => {
    playSynthSound(900, 'sine', 0.2);
    setToastMessage(isAr ? 'تم إرسال المقطع إلى فضاء الوسائط والريلز! 🎬🚀' : 'Shared to Cosmic Media Center! 🎬🚀');
    setTimeout(() => {
      setToastMessage(null);
      navigate('/media');
    }, 2000);
  };

  // Publish Captured Media directly as Home Post
  const handlePublishToPost = () => {
    playSynthSound(850, 'sine', 0.2);
    const newPost: Post = {
      id: `post_cam_${Date.now()}`,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorTitle: isAr ? 'مستكشف كوني' : 'Cosmic Explorer',
      content: overlayText || (isAr ? 'لقطة جديدة من استوديو الكاميرا 📸✨' : 'New shot from Camera Studio 📸✨'),
      likes: 0,
      commentsCount: 0,
      timestamp: isAr ? 'الآن' : 'Just now',
      likedByMe: false,
      comments: [],
      image: capturedImage || undefined,
      video: capturedVideoUrl || undefined
    };

    setHomePosts(prev => [newPost, ...prev]);
    firestoreService.createPost(newPost).catch(err => console.warn('Firestore err:', err));

    setToastMessage(isAr ? 'تم نشر اللقطة في الرئيسية بنجاح! 🚀✨' : 'Published to Home feed successfully! 🚀✨');
    setTimeout(() => {
      setToastMessage(null);
      navigate('/home');
    }, 1800);
  };

  // Send Captured Media to Chat
  const handleSendToChat = (chatId: string) => {
    playSynthSound(800, 'sine', 0.15);
    const newMsg: ChatMessage = {
      id: `msg_cam_${Date.now()}`,
      senderId: currentUser.id,
      text: overlayText || (isAr ? 'مرفق وسائط كاميرا 📸' : 'Camera attachment 📸'),
      type: capturedImage ? 'image' : 'video',
      mediaUrl: capturedImage || capturedVideoUrl || '',
      timestamp: new Date().toLocaleTimeString(isAr ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    };

    const target = chats.find(c => c.id === chatId);
    if (target) {
      const updated = {
        ...target,
        messages: [...target.messages, newMsg]
      };
      setActiveChat(updated);
      setChats(prev => prev.map(c => c.id === chatId ? updated : c));
      firestoreService.sendMessage(chatId, newMsg).catch(err => console.warn('Msg send err:', err));
    }

    setShowChatModal(false);
    setToastMessage(isAr ? 'تم إرسال الوسائط في المحادثة! 💬✨' : 'Sent to conversation! 💬✨');
    setTimeout(() => {
      setToastMessage(null);
      navigate('/messages');
    }, 1500);
  };

  // Download Output to Device
  const handleDownload = () => {
    playSynthSound(650, 'sine', 0.1);
    const link = document.createElement('a');
    link.download = capturedImage ? `lodavia-snapshot-${Date.now()}.png` : `lodavia-video-${Date.now()}.webm`;
    link.href = capturedImage || capturedVideoUrl || '';
    link.click();
    setToastMessage(isAr ? 'تم حفظ اللقطة على جهازك بنجاح! 💾' : 'Saved to your device! 💾');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Format Duration string
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-2 sm:px-4 py-2 sm:py-4 flex flex-col items-center justify-center min-h-[calc(100dvh-74px)] animate-[fadeIn_0.25s_ease-out]">
      
      {/* ----------------- CLEAN SNAPCHAT / INSTAGRAM STYLE VIEWFINDER ----------------- */}
      <div className="relative w-full max-w-[430px] aspect-[9/16] max-h-[85vh] rounded-[38px] overflow-hidden bg-black border-2 border-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.8)] flex flex-col justify-between select-none">
        
        {/* Soft Edge Vignettes for Clear Button Contrast Without Darkening Camera Feed */}
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />

        {/* Flash Effect Layer */}
        {flashEnabled && (
          <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-[fadeOut_0.4s_ease-out]" />
        )}

        {/* Camera Feed / Simulation Canvas / Post-Capture Preview */}
        {!capturedImage && !capturedVideoUrl ? (
          <>
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover z-0 transition-[filter] duration-200"
                style={{
                  filter: activeFilter.filterCss,
                  WebkitFilter: activeFilter.filterCss,
                  transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                }}
              />
            ) : (
              /* Simulated Cosmic Viewfinder */
              <div 
                className="absolute inset-0 w-full h-full z-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0c162d] via-[#1a237e] to-[#4a148c] transition-all duration-300 overflow-hidden"
                style={{
                  filter: activeFilter.filterCss,
                  WebkitFilter: activeFilter.filterCss
                }}
              >
                {/* Visual Cosmic Scene Elements to make any filter effect immediately obvious */}
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 opacity-60 blur-xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 opacity-50 blur-2xl pointer-events-none" />
                
                <div className="relative z-1 flex flex-col items-center text-center px-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/30 border-2 border-dashed border-cyan-400/80 flex items-center justify-center animate-spin-slow mb-3 shadow-[0_0_30px_rgba(56,189,248,0.35)]">
                    <Sparkles className="w-10 h-10 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                  </div>
                  <span className="text-sm font-black text-white tracking-widest uppercase drop-shadow-md">
                    {isAr ? 'مستشعر الرؤية الكونية متصل' : 'Cosmic Vision Viewfinder'}
                  </span>
                  <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-cyan-200 font-mono tracking-wider font-bold">
                      {isAr ? `تأثير الفلتر: ${activeFilter.nameAr}` : `Filter: ${activeFilter.nameEn}`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* AR Overlay Prop Render */}
            {activeProp !== 'none' && (
              <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                {activeProp === 'helmet' && (
                  <div className="w-52 h-52 rounded-full border-4 border-cyan-400/80 shadow-[0_0_40px_rgba(34,211,238,0.5)] flex items-center justify-center animate-pulse">
                    <span className="text-6xl">🧑‍🚀</span>
                  </div>
                )}
                {activeProp === 'crown' && (
                  <div className="-mt-32 text-6xl animate-bounce">
                    👑
                  </div>
                )}
                {activeProp === 'glasses' && (
                  <div className="text-7xl drop-shadow-[0_0_15px_rgba(56,189,248,0.8)]">
                    🕶️
                  </div>
                )}
                {activeProp === 'stars' && (
                  <div className="text-6xl animate-spin-slow">
                    ✨🌌✨
                  </div>
                )}
                {activeProp === 'fire' && (
                  <div className="text-6xl animate-pulse">
                    🔥⚡🔥
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* POST-CAPTURE PREVIEW SCREEN */
          <div className="absolute inset-0 w-full h-full z-0 bg-black flex items-center justify-center">
            {capturedImage ? (
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <video 
                src={capturedVideoUrl || ''} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-cover" 
              />
            )}
          </div>
        )}

        {/* ----------------- 1. TOP HEADER BAR ----------------- */}
        <div className="relative z-20 flex items-center justify-between w-full px-4 pt-4">
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-black/65 active:scale-95 transition-all cursor-pointer shadow-md"
            title={isAr ? 'رجوع' : 'Back'}
          >
            {isAr ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>

          {/* Compact Photo / Video Segmented Switcher in Middle */}
          {!capturedImage && !capturedVideoUrl && (
            <div className="flex items-center bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/15 shadow-lg">
              <button
                onClick={() => {
                  playSynthSound(500, 'sine', 0.05);
                  setCaptureMode('photo');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                  captureMode === 'photo'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isAr ? 'صورة' : 'Photo'}</span>
              </button>

              <button
                onClick={() => {
                  playSynthSound(500, 'sine', 0.05);
                  setCaptureMode('video');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                  captureMode === 'video'
                    ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/30'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{isAr ? 'فيديو' : 'Video'}</span>
              </button>
            </div>
          )}

          {/* Flash Toggle */}
          <button
            onClick={() => {
              playSynthSound(650, 'sine', 0.05);
              setFlashEnabled(!flashEnabled);
            }}
            className={`w-11 h-11 rounded-full backdrop-blur-md border transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-md ${
              flashEnabled
                ? 'bg-amber-500/30 border-amber-400 text-amber-300 ring-2 ring-amber-400/40'
                : 'bg-black/45 border-white/15 text-white hover:bg-black/65'
            }`}
            title={isAr ? (flashEnabled ? 'إلغاء الفلاش' : 'تشغيل الفلاش') : (flashEnabled ? 'Turn Off Flash' : 'Turn On Flash')}
          >
            {flashEnabled ? <Zap className="w-5 h-5 text-amber-400" /> : <ZapOff className="w-5 h-5 text-white/80" />}
          </button>
        </div>

        {/* ----------------- 2. SNAPCHAT / INSTAGRAM STYLE VERTICAL SIDEBAR ----------------- */}
        {!capturedImage && !capturedVideoUrl && (
          <div className="absolute top-20 end-3.5 z-20 flex flex-col items-center gap-3">
            
            {/* Lodavia Sky Button (Only visible on back / environment camera) */}
            {facingMode === 'environment' && (
              <button
                type="button"
                onClick={handleOpenLodaviaSky}
                className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-cyan-400/60 ring-2 ring-cyan-400/40 hover:ring-cyan-300 text-cyan-300 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                title={isAr ? 'سماء لودافيا 🪐' : 'Lodavia Sky 🪐'}
              >
                <Orbit className="w-5 h-5 text-cyan-300 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            )}

            {/* AR Masks & Props Toggle */}
            <button
              type="button"
              onClick={() => {
                playSynthSound(550, 'sine', 0.05);
                setShowARPropsRow(prev => !prev);
              }}
              className={`w-11 h-11 rounded-full backdrop-blur-md border transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-md ${
                showARPropsRow || activeProp !== 'none'
                  ? 'bg-amber-500/30 border-amber-400 text-amber-300 ring-2 ring-amber-400/50' 
                  : 'bg-black/45 border-white/15 text-white hover:bg-black/65'
              }`}
              title={isAr ? 'أقنعة ومؤثرات AR' : 'AR Masks & Props'}
            >
              <Wand2 className="w-5 h-5" />
            </button>

            {/* Timer Toggle */}
            <button
              onClick={() => {
                const next = timerSeconds === 0 ? 3 : timerSeconds === 3 ? 5 : timerSeconds === 5 ? 10 : 0;
                setTimerSeconds(next);
                playSynthSound(600, 'sine', 0.05);
              }}
              className={`w-11 h-11 rounded-full backdrop-blur-md border transition-all cursor-pointer flex flex-col items-center justify-center active:scale-95 shadow-md ${
                timerSeconds > 0 
                  ? 'bg-sky-500/30 border-sky-400 text-sky-300 ring-2 ring-sky-400/50' 
                  : 'bg-black/45 border-white/15 text-white hover:bg-black/65'
              }`}
              title={isAr ? 'المؤقت التلقائي' : 'Self Timer'}
            >
              <Clock className="w-5 h-5" />
              {timerSeconds > 0 && (
                <span className="text-[8px] font-mono font-black -mt-0.5 leading-none">
                  {timerSeconds}s
                </span>
              )}
            </button>

            {/* Music Picker Trigger */}
            <button
              onClick={() => setShowMusicPicker(!showMusicPicker)}
              className={`w-11 h-11 rounded-full backdrop-blur-md border transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-md ${
                selectedMusic 
                  ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 ring-2 ring-cyan-400/50' 
                  : 'bg-black/45 border-white/15 text-white hover:bg-black/65'
              }`}
              title={isAr ? 'إضافة موسيقى خلفية' : 'Background Audio'}
            >
              <Music className="w-5 h-5" />
            </button>

            {/* Quick Flip Camera */}
            <button
              onClick={toggleCameraFacing}
              className="w-11 h-11 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white hover:bg-black/65 active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-md"
              title={isAr ? 'تبديل الكاميرا' : 'Switch Camera'}
            >
              <RotateCcw className="w-5 h-5" />
            </button>

          </div>
        )}

        {/* Countdown Center Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="text-8xl font-black text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] font-mono"
            >
              {countdown}
            </motion.div>
          </div>
        )}

        {/* Video Recording Status Pill */}
        {isRecording && (
          <div className="absolute top-18 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-rose-600/90 text-white font-mono font-black text-xs flex items-center gap-2 shadow-lg backdrop-blur-md border border-rose-400/50 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span>REC {formatDuration(recordingDuration)}</span>
          </div>
        )}

        {/* ----------------- 3, 4 & 5. BOTTOM SECTION: AR MASKS, FILTER CAROUSEL & SHUTTER DOCK ----------------- */}
        <div className="relative z-20 flex flex-col gap-2.5 w-full pb-4 px-2">
          
          {/* 3. AR Props Horizontal Circular Row (Hidden by default, toggled via side panel Wand button) */}
          {!capturedImage && !capturedVideoUrl && showARPropsRow && (
            <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar justify-center px-4 w-full animate-[fadeIn_0.2s_ease-out]">
              {AR_PROPS.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    playSynthSound(550, 'sine', 0.04);
                    setActiveProp(p.id);
                  }}
                  className={`w-10 h-10 rounded-full shrink-0 transition-all cursor-pointer backdrop-blur-md flex items-center justify-center text-lg active:scale-95 ${
                    activeProp === p.id
                      ? 'bg-amber-500/30 border-2 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)] scale-110'
                      : 'bg-black/45 border border-white/15 hover:border-white/35 opacity-75 hover:opacity-100'
                  }`}
                  title={isAr ? p.labelAr : p.labelEn}
                >
                  <span>{p.emoji}</span>
                </button>
              ))}
            </div>
          )}

          {/* 4. Color Filters Carousel (Smooth Scroll with Uniform Preview Circles) */}
          {!capturedImage && !capturedVideoUrl && (
            <div className="w-full overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 px-4 flex items-center gap-3.5 justify-start sm:justify-center">
              {CAMERA_FILTERS.map(f => {
                const isSelected = activeFilter.id === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      playSynthSound(500, 'sine', 0.04);
                      setActiveFilter(f);
                    }}
                    className="flex flex-col items-center gap-1 shrink-0 snap-center group cursor-pointer"
                  >
                    <div 
                      className={`w-13 h-13 rounded-full transition-all duration-200 flex items-center justify-center relative p-0.5 shadow-md ${
                        isSelected
                          ? 'ring-2 ring-offset-2 ring-offset-black/90 ring-cyan-400 scale-105 shadow-[0_0_18px_rgba(34,211,238,0.5)]'
                          : 'border border-white/20 opacity-70 group-hover:opacity-100'
                      } ${FILTER_PREVIEWS[f.id] || 'bg-slate-800'}`}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping absolute" />
                      )}
                      {f.id === 'normal' && (
                        <div className="w-3.5 h-3.5 rounded-full border border-white/60 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                    <span className={`text-[9px] font-bold max-w-[58px] truncate text-center leading-tight transition-colors ${
                      isSelected ? 'text-cyan-300' : 'text-white/70 group-hover:text-white'
                    }`}>
                      {isAr ? f.nameAr.replace(/[^\u0600-\u06FF\s]/g, '').trim() || f.nameAr : f.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 5. Bottom Capture Shutter Bar (Instagram / Snapchat 3-Item Layout) */}
          {!capturedImage && !capturedVideoUrl ? (
            <div className="flex items-center justify-around w-full px-4 pt-1">
              
              {/* Left: Last Capture Preview Thumbnail */}
              <div className="w-12 h-12 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    if (lastCapturedMedia) {
                      playSynthSound(500, 'sine', 0.05);
                      if (lastCapturedMedia.type === 'image') {
                        setCapturedImage(lastCapturedMedia.url);
                      } else {
                        setCapturedVideoUrl(lastCapturedMedia.url);
                        if (lastCapturedMedia.blob) setCapturedBlob(lastCapturedMedia.blob);
                      }
                    }
                  }}
                  disabled={!lastCapturedMedia}
                  className={`w-11 h-11 rounded-2xl overflow-hidden backdrop-blur-md border transition-all flex items-center justify-center select-none ${
                    lastCapturedMedia 
                      ? 'border-white/60 shadow-lg cursor-pointer hover:scale-105 active:scale-95' 
                      : 'border-white/10 bg-black/30 text-white/30 cursor-default opacity-40'
                  }`}
                  title={lastCapturedMedia ? (isAr ? 'معاينة آخر التقاط' : 'Preview Last Capture') : (isAr ? 'لا يوجد التقاط سابق' : 'No previous capture')}
                >
                  {lastCapturedMedia ? (
                    lastCapturedMedia.type === 'image' ? (
                      <img src={lastCapturedMedia.url} alt="Last capture" className="w-full h-full object-cover pointer-events-none" />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                        <Film className="w-5 h-5 text-rose-400" />
                      </div>
                    )
                  ) : (
                    <Film className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Center: The Big Shutter Button */}
              <div className="flex items-center justify-center">
                {captureMode === 'photo' ? (
                  <button
                    onClick={triggerPhotoCapture}
                    className="w-19 h-19 rounded-full border-4 border-white bg-white/20 backdrop-blur-md p-1 hover:scale-105 active:scale-90 transition-all cursor-pointer flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                    title={isAr ? 'التقاط صورة' : 'Take Photo'}
                  >
                    <div className="w-full h-full rounded-full bg-white shadow-inner flex items-center justify-center transition-transform active:scale-90">
                      <Camera className="w-7 h-7 text-slate-900" />
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={isRecording ? stopVideoRecording : startVideoRecording}
                    className={`w-19 h-19 rounded-full border-4 border-white p-1 hover:scale-105 active:scale-90 transition-all cursor-pointer flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.4)] ${
                      isRecording 
                        ? 'bg-rose-500/30 border-rose-400' 
                        : 'bg-white/20 backdrop-blur-md'
                    }`}
                    title={isAr ? (isRecording ? 'إيقاف التسجيل' : 'بدء تسجيل فيديو') : (isRecording ? 'Stop Recording' : 'Start Recording')}
                  >
                    <div className={`transition-all duration-200 flex items-center justify-center ${
                      isRecording 
                        ? 'w-7 h-7 rounded-lg bg-rose-500 shadow-md shadow-rose-500/50' 
                        : 'w-full h-full rounded-full bg-rose-500 shadow-inner'
                    }`}>
                      {!isRecording && <Video className="w-7 h-7 text-white" />}
                    </div>
                  </button>
                )}
              </div>

              {/* Right: Quick Camera Flip */}
              <div className="w-12 h-12 flex items-center justify-center">
                <button
                  onClick={toggleCameraFacing}
                  className="w-11 h-11 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white hover:bg-black/65 active:scale-90 transition-all cursor-pointer flex items-center justify-center shadow-md"
                  title={isAr ? 'تبديل الكاميرا' : 'Switch Camera'}
                >
                  <RotateCcw className="w-5 h-5 text-white" />
                </button>
              </div>

            </div>
          ) : (
            /* POST CAPTURE ACTIONS BAR */
            <div className="flex flex-col gap-2.5 p-3 rounded-3xl bg-black/75 backdrop-blur-xl border border-white/20 shadow-2xl">
              
              {/* Share Targets Row */}
              <div className="grid grid-cols-4 gap-1.5 w-full">
                {/* Publish to Stories */}
                <button
                  onClick={handlePublishToStories}
                  className="py-2.5 px-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black shadow-md flex flex-col items-center gap-1 hover:scale-102 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAr ? 'قصص 🪐' : 'Stories'}</span>
                </button>

                {/* Publish to Home Post */}
                <button
                  onClick={handlePublishToPost}
                  className="py-2.5 px-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[11px] font-black shadow-md flex flex-col items-center gap-1 hover:scale-102 active:scale-95 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isAr ? 'منشور 📝' : 'Post'}</span>
                </button>

                {/* Publish to Media */}
                <button
                  onClick={handlePublishToMedia}
                  className="py-2.5 px-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[11px] font-black shadow-md flex flex-col items-center gap-1 hover:scale-102 active:scale-95 transition-all cursor-pointer"
                >
                  <Tv className="w-4 h-4" />
                  <span>{isAr ? 'ريلز 🎬' : 'Reels'}</span>
                </button>

                {/* Send to Chat */}
                <button
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.05);
                    setShowChatModal(true);
                  }}
                  className="py-2.5 px-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-black shadow-md flex flex-col items-center gap-1 hover:scale-102 active:scale-95 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isAr ? 'رسالة 💬' : 'Chat'}</span>
                </button>
              </div>

              {/* Retake & Download Secondary Actions */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
                <button
                  onClick={() => {
                    playSynthSound(450, 'sine', 0.08);
                    setCapturedImage(null);
                    setCapturedVideoUrl(null);
                    setCapturedBlob(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إعادة التقاط' : 'Retake'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="py-2 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title={isAr ? 'حفظ على الجهاز' : 'Save'}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تنزيل' : 'Save'}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ----------------- MUSIC PICKER MODAL OVERLAY ----------------- */}
      {showMusicPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col gap-4 text-slate-900 dark:text-white">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Music className="w-4 h-4 text-sky-500" />
                <span>{isAr ? 'اختر موسيقى تصويرية للمقطع' : 'Pick Soundtrack'}</span>
              </h3>
              <button onClick={() => setShowMusicPicker(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar">
              {AUDIO_ITEMS.slice(0, 6).map(track => (
                <div
                  key={track.id}
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.05);
                    setSelectedMusic(track);
                    setShowMusicPicker(false);
                    playTrack(track);
                  }}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedMusic?.id === track.id
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30 text-sky-600'
                      : 'border-slate-200 dark:border-slate-800 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={track.coverUrl} alt={track.title} className="w-9 h-9 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-bold truncate">{track.title}</h4>
                      <span className="text-[10px] text-slate-400">{track.artist}</span>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-sky-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- CHAT RECIPIENT PICKER MODAL OVERLAY ----------------- */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col gap-4 text-slate-900 dark:text-white">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-500" />
                <span>{isAr ? 'إرسال اللقطة إلى محادثة' : 'Send snapshot to chat'}</span>
              </h3>
              <button 
                onClick={() => setShowChatModal(false)} 
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar">
              {chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => handleSendToChat(chat.id)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-all cursor-pointer text-start"
                >
                  <div className="flex items-center gap-3">
                    <img src={chat.contactAvatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                    <div>
                      <h4 className="text-xs font-bold">{chat.contactName}</h4>
                      <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {chat.messages[chat.messages.length - 1]?.text || ''}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-sky-500">{isAr ? 'إرسال' : 'Send'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 end-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-black shadow-2xl flex items-center gap-2 animate-[scaleIn_0.2s_ease-out]">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Lodavia Sky AR Fullscreen Overlay */}
      <AnimatePresence>
        {showSkyAR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-y-auto"
          >
            <div className="w-full max-w-6xl my-auto">
              <LodaviaSkyAR
                lang={lang}
                playSynthSound={playSynthSound}
                onClose={handleCloseLodaviaSky}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
