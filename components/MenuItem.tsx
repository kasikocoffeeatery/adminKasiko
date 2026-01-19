'use client';

import Image from 'next/image';
import { MenuItem as MenuItemType } from '@/types/menu';
import { useEffect, useState } from 'react';

interface MenuItemProps {
  item: MenuItemType;
}

export default function MenuItem({ item }: MenuItemProps) {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>(item.image);
  const [imgAttempt, setImgAttempt] = useState<0 | 1 | 2>(0);

  const toUppercaseBasename = (src: string) => {
    const [path, query] = src.split('?');
    const parts = path.split('/');
    const base = parts.pop() ?? '';
    const next = [...parts, base.toUpperCase()].join('/');
    return query ? `${next}?${query}` : next;
  };

  const toLowercaseBasename = (src: string) => {
    const [path, query] = src.split('?');
    const parts = path.split('/');
    const base = parts.pop() ?? '';
    const next = [...parts, base.toLowerCase()].join('/');
    return query ? `${next}?${query}` : next;
  };

  // Reset image state if the item changes
  useEffect(() => {
    setImgError(false);
    setImgAttempt(0);
    setImgSrc(item.image);
  }, [item.image]);

  return (
    <div className="group relative overflow-hidden">
      {/* Mobile: Card Style (2 columns) */}
      <div className="md:hidden flex flex-col h-full">
        {/* Image */}
        <div className="w-full aspect-square overflow-hidden bg-neutral-100 relative">
          {imgSrc && !imgError ? (
            <Image
              src={imgSrc}
              alt={item.name}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              unoptimized
              onError={() => {
                if (!imgSrc) return setImgError(true);
                if (imgAttempt === 0) {
                  setImgAttempt(1);
                  setImgSrc(toUppercaseBasename(imgSrc));
                  return;
                }
                if (imgAttempt === 1) {
                  setImgAttempt(2);
                  setImgSrc(toLowercaseBasename(imgSrc));
                  return;
                }
                setImgError(true);
              }}
              sizes="(max-width: 768px) 50vw, 280px"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-dark">
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
        <div className="w-60 h-60 shrink-0 overflow-hidden bg-neutral-100 relative">
          {imgSrc && !imgError ? (
            <Image
              src={imgSrc}
              alt={item.name}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              unoptimized
              onError={() => {
                if (!imgSrc) return setImgError(true);
                if (imgAttempt === 0) {
                  setImgAttempt(1);
                  setImgSrc(toUppercaseBasename(imgSrc));
                  return;
                }
                if (imgAttempt === 1) {
                  setImgAttempt(2);
                  setImgSrc(toLowercaseBasename(imgSrc));
                  return;
                }
                setImgError(true);
              }}
              sizes="280px"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-dark">
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

