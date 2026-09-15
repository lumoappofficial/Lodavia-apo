import React, { useState } from 'react';
import { Youtube, Instagram, Twitter, Link2, Lock, Plus, X, ShoppingBag, Trash2 } from 'lucide-react';
import { firestoreService } from '../firebase/services';
import { themeStyles } from '../styles/theme';
import { sanitizeExternalUrl } from '../utils/urlSecurity';

interface SocialLink {
  platform: 'youtube' | 'instagram' | 'twitter' | 'other';
  label: string;
  url: string;
}

const PLATFORM_ICONS: Record<string, any> = {
  youtube: Youtube,
  instagram: Instagram,
  twitter: Twitter,
  other: Link2,
};

const PLATFORM_LABELS: { id: SocialLink['platform']; ar: string; en: string }[] = [
  { id: 'youtube', ar: 'يوتيوب', en: 'YouTube' },
  { id: 'instagram', ar: 'إنستغرام', en: 'Instagram' },
  { id: 'twitter', ar: 'إكس (تويتر)', en: 'X (Twitter)' },
  { id: 'other', ar: 'رابط آخر', en: 'Other Link' },
];

export default function SocialLinksCard({ currentUser, setCurrentUser, lang, playSynthSound, navigate }: any) {
  const isUnlocked = (currentUser.purchasedItems || []).includes('feature_social_links');
  const links: SocialLink[] = currentUser.socialLinks || [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlatform, setNewPlatform] = useState<SocialLink['platform']>('youtube');
  const [newUrl, setNewUrl] = useState('');

  const persistLinks = (updated: SocialLink[]) => {
    setCurrentUser((prev: any) => ({ ...prev, socialLinks: updated }));
    firestoreService.updateProfile?.(currentUser.id, { socialLinks: updated });
  };

  const handleAddLink = () => {
    if (!newUrl.trim()) return;
    const platformLabel = PLATFORM_LABELS.find((p) => p.id === newPlatform);
    const newLink: SocialLink = {
      platform: newPlatform,
      label: lang === 'ar' ? platformLabel?.ar || '' : platformLabel?.en || '',
      url: newUrl.trim(),
    };
    persistLinks([...links, newLink]);
    setNewUrl('');
    setShowAddForm(false);
    playSynthSound(880, 'sine', 0.1);
  };

  const handleRemoveLink = (index: number) => {
    playSynthSound(300, 'sawtooth', 0.1);
    persistLinks(links.filter((_, i) => i !== index));
  };

  if (!isUnlocked) {
    return (
      <div className={`p-5 ${themeStyles.glassCard}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#121826] text-[#6E7685] dark:text-[#94A3B8] border border-[#E6EAF0] dark:border-[#2A3447]">
              <Lock className="w-6 h-6 text-[#6E7685] dark:text-[#94A3B8]" />
            </div>
            <div>
              <h3 className="text-xs font-black text-[#1A1F2C] dark:text-[#F8FAFC] uppercase tracking-wider">
                {lang === 'ar' ? 'ربط حسابات التواصل الاجتماعي 🔗' : 'Social Media Links 🔗'}
              </h3>
              <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1 max-w-sm">
                {lang === 'ar'
                  ? 'أضف روابط يوتيوب وإنستغرام وغيرها بشكل بارز على ملفك — ميزة مدفوعة من المتجر.'
                  : 'Showcase your YouTube, Instagram, and more prominently on your profile — a premium store feature.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => { playSynthSound(600, 'sine', 0.1); navigate('/store'); }}
            className={`px-5 py-3 flex items-center justify-center gap-1.5 shrink-0 ${themeStyles.buttonPrimaryWarm}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'افتحها من المتجر' : 'Unlock in Store'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 ${themeStyles.glassCard}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black text-[#1A1F2C] dark:text-[#F8FAFC] uppercase tracking-wider flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[#48B8FF]" />
          {lang === 'ar' ? 'حسابات التواصل الاجتماعي' : 'Social Media Links'}
        </h3>
        <button
          onClick={() => { playSynthSound(500, 'sine', 0.06); setShowAddForm(!showAddForm); }}
          className="p-1.5 rounded-full bg-[#48B8FF]/10 border border-[#48B8FF]/25 text-[#48B8FF] hover:bg-[#48B8FF]/20 transition-all cursor-pointer"
        >
          {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447] flex flex-col gap-2.5">
          <div className="flex gap-1.5 flex-wrap">
            {PLATFORM_LABELS.map((p) => (
              <button
                key={p.id}
                onClick={() => setNewPlatform(p.id)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                  newPlatform === p.id ? 'bg-[#48B8FF] text-white' : 'bg-white dark:bg-[#182232] text-[#6E7685] dark:text-[#94A3B8] border border-[#E6EAF0] dark:border-[#2A3447]'
                }`}
              >
                {lang === 'ar' ? p.ar : p.en}
              </button>
            ))}
          </div>
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder={lang === 'ar' ? 'https://...' : 'https://...'}
            className={`w-full py-2 px-3 text-xs ${themeStyles.glassInput}`}
          />
          <button
            onClick={handleAddLink}
            className={`w-full py-2 text-xs ${themeStyles.buttonPrimary}`}
          >
            {lang === 'ar' ? 'إضافة الرابط' : 'Add Link'}
          </button>
        </div>
      )}

      {links.length === 0 ? (
        <p className="text-xs text-[#9DA5B4] dark:text-[#64748B] text-center py-4">
          {lang === 'ar' ? 'ما فيه روابط مضافة بعد. اضغط + لإضافة أول رابط.' : 'No links added yet. Tap + to add your first one.'}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {links.map((link, i) => {
            const Icon = PLATFORM_ICONS[link.platform] || Link2;
            return (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447]">
                <div className="p-2 rounded-lg bg-[#48B8FF]/10 text-[#48B8FF] shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <a href={sanitizeExternalUrl(link.url)} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0 text-xs text-[#1A1F2C] dark:text-[#F8FAFC] font-medium truncate hover:text-[#48B8FF] transition-colors">
                  {link.label}: {link.url}
                </a>
                <button onClick={() => handleRemoveLink(i)} className="p-1.5 rounded-full text-[#9DA5B4] dark:text-[#64748B] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all shrink-0 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
