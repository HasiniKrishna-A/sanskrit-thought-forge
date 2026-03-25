import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, RotateCcw, Volume2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PhraseData {
  sanskrit: string;
  transliteration: string;
  meaning: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tips: string[];
}

const PHRASES: PhraseData[] = [
  {
    sanskrit: "नमस्ते",
    transliteration: "namaste",
    meaning: "Greetings / I bow to you",
    difficulty: "beginner",
    tips: ["Stress on the second syllable: na-MAS-te", "The 'a' sounds are short, like in 'but'"],
  },
  {
    sanskrit: "धन्यवादः",
    transliteration: "dhanyavādaḥ",
    meaning: "Thank you",
    difficulty: "beginner",
    tips: ["'dh' is an aspirated 'd' — push air out", "'ā' in vādaḥ is long, hold it slightly longer"],
  },
  {
    sanskrit: "अहम् गच्छामि",
    transliteration: "aham gacchāmi",
    meaning: "I go",
    difficulty: "beginner",
    tips: ["'cch' is a doubled aspirated 'ch'", "'ā' in gacchāmi is long"],
  },
  {
    sanskrit: "कर्मण्येवाधिकारस्ते",
    transliteration: "karmaṇyevādhikāraste",
    meaning: "You have a right to action alone",
    difficulty: "advanced",
    tips: ["'ṇy' — retroflex nasal followed by 'y'", "Maintain the long vowels: evā, kāra"],
  },
  {
    sanskrit: "सत्यमेव जयते",
    transliteration: "satyameva jayate",
    meaning: "Truth alone triumphs",
    difficulty: "intermediate",
    tips: ["'ty' blend — tongue touches teeth", "'j' as in 'just', not like French 'j'"],
  },
  {
    sanskrit: "विद्या ददाति विनयम्",
    transliteration: "vidyā dadāti vinayam",
    meaning: "Knowledge gives humility",
    difficulty: "intermediate",
    tips: ["'dy' — soft dental 'd' + 'y' blend", "Both 'ā' vowels are long"],
  },
  {
    sanskrit: "योगः कर्मसु कौशलम्",
    transliteration: "yogaḥ karmasu kauśalam",
    meaning: "Yoga is skill in action",
    difficulty: "intermediate",
    tips: ["'ś' is a palatal sibilant — like 'sh' but tongue is higher", "'au' in kauśalam is a diphthong"],
  },
  {
    sanskrit: "अहिंसा परमो धर्मः",
    transliteration: "ahiṃsā paramo dharmaḥ",
    meaning: "Non-violence is the highest dharma",
    difficulty: "advanced",
    tips: ["'ṃ' — nasalize the vowel before 's'", "'dh' is aspirated, push air with the 'd'"],
  },
];

type FeedbackState = null | {
  score: number;
  transcript: string;
  details: string[];
};

const PronunciationPage = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [recordedTranscript, setRecordedTranscript] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const recognitionRef = useRef<any>(null);

  const filteredPhrases = selectedDifficulty === "all"
    ? PHRASES
    : PHRASES.filter(p => p.difficulty === selectedDifficulty);

  const currentPhrase = filteredPhrases[currentPhraseIndex % filteredPhrases.length];

  const speakPhrase = useCallback(() => {
    const utterance = new SpeechSynthesisUtterance(currentPhrase.transliteration);
    utterance.lang = "hi-IN";
    utterance.rate = 0.75;
    speechSynthesis.speak(utterance);
  }, [currentPhrase]);

  const analyzePronunciation = useCallback((transcript: string) => {
    const target = currentPhrase.transliteration.toLowerCase().replace(/[ḥṃṇṭḍṛśṣā]/g, (c) => {
      const map: Record<string, string> = { ḥ: "h", ṃ: "m", ṇ: "n", ṭ: "t", ḍ: "d", ṛ: "ri", ś: "sh", ṣ: "sh", ā: "a" };
      return map[c] || c;
    });
    const spoken = transcript.toLowerCase().replace(/[^a-z\s]/g, "");

    const targetWords = target.split(/\s+/);
    const spokenWords = spoken.split(/\s+/);

    let matchCount = 0;
    const details: string[] = [];

    targetWords.forEach((word, i) => {
      const spokenWord = spokenWords[i] || "";
      const similarity = calculateSimilarity(word, spokenWord);
      if (similarity > 0.6) {
        matchCount++;
        if (similarity < 0.9) details.push(`"${word}" — close, minor variation detected`);
      } else {
        details.push(`"${word}" — needs practice, you said "${spokenWord || "(missing)"}"`);
      }
    });

    const score = Math.round((matchCount / Math.max(targetWords.length, 1)) * 100);
    
    if (score >= 80) details.unshift("Excellent pronunciation! 🎉");
    else if (score >= 50) details.unshift("Good attempt — keep practicing! 💪");
    else details.unshift("Let's try again. Listen to the reference first. 🔄");

    setFeedback({ score, transcript, details });
  }, [currentPhrase]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback({
        score: 0,
        transcript: "",
        details: ["Speech recognition is not supported in this browser. Please try Chrome or Edge."],
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setRecordedTranscript(transcript);
      setFeedback({ score: -1, transcript, details: ["Recording captured ✓ Press Check to analyze."] });
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setFeedback({
        score: 0,
        transcript: "",
        details: ["Could not capture audio. Please try again and speak clearly."],
      });
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setFeedback(null);
  }, [analyzePronunciation]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const nextPhrase = () => {
    setCurrentPhraseIndex(prev => (prev + 1) % filteredPhrases.length);
    setFeedback(null);
    setShowTips(false);
  };

  const difficultyColors: Record<string, string> = {
    beginner: "text-green-400 bg-green-400/10 border-green-400/20",
    intermediate: "text-primary bg-primary/10 border-primary/20",
    advanced: "text-vedic bg-vedic/10 border-vedic/20",
  };

  return (
    <div className="min-h-screen pt-14 manuscript-bg">
      <div className="container max-w-3xl py-12 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
            <span className="text-gradient-gold">उच्चारण</span>{" "}
            <span className="text-foreground/80">Checker</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Speak Sanskrit phrases and get instant pronunciation feedback
          </p>
        </motion.div>

        {/* Difficulty Filter */}
        <div className="flex justify-center gap-2 mb-8">
          {["all", "beginner", "intermediate", "advanced"].map(d => (
            <button
              key={d}
              onClick={() => { setSelectedDifficulty(d); setCurrentPhraseIndex(0); setFeedback(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all border ${
                selectedDifficulty === d
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-muted/20 text-muted-foreground border-border/30 hover:border-primary/20"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Main Card */}
        <motion.div layout>
          <Card className="glass-card border-border/30 overflow-hidden">
            <CardContent className="p-8">
              {/* Difficulty badge */}
              <div className="flex items-center justify-between mb-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border ${difficultyColors[currentPhrase.difficulty]}`}>
                  {currentPhrase.difficulty}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {(currentPhraseIndex % filteredPhrases.length) + 1} / {filteredPhrases.length}
                </span>
              </div>

              {/* Sanskrit phrase */}
              <div className="text-center mb-8">
                <motion.div
                  key={currentPhrase.sanskrit}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-5xl md:text-6xl font-devanagari text-gradient-gold mb-3 leading-relaxed"
                >
                  {currentPhrase.sanskrit}
                </motion.div>
                <p className="text-lg text-foreground/70 font-mono tracking-wide mb-1">
                  {currentPhrase.transliteration}
                </p>
                <p className="text-sm text-muted-foreground italic">
                  "{currentPhrase.meaning}"
                </p>
              </div>

              {/* Listen button */}
              <div className="flex justify-center mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={speakPhrase}
                  className="gap-2 border-border/40"
                >
                  <Volume2 className="w-4 h-4" />
                  Listen First
                </Button>
              </div>

              {/* Mic & Check buttons */}
              <div className="flex justify-center items-center gap-4 mb-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={isListening ? stopListening : startListening}
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? "bg-destructive/20 border-2 border-destructive shadow-lg shadow-destructive/20"
                      : "bg-primary/10 border-2 border-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
                  }`}
                >
                  {isListening && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-destructive/40"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  {isListening ? (
                    <MicOff className="w-7 h-7 text-destructive" />
                  ) : (
                    <Mic className="w-7 h-7 text-primary" />
                  )}
                </motion.button>

                <Button
                  size="lg"
                  disabled={isListening || !feedback || feedback.score !== -1 || !feedback.transcript}
                  onClick={() => feedback?.transcript && analyzePronunciation(feedback.transcript)}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Check
                </Button>
              </div>
              <p className="text-center text-xs text-muted-foreground mb-6">
                {isListening ? "Listening... speak now" : "Record your voice, then press Check"}
              </p>

              {/* Feedback */}
              <AnimatePresence mode="wait">
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`rounded-2xl p-6 border ${
                      feedback.score === -1
                        ? "bg-muted/10 border-border/30"
                        : feedback.score >= 80
                        ? "bg-green-500/5 border-green-500/20"
                        : feedback.score >= 50
                        ? "bg-primary/5 border-primary/20"
                        : "bg-destructive/5 border-destructive/20"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {feedback.score === -1 ? (
                        <Mic className="w-6 h-6 text-primary" />
                      ) : feedback.score >= 80 ? (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      ) : feedback.score >= 50 ? (
                        <AlertCircle className="w-6 h-6 text-primary" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive" />
                      )}
                      <div>
                        {feedback.score >= 0 && (
                          <>
                            <span className="text-2xl font-bold text-foreground">{feedback.score}%</span>
                            <span className="text-xs text-muted-foreground ml-2">accuracy</span>
                          </>
                        )}
                        {feedback.score === -1 && (
                          <span className="text-sm font-medium text-foreground">Voice recorded</span>
                        )}
                      </div>
                    </div>
                    {feedback.transcript && (
                      <p className="text-xs text-muted-foreground mb-3">
                        You said: <span className="text-foreground/70">"{feedback.transcript}"</span>
                      </p>
                    )}
                    <ul className="space-y-1.5">
                      {feedback.details.map((d, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{d}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tips toggle */}
              <div className="mt-6">
                <button
                  onClick={() => setShowTips(!showTips)}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  {showTips ? "Hide tips ▲" : "Show pronunciation tips ▼"}
                </button>
                <AnimatePresence>
                  {showTips && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-2 overflow-hidden"
                    >
                      {currentPhrase.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary">•</span>
                          {tip}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border/20">
                <Button variant="ghost" size="sm" onClick={() => { setFeedback(null); setShowTips(false); }} className="gap-2">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </Button>
                <Button size="sm" onClick={nextPhrase} className="gap-2">
                  Next Phrase
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

function calculateSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const len = Math.max(a.length, b.length);
  if (len === 0) return 1;
  let matches = 0;
  const min = Math.min(a.length, b.length);
  for (let i = 0; i < min; i++) {
    if (a[i] === b[i]) matches++;
  }
  return matches / len;
}

export default PronunciationPage;
