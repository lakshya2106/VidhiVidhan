import { motion } from "framer-motion";
import styles from "./styles/Services.module.css";

export default function Services() {
  const services = [
    {
      title: "Wedding Planning",
      desc: "Create your perfect wedding day",
      icon: "💍",
    },
    {
      title: "Party Decoration",
      desc: "Transform venues into wonderlands",
      icon: "🎉",
    },
    {
      title: "Corporate Events",
      desc: "Professional & memorable gatherings",
      icon: "💼",
    },
    {
      title: "Theme Setup",
      desc: "Bring your theme to life",
      icon: "🎨",
    },
    {
      title: "Catering Coordination",
      desc: "Exquisite culinary experiences",
      icon: "🍽️",
    },
    {
      title: "Photography & Videography",
      desc: "Capture your precious moments",
      icon: "📸",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className={styles.services} id="services">
      <div className={styles.servicesHeader}>
        <h2>Our Services</h2>
        <p>Comprehensive solutions for your special moments</p>
      </div>

      <motion.div
        className={styles.servicesGrid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            className={styles.serviceCard}
            variants={cardVariants}
            whileHover={{
              y: -15,
              boxShadow: "0 30px 60px rgba(255, 215, 0, 0.2)",
            }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.serviceIcon}>{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
            <motion.button
              className={styles.serviceButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More →
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
