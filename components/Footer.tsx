import Image from "next/image";
import Link from "next/link";
import siteContent from "@/data/siteContent.json";

export default function Footer() {
  const { footer, navigation, whatsapp } = siteContent;

  return (
    <footer className="mt-16 bg-brand-dark">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr,1fr,1.1fr] gap-10 md:gap-12">
          {/* About */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <Image src={footer.logoImage} alt="Kasiko Coffee" width={120} height={20} />
            </Link>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-400 mb-1">
                {footer.addressLabel}
              </p>
              <Link href={footer.addressMapUrl} className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-neutral-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.7}
                    d="M12 21s-6-5.373-6-10a6 6 0 1112 0c0 4.627-6 10-6 10z"
                  />
                  <circle cx="12" cy="11" r="2.5" />
                </svg>
                <p className="text-neutral-200 text-[13px] md:text-[15px] leading-relaxed">
                  {footer.addressText}
                </p>
              </Link>
            </div>
            <p className="text-[13px] leading-relaxed text-neutral-200 max-w-sm">
              {footer.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.24em] uppercase text-neutral-300 mb-4">
              Navigasi
            </h3>
            <ul className="space-y-2 text-sm">
              {navigation.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-neutral-300 hover:text-white transition-colors text-[13px]"
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.24em] uppercase text-neutral-300 mb-4">
              Sosial
            </h3>
            <div>
              <a
                href={footer.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-neutral-300 hover:text-neutral-50 transition-colors text-[13px]"
              >
                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>{footer.instagramHandle}</span>
              </a>
            </div>

            <div className="space-y-2 text-[13px] text-neutral-300">
              <a
                href={whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-neutral-50 transition-colors"
              >
                <svg
                  className="w-4.5 h-4.5"
                  viewBox="0 0 30 30"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M16.003 3.2c-7.032 0-12.757 5.648-12.757 12.617 0 2.223.6 4.366 1.739 6.27L3.2 28.8l6.9-1.758a12.88 12.88 0 0 0 5.903 1.505h.007c7.032 0 12.757-5.648 12.757-12.617C28.767 8.848 23.036 3.2 16.003 3.2zm0 22.773h-.006a10.3 10.3 0 0 1-5.24-1.44l-.376-.223-4.096 1.043 1.095-3.988-.245-.41a10.32 10.32 0 0 1-1.576-5.506c0-5.682 4.637-10.302 10.341-10.302 5.675 0 10.3 4.62 10.3 10.302 0 5.68-4.625 10.302-10.297 10.302zm5.657-7.73c-.308-.154-1.822-.9-2.105-1.003-.283-.103-.488-.154-.694.154-.205.308-.8.996-.982 1.2-.18.205-.36.231-.668.077-.308-.154-1.3-.479-2.475-1.527-.915-.8-1.532-1.788-1.713-2.096-.18-.308-.02-.475.135-.628.139-.138.308-.36.462-.539.154-.18.205-.308.308-.514.103-.205.051-.385-.026-.539-.077-.154-.694-1.672-.95-2.288-.25-.6-.505-.52-.694-.53l-.592-.01c-.205 0-.539.077-.82.385-.283.308-1.08 1.054-1.08 2.57 0 1.516 1.106 2.98 1.26 3.185.154.205 2.177 3.33 5.27 4.672.737.318 1.313.508 1.762.651.74.235 1.414.202 1.948.123.594-.088 1.822-.744 2.08-1.462.257-.718.257-1.334.18-1.462-.077-.128-.283-.205-.591-.36z" />
                </svg>
                <span>{whatsapp.numberDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-neutral-200">
          <p>© {footer.copyrightYear} Kasiko Coffee. All rights reserved.</p>
          <p className="uppercase tracking-[0.25em]">
            {footer.cityLine}
          </p>
        </div>
      </div>
    </footer>
  );
}

