import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useStories } from '../../contexts/StoriesContext';
import { firestoreService } from '../../firebase/services';
import { Post, ChatMessage } from '../../types';
import { 
  Camera, 
  Video, 
  RotateCcw, 
  Sparkles, 
  Download, 
  Share2, 
  Check, 
  X, 
  Zap, 
  ZapOff, 
  Clock, 
  ImageIcon, 
  Send, 
  MessageSquare, 
  Film, 
  PlusCircle, 
  AlertCircle, 
  RefreshCw, 
  ArrowLeft, 
  ArrowRight,
  User,
  Sliders,
  Sun
} from 'lucide-react';

interface FullScreenCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FilterItem {
  id: string;
  nameAr: string;
  nameEn: string;
  css: string;
  color: string;
}

const CAMERA_FILTERS: FilterItem[] = [
  { id: 'normal', nameAr: 'طبيعي', nameEn: 'Normal', css: 'none', color: 'bg-slate-700' },
  { id: 'cosmic', nameAr: 'سديم كوني 🌌', nameEn: 'Cosmic Nebula', css: 'contrast(1.2) saturate(1.4) hue-rotate(20deg) brightness(1.05)', color: 'bg-sky-500' },
  { id: 'neon', nameAr: 'سايبر نيون ⚡', nameEn: 'Cyber Neon', css: 'contrast(1.3) saturate(1.6) brightness(1.1) drop-shadow(0 0 10px rgba(56, 189, 248, 0.45))', color: 'bg-cyan-500' },
  { id: 'golden', nameAr: 'غروب ذهبي 🌅', nameEn: 'Golden Hour', css: 'sepia(0.3) saturate(1.35) brightness(1.08) contrast(1.1)', color: 'bg-amber-500' },
  { id: 'vhs', nameAr: 'ريترو كلاسيك 📼', nameEn: 'Retro VHS', css: 'sepia(0.15) contrast(1.25) saturate(0.85) brightness(0.95)', color: 'bg-rose-500' },
  { id: 'alien', nameAr: 'مصفوفة فضائية 👽', nameEn: 'Alien Matrix', css: 'hue-rotate(95deg) contrast(1.25) saturate(1.5)', color: 'bg-emerald-500' },
  { id: 'hologram', nameAr: 'هولوغرام أزرق 💠', nameEn: 'Hologram Blue', css: 'hue-rotate(185deg) contrast(1.4) saturate(1.3) brightness(1.15)', color: 'bg-indigo-500' },
  { id: 'bw', nameAr: 'أبيض وأسود 🎬', nameEn: 'Monochrome Noir', css: 'grayscale(1) contrast(1.35) brightness(1.05)', color: 'bg-slate-900' }
];

export default function FullScreenCameraModal({ isOpen, onClose }: FullScreenCameraModalProps) {
  const { 
    lang, 
    currentUser, 
    playSynthSound, 
    chats, 
    setChats, 
    setActiveChat, 
    setHomePosts 
  } = useApp();
  const { addStory } = useStories();
  const navigate = useNavigate();

  const isAr = lang === 'ar';

  // Mode: 'photo' | 'video'
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');

  // Stream & Hardware
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [torchEnabled, setTorchEnabled] = useState<boolean>(false);
  const [screenRingFlash, setScreenRingFlash] = useState<boolean>(false);

  // Filters & Timer
  const [activeFilter, setActiveFilter] = useState<FilterItem>(CAMERA_FILTERS[0]);
  const [timerSeconds, setTimerSeconds] = useState<number>(0); // 0, 3, 5
  const [countdown, setCountdown] = useState<number | null>(null);

  // Video Recording
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Captured Output
  const [capturedMedia, setCapturedMedia] = useState<{
    type: 'image' | 'video';
    url: string;
    blob?: Blob;
  } | null>(null);

  // Destination Action Sheet
  const [postCaption, setPostCaption] = useState<string>('');
  const [selectedDestination, setSelectedDestination] = useState<'post' | 'story' | 'reel' | 'message' | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // File Picker Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported in this environment');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: captureMode === 'video'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn('Stream play error:', e));
      }
    } catch (err: any) {
      console.warn('Camera access unavailable:', err);
      setCameraError(
        isAr 
          ? 'تعذر الوصول إلى كاميرا الجهاز (قد يتطلب منح الإذن أو استخدام بيئة آمنة). يمكنك استخدام الصور من المعرض أو المعاينة الكونية التفاعلية.'
          : 'Camera access denied or unavailable. You can upload media from your gallery or use the cosmic interactive simulation.'
      );
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (isOpen && !capturedMedia) {
      startCamera();
    } else {
      stopCameraStream();
    }

    return () => {
      stopCameraStream();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isOpen, facingMode, captureMode, capturedMedia]);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
    setTorchEnabled(false);
  };

  // Flip Camera (Front / Rear)
  const toggleCameraFacing = () => {
    playSynthSound(600, 'sine', 0.05);
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Toggle Torch / Flash
  const toggleFlash = async () => {
    playSynthSound(750, 'sine', 0.08);
    if (facingMode === 'environment' && mediaStreamRef.current) {
      const track = mediaStreamRef.current.getVideoTracks()[0];
      if (track) {
        try {
          const capabilities = (track.getCapabilities?.() || {}) as any;
          if (capabilities.torch) {
            await track.applyConstraints({
              advanced: [{ torch: !torchEnabled }]
            } as any);
            setTorchEnabled(!torchEnabled);
            return;
          }
        } catch (e) {
          console.warn('Torch constraint not supported:', e);
        }
      }
    }
    // Fallback: screen ring flash
    setScreenRingFlash(!screenRingFlash);
  };

  // Photo Snap Logic
  const handlePhotoCapture = () => {
    if (timerSeconds > 0) {
      setCountdown(timerSeconds);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            executeCapture();
            return null;
          }
          playSynthSound(700, 'sine', 0.06);
          return prev - 1;
        });
      }, 1000);
    } else {
      executeCapture();
    }
  };

  const executeCapture = () => {
    playSynthSound(950, 'triangle', 0.15);

    const canvas = document.createElement('canvas');
    const width = 720;
    const height = 1280;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      if (videoRef.current && isCameraActive) {
        ctx.filter = activeFilter.css;
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        ctx.filter = 'none';
      } else {
        // High quality simulated space photo
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#060B19');
        grad.addColorStop(0.5, '#0284c7');
        grad.addColorStop(1, '#3b82f6');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('LODAVIA COSMIC SNAPSHOT 🪐', width / 2, height / 2 - 20);
        ctx.font = '22px sans-serif';
        ctx.fillText(new Date().toLocaleTimeString(), width / 2, height / 2 + 30);
      }

      // Lodavia watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('LODAVIA CAMERA ✨', width - 25, height - 35);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedMedia({
        type: 'image',
        url: dataUrl
      });
      setSelectedDestination('post');
    }
  };

  // Video Recording Logic
  const startVideoRecording = () => {
    if (!isCameraActive || !mediaStreamRef.current) {
      // Simulated video
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
        setCapturedMedia({
          type: 'video',
          url: videoUrl,
          blob
        });
        setSelectedDestination('post');
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
      console.warn('Video recorder error:', e);
    }
  };

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
      setCapturedMedia({
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-starfield-in-space-41544-large.mp4'
      });
      setSelectedDestination('post');
    }
  };

  // Gallery file select
  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playSynthSound(650, 'sine', 0.08);
    const isVid = file.type.startsWith('video');
    const objectUrl = URL.createObjectURL(file);

    setCapturedMedia({
      type: isVid ? 'video' : 'image',
      url: objectUrl,
      blob: file
    });
    setSelectedDestination('post');
  };

  // Discard & Retake
  const handleRetake = () => {
    playSynthSound(450, 'sine', 0.1);
    setCapturedMedia(null);
    setSelectedDestination(null);
    setPostCaption('');
    setSelectedChatId('');
    startCamera();
  };

  // Download media
  const handleDownload = () => {
    if (!capturedMedia) return;
    playSynthSound(600, 'sine', 0.1);
    const link = document.createElement('a');
    link.download = `lodavia-${capturedMedia.type}-${Date.now()}.${capturedMedia.type === 'image' ? 'jpg' : 'webm'}`;
    link.href = capturedMedia.url;
    link.click();
    showToast(isAr ? 'تم حفظ الوسائط بنجاح 💾' : 'Media saved to device 💾');
  };

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Format Duration string
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Publish / Use Media Handler (Post, Story, Reel, Message)
  const handleConfirmPublish = async () => {
    if (!capturedMedia) return;
    setIsPublishing(true);
    playSynthSound(880, 'sine', 0.15);

    try {
      if (selectedDestination === 'post') {
        // 1. Publish to Home Post Feed
        const newPost: Post = {
          id: `post_cam_${Date.now()}`,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          authorTitle: isAr ? 'صانع محتوى كوني' : 'Cosmic Creator',
          content: postCaption.trim() || (isAr ? 'تم الالتقاط بواسطة كاميرا لودافيا 📸✨' : 'Captured with Lodavia Camera 📸✨'),
          likes: 0,
          commentsCount: 0,
          timestamp: isAr ? 'الآن' : 'Just now',
          likedByMe: false,
          comments: [],
          image: capturedMedia.type === 'image' ? capturedMedia.url : undefined,
          video: capturedMedia.type === 'video' ? capturedMedia.url : undefined
        };

        setHomePosts(prev => [newPost, ...prev]);
        firestoreService.createPost(newPost).catch(e => console.warn('Firestore post err:', e));
        showToast(isAr ? 'تم نشر المنشور في الرئيسية! 🚀' : 'Posted to Home feed! 🚀');

        setTimeout(() => {
          onClose();
          navigate('/home');
        }, 1200);

      } else if (selectedDestination === 'story') {
        // 2. Publish to Stories
        addStory({
          mediaType: capturedMedia.type,
          mediaUrl: capturedMedia.url,
          textContent: postCaption.trim() || (isAr ? 'قصة جديدة عبر كاميرا لودافيا 🪐' : 'New story via Lodavia Camera 🪐'),
          filter: activeFilter.css,
          privacy: 'everyone'
        });

        showToast(isAr ? 'تمت إضافة القصة بنجاح! 🪐✨' : 'Added to Lodavia Stories! 🪐✨');
        setTimeout(() => {
          onClose();
          navigate('/home');
        }, 1200);

      } else if (selectedDestination === 'reel') {
        // 3. Publish to Reels / Media
        showToast(isAr ? 'تمت مشاركة المقطع في الريلز! 🎬' : 'Shared to Media Reels! 🎬');
        setTimeout(() => {
          onClose();
          navigate('/media');
        }, 1200);

      } else if (selectedDestination === 'message') {
        // 4. Send via Chat Message
        if (!selectedChatId) {
          showToast(isAr ? 'يرجى اختيار المحادثة أولاً 💬' : 'Please select a conversation 💬');
          setIsPublishing(false);
          return;
        }

        const newMsg: ChatMessage = {
          id: `msg_cam_${Date.now()}`,
          senderId: currentUser.id,
          text: postCaption.trim() || (isAr ? 'مرفق وسائط كاميرا 📸' : 'Camera attachment 📸'),
          type: capturedMedia.type === 'image' ? 'image' : 'video',
          mediaUrl: capturedMedia.url,
          timestamp: new Date().toLocaleTimeString(isAr ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })
        };

        const targetChat = chats.find(c => c.id === selectedChatId);
        if (targetChat) {
          const updatedConv = {
            ...targetChat,
            messages: [...targetChat.messages, newMsg]
          };
          setActiveChat(updatedConv);
          setChats(prev => prev.map(c => c.id === selectedChatId ? updatedConv : c));
          firestoreService.sendMessage(selectedChatId, newMsg).catch(e => console.warn('Msg send err:', e));
        }

        showToast(isAr ? 'تم إرسال الرسالة بنجاح! 💌' : 'Sent message successfully! 💌');
        setTimeout(() => {
          onClose();
          navigate('/messages');
        }, 1200);
      }
    } catch (err) {
      console.error('Publish error:', err);
      showToast(isAr ? 'حدث خطأ أثناء المشاركة' : 'Error publishing media');
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed inset-0 z-[100] bg-black text-white flex flex-col overflow-hidden select-none"
      >
        {/* Luminous Front Ring Flash Glow */}
        {screenRingFlash && (
          <div className="absolute inset-0 border-[16px] sm:border-[24px] border-white/95 pointer-events-none z-30 animate-pulse" />
        )}

        {/* ----------------- TOP CAMERA CONTROLS ----------------- */}
        <div className="relative z-20 flex items-center justify-between p-3.5 sm:p-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          {/* Close button */}
          <button
            onClick={() => {
              playSynthSound(400, 'sine', 0.08);
              onClose();
            }}
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white/90 backdrop-blur-md border border-white/10 transition-all cursor-pointer"
            aria-label="Close Camera"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Flash / Ring Light Toggle */}
          <button
            onClick={toggleFlash}
            className={`p-2.5 rounded-full transition-all cursor-pointer backdrop-blur-md border ${
              torchEnabled || screenRingFlash 
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.6)]' 
                : 'bg-black/40 text-white/90 border-white/10 hover:bg-black/60'
            }`}
            title={isAr ? 'الفلاش / إضاءة السيلفي' : 'Flash / Selfie Light'}
          >
            {torchEnabled || screenRingFlash ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
          </button>

          {/* Timer Toggle (Off -> 3s -> 5s) */}
          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.05);
              setTimerSeconds(prev => prev === 0 ? 3 : prev === 3 ? 5 : 0);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer backdrop-blur-md border ${
              timerSeconds > 0 
                ? 'bg-sky-500 text-white border-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.5)]' 
                : 'bg-black/40 text-white/90 border-white/10 hover:bg-black/60'
            }`}
            title={isAr ? 'المؤقت الذاتي' : 'Self Timer'}
          >
            <Clock className="w-4 h-4" />
            <span>{timerSeconds === 0 ? (isAr ? 'إيقاف' : 'Off') : `${timerSeconds}s`}</span>
          </button>

          {/* Flip Camera (Front / Rear) */}
          <button
            onClick={toggleCameraFacing}
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white/90 backdrop-blur-md border border-white/10 transition-all cursor-pointer active:rotate-180"
            title={isAr ? 'قلب الكاميرا' : 'Switch Camera'}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* ----------------- CENTRAL VIEWFINDER / CAPTURED PREVIEW ----------------- */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-950">
          
          {/* Captured Media Preview (When photo/video is taken) */}
          {capturedMedia ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              {capturedMedia.type === 'image' ? (
                <img 
                  src={capturedMedia.url} 
                  alt="Captured Snapshot" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <video 
                  src={capturedMedia.url} 
                  controls 
                  autoPlay 
                  loop 
                  className="w-full h-full object-contain"
                />
              )}

              {/* Retake & Download Floaters on top-left of preview */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <button
                  onClick={handleRetake}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-bold backdrop-blur-md border border-white/15 cursor-pointer shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isAr ? 'إعادة الالتقاط' : 'Retake'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 cursor-pointer shadow-lg"
                  title={isAr ? 'تنزيل' : 'Download'}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Live Camera Feed or Simulation */
            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* Real Video Element */}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                style={{ filter: activeFilter.css }}
                className={`w-full h-full object-cover transition-all ${facingMode === 'user' ? '-scale-x-100' : ''}`}
              />

              {/* Fallback Viewfinder if Camera Access is Unavailable */}
              {!isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 via-[#0B1220] to-slate-950 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center mb-4 text-sky-400 animate-pulse">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-black text-white mb-2">
                    {isAr ? 'المعاينة الفضائية التفاعلية' : 'Lodavia Cosmic Viewfinder'}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-sm mb-5 leading-relaxed">
                    {cameraError || (isAr ? 'الكاميرا جاهزة للالتقاط والمحاكاة أو اختيار وسائط من معرض جهازك.' : 'Ready for cosmic snapshots or selecting media from your gallery.')}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={startCamera}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إعادة محاولة الكاميرا' : 'Retry Camera'}</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer border border-white/20"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{isAr ? 'فتح المعرض' : 'Open Gallery'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Countdown Big Display */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40 backdrop-blur-xs">
                  <span className="text-8xl font-black text-white animate-ping drop-shadow-2xl">
                    {countdown}
                  </span>
                </div>
              )}

              {/* Live Video Recording Duration Badge */}
              {isRecording && (
                <div className="absolute top-4 inset-x-0 flex justify-center z-20 pointer-events-none">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-black shadow-xl backdrop-blur-md animate-pulse">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    <span>REC {formatDuration(recordingDuration)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Toast Notification Alert */}
          {toastMessage && (
            <div className="absolute bottom-6 inset-x-4 flex justify-center z-50 pointer-events-none">
              <div className="px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-sky-500/40 text-white text-xs font-black shadow-2xl backdrop-blur-xl animate-[scaleIn_0.2s_ease-out]">
                {toastMessage}
              </div>
            </div>
          )}
        </div>

        {/* ----------------- BOTTOM CONTROLS & DESTINATION ACTION SHEET ----------------- */}
        <div className="relative z-20 bg-gradient-to-t from-black via-black/90 to-transparent p-4 sm:p-6 flex flex-col gap-4">
          
          {/* A: When Media is Captured -> Show Destination Workflow (Post, Story, Reel, Message) */}
          {capturedMedia ? (
            <div className="flex flex-col gap-3 animate-[fadeIn_0.25s_ease-out]">
              
              {/* Caption Input */}
              <div className="flex items-center gap-2 bg-white/10 rounded-2xl p-2 border border-white/15">
                <input
                  type="text"
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  placeholder={isAr ? 'أضف تعليقاً على اللقطة...' : 'Add a cosmic caption...'}
                  className="flex-1 bg-transparent px-2 text-xs text-white placeholder-slate-400 focus:outline-hidden"
                />
              </div>

              {/* Destination Selector Tabs */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'post', labelAr: 'منشور', labelEn: 'Post', icon: PlusCircle, color: 'text-sky-400' },
                  { id: 'story', labelAr: 'قصة', labelEn: 'Story', icon: Sparkles, color: 'text-amber-400' },
                  { id: 'reel', labelAr: 'ريلز', labelEn: 'Reel', icon: Film, color: 'text-rose-400' },
                  { id: 'message', labelAr: 'رسالة', labelEn: 'Message', icon: MessageSquare, color: 'text-emerald-400' },
                ].map((dest) => {
                  const Icon = dest.icon;
                  const isSelected = selectedDestination === dest.id;
                  return (
                    <button
                      key={dest.id}
                      onClick={() => {
                        playSynthSound(600, 'sine', 0.05);
                        setSelectedDestination(dest.id as any);
                      }}
                      className={`flex flex-col items-center gap-1 py-2 px-1 rounded-2xl transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-sky-500/25 border-sky-400 text-white font-black shadow-md' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${dest.color}`} />
                      <span className="text-[10px] font-bold truncate">
                        {isAr ? dest.labelAr : dest.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Specific Chat Selector if 'message' is selected */}
              {selectedDestination === 'message' && (
                <div className="flex flex-col gap-1.5 p-2 rounded-2xl bg-white/5 border border-white/10 max-h-32 overflow-y-auto custom-scrollbar">
                  <span className="text-[10px] font-bold text-slate-400 px-1">
                    {isAr ? 'اختر المستلم:' : 'Select recipient:'}
                  </span>
                  <div className="flex flex-col gap-1">
                    {chats.slice(0, 5).map(chat => (
                      <button
                        key={chat.id}
                        onClick={() => setSelectedChatId(chat.id)}
                        className={`flex items-center justify-between p-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                          selectedChatId === chat.id 
                            ? 'bg-sky-500 text-white font-bold' 
                            : 'bg-white/5 text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={chat.contactAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                          <span className="truncate">{chat.contactName}</span>
                        </div>
                        {selectedChatId === chat.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm / Share Button */}
              <button
                disabled={isPublishing}
                onClick={handleConfirmPublish}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-black text-sm transition-all cursor-pointer shadow-[0_0_20px_rgba(14,165,233,0.5)] flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isPublishing 
                    ? (isAr ? 'جاري المشاركة...' : 'Publishing...') 
                    : (isAr ? `تأكيد ومشاركة كـ ${selectedDestination === 'post' ? 'منشور' : selectedDestination === 'story' ? 'قصة' : selectedDestination === 'reel' ? 'ريلز' : 'رسالة'}` : `Share as ${selectedDestination}`)}
                </span>
              </button>

            </div>
          ) : (
            /* B: Viewfinder Active -> Filters Bar, Capture Shutter, Mode Toggles */
            <div className="flex flex-col gap-3">
              
              {/* Horizontal Filter Presets Bar */}
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 px-1">
                {CAMERA_FILTERS.map(f => {
                  const isSelected = activeFilter.id === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        playSynthSound(700, 'sine', 0.04);
                        setActiveFilter(f);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                        isSelected 
                          ? 'bg-sky-500 text-white border-sky-300 shadow-[0_0_12px_rgba(14,165,233,0.5)] scale-105' 
                          : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/20'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${f.color}`} />
                      <span>{isAr ? f.nameAr : f.nameEn}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mode Toggle (Photo vs Video) */}
              <div className="flex items-center justify-center gap-6 text-xs font-black">
                <button
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.05);
                    setCaptureMode('photo');
                  }}
                  className={`transition-all cursor-pointer pb-1 border-b-2 ${
                    captureMode === 'photo' 
                      ? 'border-sky-400 text-sky-400 scale-110' 
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'صورة فوتوغرافية' : 'PHOTO'}
                </button>
                <button
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.05);
                    setCaptureMode('video');
                  }}
                  className={`transition-all cursor-pointer pb-1 border-b-2 ${
                    captureMode === 'video' 
                      ? 'border-rose-400 text-rose-400 scale-110' 
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'فيديو كوني' : 'VIDEO'}
                </button>
              </div>

              {/* Main Shutter Row */}
              <div className="flex items-center justify-between px-6 pt-1">
                
                {/* 1. Media Picker (Gallery File Input) */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                  title={isAr ? 'اختيار من المعرض' : 'Pick from Gallery'}
                >
                  <ImageIcon className="w-5 h-5 text-sky-400" />
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*,video/*" 
                    onChange={handleFilePicked} 
                    className="hidden" 
                  />
                </button>

                {/* 2. Central Shutter Button */}
                {captureMode === 'photo' ? (
                  <button
                    onClick={handlePhotoCapture}
                    className="w-18 h-18 rounded-full border-4 border-white p-1.5 transition-all cursor-pointer active:scale-95 flex items-center justify-center hover:border-sky-400 group shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                    aria-label="Capture Photo"
                  >
                    <div className="w-full h-full rounded-full bg-white group-hover:bg-sky-400 transition-colors" />
                  </button>
                ) : (
                  <button
                    onClick={isRecording ? stopVideoRecording : startVideoRecording}
                    className={`w-18 h-18 rounded-full border-4 p-1.5 transition-all cursor-pointer active:scale-95 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.4)] ${
                      isRecording 
                        ? 'border-red-500 animate-pulse' 
                        : 'border-white hover:border-red-500'
                    }`}
                    aria-label={isRecording ? "Stop Video Recording" : "Start Video Recording"}
                  >
                    <div className={`transition-all ${
                      isRecording 
                        ? 'w-6 h-6 rounded-md bg-red-600' 
                        : 'w-full h-full rounded-full bg-red-600'
                    }`} />
                  </button>
                )}

                {/* 3. Flip Camera Button */}
                <button
                  onClick={toggleCameraFacing}
                  className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                  title={isAr ? 'قلب الكاميرا' : 'Switch Camera'}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

              </div>
            </div>
          )}

        </div>

      </motion.div>
    </AnimatePresence>
  );
}
