import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Timeline from "./components/Timeline";
import Gallery from "./components/Gallery";
import CTA from "./components/CTA";
import Contact from "./components/Contack";
import "./global.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Timeline />
      <Gallery />
      <CTA />
      <Contact />
    </>
  );
}
