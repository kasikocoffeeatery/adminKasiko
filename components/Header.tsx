'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">Kasiko Coffee</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/menu"
              className={`text-sm font-medium transition-colors ${
                isActive('/menu')
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Menu
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

