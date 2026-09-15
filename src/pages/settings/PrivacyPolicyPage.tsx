import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  ShieldCheck, 
  Database, 
  Bot, 
  MapPin, 
  CreditCard, 
  UserCheck, 
  Lock, 
  RefreshCw, 
  Mail, 
  Download, 
  FileText,
  Check,
  Sparkles,
  Layers,
  AlertCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

export default function PrivacyPolicyPage() {
  const { lang, setLang, playSynthSound } = useApp();
  const isRtl = lang === 'ar';

  const [activeSection, setActiveSection] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);

  const policyDate = isRtl ? '8 سبتمبر 2026 (الإصدار 2.4 المعتمد)' : 'September 8, 2026 (Version 2.4 Certified)';

  const handleCopyPolicy = () => {
    playSynthSound(600, 'sine', 0.08);
    const plainText = document.getElementById('privacy-policy-body')?.innerText || '';
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const sections = [
    { id: 'all', titleAr: 'كامل الوثيقة', titleEn: 'Full Document', icon: FileText },
    { id: 'collection', titleAr: 'البيانات المجمعة', titleEn: 'Collected Data', icon: Database },
    { id: 'thirdparty', titleAr: 'الأطراف الثالثة والذكاء الاصطناعي', titleEn: 'Third Parties & AI', icon: Bot },
    { id: 'location', titleAr: 'الموقع الجغرافي', titleEn: 'Location & GPS', icon: MapPin },
    { id: 'financial', titleAr: 'المحفظة والمدفوعات', titleEn: 'Wallet & Payouts', icon: CreditCard },
    { id: 'rights', titleAr: 'حقوقك وحذف الحساب', titleEn: 'User Rights & Deletion', icon: UserCheck },
    { id: 'security', titleAr: 'الأمان والتشفير', titleEn: 'Security & Rules', icon: Lock }
  ];

  return (
    <div className="max-w-3xl mx-auto w-full pb-24 px-3 sm:px-4 animate-[fadeIn_0.4s_ease-out]">
      
      {/* Header with back to /settings/privacy */}
      <SettingsSubpageHeader
        title={isRtl ? 'وثيقة سياسة الخصوصية 📜' : 'Privacy Policy Charter 📜'}
        description={isRtl ? 'البيان الرسمي الدقيق لإدارة وحماية بياناتك في منصة Lodavia' : 'Official transparent disclosure of data handling and protection across Lodavia'}
        icon={ShieldCheck}
        iconColorClass="text-emerald-600 dark:text-emerald-400"
        iconBgClass="bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20"
        backTo="/settings/privacy"
      />

      {/* Meta & Controls Bar */}
      <div className="bg-white dark:bg-[#182232] rounded-2xl p-4 border border-[#E2E8F0] dark:border-white/10 flex flex-wrap items-center justify-between gap-3 mb-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{isRtl ? 'آخر تحديث تدقيقي:' : 'Last Audited:'}</span>
          <strong className="text-slate-800 dark:text-slate-200">{policyDate}</strong>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              setLang(lang === 'ar' ? 'en' : 'ar');
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
            title={isRtl ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
          >
            <span>{lang === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
          </button>

          {/* Copy Policy Text */}
          <button
            onClick={handleCopyPolicy}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{copied ? (isRtl ? 'تم النسخ للحافظة ✓' : 'Copied to Clipboard ✓') : (isRtl ? 'نسخ نص السياسة' : 'Copy Policy')}</span>
          </button>
        </div>
      </div>

      {/* Section Quick Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {sections.map(s => {
          const Icon = s.icon;
          const isSelected = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                playSynthSound(650, 'sine', 0.04);
                setActiveSection(s.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                isSelected 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                  : 'bg-white dark:bg-[#182232] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{isRtl ? s.titleAr : s.titleEn}</span>
            </button>
          );
        })}
      </div>

      {/* Main Document Body */}
      <div id="privacy-policy-body" className="flex flex-col gap-6 text-start text-slate-700 dark:text-slate-300 leading-relaxed">

        {/* Introductory Preamble */}
        <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] dark:border-white/10 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 end-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
            <ShieldCheck className="w-5 h-5" />
            <span>{isRtl ? 'مقدمة وميثاق النزاهة' : 'Introduction & Privacy Charter'}</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
            {isRtl 
              ? 'مرحباً بك في وثيقة الخصوصية الشفافة لمنصة Lodavia' 
              : 'Welcome to Lodavia’s Transparent Privacy Charter'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isRtl ? (
              <>
                تلتزم منصة <strong>Lodavia</strong> باحترام وحماية خصوصية أعضائها الكرام. 
                تمت صياغة هذه السياسة بناءً على <strong>الفحص الفعلي للبيانات والوظائف البرمجية المطبقة في النظام</strong> دون افتراضات غير واقعية. 
                تهدف هذه الوثيقة إلى توضيح كافة أبعاد جمع البيانات الشخصية، وكيفية تخزينها واستخدامها، وحقوقك الكاملة في إدارتها وحذفها.
              </>
            ) : (
              <>
                <strong>Lodavia</strong> is firmly committed to safeguarding your privacy. 
                This policy has been drafted strictly in accordance with <strong>the actual software features and database schema deployed in our platform</strong>. 
                It details what personal information we collect, how it is stored and processed, and your absolute rights to review and delete your data.
              </>
            )}
          </p>
        </div>

        {/* SECTION 1: Information We Collect */}
        {(activeSection === 'all' || activeSection === 'collection') && (
          <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] dark:border-white/10 shadow-xs flex flex-col gap-5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-white/5 pb-3">
              <Database className="w-4 h-4" />
              <span>{isRtl ? '1. المعلومات التي نجمعها فعلياً' : '1. Information We Actually Collect'}</span>
            </div>

            <div className="flex flex-col gap-4 text-xs sm:text-sm">
              
              {/* 1.1 Authentication Data */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {isRtl ? 'أ. بيانات الحساب والتوثيق (Firebase Authentication)' : 'A. Authentication & Account Credentials (Firebase Auth)'}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isRtl ? (
                    <>
                      عند إنشاء حسابك على Lodavia، نجمع البيانات الأساسية اللازمة للتعرف عليك وتأمين دخولك:
                    </>
                  ) : (
                    <>
                      When you register or sign in to Lodavia, we collect the necessary credentials to authenticate your identity securely:
                    </>
                  )}
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 ps-2">
                  <li>
                    <strong>{isRtl ? 'البريد الإلكتروني (Email):' : 'Email Address:'}</strong> {isRtl ? 'يُستخدم كمعرّف اتصال رئيسي ومصادقة وكلمة المرور المشفرة.' : 'Used as primary identity handler and password credentialing.'}
                  </li>
                  <li>
                    <strong>{isRtl ? 'الاسم المعروض (Display Name):' : 'Display Name:'}</strong> {isRtl ? 'اسم المستخدم المختار ليظهر على منشوراتك وملفك الشخصي.' : 'Your chosen name displayed on your profile and contributions.'}
                  </li>
                  <li>
                    <strong>{isRtl ? 'رقم الهاتف (Phone Number):' : 'Phone Number:'}</strong> {isRtl ? 'يُجمع كحقل اختياري للملف الشخصي أو عند استخدام تسجيل الدخول بالرسائل النصية.' : 'Optional contact field collected during registration or phone-based auth.'}
                  </li>
                  <li>
                    <strong>{isRtl ? 'التوثيق عبر أطراف ثالثة (Google & Apple):' : 'Third-Party Social Auth (Google & Apple):'}</strong> {isRtl ? 'عند الدخول عبر Google أو Apple، نتلقى المعرف الرقمي الأساسي، الاسم المسجل، البريد الإلكتروني، والصورة الرمزية من المزود دون الوصول إلى كلمات مرورك أو بياناتك الخاصة الأخرى لديهم.' : 'When authenticating via Google or Apple sign-in, we receive your standard public name, verified email, avatar URL, and user ID without accessing your provider account passwords.'}
                  </li>
                  <li>
                    <strong>{isRtl ? 'وضع التصفح كمجهول (Guest / Anonymous Mode):' : 'Anonymous / Guest Browsing:'}</strong> {isRtl ? 'تتيح المنصة وضع التخفي الرقمي الكوني للزوار دون إلزامهم بتقديم أي بيانات شخصية مباشرة.' : 'Lodavia supports an anonymous exploration mode allowing full browsing without submitting personal credentials.'}
                  </li>
                </ul>
              </div>

              {/* 1.2 Firestore Content Storage */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  {isRtl ? 'ب. المحتوى والبيانات المخزنة في قاعدة بيانات Firestore' : 'B. Content & Activity Stored in Firestore'}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isRtl ? (
                    <>
                      يتم تخزين المحتوى الذي تقوم بإنشائه ونشره طواعية داخل مجموعات سحابية مخصصة ومؤمنة بقواعد صارمة:
                    </>
                  ) : (
                    <>
                      User-generated content and interactive activity are stored securely in dedicated Firestore collections:
                    </>
                  )}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5">
                    <strong className="text-xs font-bold text-slate-900 dark:text-white block mb-0.5">
                      {isRtl ? '📝 المنشورات والمشاركات (posts)' : '📝 Posts & Interactions'}
                    </strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isRtl ? 'نصوص المقالات، الصور، التعليقات، وتفاعلات الإعجاب والمشاركات.' : 'Post content, attached images, comments, likes, and share metrics.'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5">
                    <strong className="text-xs font-bold text-slate-900 dark:text-white block mb-0.5">
                      {isRtl ? '💬 الرسائل والمحادثات (chats)' : '💬 Private & Group Messages'}
                    </strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isRtl ? 'المحادثات المباشرة بين المستخدمين، محصورة ومحمية بقواعد وصول لا تسمح بقراءتها إلا لأطراف المحادثة.' : 'Direct messages between users, locked by strict participant-only access rules.'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5">
                    <strong className="text-xs font-bold text-slate-900 dark:text-white block mb-0.5">
                      {isRtl ? '🪐 المجتمعات وغرف المحادثة (communities)' : '🪐 Communities & Orbit Hubs'}
                    </strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isRtl ? 'بيانات المجتمعات المنشأة، قائمة المشرفين والأعضاء، ورسائل المحادثة الجماعية.' : 'Community metadata, administrator rosters, member rosters, and channel chat logs.'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5">
                    <strong className="text-xs font-bold text-slate-900 dark:text-white block mb-0.5">
                      {isRtl ? '🎙️ الغرف الصوتية (voice_rooms)' : '🎙️ Live Voice Salons'}
                    </strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isRtl ? 'عناوين الغرف، هوية المضيف، وعدد المستمعين والمتحدثين (مع التأكيد بعدم تسجيل أو تخزين الصوت الخام).' : 'Room title, host ID, and active participant metrics. Zero audio recording is stored.'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5">
                    <strong className="text-xs font-bold text-slate-900 dark:text-white block mb-0.5">
                      {isRtl ? '✨ رصيد النقاط والأوسمة (points & badges)' : '✨ Points & Achievements'}
                    </strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isRtl ? 'نقاط التفاعل، مكافآت الترحيب، وسجل العناصر المقتناة برصيد النقاط المعنوي.' : 'Activity points, welcome reward points, and items acquired via the points shop.'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5">
                    <strong className="text-xs font-bold text-slate-900 dark:text-white block mb-0.5">
                      {isRtl ? '🤖 سجل المساعد الذكي (ai_history)' : '🤖 AI Queries History'}
                    </strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isRtl ? 'استفساراتك الموجهة للمساعد الذكي وإجاباته، محفوظة في مجلدك الفرعي الخاص بك وحدك.' : 'Your queries and assistant answers, stored in your private subcollection.'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 2: Third Parties & AI */}
        {(activeSection === 'all' || activeSection === 'thirdparty') && (
          <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] dark:border-white/10 shadow-xs flex flex-col gap-5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-white/5 pb-3">
              <Bot className="w-4 h-4" />
              <span>{isRtl ? '2. مشاركة البيانات مع أطراف ثالثة ونماذج الذكاء الاصطناعي' : '2. Third-Party Integrations & AI Model Sharing'}</span>
            </div>

            <div className="flex flex-col gap-4 text-xs sm:text-sm">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {isRtl ? (
                  <>
                    لا تقوم Lodavia ببيع أو تأجير بياناتك لأي معلنين أو شركات تسويق خارجي. تنحصر مشاركة البيانات مع الأطراف الفنية الموثوقة الضرورية لعمل وظائف المنصة:
                  </>
                ) : (
                  <>
                    Lodavia does not sell or lease your personal information. Data transmission is strictly confined to reputable technical providers essential for platform operations:
                  </>
                )}
              </p>

              {/* Gemini API Disclosure */}
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/25 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-purple-950 dark:text-purple-300 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>{isRtl ? 'معالجة نصوص الذكاء الاصطناعي عبر Google Gemini API' : 'AI Processing via Google Gemini API'}</span>
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200/50 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 font-bold">
                    Third-Party Processor
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isRtl ? (
                    <>
                      عند استخدام ميزات الذكاء الاصطناعي في المنصة (مثل: المستشار الذكي، المساعد الصوتي، تصحيح وصياغة المنشورات، تحليل الصور، أو تحكيم المشاريع)، يتم إرسال نص رسالتك أو الصورة المرفقة عبر خادم Express الوسيط الخاص بنا إلى واجهة <strong>Google Gemini API</strong> التابعة لشركة Google LLC لمعالجة الطلب وتوليد الرد المطلوب. 
                      لا يتم استخدام هذه المحادثات لتدريب النماذج العامة ضد رغبة المستخدم وتخضع لمعايير الأمان المعتمدة لواجهات برمجة تطبيقات Google Cloud Enterprise.
                    </>
                  ) : (
                    <>
                      When interacting with Lodavia AI features (Cosmic Assistant, voice synthesizer chat, post enhancer, project jury evaluator, or image analyzer), your prompt and submitted media are transmitted securely via our Express backend proxy to <strong>Google Gemini API</strong> (Google LLC) to generate answers. This processing adheres to Google Cloud enterprise data privacy policies.
                    </>
                  )}
                </p>
              </div>

              {/* Firebase / Google Cloud */}
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-cyan-950/20 border border-sky-200 dark:border-cyan-500/25 flex flex-col gap-2">
                <h4 className="font-bold text-sky-950 dark:text-cyan-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                  <span>{isRtl ? 'البنية التحتية السحابية لـ Firebase (Google Cloud)' : 'Cloud Infrastructure by Firebase (Google Cloud)'}</span>
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isRtl ? (
                    <>
                      تُستضاف قواعد بياناتنا السحابية (Cloud Firestore)، ملفات الوسائط والصور (Firebase Storage)، وأنظمة التوثيق (Firebase Authentication) على البنية التحتية لمراكز بيانات Google Cloud، المؤمنة بأحدث معايير التشفير أثناء النقل والتخزين.
                    </>
                  ) : (
                    <>
                      Database hosting (Cloud Firestore), binary assets (Firebase Storage), and identity tokens (Firebase Auth) reside within Google Cloud Platform enterprise infrastructure, safeguarded by end-to-end encryption at rest and in transit.
                    </>
                  )}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 3: Geolocation Telemetry */}
        {(activeSection === 'all' || activeSection === 'location') && (
          <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] dark:border-white/10 shadow-xs flex flex-col gap-5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-white/5 pb-3">
              <MapPin className="w-4 h-4" />
              <span>{isRtl ? '3. سياسة الموقع الجغرافي (Geolocation)' : '3. Geolocation & Sensor Policy'}</span>
            </div>

            <div className="flex flex-col gap-3 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <strong className="text-slate-900 dark:text-white font-bold">
                    {isRtl ? 'استخدام الموقع محلي ومؤقت فقط لميزة القبة السماوية بالواقع المعزز (Lodavia Sky AR)' : 'Local, In-Memory Geolocation Exclusively for Lodavia Sky AR'}
                  </strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isRtl ? (
                      <>
                        يطلب التطبيق إذن الموقع الجغرافي (GPS) <strong>فقط وحصرياً</strong> عند فتح ميزة استكشاف الفضاء والقبة السماوية بالواقع المعزز (Lodavia Sky AR)، وذلك لغرض محاذاة زوايا النجوم والأبراج والكواكب بدقة هندسية وفق موقعك اللحظي على الأرض.
                      </>
                    ) : (
                      <>
                        The platform requests device Geolocation (GPS) clearance <strong>solely and exclusively</strong> when launching the Lodavia Sky Augmented Reality (AR) stellar dome viewer, in order to calibrate celestial coordinates against your current latitude and longitude.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400">
                <p>
                  <strong>{isRtl ? 'ضمانة الخصوصية التامة:' : 'Strict Privacy Guarantee:'}</strong>{' '}
                  {isRtl 
                    ? 'إحداثيات خط الطول والعرض لا تُرسل ولا تُخزن في أي قاعدة بيانات سحابية لـ Lodavia على الإطلاق. تُعالج الإحداثيات داخل ذاكرة متصفح جهازك المؤقتة (Client-Side In-Memory) وتتلاشى فور إغلاق شاشة الواقع المعزز. يمكنك رفض هذا الإذن واستخدام وضع المحاكاة الفلكية الافتراضية دون أي تأثر لبقية التطبيق.'
                    : 'Your geographic coordinates are never logged or stored on any Lodavia server or database. Data remains in-memory on your device and vanishes upon exiting AR mode. You may refuse location permissions and use default coordinate presets with zero interruption to the rest of the application.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: Financial Status & Payouts Disclaimer */}
        {(activeSection === 'all' || activeSection === 'financial') && (
          <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] dark:border-white/10 shadow-xs flex flex-col gap-5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-white/5 pb-3">
              <CreditCard className="w-4 h-4" />
              <span>{isRtl ? '4. الوضع المالي والمدفوعات (إخلاء مسؤولية دقيق)' : '4. Financial Status & Payouts (Zero Real Payments)'}</span>
            </div>

            <div className="flex flex-col gap-3 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/20 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-black border border-amber-500/30">
                    {isRtl ? 'قيد التطوير 🚧' : 'Under Development 🚧'}
                  </span>
                  <strong className="text-slate-900 dark:text-white font-bold">
                    {isRtl ? 'ميزة المحفظة النقدية للداعمين وسحب الأرباح' : 'Cash Creator Wallet & Payout Gateways'}
                  </strong>
                </div>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isRtl ? (
                    <>
                      نوضح بشفافية كاملة أن ميزة <strong>"المحفظة النقدية للداعمين" (Cash Creator Wallet) وعمليات سحب الأرباح</strong> داخل صفحة اقتصاد المبدعين <strong>معطلة حالياً وموسومة بـ "قريباً 🚧"</strong>. 
                      منصة Lodavia <strong>لا تقوم بمعالجة أي مدفوعات نقدية حقيقية ولا تجمع أي أرقام بطاقات ائتمان أو حسابات مصرفية حقيقية</strong> في هذه المرحلة التجريبية. الأرصدة المعروضة في المحفظة حالياً هي أرقام استعراضية تجريبية (Preview / Demonstration Balances) فقط ريثما يكتمل الربط الرسمي مع بوابات الدفع البنكية المعتمدة.
                    </>
                  ) : (
                    <>
                      We declare with absolute transparency that the <strong>Cash Creator Wallet and withdrawal payout mechanism</strong> inside the Creator Economy section is <strong>currently disabled and labeled "Coming Soon 🚧"</strong>. 
                      Lodavia <strong>does not process real financial payments nor collect credit card or bank account details</strong> at this stage. All cash figures displayed are purely illustrative preview figures until accredited banking payment gateway integrations are finalized.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: User Rights & Account Deletion */}
        {(activeSection === 'all' || activeSection === 'rights') && (
          <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] dark:border-white/10 shadow-xs flex flex-col gap-5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-white/5 pb-3">
              <UserCheck className="w-4 h-4" />
              <span>{isRtl ? '5. حقوق المستخدم والتحكم والآلية الفعلية لحذف الحساب' : '5. User Rights, Data Control & Actual Account Deletion'}</span>
            </div>

            <div className="flex flex-col gap-4 text-xs sm:text-sm">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {isRtl ? (
                  <>
                    يتمتع كل مستخدم على منصة Lodavia بحقوق كاملة ومضمونة في التحكم ببياناته الشخصية وفق أفضل الممارسات والمعايير الدولية:
                  </>
                ) : (
                  <>
                    Every member of Lodavia retains full, actionable authority over their personal data in accordance with modern digital privacy standards:
                  </>
                )}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Right 1: Access & Export */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{isRtl ? 'حق الوصول والتصدير' : 'Access & Export'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isRtl 
                      ? 'يمكنك مراجعة كافة بيانات ملفك الشخصي ومجتمعاتك، كما يوفر التطبيق ميزة تصدير سجلات المحادثات كملف نصي (.TXT) مباشرة.' 
                      : 'You can review all your account details, communities, and directly export your chat records as formatted .TXT files.'}
                  </p>
                </div>

                {/* Right 2: Rectification */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                    <span>{isRtl ? 'حق التصحيح والتعديل' : 'Data Rectification'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isRtl 
                      ? 'لك مطلق الحرية في تعديل اسمك، نبذتك الشخصية، صورتك الرمزية، اهتماماتك، وخيارات الخصوصية في أي وقت من شاشة الإعدادات.' 
                      : 'You may modify your display name, biography, avatar, interests, and visibility toggles at any time via Settings.'}
                  </p>
                </div>

                {/* Right 3: Deletion */}
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 flex flex-col gap-2">
                  <h4 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    <span>{isRtl ? 'حق الحذف النهائي (النسيان)' : 'Permanent Erasure'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isRtl 
                      ? 'تتضمن صفحة "مركز الحساب" زر "حذف الحساب نهائياً" الفعلي. عند تأكيد الحذف، يتم إزالة مستندك ونقاطك وسجلاتك بشكل قطعي.' 
                      : 'Our Account Center features a live "Delete Account Permanently" control, irrevocably purging your user record and points.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: Security & Cloud Rules */}
        {(activeSection === 'all' || activeSection === 'security') && (
          <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] dark:border-white/10 shadow-xs flex flex-col gap-5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-white/5 pb-3">
              <Lock className="w-4 h-4" />
              <span>{isRtl ? '6. أمان البيانات وقواعد الحماية الصارمة' : '6. Data Security & Cryptographic Access Rules'}</span>
            </div>

            <div className="flex flex-col gap-3 text-xs sm:text-sm">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {isRtl ? (
                  <>
                    تعتمد Lodavia نموذج أمان متعدد الطبقات يضمن عدم تمكن أي طرف غير مصرح له من الوصول إلى بياناتك:
                  </>
                ) : (
                  <>
                    Lodavia applies a rigorous multi-layered defense architecture protecting your footprint:
                  </>
                )}
              </p>

              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 ps-2">
                <li>
                  <strong>{isRtl ? 'قواعد أمان سحابية صارمة (Firestore Security Rules):' : 'Granular Cloud Rules (Firestore Rules):'}</strong>{' '}
                  {isRtl 
                    ? 'تفرض قواعد Firestore فحصاً أمنياً عند كل عملية قراءة أو كتابة. لا يمكن لمستخدم قراءة محادثات خاصة ليس طرفاً فيها، ولا يمكن لأي مستخدم تعديل منشورات أو بيانات مستخدم آخر، كما يُمنع تماماً التلاعب بنقاط الحساب من جانب المتصفح.' 
                    : 'Server-enforced Firestore rules evaluate every single query. Users cannot read private chats they do not belong to, cannot edit others\' posts, and are strictly prevented from manipulating point balances on the client side.'}
                </li>
                <li>
                  <strong>{isRtl ? 'عزل مفاتيح الواجهات البرمجية (Server-Side Proxy):' : 'Key Isolation via Backend Proxy:'}</strong>{' '}
                  {isRtl 
                    ? 'تُحفظ كافة مفاتيح الوصول الحساسة (مثل مفاتيح Gemini API) في خادم Express الخلفي ولا يتم كشفها أو تضمينها في شفرة المتصفح.' 
                    : 'All sensitive secrets (including Gemini API credentials) are strictly held in backend Express environments, never leaked to the browser.'}
                </li>
                <li>
                  <strong>{isRtl ? 'تشفير الاتصالات (TLS / HTTPS):' : 'Encrypted Transit (TLS / HTTPS):'}</strong>{' '}
                  {isRtl 
                    ? 'جميع حزم البيانات المتبادلة بين جهازك وخوادم Lodavia مشفرة بالكامل أثناء الانتقال عبر بروتوكولات التشفير القياسية.' 
                    : 'All telemetry and interaction packages in transit between your client and our services are encrypted under modern TLS.'}
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* SECTION 7: Changes & Contact */}
        <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] dark:border-white/10 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-white/5 pb-3">
            <Mail className="w-4 h-4" />
            <span>{isRtl ? '7. التعديلات على السياسة والتواصل' : '7. Policy Changes & Contact Details'}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isRtl ? (
              <>
                نحتفظ بالحق في تحديث هذه السياسة لتتواكب مع إطلاق الميزات الجديدة (مثل تفعيل بوابات الدفع الرسمية مستقبلاً). 
                عند إجراء أي تعديل جوهري، سنقوم بإشعارك عبر إشعار نظام رسمي داخل التطبيق.
              </>
            ) : (
              <>
                We reserve the right to revise this policy as new modules evolve (such as official payment gateway activations). 
                Material updates will be communicated via official in-app system notifications.
              </>
            )}
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                  {isRtl ? 'فريق أمان وخصوصية Lodavia' : 'Lodavia Privacy & Security Office'}
                </strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  privacy@lodavia.com • {isRtl ? 'أو عبر تذكرة دعم في المساعد الذكي' : 'or via in-app AI Assistant support'}
                </span>
              </div>
            </div>

            <a
              href="mailto:privacy@lodavia.com"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>{isRtl ? 'مراسلة المسؤول ✉️' : 'Contact DPO ✉️'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
