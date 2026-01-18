'use client';

import Image from 'next/image';
import { MenuItem as MenuItemType } from '@/types/menu';

interface MenuItemProps {
  item: MenuItemType;
}

export default function MenuItem({ item }: MenuItemProps) {

  return (
    <div className="group relative overflow-hidden">
      {/* Mobile: Card Style (2 columns) */}
      <div className="md:hidden flex flex-col h-full">
        {/* Image */}
        <div className="w-full aspect-square overflow-hidden bg-neutral-100 relative max-w-full">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              style={{ 
                objectFit: 'cover', 
                objectPosition: 'center',
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
              sizes="(max-width: 768px) 50vw, 280px"
              quality={85}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-900">
              <span className="text-3xl opacity-20 text-white">☕</span>
            </div>
          )}
          {item.isPopular && (
            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-[0_10px_25px_rgba(15,23,42,0.25)]">
              <span className="text-[9px] font-semibold text-neutral-800 uppercase tracking-[0.18em]">
                Best Seller
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3.5 flex flex-col flex-1 space-y-1">
          <h3 className="text-[13px] font-semibold text-neutral-900 mb-0.5 line-clamp-1 leading-tight tracking-tight">
            {item.name}
          </h3>
          <p className="text-[11px] text-neutral-500 leading-relaxed mb-1 flex-1 line-clamp-4">
            {item.description}
          </p>
          <span className="text-sm font-semibold text-neutral-900">
            Rp {item.kategori[0]?.harga.toLocaleString('id-ID') || ''}
          </span>
        </div>
      </div>

      {/* Desktop: Horizontal Layout (2 columns) */}
      <div className="hidden md:flex flex-row h-full">
        {/* Image */}
        <div className="w-60 aspect-square shrink-0 overflow-hidden bg-neutral-100 relative max-w-full">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              style={{ 
                objectFit: 'cover', 
                objectPosition: 'center',
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
              sizes="280px"
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
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-lg md:text-xl font-semibold text-neutral-900 tracking-tight leading-tight">
                {item.name}
              </h3>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-4">
              {item.description}
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
            <span className="text-lg md:text-xl font-semibold text-neutral-900">
              Rp {item.kategori[0]?.harga.toLocaleString('id-ID') || ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

