import { MenuItem as MenuItemType } from '@/types/menu';
import MenuItem from './MenuItem';

interface MenuGridProps {
  items: MenuItemType[];
}

export default function MenuGrid({ items }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <p className="text-sm text-gray-500 font-medium">Tidak ada menu di kategori ini</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 w-full">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <MenuItem item={item} />
        </div>
      ))}
    </div>
  );
}

