import { GameCardInfo, Achievement, LeaderboardUser, DailyMascotChallenge, MiniPlayerProfile } from '../types/games';
import rayAvatarIcon from '../assets/images/ray_avatar_icon_1787258127988.jpg';

export const GAMES_LIST: GameCardInfo[] = [
  {
    id: 'starship_chaos',
    titleAr: 'فوضى المركبة الفضائية 🛸😂',
    titleEn: 'Starship Chaos 🛸😂',
    shortDescAr: 'لعبة فوضوية ومضحكة من 2 إلى 6 لاعبين لإدارة محطات المركبة الفضائية وإخماد الأحداث العشوائية للوصول بأمان!',
    shortDescEn: 'Hilarious co-op chaos for 2-6 players! Manage ship stations, repair breaches, and handle wild space accidents!',
    fullDescAr: 'ادخل المركبة الفضائية مع أصدقائك أو طاقم الذكاء الاصطناعي! يتولى كل لاعب محطة فرعية (القيادة 🚀، المحركات 🔥، الطاقة ⚡، الملاحة 🧭، الاتصالات 📡، الصيانة 🔧). واجهوا أحداثاً عشوائية مضحكة: انقطاع الجاذبية، هجوم الفضائي، نيازك طارئة، دوران المركبة، وإنذارات كاذبة! تعاونوا واحلوا الأعطال للوصول للهدف قبل انقضاء الوقت.',
    fullDescEn: 'Board the starship with your crew or AI companions! Every player manages a station (Steering 🚀, Thrusters 🔥, Power ⚡, Navigation 🧭, Comms 📡, Repairs 🔧). Survive wild random events: zero gravity, alien cabin intruders, meteor fields, spin-outs, and hull breaches! Cooperate fast to land safely before time runs out.',
    category: 'coop',
    isMostPlayed: true,
    featured: true,
    isNew: false,
    activePlayersCount: 2420,
    activityLevel: 'ultra',
    activityLevelAr: 'نشاط فائق 🔥',
    activityLevelEn: 'Very High 🔥',
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    accentColor: '#F43F5E',
    badgeAr: 'فوضى تعاونية • CO-OP CHAOS',
    badgeEn: 'CO-OP CHAOS',
    icon: 'Flame',
    gradientBg: 'from-rose-950/80 via-purple-950/60 to-amber-950/80',
    borderColor: 'border-rose-500/30 hover:border-rose-400/60',
    minPlayers: 2,
    maxPlayers: 6,
    avgDurationMinutes: 5,
    xpReward: 180,
    pointsReward: 70,
    rulesAr: [
      'اختر مستوى الصعوبة (سهل 🟢، متوسط 🟡، فوضى فائقة 🔴) وعدد أعضاء الطاقم (2-6 لاعبين).',
      'تتولى كل محطة مهام تفاعلية فورية (تعديل المسار، ضبط طاقة الدروع، ضغط العوادم، رقع الثقوب).',
      'تحدث أحداث عشوائية طارئة ومضحكة تحتاج تدخل المحطة المعنية بإنذارات بصرية ومؤثرات حية.',
      'احذر من انقطاع الجاذبية أو انزلاق مؤشرات التحكم أثناء الفوضى!',
      'حافظ على سلامة الهيكل للوصول بنجاح قبل نفاد وقت الرحلة.'
    ],
    rulesEn: [
      'Select difficulty mode (Easy 🟢, Normal 🟡, Overdrive Chaos 🔴) and crew count (2-6 players).',
      'Each station executes real-time interactive tasks (course alignment, power balancing, vent flushing, patch hull).',
      'Random chaotic events trigger dynamically, requiring immediate cross-crew action.',
      'Watch out for zero-gravity flips, cabin alien attacks, and slipping control gauges!',
      'Keep hull integrity above zero until the ship reaches the destination planet before timer ends.'
    ],
    featuresAr: [
      'محاكي تفاعلي حقيقي بـ 6 محطات مستقلة ذات أدوات تفاعلية',
      'أكثر من 7 أحداث عشوائية مضحكة ومؤثرات مرئية كارتونية حية',
      'طاقم ذكاء اصطناعي تفاعلي عند اللعب الفردي مع درجات فوضى متغيرة',
      'دعم إنشاء الغرف الخاصة ودعوة الأصدقاء'
    ],
    featuresEn: [
      'Interactive 6-station bridge simulator with functional interactive controls',
      '7+ wild random events with cartoonish visual effects and audio alerts',
      'Smart bot companions with dynamic chaotic banter for solo play',
      'Private lobby creation with custom invite codes'
    ]
  },
  {
    id: 'planet_rescue',
    titleAr: 'إنقاذ الكوكب 🌍🚀',
    titleEn: 'Planet Rescue 🌍🚀',
    shortDescAr: 'تعاون مع أصدقائك أو المساعدين الأذكياء وأنقذ الكوكب قبل فوات الأوان! لعبة تعاونية مليئة بالأحداث الفضائية والمهمات!',
    shortDescEn: 'Co-op space rescue operation! Cooperate with AI teammates or friends to save a rotating planet from cosmic events!',
    fullDescAr: 'الكوكب في خطر والوقت ينفد! قد فريقك في مهمة فضائية تعاونية ملحمية وممتعة. واجه عواصف النيازك، الثورات البركانية، الغزوات الفضائية والأحداث الكونية المضحكة. اختر دورك (الحارس، مهندس الطاقة، المستكشف، المصلح، القائد) وحل الألغاز والميني جيمز لإعادة التوازن للكوكب.',
    fullDescEn: 'The planet is in grave danger and time is ticking! Lead your crew in an epic, hilarious space rescue mission. Handle meteor storms, volcanic eruptions, alien incursions, and quirky space encounters. Choose your specialty role and solve fast-paced interactive mini-games to restore planetary harmony.',
    category: 'coop',
    isMostPlayed: true,
    featured: true,
    isNew: true,
    activePlayersCount: 1950,
    activityLevel: 'ultra',
    activityLevelAr: 'شائع ومحبوب ⚡',
    activityLevelEn: 'Trending ⚡',
    artwork: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
    accentColor: '#10B981',
    badgeAr: 'لعبة تعاونية • CO-OP',
    badgeEn: 'CO-OP',
    icon: 'Globe',
    gradientBg: 'from-emerald-950/80 via-teal-950/60 to-cyan-950/80',
    borderColor: 'border-emerald-500/30 hover:border-emerald-400/60',
    minPlayers: 1,
    maxPlayers: 4,
    avgDurationMinutes: 5,
    xpReward: 250,
    pointsReward: 100,
    rulesAr: [
      'اختر دورك القيادي (الحارس، مهندس الطاقة، المستكشف، المصلح، القائد) أو العب مع الذكاء الاصطناعي (Nova, Pixel, Orbit).',
      'حافظ على صحة الكوكب ❤️ وطاقته ⚡ ودرعه 🛡️ وبيئته 🌳 قبل انتهاء الوقت.',
      'تفاعل فوراً مع الأحداث العشوائية (عواصف النيازك، الغزو الفضائي، الثقوب السوداء).',
      'حل ألعاب الميني جيم السريعة (توصيل الدوائر 🔌، التصويب 🎯، ترتيب الرموز ⚡).',
      'تعاون مع فريقك وحقق أعلى نسبة إنقاذ للحصول على مكافآت مضاعفة.'
    ],
    rulesEn: [
      'Select your specialist role or play alongside AI bots (Nova, Pixel, Orbit).',
      'Maintain planet Health ❤️, Energy ⚡, Shield 🛡️, and Environment 🌳 before time runs out.',
      'Respond immediately to random cosmic emergencies (meteor storms, alien incursions, black holes).',
      'Solve quick mini-games (Circuit wiring 🔌, Asteroid blaster 🎯, Symbol alignment ⚡).',
      'Coordinate with your squad to reach 100% rescue rate and claim bonus rewards.'
    ],
    featuresAr: [
      'كوكب تفاعلي ثلاثي الأبعاد يدور مع تأثيرات الشفق والمحيطات المضيئة',
      'ذكاء اصطناعي مساعد مع شخصيات كوميدية (Nova, Pixel, Orbit) تقدم الدعم المباشر',
      'ألعاب ميني جيم تفاعلية (توصيل أسلاك، تصويب نيازك، مصفوفة الطاقة)',
      'أحداث مضحكة ورسائل فضائية عشوائية وتكامل كامل مع نظام لودافيا'
    ],
    featuresEn: [
      'Interactive 3D spinning planet model with atmospheric aura and city lights',
      'Smart AI squadmates (Nova, Pixel, Orbit) with unique humorous dialogue & auto-tasks',
      'Engaging quick-time mini-games (circuit wiring, asteroid blasting, energy matrix)',
      'Funny alien event popups and full integration with Lodavia XP & achievements'
    ]
  },
  {
    id: 'galaxy_rush',
    titleAr: 'سباق المجرات 🚀🏎️',
    titleEn: 'Galaxy Rush 🚀🏎️',
    shortDescAr: 'لعبة سباق فضائية سريعة ومثيرة! قد مركبتك المستقبلية عبر المجرات والسدم، اجمع البلورات وتجنب الكويكبات!',
    shortDescEn: 'Thrilling high-speed space racing! Pilot futuristic starships through galaxies and nebulae, dodging asteroids!',
    fullDescAr: 'انطلق في تجربة سباق مجريّة فائقة السرعة مع "سباق المجرات"! قد مركبتك الفضائية في أرجاء الكون المليء بالنجوم والكواكب والمجرات الساحرة. استخدم تقنية النيترو، اجمع بلورات الطاقة الكونية، فعّل درع الحماية، وتفادَ الكويكبات والحواجز للوصول إلى خط النهاية بأقصر وقت ممكن وتحقيق أرقام قياسية مذهلة.',
    fullDescEn: 'Embark on an ultra-fast cosmic racing experience with Galaxy Rush! Pilot your sleek starship through mesmerising starry skies, planets, and vibrant nebulae. Trigger nitro boosts, collect energy crystals, deploy protective shields, and dodge deadly asteroids to cross the finish line in record time.',
    category: 'challenge',
    isMostPlayed: true,
    featured: true,
    isNew: true,
    activePlayersCount: 1680,
    activityLevel: 'ultra',
    activityLevelAr: 'سرعة وتنافس 🏎️',
    activityLevelEn: 'High Speed 🏎️',
    artwork: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    accentColor: '#0EA5E9',
    badgeAr: 'سباق فضائي • RACING',
    badgeEn: 'RACING',
    icon: 'Rocket',
    gradientBg: 'from-cyan-950/80 via-purple-950/60 to-rose-950/80',
    borderColor: 'border-cyan-500/30 hover:border-cyan-400/60',
    minPlayers: 1,
    maxPlayers: 1,
    avgDurationMinutes: 3,
    xpReward: 200,
    pointsReward: 80,
    rulesAr: [
      'اختر مركبتك الكونية المفضلة والمجرة التي تريد التسابق فيها.',
      'تتحرك المركبة إلى الأمام تلقائياً؛ استخدم الأسهم أو اللمس للتحريك يميناً ويساراً.',
      'اجمع البلورات الكونية 💎 لتعبئة عداد النيترو 🔥 وزيادة النقاط.',
      'احصل على تعزيز السرعة ⚡ ودرع الطاقة 🛡️ لحماية مركبتك عند الاصطدام.',
      'تجنب الاصطدام بالكويكبات ☄️ واعبر بوابات الطاقة 🌀 حتى تصل خط النهاية.'
    ],
    rulesEn: [
      'Select your starship and cosmic galaxy circuit.',
      'Your starship moves forward automatically; use arrows, A/D, or touch to maneuver left and right.',
      'Collect Cosmic Crystals 💎 to build up Nitro 🔥 and score.',
      'Grab Speed Boosts ⚡ and Energy Shields 🛡️ for ultimate collision protection.',
      'Avoid asteroids ☄️ and speed through Cosmic Gates 🌀 to reach the finish line in record time.'
    ],
    featuresAr: [
      'محيط فضائي ديناميكي مع تأثيرات خطوط السرعة والانفجارات الضوئية',
      '4 مركبات فضائية بخصائص مختلفة (متوازنة، سريعة، رشيقة، أسطورية)',
      '4 مجرات ومسارات بتدرجات ألوان ومستويات صعوبة متنوعة',
      'نظام خريطة مصغرة (Mini Map) لوحة نتائج شاملة وتكامل مع حساب لودافيا'
    ],
    featuresEn: [
      'Dynamic space canvas graphics with warp speed trails and neon collision visual FX',
      '4 customizable starship classes (Balanced, Speedster, Agile, Legendary)',
      '4 cosmic galaxies with custom visual themes and escalating difficulty',
      'Interactive Mini Map progress bar, detailed post-race metrics & Lodavia sync'
    ]
  },
  {
    id: 'who_is_alien',
    titleAr: 'من هو الفضائي؟ 👽🔍',
    titleEn: 'Who is the Alien? 👽🔍',
    shortDescAr: 'لعبة اجتماعية ممتعة وخفيفة من 4 إلى 10 لاعبين لاكتشاف الفضائي المتخفي بين الركاب الكونيين!',
    shortDescEn: 'Fun social deduction party game! Spot the hidden alien pretending to be a regular space traveler.',
    fullDescAr: 'يتلقى جميع الركاب كلمة سرية كوكبية واحدة (مثل "شاورما" أو "قمر") بينما يتلقى الفضائي المتخفي كلمة غامضة أو لا يتلقى شيئاً! يقوم كل لاعب بتقديم تلميح ذكي، ثم تبدأ جولات الأسئلة والنقاش الكوميدي والتصويت لطرد المشتبه به.',
    fullDescEn: 'All space travelers receive a secret Earth/space topic word (e.g. "Pizza" or "Wormhole"), except the undercover Alien who gets a fake or blank hint! Everyone gives a clever one-word or witty hint, followed by round discussions and live voting to kick out the impostor.',
    category: 'social',
    isMostPlayed: true,
    featured: false,
    isNew: false,
    activePlayersCount: 1340,
    activityLevel: 'high',
    activityLevelAr: 'تفاعل جماعي 🎭',
    activityLevelEn: 'Social Party 🎭',
    artwork: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    accentColor: '#8B5CF6',
    badgeAr: 'اجتماعي • PARTY',
    badgeEn: 'PARTY',
    icon: 'Users',
    gradientBg: 'from-emerald-950/80 via-teal-950/60 to-cyan-950/80',
    borderColor: 'border-emerald-500/30 hover:border-emerald-400/60',
    minPlayers: 4,
    maxPlayers: 10,
    avgDurationMinutes: 4,
    xpReward: 140,
    pointsReward: 50,
    rulesAr: [
      'توزيع السِرّ الكوني: يحصل البشر على الكلمة السرية الحقيقية، بينما يُحرم الفضائي منها.',
      'جولة التلميحات: يكتب كل لاعب تلميحاً لا يفضح الكلمة تماماً حتى لا يستنتجها الفضائي.',
      'جولة النقاش والدردشة: ناقش التناقضات واكتشف من يحاول التمويه والتظاهر والمعرفة!',
      'التصويت الحاسم: يصوت الجميع لطرد المشتبه به رقم 1 إلى خارج المركبة.',
      'يفوز البشر إذا طردوا الفضائي، بينما يفوز الفضائي إذا خادع الجميع أو خمن الكلمة!'
    ],
    rulesEn: [
      'Secret Assignment: Humans get the secret word, the Alien gets a subtle blank or fake hint.',
      'Hint Phase: Every player submits a short witty hint without giving away the exact word.',
      'Discussion Phase: Debate suspicious clues and analyze who is bluffing!',
      'Ejection Vote: Cast votes to eject the top suspect out of the airlock.',
      'Humans win by unmasking the Alien; Alien wins by avoiding detection or guessing the secret word!'
    ],
    featuresAr: [
      'مئات الكلمات والتصنيفات الكوميدية الكونية واليومية',
      'نظام شات مباشر وتصويت تفاعلي بصري متكامل',
      'لاعبون آليون أذكياء بمصطلحات عربية مضحكة للعب الفردي',
      'مؤثرات كشف الهوية وإعادة التصويت المشوقة'
    ],
    featuresEn: [
      'Hundreds of hilarious space & daily topic categories',
      'Interactive visual chat logs and real-time voting system',
      'Smart bot companions with humorous banter for instant quick matches',
      'Exciting dramatic reveal animations and vote ties resolution'
    ]
  },
  {
    id: 'galaxy_rescue',
    titleAr: 'مهمة إنقاذ المجرة 🚀🛡️',
    titleEn: 'Galaxy Rescue Mission 🚀🛡️',
    shortDescAr: 'لعبة تعاونية استراتيجية وفكاهية لتنسيق صيانة سفينة النجوم وإخماد الكوارث الفضائية في الوقت المحدد!',
    shortDescEn: 'Co-op comedy sci-fi strategy! Coordinate emergency overrides to save your starship from cosmic meltdowns.',
    fullDescAr: 'انضم كطاقم فضائي مكون من 2 إلى 4 لاعبين لإدارة غرفة التحكم بمركبة "لودافيا العظيمة". يتعين على كل لاعب اتخاذ قرارات فورية، ضبط الصمامات الكوانتية، صد هجمات ماعز الفضاء، وإخماد انفجارات محرك الشاورما المجرّي قبل نفاد عداد الوقت أو تدمير الدروع!',
    fullDescEn: 'Join a starship crew of 2-4 players managing the command bridge of the "Grand Lodavia". Every player handles specialized consoles: balancing quantum valves, scaring away cosmic space goats, and cooling down Shawarma warp engines before time runs out or shields collapse!',
    category: 'coop',
    isMostPlayed: false,
    featured: false,
    isNew: false,
    activePlayersCount: 890,
    activityLevel: 'medium',
    activityLevelAr: 'تعاوني نشط 🛰️',
    activityLevelEn: 'Active Co-op 🛰️',
    artwork: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    accentColor: '#38BDF8',
    badgeAr: 'تعاوني • CO-OP',
    badgeEn: 'CO-OP',
    icon: 'Rocket',
    gradientBg: 'from-purple-950/80 via-indigo-950/60 to-cyan-950/80',
    borderColor: 'border-purple-500/30 hover:border-purple-400/60',
    minPlayers: 2,
    maxPlayers: 4,
    avgDurationMinutes: 5,
    xpReward: 150,
    pointsReward: 60,
    rulesAr: [
      'اختر دورك في الطاقم (القائد، المهندس الكوانتي، خبير الدروع، أو آلي السخرية).',
      'تظهر أزمات عشوائية مستمرة على لوحة التحكم بتوقيت تنازلي.',
      'نسق الإجراء المطلوب فوراً (تعديل المؤشرات، تشغيل المفاتيح الثنائية، ضغط الأزرار الساخنة).',
      'كل أزمة تُحل بنجاح تزيد من نقاط النصر وتنقذ الدروع من التدمير.',
      'حل 5 أزمات بنجاح يحقق النصر الكوني الشامل للطاقم!'
    ],
    rulesEn: [
      'Select your bridge role (Captain, Quantum Engineer, Shield Specialist, or AI Humorist).',
      'Random emergency alerts pop up with countdown timers.',
      'Synchronize required actions (adjusting pressure sliders, toggling switches, pressing red buttons).',
      'Each resolved crisis saves hull integrity and boosts crew victory score.',
      'Successfully solve 5 crises to complete the cosmic rescue!'
    ],
    featuresAr: [
      'نظام أزمات ديناميكي يضمن جولات مختلفة في كل مرة',
      'مساعد طاقم آلي ذكي وساخر ومؤثرات صوتية حية',
      'إمكانية اللعب الفردي مع ذكاء اصطناعي أو مشاركة أصدقائك في غرفة خاصة',
      'مكافآت خبرة مضاعفة عند إتمام المهمة بدون أي ضرر للهيكل'
    ],
    featuresEn: [
      'Dynamic crisis generator ensuring unique replayability',
      'Interactive witty AI crew assistant with live audio synth feedback',
      'Play solo with AI crewmates or host a private room for real friends',
      'Bonus XP for completing the rescue with 100% hull integrity'
    ]
  },
  {
    id: 'lodavia_challenge',
    titleAr: 'تحدي لودافيا 🧠⚡',
    titleEn: 'Lodavia Challenge 🧠⚡',
    shortDescAr: 'تحدي السرعة والذكاء في الفضاء والعلوم والتكنولوجيا والثقافة العامة مع وقت سريع وتتابع النقاط!',
    shortDescEn: 'Fast-paced speed trivia challenge in space, science, tech, and general knowledge with combo streak bonuses!',
    fullDescAr: 'اختبر حصيلتك العلمية والكونية في سباق مع الزمن! 10 أسئلة متدرجة الصعوبة، مضاعفات نقاط متتالية (Combo Multiplier)، ومؤقت إجابة حاسم بـ 15 ثانية لكل سؤال مع شرح تعليمي ممتع بعد كل إجابة.',
    fullDescEn: 'Test your scientific and cosmic intellect against a ticking clock! 10 progressive speed questions, combo multiplier streaks, 15-second response timers, and insightful fun facts after every answer.',
    category: 'challenge',
    isMostPlayed: false,
    featured: false,
    isNew: false,
    activePlayersCount: 1120,
    activityLevel: 'high',
    activityLevelAr: 'تحدي ذكاء 🧠',
    activityLevelEn: 'Trivia Battle 🧠',
    artwork: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&auto=format&fit=crop&q=80',
    accentColor: '#D9B968',
    badgeAr: 'تحدي وذكاء • QUIZ',
    badgeEn: 'QUIZ',
    icon: 'Cpu',
    gradientBg: 'from-amber-950/80 via-orange-950/60 to-purple-950/80',
    borderColor: 'border-amber-500/30 hover:border-amber-400/60',
    minPlayers: 1,
    maxPlayers: 1,
    avgDurationMinutes: 3,
    xpReward: 120,
    pointsReward: 40,
    rulesAr: [
      'تتكون كل جولة من 10 أسئلة متنوعة بـ 4 خيارات لكل سؤال.',
      'لديك 15 ثانية فقط للإجابة على كل سؤال.',
      'الإجابات السريعة تمنحك سرعة قياسية ونقاطاً مضاعفة!',
      'المحافظة على سلسلة الإجابات الصحيحة (Streak) تضاعف مكافآتك بشكل ضخم.',
      'احصل على الترتيب الذهبي واعرض اسمك في صدارة لوحة متصدري لودافيا!'
    ],
    rulesEn: [
      'Each match consists of 10 progressive 4-option questions.',
      'You have 15 seconds per question to pick the correct answer.',
      'Faster responses award time bonuses and speed multipliers.',
      'Maintaining consecutive correct streaks massively scales up your score combo.',
      'Claim the Gold Rank on the Lodavia Global Leaderboard!'
    ],
    featuresAr: [
      'مكتبة أسئلة كوكبية متجددة وشروح علمية شيقة',
      'مؤثرات بصريّة وصوتية حية لسلسلة الانتصارات (Combo Streaks)',
      'حفظ أفضل رقم قياسي شخصي ونسبة الدقة المئوية',
      'تحويل النقاط مباشرة إلى متجر لودافيا الكوني'
    ],
    featuresEn: [
      'Constantly updated cosmic trivia pool with insightful explanations',
      'Dynamic visual feedback and audio chimes for combo streaks',
      'Saves high scores and lifetime accuracy statistics locally and globally',
      'Instantly redeem points earned into the Lodavia Store'
    ]
  }
];

export const DAILY_MASCOT_CHALLENGES: DailyMascotChallenge[] = [
  {
    id: 'challenge_ray_speed',
    mascot: 'ray',
    mascotNameAr: 'ريّ (Ray) 🚀',
    mascotNameEn: 'Ray 🚀',
    mascotAvatar: rayAvatarIcon,
    mascotRoleAr: 'مرشد السرعة والمناورات الفضائية',
    mascotRoleEn: 'Speed & Starship Pilot Guide',
    titleAr: 'تحدي ريّ: كاسر سرعة الضوء',
    titleEn: "Ray's Warp Velocity Run",
    descAr: 'حقق مركزاً متقدماً في سباق المجرات أو أكمل جولة في فوضى المركبة بدون احتراق المحركات.',
    descEn: 'Achieve a podium rank in Galaxy Rush or finish a Starship Chaos run without overheating.',
    targetGameId: 'galaxy_rush',
    currentProgress: 1,
    maxProgress: 1,
    rewardXp: 120,
    rewardCoins: 50,
    completed: true,
    claimed: false
  },
  {
    id: 'challenge_laika_rescue',
    mascot: 'laika',
    mascotNameAr: 'لايكا (Laika) 🐕',
    mascotNameEn: 'Laika 🐕',
    mascotAvatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150',
    mascotRoleAr: 'بطلة الاستكشاف والإنقاذ الكوكبي',
    mascotRoleEn: 'Planetary Exploration Hero',
    titleAr: 'مهمة لايكا: إنقاذ توازن الكوكب',
    titleEn: "Laika's Planetary Shield",
    descAr: 'أنقذ الكوكب في لعبة Planet Rescue وحافظ على درع الكوكب أعلى من 70% عند نهاية الوقت.',
    descEn: 'Protect the rotating world in Planet Rescue and keep planetary shields above 70%.',
    targetGameId: 'planet_rescue',
    currentProgress: 0,
    maxProgress: 1,
    rewardXp: 150,
    rewardCoins: 75,
    completed: false,
    claimed: false
  },
  {
    id: 'challenge_albert_brain',
    mascot: 'albert',
    mascotNameAr: 'ألبرت (Albert) 🧠',
    mascotNameEn: 'Albert 🧠',
    mascotAvatar: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=150',
    mascotRoleAr: 'عالم الفيزياء الكوانتية والذكاء الفائق',
    mascotRoleEn: 'Quantum Mind & Research Lead',
    titleAr: 'مختبر ألبرت: تحدي الذكاء المجرّي',
    titleEn: "Albert's Quantum Intellect",
    descAr: 'أجب بشكل صحيح على 5 أسئلة متتالية في تحدي لودافيا للسرعة والعلوم العامة.',
    descEn: 'Score 5 consecutive correct answers in the Lodavia Trivia Challenge.',
    targetGameId: 'lodavia_challenge',
    currentProgress: 3,
    maxProgress: 5,
    rewardXp: 100,
    rewardCoins: 40,
    completed: false,
    claimed: false
  }
];

export const INITIAL_MINI_PLAYERS: Record<string, MiniPlayerProfile> = {
  'lead_1': {
    id: 'lead_1',
    name: 'سارة الكونية 🌟',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    level: 28,
    xp: 6850,
    titleAr: 'أميرة أندروميدا الفلكية',
    titleEn: 'Andromeda Princess',
    matchesCount: 142,
    winsCount: 118,
    winRate: 83,
    points: 1420,
    status: 'in_game',
    currentActivityAr: 'تلعب الآن: سباق المجرات 🚀',
    currentActivityEn: 'Playing: Galaxy Rush 🚀',
    achievementsCount: 18,
    achievements: ['🏆 بطلة المجرة', '⚡ سرعة الضوء', '👑 الصدارة الذهبية'],
    isFriend: true,
    isFollowing: true,
    badgeAr: 'Top 1 Global',
    badgeEn: 'Top 1 Global',
    frameBorderColor: '#D9B968'
  },
  'lead_2': {
    id: 'lead_2',
    name: 'الكابتن طارق 🚀',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    level: 24,
    xp: 5120,
    titleAr: 'قائد الأسطول الكوني الموحد',
    titleEn: 'Cosmic Fleet Admiral',
    matchesCount: 110,
    winsCount: 84,
    winRate: 76,
    points: 980,
    status: 'in_game',
    currentActivityAr: 'يلعب الآن: فوضى المركبة 🛸',
    currentActivityEn: 'Playing: Starship Chaos 🛸',
    achievementsCount: 14,
    achievements: ['🛸 ربان المحركات', '🛡️ حامي الهيكل', '🔥 النصر الكوانتي'],
    isFriend: true,
    isFollowing: false,
    badgeAr: 'Master Pilot',
    badgeEn: 'Master Pilot',
    frameBorderColor: '#0EA5E9'
  },
  'lead_3': {
    id: 'lead_3',
    name: 'منى القحطاني 🛸',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    level: 19,
    xp: 3840,
    titleAr: 'مستكشفة الثقوب السوداء',
    titleEn: 'Singularity Explorer',
    matchesCount: 85,
    winsCount: 62,
    winRate: 72,
    points: 740,
    status: 'online',
    currentActivityAr: 'متصلة في استراحة القلعة 🪐',
    currentActivityEn: 'Online in Citadel Hub 🪐',
    achievementsCount: 11,
    achievements: ['🌍 منقذة الكوكب', '💎 جامعة البلورات', '✨ المستكشفة'],
    isFriend: false,
    isFollowing: false,
    badgeAr: 'Star Explorer',
    badgeEn: 'Star Explorer',
    frameBorderColor: '#10B981'
  },
  'lead_4': {
    id: 'lead_4',
    name: 'فهد المطيري 👾',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    level: 17,
    xp: 3100,
    titleAr: 'مهندس المحركات الكوانتية',
    titleEn: 'Warp Engineer',
    matchesCount: 68,
    winsCount: 45,
    winRate: 66,
    points: 580,
    status: 'online',
    currentActivityAr: 'يبحث عن غرفة في من هو الفضائي 👽',
    currentActivityEn: 'Looking for party in Who is Alien 👽',
    achievementsCount: 9,
    achievements: ['🔧 مصلح الأعطال', '⚡ طاقة فائقة', '🎯 كاشف المحتالين'],
    isFriend: false,
    isFollowing: true,
    badgeAr: 'Engineer Pro',
    badgeEn: 'Engineer Pro',
    frameBorderColor: '#8B5CF6'
  },
  'lead_5': {
    id: 'lead_5',
    name: 'ريما العتيبي 🪐',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    level: 15,
    xp: 2600,
    titleAr: 'دبلوماسية المجرة العليا',
    titleEn: 'Galactic Diplomat',
    matchesCount: 52,
    winsCount: 38,
    winRate: 73,
    points: 490,
    status: 'in_game',
    currentActivityAr: 'تلعب الآن: تحدي لودافيا 🧠',
    currentActivityEn: 'Playing: Lodavia Challenge 🧠',
    achievementsCount: 8,
    achievements: ['🧠 عبقرية الفضاء', '⚡ إجابة فورية', '🌟 نجمة الثقافة'],
    isFriend: true,
    isFollowing: true,
    badgeAr: 'Trivia Elite',
    badgeEn: 'Trivia Elite',
    frameBorderColor: '#EC4899'
  }
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_potato',
    titleAr: 'قاهر بطاطس الفضاء 🥔',
    titleEn: 'Cosmic Potato Slayer 🥔',
    descriptionAr: 'أنقذ المجرة من الكارثة الغذائية الفائقة في لعبة مهمة إنقاذ المجرة.',
    descriptionEn: 'Save the galaxy from the ultimate food disaster in Galaxy Rescue.',
    icon: '🥔',
    unlocked: false,
    xpValue: 150,
    gameId: 'galaxy_rescue'
  },
  {
    id: 'ach_alien_detector',
    titleAr: 'كاشف المحتالين الكوني 🕵️‍♂️',
    titleEn: 'Alien Unmasker 🕵️‍♂️',
    descriptionAr: 'اكتشف الفضائي المتخفي من الجولة الأولى بالتصويت في لعبة من هو الفضائي.',
    descriptionEn: 'Successfully unmask the undercover alien on the first voting round.',
    icon: '🕵️‍♂️',
    unlocked: false,
    xpValue: 120,
    gameId: 'who_is_alien'
  },
  {
    id: 'ach_genius',
    titleAr: 'عقلاني مجرّي فائق 🧠',
    titleEn: 'Galactic Polymath 🧠',
    descriptionAr: 'حقّق العلامة الكاملة 10/10 في تحدي لودافيا للذكاء والسرعة.',
    descriptionEn: 'Achieve a perfect 10/10 score in the Lodavia Speed Challenge.',
    icon: '🧠',
    unlocked: false,
    xpValue: 180,
    gameId: 'lodavia_challenge'
  },
  {
    id: 'ach_streak_master',
    titleAr: 'سيد السلسلة الكوانتية 🔥',
    titleEn: 'Quantum Streak Master 🔥',
    descriptionAr: 'حقّق سلسلة إجابات صحيحة متتالية بـ 5 إجابات في أي لعبة.',
    descriptionEn: 'Achieve a 5-question consecutive answer streak.',
    icon: '🔥',
    unlocked: false,
    xpValue: 100
  },
  {
    id: 'ach_galaxy_racer',
    titleAr: 'طيار الضوء الكوني 🚀',
    titleEn: 'Light Speed Racer 🚀',
    descriptionAr: 'أكمل سباق المجرات بنجاح واقطع خط النهاية برقم قياسي.',
    descriptionEn: 'Successfully complete a Galaxy Rush race and cross the finish line.',
    icon: '🏎️',
    unlocked: false,
    xpValue: 160,
    gameId: 'galaxy_rush'
  },
  {
    id: 'ach_planet_saver',
    titleAr: 'حامي الكوكب الأسطوري 🌍',
    titleEn: 'Savior of the Realm 🌍',
    descriptionAr: 'نجحت في إنقاذ الكوكب والتصدي للكوارث الفضائية في لعبة إنقاذ الكوكب.',
    descriptionEn: 'Successfully save the planet from catastrophic cosmic emergencies in Planet Rescue.',
    icon: '🛡️',
    unlocked: false,
    xpValue: 200,
    gameId: 'planet_rescue'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'lead_1',
    name: 'سارة الكونية 🌟',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    level: 12,
    xp: 3450,
    points: 820,
    badgeAr: 'أميرة أندروميدا',
    badgeEn: 'Andromeda Princess',
    rank: 1
  },
  {
    id: 'lead_2',
    name: 'الكابتن طارق 🚀',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    level: 10,
    xp: 2890,
    points: 650,
    badgeAr: 'قائد الأسطول الكوني',
    badgeEn: 'Cosmic Fleet Admiral',
    rank: 2
  },
  {
    id: 'lead_3',
    name: 'منى القحطاني 🛸',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120',
    level: 8,
    xp: 2100,
    points: 490,
    badgeAr: 'مستكشفة الثقوب السوداء',
    badgeEn: 'Singularity Explorer',
    rank: 3
  },
  {
    id: 'lead_4',
    name: 'فهد المطيري 👾',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    level: 7,
    xp: 1750,
    points: 380,
    badgeAr: 'مهندس المحركات',
    badgeEn: 'Warp Engineer',
    rank: 4
  },
  {
    id: 'lead_5',
    name: 'ريما العتيبي 🪐',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    level: 6,
    xp: 1420,
    points: 310,
    badgeAr: 'دبلوماسية المجرة',
    badgeEn: 'Galactic Diplomat',
    rank: 5
  }
];

// Pool of secret words for Who Is The Alien
export const ALIEN_SECRET_TOPICS = [
  { topicAr: 'شاورما عربية 🌯', topicEn: 'Arabic Shawarma 🌯', categoryAr: 'أطعمة', categoryEn: 'Food' },
  { topicAr: 'ثقب أسود 🌀', topicEn: 'Black Hole 🌀', categoryAr: 'فضاء', categoryEn: 'Space' },
  { topicAr: 'قهوة سعودية ☕', topicEn: 'Saudi Coffee ☕', categoryAr: 'مشروبات', categoryEn: 'Drinks' },
  { topicAr: 'تلسكوب هابل 🔭', topicEn: 'Hubble Telescope 🔭', categoryAr: 'تكنولوجيا', categoryEn: 'Technology' },
  { topicAr: 'كوكب المريخ 🔴', topicEn: 'Planet Mars 🔴', categoryAr: 'فضاء', categoryEn: 'Space' },
  { topicAr: 'بيتزا بالجبن 🍕', topicEn: 'Cheese Pizza 🍕', categoryAr: 'أطعمة', categoryEn: 'Food' },
  { topicAr: 'ذكاء اصطناعي 🤖', topicEn: 'Artificial Intelligence 🤖', categoryAr: 'تقنية', categoryEn: 'Tech' }
];

// Questions Pool for Lodavia Challenge Quiz
export const CHALLENGE_QUESTIONS = [
  {
    questionAr: "كم يحتاج ضوء الشمس من الوقت للوصول إلى كوكب الأرض تقريباً؟",
    questionEn: "Approximately how long does sunlight take to reach Planet Earth?",
    optionsAr: ["حوالي 8 دقائق و20 ثانية ⏱️", "حوالي 24 ساعة كاملة 🌞", "أقل من ثانية واحدة ⚡", "ساعتان متواصلتان ⌛"],
    optionsEn: ["About 8 mins and 20 secs ⏱️", "Around 24 full hours 🌞", "Less than 1 second ⚡", "2 continuous hours ⌛"],
    correctIndex: 0,
    explanationAr: "يسافر الضوء بسرعة 300,000 كم/ثانية، ويقطع المسافة البالغة 150 مليون كم من الشمس للأرض في نحو 8 دقائق و20 ثانية!",
    explanationEn: "Light travels at 300,000 km/s, crossing the 150 million km distance from the Sun to Earth in roughly 8 mins 20 secs!"
  },
  {
    questionAr: "ما هو أكبر كوكب في مجموعتنا الشمسية من حيث الحجم؟",
    questionEn: "Which planet is the largest in our solar system by volume?",
    optionsAr: ["كوكب المشتري (Jupiter) 🪐", "كوكب زحل (Saturn) 🪐", "كوكب الأرض (Earth) 🌍", "كوكب نبتون (Neptune) 🔵"],
    optionsEn: ["Jupiter 🪐", "Saturn 🪐", "Earth 🌍", "Neptune 🔵"],
    correctIndex: 0,
    explanationAr: "كوكب المشتري هو الأضخم بلا منازع! يتسع لداخل حجمه لأكثر من 1,300 كوكب بحجم الأرض.",
    explanationEn: "Jupiter is undeniably the largest! Over 1,300 Earths could fit inside Jupiter."
  },
  {
    questionAr: "ما اسم المجرة الحلزونية القريبة منا والتي ستندمج مع درب التبانة مستقبلًا؟",
    questionEn: "What is the name of the neighboring spiral galaxy heading towards the Milky Way?",
    optionsAr: ["مجرة أندروميدا (Andromeda) 🌌", "مجرة سومبريرو (Sombrero) 🎩", "مجرة المثلث (Triangulum) 📐", "مجرة السحابة الماجلانية ☁️"],
    optionsEn: ["Andromeda Galaxy 🌌", "Sombrero Galaxy 🎩", "Triangulum Galaxy 📐", "Magellanic Cloud ☁️"],
    correctIndex: 0,
    explanationAr: "مجرة أندروميدا تبعد عنّا 2.5 مليون سنة ضوئية وتتجه نحونا ببطء للاندماج الهادئ بعد نحو 4 مليارات سنة.",
    explanationEn: "Andromeda is 2.5 million light-years away and is gradually moving towards a peaceful cosmic merge in ~4 billion years."
  },
  {
    questionAr: "أي العناصر الكيميائية هو الأكثر وفرة وتواجداً في الكون بأكمله؟",
    questionEn: "Which chemical element is the most abundant in the entire universe?",
    optionsAr: ["الهيدروجين (Hydrogen - H) ⚛️", "الأكسجين (Oxygen - O) 💨", "الكربون (Carbon - C) 💎", "الحديد (Iron - Fe) 🧲"],
    optionsEn: ["Hydrogen (H) ⚛️", "Oxygen (O) 💨", "Carbon (C) 💎", "Iron (Fe) 🧲"],
    correctIndex: 0,
    explanationAr: "يشكل الهيدروجين حوالي 75% من المادة المضيئة والعادية في الكون، وهو وقود النجوم الأساسي!",
    explanationEn: "Hydrogen makes up roughly 75% of elemental mass in the cosmos, acting as the primary fuel for all stars!"
  },
  {
    questionAr: "ما الذي يحدث عندما ينهار نجم عملاق جداً تحت تأثير جاذبيته الخاصة؟",
    questionEn: "What forms when a massive dying star collapses under its own gravity?",
    optionsAr: ["يتكون ثقب أسود (Black Hole) 🌀", "يتحول فوراً إلى كوكب صخري 🪨", "يتجمّد الزمان ولا يحدث شيء ❄️", "يتبخر النجم دون أي أثر 💨"],
    optionsEn: ["A Black Hole forms 🌀", "Turns into a rocky planet 🪨", "Time freezes entirely ❄️", "Evaporates without trace 💨"],
    correctIndex: 0,
    explanationAr: "تنهار الكثافة إلى نقطة التفرد الكوانتي (Singularity) مخلفة ثقباً أسود بجاذبية فائقة لا ينفلت منها حتى الضوء!",
    explanationEn: "Core density collapses into a quantum singularity, creating a black hole with gravitational pull so intense even light cannot escape!"
  },
  {
    questionAr: "من هو أول إنسان استطاع السفر إلى الفضاء الخارجي والدوران حول الأرض سنة 1961؟",
    questionEn: "Who was the first human to travel into outer space and orbit Earth in 1961?",
    optionsAr: ["يوري جاجارين (Yuri Gagarin) 👨‍🚀", "نيل أرمسترونج (Neil Armstrong) 🌕", "عبد الله السعدون 🚀", "إيلون ماسك ⚡"],
    optionsEn: ["Yuri Gagarin 👨‍🚀", "Neil Armstrong 🌕", "Abdullah Al-Saadoun 🚀", "Elon Musk ⚡"],
    correctIndex: 0,
    explanationAr: "الرائد يوري جاجارين انطلق في سفينة Vostok 1 في 12 أبريل 1961، محققاً أول دورة بشرية حول كوكب الأرض.",
    explanationEn: "Cosmonaut Yuri Gagarin launched aboard Vostok 1 on April 12, 1961, becoming the first human in space!"
  },
  {
    questionAr: "ما هي وحدة قياس المسافات الكونية بين النجوم والمجرات الشاسعة؟",
    questionEn: "What unit of measurement is used for vast distances between stars and galaxies?",
    optionsAr: ["السنة الضوئية (Light-Year) ✨", "الكيلومتر المربع 📏", "الميل الفضائي 🌌", "الدقيقة الصوتية 🔊"],
    optionsEn: ["Light-Year ✨", "Square Kilometer 📏", "Space Mile 🌌", "Sound Minute 🔊"],
    correctIndex: 0,
    explanationAr: "السنة الضوئية هي المسافة التي يقطعها الضوء في سنة كاملة، وتساوي تقريباً 9.46 تريليون كيلومتر!",
    explanationEn: "A light-year is the distance light travels in one full Julian year, approximately 9.46 trillion kilometers!"
  },
  {
    questionAr: "أي من هذه الكواكب يُعرف بـ 'الكوكب الأحمر' بسبب انتشار أكسيد الحديد على سطحه؟",
    questionEn: "Which planet is known as the 'Red Planet' due to iron oxide on its surface?",
    optionsAr: ["كوكب المريخ (Mars) 🔴", "كوكب الزهرة (Venus) 🟡", "كوكب عطارد (Mercury) ⚪", "كوكب أورانوس (Uranus) 🟢"],
    optionsEn: ["Mars 🔴", "Venus 🟡", "Mercury ⚪", "Uranus 🟢"],
    correctIndex: 0,
    explanationAr: "المريخ يمتلك غبار أكسيد الحديد (الصدأ) بكثرة في تربته وغلافه الجوي، مما يعطيه مظهر الشفق الأحمر الأنيق.",
    explanationEn: "Mars has soil rich in iron oxide (rust) giving its landscape and thin atmosphere a distinct reddish hue!"
  }
];
