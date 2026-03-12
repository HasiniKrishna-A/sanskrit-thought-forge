import { motion } from "framer-motion";
import { SHLOKAS } from "@/lib/sanskrit";
import { BookOpen } from "lucide-react";

const THEMES: Record<string, string> = {
  duty: "from-primary/20 to-vedic/10",
  dharma: "from-vedic/20 to-primary/10",
  self: "from-primary/10 to-secondary/20",
  wisdom: "from-secondary/20 to-vedic/10",
};

const GalleryPage = () => {
  return (
    <div className="min-h-screen pt-16 manuscript-bg">
      <div className="container py-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient-gold font-devanagari">श्लोक</span>{" "}
            <span className="text-foreground">Art Gallery</span>
          </h1>
          <p className="text-muted-foreground">
            Ancient verses as visual meditations — each shloka, a world of meaning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SHLOKAS.map((shloka, i) => (
            <motion.div
              key={shloka.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className={`rounded-2xl border border-border bg-gradient-to-br ${THEMES[shloka.theme] || THEMES.duty} backdrop-blur-sm overflow-hidden sanskrit-hover`}>
                {/* Card top - verse */}
                <div className="p-8 pb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-xs font-mono text-primary">{shloka.source}</span>
                  </div>
                  <p className="font-devanagari text-xl leading-loose text-foreground whitespace-pre-line">
                    {shloka.sanskrit}
                  </p>
                </div>

                {/* Divider */}
                <div className="mx-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {/* Card bottom - translation */}
                <div className="p-8 pt-4">
                  <p className="text-sm text-muted-foreground italic font-mono mb-3 leading-relaxed">
                    {shloka.transliteration}
                  </p>
                  <p className="text-sm text-secondary-foreground leading-relaxed">
                    {shloka.meaning}
                  </p>
                </div>

                {/* Theme tag */}
                <div className="px-8 pb-4">
                  <span className="inline-block px-3 py-1 text-xs rounded-full border border-border text-muted-foreground capitalize">
                    {shloka.theme}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
