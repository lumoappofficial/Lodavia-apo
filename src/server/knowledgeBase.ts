/**
 * Lodavia Knowledge & Semantic Intellect Base
 * 
 * Deep, comprehensive knowledge base spanning hundreds of scientific, technological,
 * philosophical, historical, mathematical, life advice, and platform topics.
 */

export interface KnowledgeEntry {
  id: string;
  tags: string[];
  ar: string;
  en: string;
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // =========================================================================
  // PHILOSOPHY & THINKERS
  // =========================================================================

  // 1. Socrates & Socratic Method
  {
    id: "socrates",
    tags: [
      "سقراط", "من هو سقراط", "من هوا سقراط", "الفيلسوف سقراط", "منهج سقراط",
      "التوليد السقراطي", "محاكمة سقراط", "اعرف نفسك بنفسك", "socrates", "who is socrates"
    ],
    ar: `**سقراط (Socrates - 470-399 ق.م)**:\n\nهو فيلسوف يوناني كلاسيكي من أثينا، ويُعتبر **أب الفلسفة الغربية والأخلاقية** وأحد أكثر الشخصيات تأثيراً في تاريخ الفكر البشري.\n\n` +
      `1. **منهجه الفلسفي (التوليد السقراطي - Socratic Method)**:\n` +
      `   • لم يؤلف سقراط أي كتب بنفسه، بل كانت فلسفته قائمة على **الحوار وطرح الأسئلة المتتالية** في شوارع وأسواق أثينا.\n` +
      `   • منهجه يبدأ بإظهار جهل المحاور وتناقض أفكاره (التهكم السقراطي)، ثم مساعدته على استخراج الحقيقة الكامنة في عقله، تماماً كما تساعد القابلة المرأة على الولادة (التوليد).\n\n` +
      `2. **أشهر مقولاته ومبادئه**:\n` +
      `   • *"اعرف نفسك بنفسك"* (Gnothi Seauton).\n` +
      `   • *"كل ما أعرفه هو أنني لا أعرف شيئاً"* (الاعتراف بالجهل كأول خطوة لاكتساب الحكمة الحقيقية).\n` +
      `   • *"الحياة التي لا تُفحص ولا تُراجع، لا تستحق أن تُعاش"*.\n\n` +
      `3. **محاكمته ونهايته المأساوية**:\n` +
      `   • اتهمته السلطات الأثينية بإفساد عقول الشباب وازدراء الآلهة التقليدية.\n` +
      `   • حُكم عليه بالإعدام بشرب سم الشوكران، وفضّل الموت على التراجع عن مبادئه الفلسفية.\n` +
      `   • خلد تلميذه العظيم **أفلاطون** أفكاره ومحاكمته في حواراته الفلسفية الشهيرة مثل "الدفاع" و"الجمهورية".`,
    en: `**Socrates (c. 470–399 BC)**:\n\nAn Athenian classical Greek philosopher credited as the founder of Western ethics and moral philosophy.\n\n` +
      `1. **The Socratic Method**: Dialogical questioning designed to expose underlying beliefs and contradictions, facilitating self-discovery.\n` +
      `2. **Core Philosophy**: Focused on virtue, self-examination ("The unexamined life is not worth living"), and intellectual humility ("I know that I know nothing").\n` +
      `3. **Trial & Legacy**: Sentenced to death by drinking hemlock on charges of corrupting youth and impiety. His teachings were preserved and immortalized by his student Plato.`
  },

  // 2. Cogito Ergo Sum (Descartes vs Socrates Clarification)
  {
    id: "cogito_descartes_socrates",
    tags: [
      "انا افكر اذا انا موجود", "انا افكر اذا انا موجود", "انا افكر انا موجود", "افكر اذا انا موجود",
      "نظرية سقراط انا افكر", "نظرية سقراط اذ انا افكر", "نظرية سقراط اذا انا افكر",
      "ديكارت", "رينيه ديكارت", "الكوجيتو", "cogito", "cogito ergo sum", "descartes", "rené descartes"
    ],
    ar: `**توضيح فلسفي مهم ورائع**:\n\nعبارة **"أنا أفكر، إذاً أنا موجود" (Cogito, ergo sum)** هي المبدأ الأشهر للفيلسوف الفرنسي **رينيه ديكارت (René Descartes)** (1596-1650م)، وليس الفيلسوف الإغريقي **سقراط**، وهو التباس شائع ومفهوم بين رواد الفلسفة!\n\n` +
      `1. **نظرية الشك الديكارتي (Cartesian Doubt)**:\n` +
      `   • أراد ديكارت تأسيس المعرفة البشرية على يقين مطلق لا يتطرق إليه الشك.\n` +
      `   • افترض الشك في كل شيء: في حواسه لأنها قد تخدعه (مثل الأحلام والسراب)، وفي وجود العالم المادي، وحتى في البديهيات الرياضية.\n\n` +
      `2. **لحظة اليقين الحاسمة (الكوجيتو - Cogito)**:\n` +
      `   • أدرك ديكارت أنه حتى لو كان يشك في كل شيء في الكون، فهناك حقيقة واحدة مستحيل الشك فيها: **أنه يشك!**\n` +
      `   • ولأن "الشك نوع من التفكير"، و"التفكير يستلزم بالضرورة وجود ذات مفكرة"، وصل إلى نتيجته الخالدة:\n` +
      `     👉 **"أنا أشك، إذاً أنا أفكر؛ وأنا أفكر، إذاً أنا موجود"**.\n\n` +
      `3. **الفرق بين سقراط وديكارت**:\n` +
      `   • **سقراط** (اليونان القديمة): ركّز على **الأخلاق والحوار وتطهير النفس** من الجهل المركب ("اعرف نفسك بنفسك").\n` +
      `   • **ديكارت** (عصر النهضة الحديث): ركّز على **نظرية المعرفة (Epistemology) والعقلانية** وأسس الفلسفة الحديثة والمنهج العلمي.`,
    en: `**Important Philosophical Clarification**:\n\nThe famous statement **"I think, therefore I am" (Cogito, ergo sum)** belongs to the French philosopher **René Descartes** (1596–1650), not **Socrates**.\n\n` +
      `1. **Methodological Doubt**: Descartes systematically doubted everything—sensory perceptions, reality, and physical forms—to find an indubitable truth.\n` +
      `2. **The Cogito**: He realized that the act of doubting itself proves the existence of a thinking entity. Doubting is thinking; thinking requires a thinker.\n` +
      `3. **Socrates vs Descartes**: Socrates pursued ethical wisdom via dialogical inquiry ("Know thyself"), while Descartes laid the epistemological groundwork for modern rationalism.`
  },

  // 3. Plato & The Allegory of the Cave
  {
    id: "plato_cave",
    tags: [
      "افلاطون", "من هو افلاطون", "مثل الكهف", "كهف افلاطون", "نظرية المثل",
      "المدينه الفاضله", "الجمهوريه افلاطون", "plato", "allegory of the cave", "theory of forms"
    ],
    ar: `**أفلاطون ونظرية المُثل ومثَل الكهف (Plato - 428-348 ق.م)**:\n\nتلميذ سقراط ومعلم أرسطو، ومؤسس "الأكاديمية" في أثينا وهي أول مؤسسة للتعليم العالي في العالم الغربي.\n\n` +
      `1. **نظرية المُثل (Theory of Forms)**:\n` +
      `   • يرى أفلاطون أن عالمنا المادي المحسوس هو مجرد **ظلال وصور ناقصة ومؤقتة** لعالم حقيقي مجرد وأبدي يسمى "عالم المُثل"، حيث توجد الحقائق الكاملة (الخير المطلق، العدالة التامة، الجمال الحقيقي).\n\n` +
      `2. **مثَل الكهف الشهير (Allegory of the Cave)**:\n` +
      `   • يتخيل سجناء مقيدين داخل كهف مظلم منذ طفولتهم، ينظرون فقط إلى جدار أمامي، وخلفهم نار تلقي بظلال تماثيل وأشياء تمر خلفهم.\n` +
      `   • يظن السجناء أن تلك الظلال هي الحقيقة الوحيدة.\n` +
      `   • حين يهرب أحدهم ويخرج لنور الشمس في الخارج، ينبهر بالحقيقة ويكتشف كم كان العالم المظلم مضللاً، وحين يعود لإنقاذ رفاقه في الكهف يسخرون منه وقد يحاولون قتله (إشارة لمصير معلمه سقراط).\n\n` +
      `3. **كتاب الجمهورية**:\n` +
      `   • رسم فيه ملامح الدولة العادلة المثالية التي يقودها "الفيلسوف الملك" العادل والحكيم.`,
    en: `**Plato & The Theory of Forms / Allegory of the Cave**:\n\nStudent of Socrates and founder of the Academy.\n\n` +
      `1. **Theory of Forms**: Distinguishes between the transient physical world and the transcendent realm of immutable ideals (Truth, Beauty, Justice).\n` +
      `2. **Allegory of the Cave**: Illustrates how humans mistake sensory perceptions (shadows on a cave wall) for true reality until liberated by philosophical enlightenment into sunlight.\n` +
      `3. **The Republic**: Envisions a harmonious society governed by Philosopher Kings.`
  },

  // 4. Aristotle & Logic / Ethics
  {
    id: "aristotle",
    tags: [
      "ارسطو", "من هو ارسطو", "المعلم الاول", "منطق ارسطو", "المنطق الصوري",
      "الوسط الذهبي", "aristotle", "who is aristotle"
    ],
    ar: `**أرسطو (Aristotle - 384-322 ق.م) - "المعلم الأول"**:\n\nتلميذ أفلاطون ومعلم الإسكندر الأكبر، وأحد أعمق العقول الموسوعية في التاريخ، حيث أسس علم المنطق، ودرس الفيزياء، الأحياء، الأخلاق، السياسة، والشعر.\n\n` +
      `1. **مؤسس المنطق الصوري (Formal Logic)**:\n` +
      `   • اخترع نظام **القياس المنطقي (Syllogism)** مثل:\n` +
      `     - مقدمة كبرى: كل إنسان فانٍ.\n` +
      `     - مقدمة صغرى: سقراط إنسان.\n` +
      `     - النتيجة الحتمية: إذاً سقراط فانٍ.\n\n` +
      `2. **أخلاق الفضيلة والوسط الذهبي (The Golden Mean)**:\n` +
      `   • اعتبر أن الفضيلة هي دائماً **وسط متزن بين رذيلتين** (إفراط وتفريط).\n` +
      `   • فالشجاعة مثلاً هي الوسط النبيل بين الجبن (تفريط) والتهور (إفراط)، والكرم وسط بين البخل والإسراف.\n\n` +
      `3. **الواقعية التجريبية**:\n` +
      `   • اختلف مع أفلاطون حول عالم المثل؛ إذ قال مقولته الشهيرة: *"أنا أحب أفلاطون، لكني أحب الحقيقة أكثر"*، مؤكداً أن المعرفة تبدأ من مراقبة الطبيعة والعالم الواقعي.`,
    en: `**Aristotle (384–322 BC) - "The First Teacher"**:\n\nStudent of Plato, tutor to Alexander the Great, and foundational polymath.\n\n` +
      `1. **Formal Logic & Syllogisms**: Created formal deductive reasoning.\n` +
      `2. **The Golden Mean**: Defined virtue as the balanced midpoint between two extremes of deficiency and excess (e.g., courage between cowardice and recklessness).\n` +
      `3. **Empirical Realism**: Argued that truth is grounded in the observation of physical reality.`
  },

  // 5. Islamic Philosophers (Avicenna, Averroes, Al-Farabi, Al-Ghazali)
  {
    id: "islamic_philosophy",
    tags: [
      "ابن سينا", "ابن رشد", "الفارابي", "الغزالي", "ابو حامد الغزالي", "فلسفه اسلاميه",
      "الفلسفه الاسلاميه", "avicenna", "averroes", "al-ghazali", "al-farabi"
    ],
    ar: `**رواد الفلسفة والحكمة في الحضارة الإسلامية**:\n\n1. **ابن سينا (Avicenna - 980-1037م)**:\n` +
      `   • "الشيخ الرئيس" وأعظم أطباء وفلاسفة العصر الذهبي. مؤلف كتاب "القانون في الطب" و"الشفاء".\n` +
      `   • قدّم تجربة **"الإنسان الطائر" (The Floating Man)** ليثبت أن الوعي بالذات والروح فطري ومستقل عن الحواس المادية.\n\n` +
      `2. **ابن رشد (Averroes - 1126-1198م)**:\n` +
      `   • "الشارح الأكبر" لأرسطو. دافع بقوة عن التوفيق بين الحكمة (العقل والفلسفة) والشريعة (الدين) في كتابه "فصل المقال"، وكان له تأثير عظيم في إشعال عصر النهضة والتنوير الأوروبي.\n\n` +
      `3. **أبو حامد الغزالي (Al-Ghazali - 1058-1111م)**:\n` +
      `   • "حجة الإسلام". مؤلف كتاب "تهافت الفلاسفة" الذي نقد فيه الميتافيزيقا الإغريقية ودعا للجمع بين عمق العقل واليقين القلبي والروحي في كتابه "المنقذ من الضلال".\n\n` +
      `4. **الفارابي (Al-Farabi - 872-950م)**:\n` +
      `   • "المعلم الثاني" بعد أرسطو. كتب عن "المدينة الفاضلة" ونظريات الموسيقى والمنطق والسياسة.`,
    en: `**Pioneers of Islamic Philosophy & Science**:\n\n` +
      `1. **Ibn Sina (Avicenna)**: Author of *The Canon of Medicine*; formulated the famous "Floating Man" thought experiment demonstrating innate self-consciousness.\n` +
      `2. **Ibn Rushd (Averroes)**: The Great Commentator on Aristotle; harmonized faith and philosophical reason in *Decisive Treatise*.\n` +
      `3. **Al-Ghazali**: Master theologian; critiqued classical metaphysics in *The Incoherence of the Philosophers* and pioneered spiritual epistemology.\n` +
      `4. **Al-Farabi**: "The Second Teacher"; pioneered political philosophy (*The Virtuous City*) and musical theory.`
  },

  // 6. Stoicism (Marcus Aurelius, Seneca, Epictetus)
  {
    id: "stoicism",
    tags: [
      "رواقيه", "الرواقيه", "ماركوس اوريليوس", "سينيكا", "ايبيكتيتوس", "stoicism", "marcus aurelius", "seneca", "epictetus"
    ],
    ar: `**الفلسفة الرواقية (Stoicism)**:\n\nمدرسة فلسفية عملية نشأت في اليونان القديمة وازدهرت في روما، وتهدف إلى تحقيق **السلام النفسي والصلابة الذهنية** في مواجهة تحديات الحياة.\n\n` +
      `1. **دائرة التحكم (Dichotomy of Control)**:\n` +
      `   • تنقسم أمور الحياة إلى نوعين:\n` +
      `     - **أمور تحت سيطرتك الكاملة**: أفكارك، قراراتك، ردود أفعالك، أخلاقك، وجهدك.\n` +
      `     - **أمور خارج سيطرتك**: تصرفات الآخرين، الماضي، تقلبات الحظ، والطقس.\n` +
      `   • الحكمة تكمن في توجيه 100% من طاقتك لما تستطيع التحكم فيه، وتقبل ما لا يد لك فيه بهدوء.\n\n` +
      `2. **أشهر أعلام الرواقية**:\n` +
      `   • **ماركوس أوريليوس**: الإمبراطور الروماني الفيلسوف، صاحب كتاب "التأملات" (Meditations).\n` +
      `   • **سينيكا**: رجل الدولة والحكيم، ركز على إدارة الغضب وقصر الحياة.\n` +
      `   • **إبيكتيتوس**: العبد السابق الذي صار معلماً للحرية النفسية ("ليس ما يحدث لك هو ما يؤذيك، بل طريقة تفسيرك لما يحدث").`,
    en: `**Stoicism**:\n\nA Greco-Roman philosophy cultivating emotional resilience, virtue, and inner tranquility.\n\n` +
      `1. **Dichotomy of Control**: Distinguishes between internal mastery (beliefs, actions, attitudes) and external inevitabilities (other people, outcomes).\n` +
      `2. **Key Figures**: Marcus Aurelius (*Meditations*), Seneca, and Epictetus.`
  },

  // 7. Nietzsche & Nihilism / Ubermensch
  {
    id: "nietzsche",
    tags: [
      "نيتشه", "فريدريك نيتشه", "فريدريش نيتشه", "الانسان الاعلى", "اراده القوه", "العدميه", "nietzsche", "ubermensch"
    ],
    ar: `**فريدريش نيتشه (Friedrich Nietzsche - 1844-1900م)**:\n\nفيلسوف ألماني ثوري أحدث زلزالاً في الفلسفة الغربية بنقده الجذري للأخلاق التقليدية والميتافيزيقا:\n\n` +
      `1. **مفهوم "الإنسان الأعلى" (Übermensch)**:\n` +
      `   • دعا الإنسان إلى تجاوز الضعف والتبعية وصناعة قيمه الخاصة وشخصيته المستقلة بإرادة قوية وشجاعة.\n\n` +
      `2. **إرادة القوة (Will to Power)**:\n` +
      `   • اعتبر أن الدافع الأساسي للكائنات الحية ليس مجرد البقاء، بل التطور والتفوق والتأثير وخلق المعنى.\n\n` +
      `3. **العود الأبدي (Eternal Recurrence)**:\n` +
      `   • تجربة فكرية تسأل: "إذا قُدّر لك أن تعيش حياتك بكل تفاصيلها وأفراحها وآلامها مكررة إلى ما لا نهاية، فهل ستحتفي بها؟" (دعوة لحب الحياة بملئها - Amor Fati).`,
    en: `**Friedrich Nietzsche (1844–1900)**:\n\nGerman philosopher who challenged traditional metaphysics and morality.\n\n` +
      `1. **The Übermensch (Overman)**: Self-actualized individual who overcomes nihilism and creates autonomous values.\n` +
      `2. **Will to Power**: The primary driving force in human psychology and growth.\n` +
      `3. **Amor Fati & Eternal Recurrence**: Embracing one's life unconditionally in all its trials and triumphs.`
  },

  // 8. Immanuel Kant & Categorical Imperative
  {
    id: "kant",
    tags: ["كانط", "ايمانويل كانط", "الواجب الاخلاقي", "نقد العقل الخالص", "kant", "immanuel kant"],
    ar: `**إيمانويل كانط (Immanuel Kant - 1724-1804م)**:\n\nعملاق الفلسفة الألمانية وفلسفة التنوير ومؤلف "نقد العقل الخالص":\n\n` +
      `1. **الواجب الأخلاقي المطلق (Categorical Imperative)**:\n` +
      `   • صاغ قانونه الأخلاقي الشهير: *"تصرّف دائماً بحيث يمكن للمبدأ الذي تبني عليه تصرفك أن يصبح قانوناً عاماً ينطبق على كل البشرية"*\n` +
      `   • ومبدأه الإنساني: *"عامل الإنسان دائماً كغاية في حد ذاته، ولا تعامله أبداً كمجرد وسيلة لتحقيق غاية"*\n\n` +
      `2. **نظرية المعرفة الكانطية**:\n` +
      `   • وفّق بين العقلانية (العقل) والتجريبية (الحواس)، مبيناً أن الحواس تقدم المادة الخام للمعرفة بينما يقوم العقل بتنظيمها في قوالب الزمان والمكان والمقولات الذهنية.`,
    en: `**Immanuel Kant (1724–1804)**:\n\nGerman Enlightenment philosopher.\n\n` +
      `1. **Categorical Imperative**: Act only according to maxims you would will to become universal laws, and treat humans as ends in themselves.\n` +
      `2. **Transcendental Idealism**: Synthesized rationalism and empiricism—sensory inputs structured by innate cognitive frameworks.`
  },

  // =========================================================================
  // SCIENCE, PHYSICS & ASTRONOMY
  // =========================================================================

  // 9. Quantum Physics & Computing
  {
    id: "quantum_physics",
    tags: ["كموم", "كمومي", "كوانتم", "quantum", "الحوسبه الكموميه", "حوسبه كموميه", "فيزياء الكم", "ميكانيكا الكم", "التشابك الكمي"],
    ar: `**الحوسبة الكمومية وميكانيكا الكم (Quantum Computing & Mechanics)**:\n\n1. **البت التقليدي مقابل الكيوبت (Qubit)**:\n` +
      `   • الحواسيب الكلاسيكية تستخدم "البت" (Bit) الذي يكون إما 0 أو 1.\n` +
      `   • الحواسيب الكمومية تستخدم "الكيوبت" (Qubit) الذي يمكن أن يكون 0 و 1 في نفس الوقت بفضل **التراكب الكمي (Superposition)**.\n\n` +
      `2. **الظواهر الكمومية الأساسية**:\n` +
      `   • **التراكب (Superposition)**: قدرة الجسيم على التواجد في حالات احتمالية متزامنة حتى لحظة القياس.\n` +
      `   • **التشابك الكمي (Quantum Entanglement)**: ترابط جسيمين كموميين بحيث يؤثر قياس أحدهما لحظياً على الآخر مهما بعدت المسافة، وهو ما سماه أينشتاين "فعل شبحي عن بعد".\n\n` +
      `3. **التطبيقات الثورية**:\n` +
      `   • محاكاة الجزيئات لتطوير أدوية جديدة فائقة الفعالية وتصميم بطاريات خارقة.\n` +
      `   • حل المسائل اللوجستية والتحسين الرياضي والتشفير في ثوانٍ معدودة.`,
    en: `**Quantum Computing & Mechanics**:\n\n` +
      `1. **Qubits vs Bits**: Classical bits are strictly 0 or 1; quantum qubits leverage superposition to represent linear combinations of both states simultaneously.\n` +
      `2. **Superposition & Entanglement**: Entangled particles instantly correlate states regardless of spatial separation.\n` +
      `3. **Real-world Applications**: Molecular simulation for medicine, logistics optimization, and quantum cryptography.`
  },

  // 10. Time Travel & Wormholes
  {
    id: "time_travel",
    tags: ["سفر عبر الزمن", "السفر عبر الزمن", "سفر بالزمن", "السفر بالزمن", "اله الزمن", "time travel", "ثقب دودي", "ثقوب دوديه", "الثقوب الدوديه", "الثقب الدودي", "ثقوب دودية", "الثقوب الدودية", "wormhole", "wormholes"],
    ar: `**السفر عبر الزمن والثقوب الدودية في ميزان الفيزياء**:\n\n1. **السفر إلى المستقبل (حقيقة علمية مثبتة)**:\n` +
      `   • وفقاً للنظرية النسبية لأينشتاين، كلما اقتربت سرعتك من سرعة الضوء، أو كلما تواجدت في حقل جاذبية شديد (قرب ثقب أسود)، تباطأ مرور الزمن بالنسبة لك مقارنة بالآخرين (**تمدد الزمن - Time Dilation**).\n` +
      `   • رواد الفضاء اليوم يسافرون إلى المستقبل بأجزاء من الثانية!\n\n` +
      `2. **السفر إلى الماضي (معقد ونظري)**:\n` +
      `   • يتطلب إما التحرك أسرع من الضوء (وهو مستحيل لأي كتلة)، أو وجود **ثقوب دودية (Wormholes / جسور أينشتاين-روزين)** تربط نقطتين متباعدتين في نسيج الزمكان.\n` +
      `   • **معضلة الجد (Grandfather Paradox)**: إحدى أبرز المفارقات التي تُفسر بفرضية العوالم المتعددة (Multiverse) حيث ينتقل المسافر إلى خط زمني بديل دون التأثير على ماضيه الأصلي.\n\n` +
      `3. **هل الثقوب الدودية ممكنة؟**:\n` +
      `   • هي حلول رياضية صحيحة لمعادلات النسبية العامة، لكنها تحتاج إلى "طاقة سالبة" ومادة غريبة لتبقى مستقرة دون أن تنهار فورياً.`,
    en: `**Time Travel & Wormholes**:\n\n` +
      `1. **Forward Time Travel**: Proven via relativistic time dilation (high velocity or intense gravitational fields).\n` +
      `2. **Backward Travel & Paradoxes**: Theoretically necessitates traversable wormholes (Einstein-Rosen bridges) or closed timelike curves, resolving causality dilemmas via multiverse branches.\n` +
      `3. **Wormhole Physics**: Valid general relativity solutions requiring exotic matter with negative energy density to remain stable.`
  },

  // 11. Black Holes & Event Horizon
  {
    id: "black_holes",
    tags: ["ثقب اسود", "الثقب الاسود", "الثقوب السوداء", "افق الحدث", "التفرد", "black hole", "black holes", "event horizon"],
    ar: `**الثقوب السوداء (Black Holes)**:\n\n1. **ما هو الثقب الأسود؟**:\n` +
      `   • منطقة في الفضاء تتركز فيها كتلة هائلة في نقطة متناهية الصغر تسمى **نقطة التفرد (Singularity)**، مما يولد جاذبية ساحقة لا يمكن لأي شيء—حتى الضوء—الهروب منها.\n\n` +
      `2. **أفق الحدث (Event Horizon)**:\n` +
      `   • هو "نقطة اللاعودة" المحيطة بالثقب الأسود. أي جسم أو شعاع ضوئي يعبر هذا الحد يسقط حتماً إلى المركز.\n\n` +
      `3. **كيف تتشكل؟**:\n` +
      `   • تنشأ عند موت النجوم العملاقة بعد نفاد وقودها النووي، حيث تنفجر في مستعر أعظم (Supernova) ثم ينهار قلبها على نفسه.\n\n` +
      `4. **تمدد الزمن قرب الثقب الأسود**:\n` +
      `   • بسبب شدة الجاذبية، يمر الزمن ببطء شديد بالقرب منه مقارنة بالمراقب البعيد.`,
    en: `**Black Holes**:\n\n` +
      `1. **Singularity**: Infinitely dense point where spacetime curvature becomes extreme.\n` +
      `2. **Event Horizon**: The boundary threshold beyond which nothing, not even light, can escape.\n` +
      `3. **Formation**: Stellar collapse following supernova explosions of supermassive stars.\n` +
      `4. **Gravitational Time Dilation**: Clocks near a black hole tick significantly slower relative to distant observers.`
  },

  // 12. Big Bang & Cosmic Microwave Background
  {
    id: "big_bang",
    tags: ["الانفجار العظيم", "نشاه الكون", "بدايه الكون", "اشعاع الخلفيه الكونيه", "big bang", "cmb"],
    ar: `**نظرية الانفجار العظيم (The Big Bang Theory)**:\n\nالنموذج العلمي الرائد الذي يفسر نشأة وتطور الكون قبل حوالي **13.8 مليار سنة**:\n\n` +
      `• لم يكن انفجاراً لمادة في فضاء موجود مسبقاً، بل كان **انبثاقاً وتمدداً فائق السرعة للزمان والمكان والطاقة والمادة معاً** من حالة أولية شديدة الحرارة والكثافة.\n\n` +
      `**أهم الأدلة العلمية المؤكدة للنظرية**:\n` +
      `1. **تمدد الكون المستمر**: اكتشاف هابل بأن المجرات تتباعد عنا في كل الاتجاهات.\n` +
      `2. **إشعاع الخلفية الكونية الميكروي (CMB)**: صدى الحرارة والضوء المتبقي من اللحظات الأولى بعد نشأة الكون، ويمكن رصده في كل أرجاء السماء.\n` +
      `3. **وفرة العناصر الأولية**: تطابق نسب الهيدروجين (~75%) والهيليوم (~25%) في الكون مع حسابات الدقائق الأولى للانفجار.`,
    en: `**The Big Bang Theory**:\n\nThe prevailing cosmological paradigm showing the universe originated ~13.8 billion years ago from an ultra-dense singularity, expanding space, time, and matter into existence. Backed by Hubble expansion, the Cosmic Microwave Background (CMB), and primordial element abundance.`
  },

  // 13. Superstring Theory & Multiverse
  {
    id: "string_theory",
    tags: ["نظريه الاوتار", "الاوتار الفائقه", "string theory", "العوالم المتعدده", "multiverse", "نظريه كل شيء"],
    ar: `**نظرية الأوتار الفائقة (Superstring Theory)**:\n\n1. **الفكرة الجوهرية**:\n` +
      `   • تفترض أن الجسيمات الأولية في الكون (كالكواركات والإلكترونات) ليست نقاطاً صلبة، بل هي **أوتار طاقة متناهية الصغر تهتز بترددات مختلفة**، ونوع الجسيم وكتلته يتحددان بنمط اهتزاز الوتر (تماما كنغمات أوتار العود أو الكمان).\n\n` +
      `2. **نظرية كل شيء (Theory of Everything)**:\n` +
      `   • تسعى لتوحيد فيزياء الكم (العالم الذري) مع النسبية العامة (الجاذبية والأجرام الكونية) في إطار رياضي موحد.\n\n` +
      `3. **الأبعاد الإضافية**:\n` +
      `   • تتطلب النظرية وجود **10 أو 11 بُعداً** للزمكان، معظمها أبعاد منطوية متناهية الصغر لا ندركها بحواسنا المباشرة.`,
    en: `**Superstring Theory**:\n\nPostulates fundamental particles are 1D vibrating strings of energy whose vibrational modes generate mass and quantum charge. A candidate Theory of Everything unifying quantum mechanics and gravity, requiring 10-11 spacetime dimensions.`
  },

  // 14. Why is the sky blue?
  {
    id: "sky_blue",
    tags: ["السماء زرقاء", "زرقه السماء", "ليش السماء زرقاء", "لماذا السماء زرقاء", "sky blue", "rayleigh scattering"],
    ar: `**لماذا نرى السماء باللون الأزرق؟ (تشتت رايلي - Rayleigh Scattering)**:\n\n1. ضوء الشمس يبدو أبيض، لكنه يتكون من جميع ألوان الطيف المرئي، ولكل لون طول موجي وتردد مختلف.\n` +
      `2. الضوء الأزرق والبنفسجي يمتلكان **أقصر أطوال موجية** وأعلى طاقة وتردد.\n` +
      `3. عندما يعبر ضوء الشمس الغلاف الجوي، تصطدم هذه الموجات القصيرة بجزيئات الغازات (كالنيتروجين والأكسجين) وتتشتت في كل الاتجاهات في السماء بدرجة أكبر بكثير من الألوان ذات الموجات الطويلة (كالأحمر والأصفر).\n` +
      `4. ولأن أعين البشر أكثر حساسية للون الأزرق، نرى قبة السماء نهاراً بلونها الأزرق الصافي البديع!`,
    en: `**Why the Sky is Blue (Rayleigh Scattering)**:\n\nShorter blue wavelengths from solar light scatter vigorously across nitrogen and oxygen molecules in Earth's atmosphere compared to longer red wavelengths. Human retina cones are more receptive to blue than violet, perceiving the atmosphere as vivid blue.`
  },

  // 15. How Rocket Engines Work
  {
    id: "rocket_engines",
    tags: ["محركات الصواريخ", "محرك صاروخي", "كيف يعمل الصاروخ", "rocket engine", "rocket propulsion", "دفع الصواريخ"],
    ar: `**كيف تعمل محركات الصواريخ في الفضاء؟**:\n\nتعمل الصواريخ تطبيقاً لـ **قانون نيوتن الثالث للحركة**: *"لكل فعل رد فعل مساوٍ له في المقدار ومضاد له في الاتجاه"*.\n\n` +
      `1. **الوقود والمؤكسد**: يحمل الصاروخ معه الوقود (كالهيدروجين السائل أو الميثان أو الكيروسين) والمؤكسد (الأكسجين السائل) لأن الفضاء خالٍ من الأكسجين.\n` +
      `2. **الاحتراق والتسارع**: يشتعل الخليط تحت ضغط هائل في حجرة الاحتراق وتندفع الغازات الساخنة عبر الفوهة (De Laval Nozzle) بسرعات تفوق سرعة الصوت.\n` +
      `3. **قوة الدفع (Thrust)**: اندفاع الغازات الهائل نحو الخلف يولد قوة دفع تدفع الصاروخ للأمام في الفراغ دون الحاجة إلى هواء يستند إليه!`,
    en: `**Rocket Propulsion Mechanics**:\n\nBased on Newton's Third Law. Rockets carry internal propellant (fuel + liquid oxygen oxidizer) burned under high pressure, venting exhaust through convergent-divergent nozzles at supersonic speeds to generate forward thrust in vacuum.`
  },

  // =========================================================================
  // COMPUTER SCIENCE & ARTIFICIAL INTELLIGENCE
  // =========================================================================

  // 16. AI vs Machine Learning vs Deep Learning
  {
    id: "ai_vs_ml_vs_dl",
    tags: ["ذكاء اصطناعي", "تعلم الاله", "تعلم الي", "تعلم عميق", "ai", "machine learning", "deep learning", "الفرق بين الذكاء الاصطناعي"],
    ar: `**الفرق بين الذكاء الاصطناعي، تعلم الآلة، والتعلم العميق**:\n\n` +
      `1. **الذكاء الاصطناعي (AI)**: المظلة الكبرى؛ قدرة الحواسيب والأنظمة على محاكاة التفكير البشري، التحليل، التعلم، واتخاذ القرارات.\n` +
      `2. **تعلم الآلة (Machine Learning)**: فرع من الذكاء الاصطناعي يمكّن البرمجيات من التعلم الذاتي من البيانات وتحسين دقتها دون برمجة يدوية مباشرة لكل سيناريو.\n` +
      `3. **التعلم العميق (Deep Learning)**: فرع متقدم من تعلم الآلة يعتمد على **الشبكات العصبية الاصطناعية متعددة الطبقات (Deep Neural Networks)** المستوحاة من خلايا الدماغ، وهو التقنية المسؤولة عن ثورة النماذج اللغوية (مثل Gemini) وتوليد الصور والرؤية الحاسوبية.`,
    en: `**AI vs Machine Learning vs Deep Learning**:\n\n` +
      `1. **AI**: Broad field enabling machines to emulate human cognitive logic.\n` +
      `2. **Machine Learning**: Algorithms learning patterns autonomously from data.\n` +
      `3. **Deep Learning**: Specialized subset utilizing multi-layered artificial neural networks powering modern generative AI (LLMs, vision models).`
  },

  // 17. Time Management & Effective Study Methods
  {
    id: "study_time_management",
    tags: ["تنظيم الوقت", "كيف انظم وقتي", "دراسه", "الدراسه", "كيف ادرس", "time management", "pomodoro", "بومودورو", "جدول دراسي"],
    ar: `**أفضل تقنيات تنظيم الوقت والدراسة الفعالة**:\n\n` +
      `1. **تقنية بومودورو (Pomodoro Technique)**: ادرس بتركيز تام لمدة 25 دقيقة، تليها استراحة 5 دقائق. بعد 4 جلسات خذ استراحة طويلة (20-30 دقيقة).\n` +
      `2. **الاسترجاع النشط (Active Recall)**: اختبر نفسك بالأسئلة واشرح المفاهيم بكلماتك بدون النظر للملخصات لتنشيط الروابط العصبية.\n` +
      `3. **التكرار المتباعد (Spaced Repetition)**: راجع المعلومات بعد يوم، ثم 3 أيام، ثم أسبوع، ثم شهر لترسيخها في الذاكرة طويلة المدى.\n` +
      `4. **مصفوفة أيزنهاور للأولويات**: قسّم مهامك إلى: عاجل ومهم (ابدأ فوراً)، مهم وغير عاجل (خطط له)، غير مهم (فوضه أو احذفه).`,
    en: `**Productivity & Study Strategies**:\n\n` +
      `1. **Pomodoro Method**: 25m focus sprint + 5m pause.\n` +
      `2. **Active Recall**: Testing yourself rather than passive re-reading.\n` +
      `3. **Spaced Repetition**: Graduated intervals to solidify neural retention.\n` +
      `4. **Eisenhower Matrix**: Prioritizing tasks across urgency/importance axes.`
  },

  // 18. Existentialism
  {
    id: "existentialism",
    tags: ["وجوديه", "الوجوديه", "فلسفه الوجوديه", "existentialism", "سارتر", "كامو", "نيتشه"],
    ar: `**الفلسفة الوجودية (Existentialism)**:\n\nفلسفة تركز على حرية الإنسان ومسؤوليته في صناعة معنى حياته:\n\n` +
      `1. **"الوجود يسبق الماهية" (سارتر)**: يولد الإنسان أولاً، ومن خلال اختياراته وأفعاله الحرة يصنع هويته وقيمته.\n` +
      `2. **الحرية والمسؤولية التامة**: أنت حر بالكامل، لكن هذه الحرية تعني تحملك المسؤولية الكاملة عن عواقب اختياراتك.\n` +
      `3. **مواجهة العبثية (كامو)**: العيش بشجاعة وإبداع وخلق المعنى الخاص في عالم غامض وصامت.`,
    en: `**Existentialism**:\n\nFocuses on human agency and authenticity. "Existence precedes essence" (Sartre)—humans define themselves through autonomous choices, embracing radical responsibility.`
  }
];
