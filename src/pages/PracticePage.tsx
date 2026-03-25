import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, Zap, Star, Check, X, ArrowRight, RotateCcw } from "lucide-react";
import {
  loadProgress, addXp, getDailyChallenges, getXpForNextLevel, getLevelTitle,
  type Challenge, type UserProgress
} from "@/lib/gamification";

const TYPE_LABELS: Record<string, string> = {
  sandhi: "सन्धि",
  vibhakti: "विभक्ति",
  dhatu: "धातु",
  translate: "अनुवाद",
  identify: "ज्ञान",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-green-400 bg-green-400/10",
  medium: "text-primary bg-primary/10",
  hard: "text-vedic bg-vedic/10",
};

const PracticePage = () => {
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [challenges] = useState<Challenge[]>(getDailyChallenges());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);
  const [completed, setCompleted] = useState(false);

  const xpInfo = getXpForNextLevel(progress.xp);
  const challenge = challenges[currentIndex];
  const isCorrect = selectedAnswer === challenge?.correctIndex;
  const todayStr = new Date().toISOString().split("T")[0];
  const alreadyCompleted = progress.completedChallenges.includes(todayStr);

  useEffect(() => {
    if (alreadyCompleted) setCompleted(true);
  }, [alreadyCompleted]);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    if (index === challenge.correctIndex) {
      const updated = addXp(challenge.xpReward);
      setProgress(updated);
      setSessionXp(prev => prev + challenge.xpReward);
    }
  };

  const handleNext = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Mark today as completed
      const p = loadProgress();
      if (!p.completedChallenges.includes(todayStr)) {
        p.completedChallenges.push(todayStr);
        p.totalChallengesCompleted += 1;
      }
      const { saveProgress } = require("@/lib/gamification");
      saveProgress(p);
      setProgress(p);
      setCompleted(true);
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCompleted(false);
    setSessionXp(0);
  };

  return (
    <div className="min-h-screen pt-14 manuscript-bg relative">
      <div className="container py-8 max-w-4xl relative z-10">
        {/* Header with progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="text-gradient-gold font-devanagari">अभ्यासः</span>{" "}
                <span className="text-foreground">Daily Practice</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Complete 5 challenges to keep your streak alive</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-4 h-4 text-vedic" />
                <span className="text-2xl font-bold text-foreground">{progress.streak}</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Day Streak</span>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold text-foreground">{progress.xp}</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Total XP</span>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold text-foreground">{progress.level}</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Level</span>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold text-foreground">{progress.totalChallengesCompleted}</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Days Done</span>
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="mt-4 glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-mono">
                Level {progress.level} — {getLevelTitle(progress.level)}
              </span>
              <span className="text-xs text-primary font-mono">
                {xpInfo.current}/{xpInfo.needed} XP
              </span>
            </div>
            <div className="xp-bar">
              <motion.div
                className="xp-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${xpInfo.progress * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Challenge area */}
        <AnimatePresence mode="wait">
          {completed ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-10 text-center"
            >
              <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {alreadyCompleted ? "Already completed today!" : "Challenge Complete!"}
              </h2>
              {sessionXp > 0 && (
                <div className="streak-badge mx-auto mb-4">
                  <Zap className="w-3.5 h-3.5" />
                  +{sessionXp} XP earned
                </div>
              )}
              <p className="text-muted-foreground mb-6">
                Come back tomorrow for new challenges. Keep your streak alive!
              </p>
              <button
                onClick={resetSession}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Practice Again
              </button>
            </motion.div>
          ) : challenge ? (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              {/* Progress dots */}
              <div className="px-6 pt-5 flex items-center gap-2">
                {challenges.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i < currentIndex ? "bg-primary" : i === currentIndex ? "bg-primary/50" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Question */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${DIFFICULTY_COLORS[challenge.difficulty]}`}>
                    {challenge.difficulty}
                  </span>
                  <span className="text-xs font-devanagari text-muted-foreground">
                    {TYPE_LABELS[challenge.type]}
                  </span>
                  <span className="ml-auto streak-badge text-[10px]">
                    <Zap className="w-3 h-3" />
                    +{challenge.xpReward} XP
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">{challenge.question}</h3>
                {challenge.questionDevanagari && (
                  <p className="font-devanagari text-2xl text-primary/70 mb-6">{challenge.questionDevanagari}</p>
                )}

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  {challenge.options.map((opt, i) => {
                    let style = "border-border/50 hover:border-primary/30 hover:bg-muted/30";
                    if (showResult) {
                      if (i === challenge.correctIndex) style = "border-green-500/50 bg-green-500/10 text-green-400";
                      else if (i === selectedAnswer) style = "border-red-500/50 bg-red-500/10 text-red-400";
                      else style = "border-border/30 opacity-40";
                    } else if (selectedAnswer === i) {
                      style = "border-primary bg-primary/10";
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={showResult}
                        className={`p-4 rounded-xl border text-left transition-all text-sm font-medium ${style}`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full border border-current/30 flex items-center justify-center text-xs shrink-0">
                            {showResult && i === challenge.correctIndex ? <Check className="w-4 h-4" /> :
                             showResult && i === selectedAnswer && !isCorrect ? <X className="w-4 h-4" /> :
                             String.fromCharCode(65 + i)}
                          </span>
                          <span className="font-devanagari text-base">{opt}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6"
                    >
                      <div className={`p-4 rounded-xl border ${isCorrect ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                        <p className={`text-sm font-semibold mb-1 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                          {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                        </p>
                        <p className="text-sm text-muted-foreground">{challenge.explanation}</p>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={handleNext}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:shadow-lg hover:shadow-primary/20"
                        >
                          {currentIndex < challenges.length - 1 ? "Next" : "Finish"}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PracticePage;
