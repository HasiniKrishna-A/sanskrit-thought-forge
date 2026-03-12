import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { compileToSanskrit } from "@/lib/sanskrit";
import { Play, RotateCcw, Copy, Check } from "lucide-react";

const DEFAULT_CODE = `if (rain) {
  go home
} else {
  study
}`;

const EXAMPLES = [
  { label: "Rain check", code: `if (rain) {\n  go home\n} else {\n  study\n}` },
  { label: "Sunny day", code: `if (sun) {\n  walk\n} else {\n  read\n}` },
  { label: "Mood", code: `if (happy) {\n  sing\n} else {\n  sleep\n}` },
  { label: "Temperature", code: `if (hot) {\n  run\n} else {\n  eat\n}` },
];

const CompilerPage = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [result, setResult] = useState<ReturnType<typeof compileToSanskrit> | null>(null);
  const [compiling, setCompiling] = useState(false);
  const [copied, setCopied] = useState(false);

  const compile = () => {
    setCompiling(true);
    setResult(null);
    setTimeout(() => {
      setResult(compileToSanskrit(code));
      setCompiling(false);
    }, 600);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.devanagari);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-16 manuscript-bg">
      <div className="container py-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-foreground">Code →</span>{" "}
            <span className="text-gradient-gold font-devanagari">संस्कृतम्</span>
          </h1>
          <p className="text-muted-foreground">
            Write if/else logic. Get grammatically correct Sanskrit following Pāṇini's sūtras.
          </p>
        </motion.div>

        {/* Examples */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {EXAMPLES.map(ex => (
            <button
              key={ex.label}
              onClick={() => { setCode(ex.code); setResult(null); }}
              className="px-3 py-1.5 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              {ex.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-primary/40" />
                <div className="w-3 h-3 rounded-full bg-primary/20" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2">input.logic</span>
            </div>
            <textarea
              value={code}
              onChange={e => { setCode(e.target.value); setResult(null); }}
              className="w-full h-64 p-4 bg-transparent text-foreground font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">output.saṃskṛtam</span>
              </div>
              {result && (
                <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors">
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
            <div className="h-64 p-4 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {compiling && (
                  <motion.div
                    key="compiling"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="font-devanagari text-2xl text-primary animate-pulse">
                      संकलनम्...
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Applying Pāṇini's sūtras...</p>
                  </motion.div>
                )}
                {!compiling && result && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full space-y-4"
                  >
                    <div className="font-devanagari text-2xl text-gradient-gold leading-relaxed text-center">
                      {result.devanagari}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono text-center italic">
                      {result.sanskrit}
                    </div>
                    <div className="border-t border-border pt-3 space-y-2">
                      <p className="text-xs text-muted-foreground">{result.explanation}</p>
                      <p className="text-xs text-primary font-mono">{result.paniниRule}</p>
                    </div>
                  </motion.div>
                )}
                {!compiling && !result && (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-muted-foreground text-sm text-center"
                  >
                    Click "Compile" to transform your code into Sanskrit
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={compile}
            disabled={compiling}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all hover:shadow-lg hover:shadow-primary/20 hover:scale-105 disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            Compile
          </button>
          <button
            onClick={() => { setCode(DEFAULT_CODE); setResult(null); }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Supported Keywords */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 rounded-xl border border-border bg-card/50 p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Supported Keywords</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-primary mb-2">Conditions</h4>
              <div className="flex flex-wrap gap-2">
                {["rain", "sun", "happy", "sad", "hot", "cold", "true", "false"].map(k => (
                  <span key={k} className="px-2 py-1 text-xs font-mono rounded bg-secondary text-secondary-foreground">
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-primary mb-2">Actions</h4>
              <div className="flex flex-wrap gap-2">
                {["go home", "study", "eat", "sleep", "read", "write", "speak", "walk", "run", "sing"].map(k => (
                  <span key={k} className="px-2 py-1 text-xs font-mono rounded bg-secondary text-secondary-foreground">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompilerPage;
