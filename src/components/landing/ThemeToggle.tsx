import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      aria-label="Toggle theme"
      className="relative w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] dark:border-white/10 dark:bg-white/[0.03] light:border-black/10 light:bg-black/[0.03] light:hover:bg-black/[0.06] flex items-center justify-center transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            <Moon size={16} className="text-gray-200" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            <Sun size={16} className="text-amber-500" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
