import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  Download, 
  Check,
  Trash2,
  FileAudio,
  FileText,
  AlertTriangle,
  Info
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

interface DownloadItem {
  id: string;
  type: 'audio' | 'document' | 'image';
  titleAr: string;
  titleEn: string;
  size: string;
  dateAr: string;
  dateEn: string;
}

export default function DownloadsPage() {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();

  const isRtl = lang === 'ar';

  const initialDownloads: DownloadItem[] = [
    {
      id: 'dl_1',
      type: 'audio',
      titleAr: 'تسجيل غرفة صوتية: آفاق المستقبل لبرمجة الويب (بث Lina)',
      titleEn: 'Audio Room Rec: Web Dev Horizons (Lina Session)',
      size: '24.5 MB',
      dateAr: 'أمس',
      dateEn: 'Yesterday'
    },
    {
      id: 'dl_2',
      type: 'document',
      titleAr: 'دليل المستكشف الكوني الرقمي - الإصدار الثاني',
      titleEn: 'Cosmic Pathfinder Digital Guide - V2.pdf',
      size: '4.8 MB',
      dateAr: 'منذ يومين',
      dateEn: '2 days ago'
    },
    {
      id: 'dl_3',
      type: 'audio',
      titleAr: 'نغمة تنبيه الملاحة الكوكبية المخصصة',
      titleEn: 'Custom Planetary Beacons Warning Tone.wav',
      size: '1.2 MB',
      dateAr: 'منذ ٣ أيام',
      dateEn: '3 days ago'
    }
  ];

  const [downloads, setDownloads] = useState<DownloadItem[]>(initialDownloads);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerSaveFeedback = (msgEn: string, msgAr: string, tone = 700) => {
    playSynthSound(tone, 'sine', 0.08);
    setToastMessage(isRtl ? msgAr : msgEn);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleClearAll = () => {
    playSynthSound(150, 'sawtooth', 0.25);
    setDownloads([]);
    triggerSaveFeedback(
      'Offline file system storage wiped clean',
      'تم تفريغ وحذف جميع الملفات والمقاطع المحملة بالكامل 🗑️',
      400
    );
  };

  const handleDeleteItem = (id: string) => {
    playSynthSound(500, 'sine', 0.08);
    setDownloads(prev => prev.filter(dl => dl.id !== id));
    triggerSaveFeedback(
      'File removed from offline memory',
      'تمت إزالة الملف المحدد من الذاكرة 🗑️',
      600
    );
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'التنزيلات والذاكرة غير المتصلة 📥' : 'Offline Downloads Vault 📥'}
        description={isRtl ? 'إدارة الغرف الصوتية المسجلة، الكتيبات، والملفات المخزنة بجهازك' : 'Review recorded audio tracks, guidelines, and assets stored locally'}
        icon={Download}
        iconColorClass="text-purple-600 dark:text-purple-400"
        iconBgClass="bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/20"
      />

      <div className="relative z-10 flex flex-col gap-6 text-start">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Feedback Alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.25s_ease-out]">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main List */}
        {downloads.length > 0 ? (
          <div className="flex flex-col gap-3">
            {downloads.map((dl) => {
              const IsAudio = dl.type === 'audio';
              return (
                <div 
                  key={dl.id}
                  className="bg-white dark:bg-[#182232] rounded-2xl p-4 border border-[#E2E8F0] dark:border-white/10 flex items-center justify-between gap-4 transition-all duration-300 hover:border-slate-300 dark:hover:border-white/15 shadow-sm"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${
                      IsAudio 
                        ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400' 
                        : 'bg-sky-50 dark:bg-cyan-500/10 border-sky-200 dark:border-cyan-500/20 text-sky-600 dark:text-cyan-400'
                    }`}>
                      {IsAudio ? <FileAudio className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0 text-start">
                      <h3 className="text-xs font-bold text-[#111827] dark:text-slate-100 truncate">
                        {isRtl ? dl.titleAr : dl.titleEn}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[#64748B] dark:text-slate-500 font-mono">
                        <span>{dl.size}</span>
                        <span>•</span>
                        <span>{isRtl ? dl.dateAr : dl.dateEn}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteItem(dl.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-[#E2E8F0] dark:border-white/5 hover:border-red-200 dark:hover:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 text-[#64748B] dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer"
                    title={isRtl ? 'حذف من الجهاز' : 'Delete file'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {/* Delete All Section */}
            <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-white/5 flex justify-end">
              <button
                onClick={handleClearAll}
                className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/30 text-xs font-bold text-red-600 dark:text-red-400 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isRtl ? 'حذف الكل' : 'Delete All Downloads'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#182232] rounded-2xl p-12 border border-[#E2E8F0] dark:border-white/5 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="p-3 rounded-full bg-slate-100 dark:bg-white/5 text-[#64748B] dark:text-slate-500 mb-4 border border-[#E2E8F0] dark:border-white/10">
              <Info className="w-6 h-6 text-[#64748B] dark:text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] dark:text-slate-300">
              {isRtl ? 'لا يوجد ملفات محملة' : 'No Downloaded Files'}
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-500 mt-1 max-w-sm leading-relaxed">
              {isRtl 
                ? 'لم تقم بتحميل أي مقاطع صوتية أو ملفات في الذاكرة المحلية لجهازك حتى الآن.' 
                : 'Offline storage index is clean. Download interesting vocal hubs to save bandwidth.'}
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
