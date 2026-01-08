'use client';

import Image from 'next/image';
import { MenuItem as MenuItemType } from '@/types/menu';

interface MenuItemCardProps {
  item: MenuItemType;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {

  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            Rp {item.price.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
}

