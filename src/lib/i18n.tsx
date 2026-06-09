import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "EN" | "FA";

const STORAGE_KEY = "lumen.lang";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.exhibitions": "Exhibitions",
  "nav.hall": "The Hall",
  "nav.artists": "Artists",
  "nav.collection": "Collection",
  "nav.films": "Films",
  "nav.support": "Support",
  "nav.contact": "Contact",
  "nav.protect": "IP Protection",

  "hero.eyebrow": "Inaugural Exhibition · Now on View",
  "hero.title.1": "Ali Shahidi",
  "hero.title.2": "Solo Exhibition",
  "hero.lead":
    "A focused exhibition of Ali Shahidi's paintings, sculptures, photography and mixed media, arranged across a small number of floors.",
  "hero.cta.enter": "View the Exhibition",
  "hero.cta.walk": "Explore the Floors",

  "artist.eyebrow": "Artist in Focus",
  "artist.name": "Ali Shahidi",
  "artist.quote": "“I work in the hour before language — across paint, stone, photograph and word.”",
  "artist.bio.1":
    "Born in Iran and working between Tehran and Paris, Ali Shahidi moves freely across painting, sculpture, photography and craft. His practice traces a single thread — the moment a feeling becomes a form — through whichever medium will hold it.",
  "artist.bio.2":
    "LUMEN gathers his work across four floors, alongside invited contemporary artists who share that same quiet ambition.",
  "artist.works": "Works",
  "artist.years": "Years",
  "artist.floors": "Floors",
  "artist.cta": "Open Full Monograph →",

  "hall.eyebrow": "The Architecture",
  "hall.title.1": "Four Floors,",
  "hall.title.2": "One Continuous Walk",
  "hall.lead":
    "LUMEN is built as a virtual gallery you can wander — four floors gathered around a single luminous atrium, each dedicated to a different facet of the work.",
  "hall.cta": "Begin the Walkthrough",

  "floors.1.name": "Floor I — Paintings",
  "floors.1.desc": "Canvases on memory, calligraphy and light",
  "floors.1.count": "42 works",
  "floors.2.name": "Floor II — Sculpture & Relief",
  "floors.2.desc": "Bronze, stone and carved wood",
  "floors.2.count": "28 works",
  "floors.3.name": "Floor III — Photography",
  "floors.3.desc": "Portraits, hands, places held briefly",
  "floors.3.count": "64 works",
  "floors.4.name": "Floor IV — Mythologies",
  "floors.4.desc": "The phoenix, the rider, the open hand",
  "floors.4.count": "Invited guests",

  "collection.eyebrow": "The Collection",
  "collection.title.1": "Selected",
  "collection.title.2": "Works",
  "collection.lead": "A first look at pieces currently hanging on the four floors of LUMEN.",
  "collection.view": "View →",

  "work.1.title": "Starlit Profile",
  "work.1.medium": "Oil and gold on canvas · 2023",
  "work.2.title": "The Persian Rider",
  "work.2.medium": "Carved relief, gilt frame · 2022",
  "work.3.title": "Phoenix Rising",
  "work.3.medium": "Pigment and ink on paper · 2024",
  "work.4.title": "Love Held Open",
  "work.4.medium": "Photograph, archival print · 2024",

  "films.eyebrow": "Films & Walkthroughs",
  "films.title.1": "The Gallery in",
  "films.title.2": "Motion",
  "films.lead":
    "Studio visits, walkthrough films and conversations with Ali Shahidi. Videos load only when you press play, keeping the gallery quick to open.",
  "films.play": "Play film",
  "films.1.title": "Studio Visit — Tehran",
  "films.1.sub": "10 min · 2025",
  "films.2.title": "Walkthrough — Floor I",
  "films.2.sub": "6 min · 2025",
  "films.3.title": "Conversation — On Light",
  "films.3.sub": "14 min · 2024",

  "testimonials.eyebrow": "On the Record",
  "testimonials.title.1": "What People",
  "testimonials.title.2": "Are Saying",
  "test.1.quote":
    "Shahidi works the way a poet remembers — slowly, and across every form a thought might take.",
  "test.1.author": "Marguerite Lévêque",
  "test.1.role": "Senior Curator, Paris",
  "test.2.quote":
    "The most considered virtual gallery I have walked through. The architecture itself is an act of curation.",
  "test.2.author": "Dr. Henrik Aaltonen",
  "test.2.role": "Art Editor",
  "test.3.quote":
    "A platform that treats artists, languages, and visitors with equal seriousness. Rare. Necessary.",
  "test.3.author": "Parisa Naderi",
  "test.3.role": "Director, Tehran Contemporary",

  "support.eyebrow": "Stand With LUMEN",
  "support.title.1": "Patron, Member,",
  "support.title.2": "Foundation",
  "support.lead":
    "LUMEN is sustained by people who believe contemporary art deserves a permanent, well-lit room. Every contribution funds new exhibitions, artist commissions and IP protection.",
  "support.patron.title": "Patron",
  "support.patron.tier": "From $1,000 / year",
  "support.patron.desc":
    "Underwrite a full exhibition wall. Private studio visits, named on the patron board.",
  "support.patron.cta": "Become a Patron →",
  "support.donate.title": "Donate",
  "support.donate.tier": "Any amount",
  "support.donate.desc":
    "One-time gift in support of the artists, the platform and free public access.",
  "support.donate.cta": "Make a Donation →",
  "support.membership.title": "Membership",
  "support.membership.tier": "$12 / month",
  "support.membership.desc":
    "Early access to new floors, members-only films, and an annual print release.",
  "support.membership.cta": "Join as Member →",
  "support.foundation.title": "Foundation",
  "support.foundation.tier": "Institutional",
  "support.foundation.desc":
    "Long-term partnership for foundations and cultural institutions worldwide.",
  "support.foundation.cta": "Talk to the Foundation →",

  "ip.eyebrow": "Stewardship",
  "ip.title.1": "Your Work,",
  "ip.title.2": "Fully Protected",
  "ip.lead":
    "An exhibition platform is only as trustworthy as the protection it offers its artists. Here is exactly how LUMEN safeguards every work uploaded to the gallery.",
  "ip.howto.title": "How to protect your artwork",
  "ip.howto.lead":
    "Three simple steps, completed once when you upload — your copyright is then registered, watermarked and monitored for life.",
  "ip.step.1.title": "Upload & Timestamp",
  "ip.step.1.desc":
    "Each file is hashed and timestamped the moment it is uploaded — creating a tamper-proof record of authorship at a precise date and time.",
  "ip.step.2.title": "Watermark & Sign",
  "ip.step.2.desc":
    "We embed an invisible forensic watermark with your name and the work's ID. The image you see on LUMEN is right-click protected and rate-limited.",
  "ip.step.3.title": "Monitor & Defend",
  "ip.step.3.desc":
    "Our system scans the open web for unauthorised reproductions. If we find a match, you are notified within hours and our legal partners help with takedown.",
  "ip.pillar.1.title": "Copyright by Default",
  "ip.pillar.1.desc":
    "You retain 100% copyright at all times. LUMEN claims no rights over your work — ever.",
  "ip.pillar.2.title": "Forensic Watermarking",
  "ip.pillar.2.desc":
    "Invisible, robust watermarks survive screenshotting, cropping and re-compression.",
  "ip.pillar.3.title": "Reverse-Image Monitoring",
  "ip.pillar.3.desc":
    "Continuous scanning of the open web with hourly alerts on any match found.",
  "ip.pillar.4.title": "DMCA & Legal Support",
  "ip.pillar.4.desc":
    "Direct access to our legal partners for takedowns, licensing and provenance.",

  "press.eyebrow": "Press",
  "press.title": "Press & Coverage",
  "press.lead":
    "Selected press, interviews and reviews. Press kit, high-resolution images and quotes available on request.",
  "press.read": "Read →",
  "press.item.1.title": "A Quiet Room For Loud Ideas",
  "press.item.1.source": "Le Monde · 2025",
  "press.item.2.title": "Shahidi at the Threshold",
  "press.item.2.source": "Frieze · 2025",
  "press.item.3.title": "The Virtual Gallery, Rebuilt",
  "press.item.3.source": "Art Forum · 2024",

  "contact.eyebrow": "Get in Touch",
  "contact.title": "Contact the Gallery",
  "contact.lead":
    "For acquisitions, partnerships, press, or to ask about a specific work, write to us. We answer within two working days.",
  "contact.name": "Full name",
  "contact.email": "Email",
  "contact.message": "Message",
  "contact.send": "Send Message",
  "contact.sent": "Thank you — we will be in touch shortly.",

  "footer.tagline":
    "A multilingual cinematic gallery for contemporary art — anchored by the work of Ali Shahidi.",
  "footer.newsletter": "Join the mailing list",
  "footer.email": "Email address",
  "footer.join": "Join →",
  "footer.join.ok": "Check your inbox — a confirmation link is on its way from info@lumen.ca.",
  "footer.join.err": "Please enter a valid email address.",
  "footer.col.gallery": "The Gallery",
  "footer.col.support": "Support",
  "footer.col.foundation": "Foundation",
  "footer.credit": "Designed & Developed by",
  "footer.rights": "All rights reserved",
  "footer.tm": "Registered Trademark",
};

const fa: Dict = {
  "nav.exhibitions": "نمایشگاه‌ها",
  "nav.hall": "گالری",
  "nav.artists": "هنرمندان",
  "nav.collection": "مجموعه",
  "nav.films": "فیلم‌ها",
  "nav.support": "حمایت",
  "nav.contact": "تماس",
  "nav.protect": "حفاظت اثر",

  "hero.eyebrow": "نمایشگاه افتتاحیه · در حال نمایش",
  "hero.title.1": "علی شهیدی",
  "hero.title.2": "نمایشگاه انفرادی",
  "hero.lead":
    "نمایشگاهی متمرکز بر نقاشی، مجسمه‌سازی، عکاسی و رسانه ترکیبی علی شهیدی، چیده شده در چند طبقه محدود.",
  "hero.cta.enter": "دیدن نمایشگاه",
  "hero.cta.walk": "گشت در طبقات",

  "artist.eyebrow": "هنرمند ویژه",
  "artist.name": "علی شهیدی",
  "artist.quote": "«من در لحظه‌ای پیش از زبان کار می‌کنم — در رنگ، سنگ، عکس و کلمه.»",
  "artist.bio.1":
    "متولد ایران و فعال میان تهران و پاریس، علی شهیدی آزادانه میان نقاشی، مجسمه‌سازی، عکاسی و صنایع دستی حرکت می‌کند.",
  "artist.bio.2": "LUMEN آثار او را در چهار طبقه گرد آورده، در کنار هنرمندان معاصر دعوت‌شده.",
  "artist.works": "آثار",
  "artist.years": "سال‌ها",
  "artist.floors": "طبقات",
  "artist.cta": "مشاهده مونوگراف کامل ←",

  "hall.eyebrow": "معماری",
  "hall.title.1": "چهار طبقه،",
  "hall.title.2": "یک گردش پیوسته",
  "hall.lead": "LUMEN گالری مجازی‌ای است که می‌توان در آن قدم زد — چهار طبقه گرد یک آتریوم نورانی.",
  "hall.cta": "آغاز گردش مجازی",

  "floors.1.name": "طبقه یک — نقاشی",
  "floors.1.desc": "بوم‌هایی درباره خاطره، خوشنویسی و نور",
  "floors.1.count": "۴۲ اثر",
  "floors.2.name": "طبقه دو — مجسمه و نقش‌برجسته",
  "floors.2.desc": "برنز، سنگ و چوب",
  "floors.2.count": "۲۸ اثر",
  "floors.3.name": "طبقه سه — عکاسی",
  "floors.3.desc": "چهره‌ها، دست‌ها، مکان‌های لحظه‌ای",
  "floors.3.count": "۶۴ اثر",
  "floors.4.name": "طبقه چهار — اسطوره‌ها",
  "floors.4.desc": "ققنوس، سوارکار، دست گشوده",
  "floors.4.count": "مهمانان دعوت‌شده",

  "collection.eyebrow": "مجموعه",
  "collection.title.1": "آثار",
  "collection.title.2": "منتخب",
  "collection.lead": "نگاهی نخستین به آثاری که اکنون در چهار طبقه LUMEN نصب شده‌اند.",
  "collection.view": "مشاهده ←",

  "work.1.title": "نیم‌رخ ستاره‌نشان",
  "work.1.medium": "رنگ روغن و طلا روی بوم · ۱۴۰۲",
  "work.2.title": "سوارکار پارسی",
  "work.2.medium": "نقش‌برجسته، قاب طلاکوب · ۱۴۰۱",
  "work.3.title": "خیزش ققنوس",
  "work.3.medium": "رنگدانه و مرکب روی کاغذ · ۱۴۰۳",
  "work.4.title": "عشق در دستان گشوده",
  "work.4.medium": "عکس، چاپ آرشیوی · ۱۴۰۳",

  "films.eyebrow": "فیلم‌ها و گردش‌ها",
  "films.title.1": "گالری در",
  "films.title.2": "حرکت",
  "films.lead":
    "بازدید از استودیو، فیلم‌های گردش و گفت‌وگو با علی شهیدی. ویدیوها فقط با فشردن دکمه پخش بارگذاری می‌شوند.",
  "films.play": "پخش فیلم",
  "films.1.title": "بازدید از استودیو — تهران",
  "films.1.sub": "۱۰ دقیقه · ۱۴۰۴",
  "films.2.title": "گردش — طبقه یک",
  "films.2.sub": "۶ دقیقه · ۱۴۰۴",
  "films.3.title": "گفت‌وگو — درباره نور",
  "films.3.sub": "۱۴ دقیقه · ۱۴۰۳",

  "testimonials.eyebrow": "در گفت‌وگو",
  "testimonials.title.1": "آنچه دیگران",
  "testimonials.title.2": "می‌گویند",
  "test.1.quote": "شهیدی همچون شاعری به‌یاد می‌آورد — آرام، و در هر شکلی که اندیشه به خود می‌گیرد.",
  "test.1.author": "مارگریت لِوک",
  "test.1.role": "کیوریتور ارشد، پاریس",
  "test.2.quote": "هوشمندانه‌ترین گالری مجازی که تجربه کرده‌ام. خودِ معماری یک عمل کیوریتوری است.",
  "test.2.author": "دکتر هنریک آلتونن",
  "test.2.role": "ویراستار هنری",
  "test.3.quote": "پلتفرمی که با هنرمندان، زبان‌ها و بازدیدکنندگان به یک اندازه جدی برخورد می‌کند.",
  "test.3.author": "پریسا نادری",
  "test.3.role": "مدیر، تهران معاصر",

  "support.eyebrow": "همراهی با LUMEN",
  "support.title.1": "حامی، عضو،",
  "support.title.2": "بنیاد",
  "support.lead":
    "LUMEN با حمایت کسانی پابرجاست که باور دارند هنر معاصر سزاوار اتاقی همیشگی و نورانی است.",
  "support.patron.title": "حامی",
  "support.patron.tier": "از ۱٬۰۰۰ دلار / سال",
  "support.patron.desc": "حمایت از یک دیوار کامل نمایشگاه و بازدیدهای خصوصی از استودیو.",
  "support.patron.cta": "حامی شوید ←",
  "support.donate.title": "اهدا",
  "support.donate.tier": "هر مبلغی",
  "support.donate.desc": "هدیه یک‌باره در حمایت از هنرمندان، پلتفرم و دسترسی آزاد عمومی.",
  "support.donate.cta": "اهدای کمک ←",
  "support.membership.title": "عضویت",
  "support.membership.tier": "۱۲ دلار / ماه",
  "support.membership.desc": "دسترسی زودهنگام به طبقات جدید، فیلم‌های ویژه اعضا و چاپ سالانه.",
  "support.membership.cta": "عضو شوید ←",
  "support.foundation.title": "بنیاد",
  "support.foundation.tier": "نهادی",
  "support.foundation.desc": "همکاری بلندمدت برای بنیادها و نهادهای فرهنگی در سراسر جهان.",
  "support.foundation.cta": "گفت‌وگو با بنیاد ←",

  "ip.eyebrow": "حفاظت",
  "ip.title.1": "اثر شما،",
  "ip.title.2": "کاملاً محافظت‌شده",
  "ip.lead": "اعتبار یک پلتفرم نمایشگاهی به اندازه حفاظتی است که از هنرمندانش می‌کند.",
  "ip.howto.title": "چگونه از اثر خود محافظت کنید",
  "ip.howto.lead": "سه گام ساده، یک‌بار هنگام بارگذاری.",
  "ip.step.1.title": "بارگذاری و زمان‌نگاری",
  "ip.step.1.desc": "هر فایل لحظه‌ی بارگذاری هَش و زمان‌نگاری می‌شود.",
  "ip.step.2.title": "واترمارک و امضا",
  "ip.step.2.desc": "یک واترمارک فارنزیک نامرئی با نام شما جاسازی می‌شود.",
  "ip.step.3.title": "پایش و دفاع",
  "ip.step.3.desc": "سیستم ما وب آزاد را برای بازتولید غیرمجاز پایش می‌کند.",
  "ip.pillar.1.title": "حق مؤلف به‌صورت پیش‌فرض",
  "ip.pillar.1.desc": "شما همواره ۱۰۰٪ مالک حق مؤلف هستید.",
  "ip.pillar.2.title": "واترمارک فارنزیک",
  "ip.pillar.2.desc": "واترمارک‌های نامرئی و مقاوم در برابر اسکرین‌شات و برش.",
  "ip.pillar.3.title": "پایش معکوس تصویر",
  "ip.pillar.3.desc": "اسکن مداوم وب آزاد و هشدارهای ساعتی.",
  "ip.pillar.4.title": "DMCA و پشتیبانی حقوقی",
  "ip.pillar.4.desc": "دسترسی مستقیم به وکلای ما برای حذف اثر و صدور مجوز.",

  "press.eyebrow": "مطبوعات",
  "press.title": "مطبوعات و پوشش رسانه‌ای",
  "press.lead": "گزیده‌ای از مطبوعات، گفت‌وگوها و نقدها.",
  "press.read": "مطالعه ←",
  "press.item.1.title": "اتاقی آرام برای ایده‌های بلند",
  "press.item.1.source": "لوموند · ۱۴۰۴",
  "press.item.2.title": "شهیدی در آستانه",
  "press.item.2.source": "فریز · ۱۴۰۴",
  "press.item.3.title": "گالری مجازی، بازساخته",
  "press.item.3.source": "آرت فوروم · ۱۴۰۳",

  "contact.eyebrow": "در تماس باشید",
  "contact.title": "تماس با گالری",
  "contact.lead":
    "برای خرید آثار، همکاری، مطبوعات یا پرسش درباره اثری خاص با ما در تماس باشید. ظرف دو روز کاری پاسخ می‌دهیم.",
  "contact.name": "نام و نام خانوادگی",
  "contact.email": "ایمیل",
  "contact.message": "پیام",
  "contact.send": "ارسال پیام",
  "contact.sent": "سپاسگزاریم — به‌زودی با شما تماس می‌گیریم.",

  "footer.tagline": "گالری سینمایی و چندزبانه‌ای برای هنر معاصر — با محوریت آثار علی شهیدی.",
  "footer.newsletter": "عضویت در خبرنامه",
  "footer.email": "نشانی ایمیل",
  "footer.join": "عضویت ←",
  "footer.join.ok": "ایمیل خود را بررسی کنید — لینک تأیید از info@lumen.ca ارسال شد.",
  "footer.join.err": "لطفاً یک ایمیل معتبر وارد کنید.",
  "footer.col.gallery": "گالری",
  "footer.col.support": "حمایت",
  "footer.col.foundation": "بنیاد",
  "footer.credit": "طراحی و توسعه توسط",
  "footer.rights": "تمامی حقوق محفوظ است",
  "footer.tm": "علامت تجاری ثبت‌شده",
};

const dicts: Record<Lang, Dict> = { EN: en, FA: fa };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };

const I18nContext = createContext<Ctx | null>(null);

function detectInitial(): Lang {
  if (typeof window === "undefined") return "EN";
  const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (saved === "EN" || saved === "FA") return saved;
  const nav = window.navigator.language.toLowerCase();
  if (nav.startsWith("fa") || nav.startsWith("pe")) return "FA";
  return "EN";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("EN");

  useEffect(() => {
    setLang(detectInitial());
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang === "FA" ? "fa" : "en";
    document.documentElement.dir = lang === "FA" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key) => dicts[lang][key] ?? dicts.EN[key] ?? key,
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used within I18nProvider");
  return ctx;
}
