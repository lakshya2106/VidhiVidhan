import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./styles/Timeline.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Timeline() {
  const timelineRef = useRef(null);

  const steps = [
    { number: "01", title: "Consultation", desc: "We listen deeply to understand your unique vision, preferences, and dreams for the perfect celebration.", icon: "◎" },
    { number: "02", title: "Design & Planning", desc: "Our creative team crafts a detailed, bespoke blueprint tailored precisely to your requirements.", icon: "◈" },
    { number: "03", title: "Coordination", desc: "We seamlessly manage every vendor, timeline, and logistic so you can be fully present.", icon: "◇" },
    { number: "04", title: "Grand Celebration", desc: "Watch your dream unfold flawlessly — a moment you and your guests will cherish forever.", icon: "✦" },
  ];

  return (
    <section ref={timelineRef} className={styles.timeline} id="timeline">
      <div className={styles.timelineBg} />

      <div className={styles.timelineHeader}>
        <motion.div
          className={styles.sectionLabel}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className={styles.dash} />
          How It Works
          <span className={styles.dash} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >Our Process</motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >From dream to reality in 4 steps</motion.p>
      </div>

      <div className={styles.stepsContainer}>
        {/* Connecting line */}
        <div className={styles.connectLine}>
          <motion.div
            className={styles.connectProgress}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          />
        </div>

        {steps.map((step, index) => (
          <motion.div
            key={index}
            className={styles.step}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className={styles.stepCircle}
              whileHover={{ scale: 1.12, boxShadow: "0 0 40px rgba(255,215,0,0.4)" }}
            >
              <span className={styles.stepIcon}>{step.icon}</span>
              <span className={styles.stepNum}>{step.number}</span>
            </motion.div>

            <div className={styles.stepContent}>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>

            {index < steps.length - 1 && (
              <motion.div
                className={styles.stepArrow}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >›</motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
