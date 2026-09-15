import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  Brain, 
  Check, 
  Cpu, 
  Sparkles, 
  MessageSquare, 
  Sliders, 
  Mic
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

export default function AIPreferencesPage() {
  const { lang, playSynthSound } = useApp();
  const isRtl = lang === 'ar';

  // State initialization with localStorage persistence
  const [enableSuggestions, setEnableSuggestions] = useState(() => {
    return localStorage.getItem('ai_enable_suggestions') !== 'false';
  });
  const [autoPersonalize, setAutoPersonalize] = useState(() => {
    return localStorage.getItem('ai_auto_personalize') !== 'false';
  });
  const [voiceCloning, setVoiceCloning] = useState(() => {
    return localStorage.getItem('ai_voice_cloning') === 'true';
  });
  const [assistantStyle, setAssistantStyle] = useState(() => {
    return localStorage.getItem('ai_assistant_style') || 'friendly';
  });

  // Save states to localStorage on change
  useEffect(() => {
    localStorage.setItem('ai_enable_suggestions', String(enableSuggestions));
  }, [enableSuggestions]);

  useEffect(() => {
    localStorage.setItem('ai_auto_personalize', String(autoPersonalize));
  }, [autoPersonalize]);

  useEffect(() => {
    localStorage.setItem('ai_voice_cloning', String(voiceCloning));
  }, [voiceCloning]);

  useEffect(() => {
    localStorage.setItem('ai_assistant_style', assistantStyle);
  }, [assistantStyle]);

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean, label: string) => {
    playSynthSound(600, 'sine', 0.05);
    setter(!current);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    playSynthSound(500, 'sine', 0.05);
    setAssistantStyle(e.target.value);
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out] text-start">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'تفضيلات الذكاء الاصطناعي الفلكي 🧠' : 'AI & Neural Preferences 🧠'}
        description={isRtl ? 'خصّص سلوك المساعد الافتراضي وخوارزميات الذكاء التوليدي' : 'Customize virtual companion behaviors and generative models'}
        icon={Brain}
        iconColorClass="text-purple-600 dark:text-purple-400"
        iconBgClass="bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/20"
      />

      <div className="relative z-10 flex flex-col gap-6">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Preferences Panel */}
        <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 border border-[#E2E8F0] dark:border-white/5 backdrop-blur-md flex flex-col gap-5 shadow-sm">
          
          {/* Switch 1: AI suggestions */}
          <div className="flex items-center justify-between p-1">
            <div className="flex gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 h-10 w-10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111827] dark:text-white block">
                  {isRtl ? 'تفعيل اقتراحات الذكاء الاصطناعي بالمحادثات' : 'Enable AI Suggestions in Chats'}
                </span>
                <span className="text-[10px] text-[#64748B] dark:text-slate-500 block mt-0.5 leading-normal max-w-sm">
                  {isRtl ? 'توليد اقتراحات ردود سريعة وذكية بناءً على محتوى رسائل غرف لودافيا' : 'Generate contextual quick responses based on current space transcripts'}
                </span>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={enableSuggestions}
                onChange={() => handleToggle(setEnableSuggestions, enableSuggestions, 'suggestions')}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500" />
            </label>
          </div>

          <div className="h-px bg-[#E2E8F0] dark:bg-white/5" />

          {/* Switch 2: Personalize Content */}
          <div className="flex items-center justify-between p-1">
            <div className="flex gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 h-10 w-10 flex items-center justify-center shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111827] dark:text-white block">
                  {isRtl ? 'تخصيص المحتوى تلقائياً حسب اهتماماتي' : 'Auto-Customize Feed based on Interests'}
                </span>
                <span className="text-[10px] text-[#64748B] dark:text-slate-500 block mt-0.5 leading-normal max-w-sm">
                  {isRtl ? 'إعادة ترتيب البثوث المباشرة وغرف الصوت لتتناسب تماماً مع نمط تصفحك' : 'Rearrange live voice streams and global grids matching your navigation style'}
                </span>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={autoPersonalize}
                onChange={() => handleToggle(setAutoPersonalize, autoPersonalize, 'personalize')}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500" />
            </label>
          </div>

          <div className="h-px bg-[#E2E8F0] dark:bg-white/5" />

          {/* Switch 3: Voice Cloning Improvement */}
          <div className="flex items-center justify-between p-1">
            <div className="flex gap-3">
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 h-10 w-10 flex items-center justify-center shrink-0">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111827] dark:text-white block">
                  {isRtl ? 'استخدام صوتي لتحسين الرد الصوتي بالذكاء الاصطناعي' : 'Use My Voice to Improve AI Voice Output'}
                </span>
                <span className="text-[10px] text-[#64748B] dark:text-slate-500 block mt-0.5 leading-normal max-w-sm">
                  {isRtl ? 'استخدم ميزات الاستنساخ الصوتي المحمي بتشفير كمومي لمطابقة نبرة قراءتك' : 'Leverage quantum-secured local voice modeling to personalize Lina vocal reads'}
                </span>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={voiceCloning}
                onChange={() => handleToggle(setVoiceCloning, voiceCloning, 'voice')}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500" />
            </label>
          </div>

          <div className="h-px bg-[#E2E8F0] dark:bg-white/5" />

          {/* Dropdown: Assistant Response Style */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-1 gap-4">
            <div className="flex gap-3">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-cyan-400 h-10 w-10 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111827] dark:text-white block">
                  {isRtl ? 'أسلوب رد المساعد الذكي' : 'Smart Assistant Style'}
                </span>
                <span className="text-[10px] text-[#64748B] dark:text-slate-500 block mt-0.5 leading-normal max-w-sm">
                  {isRtl ? 'حدد نبرة الخطاب المفضلة عند تفاعل المساعد الصوتي أو النصي معك' : 'Determine vocal tone or text formatting for active generative agents'}
                </span>
              </div>
            </div>

            <select
              value={assistantStyle}
              onChange={handleStyleChange}
              className="bg-slate-100 dark:bg-slate-950/80 border border-[#E2E8F0] dark:border-white/10 rounded-xl px-4 py-2 text-xs text-[#111827] dark:text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer min-w-[150px]"
            >
              <option value="formal">{isRtl ? 'رسمي 👔' : 'Formal 👔'}</option>
              <option value="friendly">{isRtl ? 'ودود 😊' : 'Friendly 😊'}</option>
              <option value="concise">{isRtl ? 'مختصر ⚡' : 'Concise ⚡'}</option>
            </select>
          </div>

        </div>

        {/* AI Tech Details */}
        <div className="rounded-2xl p-4.5 border border-purple-200 dark:border-purple-500/10 bg-purple-50 dark:bg-purple-950/[0.02] flex items-start gap-3 shadow-sm">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0 animate-pulse" />
          <p className="text-[11px] text-[#475569] dark:text-slate-400 leading-relaxed">
            {isRtl 
              ? 'تتم معالجة وتدريب كافة النماذج الذكية والشبكات العصبية محلياً بالكامل أو عبر خوادم لودافيا المشفرة كمومياً لحماية خصوصية بياناتك.' 
              : 'All deep learning parameters and weights are maintained strictly on-device or routed through quantum-encrypted nodes for full user safety.'}
          </p>
        </div>

      </div>

    </div>
  );
}
