import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Home", devanagari: "गृहम्" },
  { path: "/sandhi", label: "Sandhi Lab", devanagari: "सन्धिः" },
  { path: "/compiler", label: "Compiler", devanagari: "संकलकः" },
  { path: "/gallery", label: "Shlokas", devanagari: "श्लोकाः" },
  { path: "/wisdom", label: "Gita Chat", devanagari: "गीता" },
  { path: "/help", label: "Grammar Bot", devanagari: "व्याकरणम्" },
  { path: "/guide", label: "Guide", devanagari: "पथम्" },
  { path: "/practice", label: "Practice", devanagari: "अभ्यासः" },
  { path: "/pronounce", label: "Pronounce", devanagari: "उच्चारणम्" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/70 backdrop-blur-2xl"
    >
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold text-gradient-gold font-devanagari tracking-wide">संस्कृतम्</span>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity">Hub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative px-3 py-1.5 text-xs transition-colors rounded-md ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="font-medium tracking-wide">{item.label}</span>
              {location.pathname === item.path && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/30 bg-background/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="container py-4 grid grid-cols-2 gap-2">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="block text-xs font-devanagari opacity-50 mt-0.5">{item.devanagari}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
