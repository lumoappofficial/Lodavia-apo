export type SubscriptionTier = 'free' | 'pro' | 'ultra';

export type SubscriptionStatus = 'active' | 'trialing' | 'canceled' | 'expired';

export interface UserSubscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startDate: string;
  currentPeriodEnd: string;
  dailyRequestsUsed: number;
  dailyLimit: number;
  lastResetDate: string; // Format: YYYY-MM-DD
  featureUsages?: Record<string, number>;
}

export type AIFeatureCategory = 
  | 'general'
  | 'projects_business'
  | 'marketplace'
  | 'creator'
  | 'productivity'
  | 'games'
  | 'universe'
  | 'advanced';

export interface AIFeatureDefinition {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: AIFeatureCategory;
  minTier: SubscriptionTier;
  iconName: string;
  badgeAr?: string;
  badgeEn?: string;
}

export interface PlanPricing {
  tier: SubscriptionTier;
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  taglineEn: string;
  monthlyPriceUSD: number;
  monthlyPriceSAR: number;
  dailyLimit: number;
  popular?: boolean;
  highlightColor: string;
  badgeAr?: string;
  badgeEn?: string;
  featuresAr: string[];
  featuresEn: string[];
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, PlanPricing> = {
  free: {
    tier: 'free',
    nameAr: 'Lodavia AI Free',
    nameEn: 'Lodavia AI Free',
    taglineAr: 'المساعد اليومي المجاني للاستكشاف البسيط والتواصل',
    taglineEn: 'Daily free AI companion for general questions and exploration',
    monthlyPriceUSD: 0,
    monthlyPriceSAR: 0,
    dailyLimit: 10,
    highlightColor: 'from-slate-600 to-slate-800',
    featuresAr: [
      'محادثات واستخدام يومي محدود (10 طلبات يومياً)',
      'إجابة عن الأسئلة العامة والمعلومات الفلكية',
      'تلخيص النصوص القصيرة والردود البسيطة',
      'مساعدة أساسية في كتابة المنشورات',
      'اقتراحات أولية للمجتمعات والأصدقاء',
      'إرشادات بسيطة للألعاب واستكشاف الكواكب'
    ],
    featuresEn: [
      'Limited daily usage (10 requests/day)',
      'General Q&A and basic info',
      'Short text summarization',
      'Basic post writing assistant',
      'Initial community & friends recommendations',
      'Basic gaming & universe guide'
    ]
  },
  pro: {
    tier: 'pro',
    nameAr: 'Lodavia AI Pro',
    nameEn: 'Lodavia AI Pro',
    taglineAr: 'المنظومة الاحترافية لبناء المشاريع والتسويق وتطوير المحتوى',
    taglineEn: 'Professional suite for project analysis, marketing & creators',
    monthlyPriceUSD: 9.99,
    monthlyPriceSAR: 39,
    dailyLimit: 150,
    popular: true,
    badgeAr: 'الأكثر شعبية 🔥',
    badgeEn: 'Most Popular 🔥',
    highlightColor: 'from-cyan-500 via-blue-600 to-purple-600',
    featuresAr: [
      'استخدام يومي موسّع (150 طلب يومياً)',
      'تحليل أفكار المشاريع والتقييم الأولي للفكرة',
      'إنشاء خطة عمل شاملة (Business Plan)',
      'كتابة وصف احترافي وتحسين إعلانات سوق الأفكار والمشاريع',
      'اقتراح تسعير مبدئي واستراتيجيات التسويق والنمو',
      'مساعدة البائع والمشتري في التفاوض وصياغة مسودة الاتفاقيات',
      'إدارة المواعيد، المهام، وتنظيم الجدول الشخصي والدراسي',
      'إنشاء خطط وأهداف شخصية ومهنية وأكاديمية ذكية',
      'مساعد صناع المحتوى (أفكار المنشورات والـ Reels والفيديوهات)',
      'مساعد ذكي متكامل للألعاب وتحديات Lodavia',
      'مساعد استكشاف كواكب ومجرات Lodavia Universe',
      'تلخيص المحادثات الطويلة والنقاشات المعقدة'
    ],
    featuresEn: [
      'Expanded usage (150 requests/day)',
      'Project ideas analysis & initial feasibility rating',
      'Complete Business Plan generation',
      'Professional project description & marketplace listing optimizer',
      'Suggested initial pricing & marketing/growth strategies',
      'Buyer & seller negotiation assistant with agreement drafting',
      'Task management, schedule organization & calendar assistant',
      'Personal, academic & career goals and milestones creation',
      'Creator Content Assistant (Posts, Reels & Video ideas)',
      'Smart Gaming Assistant & Lodavia challenges advisor',
      'Lodavia Universe & Planet Explorer guide',
      'Long conversation & complex chat summarizer'
    ]
  },
  ultra: {
    tier: 'ultra',
    nameAr: 'Lodavia AI Ultra',
    nameEn: 'Lodavia AI Ultra',
    taglineAr: 'المستوى الأقصى للمحترفين ورواد الأعمال مع ذكاء فائق وبدون قيود',
    taglineEn: 'The ultimate tier for power users, founders & top creators',
    monthlyPriceUSD: 24.99,
    monthlyPriceSAR: 99,
    dailyLimit: 1000,
    badgeAr: 'للمحترفين 👑',
    badgeEn: 'Ultimate Tier 👑',
    highlightColor: 'from-amber-400 via-orange-500 to-rose-600',
    featuresAr: [
      'حدود استخدام فائقة جداً (1000 طلب يومياً - شبه بلا حدود)',
      'تحليل عميق للمشاريع والدراسات الاستثمارية المتكاملة',
      'استراتيجيات تسويقية وإطلاق منتجات متقدمة جداً',
      'أدوات صناع المحتوى المتقدمة (توليد صور، صوتيات TTS، تحليل متعدد اللهجات)',
      'صياغة عقود اتفاق رسمية ومحاكات التفاوض التجاري المعقد',
      'المساعد الشخصي المركزي الموحد داخل جميع أجزاء التطبيق',
      'أولوية معالجة فورية وسريعة جداً بالشبكة الكونية العصبية',
      'شارات ورتب حصرية في مجتمعات وملف Lodavia',
      'وصول حصرى ومبكر لجميع ميزات AI المستقبليّة'
    ],
    featuresEn: [
      'Ultra high limit (1000 requests/day - virtually unlimited)',
      'In-depth investment feasibility & advanced project analytics',
      'Advanced go-to-market launch & growth strategies',
      'Advanced Creator Suite (AI Image, TTS Voice, Multi-dialect Reply All)',
      'Formal contract drafting & complex commercial negotiation simulation',
      'Unified Central Personal Assistant integrated across all app modules',
      'Instant priority processing via Lodavia Neural Cluster',
      'Exclusive Ultra badges & ranks across profile and communities',
      'Early VIP access to all future AI capabilities'
    ]
  }
};

export const AI_FEATURE_CATALOG: AIFeatureDefinition[] = [
  // Free / Basic Features
  {
    id: 'chat_basic',
    titleAr: 'محادثات ذكية عامة',
    titleEn: 'General Smart Chat',
    descriptionAr: 'الإجابة عن الاستفسارات العامة والمحادثات اليومية',
    descriptionEn: 'Answers general questions and daily conversations',
    category: 'general',
    minTier: 'free',
    iconName: 'MessageSquare'
  },
  {
    id: 'text_summarize',
    titleAr: 'تلخيص النصوص البسيطة',
    titleEn: 'Simple Text Summarization',
    descriptionAr: 'تلخيص المنشورات والنصوص القصيرة في نقاط سريعة',
    descriptionEn: 'Summarizes short texts and posts into quick bullet points',
    category: 'productivity',
    minTier: 'free',
    iconName: 'FileText'
  },
  {
    id: 'post_basic',
    titleAr: 'مساعد كتابة المنشورات البسيط',
    titleEn: 'Basic Post Writing Assistant',
    descriptionAr: 'كتابة منشورات اجتماعية بسيطة ومقترحات أولية',
    descriptionEn: 'Drafts simple social posts and basic ideas',
    category: 'creator',
    minTier: 'free',
    iconName: 'Sparkles'
  },
  {
    id: 'basic_game_assistant',
    titleAr: 'إرشادات الألعاب الأساسية',
    titleEn: 'Basic Game Guide',
    descriptionAr: 'نصائح وقواعد عامة لألعاب لودافيا',
    descriptionEn: 'General tips and rules for Lodavia games',
    category: 'games',
    minTier: 'free',
    iconName: 'Gamepad2'
  },

  // Pro Features (Projects, Marketplace, Creator, Goals, Schedule, Games, Universe)
  {
    id: 'project_ideas_analysis',
    titleAr: 'تحليل أفكار المشاريع',
    titleEn: 'Project Ideas Analysis',
    descriptionAr: 'دراسة جدوى سريعة وفحص نقاط القوة والتحديات لأفكار المشاريع',
    descriptionEn: 'Quick feasibility study, strengths & challenges evaluation',
    category: 'projects_business',
    minTier: 'pro',
    iconName: 'Lightbulb',
    badgeAr: 'Pro',
    badgeEn: 'Pro'
  },
  {
    id: 'project_evaluation',
    titleAr: 'التقييم الأولي للمشروع',
    titleEn: 'Initial Project Rating',
    descriptionAr: 'احصل على تقييم ذكي متعدد الزوايا لفكرة مشروعك عبر ⚖️ لجنة Lodavia AI',
    descriptionEn: 'Get a multi-angle smart evaluation for your project idea via ⚖️ Lodavia AI Jury',
    category: 'projects_business',
    minTier: 'pro',
    iconName: 'TrendingUp',
    badgeAr: 'Pro',
    badgeEn: 'Pro'
  },
  {
    id: 'business_plan',
    titleAr: 'إنشاء خطة عمل (Business Plan)',
    titleEn: 'Business Plan Builder',
    descriptionAr: 'توليد خطة عمل متكاملة تحتوي الهيكل التشغيلي، الشريحة، والميزانية',
    descriptionEn: 'Generates operational structure, target audience & budget plan',
    category: 'projects_business',
    minTier: 'pro',
    iconName: 'Briefcase',
    badgeAr: 'Pro',
    badgeEn: 'Pro'
  },
  {
    id: 'project_description',
    titleAr: 'كتابة وصف احترافي للمشروع',
    titleEn: 'Professional Project Description',
    descriptionAr: 'صياغة العرض التقديمي والوصف الجذاب لجلب المستثمرين والمشترين',
    descriptionEn: 'Pitch-perfect descriptions tailored to attract investors & buyers',
    category: 'projects_business',
    minTier: 'pro',
    iconName: 'FileEdit',
    badgeAr: 'Pro',
    badgeEn: 'Pro'
  },
  {
    id: 'marketplace_optimize_listing',
    titleAr: 'تحسين إعلان سوق المشاريع',
    titleEn: 'Marketplace Listing Optimizer',
    descriptionAr: 'تحسين الكلمات المفتاحية والعناوين لزيادة المشاهدات والطلبات',
    descriptionEn: 'Optimizes keywords and titles for maximum marketplace views',
    category: 'marketplace',
    minTier: 'pro',
    iconName: 'ShoppingBag',
    badgeAr: 'Pro',
    badgeEn: 'Pro'
  },
  {
    id: 'suggest_pricing',
    titleAr: 'اقتراح سعر وتسعير مبدئي',
    titleEn: 'Suggested Initial Pricing',
    descriptionAr: 'تحليل المنافسين واقتراح النطاق السعري المناسب للخدمة أو المشروع',
    descriptionEn: 'Analyzes market standards and suggests ideal pricing brackets',
    category: 'marketplace',
    minTier: 'pro',
    iconName: 'DollarSign',
    badgeAr: 'Pro',
    badgeEn: 'Pro'
  },
  {
    id: 'marketing_strategy',
    titleAr: 'استراتيجيات التسويق والنمو',
    titleEn: 'Marketing & Growth Strategies',
    descriptionAr: 'خطط تسويق رقمي، حملات الوصول، وقنوات الاستحواذ على العملاء',
    descriptionEn: 'Digital marketing blueprints, reach campaigns & acquisition channels',
    category: 'projects_business',
    minTier: 'pro',
    iconName: 'Target',
    badgeAr: 'Pro',
    badgeEn: 'Pro'
  },
  {
    id: 'market_analysis',
    titleAr: 'تحليل السوق والمنافسين',
    titleEn: 'Market & Competitor Analysis',
    descriptionAr: 'رصد الاتجاهات الحالية والفرص المتاحة في القطاع المختار',
    descriptionEn: 'Monitors current trends and identifies market opportunities',
    category: 'projects_business',
    minTier: 'pro',
    iconName: 'BarChart2',
    badgeAr: 'Pro',
    badgeEn: 'Pro'
  },
  {
    id: 'negotiation_draft',
    titleAr: 'التفاوض وصياغة مسودة الاتفاق',
    titleEn: 'Negotiation & Agreement Drafting',
    descriptionAr: 'مساعدة البائع والمشتري في الوصول لاتفاق وصياغة مسودة بنود عادلة',
    descriptionEn: 'Helps buyer & seller negotiate terms and draft fair agreements',
    category: 'marketplace',
    minTier: 'pro',
    iconName: 'Handshake',
    badgeAr: 'Pro',
    badgeEn: 'Pro'
  },
  {
    id: 'tasks_schedules',
    titleAr: 'إدارة المواعيد والمهام الذكية',
    titleEn: 'Smart Tasks & Schedule Manager',
    descriptionAr: 'تحويل الأهداف إلى قائمة مهام مجدولة وتذكيرات ذكية',
    descriptionEn: 'Converts goals into actionable scheduled tasks & smart reminders',
    category: 'productivity',
    minTier: 'pro',
    iconName: 'Calendar',
    badgeAr: 'Pro',
    badgeEn: 'Pro'
  },
  {
    id: 'personal_goals',
    titleAr: 'الخطط والأهداف (شخصية / دراسية / مهنية)',
    titleEn: 'Personal, Academic & Career Goals',
    descriptionAr: 'رسم خارطة طريق زمنية لتحقيق الطموحات الأكاديمية والمهنية',
    descriptionEn: 'Maps out timeline blueprints for academic and career ambitions',
    category: 'productivity',
    minTier: 'pro',
    iconName: 'Award',
    badgeAr: 'Pro',
    badgeEn: 'Pro'
  },
  {
    id: 'creator_reels_video_ideas',
    titleAr: 'صانع أفكار Reels والـ Videos',
    titleEn: 'Reels & Video Creator Assistant',
    descriptionAr: 'توليد سيناريوهات، هوك جذاب، وأفكار مقاطع فيديو قصيرة',
    descriptionEn: 'Generates hook ideas, video scripts, and short-form content concepts',
    category: 'creator',
    minTier: 'pro',
    iconName: 'Video',
    badgeAr: 'Pro',
    badgeEn: 'Pro'
  },
  {
    id: 'smart_game_assistant',
    titleAr: 'المساعد الذكي للألعاب',
    titleEn: 'Smart Gaming Tactical Assistant',
    descriptionAr: 'تحليل أداء اللاعب، إعطاء تكتيكات الفوز، واقتراح الغرف المناسبة',
    descriptionEn: 'Analyzes player strategies, gives win tactics, and match tips',
    category: 'games',
    minTier: 'pro',
    iconName: 'Zap',
    badgeAr: 'Pro',
    badgeEn: 'Pro'
  },
  {
    id: 'universe_explorer',
    titleAr: 'مساعد استكشاف Lodavia Universe',
    titleEn: 'Lodavia Universe Explorer Guide',
    descriptionAr: 'تحليل علمي وفلكي تفاعلي للكواكب والمجرات والأجرام الكونية',
    descriptionEn: 'Astrophysical insights, planet lore, and galaxy exploration guide',
    category: 'universe',
    minTier: 'pro',
    iconName: 'Compass',
    badgeAr: 'Pro',
    badgeEn: 'Pro'
  },

  // Ultra Features
  {
    id: 'advanced_project_contract_builder',
    titleAr: 'منشئ العقود والصفقات المتقدم',
    titleEn: 'Advanced Contract & Deal Builder',
    descriptionAr: 'صياغة عقود تجارية ملزمة مع شروط الحماية والمراحل المالية',
    descriptionEn: 'Drafts commercial contracts with milestone protection clauses',
    category: 'advanced',
    minTier: 'ultra',
    iconName: 'ShieldCheck',
    badgeAr: 'Ultra 👑',
    badgeEn: 'Ultra 👑'
  },
  {
    id: 'central_ai_companion',
    titleAr: 'المساعد الشخصي المركزي الشامل',
    titleEn: 'Central Integrated AI Companion',
    descriptionAr: 'مساعد ذكي عابر لكل صفحات التطبيق يتذكر سياق المستخدم بالكامل',
    descriptionEn: 'Cross-app intelligent assistant remembering total user context',
    category: 'advanced',
    minTier: 'ultra',
    iconName: 'Bot',
    badgeAr: 'Ultra 👑',
    badgeEn: 'Ultra 👑'
  }
];
