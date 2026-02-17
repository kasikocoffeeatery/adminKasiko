'use client';

import { useState, useMemo } from 'react';
import { MenuCategory } from '@/types/menu';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import MenuGrid from '@/components/MenuGrid';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { menuData } from '@/data/menu';
import Image from 'next/image';
import siteContent from '@/data/siteContent.json';

const categories = [
  { id: 'all' as MenuCategory, label: 'Semua Menu', icon: '' },
  { id: 'best-seller' as MenuCategory, label: 'Best Seller', icon: '' },
  { id: 'bundle' as MenuCategory, label: '(Ramadhan) Bundle', icon: '' },
  { id: 'coffee-milk' as MenuCategory, label: 'Coffee & Milk', icon: '' },
  { id: 'non-coffee' as MenuCategory, label: 'Non Coffee', icon: '' },
  { id: 'mocktail' as MenuCategory, label: 'Mocktail', icon: '' },
  { id: 'coldbrew' as MenuCategory, label: 'Coldbrew', icon: '' },
  { id: 'frappe-series' as MenuCategory, label: 'Frappe Series', icon: '' },
  { id: 'tea-based' as MenuCategory, label: 'Tea Based', icon: '' },
  { id: 'manual-brew' as MenuCategory, label: 'Manual Brew', icon: '' },
  { id: 'milk-based' as MenuCategory, label: 'Milk Based', icon: '' },
  { id: 'espresso-based' as MenuCategory, label: 'Espresso Based', icon: '' },
  { id: 'ricebowl' as MenuCategory, label: 'Ricebowl', icon: '' },
  { id: 'local-dish' as MenuCategory, label: 'Local Dish', icon: '' },
  { id: 'cake-cookies' as MenuCategory, label: 'Cake & Cookies', icon: '' },
  { id: 'snack' as MenuCategory, label: 'Snack', icon: '' },
  { id: 'spaghetti' as MenuCategory, label: 'Spaghetti', icon: '' },
  { id: 'sweet-treats' as MenuCategory, label: 'Sweet Treats', icon: '' },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { menuPage } = siteContent;

  const filteredMenu = useMemo(() => {
    let filtered = menuData;

    if (activeCategory === 'best-seller') {
      filtered = filtered.filter((item) => item.isPopular);
    }
    // Filter by category first
    if (activeCategory !== 'all' && activeCategory !== 'best-seller') {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }

    // Then filter by search query
    if (searchQuery && searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Page Header */}
      <section className="w-full justify-center items-center">
        <div className="w-full justify-center items-center">
          <Image src={menuPage.headerImage} alt="Menu Header" width={3000} height={1000} />
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 lg:px-0 py-10 md:py-14 space-y-8 md:space-y-10">
        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* Layout: Sidebar categories (desktop) + content */}
        <div className="md:flex md:items-start md:gap-10 lg:gap-12">
          {/* Category Filter (sticky on desktop) */}
          <aside className="md:w-56 lg:w-64 md:pt-1 md:border-r md:border-neutral-200/70 md:pr-6 lg:pr-8 md:sticky md:top-24 md:self-start">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </aside>

          {/* Menu Grid */}
          <section className="mt-6 md:mt-0 md:flex-1">
            <MenuGrid items={filteredMenu} />
          </section>
        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}

