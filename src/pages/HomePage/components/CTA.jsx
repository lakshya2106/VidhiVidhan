import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useCallback } from "react";
import styles from "./styles/CTA.module.css";

const SPARKS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
}));

export default function CTA() {
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  return (
    <section className={styles.cta} id="cta" ref={sectionRef} onMouseMove={handleMouseMove}>
      {/* Dynamic gradient that follows cursor */}
      <motion.div
        className={styles.dynamicGlow}
        style={{
          left: springX,
          top: springY,
          x: "-50%",
          y: "-50%",
        }}
      />

      <div className={styles.ctaBg} />
      <div className={styles.ctaLines} />

      {SPARKS.map((s) => (
        <motion.div
          key={s.id}
          className={styles.spark}
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
            rotate: [0, 180],
          }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.div
        className={styles.ctaContent}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className={styles.ctaBadge}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <span>✦</span> Limited Slots Available <span>✦</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Let's Create<br /><em>Magic Together</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Transform your vision into an extraordinary reality with our team of
          passionate event specialists and creative visionaries.
        </motion.p>

        <motion.div
          className={styles.ctaButtons}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className={styles.ctaPrimary}
            whileHover={{ scale: 1.06, boxShadow: "0 0 60px rgba(255,215,0,0.5), 0 20px 40px rgba(0,0,0,0.5)" }}
            whileTap={{ scale: 0.97 }}
          >
            Book Your Event
          </motion.button>
          <motion.button
            className={styles.ctaSecondary}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,215,0,0.06)" }}
            whileTap={{ scale: 0.97 }}
          >
            Free Consultation
          </motion.button>
        </motion.div>

        <div className={styles.ctaTrust}>
          {["★★★★★ Rated", "500+ Events", "Trusted Since 2014"].map((t) => (
            <div key={t} className={styles.trustItem}>
              <span className={styles.trustDot} />
              {t}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
