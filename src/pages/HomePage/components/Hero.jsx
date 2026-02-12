import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import styles from "./styles/Hero.module.css";

export default function Hero() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className={styles.hero} id="hero">
      <div
        className={styles.heroParallax}
        style={{ transform: `translateY(${offsetY * 0.5}px)` }}
      />

      <motion.div
        className={styles.heroContent}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ transform: `translateY(${offsetY * 0.2}px)` }}
      >
        <motion.div variants={itemVariants} className={styles.heroSubtitle}>
          <span className={styles.accentBar}></span>
          Welcome to Elegance
        </motion.div>

        <motion.h1 variants={itemVariants} className={styles.heroTitle}>
          Vidhi Vidhan
        </motion.h1>

        <motion.p variants={itemVariants} className={styles.heroDescription}>
          Transforming Dreams into Magnificent Realities
        </motion.p>

        <motion.div variants={itemVariants} className={styles.heroSubtext}>
          Weddings • Celebrations • Grand Events
        </motion.div>

        <motion.button
          variants={itemVariants}
          className={styles.heroButton}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(255, 215, 0, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Our Work
          <span className={styles.buttonArrow}>→</span>
        </motion.button>
      </motion.div>

      <motion.div
        className={styles.heroScrollIndicator}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className={styles.scrollDot}></div>
      </motion.div>
    </section>
  );
}
