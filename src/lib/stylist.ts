import { glasses, type Glasses } from "@/lib/glasses";
import type { Lang } from "@/lib/i18n";

// ---------------------------------------------------------------------------------------------
// Understands voice / typed commands in English, Urdu, Arabic, Hindi, Spanish and French.
// It looks for keywords (any of the languages, so mixing English words into Urdu works too),
// tolerates small spelling / recognition mistakes, and can pick up several things in one sentence:
// "show me the round ones in silver and add them to my cart".
// ---------------------------------------------------------------------------------------------

export function norm(s: string) {
  return (
    " " +
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[ً-ٰٟ̀-ͯ]/g, "") // arabic marks + latin accents
      .replace(/[يى]/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/[ةۃ]/g, "ہ")
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ۓ/g, "ے")
      .replace(/[.,!?؟،;:"“”«»()\-–—_/\\]/g, " ")
      .replace(/\s+/g, " ")
      .trim() +
    " "
  );
}

function lev(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}
const LATIN = /^[a-z]+$/;

function hit(text: string, tokens: string[], phrase: string): boolean {
  const p = norm(phrase).trim();
  if (!p) return false;
  if (p.includes(" ")) return text.includes(" " + p + " ") || text.includes(p);
  for (const tk of tokens) {
    if (tk === p) return true;
    if (tk.startsWith(p) && p.length >= (LATIN.test(p) ? 4 : 3)) return true; // plurals, Urdu/Hindi suffixes, "rounds"
    if (p.length >= 5 && LATIN.test(p) && LATIN.test(tk)) {
      const max = p.length >= 9 ? 2 : 1;
      if (lev(tk, p, max) <= max) return true;
    }
  }
  return false;
}
const any = (text: string, tokens: string[], list: string[]) => list.some((p) => hit(text, tokens, p));

// ---------------- vocabulary ----------------
const PRODUCT_KW: Record<string, string[]> = {
  bold: ["heritage", "bold", "thick", "chunky", "acetate", "wood", "wooden", "mota", "mote", "moti", "motay", "samik", "sameek", "موٹے", "موٹا", "موٹی", "ہیریٹیج", "بولڈ", "मोटे", "मोटा", "बोल्ड", "हेरिटेज", "سميك", "عريض", "هيريتج", "gruesa", "gruesas", "grueso", "pasta", "épaisse", "épaisses", "epais", "epaisse", "acétate"],
  rect: ["slim", "rectangle", "rectangular", "rectangles", "sleek", "everyday", "light weight", "lightweight", "chokor", "chaukor", "chokore", "chaukore", "patla", "patle", "patli", "mustateel", "mostateel", "مستطیل", "چوکور", "سلم", "पतले", "आयताकार", "चौकोर", "स्लिम", "مستطيل", "مربع", "نحيف", "رفيع", "delgada", "delgadas", "rectangulares", "fine", "fines", "rectangulaire", "rectangulaires"],
  wire: ["wire", "round", "rounds", "circle", "circular", "vintage", "retro", "lennon", "aviator", "aviators", "metal", "gol", "gole", "taar", "daeri", "dairi", "daaeri", "mudawar", "mudawwar", "گول", "وائر", "تار", "دائرہ", "गोल", "वायर", "दायरा", "دائري", "دائریہ", "مدور", "دائرية", "سلك", "redonda", "redondas", "alambre", "ronde", "rondes", "fil"],
};
const ORD: [string, string[]][] = [
  ["bold", ["first", "pehla", "پہلا", "پہلے", "पहला", "الاول", "الأول", "primera", "primero", "première", "premier", "1", "one"]],
  ["rect", ["second", "dusra", "دوسرا", "دوسری", "दूसरा", "الثاني", "الثانی", "segunda", "segundo", "deuxième", "deuxieme", "2", "two"]],
  ["wire", ["third", "teesra", "تیسرا", "تیسری", "तीसरा", "الثالث", "tercera", "tercero", "troisième", "troisieme", "3", "three"]],
];
const COLOR_KW: Record<string, string[]> = {
  black: ["black", "dark black", "kala", "kaala", "kale", "kaale", "kali", "siyah", "aswad", "eswed", "کالا", "کالے", "کالی", "سیاہ", "काला", "काले", "काली", "اسود", "negro", "negra", "negras", "negros", "noir", "noire", "noirs"],
  navy: ["navy", "blue", "neela", "neele", "neeli", "nila", "nile", "azraq", "kuhli", "نیلا", "نیلے", "نیلی", "نیوی", "नीला", "नीले", "नेवी", "ازرق", "کحلی", "azul", "bleu", "marine"],
  burgundy: ["burgundy", "wine", "maroon", "annabi", "بروگنڈی", "مرون", "बरगंडी", "मैरून", "عنابی", "burdeos", "granate", "bordeaux", "bordeau"],
  forest: ["forest", "green", "hara", "hare", "hari", "akhdar", "سبز", "ہرا", "ہرے", "ہری", "हरा", "हरे", "फॉरेस्ट", "اخضر", "verde", "verdes", "vert", "verte"],
  tortoise: ["tortoise", "tortoiseshell", "brown", "bhura", "bhure", "bhoora", "bhoore", "bunni", "bonni", "بھورا", "بھورے", "بنی", "भूरा", "भूरे", "بنی", "بني", "carey", "marron", "écaille", "ecaille", "marrón"],
  crimson: ["crimson", "red", "laal", "lal", "ahmar", "لال", "سرخ", "लाल", "احمر", "rojo", "roja", "rouge"],
  gold: ["gold", "golden", "sunehri", "sunehra", "sunehre", "dahabi", "zahabi", "dhahabi", "سنہری", "سونے", "گولڈ", "सुनहरा", "सुनहरे", "गोल्ड", "ذهبی", "ذهب", "dorado", "dorada", "oro", "doré", "dore"],
  silver: ["silver", "chandi", "chaandi", "fiddi", "fidi", "fiddy", "چاندی", "سلور", "چاندی", "सिल्वर", "चांदी", "फ्रॉस्ट", "فضی", "فضه", "plata", "plateado", "argent", "argenté"],
  copper: ["copper", "bronze", "tamba", "tambe", "تانبا", "تانبے", "तांबा", "تانبی", "نحاسی", "cobre", "cuivre"],
};
const COLOR_RX: Record<string, RegExp> = {
  black: /black/i, navy: /navy/i, burgundy: /burgundy/i, forest: /forest/i, tortoise: /tortoise/i,
  crimson: /crimson/i, gold: /gold/i, silver: /silver/i, copper: /copper/i,
};
const W = {
  add: ["add", "cart", "bag", "basket", "buy", "daalo", "dalo", "daal", "dal do", "daldo", "shamil", "khareed", "khareedo", "kharid", "kharido", "lelo", "le lo", "adif", "adef", "adeef", "aschtari", "ishtari", "take it", "take this", "i want", "i'll take", "order", "کارٹ", "ٹوکری", "شامل", "ڈال", "ڈالو", "ڈالیں", "ڈالنا", "خرید", "कार्ट", "डालो", "डाल", "जोड़", "जोड़ो", "खरीद", "لسلہ", "اضف", "سلہ", "السلہ", "اشتری", "اشتر", "añade", "añadir", "agrega", "agregar", "carrito", "comprar", "ajoute", "ajouter", "panier", "acheter"],
  strongAdd: ["add", "daalo", "dalo", "daal", "daldo", "shamil", "khareed", "khareedo", "kharid", "kharido", "lelo", "adif", "adef", "adeef", "ishtari", "ڈال", "ڈالو", "ڈالیں", "ڈالنا", "شامل", "डालो", "डाल", "जोड़", "جوڑ", "اضف", "اشتری", "añade", "añadir", "agrega", "agregar", "ajoute", "ajouter", "buy", "خرید", "खरीद", "comprar", "acheter", "take", "want"],
  cartWord: ["cart", "salla", "sallah", "kart", "bag", "basket", "کارٹ", "ٹوکری", "कार्ट", "سلہ", "السلہ", "carrito", "panier"],
  open: ["open", "show", "view", "see", "go", "check", "dikhao", "dikha", "dikhana", "dikhaye", "dikhayein", "dekhao", "dekho", "dekhna", "kholo", "khol", "kholna", "warini", "wareeni", "arini", "afta7", "iftah", "iftaah", "کھول", "دکھا", "دکھاؤ", "دیکھ", "دیکھو", "खोल", "खोलो", "दिखा", "दिखाओ", "देख", "افتح", "اعرض", "ارنی", "abre", "abrir", "muestra", "muéstrame", "ver", "ouvre", "ouvrir", "affiche", "voir"],
  remove: ["remove", "delete", "clear", "take out", "hata", "hatao", "hatado", "nikalo", "nikal", "azil", "ahzef", "ہٹا", "ہٹاؤ", "نکال", "हटा", "हटाओ", "निकाल", "ازل", "احذف", "quita", "quitar", "elimina", "retire", "retirer", "supprime"],
  checkout: ["checkout", "check out", "pay", "payment", "purchase", "proceed", "paisay", "paise", "adaigi", "ada karo", "idfa", "dfa3", "ekhtam", "چیک آؤٹ", "چیکاؤٹ", "چیک اوٹ", "ادائیگی", "پیمنٹ", "پے", "चेकआउट", "चेक आउट", "पेमेंट", "भुगतान", "الدفع", "ادفع", "اتمام الشراء", "pagar", "pago", "finalizar", "commander", "payer", "paiement", "caisse"],
  recommend: ["suit", "suits", "recommend", "mashwara", "mashwarah", "konsa", "kaunsa", "kaun sa", "behtar", "acha lagega", "achha lagega", "yonasibni", "yunasibni", "yunasebni", "recommendation", "suggest", "suggestion", "best for me", "what should", "which one", "look good", "looks good", "سوٹ", "مشورہ", "تجویز", "کون سا", "کونسا", "کیا اچھا", "जँचेगा", "जंचेगा", "सूट", "सुझाव", "कौन सा", "क्या अच्छा", "يناسبني", "یناسبنی", "اقتراح", "انصح", "ای", "favorece", "recomienda", "recomiéndame", "sugiere", "queda", "va bien", "conseille", "recommande", "suggère", "me va"],
  next: ["next", "another", "following", "different", "change", "agla", "agli", "agle", "doosra", "dusra", "dusri", "doosri", "badlo", "badal", "tali", "altali", "اگلا", "اگلی", "دوسرا", "بدلو", "बदलो", "अगला", "दूसरा", "التالی", "التالى", "siguiente", "otra", "otro", "cambia", "suivante", "suivant", "autre", "change"],
  prev: ["previous", "prev", "before", "pichla", "pichli", "pichle", "sabiq", "alsabiq", "پچھلا", "پچھلی", "پہلے والا", "पिछला", "पिछली", "السابق", "anterior", "précédente", "précédent", "precedente"],
  home: ["home", "homepage", "main page", "ghar", "ہوم", "مرکزی", "होम", "الرئیسیہ", "inicio", "accueil"],
  shop: ["shop", "collection", "catalog", "catalogue", "store", "all frames", "شاپ", "کلیکشن", "دکان", "शॉप", "कलेक्शन", "المتجر", "المجموعہ", "tienda", "colección", "coleccion", "boutique"],
  tryon: ["try on", "try-on", "tryon", "camera", "live", "ٹرائی آن", "ٹرائی", "کیمرا", "ट्राई", "कैमरा", "تجربہ", "الکامیرا", "probar", "prueba", "cámara", "camara", "essayer", "essayage", "caméra"],
  price: ["price", "cost", "how much", "kitne", "kitna", "kitni", "qeemat", "keemat", "qimat", "قیمت", "کتنے", "کتنا", "کتنی", "कीमत", "कितना", "कितने", "السعر", "کم", "precio", "cuánto", "cuanto", "prix", "combien"],
  dark: ["dark", "night", "ڈارک", "डार्क", "داکن", "oscuro", "sombre"],
  light: ["light mode", "light theme", "day mode", "bright mode", "لائٹ", "लाइट", "الفاتح", "modo claro", "mode clair", "tema claro"],
  help: ["help", "what can you do", "commands", "madad", "madat", "musaada", "musaadah", "مدد", "کیا کر سکتے", "मदद", "क्या कर सकते", "مساعدہ", "ayuda", "aide"],
  yes: ["yes", "yeah", "yep", "sure", "okay", "ok", "do it", "go ahead", "please", "haan", "han", "haa", "ji", "theek", "thik", "zaroor", "bilkul", "aywa", "aiwa", "naam", "tamam", "ہاں", "جی", "ٹھیک", "ضرور", "हाँ", "हां", "जी", "ठीक", "नعم", "نعم", "sí", "si", "claro", "vale", "oui", "d'accord"],
  stop: ["stop listening", "stop", "enough", "that's all", "bas", "band", "khatam", "بس", "بند", "रुको", "बस", "توقف", "para", "arrête", "arrete"],
  original: ["original", "default", "اصل", "اصلی", "मूल", "اصلي", "original", "d'origine"],
  langMarker: ["speak", "bolo", "bol", "baat", "baat karo", "zaban", "zuban", "tahadath", "kallimni", "kalimni", "hablame", "parlez", "language", "switch", "talk", "answer", "بولو", "زبان", "بات", "बोलो", "भाषा", "लैंग्वेज", "لغہ", "تحدث", "habla", "idioma", "parle", "langue"],
};
const LANG_KW: Record<Lang, string[]> = {
  en: ["english", "angrezi", "angraizi", "ingliz", "inglisi", "انگریزی", "انگلش", "अंग्रेज़ी", "अंग्रेजी", "इंग्लिश", "الانجلیزیہ", "inglés", "ingles", "anglais"],
  ur: ["urdu", "ordu", "ourdou", "اردو", "उर्दू", "الاردیہ", "ourdou"],
  ar: ["arabic", "arabi", "3arabi", "arabiya", "عربی", "عربي", "अरबी", "árabe", "arabe", "العربیہ"],
  es: ["spanish", "espanyol", "ispani", "ہسپانوی", "سپینش", "स्पेनिश", "الاسبانیہ", "español", "espanol", "espagnol"],
  fr: ["french", "faransi", "francisi", "fransi", "فرانسیسی", "فرنچ", "फ्रेंच", "الفرنسیہ", "francés", "frances", "français", "francais"],
};

export interface Parsed {
  product?: string;
  color?: string; // colour id (black, navy ...) or "original"
  step?: 1 | -1;
  add?: boolean;
  remove?: boolean;
  checkout?: boolean;
  viewCart?: boolean;
  home?: boolean;
  shop?: boolean;
  tryon?: boolean;
  price?: boolean;
  recommend?: boolean;
  yes?: boolean;
  stop?: boolean;
  help?: boolean;
  theme?: "dark" | "light";
  lang?: Lang;
}

export function parse(raw: string): Parsed {
  const text = norm(raw);
  const base = text.trim().split(" ").filter(Boolean);
  // Arabic "al-" article: الدائرية -> دائرية
  const tokens = base.concat(base.filter((t) => t.startsWith("ال") && t.length > 4).map((t) => t.slice(2)));
  const p: Parsed = {};
  if (!tokens.length) return p;

  // language switch needs a marker word so "english" alone inside a sentence doesn't switch
  const langHit = (Object.keys(LANG_KW) as Lang[]).find((l) => any(text, tokens, LANG_KW[l]));
  if (langHit && (any(text, tokens, W.langMarker) || tokens.length <= 2)) p.lang = langHit;

  // product by name / shape
  let best = 0;
  for (const [id, kws] of Object.entries(PRODUCT_KW)) {
    const n = kws.filter((k) => hit(text, tokens, k)).length;
    if (n > best) { best = n; p.product = id; }
  }
  if (!p.product) {
    for (const [id, kws] of ORD) if (kws.some((k) => tokens.includes(norm(k).trim()))) p.product = id;
  }

  // colour
  for (const [id, kws] of Object.entries(COLOR_KW)) if (any(text, tokens, kws)) { p.color = id; break; }
  if (!p.color && any(text, tokens, W.original)) p.color = "original";
  // "rose gold" is handled as gold, "navy blue" as navy
  // a colour word that is really the product ("round" never is a colour) - nothing to clash

  const cartWord = any(text, tokens, W.cartWord);
  const open = any(text, tokens, W.open);
  const strongAdd = any(text, tokens, W.strongAdd);
  const wantsCheckout = any(text, tokens, W.checkout);

  if (any(text, tokens, W.remove) && (cartWord || p.product)) p.remove = true;
  else if (wantsCheckout && !strongAdd) p.checkout = true;
  else if (cartWord && open && !strongAdd) p.viewCart = true;
  else if (cartWord && !strongAdd && !open && tokens.length <= 3) p.viewCart = true; // just "cart"
  else if (any(text, tokens, W.add)) p.add = true;
  if (wantsCheckout && strongAdd) p.checkout = true; // "add it and check out"

  if (any(text, tokens, W.prev)) p.step = -1;
  else if (any(text, tokens, W.next) && !p.product && !p.color) p.step = 1;

  if (any(text, tokens, W.home)) p.home = true;
  if (any(text, tokens, W.shop) && !p.add && !p.viewCart) p.shop = true;
  if (any(text, tokens, W.tryon) && !p.product) p.tryon = true;
  if (any(text, tokens, W.price)) p.price = true;
  if (any(text, tokens, W.recommend)) p.recommend = true;
  if (any(text, tokens, W.help)) p.help = true;
  if (any(text, tokens, W.stop) && tokens.length <= 3) p.stop = true;
  if (any(text, tokens, W.light)) p.theme = "light";
  else if (any(text, tokens, W.dark)) p.theme = "dark";
  if (tokens.length <= 3 && any(text, tokens, W.yes)) p.yes = true;

  // "buy this" style words shouldn't also trigger checkout/add twice
  if (p.checkout) p.viewCart = false;
  return p;
}

/** find the colour of a product that matches a colour id from parse() */
export function matchColor(product: Glasses, id: string) {
  if (id === "original") return product.colors.find((c) => c.original) ?? product.colors[0];
  const rx = COLOR_RX[id];
  return rx ? product.colors.find((c) => rx.test(c.name)) : undefined;
}

// ---------------- recommendation (face shape + undertone) ----------------
export function recommend(shape: string, skinTone: string): { id: string; colorName: string } {
  // contrast the face: round/oblong -> angular, square/diamond -> round, oval/heart -> bold
  let id = "bold";
  if (shape === "Square" || shape === "Diamond") id = "wire";
  else if (shape === "Round" || shape === "Oblong") id = "rect";
  else if (shape === "Heart") id = "wire";
  const p = glasses[id];
  const tone = /warm/i.test(skinTone) ? "warm" : /cool/i.test(skinTone) ? "cool" : "neutral";
  const pick: Record<string, Record<string, string>> = {
    bold: { warm: "Burgundy", cool: "Navy", neutral: "Original Black" },
    rect: { warm: "Tortoise", cool: "Navy", neutral: "Original Black" },
    wire: { warm: "Gold", cool: "Silver", neutral: "Original Copper" },
  };
  const wanted = pick[id][tone];
  const c = p.colors.find((x) => x.name === wanted) ?? p.colors[0];
  return { id, colorName: c.name };
}

export function toneKey(skinTone: string): "warm" | "cool" | "neutral" {
  return /warm/i.test(skinTone) ? "warm" : /cool/i.test(skinTone) ? "cool" : "neutral";
}
