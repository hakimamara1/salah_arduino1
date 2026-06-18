/**
 * Single source of truth for all landing-page copy (Arabic / RTL).
 *
 * The page supports 5 conversion-tested directions from the wireframe.
 * Each is a "landing variant" selectable via the `?v=` query param so the same
 * page can be A/B tested across different Facebook ad sets — the chosen variant
 * is saved with every order for attribution.
 *
 *   A · Photo-First Classic      (default, "safe, proven")
 *   B · Offer-Led                (price box + trust front and center)
 *   C · Story Scroll             (full-bleed editorial hero)
 *   D · For Parents              (turn screen-time into a real skill)
 *   E · Secure Their Future      (emotional, future-driven, urgency)
 */

export const VARIANT_IDS = ["A", "B", "C", "D", "E"] as const;
export type VariantId = (typeof VARIANT_IDS)[number];
export const DEFAULT_VARIANT: VariantId = "A";

export function normalizeVariant(value: string | undefined | null): VariantId {
  const upper = (value ?? "").toUpperCase();
  return (VARIANT_IDS as readonly string[]).includes(upper)
    ? (upper as VariantId)
    : DEFAULT_VARIANT;
}

/* ── Shared product facts (identical across all variants) ─────────────── */

export const PRODUCT = {
  name: "عدة الأردوينو التعليمية الكاملة",
  brand: "Arduino Shop",
  sku: "ARD-STARTER-22",
  price: 10000,
  compareAtPrice: 14000,
  currency: "DZD",
  projectsCount: 22,
} as const;

export const TRUST_BADGES = [
  { icon: "🚚", label: "توصيل لكل الولايات" },
  { icon: "💵", label: "الدفع عند الاستلام" },
  { icon: "🎓", label: "منتج تعليمي" },
  { icon: "👍", label: "مناسب للمبتدئين" },
] as const;

export const BENEFITS = [
  "لوحة أردوينو مضمّنة",
  "كتاب دليل للمبتدئين",
  "٢٢ مشروعاً عملياً",
  "جميع المكوّنات مضمّنة",
  "لا تحتاج خبرة سابقة",
] as const;

export type Project = {
  title: string;
  level: "سهل" | "متوسط" | "متقدّم";
  skills: string;
};

export const PROJECTS: Project[] = [
  { title: "إشارة المرور", level: "سهل", skills: "LED · التوقيت · المنطق" },
  { title: "جهاز قياس المسافة", level: "متوسط", skills: "حسّاس · شاشة · برمجة" },
  { title: "جهاز إنذار", level: "متوسط", skills: "حسّاس حركة · صوت" },
  { title: "شاشة LCD", level: "سهل", skills: "عرض · نصوص · أزرار" },
  { title: "محطة طقس", level: "متوسط", skills: "حرارة · رطوبة · بيانات" },
  { title: "ذراع آلية", level: "متقدّم", skills: "سيرفو · تحكّم · حركة" },
];

export const INCLUDED_ITEMS = [
  "Arduino UNO",
  "Breadboard",
  "شاشة LCD",
  "Servo",
  "حسّاسات متنوّعة",
  "أسلاك وموصّلات",
  "مقاومات و LED",
  "كتاب الدليل",
] as const;

export const COMPARISON = {
  others: {
    title: "عدّات أخرى",
    points: ["مكوّنات فقط", "بلا مسار تعلّم", "دروس عشوائية", "صعبة للمبتدئ"],
  },
  ours: {
    title: "عدّتنا",
    points: ["مكوّنات كاملة", "كتاب دليل", "تعلّم منظّم", "٢٢ مشروعاً"],
  },
} as const;

export const LEARNING_PATH = [
  "أساسيات الأردوينو",
  "المكوّنات الإلكترونية",
  "أول برنامج لك",
  "الحسّاسات والقراءات",
  "مشاريع متكاملة",
  "مهارات هندسية تدوم",
] as const;

export const WHAT_YOU_LEARN = [
  "برمجة أردوينو",
  "أساسيات الإلكترونيات",
  "الحسّاسات",
  "تصميم الدوائر",
] as const;

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "بدأت من الصفر تماماً، وخلال أسبوع بنيت أول مشروع يعمل. الكتاب يشرح كل خطوة بوضوح.",
    name: "أمين",
    role: "طالب",
  },
  {
    quote:
      "اشتريتها لابني وصار يقضي وقته في بناء المشاريع بدل الألعاب. أفضل استثمار.",
    name: "سارة",
    role: "ولية أمر",
  },
  {
    quote: "جودة المكوّنات ممتازة والتوصيل كان سريعاً. أنصح بها كل مبتدئ.",
    name: "ياسين",
    role: "هاوي إلكترونيات",
  },
];

export type Faq = { q: string; a: string };

export const FAQ: Faq[] = [
  {
    q: "هل أحتاج خبرة برمجية مسبقة؟",
    a: "لا إطلاقاً. العدة مصمّمة للمبتدئين تماماً، والكتاب يأخذ بيدك خطوة بخطوة من أول مصباح حتى المشاريع المتقدّمة.",
  },
  {
    q: "هل كل المكوّنات مضمّنة في العلبة؟",
    a: "نعم. تحصل على لوحة الأردوينو، اللوحة التجريبية، الحسّاسات، الشاشة، الأسلاك، وكل ما تحتاجه لإنجاز الـ٢٢ مشروعاً.",
  },
  {
    q: "هل تصلح لمبتدئ تماماً؟",
    a: "بالتأكيد. الترتيب يبدأ من المفاهيم الأبسط ويتدرّج تلقائياً، فلا تشعر بأي صعوبة في البداية.",
  },
  {
    q: "هل توصّلون لكل الولايات؟",
    a: "نعم، نوصّل إلى كل الولايات الـ٥٨، والدفع يتم عند الاستلام بدون أي دفع مسبق.",
  },
  {
    q: "ما السن المناسب؟",
    a: "مناسبة من عمر ٩ سنوات فما فوق، وللكبار والمبتدئين الراغبين في تعلّم الإلكترونيات والبرمجة.",
  },
];

/* ── Variant-specific framing ────────────────────────────────────────── */

export type VariantContent = {
  id: VariantId;
  name: string;
  /** Optional top announcement bar (B & E). */
  announcement?: string;
  /** Small pill next to the logo (D & E). */
  headerPill?: string;
  hero: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    /** chips under the title (D & E) */
    chips?: string[];
    primaryCta: string;
    /** alt text + caption for the hero image slot */
    imageAlt: string;
    /** "classic" => image left of copy on desktop; "full" => full-bleed overlay */
    layout: "classic" | "full";
  };
  orderFormTitle: string;
  finalCta: {
    title: string;
    subtitle: string;
    cta: string;
    dark?: boolean;
  };
  stickyCta: string;
};

export const VARIANTS: Record<VariantId, VariantContent> = {
  A: {
    id: "A",
    name: "Photo-First Classic",
    hero: {
      eyebrow: "عدة تعليمية متكاملة",
      title: "تعلّم الأردوينو من الصفر وابنِ ٢٢ مشروعاً حقيقياً",
      subtitle:
        "كل ما تحتاجه في علبة واحدة: لوحة أردوينو، مكوّنات كاملة، وكتاب دليل يأخذ بيدك خطوة بخطوة.",
      primaryCta: "🛒 اطلب الآن",
      imageAlt: "عدة الأردوينو التعليمية الكاملة",
      layout: "classic",
    },
    orderFormTitle: "أكمل طلبك الآن",
    finalCta: {
      title: "ابدأ رحلتك مع الأردوينو اليوم",
      subtitle: "ابنِ ٢٢ مشروعاً وتعلّم الإلكترونيات عملياً",
      cta: "🛒 اطلب الآن",
    },
    stickyCta: "اطلب الآن",
  },
  B: {
    id: "B",
    name: "Offer-Led",
    announcement: "🔥 عرض محدود · توصيل لكل الولايات",
    hero: {
      eyebrow: "العرض أولاً",
      title: "تعلّم الأردوينو وابنِ ٢٢ مشروعاً",
      subtitle: "السعر شامل التوصيل · الدفع عند الاستلام بدون دفع مسبق.",
      primaryCta: "🛒 اطلب الآن",
      imageAlt: "عدة الأردوينو التعليمية الكاملة",
      layout: "classic",
    },
    orderFormTitle: "اطلب في دقيقة",
    finalCta: {
      title: "ابدأ رحلتك مع الأردوينو اليوم",
      subtitle: "عرض محدود — جودة مضمونة ودفع عند الاستلام",
      cta: "🛒 اطلب الآن",
    },
    stickyCta: "اطلب الآن",
  },
  C: {
    id: "C",
    name: "Story Scroll",
    hero: {
      title: "تعلّم الأردوينو من الصفر وابنِ ٢٢ مشروعاً",
      subtitle: "رحلة عملية من أول مصباح تضيئه حتى مشاريع ذكية كاملة.",
      primaryCta: "🛒 اطلب الآن",
      imageAlt: "عدة الأردوينو التعليمية الكاملة بإضاءة احترافية",
      layout: "full",
    },
    orderFormTitle: "اطلب الآن — دفع عند الاستلام",
    finalCta: {
      title: "ابدأ رحلتك مع الأردوينو اليوم",
      subtitle: "ابنِ ٢٢ مشروعاً وتعلّم الإلكترونيات عملياً",
      cta: "🛒 اطلب الآن",
      dark: true,
    },
    stickyCta: "اطلب الآن",
  },
  D: {
    id: "D",
    name: "For Parents",
    headerPill: "للأهل 👨‍👩‍👧",
    hero: {
      eyebrow: "موجّه للأب والأم",
      title: "حوّل وقت طفلك أمام الشاشة إلى مهارة تدوم مدى الحياة",
      subtitle:
        "هدية تعليمية تبني عقل المهندس — بدل اللعب، يصنع طفلك مشاريع حقيقية بيديه.",
      chips: ["👦 مناسب من ٩ سنوات", "🎓 منتج تعليمي معتمد"],
      primaryCta: "🎁 اطلب هدية طفلك الآن",
      imageAlt: "طفل يبني مشروع أردوينو ويبتسم",
      layout: "classic",
    },
    orderFormTitle: "اطلب هدية طفلك — دفع عند الاستلام",
    finalCta: {
      title: "اصنع من طفلك مهندس الغد",
      subtitle: "استثمار صغير اليوم في مهارة تبقى معه للأبد.",
      cta: "🎁 اطلب الآن",
    },
    stickyCta: "اطلب لطفلك",
  },
  E: {
    id: "E",
    name: "Secure Their Future",
    announcement: "⏳ عالم الغد للمبرمجين والمهندسين — جهّز طفلك من اليوم",
    headerPill: "للأهل 👨‍👩‍👧",
    hero: {
      eyebrow: "أنقذ المستقبل",
      title: "أنقذ مستقبل أطفالك قبل فوات الأوان",
      subtitle:
        "المهارات التقنية لم تعد رفاهية. امنح طفلك السبق الذي سيشكرك عليه طوال حياته.",
      chips: ["🚀 مهارات المستقبل", "🧠 تفكير هندسي"],
      primaryCta: "🚀 ابدأ مستقبل طفلك الآن",
      imageAlt: "طفل واثق يمسك مشروعه التقني",
      layout: "classic",
    },
    orderFormTitle: "احجز مستقبل طفلك — دفع عند الاستلام",
    finalCta: {
      title: "لا تدع مستقبل طفلك للصدفة",
      subtitle: "قرار اليوم يصنع مهندس الغد — ابدأ الآن.",
      cta: "🚀 اطلب الآن",
      dark: true,
    },
    stickyCta: "ابدأ مستقبله",
  },
};

export function getVariant(id: VariantId): VariantContent {
  return VARIANTS[id];
}
