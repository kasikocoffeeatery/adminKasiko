'use client';

import Image from 'next/image';
import { MenuItem as MenuItemType } from '@/types/menu';

interface MenuItemCardProps {
  item: MenuItemType;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {

  return (
    <div className="group">
      {/* Image */}
      <div className="w-full aspect-square overflow-hidden bg-neutral-100 relative max-w-full">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover object-center"
            style={{ 
              objectFit: 'cover', 
              objectPosition: 'center',
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            quality={85}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-900">
            <span className="text-4xl opacity-20 text-white">☕</span>
          </div>
        )}
        {item.isPopular && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-[0_10px_25px_rgba(15,23,42,0.25)]">
            <span className="text-[10px] font-semibold text-neutral-800 uppercase tracking-[0.18em]">
              Best Seller
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4.5 md:p-5 space-y-2.5">
        <h3 className="text-[15px] font-semibold text-neutral-900 tracking-tight mb-1 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-xs text-neutral-500 leading-relaxed">
          {item.description}
        </p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[15px] font-semibold text-neutral-900">
            Rp {item.kategori[0]?.harga.toLocaleString('id-ID') || ''}
          </span>
        </div>
      </div>
    </div>
  );
}

