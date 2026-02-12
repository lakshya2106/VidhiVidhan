import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./styles/Gallery.module.css";
import logo from "../../../assets/vvlogo01.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const sectionRef = useRef(null);

  const images = [
    { src: logo, title: "Grand Wedding Ceremony" },
    { src: logo, title: "Elegant Reception Setup" },
    { src: logo, title: "Corporate Gala Event" },
    { src: logo, title: "Intimate Anniversary" },
    { src: logo, title: "Festival Celebration" },
    { src: logo, title: "Birthday Extravaganza" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.galleryItem}`, {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.7,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      });

      gsap.to(`.${styles.galleryItem}`, {
        y: -80,
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.gallery} id="gallery">
      <div className={styles.galleryHeader}>
        <h2>Our Gallery</h2>
        <p>Moments we've created and cherished</p>
      </div>

      <div className={styles.galleryGrid}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            className={styles.galleryItem}
            layoutId={`gallery-${index}`}
            onClick={() => setSelectedIndex(index)}
            whileHover={{ scale: 1.02 }}
          >
            <img src={image.src} alt={image.title} loading="lazy" />
            <div className={styles.galleryOverlay}>
              <h4>{image.title}</h4>
              <button onClick={() => setSelectedIndex(index)}>
                View
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedIndex !== null && (
        <motion.div
          className={styles.galleryModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedIndex(null)}
        >
          <motion.div
            className={styles.modalContent}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => setSelectedIndex(null)}
            >
              ✕
            </button>
            <img
              src={images[selectedIndex].src}
              alt={images[selectedIndex].title}
            />
            <p>{images[selectedIndex].title}</p>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
