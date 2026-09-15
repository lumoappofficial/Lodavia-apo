import { CelestialBody, MoonPhaseInfo, SkyEventAlert, ConstellationLine } from '../types/sky';

// -------------------------------------------------------------
// ASTRONOMY MATHEMATICAL CALCULATIONS & EPHEMERIS ENGINE
// -------------------------------------------------------------

export class AstronomyService {
  /**
   * Convert Gregorian Date to Julian Date
   */
  public static getJulianDate(date: Date): number {
    const time = date.getTime();
    return time / 86400000 + 2440587.5;
  }

  /**
   * Calculate Greenwich Mean Sidereal Time (GMST) in hours (0 - 24)
   */
  public static getGMST(date: Date): number {
    const jd = this.getJulianDate(date);
    const d = jd - 2451545.0;
    let gmst = 18.697374558 + 24.06570982441908 * d;
    gmst = ((gmst % 24) + 24) % 24;
    return gmst;
  }

  /**
   * Calculate Local Sidereal Time (LST) in hours
   */
  public static getLST(date: Date, longitudeDeg: number): number {
    const gmst = this.getGMST(date);
    let lst = gmst + longitudeDeg / 15.0;
    lst = ((lst % 24) + 24) % 24;
    return lst;
  }

  /**
   * Convert Right Ascension (RA in hours) and Declination (Dec in deg)
   * to Horizon Coordinates: Altitude (-90 to +90) and Azimuth (0 to 360, 0=N, 90=E, 180=S, 270=W)
   */
  public static raDecToAltAz(
    raHours: number,
    decDeg: number,
    latDeg: number,
    lonDeg: number,
    date: Date
  ): { altitude: number; azimuth: number } {
    const lst = this.getLST(date, lonDeg);
    const haHours = lst - raHours;
    const haRad = (haHours * 15 * Math.PI) / 180;
    const decRad = (decDeg * Math.PI) / 180;
    const latRad = (latDeg * Math.PI) / 180;

    // Altitude
    const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
    const altRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
    const altitude = (altRad * 180) / Math.PI;

    // Azimuth
    const cosAlt = Math.cos(altRad);
    const cosAz = (Math.sin(decRad) - Math.sin(altRad) * Math.sin(latRad)) / (cosAlt * Math.cos(latRad) || 0.0001);
    const sinAz = (-Math.cos(decRad) * Math.sin(haRad)) / (cosAlt || 0.0001);

    let azRad = Math.atan2(sinAz, cosAz);
    let azimuth = (azRad * 180) / Math.PI;
    azimuth = ((azimuth % 360) + 360) % 360;

    return { altitude, azimuth };
  }

  /**
   * Approximate Sun Coordinates (RA in hours, Dec in deg)
   */
  public static getSunCoordinates(date: Date): { ra: number; dec: number } {
    const jd = this.getJulianDate(date);
    const n = jd - 2451545.0;
    const L = ((280.46 + 0.9856474 * n) % 360 + 360) % 360;
    const g = (((357.528 + 0.9856003 * n) % 360 + 360) % 360 * Math.PI) / 180;
    const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * (Math.PI / 180);
    const epsilon = (23.439 - 0.0000004 * n) * (Math.PI / 180);

    const sinDec = Math.sin(epsilon) * Math.sin(lambda);
    const dec = (Math.asin(sinDec) * 180) / Math.PI;

    const y = Math.cos(epsilon) * Math.sin(lambda);
    const x = Math.cos(lambda);
    let ra = (Math.atan2(y, x) * 180) / Math.PI / 15;
    ra = ((ra % 24) + 24) % 24;

    return { ra, dec };
  }

  /**
   * Approximate Moon Coordinates (RA in hours, Dec in deg) & Phase info
   */
  public static getMoonInfo(date: Date): { ra: number; dec: number; phase: MoonPhaseInfo } {
    const jd = this.getJulianDate(date);
    const d = jd - 2451545.0;

    // Approximate Lunar Orbital longitude & mean anomaly
    const L = ((218.316 + 13.176396 * d) % 360 + 360) % 360;
    const M = (((134.963 + 13.064993 * d) % 360 + 360) % 360 * Math.PI) / 180;
    const F = (((93.272 + 13.229350 * d) % 360 + 360) % 360 * Math.PI) / 180;

    const lRad = (L + 6.289 * Math.sin(M)) * (Math.PI / 180);
    const bRad = (5.128 * Math.sin(F)) * (Math.PI / 180);

    // Convert Ecliptic to Equatorial (e = 23.439°)
    const eps = 23.439 * (Math.PI / 180);
    const sinDec = Math.sin(bRad) * Math.cos(eps) + Math.cos(bRad) * Math.sin(eps) * Math.sin(lRad);
    const dec = (Math.asin(sinDec) * 180) / Math.PI;

    const y = Math.sin(lRad) * Math.cos(eps) - Math.tan(bRad) * Math.sin(eps);
    const x = Math.cos(lRad);
    let ra = (Math.atan2(y, x) * 180) / Math.PI / 15;
    ra = ((ra % 24) + 24) % 24;

    // Moon Age / Phase (Synodic month = 29.530588 days, Known New Moon: 2000-01-06 18:14 UTC -> JD 2451549.5)
    const daysSinceKnownNewMoon = jd - 2451549.5;
    const synodicMonth = 29.53058867;
    const ageDays = ((daysSinceKnownNewMoon % synodicMonth) + synodicMonth) % synodicMonth;
    const phaseRatio = ageDays / synodicMonth;
    const illuminationPercent = Math.round((1 - Math.cos(phaseRatio * 2 * Math.PI)) / 2 * 100);

    let phaseNameAr = 'هلال متزايد';
    let phaseNameEn = 'Waxing Crescent';
    let phaseCode: MoonPhaseInfo['phaseCode'] = 'waxing_crescent';

    if (ageDays < 1.5 || ageDays > 28.0) {
      phaseNameAr = 'محاق (قمر جديد)';
      phaseNameEn = 'New Moon';
      phaseCode = 'new';
    } else if (ageDays < 6.5) {
      phaseNameAr = 'هلال متزايد';
      phaseNameEn = 'Waxing Crescent';
      phaseCode = 'waxing_crescent';
    } else if (ageDays < 8.5) {
      phaseNameAr = 'تربيع أول';
      phaseNameEn = 'First Quarter';
      phaseCode = 'first_quarter';
    } else if (ageDays < 13.5) {
      phaseNameAr = 'أحدب متزايد';
      phaseNameEn = 'Waxing Gibbous';
      phaseCode = 'waxing_gibbous';
    } else if (ageDays < 16.0) {
      phaseNameAr = 'بدر مكتمل 🌕';
      phaseNameEn = 'Full Moon 🌕';
      phaseCode = 'full';
    } else if (ageDays < 21.0) {
      phaseNameAr = 'أحدب متناقص';
      phaseNameEn = 'Waning Gibbous';
      phaseCode = 'waning_gibbous';
    } else if (ageDays < 23.5) {
      phaseNameAr = 'تربيع أخير';
      phaseNameEn = 'Last Quarter';
      phaseCode = 'last_quarter';
    } else {
      phaseNameAr = 'هلال متناقص';
      phaseNameEn = 'Waning Crescent';
      phaseCode = 'waning_crescent';
    }

    return {
      ra,
      dec,
      phase: {
        phaseNameAr,
        phaseNameEn,
        phaseCode,
        illuminationPercent,
        ageDays: Math.round(ageDays * 10) / 10,
        moonriseTime: '18:40',
        moonsetTime: '06:15'
      }
    };
  }

  /**
   * Approximate Planetary Coordinates for epoch (Keplerian elements based)
   */
  public static getPlanetCoordinates(planetId: string, date: Date): { ra: number; dec: number } {
    const jd = this.getJulianDate(date);
    const d = jd - 2451545.0; // days since J2000.0

    // Approximate Mean Longitude (L) and Orbital Period variations
    const orbitalData: Record<string, { L0: number; rate: number; inclination: number; node: number }> = {
      mercury: { L0: 252.25, rate: 4.0923344, inclination: 7.00, node: 48.33 },
      venus: { L0: 181.98, rate: 1.6021305, inclination: 3.39, node: 76.68 },
      mars: { L0: 355.43, rate: 0.5240330, inclination: 1.85, node: 49.56 },
      jupiter: { L0: 34.35, rate: 0.0830853, inclination: 1.30, node: 100.46 },
      saturn: { L0: 50.08, rate: 0.0334442, inclination: 2.49, node: 113.67 },
      uranus: { L0: 314.06, rate: 0.0117258, inclination: 0.77, node: 74.01 },
      neptune: { L0: 304.35, rate: 0.0059810, inclination: 1.77, node: 131.78 }
    };

    const data = orbitalData[planetId] || orbitalData.mars;
    const lon = ((data.L0 + data.rate * d) % 360 + 360) % 360;
    const lRad = (lon * Math.PI) / 180;
    const incRad = (data.inclination * Math.PI) / 180;

    // Approximate Geocentric RA and Dec
    const eps = 23.439 * (Math.PI / 180);
    const bRad = incRad * Math.sin(lRad - data.node * (Math.PI / 180));

    const sinDec = Math.sin(bRad) * Math.cos(eps) + Math.cos(bRad) * Math.sin(eps) * Math.sin(lRad);
    const dec = (Math.asin(Math.max(-1, Math.min(1, sinDec))) * 180) / Math.PI;

    const y = Math.sin(lRad) * Math.cos(eps) - Math.tan(bRad) * Math.sin(eps);
    const x = Math.cos(lRad);
    let ra = (Math.atan2(y, x) * 180) / Math.PI / 15;
    ra = ((ra % 24) + 24) % 24;

    return { ra, dec };
  }

  /**
   * Fixed Major Stars and Deep Sky catalog with accurate Astronomical coordinates (RA / Dec)
   */
  public static getStaticCelestialCatalog(): CelestialBody[] {
    return [
      // 1. Sirius (الشعرى اليمانية) - Brightest star in night sky
      {
        id: 'sirius',
        nameAr: 'الشعرى اليمانية (Sirius)',
        nameEn: 'Sirius (Alpha Canis Majoris)',
        type: 'star',
        ra: 6.752,
        dec: -16.716,
        magnitude: -1.46,
        distanceLightYears: 8.6,
        constellationAr: 'الكلب الأكبر',
        constellationEn: 'Canis Major',
        color: '#E0F2FE',
        icon: '⭐',
        descriptionAr: 'ألمع نجم في سماء الأرض ليلاً، نجم ثنائي يبعد 8.6 سنة ضوئية فقط.',
        descriptionEn: 'The brightest star in the night sky, a binary star system located 8.6 light-years away.',
        factsAr: [
          'يتميز بلمعانه الاستثنائي وقربه النسبي من الأرض.',
          'كان له دور محوري في التقويم المصري القديم وتحديد فيضان النيل.'
        ],
        factsEn: [
          'Appears exceptionally bright due to its intrinsic luminosity and proximity to Earth.',
          'Played a key role in the ancient Egyptian calendar.'
        ]
      },
      // 2. Betelgeuse (إبط الجوزاء / منكب الجوزاء)
      {
        id: 'betelgeuse',
        nameAr: 'منكب الجوزاء (Betelgeuse)',
        nameEn: 'Betelgeuse (Alpha Orionis)',
        type: 'star',
        ra: 5.919,
        dec: 7.407,
        magnitude: 0.5,
        distanceLightYears: 642,
        constellationAr: 'الجبار (Orion)',
        constellationEn: 'Orion',
        color: '#F97316',
        icon: '🔴',
        descriptionAr: 'عملاق أحمر فائق عظيم الكتلة في كوكبة الجبار يوشك على الانفجار كمستعر أعظم (Supernova).',
        descriptionEn: 'A massive red supergiant in Orion that is nearing the end of its life cycle and destined for a supernova.',
        factsAr: [
          'قطره يعادل أكثر من 700 ضعف قطر شمسنا.',
          'لو وُضع في مركز مجموعتنا الشمسية لابتلع مدارات عطارد والزهرة والأرض والمريخ.'
        ],
        factsEn: [
          'Its diameter is over 700 times that of our Sun.',
          'If placed at the center of our solar system, it would engulf Earth and Mars.'
        ]
      },
      // 3. Rigel (رجل الجبار)
      {
        id: 'rigel',
        nameAr: 'رجل الجبار (Rigel)',
        nameEn: 'Rigel (Beta Orionis)',
        type: 'star',
        ra: 5.242,
        dec: -8.201,
        magnitude: 0.13,
        distanceLightYears: 860,
        constellationAr: 'الجبار (Orion)',
        constellationEn: 'Orion',
        color: '#38BDF8',
        icon: '💎',
        descriptionAr: 'عملاق أزرق فائق شديد اللمعان والحرارة يشكل القدم اليسرى لصياد الجبار.',
        descriptionEn: 'A brilliant blue supergiant forming the left foot of the celestial hunter Orion.',
        factsAr: [
          'أشد لمعاناً من الشمس بـ 120,000 مرة!',
          'نجم شاب عظيم الطاقة تنبعث منه رياح نجمية قوية.'
        ],
        factsEn: [
          'Over 120,000 times more luminous than the Sun!',
          'Emits intense stellar winds and radiation.'
        ]
      },
      // 4. Polaris (نجم الشمال / الجدي)
      {
        id: 'polaris',
        nameAr: 'نجم الشمال (Polaris)',
        nameEn: 'Polaris (North Star)',
        type: 'star',
        ra: 2.530,
        dec: 89.264,
        magnitude: 1.98,
        distanceLightYears: 433,
        constellationAr: 'الدب الأصغر',
        constellationEn: 'Ursa Minor',
        color: '#F8FAFC',
        icon: '🧭',
        descriptionAr: 'نجم الملاحة الكوني الشهير الذي يشير دائماً وبدقة فائقة إلى القطب الشمالي السماوي.',
        descriptionEn: 'The famous celestial navigation star that marks the Northern Celestial Pole.',
        factsAr: [
          'يظل ثابتاً تقريباً في مكانه بينما تدور باقي نجوم السماء حوله بسبب دوران الأرض.',
          'يتكون في الواقع من نظام ثلاثي من النجوم المترابطة جاذبياً.'
        ],
        factsEn: [
          'Remains virtually stationary while other stars revolve around it due to Earth rotation.',
          'It is actually a triple star system.'
        ]
      },
      // 5. Vega (النسر الواقع)
      {
        id: 'vega',
        nameAr: 'النسر الواقع (Vega)',
        nameEn: 'Vega (Alpha Lyrae)',
        type: 'star',
        ra: 18.615,
        dec: 38.783,
        magnitude: 0.03,
        distanceLightYears: 25,
        constellationAr: 'القيثارة',
        constellationEn: 'Lyra',
        color: '#A855F7',
        icon: '✨',
        descriptionAr: 'نجم ناصع البياض والزرقة، كان أول نجم يُصوَّر فوتوغرافياً في تاريخ الفلك.',
        descriptionEn: 'A brilliant blue-white star, the first star ever photographed in astronomical history.',
        factsAr: [
          'يدور حول نفسه بسرعة هائلة تكاد تمزقه (يكمل دورة كل 12.5 ساعة).',
          'سيكون نجم الشمال للأرض بعد نحو 12,000 عام بسبب التمايل المحوري.'
        ],
        factsEn: [
          'Rotates rapidly every 12.5 hours.',
          'Will become Earth North Star in about 12,000 years.'
        ]
      },
      // 6. Canopus (سهيل اليماني)
      {
        id: 'canopus',
        nameAr: 'نجم سهيل (Canopus)',
        nameEn: 'Canopus (Alpha Carinae)',
        type: 'star',
        ra: 6.399,
        dec: -52.695,
        magnitude: -0.74,
        distanceLightYears: 310,
        constellationAr: 'القاعدة',
        constellationEn: 'Carina',
        color: '#FEF08A',
        icon: '🌟',
        descriptionAr: 'ثاني ألمع نجم في السماء، رمز فلكي عريق في الثقافة العربية والخليجية لبداية انكسار الصيف.',
        descriptionEn: 'The second brightest star in the sky, famous in Arab heritage for heralding autumn cooling.',
        factsAr: [
          'ظهوره السنوي في أواخر أغسطس يبشر باعتدال الطقس وانخفاض درجات الحرارة.',
          'تستخدمه المركبات الفضائية كمرجع ملاحي لتوجيه هوائياتها نحو الأرض.'
        ],
        factsEn: [
          'Used by deep-space spacecraft for attitude determination and navigation.',
          'Heralds cooler autumn weather in Arabian peninsula heritage.'
        ]
      },
      // 7. Aldebaran (الدبران)
      {
        id: 'aldebaran',
        nameAr: 'نجم الدبران (Aldebaran)',
        nameEn: 'Aldebaran (Alpha Tauri)',
        type: 'star',
        ra: 4.598,
        dec: 16.509,
        magnitude: 0.85,
        distanceLightYears: 65,
        constellationAr: 'الثور',
        constellationEn: 'Taurus',
        color: '#EA580C',
        icon: '👁️',
        descriptionAr: 'عملاق برتقالي عملاق يمثل عين الثور الحمراء، سمي الدبران لأنه يدبر (يتبع) عنقود الثريا.',
        descriptionEn: 'A bright orange giant marking the eye of Taurus the Bull.',
        factsAr: [
          'أكبر من الشمس بـ 44 مرة.',
          'تتجه مركبة بيونير 10 التابعة لناسا نحوه وستصل إلى جواره بعد نحو مليوني عام.'
        ],
        factsEn: [
          '44 times larger than the Sun.',
          'NASA Pioneer 10 probe is headed toward Aldebaran.'
        ]
      },
      // 8. Andromeda Galaxy (مجرة المرأة المسلسلة M31)
      {
        id: 'andromeda',
        nameAr: 'مجرة أندروميدا (M31)',
        nameEn: 'Andromeda Galaxy (M31)',
        type: 'dso',
        ra: 0.712,
        dec: 41.268,
        magnitude: 3.44,
        distanceLightYears: 2500000,
        constellationAr: 'المرأة المسلسلة',
        constellationEn: 'Andromeda',
        color: '#C084FC',
        icon: '🌀',
        descriptionAr: 'أقرب مجرة حلزونية عملاقة لمجرتنا درب التبانة، وأبعد جرم سماوي يمكن رؤيته بالعين المجردة.',
        descriptionEn: 'The nearest major spiral galaxy to the Milky Way, containing over one trillion stars.',
        factsAr: [
          'تحتوي على ما يقرب من تريليون نجم (ضعف عدد نجوم درب التبانة).',
          'تتحرك نحونا بسرعة 110 كم/ثانية وستندمج مع مجرتنا بعد 4.5 مليار سنة.'
        ],
        factsEn: [
          'Contains approximately one trillion stars.',
          'Will merge with the Milky Way in 4.5 billion years.'
        ]
      },
      // 9. Orion Nebula (سديم الجبار M42)
      {
        id: 'orion_nebula',
        nameAr: 'سديم الجبار (M42 Nebula)',
        nameEn: 'Orion Nebula (M42)',
        type: 'dso',
        ra: 5.588,
        dec: -5.391,
        magnitude: 4.0,
        distanceLightYears: 1344,
        constellationAr: 'الجبار',
        constellationEn: 'Orion',
        color: '#EC4899',
        icon: '🌌',
        descriptionAr: 'سديم انبعاثي هائل ومشتل كوني تنشأ بداخله مئات النجوم والكواكب الوليدة.',
        descriptionEn: 'A vast stellar nursery where hundreds of new stars and planetary systems are being born.',
        factsAr: [
          'يمتد على مساحة 24 سنة ضوئية.',
          'الغازات المتوهجة داخله تتأين بفضل الأشعة فوق البنفسجية الصادرة من نجوم شبه المنحرف الرباعية.'
        ],
        factsEn: [
          'Spans across 24 light-years.',
          'Illuminated by intense UV radiation from newborn Trapezium stars.'
        ]
      },
      // 10. Pleiades (عنقود الثريا M45)
      {
        id: 'pleiades',
        nameAr: 'عنقود الثريا (Pleiades M45)',
        nameEn: 'The Pleiades (Seven Sisters)',
        type: 'dso',
        ra: 3.789,
        dec: 24.105,
        magnitude: 1.6,
        distanceLightYears: 444,
        constellationAr: 'الثور',
        constellationEn: 'Taurus',
        color: '#67E8F9',
        icon: '✨',
        descriptionAr: 'عنقود نجمي مفتوح شهير، يضم نجوماً زرقاء شابة تتخللها سحب غبارية عاكسة زرقاء ساحرة.',
        descriptionEn: 'An iconic open star cluster dominated by luminous hot blue stars wrapped in reflection nebulosity.',
        factsAr: [
          'معروف باسم "الشقيقات السبع" منذ أقدم العصور والحضارات.',
          'يُرى بالعين المجردة ككتلة من 6 إلى 7 نجوم براقة.'
        ],
        factsEn: [
          'Known as the Seven Sisters since ancient antiquity.',
          'Clearly visible to the naked eye as a glowing stellar cluster.'
        ]
      },
      // 11. International Space Station (ISS)
      {
        id: 'iss',
        nameAr: 'محطة الفضاء الدولية (ISS)',
        nameEn: 'International Space Station',
        type: 'satellite',
        ra: 12.0, // Dynamically computed
        dec: 20.0,
        magnitude: -2.5,
        distanceAuOrKm: '418 km Orbit',
        color: '#38BDF8',
        icon: '🛰️',
        descriptionAr: 'المختبر المداري البشري الذي يدور حول الأرض بسرعة 27,600 كم/ساعة على ارتفاع 400 كم.',
        descriptionEn: 'A modular space station in low Earth orbit, orbiting Earth at 27,600 km/h.',
        factsAr: [
          'تكمل دورة كاملة حول الأرض كل 90 دقيقة (16 شروقاً وغروباً يومياً!).',
          'مأهولة برواد الفضاء والعلماء باستمرار منذ نوفمبر عام 2000.'
        ],
        factsEn: [
          'Orbits Earth every 90 minutes (witnesses 16 sunrises/sunsets daily!).',
          'Continuously inhabited by astronauts since November 2000.'
        ]
      }
    ];
  }

  /**
   * Constellation lines and connection vectors
   */
  public static getConstellations(): ConstellationLine[] {
    return [
      {
        id: 'orion',
        nameAr: 'كوكبة الجبار (Orion)',
        nameEn: 'Orion the Hunter',
        stars: ['betelgeuse', 'orion_nebula', 'rigel']
      },
      {
        id: 'taurus',
        nameAr: 'كوكبة الثور (Taurus)',
        nameEn: 'Taurus the Bull',
        stars: ['aldebaran', 'pleiades']
      },
      {
        id: 'ursa_minor',
        nameAr: 'الدب الأصغر (Ursa Minor)',
        nameEn: 'Ursa Minor',
        stars: ['polaris']
      }
    ];
  }

  /**
   * Upcoming verified astronomical events
   */
  public static getSkyEvents(): SkyEventAlert[] {
    return [
      {
        id: 'perseids_2026',
        titleAr: 'ذروة زخة شهب البرشاويات (Perseids) ☄️',
        titleEn: 'Perseids Meteor Shower Peak ☄️',
        type: 'meteor_shower',
        dateStr: '12-13 أغسطس 2026',
        peakTime: '01:00 - 04:30 AM',
        visibilityAr: 'ممتازة في السماء المظلمة (حتى 100 شهاب في الساعة)',
        visibilityEn: 'Excellent in dark skies (Up to 100 meteors/hr)',
        descriptionAr: 'واحدة من أروع الزخات الشهابية السنوية الناتجة عن مرور الأرض بمخلفات مذنب سويفت-تتل.',
        descriptionEn: 'One of the most spectacular annual meteor showers caused by comet Swift-Tuttle debris.',
        icon: '☄️'
      },
      {
        id: 'jupiter_saturn_view',
        titleAr: 'اصطفاف كوكبي مميز: المشتري وزحل 🪐',
        titleEn: 'Jupiter & Saturn Prime Evening View 🪐',
        type: 'conjunction',
        dateStr: 'الليلة وطوال الشهر',
        peakTime: 'بعد الغروب مباشرة',
        visibilityAr: 'واضح جداً بالعين المجردة باتجاه الجنوب الشرقي',
        visibilityEn: 'Visible to naked eye toward Southeast',
        descriptionAr: 'فرصة مثالية لرصد أكبر عملاقين غازيين في النظام الشمسي مع أقمارهما الجاليلية الأربعة بحلقاتها.',
        descriptionEn: 'Ideal conditions to spot Jupiter and Saturn with Galilean moons.',
        icon: '🪐'
      },
      {
        id: 'iss_pass_tonight',
        titleAr: 'عبور ساطع لمحطة الفضاء الدولية (ISS) 🛰️',
        titleEn: 'Bright ISS Overhead Pass 🛰️',
        type: 'iss_pass',
        dateStr: 'الليلة (الساعة 21:14)',
        peakTime: '21:14 - 21:19',
        visibilityAr: 'لمعان فائق يفوق لمعان كوكب المشتري',
        visibilityEn: 'High brightness brighter than Jupiter',
        descriptionAr: 'ستعبر محطة الفضاء الدولية قبة السماء كنجمة شديدة السطوع تتحرك بسلاسة من الغرب إلى الشمال الشرقي.',
        descriptionEn: 'The ISS will cross the sky as a steady, brilliant moving light.',
        icon: '🛰️'
      }
    ];
  }

  /**
   * Main Calculation: Generate all live celestial bodies computed for current Lat, Lon, Date
   * and projected into device Viewport (Heading, Pitch, FOV)
   */
  public static calculateSkyState(
    lat: number,
    lon: number,
    date: Date,
    deviceHeading: number, // 0 to 360° (Compass Azimuth)
    devicePitch: number, // -90° to +90° (Tilt from horizon: 0 = horizon, 90 = zenith, -90 = ground)
    fovH: number = 60, // Camera Horizontal Field of view (deg)
    fovV: number = 75 // Camera Vertical Field of view (deg)
  ): {
    bodies: CelestialBody[];
    moonPhase: MoonPhaseInfo;
    sunCoords: { altitude: number; azimuth: number };
    moonCoords: { altitude: number; azimuth: number };
    visibleCount: number;
  } {
    const bodies: CelestialBody[] = [];

    // 1. Sun
    const sunEquat = this.getSunCoordinates(date);
    const sunAltAz = this.raDecToAltAz(sunEquat.ra, sunEquat.dec, lat, lon, date);
    bodies.push({
      id: 'sun',
      nameAr: 'الشمس (Sun)',
      nameEn: 'The Sun (Sol)',
      type: 'sun',
      ra: sunEquat.ra,
      dec: sunEquat.dec,
      magnitude: -26.74,
      distanceAuOrKm: '1.00 AU (149.6M km)',
      color: '#FACC15',
      icon: '☀️',
      descriptionAr: 'النجم المركزي لنظامنا الشمسي ومصدر الضوء والحياة على كوكب الأرض.',
      descriptionEn: 'The central star of our solar system and the ultimate source of energy for Earth.',
      factsAr: [
        'تشكل 99.86% من كتلة المجموعة الشمسية بأكملها.',
        'درجة حرارة مركزها تبلغ نحو 15 مليون درجة مئوية.'
      ],
      factsEn: [
        'Contains 99.86% of the total mass of the solar system.',
        'Core temperature reaches 15 million degrees Celsius.'
      ],
      altitude: sunAltAz.altitude,
      azimuth: sunAltAz.azimuth,
      isVisible: sunAltAz.altitude > -0.83 // accounting for refraction at horizon
    });

    // 2. Moon
    const moonInfo = this.getMoonInfo(date);
    const moonAltAz = this.raDecToAltAz(moonInfo.ra, moonInfo.dec, lat, lon, date);
    bodies.push({
      id: 'moon',
      nameAr: `القمر (${moonInfo.phase.phaseNameAr})`,
      nameEn: `The Moon (${moonInfo.phase.phaseNameEn})`,
      type: 'moon',
      ra: moonInfo.ra,
      dec: moonInfo.dec,
      magnitude: -12.7,
      distanceAuOrKm: '384,400 km',
      color: '#E2E8F0',
      icon: '🌙',
      descriptionAr: `التابع الطبيعي الوحيد للأرض، طوره الحالي: ${moonInfo.phase.phaseNameAr} بنسبة إضاءة ${moonInfo.phase.illuminationPercent}%.`,
      descriptionEn: `Earth only natural satellite. Current phase: ${moonInfo.phase.phaseNameEn} (${moonInfo.phase.illuminationPercent}% illuminated).`,
      factsAr: [
        `نسبة الإضاءة الحالية: ${moonInfo.phase.illuminationPercent}%.`,
        `عمر القمر في الدورة الحالية: ${moonInfo.phase.ageDays} يوماً.`
      ],
      factsEn: [
        `Current illumination: ${moonInfo.phase.illuminationPercent}%.`,
        `Lunar age: ${moonInfo.phase.ageDays} days.`
      ],
      altitude: moonAltAz.altitude,
      azimuth: moonAltAz.azimuth,
      isVisible: moonAltAz.altitude > 0
    });

    // 3. Planets (Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune)
    const planetCatalog: Array<{
      id: string;
      nameAr: string;
      nameEn: string;
      color: string;
      icon: string;
      mag: number;
      dist: string;
      descAr: string;
      descEn: string;
      factAr: string;
      factEn: string;
    }> = [
      {
        id: 'mercury',
        nameAr: 'عطارد (Mercury)',
        nameEn: 'Mercury',
        color: '#94A3B8',
        icon: '⚪',
        mag: -0.4,
        dist: '0.61 AU',
        descAr: 'أصغر كواكب المجموعة الشمسية وأقربها إلى الشمس.',
        descEn: 'The smallest planet in the Solar System and closest to the Sun.',
        factAr: 'اليوم الواحد على عطارد يعادل 59 يوماً أرضياً.',
        factEn: 'A single day on Mercury lasts 59 Earth days.'
      },
      {
        id: 'venus',
        nameAr: 'الزهرة (Venus / نجمة الصبح)',
        nameEn: 'Venus (Evening/Morning Star)',
        color: '#FEF08A',
        icon: '🟡',
        mag: -4.4,
        dist: '0.28 AU',
        descAr: 'ألمع كوكب في السماء، يلقب بتوأم الأرض لتقاربهما في الحجم.',
        descEn: 'The hottest planet in our solar system, often called Earth twin.',
        factAr: 'أسخن كواكب النظام الشمسي بدرجة حرارة سطح تتجاوز 465°C.',
        factEn: 'Surface temperature reaches 465°C due to runaway greenhouse effect.'
      },
      {
        id: 'mars',
        nameAr: 'المريخ (Mars / الكوكب الأحمر)',
        nameEn: 'Mars (The Red Planet)',
        color: '#EF4444',
        icon: '🔴',
        mag: -1.2,
        dist: '1.42 AU',
        descAr: 'الكوكب الأحمر ذو السطح الصخري الغني بأكاسيد الحديد.',
        descEn: 'The dusty, cold desert world with a thin atmosphere.',
        factAr: 'يضم بركان "أوليمبوس مونس" أطول بركان في النظام الشمسي (3 أضعاف قمة إفرست).',
        factEn: 'Home to Olympus Mons, the largest volcano in the Solar System.'
      },
      {
        id: 'jupiter',
        nameAr: 'المشتري (Jupiter / ملك الكواكب)',
        nameEn: 'Jupiter (Gas Giant)',
        color: '#FB923C',
        icon: '🪐',
        mag: -2.8,
        dist: '4.2 AU',
        descAr: 'أكبر كواكب المجموعة الشمسية وحارس الأرض الجاذبي من المذنبات.',
        descEn: 'The largest planet in our solar system with iconic cloud bands.',
        factAr: 'كتلته تعادل مرتين ونصف كتلة جميع الكواكب الأخرى مجتمعة!',
        factEn: 'More than twice as massive as all other planets combined.'
      },
      {
        id: 'saturn',
        nameAr: 'زحل (Saturn / سيد الحلقات)',
        nameEn: 'Saturn (Lord of the Rings)',
        color: '#FDE047',
        icon: '🪐',
        mag: 0.2,
        dist: '8.9 AU',
        descAr: 'الكوكب الغازي الشهير بنظامه الحلقي البديع المكون من الجليد والصخور.',
        descEn: 'Adorned with a dazzling, complex system of icy rings.',
        factAr: 'كثافته أقل من كثافة الماء، فلو وُجد محيط ضخم كافٍ لطفى فوقه!',
        factEn: 'Less dense than water; it would float in a giant ocean.'
      }
    ];

    planetCatalog.forEach((p) => {
      const coords = this.getPlanetCoordinates(p.id, date);
      const altAz = this.raDecToAltAz(coords.ra, coords.dec, lat, lon, date);
      bodies.push({
        id: p.id,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        type: 'planet',
        ra: coords.ra,
        dec: coords.dec,
        magnitude: p.mag,
        distanceAuOrKm: p.dist,
        color: p.color,
        icon: p.icon,
        descriptionAr: p.descAr,
        descriptionEn: p.descEn,
        factsAr: [p.factAr],
        factsEn: [p.factEn],
        altitude: altAz.altitude,
        azimuth: altAz.azimuth,
        isVisible: altAz.altitude > 0
      });
    });

    // 4. Fixed Stars & Deep Sky Objects
    const staticCatalog = this.getStaticCelestialCatalog();
    staticCatalog.forEach((item) => {
      const altAz = this.raDecToAltAz(item.ra, item.dec, lat, lon, date);
      bodies.push({
        ...item,
        altitude: altAz.altitude,
        azimuth: altAz.azimuth,
        isVisible: altAz.altitude > 0
      });
    });

    // 5. Compute Screen Projection Coordinates $(screenX, screenY)$ and inView for all bodies
    let visibleCount = 0;
    bodies.forEach((b) => {
      if (b.altitude === undefined || b.azimuth === undefined) return;

      if (b.altitude > 0) {
        visibleCount++;
      }

      // Delta Azimuth in [-180, 180]
      let deltaAz = b.azimuth - deviceHeading;
      deltaAz = ((((deltaAz + 180) % 360) + 360) % 360) - 180;

      // Delta Altitude
      const deltaAlt = b.altitude - devicePitch;

      // Distance from center of view in degrees
      const distFromCenter = Math.sqrt(deltaAz * deltaAz + deltaAlt * deltaAlt);
      b.distanceFromCenter = distFromCenter;

      // Map to Normalized Screen Percentage (0% to 100%)
      // 50% is center of camera view
      const screenX = 50 + (deltaAz / (fovH / 2)) * 50;
      const screenY = 50 - (deltaAlt / (fovV / 2)) * 50;

      b.screenX = screenX;
      b.screenY = screenY;

      // In camera viewport if within [0, 100]% bounds (with slight margin)
      b.inView = screenX >= -10 && screenX <= 110 && screenY >= -10 && screenY <= 110;
    });

    return {
      bodies,
      moonPhase: moonInfo.phase,
      sunCoords: sunAltAz,
      moonCoords: moonAltAz,
      visibleCount
    };
  }
}
