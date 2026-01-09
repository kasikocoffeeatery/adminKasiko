import { MenuItem } from '@/types/menu';
import MenuItemCard from './MenuItemCard';

interface BestSellerSectionProps {
  items: MenuItem[];
  title?: string;
  overline?: string;
  description?: string;
}

export default function BestSellerSection({
  items,
  title = 'Best Sellers',
  overline = 'Pilihan Pengunjung',
  description = 'Menu yang paling sering kembali dipesan—ringkasan rasa Kasiko yang aman dipilih untuk kunjungan pertama maupun kesekian kali.',
}: BestSellerSectionProps) {
  return (
    <section className="py-16 md:py-20 border-t border-neutral-200/80">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        <div className="flex flex-col items-center text-center gap-2.5 mb-10 md:mb-12">
          <p className="text-[10px] md:text-[11px] font-medium tracking-[0.32em] uppercase text-neutral-500">
            {overline}
          </p>
          <h2 className="text-[22px] md:text-[28px] font-semibold tracking-tight text-neutral-900 leading-snug">
            {title}
          </h2>
          <p className="text-[12px] md:text-sm text-neutral-500 max-w-xl leading-relaxed">
            {description}
          </p>
          <div className="h-px w-16 md:w-20 bg-neutral-200 mt-3" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

