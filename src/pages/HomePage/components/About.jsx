import { motion } from "framer-motion";
import styles from "./styles/About.module.css";

export default function About() {
  const stats = [
    { number: "500+", label: "Events Completed" },
    { number: "10+", label: "Years Experience" },
    { number: "10K+", label: "Happy Clients" },
  ];

  return (
    <section className={styles.about} id="about">
      <div className={styles.aboutContainer}>
        <motion.div
          className={styles.aboutContent}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className={styles.sectionBadge}>About Us</span>
          <h2>Crafting Timeless Celebrations</h2>
          <p>
            From royal weddings to elite corporate events, Vidhi Vidhan turns moments
            into memories. With over a decade of excellence, we bring creativity,
            precision, and passion to every celebration.
          </p>
          <p>
            Our team of expert planners and designers works tirelessly to ensure
            that every detail reflects your vision and dreams.
          </p>
        </motion.div>

        <div className={styles.aboutStats}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={styles.statCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -8 }}
            >
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
