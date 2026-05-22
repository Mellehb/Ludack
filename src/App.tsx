import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Lifestyle } from './components/Lifestyle';
import { AboutUs } from './components/AboutUs';
import { CombiDeal } from './components/CombiDeal';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div id="top" className="min-h-screen bg-bone text-ink">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Lifestyle />
        <AboutUs />
        <CombiDeal />
      </main>
      <Footer />
    </div>
  );
}
