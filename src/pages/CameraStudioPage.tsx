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
  Share2, 
  Check, 
  X, 
  Music, 
  Smile, 
  Paintbrush, 
  Sliders, 
  Clock, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Zap, 
  ZapOff, 
  Play, 
  Pause, 
  ArrowLeft, 
  ArrowRight,
  Tv,
  Film,
  Crown,
  Glasses,
  Sun,
  Moon,
  Flame,
  Globe,
  PlusCircle,
  MessageSquare
} from 'lucide-react';

interface CameraFilter {
  id: string;
  nameAr: string;
  nameEn: string;
  filterCss: string;
  badgeColor: string;
}

const CAMERA_FILTERS: CameraFilter[] = [
  { id: 'normal', nameAr: 'عادي', nameEn: 'Normal', filterCss: 'none', badgeColor: 'bg-slate-700' },
  { id: 'cosmic', nameAr: 'سديم كوني 🌌', nameEn: 'Cosmic Nebula', filterCss: 'contrast(1.2) saturate(1.4) hue-rotate(20deg) brightness(1.05)', badgeColor: 'bg-sky-500' },
  { id: 'neon', nameAr: 'سايبر نيون ⚡', nameEn: 'Cyber Neon', filterCss: 'contrast(1.3) saturate(1.6) brightness(1.1) drop-shadow(0 0 8px rgba(56, 189, 248, 0.4))', badgeColor: 'bg-cyan-500' },
  { id: 'golden', nameAr: 'الغروب الذهبي 🌅', nameEn: 'Golden Hour', filterCss: 'sepia(0.25) saturate(1.35) brightness(1.08) contrast(1.1)', badgeColor: 'bg-amber-500' },
  { id: 'vhs', nameAr: 'ريترو كلاسيك 📼', nameEn: 'Retro VHS', filterCss: 'sepia(0.15) contrast(1.25) saturate(0.85) brightness(0.95)', badgeColor: 'bg-rose-500' },
  { id: 'alien', nameAr: 'مصفوفة فضائية 👽', nameEn: 'Alien Matrix', filterCss: 'hue-rotate(95deg) contrast(1.25) saturate(1.5)', badgeColor: 'bg-emerald-500' },
  { id: 'hologram', nameAr: 'هولوغرام أزرق 💠', nameEn: 'Hologram Blue', filterCss: 'hue-rotate(185deg) contrast(1.4) saturate(1.3) brightness(1.15)', badgeColor: 'bg-indigo-500' },
  { id: 'bw', nameAr: 'أبيض وأسود فاخر 🎬', nameEn: 'Monochrome Noir', filterCss: 'grayscale(1) contrast(1.35) brightness(1.05)', badgeColor: 'bg-slate-900' }
];

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
  const { playTrack, currentTrack } = useAudio();
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  const [showChatModal, setShowChatModal] = useState(false);

  // Mode: 'photo' | 'video'
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');

  // Camera stream states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Filter & AR Props
  const [activeFilter, setActiveFilter] = useState<CameraFilter>(CAMERA_FILTERS[0]);
  const [activeProp, setActiveProp] = useState<string>('none');
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

  // Canvas drawing & text overlay
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawColor, setDrawColor] = useState<string>('#38BDF8');
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [overlayText, setOverlayText] = useState<string>('');
  const [showTextInput, setShowTextInput] = useState<boolean>(false);

  // Background Audio Layer
  const [selectedMusic, setSelectedMusic] = useState<any | null>(null);
  const [showMusicPicker, setShowMusicPicker] = useState<boolean>(false);

  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    startCamera();
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [facingMode, captureMode]);

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
      // Background gradient or camera feed
      if (videoRef.current && isCameraActive) {
        ctx.filter = activeFilter.filterCss;
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        ctx.filter = 'none';
      } else {
        // High quality simulated space viewfinder snapshot
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#0a0f1d');
        grad.addColorStop(0.5, '#0284c7');
        grad.addColorStop(1, '#4338ca');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Simulated avatar/face in middle
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('LODAVIA COSMIC SNAPSHOT 🪐', width / 2, height / 2 - 40);
        ctx.font = '20px sans-serif';
        ctx.fillText(new Date().toLocaleTimeString(), width / 2, height / 2 + 20);
      }

      // Add Lodavia Watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('LODAVIA STUDIO 🚀', width - 30, height - 40);

      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);
    }
  };

  // Start Video Recording
  const startVideoRecording = () => {
    if (!isCameraActive || !mediaStreamRef.current) {
      // Simulate video capture
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
      // Fallback mock video
      setCapturedVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-starfield-in-space-41544-large.mp4');
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
    <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pb-20 animate-[fadeIn_0.3s_ease-out]">
      
      {/* ----------------- TOP BAR ----------------- */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white dark:bg-[#182232] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
        >
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isAr ? 'رجوع' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-cyan-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 dark:text-white">
              {isAr ? 'استوديو الكاميرا والتصوير الكوني' : 'Lodavia Cosmic Camera Studio'}
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-0.5 font-semibold">
              {isAr ? 'فلاتر حية، تسجيل فائق الدقة، وتأثيرات فضائية' : 'Live AR Filters, HD Video & Space FX'}
            </span>
          </div>
        </div>

        {/* Capture Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              setCaptureMode('photo');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              captureMode === 'photo'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            📸 {isAr ? 'صورة' : 'Photo'}
          </button>

          <button
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              setCaptureMode('video');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              captureMode === 'video'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            📹 {isAr ? 'فيديو' : 'Video'}
          </button>
        </div>
      </div>

      {/* ----------------- VIEWFINDER MAIN CARD ----------------- */}
      <div className="relative w-full aspect-[9/16] sm:aspect-[4/3] md:aspect-[16/10] lg:aspect-[16/9] max-h-[720px] rounded-[36px] overflow-hidden bg-black border-4 border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between p-5 select-none mx-auto">
        
        {/* Flash Effect Layer */}
        {flashEnabled && (
          <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-[fadeOut_0.4s_ease-out]" />
        )}

        {/* Video / Captured View */}
        {!capturedImage && !capturedVideoUrl ? (
          <>
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{
                  filter: activeFilter.filterCss,
                  transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                }}
              />
            ) : (
              // Simulated Space Camera Canvas
              <div 
                className="absolute inset-0 w-full h-full z-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#060a16] via-[#0e172a] to-[#1e1b4b] transition-all"
                style={{ filter: activeFilter.filterCss }}
              >
                <div className="relative flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-sky-500/20 border-2 border-dashed border-sky-400/60 flex items-center justify-center animate-spin-slow mb-4">
                    <Sparkles className="w-10 h-10 text-sky-400" />
                  </div>
                  <span className="text-sm font-black text-white tracking-widest uppercase">
                    {isAr ? 'مستشعر الرؤية الفضائية متصل' : 'Cosmic Vision Viewfinder'}
                  </span>
                  <span className="text-xs text-cyan-300 font-mono mt-1">
                    60 FPS • 4K ULTRA MATRIX
                  </span>
                </div>
              </div>
            )}

            {/* AR Overlay Prop Render */}
            {activeProp !== 'none' && (
              <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                {activeProp === 'helmet' && (
                  <div className="w-56 h-56 rounded-full border-4 border-cyan-400/80 shadow-[0_0_40px_rgba(34,211,238,0.5)] flex items-center justify-center animate-pulse">
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
          // POST-CAPTURE PREVIEW
          <div className="absolute inset-0 w-full h-full z-0 bg-black flex items-center justify-center">
            {capturedImage ? (
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-full object-contain" 
              />
            ) : (
              <video 
                src={capturedVideoUrl || ''} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-contain" 
              />
            )}
          </div>
        )}

        {/* ----------------- TOP CAMERA CONTROLS OVERLAY ----------------- */}
        <div className="relative z-20 flex justify-between items-center w-full">
          
          {/* Active Filter Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-black">
            <span className={`w-2 h-2 rounded-full ${activeFilter.badgeColor} animate-ping`} />
            <span>{isAr ? activeFilter.nameAr : activeFilter.nameEn}</span>
          </div>

          {/* Quick Settings: Flip Camera, Timer, Flash, Soundtrack */}
          <div className="flex items-center gap-2">
            
            {/* Timer Toggle */}
            <button
              onClick={() => {
                const next = timerSeconds === 0 ? 3 : timerSeconds === 3 ? 5 : timerSeconds === 5 ? 10 : 0;
                setTimerSeconds(next);
                playSynthSound(600, 'sine', 0.05);
              }}
              className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer text-xs font-black flex items-center gap-1 ${
                timerSeconds > 0 
                  ? 'bg-amber-500 text-white border-amber-400' 
                  : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
              }`}
              title={isAr ? 'المؤقت التلقائي' : 'Self Timer'}
            >
              <Clock className="w-4 h-4" />
              {timerSeconds > 0 && <span>{timerSeconds}s</span>}
            </button>

            {/* Music Picker Trigger */}
            <button
              onClick={() => setShowMusicPicker(!showMusicPicker)}
              className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                selectedMusic 
                  ? 'bg-sky-500 text-white border-sky-400' 
                  : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
              }`}
              title={isAr ? 'إضافة موسيقى خلفية' : 'Background Audio'}
            >
              <Music className="w-4 h-4" />
            </button>

            {/* Flip Camera */}
            <button
              onClick={toggleCameraFacing}
              className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 transition-all cursor-pointer"
              title={isAr ? 'تبديل الكاميرا' : 'Switch Camera'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

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

        {/* Video Recording Status Badge */}
        {isRecording && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-rose-600 text-white font-mono font-black text-xs flex items-center gap-2 shadow-lg animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span>REC {formatDuration(recordingDuration)}</span>
          </div>
        )}

        {/* ----------------- BOTTOM CONTROLS & SHUTTER OVERLAY ----------------- */}
        <div className="relative z-20 flex flex-col gap-4 w-full">
          
          {/* Live AR & Filter Selector Slider (When not in post-capture) */}
          {!capturedImage && !capturedVideoUrl && (
            <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar justify-center">
              {CAMERA_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.04);
                    setActiveFilter(f);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-black shrink-0 transition-all cursor-pointer backdrop-blur-md border ${
                    activeFilter.id === f.id
                      ? 'bg-sky-500 text-white border-white shadow-lg scale-105'
                      : 'bg-black/60 text-white/80 border-white/10 hover:border-white/40'
                  }`}
                >
                  {isAr ? f.nameAr : f.nameEn}
                </button>
              ))}
            </div>
          )}

          {/* AR Props Selector */}
          {!capturedImage && !capturedVideoUrl && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar justify-center">
              {AR_PROPS.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    playSynthSound(550, 'sine', 0.04);
                    setActiveProp(p.id);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold shrink-0 transition-all cursor-pointer backdrop-blur-md border flex items-center gap-1 ${
                    activeProp === p.id
                      ? 'bg-amber-500 text-white border-amber-300 shadow-md'
                      : 'bg-black/50 text-white/70 border-white/10 hover:border-white/30'
                  }`}
                >
                  <span>{p.emoji}</span>
                  <span>{isAr ? p.labelAr : p.labelEn}</span>
                </button>
              ))}
            </div>
          )}

          {/* Shutter / Action Center Button */}
          {!capturedImage && !capturedVideoUrl ? (
            <div className="flex justify-center items-center gap-6 py-2">
              
              {/* Capture Trigger Button */}
              {captureMode === 'photo' ? (
                <button
                  onClick={triggerPhotoCapture}
                  className="w-18 h-18 rounded-full border-4 border-white bg-white/20 backdrop-blur-md p-1 hover:scale-105 active:scale-90 transition-all cursor-pointer flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.6)]"
                >
                  <div className="w-full h-full rounded-full bg-white shadow-md flex items-center justify-center">
                    <Camera className="w-7 h-7 text-slate-900" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={isRecording ? stopVideoRecording : startVideoRecording}
                  className={`w-18 h-18 rounded-full border-4 border-white p-1 hover:scale-105 active:scale-90 transition-all cursor-pointer flex items-center justify-center ${
                    isRecording 
                      ? 'bg-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.8)]' 
                      : 'bg-white/20 backdrop-blur-md'
                  }`}
                >
                  <div className={`transition-all ${isRecording ? 'w-6 h-6 rounded-md bg-rose-600' : 'w-full h-full rounded-full bg-rose-600 flex items-center justify-center'}`}>
                    {!isRecording && <Video className="w-7 h-7 text-white" />}
                  </div>
                </button>
              )}
            </div>
          ) : (
            // POST CAPTURE ACTIONS BAR
            <div className="flex flex-col gap-2 p-2 rounded-2xl bg-black/70 backdrop-blur-md border border-white/20">
              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                {/* Retake */}
                <button
                  onClick={() => {
                    playSynthSound(450, 'sine', 0.08);
                    setCapturedImage(null);
                    setCapturedVideoUrl(null);
                    setCapturedBlob(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إعادة' : 'Retake'}</span>
                </button>

                {/* Download */}
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title={isAr ? 'تنزيل اللقطة' : 'Download'}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                {/* Publish to Home Post */}
                <button
                  onClick={handlePublishToPost}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-black shadow-md flex items-center gap-1 hover:scale-105 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isAr ? 'منشور 📝' : 'Post 📝'}</span>
                </button>

                {/* Publish to Stories */}
                <button
                  onClick={handlePublishToStories}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-md flex items-center gap-1 hover:scale-105 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? 'قصص 🪐' : 'Stories 🪐'}</span>
                </button>

                {/* Publish to Media */}
                <button
                  onClick={handlePublishToMedia}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-black shadow-md flex items-center gap-1 hover:scale-105 transition-all cursor-pointer"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>{isAr ? 'ريلز 🎬' : 'Reels 🎬'}</span>
                </button>

                {/* Send to Chat */}
                <button
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.05);
                    setShowChatModal(true);
                  }}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black shadow-md flex items-center gap-1 hover:scale-105 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isAr ? 'رسالة 💬' : 'Chat 💬'}</span>
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
              <button onClick={() => setShowMusicPicker(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
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

    </div>
  );
}
