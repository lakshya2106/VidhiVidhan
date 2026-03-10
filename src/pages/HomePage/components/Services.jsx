import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./styles/Services.module.css";

function TiltCard({ service, index }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 25 });
  const glowX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(y, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={styles.serviceCard}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className={styles.cardGlow}
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,215,0,0.12) 0%, transparent 60%)`,
        }}
      />
      <div className={styles.serviceIconWrap}>
        <span className={styles.serviceIcon}>{service.icon}</span>
        <div className={styles.iconRing} />
      </div>
      <h3>{service.title}</h3>
      <p>{service.desc}</p>
      <div className={styles.cardFooter}>
        <motion.button
          className={styles.serviceButton}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          Learn More →
        </motion.button>
        <div className={styles.cardDot} />
      </div>
    </motion.div>
  );
}

export default function Services() {
  const services = [
    { title: "Wedding Planning", desc: "Create your perfect wedding day with bespoke elegance and flawless coordination.", icon: "💍" },
    { title: "Party Decoration", desc: "Transform any venue into an enchanting wonderland for your guests.", icon: "🎉" },
    { title: "Corporate Events", desc: "Professional, memorable gatherings that leave lasting impressions.", icon: "💼" },
    { title: "Theme Setup", desc: "Bring your wildest theme concepts to life with stunning execution.", icon: "🎨" },
    { title: "Catering Coordination", desc: "Exquisite culinary experiences curated for your celebration.", icon: "🍽️" },
    { title: "Photography & Film", desc: "Capture precious moments with cinematic precision and artistry.", icon: "📸" },
  ];

  return (
    <section className={styles.services} id="services">
      <div className={styles.servicesHeader}>
        <motion.div
          className={styles.sectionLabel}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelDash} />
          What We Offer
          <span className={styles.labelDash} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Our Services
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Comprehensive solutions for your most special moments
        </motion.p>
      </div>

      <div className={styles.servicesGrid}>
        {services.map((service, index) => (
          <TiltCard key={index} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}
