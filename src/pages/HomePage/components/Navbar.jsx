import { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./styles/Navbar.module.css";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("hero");
  const [progress, setProgress] = useState(0)
   const navigate = useNavigate();
  const timerRef = useRef(null);
const intervalRef = useRef(null)

   const [holding, setHolding] = useState(false)

const startHold = () => {
  setHolding(true)
  setProgress(0)

  let start = Date.now()

  intervalRef.current = setInterval(() => {
    const elapsed = Date.now() - start
    const percent = Math.min((elapsed / 2000) * 100, 100)
    setProgress(percent)

    if (percent >= 100) {
      clearInterval(intervalRef.current)

      // Unlock flash effect
      setHolding(false)
      setProgress(100)

      setTimeout(() => {
        navigate("/login")
      }, 300)
    }
  }, 16)
}


const cancelHold = () => {
  setHolding(false)
  setProgress(0)

  if (intervalRef.current) clearInterval(intervalRef.current)
}

  
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
  className={`${styles.navbarLogo} ${holding ? styles.glow : ""}`}
  onMouseDown={startHold}
  onMouseUp={cancelHold}
  onMouseLeave={cancelHold}
  onTouchStart={startHold}
  onTouchEnd={cancelHold}
>
  <div className={styles.logoWrapper}>
    <svg className={styles.progressRing} width="80" height="80">
      <circle
        cx="40"
        cy="40"
        r="35"
        stroke="gold"
        strokeWidth="3"
        fill="transparent"
        strokeDasharray={220}
        strokeDashoffset={220 - (progress / 100) * 220}
        style={{ transition: "stroke-dashoffset 0.1s linear" }}
      />
    </svg>

    <div className={styles.logoContent}>
      <span className={styles.logoText}>VV</span>
      <span className={styles.logoSubtext}>Vidhi Vidhan</span>
    </div>
  </div>
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
