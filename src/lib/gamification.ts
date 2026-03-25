// Gamification system - localStorage-based

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string; // ISO date string
  completedChallenges: string[];
  totalChallengesCompleted: number;
}

export interface Challenge {
  id: string;
  type: "sandhi" | "vibhakti" | "dhatu" | "translate" | "identify";
  question: string;
  questionDevanagari?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
  difficulty: "easy" | "medium" | "hard";
}

const STORAGE_KEY = "sanskritam-progress";

const LEVELS = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000, 7000, 10000];

export function getLevel(xp: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i]) return i + 1;
  }
  return 1;
}

export function getXpForNextLevel(xp: number): { current: number; needed: number; progress: number } {
  const level = getLevel(xp);
  const currentThreshold = LEVELS[level - 1] || 0;
  const nextThreshold = LEVELS[level] || LEVELS[LEVELS.length - 1] + 2000;
  const current = xp - currentThreshold;
  const needed = nextThreshold - currentThreshold;
  return { current, needed, progress: Math.min(current / needed, 1) };
}

export function getLevelTitle(level: number): string {
  const titles = [
    "शिष्यः (Student)",
    "अध्येता (Learner)",
    "ज्ञानी (Knowledgeable)",
    "विद्वान् (Scholar)",
    "पण्डितः (Pundit)",
    "आचार्यः (Teacher)",
    "गुरुः (Master)",
    "महागुरुः (Grand Master)",
    "ऋषिः (Sage)",
    "ब्रह्मज्ञानी (Enlightened)",
    "सर्वज्ञः (Omniscient)",
    "पाणिनिः (Panini-level)",
  ];
  return titles[Math.min(level - 1, titles.length - 1)];
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // Check streak
      const today = new Date().toISOString().split("T")[0];
      const lastActive = data.lastActiveDate;
      if (lastActive) {
        const diff = Math.floor((new Date(today).getTime() - new Date(lastActive).getTime()) / 86400000);
        if (diff > 1) data.streak = 0; // streak broken
      }
      return data;
    }
  } catch {}
  return { xp: 0, level: 1, streak: 0, lastActiveDate: "", completedChallenges: [], totalChallengesCompleted: 0 };
}

export function saveProgress(progress: UserProgress) {
  progress.level = getLevel(progress.xp);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function addXp(amount: number): UserProgress {
  const progress = loadProgress();
  const today = new Date().toISOString().split("T")[0];
  if (progress.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    progress.streak = progress.lastActiveDate === yesterday ? progress.streak + 1 : 1;
  }
  progress.xp += amount;
  progress.lastActiveDate = today;
  progress.level = getLevel(progress.xp);
  saveProgress(progress);
  return progress;
}

// Challenge bank
export const CHALLENGE_BANK: Challenge[] = [
  {
    id: "s1", type: "sandhi", difficulty: "easy", xpReward: 20,
    question: "What is the result of अ + इ ?",
    questionDevanagari: "अ + इ = ?",
    options: ["ए", "ऐ", "ओ", "आ"],
    correctIndex: 0,
    explanation: "By Guṇa Sandhi (Pāṇini 6.1.87): a + i = e (ए)"
  },
  {
    id: "s2", type: "sandhi", difficulty: "easy", xpReward: 20,
    question: "What is the result of अ + उ ?",
    questionDevanagari: "अ + उ = ?",
    options: ["औ", "ओ", "आ", "अउ"],
    correctIndex: 1,
    explanation: "By Guṇa Sandhi: a + u = o (ओ)"
  },
  {
    id: "s3", type: "sandhi", difficulty: "easy", xpReward: 20,
    question: "What is the result of अ + अ ?",
    questionDevanagari: "अ + अ = ?",
    options: ["अ", "आ", "ए", "ऐ"],
    correctIndex: 1,
    explanation: "By Dīrgha Sandhi (Pāṇini 6.1.101): a + a = ā (आ)"
  },
  {
    id: "s4", type: "sandhi", difficulty: "medium", xpReward: 30,
    question: "What is the result of इ + इ ?",
    questionDevanagari: "इ + इ = ?",
    options: ["इ", "ई", "ए", "ऐ"],
    correctIndex: 1,
    explanation: "By Dīrgha Sandhi: i + i = ī (ई)"
  },
  {
    id: "v1", type: "vibhakti", difficulty: "easy", xpReward: 25,
    question: "Which vibhakti is used for the subject of a sentence?",
    options: ["प्रथमा (Nominative)", "द्वितीया (Accusative)", "तृतीया (Instrumental)", "चतुर्थी (Dative)"],
    correctIndex: 0,
    explanation: "प्रथमा विभक्तिः (Nominative) marks the subject (कर्ता) of a verb."
  },
  {
    id: "v2", type: "vibhakti", difficulty: "medium", xpReward: 30,
    question: "In 'रामेण सह', what vibhakti is used?",
    options: ["प्रथमा", "द्वितीया", "तृतीया", "सप्तमी"],
    correctIndex: 2,
    explanation: "तृतीया विभक्तिः (Instrumental) is used with 'सह' (with)."
  },
  {
    id: "d1", type: "dhatu", difficulty: "easy", xpReward: 25,
    question: "What is the present tense (लट्) form of √गम् (to go) in third person singular?",
    options: ["गच्छति", "गच्छामि", "गच्छसि", "गच्छन्ति"],
    correctIndex: 0,
    explanation: "√गम् → गच्छति (he/she goes). Third person singular, parasmaipada."
  },
  {
    id: "d2", type: "dhatu", difficulty: "medium", xpReward: 30,
    question: "What does the dhātu √पठ् mean?",
    options: ["to eat", "to read/study", "to walk", "to see"],
    correctIndex: 1,
    explanation: "√पठ् means 'to read' or 'to study'. Present: पठति (he reads)."
  },
  {
    id: "t1", type: "translate", difficulty: "easy", xpReward: 20,
    question: "What does 'रामः गच्छति' mean?",
    options: ["Rama eats", "Rama goes", "Rama sleeps", "Rama reads"],
    correctIndex: 1,
    explanation: "रामः (Rama, nominative) + गच्छति (goes) = 'Rama goes'"
  },
  {
    id: "t2", type: "translate", difficulty: "medium", xpReward: 30,
    question: "How do you say 'I read a book' in Sanskrit?",
    options: ["अहं पुस्तकं पठामि", "अहं पुस्तकं गच्छामि", "सः पुस्तकं पठति", "अहं पुस्तकं लिखामि"],
    correctIndex: 0,
    explanation: "अहम् (I) + पुस्तकम् (book, accusative) + पठामि (I read) = 'I read a book'"
  },
  {
    id: "i1", type: "identify", difficulty: "easy", xpReward: 20,
    question: "Which of these is a vowel (स्वरः) in Sanskrit?",
    options: ["क", "ग", "ऋ", "ट"],
    correctIndex: 2,
    explanation: "ऋ (ṛ) is a vowel. क, ग, ट are consonants (व्यञ्जनानि)."
  },
  {
    id: "i2", type: "identify", difficulty: "hard", xpReward: 50,
    question: "Which Pāṇini sūtra governs Guṇa Sandhi?",
    options: ["1.1.1 वृद्धिरादैच्", "6.1.87 आद्गुणः", "6.1.101 अकः सवर्णे दीर्घः", "8.4.58 अनुस्वारस्य ययि"],
    correctIndex: 1,
    explanation: "सूत्रम् 6.1.87 'आद्गुणः' governs Guṇa Sandhi — when अ/आ is followed by इ/उ/ऋ."
  },
];

export function getDailyChallenges(): Challenge[] {
  const today = new Date().toISOString().split("T")[0];
  // Use date as seed for deterministic daily selection
  let seed = 0;
  for (const c of today) seed = ((seed << 5) - seed + c.charCodeAt(0)) | 0;
  seed = Math.abs(seed);

  const shuffled = [...CHALLENGE_BANK].sort((a, b) => {
    const ha = ((seed * 31 + a.id.charCodeAt(0)) % 1000) / 1000;
    const hb = ((seed * 31 + b.id.charCodeAt(0)) % 1000) / 1000;
    return ha - hb;
  });

  return shuffled.slice(0, 5);
}
