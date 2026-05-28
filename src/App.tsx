import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ProductShowcase } from './components/ProductShowcase';
import { InMotion } from './components/InMotion';
import { Lifestyle } from './components/Lifestyle';
import { AboutUs } from './components/AboutUs';
import { Reviews } from './components/Reviews';
import { CombiDeal } from './components/CombiDeal';
import { Closer } from './components/Closer';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';

export default function App() {
  return (
    <CartProvider>
      <div id="top" className="min-h-screen bg-bone text-ink">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <ProductShowcase />
          <InMotion />
          <Lifestyle />
          <AboutUs />
          <Reviews />
          <CombiDeal />
          <Closer />
        </main>
        <Footer />
      </div>
      <CartDrawer />
    </CartProvider>
  );
}
