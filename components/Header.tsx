'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import siteContent from '@/data/siteContent.json';

export default function Header() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const { navigation } = siteContent;

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileOpen(false)}>
            <Image src="/images/kasikoText-Black.png" alt="Kasiko Coffee" width={120} height={20} />
          </Link>

          {/* Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-[0.18em] uppercase">
            {navigation.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`pb-1 border-b transition-colors ${
                  isActive(item.href)
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neutral-700 hover:text-neutral-900 p-2 rounded-full border border-neutral-200/80 bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-300/80"
            aria-label="Toggle navigation"
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((prev) => !prev)}
          >
            {isMobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 7h16M4 12h16M4 17h10" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileOpen && (
          <nav className="md:hidden pb-4 pt-2 space-y-1 text-[13px] font-medium tracking-[0.18em] uppercase animate-in">
            {navigation.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-[12px] ${
                  isActive(item.href)
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 bg-white/80 text-neutral-600 hover:bg-neutral-50'
                }`}
                onClick={() => setIsMobileOpen(false)}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

