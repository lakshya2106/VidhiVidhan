import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./styles/Contact.module.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

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

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const contactInfo = [
    { icon: "📍", title: "Location", value: "Udaipur, India" },
    { icon: "📞", title: "Phone", value: "+91 9694804435" },
    { icon: "✉️", title: "Email", value: "vidhividhan24@gmail.com" },
  ];

  return (
    <section className={styles.contact} id="contact">
      <motion.div
        className={styles.contactContainer}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className={styles.contactLeft}>
          <motion.div variants={itemVariants}>
            <h2>Get In Touch</h2>
            <p>
              Have questions? Our team is ready to help you plan the perfect
              event.
            </p>
          </motion.div>

          <div className={styles.contactInfo}>
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className={styles.infoItem}
                variants={itemVariants}
                whileHover={{ x: 10 }}
              >
                <span className={styles.infoIcon}>{info.icon}</span>
                <div>
                  <h4>{info.title}</h4>
                  <p>{info.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.form
          className={styles.contactForm}
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          {submitted && (
            <motion.div
              className={styles.successMessage}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ✓ Thank you! We'll contact you soon.
            </motion.div>
          )}

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            required
          >
            <option value="">Select Event Type</option>
            <option value="wedding">Wedding</option>
            <option value="corporate">Corporate Event</option>
            <option value="party">Party</option>
            <option value="other">Other</option>
          </select>

          <textarea
            name="message"
            placeholder="Tell us about your event..."
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
          />

          <motion.button
            type="submit"
            className={styles.submitButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Message
          </motion.button>
        </motion.form>
      </motion.div>
    </section>
  );
}
