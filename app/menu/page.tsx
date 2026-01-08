'use client';

import { useState, useMemo } from 'react';
import { MenuCategory } from '@/types/menu';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import MenuGrid from '@/components/MenuGrid';
import { menuData } from '@/data/menu';

const categories = [
  { id: 'all' as MenuCategory, label: 'Semua Menu', icon: '' },
  { id: 'coffee-latte' as MenuCategory, label: 'Coffee Latte', icon: '' },
  { id: 'classic-coffee' as MenuCategory, label: 'Classic Coffee', icon: '' },
  { id: 'coffee-milk' as MenuCategory, label: 'Coffee & Milk', icon: '' },
  { id: 'coldbrew' as MenuCategory, label: 'Coldbrew', icon: '' },
  { id: 'frappe-series' as MenuCategory, label: 'Frappe Series', icon: '' },
  { id: 'non-coffee' as MenuCategory, label: 'Non Coffee', icon: '' },
  { id: 'basic-tea' as MenuCategory, label: 'Basic Tea', icon: '' },
  { id: 'mocktail' as MenuCategory, label: 'Mocktail', icon: '' },
  { id: 'ricebowl' as MenuCategory, label: 'Ricebowl', icon: '' },
  { id: 'spaghetti' as MenuCategory, label: 'Spaghetti', icon: '' },
  { id: 'local-dish' as MenuCategory, label: 'Local Dish', icon: '' },
  { id: 'chicken-wings' as MenuCategory, label: 'Chicken Wings', icon: '' },
  { id: 'snack' as MenuCategory, label: 'Snack', icon: '' },
  { id: 'cake-cookies' as MenuCategory, label: 'Cake & Cookies', icon: '' },
  { id: 'sweet-treats' as MenuCategory, label: 'Sweet Treats', icon: '' },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMenu = useMemo(() => {
    let filtered = menuData;

    // Filter by category first
    if (activeCategory !== 'all') {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Menu</h1>
          <p className="text-gray-600">Pilih menu favorit Anda</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Menu Grid */}
        <MenuGrid items={filteredMenu} />
      </main>

      <Footer />
    </div>
  );
}

