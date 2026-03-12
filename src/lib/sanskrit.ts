// Sanskrit Sandhi rules - client-side implementation
export interface SandhiRule {
  first: string;
  second: string;
  result: string;
  name: string;
  nameDevanagari: string;
  explanation: string;
}

export const SANDHI_RULES: SandhiRule[] = [
  { first: "अ", second: "इ", result: "ए", name: "Guṇa Sandhi", nameDevanagari: "गुण सन्धिः", explanation: "अ + इ = ए (a + i = e)" },
  { first: "अ", second: "उ", result: "ओ", name: "Guṇa Sandhi", nameDevanagari: "गुण सन्धिः", explanation: "अ + उ = ओ (a + u = o)" },
  { first: "अ", second: "ऋ", result: "अर्", name: "Guṇa Sandhi", nameDevanagari: "गुण सन्धिः", explanation: "अ + ऋ = अर् (a + ṛ = ar)" },
  { first: "अ", second: "अ", result: "आ", name: "Dīrgha Sandhi", nameDevanagari: "दीर्घ सन्धिः", explanation: "अ + अ = आ (a + a = ā)" },
  { first: "इ", second: "इ", result: "ई", name: "Dīrgha Sandhi", nameDevanagari: "दीर्घ सन्धिः", explanation: "इ + इ = ई (i + i = ī)" },
  { first: "उ", second: "उ", result: "ऊ", name: "Dīrgha Sandhi", nameDevanagari: "दीर्घ सन्धिः", explanation: "उ + उ = ऊ (u + u = ū)" },
  { first: "आ", second: "इ", result: "ए", name: "Guṇa Sandhi", nameDevanagari: "गुण सन्धिः", explanation: "आ + इ = ए (ā + i = e)" },
  { first: "आ", second: "उ", result: "ओ", name: "Guṇa Sandhi", nameDevanagari: "गुण सन्धिः", explanation: "आ + उ = ओ (ā + u = o)" },
  { first: "अ", second: "ई", result: "ए", name: "Guṇa Sandhi", nameDevanagari: "गुण सन्धिः", explanation: "अ + ई = ए (a + ī = e)" },
  { first: "अ", second: "ऊ", result: "ओ", name: "Guṇa Sandhi", nameDevanagari: "गुण सन्धिः", explanation: "अ + ऊ = ओ (a + ū = o)" },
];

export function applySandhi(first: string, second: string): SandhiRule | null {
  return SANDHI_RULES.find(r => r.first === first && r.second === second) || null;
}

// Code-to-Sanskrit compiler
export interface CompilerResult {
  sanskrit: string;
  devanagari: string;
  explanation: string;
  paniниRule: string;
}

const CONDITION_MAP: Record<string, { sanskrit: string; devanagari: string }> = {
  "rain": { sanskrit: "varṣā bhavati", devanagari: "वर्षा भवति" },
  "sun": { sanskrit: "sūryaḥ tapati", devanagari: "सूर्यः तपति" },
  "happy": { sanskrit: "ānanditaḥ asti", devanagari: "आनन्दितः अस्ति" },
  "sad": { sanskrit: "duḥkhitaḥ asti", devanagari: "दुःखितः अस्ति" },
  "hot": { sanskrit: "uṣṇam asti", devanagari: "उष्णम् अस्ति" },
  "cold": { sanskrit: "śītalam asti", devanagari: "शीतलम् अस्ति" },
  "true": { sanskrit: "satyam asti", devanagari: "सत्यम् अस्ति" },
  "false": { sanskrit: "asatyam asti", devanagari: "असत्यम् अस्ति" },
};

const ACTION_MAP: Record<string, { sanskrit: string; devanagari: string }> = {
  "go home": { sanskrit: "gṛham gacchatu", devanagari: "गृहम् गच्छतु" },
  "study": { sanskrit: "adhyayanam karotu", devanagari: "अध्ययनम् करोतु" },
  "eat": { sanskrit: "bhojanam karotu", devanagari: "भोजनम् करोतु" },
  "sleep": { sanskrit: "nidrām karotu", devanagari: "निद्राम् करोतु" },
  "read": { sanskrit: "paṭhatu", devanagari: "पठतु" },
  "write": { sanskrit: "likhatu", devanagari: "लिखतु" },
  "speak": { sanskrit: "vadatu", devanagari: "वदतु" },
  "walk": { sanskrit: "calatu", devanagari: "चलतु" },
  "run": { sanskrit: "dhāvatu", devanagari: "धावतु" },
  "sing": { sanskrit: "gāyatu", devanagari: "गायतु" },
};

export function compileToSanskrit(code: string): CompilerResult {
  const ifMatch = code.match(/if\s*\(\s*(\w+)\s*\)\s*\{?\s*([^}]+)\s*\}?/);
  const elseMatch = code.match(/else\s*\{?\s*([^}]+)\s*\}?/);

  if (!ifMatch) {
    return {
      sanskrit: "Error: Please use if/else format",
      devanagari: "त्रुटिः: कृपया if/else प्रारूपं प्रयोजयतु",
      explanation: "Could not parse the code structure.",
      paniниRule: "N/A",
    };
  }

  const condition = ifMatch[1].toLowerCase().trim();
  const thenAction = ifMatch[2].toLowerCase().trim().replace(/;/g, "").trim();
  const elseAction = elseMatch ? elseMatch[1].toLowerCase().trim().replace(/;/g, "").trim() : null;

  const condSkt = CONDITION_MAP[condition] || { sanskrit: condition, devanagari: condition };
  const thenSkt = ACTION_MAP[thenAction] || { sanskrit: thenAction, devanagari: thenAction };
  const elseSkt = elseAction ? (ACTION_MAP[elseAction] || { sanskrit: elseAction, devanagari: elseAction }) : null;

  const sanskrit = elseSkt
    ? `yadi ${condSkt.sanskrit} tadā ${thenSkt.sanskrit}, anyathā ${elseSkt.sanskrit}`
    : `yadi ${condSkt.sanskrit} tadā ${thenSkt.sanskrit}`;

  const devanagari = elseSkt
    ? `यदि ${condSkt.devanagari} तदा ${thenSkt.devanagari}, अन्यथा ${elseSkt.devanagari}`
    : `यदि ${condSkt.devanagari} तदा ${thenSkt.devanagari}`;

  return {
    sanskrit,
    devanagari,
    explanation: `Conditional: "yadi...tadā" (if...then) follows Pāṇini's sūtra structure for conditional statements (vibhakti-based sentence construction).`,
    paniниRule: "Aṣṭādhyāyī 2.3.73 — Conditional particle usage",
  };
}

// Shloka data
export interface Shloka {
  id: string;
  sanskrit: string;
  transliteration: string;
  meaning: string;
  source: string;
  theme: string;
}

export const SHLOKAS: Shloka[] = [
  {
    id: "bg-2-47",
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    meaning: "You have a right to perform your prescribed duty, but never to the fruits of action. Never consider yourself the cause of results, nor be attached to inaction.",
    source: "Bhagavad Gītā 2.47",
    theme: "duty",
  },
  {
    id: "bg-4-7",
    sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
    transliteration: "yadā yadā hi dharmasya glānir bhavati bhārata\nabhyutthānam adharmasya tadātmānaṃ sṛjāmy aham",
    meaning: "Whenever there is a decline of righteousness and rise of unrighteousness, O Arjuna, then I manifest Myself.",
    source: "Bhagavad Gītā 4.7",
    theme: "dharma",
  },
  {
    id: "bg-6-5",
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    transliteration: "uddhared ātmanātmānaṃ nātmānam avasādayet\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
    meaning: "One must elevate, not degrade, oneself. The mind is the friend of the self, and the mind is the enemy of the self.",
    source: "Bhagavad Gītā 6.5",
    theme: "self",
  },
  {
    id: "pt-1",
    sanskrit: "अनागतविधाता च प्रत्युत्पन्नमतिस्तथा।\nद्वावेतौ सुखमेधेते यद्भविष्यो विनश्यति॥",
    transliteration: "anāgata-vidhātā ca pratyutpanna-matis tathā\ndvāv etau sukham edhete yad-bhaviṣyo vinaśyati",
    meaning: "One who plans for the future and one who is quick-witted — these two prosper. But the one who depends on fate perishes.",
    source: "Pañcatantra 1",
    theme: "wisdom",
  },
];

// Shastras wisdom database
export interface WisdomEntry {
  question: string;
  keywords: string[];
  verse: string;
  source: string;
  advice: string;
}

export const WISDOM_DATABASE: WisdomEntry[] = [
  {
    question: "I'm stressed about work",
    keywords: ["stress", "work", "pressure", "burnout", "job", "career", "overwhelmed"],
    verse: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन",
    source: "Bhagavad Gītā 2.47",
    advice: "Focus on your actions, not outcomes. The Gītā teaches that attachment to results is the root of anxiety. Perform your duty with excellence, and release the need to control what follows.",
  },
  {
    question: "I feel lost in life",
    keywords: ["lost", "direction", "purpose", "meaning", "confused", "uncertain"],
    verse: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्",
    source: "Bhagavad Gītā 6.5",
    advice: "You are your own greatest ally. The Gītā reminds us that self-elevation comes from within. Start by understanding your own nature (svadharma) and align your actions with it.",
  },
  {
    question: "How do I deal with failure?",
    keywords: ["failure", "fail", "defeat", "loss", "mistake", "wrong"],
    verse: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत",
    source: "Bhagavad Gītā 4.7",
    advice: "Even the cosmos has cycles of decline and renewal. Your setback is not an ending — it's a natural part of the cycle. Rise like dharma rises, again and again.",
  },
  {
    question: "I need to make a decision",
    keywords: ["decision", "choose", "choice", "decide", "dilemma", "options", "plan"],
    verse: "अनागतविधाता च प्रत्युत्पन्नमतिस्तथा",
    source: "Pañcatantra",
    advice: "The Pañcatantra values foresight and quick thinking equally. Plan ahead, but also be ready to adapt. The one who waits for fate to decide perishes.",
  },
  {
    question: "I'm angry at someone",
    keywords: ["angry", "anger", "rage", "frustrated", "hate", "revenge"],
    verse: "क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः",
    source: "Bhagavad Gītā 2.63",
    advice: "Anger leads to delusion, delusion to loss of memory, and then loss of intelligence. The chain reaction destroys wisdom. Break the chain at its first link — choose equanimity.",
  },
  {
    question: "I want to be happy",
    keywords: ["happy", "happiness", "joy", "peace", "content", "satisfaction", "love"],
    verse: "सुखं आत्यन्तिकं यत्तद् बुद्धिग्राह्यमतीन्द्रियम्",
    source: "Bhagavad Gītā 6.21",
    advice: "True happiness transcends the senses. It comes from inner stillness and self-knowledge. The Gītā calls this 'ātyantikaṃ sukham' — the ultimate joy that no external circumstance can take away.",
  },
];

export function findWisdom(query: string): WisdomEntry | null {
  const lower = query.toLowerCase();
  let best: WisdomEntry | null = null;
  let bestScore = 0;

  for (const entry of WISDOM_DATABASE) {
    const score = entry.keywords.filter(k => lower.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return best || WISDOM_DATABASE[0];
}
