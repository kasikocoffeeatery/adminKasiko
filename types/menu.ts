export type MenuCategory = 
  | 'all' 
  | 'coffee-milk' 
  | 'non-coffee' 
  | 'mocktail' 
  | 'coldbrew' 
  | 'frappe-series' 
  | 'tea-based' 
  | 'manual-brew' 
  | 'milk-based' 
  | 'espresso-based' 
  | 'classic-coffee' 
  | 'basic-tea' 
  | 'ricebowl' 
  | 'local-dish' 
  | 'cake-cookies' 
  | 'snack' 
  | 'spaghetti' 
  | 'sweet-treats';

export interface PriceOption {
  jenis: string;
  harga: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  kategori: PriceOption[];
  category: MenuCategory;
  image?: string;
  isPopular?: boolean;
}

