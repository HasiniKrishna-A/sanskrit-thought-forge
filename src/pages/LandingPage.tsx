import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Combine, BookOpen, MessageCircle, Sparkles, GraduationCap, Flame, Trophy } from "lucide-react";

const FEATURES = [
  {
    icon: MessageCircle,
    title: "AI Sanskrit Assistant",
    devanagari: "कृत्रिमबुद्धि सहायकः",
    description: "Ask anything — grammar breakdowns, shloka meanings, translations. Powered by AI, rooted in Shastras.",
    path: "/wisdom",
    accent: "from-primary/15 to-vedic/10",
    iconBg: "bg-primary/10",
  },
  {
    icon: Combine,
    title: "Smart Sandhi Visualizer",
    devanagari: "सन्धि दर्शनम्",
    description: "Watch letters merge with gravity-defying animations. Every rule explained, every transformation visualized.",
    path: "/sandhi",
    accent: "from-vedic/15 to-primary/10",
    iconBg: "bg-vedic/10",
  },
  {
    icon: Code,
    title: "Sanskrit Code Compiler",
    devanagari: "संस्कृत संकलकः",
    description: "Write Python-like logic, get grammatically correct Sanskrit. Where Pāṇini meets Python, literally.",
    path: "/compiler",
    accent: "from-primary/10 to-secondary/20",
    iconBg: "bg-primary/10",
  },
  {
    icon: BookOpen,
    title: "Shloka Explorer",
    devanagari: "श्लोक अन्वेषणम्",
    description: "Famous verses with word-by-word meaning, grammar analysis, and context. Sanskrit literature, decoded.",
    path: "/gallery",
    accent: "from-secondary/20 to-vedic/10",
    iconBg: "bg-secondary",
  },
  {
    icon: GraduationCap,
    title: "Grammar Help Bot",
    devanagari: "व्याकरणाचार्यः",
    description: "Submit Sanskrit text for corrections. Learn vibhakti, dhātu conjugations, and Pāṇini's sūtras interactively.",
    path: "/help",
    accent: "from-vedic/10 to-primary/10",
    iconBg: "bg-vedic/10",
  },
  {
    icon: Trophy,
    title: "Gamified Practice",
    devanagari: "अभ्यास क्रीडा",
    description: "Daily challenges, XP points, streaks, and levels. Learn Sanskrit like it's a game — because it should be.",
    path: "/practice",
    accent: "from-primary/15 to-secondary/15",
    iconBg: "bg-primary/10",
  },
];

const STATS = [
  { value: "4000+", label: "Dhātu roots" },
  { value: "~3959", label: "Pāṇini's sūtras" },
  { value: "8", label: "Vibhaktis" },
  { value: "∞", label: "Possibilities" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen pt-14 manuscript-bg relative overflow-hidden">
      {/* Ambient particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="floating-particle"
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 4) * 20}%`,
            animationDelay: `${i * 1.2}s`,
            width: `${2 + (i % 3) * 2}px`,
            height: `${2 + (i % 3) * 2}px`,
          }}
        />
      ))}

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-20 pb-16 md:pt-28 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-4xl relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-muted/30 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">Where Pāṇini meets Python</span>
          </motion.div>

          <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold mb-4 tracking-tight leading-none">
            <span className="text-gradient-gold font-devanagari">संस्कृतम्</span>
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-light text-foreground/80 mb-6 tracking-wide">
            Hub
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            An AI-powered interactive Sanskrit ecosystem. Master grammar with intelligent bots,
            visualize Sandhi transformations, compile code to Sanskrit, and level up with daily challenges.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/wisdom"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              Start Chatting
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/practice"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-border/50 bg-card/30 text-foreground font-medium text-sm transition-all hover:bg-card/60 hover:border-primary/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Flame className="w-4 h-4 text-vedic" />
              Daily Challenge
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-border/30">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient-gold font-display">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Everything you need to master <span className="text-gradient-gold">Sanskrit</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Six powerful tools, one beautiful platform. From beginner to scholar.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {FEATURES.map(feature => (
            <motion.div key={feature.path} variants={item}>
              <Link
                to={feature.path}
                className="group block p-6 rounded-2xl glass-card-hover h-full"
              >
                <div className={`inline-flex p-2.5 rounded-xl ${feature.iconBg} mb-4`}>
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs font-devanagari text-muted-foreground mb-3">
                  {feature.devanagari}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                  Explore <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center rounded-3xl glass-card p-12 md:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 dot-pattern opacity-30" />
            <div className="relative z-10">
              <h2 className="font-devanagari text-4xl md:text-5xl text-gradient-gold mb-4">
                विद्या ददाति विनयम्
              </h2>
              <p className="text-lg text-muted-foreground mb-2 font-display italic">
                "Knowledge gives humility"
              </p>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                Begin your journey into the most precisely engineered language in human history.
              </p>
              <Link
                to="/guide"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]"
              >
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 relative z-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span className="font-devanagari text-sm text-primary/50">संस्कृतम् Hub</span>
          <span className="font-mono tracking-wide">Where Pāṇini meets Python</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
