import { MenuItem } from '@/types/menu';
import MenuItemCard from './MenuItemCard';

interface BestSellerSectionProps {
  items: MenuItem[];
  title?: string;
}

export default function BestSellerSection({ items, title = 'Best Sellers' }: BestSellerSectionProps) {
  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-gray-900 mb-2">{title}</h2>
          <p className="text-sm text-gray-500 font-light">Menu favorit pilihan pelanggan</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

