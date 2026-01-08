import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BestSellerSection from '@/components/BestSellerSection';
import PosterSlider from '@/components/PosterSlider';
import { menuData } from '@/data/menu';
import { posterData } from '@/data/poster';

export default function Home() {
  // Get best sellers (items with isPopular: true, max 8 items)
  const bestSellers = menuData.filter((item) => item.isPopular).slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Full Viewport Height with Poster Slider */}
      <PosterSlider posters={posterData} />

      {/* Best Sellers Section */}
      {bestSellers.length > 0 && <BestSellerSection items={bestSellers} />}

      <Footer />
    </div>
  );
}
