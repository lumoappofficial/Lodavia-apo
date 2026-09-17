import { SupportedLanguage } from '../types/i18n';

export interface MultiLangPhrase {
  ar: string;
  en: string;
  fr: string;
  es: string;
  de: string;
  zh?: string;
  ja?: string;
}

export const PHRASE_DICTIONARY: Record<string, MultiLangPhrase> = {
  // Navigation & Core Hubs
  'الرئيسية': {
    ar: 'الرئيسية',
    en: 'Home',
    fr: 'Accueil',
    es: 'Inicio',
    de: 'Startseite',
    zh: '首页',
    ja: 'ホーム'
  },
  'Home': {
    ar: 'الرئيسية',
    en: 'Home',
    fr: 'Accueil',
    es: 'Inicio',
    de: 'Startseite',
    zh: '首页',
    ja: 'ホーム'
  },
  'المرئيات': {
    ar: 'المرئيات',
    en: 'Media',
    fr: 'Médias',
    es: 'Medios',
    de: 'Medien',
    zh: '媒体',
    ja: 'メディア'
  },
  'Media': {
    ar: 'المرئيات',
    en: 'Media',
    fr: 'Médias',
    es: 'Medios',
    de: 'Medien',
    zh: '媒体',
    ja: 'メディア'
  },
  'المجتمعات': {
    ar: 'المجتمعات',
    en: 'Communities',
    fr: 'Communautés',
    es: 'Comunidades',
    de: 'Communitys',
    zh: '社区',
    ja: 'コミュニティ'
  },
  'Communities': {
    ar: 'المجتمعات',
    en: 'Communities',
    fr: 'Communautés',
    es: 'Comunidades',
    de: 'Communitys',
    zh: '社区',
    ja: 'コミュニティ'
  },
  'الرسائل': {
    ar: 'الرسائل',
    en: 'Messages',
    fr: 'Messages',
    es: 'Mensajes',
    de: 'Nachrichten',
    zh: '消息',
    ja: 'メッセージ'
  },
  'Messages': {
    ar: 'الرسائل',
    en: 'Messages',
    fr: 'Messages',
    es: 'Mensajes',
    de: 'Nachrichten',
    zh: '消息',
    ja: 'メッセージ'
  },
  'الملف الشخصي': {
    ar: 'الملف الشخصي',
    en: 'Profile',
    fr: 'Profil',
    es: 'Perfil',
    de: 'Profil',
    zh: '个人资料',
    ja: 'プロフィール'
  },
  'Profile': {
    ar: 'الملف الشخصي',
    en: 'Profile',
    fr: 'Profil',
    es: 'Perfil',
    de: 'Profil',
    zh: '个人资料',
    ja: 'プロフィール'
  },
  'My Profile': {
    ar: 'الملف الشخصي',
    en: 'My Profile',
    fr: 'Mon Profil',
    es: 'Mi Perfil',
    de: 'Mein Profil',
    zh: '我的资料',
    ja: 'マイプロフィール'
  },
  'ملفي': {
    ar: 'ملفي',
    en: 'You',
    fr: 'Moi',
    es: 'Tú',
    de: 'Du',
    zh: '我的',
    ja: 'マイ'
  },
  'You': {
    ar: 'ملفي',
    en: 'You',
    fr: 'Moi',
    es: 'Tú',
    de: 'Du',
    zh: '我的',
    ja: 'マイ'
  },
  'استكشاف': {
    ar: 'استكشاف',
    en: 'Explore',
    fr: 'Explorer',
    es: 'Explorar',
    de: 'Entdecken',
    zh: '探索',
    ja: '探索'
  },
  'Explore': {
    ar: 'استكشاف',
    en: 'Explore',
    fr: 'Explorer',
    es: 'Explorar',
    de: 'Entdecken',
    zh: '探索',
    ja: '探索'
  },
  'المشاريع': {
    ar: 'المشاريع',
    en: 'Projects',
    fr: 'Projets',
    es: 'Proyectos',
    de: 'Projekte',
    zh: '项目',
    ja: 'プロジェクト'
  },
  'Projects': {
    ar: 'المشاريع',
    en: 'Projects',
    fr: 'Projets',
    es: 'Proyectos',
    de: 'Projekte',
    zh: '项目',
    ja: 'プロジェクト'
  },
  'الكاميرا': {
    ar: 'الكاميرا',
    en: 'Camera',
    fr: 'Caméra',
    es: 'Cámara',
    de: 'Kamera',
    zh: '相机',
    ja: 'カメラ'
  },
  'Camera': {
    ar: 'الكاميرا',
    en: 'Camera',
    fr: 'Caméra',
    es: 'Cámara',
    de: 'Kamera',
    zh: '相机',
    ja: 'カメラ'
  },
  'الألعاب': {
    ar: 'الألعاب',
    en: 'Games',
    fr: 'Jeux',
    es: 'Juegos',
    de: 'Spiele',
    zh: '游戏',
    ja: 'ゲーム'
  },
  'Games': {
    ar: 'الألعاب',
    en: 'Games',
    fr: 'Jeux',
    es: 'Juegos',
    de: 'Spiele',
    zh: '游戏',
    ja: 'ゲーム'
  },
  'الكون 3D': {
    ar: 'الكون 3D',
    en: '3D Universe',
    fr: 'Univers 3D',
    es: 'Universo 3D',
    de: '3D-Universum',
    zh: '3D宇宙',
    ja: '3Dユニバース'
  },
  'Universe': {
    ar: 'الكون 3D',
    en: 'Universe',
    fr: 'Univers',
    es: 'Universo',
    de: 'Universum',
    zh: '宇宙',
    ja: '宇宙'
  },
  'الغرف الصوتية': {
    ar: 'الغرف الصوتية',
    en: 'Voice Rooms',
    fr: 'Salons Vocaux',
    es: 'Salas de Voz',
    de: 'Sprachräume',
    zh: '语音房',
    ja: 'ボイスルーム'
  },
  'صوتيات لودافيا': {
    ar: 'صوتيات لودافيا',
    en: 'Lodavia Audio',
    fr: 'Audio Lodavia',
    es: 'Audio Lodavia',
    de: 'Lodavia Audio',
    zh: 'Lodavia音频',
    ja: 'Lodaviaオーディオ'
  },
  'متجر لودافيا': {
    ar: 'متجر لودافيا',
    en: 'Cosmic Store',
    fr: 'Boutique Cosmique',
    es: 'Tienda Cósmica',
    de: 'Cosmic Store',
    zh: '宇宙商城',
    ja: 'コズミックストア'
  },
  'العالم الموازي': {
    ar: 'العالم الموازي',
    en: 'Parallel World',
    fr: 'Monde Parallèle',
    es: 'Mundo Paralelo',
    de: 'Parallelwelt',
    zh: '平行世界',
    ja: 'パラレルワールド'
  },
  'مركز الأوفلاين': {
    ar: 'مركز الأوفلاين',
    en: 'Offline Center',
    fr: 'Centre Hors-ligne',
    es: 'Centro Offline',
    de: 'Offline-Center',
    zh: '离线中心',
    ja: 'オフラインセンター'
  },
  'كل الأقسام': {
    ar: 'كل الأقسام',
    en: 'All Hubs',
    fr: 'Toutes les sections',
    es: 'Todas las secciones',
    de: 'Alle Bereiche',
    zh: '全部板块',
    ja: 'すべてのセクション'
  },
  'الإعدادات': {
    ar: 'الإعدادات',
    en: 'Settings',
    fr: 'Paramètres',
    es: 'Ajustes',
    de: 'Einstellungen',
    zh: '设置',
    ja: '設定'
  },
  'Settings': {
    ar: 'الإعدادات',
    en: 'Settings',
    fr: 'Paramètres',
    es: 'Ajustes',
    de: 'Einstellungen',
    zh: '设置',
    ja: '設定'
  },
  'الإشعارات': {
    ar: 'الإشعارات',
    en: 'Notifications',
    fr: 'Notifications',
    es: 'Notificaciones',
    de: 'Mitteilungen',
    zh: '通知',
    ja: '通知'
  },
  'Notifications': {
    ar: 'الإشعارات',
    en: 'Notifications',
    fr: 'Notifications',
    es: 'Notificaciones',
    de: 'Mitteilungen',
    zh: '通知',
    ja: '通知'
  },

  // Feed & Home
  'الخلاصة الكونية 📡': {
    ar: 'الخلاصة الكونية 📡',
    en: 'Cosmic Feed 📡',
    fr: 'Flux Cosmique 📡',
    es: 'Feed Cósmico 📡',
    de: 'Cosmic Feed 📡',
    zh: '宇宙动态 📡',
    ja: 'コズミックフィード 📡'
  },
  'لوحة الاستكشاف 🪐': {
    ar: 'لوحة الاستكشاف 🪐',
    en: 'Explore Hub 🪐',
    fr: 'Hub d\'exploration 🪐',
    es: 'Panel de Exploración 🪐',
    de: 'Entdecker-Hub 🪐',
    zh: '探索中心 🪐',
    ja: '探索ハブ 🪐'
  },
  'بث المنشورات المباشر': {
    ar: 'بث المنشورات المباشر',
    en: 'Live Quantum Stream',
    fr: 'Flux en direct',
    es: 'Transmisión en vivo',
    de: 'Live-Stream',
    zh: '实时动态',
    ja: 'ライブストリーム'
  },
  'مركز الاستكشاف الكوني': {
    ar: 'مركز الاستكشاف الكوني',
    en: 'Cosmic Explorer Node',
    fr: 'Nœud d\'exploration cosmique',
    es: 'Nodo de exploración cósmica',
    de: 'Cosmic Explorer Node',
    zh: '宇宙探索节点',
    ja: 'コズミック探索ノード'
  },
  'ماذا ترغب في إنشائه اليوم؟': {
    ar: 'ماذا ترغب في إنشائه اليوم؟',
    en: 'What to create today?',
    fr: 'Que souhaitez-vous créer aujourd\'hui ?',
    es: '¿Qué quieres crear hoy?',
    de: 'Was möchtest du heute erstellen?',
    zh: '今天想创作什么？',
    ja: '今日は何を作成しますか？'
  },
  'منشور جديد': {
    ar: 'منشور جديد',
    en: 'New Post',
    fr: 'Nouvelle publication',
    es: 'Nueva publicación',
    de: 'Neuer Beitrag',
    zh: '新动态',
    ja: '新規投稿'
  },
  'كاميرا وتصوير 📸': {
    ar: 'كاميرا وتصوير 📸',
    en: 'Camera Studio 📸',
    fr: 'Studio Caméra 📸',
    es: 'Estudio de Cámara 📸',
    de: 'Kamera Studio 📸',
    zh: '相机工作室 📸',
    ja: 'カメラスタジオ 📸'
  },
  'مشروع جديد 🚀': {
    ar: 'مشروع جديد 🚀',
    en: 'New Project 🚀',
    fr: 'Nouveau Projet 🚀',
    es: 'Nuevo Proyecto 🚀',
    de: 'Neues Projekt 🚀',
    zh: '新项目 🚀',
    ja: '新規プロジェクト 🚀'
  },
  'صالون صوتي': {
    ar: 'صالون صوتي',
    en: 'Audio Room',
    fr: 'Salon Vocal',
    es: 'Sala de Audio',
    de: 'Sprachraum',
    zh: '语音沙龙',
    ja: 'オーディオルーム'
  },
  'غرفة مرئية': {
    ar: 'غرفة مرئية',
    en: 'Video Room',
    fr: 'Salle Vidéo',
    es: 'Sala de Video',
    de: 'Videoraum',
    zh: '视频房',
    ja: 'ビデオ会議'
  },
  'بث مباشر': {
    ar: 'بث مباشر',
    en: 'Live Stream',
    fr: 'Direct en direct',
    es: 'Transmisión en vivo',
    de: 'Live-Stream',
    zh: '实时直播',
    ja: 'ライブ配信'
  },
  'مادة تعليمية': {
    ar: 'مادة تعليمية',
    en: 'Academic Course',
    fr: 'Cours Académique',
    es: 'Curso Académico',
    de: 'Lernkurs',
    zh: '教学课程',
    ja: '教育コース'
  },
  'مجتمع جديد': {
    ar: 'مجتمع جديد',
    en: 'New Space',
    fr: 'Nouvel Espace',
    es: 'Nuevo Espacio',
    de: 'Neue Community',
    zh: '新社区',
    ja: '新しいコミュニティ'
  },
  'قريبًا': {
    ar: 'قريبًا',
    en: 'Soon',
    fr: 'Bientôt',
    es: 'Pronto',
    de: 'Bald',
    zh: '即将推出',
    ja: '近日公開'
  },
  'تأكيد ونشر الآن 🚀': {
    ar: 'تأكيد ونشر الآن 🚀',
    en: 'Confirm & Publish 🚀',
    fr: 'Confirmer et publier 🚀',
    es: 'Confirmar y publicar 🚀',
    de: 'Bestätigen und veröffentlichen 🚀',
    zh: '确认并立即发布 🚀',
    ja: '確認して公開 🚀'
  },
  'الطقس والتقويم': {
    ar: 'الطقس والتقويم',
    en: 'Weather & Date',
    fr: 'Météo et date',
    es: 'Clima y fecha',
    de: 'Wetter & Datum',
    zh: '天气与日期',
    ja: '天気と日付'
  },
  'المزيد ←': {
    ar: 'المزيد ←',
    en: 'More →',
    fr: 'Plus →',
    es: 'Más →',
    de: 'Mehr →',
    zh: '更多 →',
    ja: 'もっと見る →'
  },

  // Chat & Communication
  'الرسائل والمحادثات': {
    ar: 'الرسائل والمحادثات',
    en: 'Messages & Chats',
    fr: 'Messages & Discussions',
    es: 'Mensajes y Chats',
    de: 'Nachrichten & Chats',
    zh: '消息与聊天',
    ja: 'メッセージ＆チャット'
  },
  'محادثة جديدة': {
    ar: 'محادثة جديدة',
    en: 'New Chat',
    fr: 'Nouvelle discussion',
    es: 'Nuevo chat',
    de: 'Neuer Chat',
    zh: '新建聊天',
    ja: '新しいチャット'
  },
  'اتصال مشفر وآمن بالكامل': {
    ar: 'اتصال مشفر وآمن بالكامل',
    en: 'End-to-End Encrypted',
    fr: 'Chiffré de bout en bout',
    es: 'Cifrado de extremo a extremo',
    de: 'Ende-zu-Ende-verschlüsselt',
    zh: '端到端完全加密',
    ja: 'エンドツーエンド暗号化'
  },
  'الكل': {
    ar: 'الكل',
    en: 'All',
    fr: 'Tous',
    es: 'Todos',
    de: 'Alle',
    zh: '全部',
    ja: 'すべて'
  },
  'غير مقروءة': {
    ar: 'غير مقروءة',
    en: 'Unread',
    fr: 'Non lus',
    es: 'No leídos',
    de: 'Ungelesen',
    zh: '未读',
    ja: '未読'
  },
  'المثبتة': {
    ar: 'المثبتة',
    en: 'Pinned',
    fr: 'Épinglés',
    es: 'Fijados',
    de: 'Angeheftet',
    zh: '置顶',
    ja: 'ピン留め'
  },
  'المجموعات': {
    ar: 'المجموعات',
    en: 'Groups',
    fr: 'Groupes',
    es: 'Grupos',
    de: 'Gruppen',
    zh: '群组',
    ja: 'グループ'
  },
  'المحظورين': {
    ar: 'المحظورين',
    en: 'Blocked',
    fr: 'Bloqués',
    es: 'Bloqueados',
    de: 'Blockiert',
    zh: '已屏蔽',
    ja: 'ブロック済み'
  },
  'متصل الآن': {
    ar: 'متصل الآن',
    en: 'Online',
    fr: 'En ligne',
    es: 'En línea',
    de: 'Online',
    zh: '在线',
    ja: 'オンライン'
  },
  'متصل بالشبكة': {
    ar: 'متصل بالشبكة',
    en: 'Online',
    fr: 'En ligne',
    es: 'En línea',
    de: 'Online',
    zh: '在线',
    ja: 'オンライン'
  },
  'غير متصل': {
    ar: 'غير متصل',
    en: 'Offline',
    fr: 'Hors ligne',
    es: 'Desconectado',
    de: 'Offline',
    zh: '离线',
    ja: 'オフライン'
  },
  'يكتب الآن...': {
    ar: 'يكتب الآن...',
    en: 'Typing...',
    fr: 'Écrit...',
    es: 'Escribiendo...',
    de: 'Schreibt...',
    zh: '正在输入...',
    ja: '入力中...'
  },
  'محظور': {
    ar: 'محظور',
    en: 'Blocked',
    fr: 'Bloqué',
    es: 'Bloqueado',
    de: 'Blockiert',
    zh: '已屏蔽',
    ja: 'ブロック中'
  },
  'تم حظر المستخدم': {
    ar: 'تم حظر المستخدم',
    en: 'Blocked contact',
    fr: 'Contact bloqué',
    es: 'Contacto bloqueado',
    de: 'Kontakt blockiert',
    zh: '联系人已被屏蔽',
    ja: '連絡先がブロックされました'
  },
  'حظر هذا المستخدم': {
    ar: 'حظر هذا المستخدم',
    en: 'Block Contact',
    fr: 'Bloquer le contact',
    es: 'Bloquear contacto',
    de: 'Kontakt blockieren',
    zh: '屏蔽该联系人',
    ja: '連絡先をブロック'
  },
  'إلغاء حظر المستخدم': {
    ar: 'إلغاء حظر المستخدم',
    en: 'Unblock Contact',
    fr: 'Débloquer le contact',
    es: 'Desbloquear contacto',
    de: 'Kontakt freigeben',
    zh: '解除屏蔽',
    ja: 'ブロックを解除'
  },
  'اتصال صوتي': {
    ar: 'اتصال صوتي',
    en: 'Audio Call',
    fr: 'Appel audio',
    es: 'Llamada de voz',
    de: 'Sprachanruf',
    zh: '语音通话',
    ja: '音声通話'
  },
  'اتصال فيديو': {
    ar: 'اتصال فيديو',
    en: 'Video Call',
    fr: 'Appel vidéo',
    es: 'Videollamada',
    de: 'Videoanruf',
    zh: '视频通话',
    ja: 'ビデオ通話'
  },
  'بحث في المحادثة': {
    ar: 'بحث في المحادثة',
    en: 'Search in chat',
    fr: 'Rechercher dans le chat',
    es: 'Buscar en el chat',
    de: 'Im Chat suchen',
    zh: '在聊天中搜索',
    ja: 'チャット内を検索'
  },
  'خيارات وإعدادات المحادثة (•••)': {
    ar: 'خيارات وإعدادات المحادثة (•••)',
    en: 'Chat Settings & Options (•••)',
    fr: 'Paramètres et options du chat (•••)',
    es: 'Ajustes y opciones del chat (•••)',
    de: 'Chat-Optionen und Einstellungen (•••)',
    zh: '聊天设置与选项 (•••)',
    ja: 'チャット設定＆オプション (•••)'
  },
  'اليوم': {
    ar: 'اليوم',
    en: 'Today',
    fr: 'Aujourd\'hui',
    es: 'Hoy',
    de: 'Heute',
    zh: '今天',
    ja: '今日'
  },
  'أمس': {
    ar: 'أمس',
    en: 'Yesterday',
    fr: 'Hier',
    es: 'Ayer',
    de: 'Gestern',
    zh: '昨天',
    ja: '昨日'
  },
  'الآن': {
    ar: 'الآن',
    en: 'Just now',
    fr: 'À l\'instant',
    es: 'Ahora mismo',
    de: 'Gerade eben',
    zh: '刚刚',
    ja: 'たった今'
  },

  // Common Actions
  'بحث...': {
    ar: 'بحث...',
    en: 'Search...',
    fr: 'Rechercher...',
    es: 'Buscar...',
    de: 'Suchen...',
    zh: '搜索...',
    ja: '検索...'
  },
  'إلغاء': {
    ar: 'إلغاء',
    en: 'Cancel',
    fr: 'Annuler',
    es: 'Cancelar',
    de: 'Abbrechen',
    zh: '取消',
    ja: 'キャンセル'
  },
  'حفظ': {
    ar: 'حفظ',
    en: 'Save',
    fr: 'Enregistrer',
    es: 'Guardar',
    de: 'Speichern',
    zh: '保存',
    ja: '保存'
  },
  'تأكيد': {
    ar: 'تأكيد',
    en: 'Confirm',
    fr: 'Confirmer',
    es: 'Confirmar',
    de: 'Bestätigen',
    zh: '确认',
    ja: '確認'
  },
  'حذف': {
    ar: 'حذف',
    en: 'Delete',
    fr: 'Supprimer',
    es: 'Eliminar',
    de: 'Löschen',
    zh: '删除',
    ja: '削除'
  },
  'تعديل': {
    ar: 'تعديل',
    en: 'Edit',
    fr: 'Modifier',
    es: 'Editar',
    de: 'Bearbeiten',
    zh: '编辑',
    ja: '編集'
  },
  'مشاركة': {
    ar: 'مشاركة',
    en: 'Share',
    fr: 'Partager',
    es: 'Compartir',
    de: 'Teilen',
    zh: '分享',
    ja: '共有'
  },
  'نسخ': {
    ar: 'نسخ',
    en: 'Copy',
    fr: 'Copier',
    es: 'Copiar',
    de: 'Kopieren',
    zh: '复制',
    ja: 'コピー'
  },
  'إرسال': {
    ar: 'إرسال',
    en: 'Send',
    fr: 'Envoyer',
    es: 'Enviar',
    de: 'Senden',
    zh: '发送',
    ja: '送信'
  },
  'متصل الآن': {
    ar: 'متصل الآن',
    en: 'Online now',
    fr: 'En ligne',
    es: 'En línea',
    de: 'Online',
    zh: '在线',
    ja: 'オンライン'
  },
  'Online now': {
    ar: 'متصل الآن',
    en: 'Online now',
    fr: 'En ligne',
    es: 'En línea',
    de: 'Online',
    zh: '在线',
    ja: 'オンライン'
  },
  'غير متصل': {
    ar: 'غير متصل',
    en: 'Offline',
    fr: 'Hors ligne',
    es: 'Desconectado',
    de: 'Offline',
    zh: '离线',
    ja: 'オフライン'
  },
  'Offline': {
    ar: 'غير متصل',
    en: 'Offline',
    fr: 'Hors ligne',
    es: 'Desconectado',
    de: 'Offline',
    zh: '离线',
    ja: 'オフライン'
  },
  'محظور': {
    ar: 'محظور',
    en: 'Blocked',
    fr: 'Bloqué',
    es: 'Bloqueado',
    de: 'Blockiert',
    zh: '已封锁',
    ja: 'ブロック中'
  },
  'مستخدم محظور': {
    ar: 'مستخدم محظور',
    en: 'Blocked contact',
    fr: 'Contact bloqué',
    es: 'Contacto bloqueado',
    de: 'Blockierter Kontakt',
    zh: '已封锁的联系人',
    ja: 'ブロックされた連絡先'
  },
  'يكتب الآن...': {
    ar: 'يكتب الآن...',
    en: 'typing...',
    fr: 'écrit...',
    es: 'escribiendo...',
    de: 'tippt...',
    zh: '正在输入...',
    ja: '入力中...'
  },
  'أنت: ': {
    ar: 'أنت: ',
    en: 'You: ',
    fr: 'Vous : ',
    es: 'Tú: ',
    de: 'Du: ',
    zh: '你：',
    ja: 'あなた：'
  },
  'تسجيل صوتي 🎤': {
    ar: 'تسجيل صوتي 🎤',
    en: 'Voice message 🎤',
    fr: 'Message vocal 🎤',
    es: 'Mensaje de voz 🎤',
    de: 'Sprachnachricht 🎤',
    zh: '语音消息 🎤',
    ja: '音声メッセージ 🎤'
  },
  'صورة 🖼️': {
    ar: 'صورة 🖼️',
    en: 'Attached image 🖼️',
    fr: 'Image jointe 🖼️',
    es: 'Imagen adjunta 🖼️',
    de: 'Angehängtes Bild 🖼️',
    zh: '附带图片 🖼️',
    ja: '添付画像 🖼️'
  },
  'فيديو 📹': {
    ar: 'فيديو 📹',
    en: 'Video 📹',
    fr: 'Vidéo 📹',
    es: 'Video 📹',
    de: 'Video 📹',
    zh: '视频 📹',
    ja: '動画 📹'
  },
  'انقر لبدء المحادثة...': {
    ar: 'انقر لبدء المحادثة...',
    en: 'Tap to start conversation...',
    fr: 'Appuyez pour démarrer la conversation...',
    es: 'Toca para iniciar conversación...',
    de: 'Tippen, um die Unterhaltung zu beginnen...',
    zh: '点击开始对话...',
    ja: 'タップして会話を開始...'
  },
  'خيارات وإعدادات المحادثة (•••)': {
    ar: 'خيارات وإعدادات المحادثة (•••)',
    en: 'Chat Settings & Options (•••)',
    fr: 'Paramètres et options du chat (•••)',
    es: 'Ajustes y opciones del chat (•••)',
    de: 'Chat-Optionen (•••)',
    zh: '聊天设置与选项 (•••)',
    ja: 'チャット設定・オプション (•••)'
  },
  'بحث عن كلمة في الرسائل...': {
    ar: 'بحث عن كلمة في الرسائل...',
    en: 'Filter chat text...',
    fr: 'Rechercher dans les messages...',
    es: 'Buscar en mensajes...',
    de: 'Nachrichten filtern...',
    zh: '搜索消息内容...',
    ja: 'メッセージ内を検索...'
  },
  'مسح': {
    ar: 'مسح',
    en: 'Clear',
    fr: 'Effacer',
    es: 'Borrar',
    de: 'Löschen',
    zh: '清除',
    ja: 'クリア'
  },
  'جاري مزامنة التاريخ...': {
    ar: 'جاري مزامنة التاريخ...',
    en: 'Syncing archives...',
    fr: 'Synchronisation des archives...',
    es: 'Sincronizando historial...',
    de: 'Archive werden synchronisiert...',
    zh: '正在同步历史记录...',
    ja: '履歴を同期中...'
  },
  'سحب المزامنة': {
    ar: 'سحب المزامنة',
    en: 'Sync History',
    fr: 'Synchroniser l’historique',
    es: 'Sincronizar historial',
    de: 'Verlauf synchronisieren',
    zh: '同步历史',
    ja: '履歴を同期'
  },
  'لم يتم العثور على نتائج للبحث': {
    ar: 'لم يتم العثور على نتائج للبحث',
    en: 'No matching messages found',
    fr: 'Aucun message correspondant trouvé',
    es: 'No se encontraron mensajes',
    de: 'Keine passenden Nachrichten gefunden',
    zh: '未找到匹配的消息',
    ja: '一致するメッセージが見つかりません'
  },
  'لا توجد رسائل سابقة في هذا الحوار الكوني': {
    ar: 'لا توجد رسائل سابقة في هذا الحوار الكوني',
    en: 'Secure chat stream clear.',
    fr: 'Aucun message précédent dans ce flux.',
    es: 'No hay mensajes anteriores en este chat.',
    de: 'Keine vorherigen Nachrichten.',
    zh: '此对话中没有先前的消息。',
    ja: '過去のメッセージはありません。'
  },
  'رد على: ': {
    ar: 'رد على: ',
    en: 'Reply: ',
    fr: 'Répondre à : ',
    es: 'Respuesta a: ',
    de: 'Antwort auf: ',
    zh: '回复：',
    ja: '返信：'
  },
  'الرد على:': {
    ar: 'الرد على:',
    en: 'Replying to:',
    fr: 'Répondre à :',
    es: 'Respondiendo a:',
    de: 'Antworten auf:',
    zh: '正在回复：',
    ja: '返信先：'
  },
  'تعديل الرسالة:': {
    ar: 'تعديل الرسالة:',
    en: 'Editing Message:',
    fr: 'Modifier le message :',
    es: 'Editando mensaje:',
    de: 'Nachricht bearbeiten:',
    zh: '正在编辑消息：',
    ja: 'メッセージを編集中：'
  },
  'عرض ملء الشاشة': {
    ar: 'عرض ملء الشاشة',
    en: 'Click to zoom',
    fr: 'Plein écran',
    es: 'Pantalla completa',
    de: 'Vollbild',
    zh: '全屏显示',
    ja: '全画面表示'
  },
  '(معدلة)': {
    ar: '(معدلة)',
    en: '(edited)',
    fr: '(modifié)',
    es: '(editado)',
    de: '(bearbeitet)',
    zh: '(已编辑)',
    ja: '(編集済み)'
  },
  'تمت القراءة': {
    ar: 'تمت القراءة',
    en: 'Read',
    fr: 'Lu',
    es: 'Leído',
    de: 'Gelesen',
    zh: '已读',
    ja: '既読'
  },
  'تم التسليم': {
    ar: 'تم التسليم',
    en: 'Delivered',
    fr: 'Distribué',
    es: 'Entregado',
    de: 'Zugestellt',
    zh: '已送达',
    ja: '配信済み'
  },
  'تم الإرسال': {
    ar: 'تم الإرسال',
    en: 'Sent',
    fr: 'Envoyé',
    es: 'Enviado',
    de: 'Gesendet',
    zh: '已发送',
    ja: '送信済み'
  },
  'تم النسخ!': {
    ar: 'تم النسخ!',
    en: 'Copied!',
    fr: 'Copié !',
    es: '¡Copiado!',
    de: 'Kopiert!',
    zh: '已复制！',
    ja: 'コピーしました！'
  },
  'حفظ المورد': {
    ar: 'حفظ المورد',
    en: 'Download File',
    fr: 'Télécharger le fichier',
    es: 'Descargar archivo',
    de: 'Datei herunterladen',
    zh: '下载文件',
    ja: 'ファイルをダウンロード'
  },
  'محادثات لودافيا الفورية': {
    ar: 'محادثات لودافيا الفورية',
    en: 'Lodavia Secure Messaging',
    fr: 'Messagerie sécurisée Lodavia',
    es: 'Mensajería segura Lodavia',
    de: 'Lodavia Sichere Nachrichten',
    zh: 'Lodavia 安全即时通讯',
    ja: 'Lodavia セキュアメッセージング'
  },
  'تشفير كامل من طرف إلى طرف': {
    ar: 'تشفير كامل من طرف إلى طرف',
    en: 'End-to-End Encryption Protocol',
    fr: 'Chiffrement de bout en bout',
    es: 'Cifrado de extremo a extremo',
    de: 'Ende-zu-Ende-Verschlüsselung',
    zh: '端到端加密协议',
    ja: 'エンドツーエンド暗号化'
  }
};

/**
 * Universal phrase translator.
 * Given an Arabic or English text, it resolves the corresponding string in currentLang.
 */
export function lookupPhrase(text: string, currentLang: SupportedLanguage): string {
  if (!text) return '';
  const trimmed = text.trim();
  
  const found = PHRASE_DICTIONARY[trimmed];
  if (found) {
    if (currentLang === 'ar') return found.ar;
    if (currentLang === 'en') return found.en;
    if (currentLang === 'fr') return found.fr || found.en;
    if (currentLang === 'es') return found.es || found.en;
    if (currentLang === 'de') return found.de || found.en;
    if (currentLang === 'zh') return found.zh || found.en;
    if (currentLang === 'ja') return found.ja || found.en;
  }
  
  // Try normalized text (without emojis or outer symbols)
  const cleanKey = trimmed.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}🪐🚀📸🎮💎📡🧭🎙️🎵🎬🔴🧠☰✨📊🤖🔥⚙️🌐]/gu, '').trim();
  if (cleanKey && cleanKey !== trimmed && PHRASE_DICTIONARY[cleanKey]) {
    const cleanFound = PHRASE_DICTIONARY[cleanKey];
    if (currentLang === 'ar') return cleanFound.ar;
    if (currentLang === 'en') return cleanFound.en;
    if (currentLang === 'fr') return cleanFound.fr || cleanFound.en;
    if (currentLang === 'es') return cleanFound.es || cleanFound.en;
    if (currentLang === 'de') return cleanFound.de || cleanFound.en;
    if (currentLang === 'zh') return cleanFound.zh || cleanFound.en;
    if (currentLang === 'ja') return cleanFound.ja || cleanFound.en;
  }

  return text;
}

/**
 * Dual/Multi-text helper: provides ar and en, and automatically derives or uses custom fr, es, de.
 */
export function tText(
  arText: string,
  enText: string,
  currentLang: SupportedLanguage,
  frText?: string,
  esText?: string,
  deText?: string
): string {
  if (currentLang === 'ar') return arText;
  if (currentLang === 'en') return enText;
  if (currentLang === 'fr' && frText) return frText;
  if (currentLang === 'es' && esText) return esText;
  if (currentLang === 'de' && deText) return deText;
  
  // Look up in phrase dictionary by Arabic key or English key
  const match = PHRASE_DICTIONARY[arText?.trim()] || PHRASE_DICTIONARY[enText?.trim()];
  if (match) {
    if (currentLang === 'fr') return match.fr || enText;
    if (currentLang === 'es') return match.es || enText;
    if (currentLang === 'de') return match.de || enText;
    if (currentLang === 'zh') return match.zh || enText;
    if (currentLang === 'ja') return match.ja || enText;
  }

  // Also try looking up without emojis
  const cleanAr = arText?.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}🪐🚀📸🎮💎📡🧭🎙️🎵🎬🔴🧠☰✨📊🤖🔥⚙️🌐]/gu, '').trim();
  const cleanEn = enText?.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}🪐🚀📸🎮💎📡🧭🎙️🎵🎬🔴🧠☰✨📊🤖🔥⚙️🌐]/gu, '').trim();
  const cleanMatch = (cleanAr && PHRASE_DICTIONARY[cleanAr]) || (cleanEn && PHRASE_DICTIONARY[cleanEn]);
  if (cleanMatch) {
    if (currentLang === 'fr') return cleanMatch.fr || enText;
    if (currentLang === 'es') return cleanMatch.es || enText;
    if (currentLang === 'de') return cleanMatch.de || enText;
    if (currentLang === 'zh') return cleanMatch.zh || enText;
    if (currentLang === 'ja') return cleanMatch.ja || enText;
  }
  
  return enText;
}
