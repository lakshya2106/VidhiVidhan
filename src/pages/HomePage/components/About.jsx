import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import styles from "./styles/About.module.css";

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target);
    const duration = 2000;
    const step = num / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, num);
      setCount(Math.floor(current));
      if (current >= num) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function About() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  const stats = [
    { number: "500", suffix: "+", label: "Events Completed", icon: "✦" },
    { number: "10", suffix: "+", label: "Years of Excellence", icon: "◈" },
    { number: "10", suffix: "K+", label: "Happy Clients", icon: "❋" },
  ];

  return (
    <section className={styles.about} id="about" ref={sectionRef}>
      {/* Decorative line */}
      <motion.div
        className={styles.decorVertical}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      <div className={styles.aboutContainer}>
        <motion.div
          className={styles.aboutLeft}
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.sectionLabel}>
            <span className={styles.labelDash} />
            <span>About Us</span>
          </div>

          <h2 className={styles.aboutTitle}>
            Crafting<br />
            <em>Timeless</em><br />
            Celebrations
          </h2>

          <div className={styles.aboutDivider} />

          <p className={styles.aboutText}>
            From royal weddings to elite corporate events, Vidhi Vidhan turns moments
            into memories. With over a decade of excellence, we bring creativity,
            precision, and passion to every celebration.
          </p>
          <p className={styles.aboutText}>
            Our team of expert planners and designers works tirelessly to ensure
            that every detail reflects your vision and dreams.
          </p>

          <motion.button
            className={styles.learnMoreBtn}
            whileHover={{ scale: 1.04, x: 6 }}
            whileTap={{ scale: 0.97 }}
          >
            Our Story <span>→</span>
          </motion.button>
        </motion.div>

        <div className={styles.aboutRight}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className={styles.statCard}
              initial={{ opacity: 0, y: 50, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -10, boxShadow: "0 30px 60px rgba(255,215,0,0.12)" }}
            >
              <div className={styles.statIcon}>{stat.icon}</div>
              <h3 className={styles.statNumber}>
                <AnimatedCounter target={stat.number} suffix={stat.suffix} />
              </h3>
              <p className={styles.statLabel}>{stat.label}</p>
              <div className={styles.statGlow} />
            </motion.div>
          ))}

          {/* Floating badge */}
          <motion.div
            className={styles.floatingBadge}
            animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className={styles.badgeStar}>★</span>
            <span>Award Winning</span>
            <span className={styles.badgeStar}>★</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
