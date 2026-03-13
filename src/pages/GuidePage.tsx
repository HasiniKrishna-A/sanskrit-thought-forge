import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Languages, PenTool, MessageCircle, Music, ScrollText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const STEPS = [
  {
    step: 1,
    title: "Master the Script",
    titleSanskrit: "लिपिज्ञानम्",
    icon: PenTool,
    description: "Learn the Devanagari script — vowels (स्वराः), consonants (व्यञ्जनानि), and how they combine.",
    topics: [
      "14 vowels (अ आ इ ई उ ऊ ऋ ॠ ऌ ए ऐ ओ औ)",
      "33 consonants organized by mouth position",
      "Conjunct consonants (संयुक्ताक्षराणि)",
      "Practice writing each letter daily",
    ],
    color: "from-primary/20 to-primary/5",
  },
  {
    step: 2,
    title: "Understand Sandhi",
    titleSanskrit: "सन्धिज्ञानम्",
    icon: Languages,
    description: "Sandhi is the heart of Sanskrit — learn how sounds merge when words meet.",
    topics: [
      "Vowel Sandhi (अच् सन्धिः) — how vowels combine",
      "Consonant Sandhi (हल् सन्धिः) — consonant transformations",
      "Visarga Sandhi (विसर्ग सन्धिः)",
      "Practice with our interactive Sandhi Lab →",
    ],
    color: "from-accent/20 to-accent/5",
    link: "/sandhi",
  },
  {
    step: 3,
    title: "Learn Vibhakti (Cases)",
    titleSanskrit: "विभक्तिज्ञानम्",
    icon: ScrollText,
    description: "Sanskrit uses 8 cases (vibhaktis) instead of prepositions. This is the key to sentence structure.",
    topics: [
      "प्रथमा (Nominative) — subject: रामः गच्छति",
      "द्वितीया (Accusative) — object: रामं पश्यति",
      "तृतीया (Instrumental) — by/with: रामेण सह",
      "चतुर्थी (Dative), पञ्चमी (Ablative), षष्ठी (Genitive), सप्तमी (Locative), सम्बोधन (Vocative)",
    ],
    color: "from-vedic/20 to-vedic/5",
  },
  {
    step: 4,
    title: "Master Dhātu (Verb Roots)",
    titleSanskrit: "धातुज्ञानम्",
    icon: BookOpen,
    description: "Sanskrit verbs derive from root forms called dhātus. Learn the 10 gaṇas (classes).",
    topics: [
      "भ्वादिगणः (1st class): √भू → भवति (to be)",
      "अदादिगणः (2nd class): √अस् → अस्ति (to exist)",
      "Parasmaipada vs Ātmanepada voices",
      "Present (लट्), Past (लङ्), Future (लृट्) tenses",
    ],
    color: "from-primary/20 to-primary/5",
  },
  {
    step: 5,
    title: "Build Sentences",
    titleSanskrit: "वाक्यरचना",
    icon: MessageCircle,
    description: "Sanskrit word order is flexible, but learning common patterns helps fluency.",
    topics: [
      "Subject-Object-Verb (SOV) is most common",
      "Use the Code-to-Sanskrit Compiler to practice →",
      "Avyayas (indeclinables): च, वा, एव, अपि, तु",
      "Simple sentences → compound → complex",
    ],
    color: "from-accent/20 to-accent/5",
    link: "/compiler",
  },
  {
    step: 6,
    title: "Read Shlokas & Literature",
    titleSanskrit: "साहित्यपठनम्",
    icon: Music,
    description: "Immerse yourself in real Sanskrit by reading verses from the Gītā, Rāmāyaṇa, and Subhāṣitas.",
    topics: [
      "Start with simple subhāṣitas (wise sayings)",
      "Read Bhagavad Gītā verses with commentary",
      "Explore our Shloka Art Gallery →",
      "Listen to Sanskrit chanting for pronunciation",
    ],
    color: "from-vedic/20 to-vedic/5",
    link: "/gallery",
  },
];

const RESOURCES = [
  { title: "Use the Grammar Help Bot", description: "Get instant corrections and explanations", link: "/help", internal: true },
  { title: "Sandhi Lab", description: "Visualize how sounds merge interactively", link: "/sandhi", internal: true },
  { title: "Code-to-Sanskrit Compiler", description: "Learn sentence structure through logic", link: "/compiler", internal: true },
  { title: "Wisdom Chat", description: "Explore Bhagavad Gītā teachings", link: "/wisdom", internal: true },
];

const GuidePage = () => {
  return (
    <div className="min-h-screen pt-16 manuscript-bg">
      <div className="container py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="text-gradient-gold font-devanagari">पथदर्शिका</span>{" "}
            <span className="text-foreground">Learning Guide</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            A structured path to learn Sanskrit from zero — script to literature, step by step.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${step.color} p-6 md:p-8`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">STEP {step.step}</span>
                      <span className="font-devanagari text-sm text-primary/70">{step.titleSanskrit}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">{step.title}</h2>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <ul className="space-y-3">
                  {step.topics.map((topic, j) => (
                    <li key={j} className="flex items-start gap-3 text-foreground">
                      <ChevronRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>
                        {topic.includes("→") && step.link ? (
                          <>
                            {topic.split("→")[0]}
                            <Link to={step.link} className="text-primary hover:underline">→ Try it</Link>
                          </>
                        ) : (
                          topic
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            <span className="font-devanagari text-gradient-gold">साधनानि</span> — Your Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RESOURCES.map((r) => (
              <Link
                key={r.title}
                to={r.link}
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {r.title}
                </h3>
                <p className="text-sm text-muted-foreground">{r.description}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GuidePage;
