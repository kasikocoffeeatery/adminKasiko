export type MenuCategory = 
  | 'all' 
  | 'coffee-latte'
  | 'classic-coffee' 
  | 'coffee-milk' 
  | 'coldbrew' 
  | 'frappe-series' 
  | 'non-coffee' 
  | 'basic-tea' 
  | 'mocktail' 
  | 'ricebowl' 
  | 'spaghetti' 
  | 'local-dish' 
  | 'chicken-wings' 
  | 'snack' 
  | 'cake-cookies' 
  | 'sweet-treats';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image?: string;
  isPopular?: boolean;
}

