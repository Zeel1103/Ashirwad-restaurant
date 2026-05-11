import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Menu from "@/components/Menu";
import Banquet from "@/components/Banquet";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import OrderSection from "@/components/OrderSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollAnimations from "@/components/ScrollAnimations";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="fade-in"><About /></div>
        <div className="fade-in"><Menu /></div>
        <div className="fade-in"><Banquet /></div>
        <div className="fade-in"><Reviews /></div>
        <div className="fade-in"><Gallery /></div>
        <div className="fade-in"><OrderSection /></div>
        <div className="fade-in"><Contact /></div>
      </main>
      <Footer />

      {/* Floating Book Table Button */}
      <a href="#banquet" className="floating-book">📅 Book Table</a>

      {/* WhatsApp Chat Widget */}
      <a
        href="https://wa.me/918511575440?text=Hi!%20I%20want%20to%20know%20more%20about%20Ashirwad%202%20Restaurant"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-widget"
        aria-label="Chat on WhatsApp"
      >
        💬
      </a>

      <ScrollAnimations />
    </>
  );
}
