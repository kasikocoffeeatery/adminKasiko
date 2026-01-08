'use client';

import Image from 'next/image';
import { MenuItem as MenuItemType } from '@/types/menu';

interface MenuItemProps {
  item: MenuItemType;
}

export default function MenuItem({ item }: MenuItemProps) {

  return (
    <div className="group relative bg-white rounded-lg border border-gray-100 overflow-hidden hover:border-gray-200 transition-all duration-300">
      {/* Mobile: Card Style (2 columns) */}
      <div className="md:hidden flex flex-col h-full">
        {/* Image */}
        <div className="w-full h-60 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 160px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
              <span className="text-4xl opacity-20">☕</span>
            </div>
          )}
          {item.isPopular && (
            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
              <span className="text-[9px] font-semibold text-gray-700 uppercase tracking-wider">
                Popular
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1 leading-tight">
            {item.name}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed mb-2 line-clamp-2 flex-1">
            {item.description}
          </p>
          <span className="text-sm font-bold text-gray-900">
            Rp {item.price.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Desktop: Horizontal Layout (2 columns) */}
      <div className="hidden md:flex flex-row h-full">
        {/* Image */}
        <div className="w-60 h-60 flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="240px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
              <span className="text-5xl opacity-20">☕</span>
            </div>
          )}
          {item.isPopular && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
              <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-wider">
                Popular
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight leading-tight">
                {item.name}
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
              {item.description}
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-lg md:text-xl font-bold text-gray-900">
              Rp {item.price.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

