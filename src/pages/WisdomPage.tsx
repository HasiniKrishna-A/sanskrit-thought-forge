import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { findWisdom, type WisdomEntry } from "@/lib/sanskrit";
import { Send, BookOpen, RefreshCw } from "lucide-react";

const QUICK_QUESTIONS = [
  "I'm stressed about work",
  "I feel lost in life",
  "How do I deal with failure?",
  "I need to make a decision",
  "I'm angry at someone",
  "I want to be happy",
];

const WisdomPage = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<WisdomEntry | null>(null);
  const [thinking, setThinking] = useState(false);

  const ask = (q?: string) => {
    const question = q || query;
    if (!question.trim()) return;
    setThinking(true);
    setResult(null);
    setTimeout(() => {
      setResult(findWisdom(question));
      setThinking(false);
    }, 800);
  };

  return (
    <div className="min-h-screen pt-16 manuscript-bg">
      <div className="container py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient-gold font-devanagari">शास्त्र</span>{" "}
            <span className="text-foreground">Wisdom Engine</span>
          </h1>
          <p className="text-muted-foreground">
            What would the Shastras say? Ask a modern question, receive ancient wisdom.
          </p>
        </motion.div>

        {/* Input */}
        <div className="relative mb-6">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && ask()}
            placeholder="Ask about life, work, relationships..."
            className="w-full px-6 py-4 pr-14 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <button
            onClick={() => ask()}
            disabled={thinking || !query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Quick questions */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {QUICK_QUESTIONS.map(q => (
            <button
              key={q}
              onClick={() => { setQuery(q); ask(q); }}
              className="px-3 py-1.5 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {thinking && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="font-devanagari text-2xl text-primary animate-pulse mb-2">
                चिन्तयामि...
              </div>
              <p className="text-xs text-muted-foreground">Consulting the Shastras...</p>
            </motion.div>
          )}

          {!thinking && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              {/* Verse */}
              <div className="p-8 bg-gradient-to-br from-primary/10 to-vedic/5">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-mono text-primary">{result.source}</span>
                </div>
                <p className="font-devanagari text-2xl leading-loose text-gradient-gold text-center">
                  {result.verse}
                </p>
              </div>

              {/* Advice */}
              <div className="p-8">
                <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
                  The Shastras Say
                </h3>
                <p className="text-foreground leading-relaxed text-lg">
                  {result.advice}
                </p>
              </div>

              {/* Reset */}
              <div className="px-8 pb-6">
                <button
                  onClick={() => { setResult(null); setQuery(""); }}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Ask another question
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WisdomPage;
