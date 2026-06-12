import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ProductShowcase } from './components/ProductShowcase';
import { InMotion } from './components/InMotion';
import { AboutUs } from './components/AboutUs';
import { Reviews } from './components/Reviews';
import { LocalGooi } from './components/LocalGooi';
import { CombiDeal } from './components/CombiDeal';
import { Closer } from './components/Closer';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';

export default function App() {
  return (
    <CartProvider>
      <div id="top" className="min-h-screen overflow-x-clip bg-bone text-ink">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <ProductShowcase />
          <InMotion />
          <AboutUs />
          <Reviews />
          <LocalGooi />
          <CombiDeal />
          <Closer />
        </main>
        <Footer />
      </div>
      <CartDrawer />
    </CartProvider>
  );
}
