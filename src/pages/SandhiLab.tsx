import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SANDHI_RULES, applySandhi, type SandhiRule } from "@/lib/sanskrit";
import { Sparkles, RotateCcw } from "lucide-react";

const VOWELS = ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ"];

const SandhiLab = () => {
  const [first, setFirst] = useState<string | null>(null);
  const [second, setSecond] = useState<string | null>(null);
  const [result, setResult] = useState<SandhiRule | null>(null);
  const [merging, setMerging] = useState(false);

  const handleSelect = (letter: string) => {
    if (!first) {
      setFirst(letter);
    } else if (!second) {
      setSecond(letter);
      // Animate merge
      setMerging(true);
      setTimeout(() => {
        const rule = applySandhi(first, letter);
        setResult(rule);
        setMerging(false);
      }, 800);
    }
  };

  const reset = () => {
    setFirst(null);
    setSecond(null);
    setResult(null);
    setMerging(false);
  };

  return (
    <div className="min-h-screen pt-16 manuscript-bg">
      <div className="container py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient-gold font-devanagari">सन्धि</span>{" "}
            <span className="text-foreground">Lab</span>
          </h1>
          <p className="text-muted-foreground">
            Select two vowels and watch them merge according to Pāṇini's rules
          </p>
        </motion.div>

        {/* Vowel Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {VOWELS.map((v, i) => (
            <motion.button
              key={v}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSelect(v)}
              disabled={merging || !!result}
              className={`w-16 h-16 rounded-xl font-devanagari text-2xl font-bold border transition-all
                ${first === v ? "border-primary bg-primary/20 text-primary scale-110" : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-card/80"}
                ${merging || result ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}
              `}
            >
              {v}
            </motion.button>
          ))}
        </div>

        {/* Merge Arena */}
        <div className="relative flex items-center justify-center gap-8 min-h-[200px] rounded-2xl border border-border bg-card/30 backdrop-blur-sm p-8 mb-8">
          <AnimatePresence mode="wait">
            {first && (
              <motion.div
                key="first"
                initial={{ x: -100, opacity: 0, scale: 0.5 }}
                animate={{
                  x: merging ? 40 : 0,
                  opacity: 1,
                  scale: merging ? 1.3 : 1,
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="text-6xl font-devanagari text-primary animate-pulse-glow rounded-2xl p-4"
              >
                {first}
              </motion.div>
            )}

            {!result && first && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl text-muted-foreground font-light"
              >
                +
              </motion.div>
            )}

            {second && !result && (
              <motion.div
                key="second"
                initial={{ x: 100, opacity: 0, scale: 0.5 }}
                animate={{
                  x: merging ? -40 : 0,
                  opacity: 1,
                  scale: merging ? 1.3 : 1,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="text-6xl font-devanagari text-vedic animate-pulse-glow rounded-2xl p-4"
              >
                {second}
              </motion.div>
            )}

            {merging && (
              <motion.div
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 text-primary animate-spin" />
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                className="text-center"
              >
                <div className="text-8xl font-devanagari text-gradient-gold mb-4">
                  {result.result}
                </div>
                <div className="text-sm text-muted-foreground">
                  {result.first} + {result.second} = {result.result}
                </div>
              </motion.div>
            )}

            {!first && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted-foreground text-center"
              >
                Select a vowel to begin the Sandhi transformation
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Result Info */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-xl border border-border bg-card p-6 mb-8"
            >
              <div className="flex items-baseline gap-3 mb-3">
                <h3 className="text-lg font-semibold text-primary">{result.name}</h3>
                <span className="font-devanagari text-muted-foreground">{result.nameDevanagari}</span>
              </div>
              <p className="text-foreground font-mono text-sm mb-2">{result.explanation}</p>
              {!result && (
                <p className="text-sm text-muted-foreground">No matching Sandhi rule found for this combination.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {(first || result) && (
          <div className="text-center">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        )}

        {/* Reference Table */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Sandhi Reference <span className="font-devanagari text-muted-foreground text-base">सन्धि नियमाः</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SANDHI_RULES.map((rule, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-lg border border-border bg-card/50 hover:border-primary/30 transition-colors"
              >
                <div className="font-devanagari text-xl text-center mb-1">
                  <span className="text-primary">{rule.first}</span>
                  <span className="text-muted-foreground mx-1">+</span>
                  <span className="text-vedic">{rule.second}</span>
                  <span className="text-muted-foreground mx-1">=</span>
                  <span className="text-gradient-gold">{rule.result}</span>
                </div>
                <p className="text-xs text-muted-foreground text-center">{rule.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SandhiLab;
