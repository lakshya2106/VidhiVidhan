import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./styles/Timeline.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Timeline() {
  const timelineRef = useRef(null);
  const lineRef = useRef(null);

  const steps = [
    { number: "01", title: "Consultation", desc: "Understand your vision and requirements" },
    { number: "02", title: "Design & Planning", desc: "Create detailed event blueprint" },
    { number: "03", title: "Coordination", desc: "Manage all logistics seamlessly" },
    { number: "04", title: "Grand Celebration", desc: "Execute flawlessly" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.timelineStep}`, {
        opacity: 0,
        x: -50,
        stagger: 0.2,
        duration: 0.6,
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 60%",
        },
      });

      gsap.to(lineRef.current, {
        height: "100%",
        duration: 1.5,
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 70%",
          scrub: 1,
        },
      });
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={timelineRef} className={styles.timeline} id="timeline">
      <div className={styles.timelineHeader}>
        <h2>Our Process</h2>
        <p>From consultation to celebration in 4 simple steps</p>
      </div>

      <div className={styles.timelineContainer}>
        <div className={styles.timelineLineWrapper}>
          <div ref={lineRef} className={styles.timelineLine}></div>
        </div>

        <div className={styles.timelineSteps}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={styles.timelineStep}
              whileHover={{ scale: 1.05 }}
            >
              <div className={styles.stepCircle}>{step.number}</div>
              <div className={styles.stepContent}>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
