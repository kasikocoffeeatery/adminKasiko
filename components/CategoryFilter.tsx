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
    <div className="mb-12 md:mb-20">
      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
        <div className="flex gap-3 min-w-max">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                flex-shrink-0 px-5 py-3 text-sm font-medium rounded-full
                transition-all duration-200 whitespace-nowrap
                ${
                  activeCategory === category.id
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Centered with underline */}
      <div className="hidden md:flex flex-wrap gap-4 md:gap-6 justify-center pb-6 border-b border-gray-200/60">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              relative px-4 py-2 text-xs md:text-sm font-medium tracking-wide uppercase
              transition-all duration-300 ease-out
              ${
                activeCategory === category.id
                  ? 'text-gray-900'
                  : 'text-gray-400 hover:text-gray-700'
              }
            `}
          >
            <span className="relative z-10">{category.label}</span>
            {activeCategory === category.id && (
              <>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 transition-all duration-300" />
                <span className="absolute inset-0 bg-gray-50 rounded-sm -z-0" />
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

