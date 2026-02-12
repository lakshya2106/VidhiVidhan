import { motion } from "framer-motion";
import styles from "./styles/CTA.module.css";

export default function CTA() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className={styles.cta} id="cta">
      <div className={styles.ctaBlurTop}></div>
      <div className={styles.ctaBlurBottom}></div>

      <motion.div
        className={styles.ctaContent}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={itemVariants} className={styles.ctaBadge}>
          Limited Time Offer
        </motion.div>

        <motion.h2 variants={itemVariants}>
          Let's Create Magic Together
        </motion.h2>

        <motion.p variants={itemVariants}>
          Transform your vision into reality with our expert team of event
          specialists and creative visionaries.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className={styles.ctaButtons}
        >
          <motion.button
            className={styles.ctaPrimary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book Your Event
          </motion.button>

          <motion.button
            className={styles.ctaSecondary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Free Consultation
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
