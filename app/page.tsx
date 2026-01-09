import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BestSellerSection from '@/components/BestSellerSection';
import PosterSlider from '@/components/PosterSlider';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { menuData } from '@/data/menu';
import { posterData } from '@/data/poster';
import Image from 'next/image';
import siteContent from '@/data/siteContent.json';

export default function Home() {
  // Get best sellers (items with isPopular: true, max 8 items)
  const bestSellers = menuData.filter((item) => item.isPopular).slice(0, 8);
  const { hero, bestSeller } = siteContent;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Hero Section - Full Viewport Height with Poster Slider */}
      <PosterSlider posters={posterData} />

      {/* Intro copy */}
      <section className="border-b border-neutral-200/70 bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 py-12 md:py-16">
          <div className="flex flex-col justify-between md:flex-row gap-16">
            <div className="max-w-xl space-y-4">
              <p className="text-[10px] md:text-[11px] font-medium tracking-[0.32em] uppercase text-neutral-500">
                {hero.eyebrow}
              </p>
              <h1 className="text-[26px] md:text-[32px] font-semibold tracking-tight text-neutral-900 leading-snug">
                {hero.title}
              </h1>
              <p className="text-[13px] md:text-[15px] leading-relaxed text-neutral-600">
                {hero.body}
              </p>
            </div>
            <div>
              <Image src="/images/kasiko.jpg" alt="Hero" width={1000} height={1000} />
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      {bestSellers.length > 0 && (
        <BestSellerSection
          items={bestSellers}
          title={bestSeller.title}
          overline={bestSeller.overline}
          description={bestSeller.description}
        />
      )}

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
