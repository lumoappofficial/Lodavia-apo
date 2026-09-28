import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  AlertCircle, 
  Globe, 
  Type, 
  Film, 
  Tag, 
  Image as ImageIcon, 
  FileText, 
  Radio, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { MediaItem } from '../data/mediaData';

export interface UploadMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (item: MediaItem) => void;
}

export const UploadMediaModal: React.FC<UploadMediaModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const { lang, currentUser, playSynthSound, setCurrentUser, setMediaList } = useApp();

  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadTitleAr, setUploadTitleAr] = useState('');
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadType, setUploadType] = useState<'reel' | 'video' | 'live'>('reel');
  const [uploadThumbnail, setUploadThumbnail] = useState('');

  const resetForm = () => {
    setUploadTitle('');
    setUploadTitleAr('');
    setUploadCategory('');
    setUploadDescription('');
    setUploadType('reel');
    setUploadThumbnail('');
  };

  const handleClose = () => {
    onClose();
  };

  const handleCreateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    playSynthSound(880, 'sine', 0.2);

    const newItem: MediaItem = {
      id: `user-${uploadType}-${Date.now()}`,
      title: uploadTitle,
      titleAr: uploadTitleAr || uploadTitle,
      creatorId: currentUser?.id,
      creator: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        badge: 'Explorer Creator'
      },
      thumbnail:
        uploadThumbnail ||
        'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80',
      type: uploadType,
      views: 120,
      likes: 5,
      comments: [],
      category: uploadCategory || 'Education',
      categoryAr: uploadCategory || 'تعليمي',
      description: uploadDescription || 'User-uploaded educational media on the Lodavia network.',
      descriptionAr: uploadDescription || 'محتوى تعليمي مرفوع بواسطة رائد فضاء لودافيا.',
      duration: uploadType === 'video' ? '03:40' : undefined
    };

    setMediaList((prev) => [newItem, ...prev]);

    // Clear inputs
    resetForm();

    // Reward points for contribution
    setCurrentUser((prev: any) => ({
      ...prev,
      points: (prev.points || 0) + 20
    }));

    if (onCreated) {
      onCreated(newItem);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            className="relative bg-white dark:bg-slate-900/95 rounded-3xl p-5 sm:p-6 max-w-lg w-full border border-slate-200/90 dark:border-sky-500/20 shadow-2xl shadow-sky-950/30 overflow-hidden text-start max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cosmic Ambient Glow Accents */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/10 relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-500/25 shrink-0">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{lang === 'ar' ? 'إطلاق وبث وسائط فلكية جديدة' : 'Launch New Astrophysics Media'}</span>
                    <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0" />
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'ar' ? 'شارك محتواك الفلكي واكسب نقاط مساهمة كونيّة' : 'Share cosmic signals and earn explorer points'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-slate-400 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer shrink-0"
                title={lang === 'ar' ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateMedia} className="space-y-4 mt-4 overflow-y-auto pr-1 pl-0.5 custom-scrollbar flex-1 relative z-10">
              {/* Title Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* English Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                    <span>{lang === 'ar' ? 'العنوان بالإنجليزية' : 'English Title'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Kepler-186f Gravity Anomaly"
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/15 transition-all shadow-xs"
                  />
                </div>

                {/* Arabic Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                    <span>{lang === 'ar' ? 'العنوان بالعربية' : 'Arabic Title'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadTitleAr}
                    onChange={(e) => setUploadTitleAr(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: شذوذ الجاذبية في كبلر 186f' : 'Arabic translation / title'}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/15 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Type Selector & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Format / Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    <span>{lang === 'ar' ? 'الصيغة' : 'Format'}</span>
                  </label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/15 transition-all shadow-xs cursor-pointer"
                  >
                    <option value="reel" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'ريلز قصيرة (Vertical Reel)' : 'Vertical Reel'}
                    </option>
                    <option value="video" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'فيديو طويل (Curated Video)' : 'Curated Video'}
                    </option>
                    <option value="live" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'قناة بث مباشر (Live Stream)' : 'Live Stream'}
                    </option>
                  </select>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    <span>{lang === 'ar' ? 'التصنيف' : 'Category'}</span>
                  </label>
                  <input
                    type="text"
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: فيزياء فلكية، تلسكوبات' : 'e.g. Astrophysics, Deep Space'}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/15 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Thumbnail Image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span>{lang === 'ar' ? 'رابط صورة الغلاف' : 'Cover Image URL'}</span>
                </label>
                <input
                  type="url"
                  value={uploadThumbnail}
                  onChange={(e) => setUploadThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/15 transition-all shadow-xs"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                  <span>{lang === 'ar' ? 'الوصف' : 'Description / Summary'}</span>
                </label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder={lang === 'ar' ? 'اكتب ملخصاً علمياً تعليمياً عن هذا المقطع...' : 'Write a brief educational description...'}
                  rows={3}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl resize-none bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/15 transition-all shadow-xs"
                />
              </div>

              {/* Redesigned Structured Warning / Scientific Standards Box */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-purple-500/10 dark:from-amber-500/10 dark:via-sky-950/40 dark:to-purple-950/30 border border-amber-500/25 dark:border-amber-400/20 flex items-start gap-3 shadow-xs">
                <div className="w-7 h-7 rounded-xl bg-amber-500/15 dark:bg-amber-400/15 border border-amber-500/30 dark:border-amber-400/30 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400 mt-0.5">
                  <AlertCircle className="w-4 h-4 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-black text-amber-700 dark:text-amber-300 block mb-0.5">
                    {lang === 'ar' ? 'معايير البحث العلمي ومكافأة المساهمة' : 'Scientific Standards & Reward'}
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                    {lang === 'ar'
                      ? 'بموجب قوانين لودافيا للبحث العلمي، يجب ألا يحتوي المقطع على معلومات مضللة فلكياً. ستحصل على 20 نقطة لمساهمتك العلمية فور النشر.'
                      : 'By submitting, you certify this content conforms to astrophysics educational standards. You will receive 20 Pts upon broadcast.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white font-black text-xs shadow-lg shadow-sky-500/25 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>{lang === 'ar' ? 'بث الآن 🚀' : 'Broadcast Now 🚀'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UploadMediaModal;
