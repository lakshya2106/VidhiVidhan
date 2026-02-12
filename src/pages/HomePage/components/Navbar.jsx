import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./styles/Navbar.module.css";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("hero");

  const scrollToSection = (id) => {
    setActiveLink(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "timeline", label: "Process" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <motion.nav
      className={styles.navbar}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className={styles.navbarLogo}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => scrollToSection("hero")}
      >
        <span className={styles.logoText}>VV</span>
        <span className={styles.logoSubtext}>Vidhi Vidhan</span>
      </motion.div>

      <div className={styles.navbarLinks}>
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            className={`${styles.navLink} ${
              activeLink === item.id ? styles.active : ""
            }`}
            onClick={() => scrollToSection(item.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.label}
            {activeLink === item.id && (
              <motion.div
                className={styles.navUnderline}
                layoutId="underline"
                initial={false}
                transition={{ type: "spring", stiffness: 380, damping: 40 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      <motion.button
        className={styles.ctaButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Book Now
      </motion.button>
    </motion.nav>
  );
}
