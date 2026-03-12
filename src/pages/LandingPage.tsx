import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Combine, Image, BookOpen } from "lucide-react";

const FEATURES = [
  {
    icon: Combine,
    title: "Sandhi Lab",
    devanagari: "सन्धि प्रयोगशाला",
    description: "Drag and merge letters. Watch Pāṇini's rules come alive with gravity-defying animations.",
    path: "/sandhi",
    gradient: "from-primary/20 to-vedic/20",
  },
  {
    icon: Code,
    title: "Code → Sanskrit",
    devanagari: "कूट → संस्कृतम्",
    description: "Write if/else logic. Get grammatically correct Sanskrit output following Aṣṭādhyāyī rules.",
    path: "/compiler",
    gradient: "from-vedic/20 to-primary/20",
  },
  {
    icon: Image,
    title: "Shloka Art Gallery",
    devanagari: "श्लोक चित्रशाला",
    description: "Ancient verses transformed into visual art. Each shloka becomes a unique visual meditation.",
    path: "/gallery",
    gradient: "from-primary/10 to-secondary/30",
  },
  {
    icon: BookOpen,
    title: "Shastra Wisdom",
    devanagari: "शास्त्र प्रज्ञा",
    description: "Ask a modern question. Receive timeless advice from the Bhagavad Gītā and Pañcatantra.",
    path: "/wisdom",
    gradient: "from-secondary/30 to-vedic/10",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen pt-16 manuscript-bg">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 py-24 overflow-hidden">
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="floating-particle"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl relative z-10"
        >
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-mono text-muted-foreground mb-4 tracking-widest uppercase"
          >
            Where Pāṇini meets Python
          </motion.p>
          <h1 className="text-6xl md:text-7xl font-bold mb-2 tracking-tight">
            <span className="text-gradient-gold font-devanagari">संस्कृतम्</span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6">
            Hub
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Ancient linguistics engineered with modern logic. 
            Explore Sandhi transformations, compile code to Sanskrit, 
            and discover timeless wisdom — all in your browser.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              to="/sandhi"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
            >
              Start Exploring
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/compiler"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium transition-all hover:bg-secondary hover:scale-105"
            >
              <Code className="w-4 h-4" />
              Try the Compiler
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="container py-20">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {FEATURES.map(feature => (
            <motion.div key={feature.path} variants={item}>
              <Link
                to={feature.path}
                className="group block p-8 rounded-xl border border-border bg-card/50 backdrop-blur-sm sanskrit-hover"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.gradient} mb-4`}>
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <span className="text-sm font-devanagari text-muted-foreground">
                    {feature.devanagari}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Enter Lab <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="font-devanagari text-lg text-primary/60 mb-2">
            विद्या ददाति विनयम्
          </p>
          <p>Knowledge gives humility — Samskritam Hub</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
