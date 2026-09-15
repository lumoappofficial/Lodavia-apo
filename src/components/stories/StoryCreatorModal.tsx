import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Camera, Video as VideoIcon, Image as ImageIcon, Type, Music, Smile, 
  Paintbrush, Sliders, Lock, Check, Sparkles, Upload, RotateCcw, Volume2, ShieldCheck
} from 'lucide-react';
import { useStories } from '../../contexts/StoriesContext';
import { useApp } from '../../contexts/AppContext';
import { useAudio } from '../../contexts/AudioContext';
import { StoryPrivacyOption, StoryMediaType, StorySticker } from '../../types/story';
import { AUDIO_ITEMS } from '../../data/audioData';

const BACKGROUND_GRADIENTS = [
  'linear-gradient(135deg, #0f172a 0%, #0284c7 50%, #7e22ce 100%)',
  'linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #4c1d95 100%)',
  'linear-gradient(135deg, #18181b 0%, #b45309 50%, #78350f 100%)',
  'linear-gradient(135deg, #022c22 0%, #0d9488 50%, #065f46 100%)',
  'linear-gradient(135deg, #881337 0%, #e11d48 50%, #4c0519 100%)'
];

const STICKER_EMOJIS = ['❤️', '🔥', '✨', '⭐', '🚀', '👑', '🎉', '😍', '👏', '💯', '🌌', '🎵'];

const FILTERS = [
  { name: 'Normal', filter: 'none' },
  { name: 'Cosmic', filter: 'contrast(1.15) saturate(1.3) hue-rotate(15deg)' },
  { name: 'Neon', filter: 'brightness(1.1) contrast(1.2) saturate(1.5)' },
  { name: 'Warm', filter: 'sepia(0.2) saturate(1.2) brightness(1.05)' },
  { name: 'B&W', filter: 'grayscale(1)' }
];

export function StoryCreatorModal() {
  const { lang, playSynthSound } = useApp();
  const { closeCreator, addStory } = useStories();
  const { queue } = useAudio();

  // Mode: 'choose' | 'camera' | 'editor'
  const [mode, setMode] = useState<'choose' | 'camera' | 'editor'>('choose');
  
  // Media State
  const [mediaType, setMediaType] = useState<StoryMediaType>('text');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('مرحباً بك في قصتي الكونية 🌌✨');
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [selectedBgGradient, setSelectedBgGradient] = useState<string>(BACKGROUND_GRADIENTS[0]);
  const [selectedFilter, setSelectedFilter] = useState<string>('none');
  
  // Music & Privacy & Stickers & Drawing
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [privacy, setPrivacy] = useState<StoryPrivacyOption>('everyone');
  const [stickers, setStickers] = useState<StorySticker[]>([]);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Camera recording stream ref
  const videoStreamRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Canvas drawing ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#38BDF8');
  const [hasDrawing, setHasDrawing] = useState(false);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up media streams
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const startCamera = async (type: 'photo' | 'video') => {
    playSynthSound(500, 'sine', 0.05);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: type === 'video'
      });
      mediaStreamRef.current = stream;
      setMediaType(type === 'photo' ? 'image' : 'video');
      setMode('camera');

      setTimeout(() => {
        if (videoStreamRef.current) {
          videoStreamRef.current.srcObject = stream;
        }
      }, 100);
    } catch (e) {
      console.warn('Camera access error, falling back to gallery upload', e);
      // Fallback to gallery picker if camera rejected/unavailable
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const captureCameraPhoto = () => {
    if (!videoStreamRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoStreamRef.current.videoWidth || 720;
    canvas.height = videoStreamRef.current.videoHeight || 1280;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoStreamRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setMediaUrl(dataUrl);
      setMediaType('image');
      stopCameraStream();
      setMode('editor');
      playSynthSound(800, 'triangle', 0.1);
    }
  };

  const toggleRecordVideo = () => {
    if (!mediaStreamRef.current) return;

    if (!isRecordingVideo) {
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(mediaStreamRef.current);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        setMediaUrl(url);
        setMediaType('video');
        stopCameraStream();
        setMode('editor');
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecordingVideo(true);
      playSynthSound(600, 'sine', 0.1);
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecordingVideo(false);
      playSynthSound(400, 'sine', 0.1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    setMediaType(isVideo ? 'video' : 'image');
    setMode('editor');
    playSynthSound(700, 'sine', 0.08);
  };

  const handleStartTextStory = () => {
    setMediaType('text');
    setMediaUrl('');
    setMode('editor');
    playSynthSound(650, 'sine', 0.08);
  };

  const addSticker = (emoji: string) => {
    const newSticker: StorySticker = {
      id: `st_${Date.now()}`,
      emojiOrIcon: emoji,
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      scale: 1.2
    };
    setStickers([...stickers, newSticker]);
    setShowEmojiPicker(false);
    playSynthSound(900, 'sine', 0.05);
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setHasDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setHasDrawing(false);
  };

  const handlePublish = () => {
    let drawingDataUrl: string | undefined;
    if (hasDrawing && canvasRef.current) {
      drawingDataUrl = canvasRef.current.toDataURL('image/png');
    }

    addStory({
      mediaUrl: mediaUrl,
      mediaType: mediaType,
      textContent: textContent,
      textColor: textColor,
      bgColor: selectedBgGradient,
      filter: selectedFilter,
      stickers: stickers,
      drawingDataUrl: drawingDataUrl,
      musicTrack: selectedTrack ? {
        id: selectedTrack.id,
        title: selectedTrack.titleAr || selectedTrack.title,
        artist: selectedTrack.artistAr || selectedTrack.artist,
        audioUrl: selectedTrack.audioUrl,
        coverUrl: selectedTrack.coverUrl
      } : undefined,
      privacy: privacy
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-0 md:p-4 text-start">
      
      {/* Top Header */}
      <div className="w-full max-w-lg flex items-center justify-between p-4 z-20 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-bold font-sans">
            {lang === 'ar' ? 'إنشاء قصة لودافيا' : 'Create Lodavia Story'}
          </span>
        </div>
        <button
          onClick={() => {
            stopCameraStream();
            closeCreator();
          }}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Hidden File Input for Gallery Selection */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,video/*"
        className="hidden"
      />

      {/* MODE 1: CHOOSE STORY TYPE */}
      {mode === 'choose' && (
        <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 text-white animate-[fadeIn_0.3s_ease-out]">
          <div className="text-center">
            <h2 className="text-base font-extrabold text-white mb-1">
              {lang === 'ar' ? 'اختر طريقة مشاركة قصتك' : 'Choose Story Format'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'قصتك ستختفي تلقائياً بعد ٢٤ ساعة' : 'Your story automatically vanishes after 24 hours'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => startCamera('photo')}
              className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold">{lang === 'ar' ? 'كاميرا صورة' : 'Camera Photo'}</span>
            </button>

            <button
              onClick={() => startCamera('video')}
              className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-400 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <VideoIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold">{lang === 'ar' ? 'كاميرا فيديو' : 'Camera Video'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-400 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold">{lang === 'ar' ? 'معرض الصور والفيديو' : 'Gallery Upload'}</span>
            </button>

            <button
              onClick={handleStartTextStory}
              className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-400 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Type className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold">{lang === 'ar' ? 'قصة نصية' : 'Text Story'}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: CAMERA STREAM CAPTURE */}
      {mode === 'camera' && (
        <div className="w-full max-w-sm flex-1 flex flex-col items-center justify-between relative p-4">
          <video
            ref={videoStreamRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-3xl border border-white/20 shadow-2xl"
          />

          <div className="absolute bottom-8 flex items-center gap-6 z-20">
            {mediaType === 'image' ? (
              <button
                onClick={captureCameraPhoto}
                className="w-16 h-16 rounded-full bg-white text-slate-950 flex items-center justify-center border-4 border-cyan-400 shadow-[0_0_20px_#38bdf8] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <Camera className="w-8 h-8" />
              </button>
            ) : (
              <button
                onClick={toggleRecordVideo}
                className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-xl transition-all cursor-pointer ${
                  isRecordingVideo ? 'bg-rose-600 animate-pulse' : 'bg-rose-500'
                }`}
              >
                <VideoIcon className="w-8 h-8 text-white" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODE 3: FULL STORY EDITOR */}
      {mode === 'editor' && (
        <div className="w-full max-w-md flex-1 flex flex-col relative overflow-hidden bg-[#0a0f1d] border border-white/10 md:rounded-3xl shadow-2xl">
          
          {/* Main Canvas / Media Surface */}
          <div
            className="flex-1 relative flex items-center justify-center overflow-hidden p-4"
            style={{
              background: mediaType === 'text' ? selectedBgGradient : '#000000',
              filter: selectedFilter
            }}
          >
            {mediaType === 'image' && mediaUrl && (
              <img src={mediaUrl} alt="Story Preview" className="w-full h-full object-contain" />
            )}

            {mediaType === 'video' && mediaUrl && (
              <video src={mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-contain" />
            )}

            {/* Text Overlay for Text Story or Caption */}
            <div className="absolute inset-x-8 text-center z-10">
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                style={{ color: textColor }}
                placeholder={lang === 'ar' ? 'اكتب نص القصة هنا...' : 'Type your story caption...'}
                className="w-full bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none shadow-xl"
                rows={3}
              />
            </div>

            {/* Attached Stickers Overlay */}
            {stickers.map((st) => (
              <div
                key={st.id}
                className="absolute text-4xl select-none cursor-move animate-bounce"
                style={{ left: `${st.x}%`, top: `${st.y}%` }}
              >
                {st.emojiOrIcon}
              </div>
            ))}

            {/* Attached Music Badge */}
            {selectedTrack && (
              <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md border border-cyan-500/40 text-cyan-300 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono shadow-lg">
                <Music className="w-3.5 h-3.5 animate-spin" />
                <span className="truncate max-w-[140px]">{selectedTrack.titleAr || selectedTrack.title}</span>
                <button onClick={() => setSelectedTrack(null)} className="hover:text-rose-400 ml-1 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Canvas overlay for Drawing */}
            <canvas
              ref={canvasRef}
              width={360}
              height={500}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 z-15 cursor-crosshair touch-none"
            />
          </div>

          {/* Editor Toolbar & Controls */}
          <div className="bg-[#111827] border-t border-white/10 p-3 flex flex-col gap-3 text-white z-20">
            
            {/* Action Tools Row */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
              
              {/* Text BG selector (if text story) */}
              {mediaType === 'text' && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {BACKGROUND_GRADIENTS.map((bg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedBgGradient(bg)}
                      style={{ background: bg }}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                        selectedBgGradient === bg ? 'border-cyan-400 scale-110' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Text Color Selector */}
              <div className="flex items-center gap-1 shrink-0">
                {['#FFFFFF', '#38BDF8', '#F59E0B', '#EC4899', '#10B981'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setTextColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-5 h-5 rounded-full border cursor-pointer ${
                      textColor === c ? 'ring-2 ring-cyan-400 scale-110' : 'border-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Music Button */}
              <button
                onClick={() => setShowMusicPicker(true)}
                className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-xl shrink-0 cursor-pointer"
              >
                <Music className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedTrack ? (lang === 'ar' ? 'موسيقى 🎵' : 'Music 🎵') : (lang === 'ar' ? 'إضافة موسيقى' : 'Add Music')}</span>
              </button>

              {/* Sticker Button */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-xl shrink-0 cursor-pointer"
              >
                <Smile className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ar' ? 'ملصقات' : 'Stickers'}</span>
              </button>

              {/* Clear Drawing */}
              {hasDrawing && (
                <button
                  onClick={clearCanvas}
                  className="flex items-center gap-1 text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-1.5 rounded-xl shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'مسح الرسم' : 'Clear'}</span>
                </button>
              )}
            </div>

            {/* Sticker Picker Drawer */}
            {showEmojiPicker && (
              <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 bg-white/5 rounded-xl border border-white/10">
                {STICKER_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addSticker(emoji)}
                    className="text-xl p-1 hover:scale-125 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Privacy Dropdown & Filter Row */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5 text-xs">
              
              {/* Privacy Selector */}
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value as StoryPrivacyOption)}
                  className="bg-transparent text-white text-xs focus:outline-none font-sans cursor-pointer"
                >
                  <option value="everyone" className="bg-[#111827]">
                    {lang === 'ar' ? 'الجميع (العام)' : 'Everyone'}
                  </option>
                  <option value="friends" className="bg-[#111827]">
                    {lang === 'ar' ? 'الأصدقاء فقط' : 'Friends Only'}
                  </option>
                  <option value="close_friends" className="bg-[#111827]">
                    {lang === 'ar' ? 'الأصدقاء المقربون' : 'Close Friends'}
                  </option>
                  <option value="selected" className="bg-[#111827]">
                    {lang === 'ar' ? 'أشخاص محددون' : 'Selected People'}
                  </option>
                </select>
              </div>

              {/* Publish Button */}
              <button
                onClick={handlePublish}
                className="flex-1 max-w-[160px] bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-slate-950 font-black py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>{lang === 'ar' ? 'نشر القصة' : 'Publish Story'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MUSIC PICKER MODAL */}
      {showMusicPicker && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#111827] border border-white/10 rounded-3xl p-5 text-white flex flex-col gap-4 max-h-[70vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold">{lang === 'ar' ? 'اختر مقطعاً موسيقياً' : 'Select Music Track'}</h3>
              </div>
              <button onClick={() => setShowMusicPicker(false)} className="p-1 rounded-full hover:bg-white/10 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {AUDIO_ITEMS.map((track) => (
                <div
                  key={track.id}
                  onClick={() => {
                    setSelectedTrack(track);
                    setShowMusicPicker(false);
                    playSynthSound(800, 'sine', 0.08);
                  }}
                  className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    selectedTrack?.id === track.id
                      ? 'bg-cyan-500/20 border-cyan-400'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <span className="text-xs font-bold block">{track.titleAr || track.title}</span>
                      <span className="text-[10px] text-slate-400 block">{track.artistAr || track.artist}</span>
                    </div>
                  </div>
                  {selectedTrack?.id === track.id && (
                    <Check className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
