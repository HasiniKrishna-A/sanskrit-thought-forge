import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { path: "/", label: "Home", devanagari: "गृहम्" },
  { path: "/sandhi", label: "Sandhi Lab", devanagari: "सन्धिः" },
  { path: "/compiler", label: "Compiler", devanagari: "संकलकः" },
  { path: "/gallery", label: "Shloka Art", devanagari: "श्लोकचित्रम्" },
  { path: "/wisdom", label: "Wisdom", devanagari: "प्रज्ञा" },
  { path: "/help", label: "Help Bot", devanagari: "सहायकः" },
  { path: "/guide", label: "Guide", devanagari: "पथदर्शिका" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gradient-gold">संस्कृतम्</span>
          <span className="text-sm font-light text-muted-foreground">Hub</span>
        </Link>
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative px-3 py-2 text-sm transition-colors rounded-md ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="font-medium">{item.label}</span>
              <span className="ml-1 text-xs font-devanagari opacity-50 group-hover:opacity-100 transition-opacity">
                {item.devanagari}
              </span>
              {location.pathname === item.path && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
