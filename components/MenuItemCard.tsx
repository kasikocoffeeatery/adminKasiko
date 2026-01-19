'use client';

import Image from 'next/image';
import { MenuItem as MenuItemType } from '@/types/menu';
import { useEffect, useState } from 'react';

interface MenuItemCardProps {
  item: MenuItemType;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
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

  useEffect(() => {
    setImgError(false);
    setImgAttempt(0);
    setImgSrc(item.image);
  }, [item.image]);

  return (
    <div className="group">
      {/* Image */}
      <div className="w-full aspect-square overflow-hidden bg-neutral-100 relative">
        {imgSrc && !imgError ? (
          <Image
            src={imgSrc}
            alt={item.name}
            fill
            className="object-cover object-center"
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            quality={85}
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

