'use client';

import { MenuCategory } from '@/types/menu';

interface CategoryFilterProps {
  categories: { id: MenuCategory; label: string; icon: string }[];
  activeCategory: MenuCategory;
  onCategoryChange: (category: MenuCategory) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="mb-8 md:mb-0">
      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-3 min-w-max">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex-shrink-0 px-4 py-2 text-xs font-medium rounded-full tracking-[0.14em] uppercase transition-all duration-200 whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-brand-dark text-white'
                  : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Vertical sidebar nav */}
      <div className="hidden md:block space-y-1.5">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-[11px] font-medium tracking-[0.21em] uppercase transition-all duration-200 ${
              activeCategory === category.id
                ? 'bg-brand-dark text-white'
                : 'text-neutral-500 hover:bg-neutral-50 hover:text-brand-dark'
            }`}
          >
            <span className="relative z-10">{category.label}</span>
            {activeCategory === category.id && (
              <span className="ml-2 h-1.5 w-1.5 rounded-full bg-white/80" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

