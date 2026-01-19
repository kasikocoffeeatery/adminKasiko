import { MenuItem } from '@/types/menu';

// Helper function to convert menu name to image filename
// Converts name to uppercase and replaces spaces/hyphens with underscores
function getImagePath(name: string): string {
  const filename = name.toUpperCase();
  return `/images/menu/${filename}.png`;
}

// Menu data Kasiko Coffee
// Semua gambar disimpan di folder public/images/
// Nama file gambar sesuai dengan nama menu (huruf kapital, spasi diganti underscore)
// Contoh: "Espresso" -> "/images/ESPRESSO.jpg"
// Contoh: "Caffee Latte" -> "/images/CAFFEE_LATTE.jpg"

export const menuData: MenuItem[] = [

  // Coffee Milk
  {
    id: 'cm-1',
    name: 'Aren Signature',
    description: 'Perpaduan Gula Aren Murni dengan Susu Freshmilk dan Esspreso',
    kategori: [{ jenis: 'Reguler', harga: 23000 }, { jenis: 'Large', harga: 35000 }],
    category: 'coffee-milk',
    image: getImagePath('coffee&milk/Aren Signature'),
    isPopular: true,
  },
  {
    id: 'cm-2',
    name: 'Oriental Signature',
    description: 'Kopi susu dengan kayu manis, cengkeh, kapulaga',
    kategori: [{ jenis: 'Reguler', harga: 23000 }, { jenis: 'Large', harga: 35000 }],
    category: 'coffee-milk',
    image: getImagePath('coffee&milk/Oriental Signature'),
  },
  {
    id: 'cm-3',
    name: 'Baileys Coffee',
    description: 'Kopi istimewa dengan sentuhan Baileys yang creamy dan manis, dipadukan dengan RAM untuk menghadirkan cita rasa yang lebih bold.',
    kategori: [{ jenis: 'Reguler', harga: 23000 }, { jenis: 'Large', harga: 35000 }],
    category: 'coffee-milk',
    image: getImagePath('coffee&milk/BAILEYS COFFEE'),
  },
  {
    id: 'cm-4',
    name: 'Almond Harmony',
    description: 'Nutty Almond, Creamy Milk, Ringan Penuh Dengan Karakter',
    kategori: [{ jenis: 'Reguler', harga: 23000 }, { jenis: 'Large', harga: 35000 }],
    category: 'coffee-milk',
    image: getImagePath('coffee&milk/Almond Harmony'),
    isPopular: true
  },
  {
    id: 'cm-5',
    name: 'Hazelnut Harmony',
    description: 'Aroma hazelnut yang kuat, kopi arabika dan susu creamy homemade',
    kategori: [{ jenis: 'Reguler', harga: 25000 }, { jenis: 'Large', harga: 35000 }],
    category: 'coffee-milk',
    image: getImagePath('coffee&milk/Hazelnut Harmony'),
  },
  {
    id: 'cm-6',
    name: 'Cendol Creme',
    description: 'Susu segar, creamy, gula aren, dan esspreso',
    kategori: [{ jenis: 'Reguler', harga: 25000 }, { jenis: 'Large', harga: 35000 }],
    category: 'coffee-milk',
    image: getImagePath('coffee&milk/Cendol Creme'),
  },
  {
    id: 'cm-7',
    name: 'Banana Creme',
    description: 'Perpaduan Esspreso dengan Syrup Banana dan Susu Segar',
    kategori: [{ jenis: 'Reguler', harga: 25000 }, { jenis: 'Large', harga: 35000 }],
    category: 'coffee-milk',
    image: getImagePath('coffee&milk/Banana Creme'),
  },
  {
    id: 'cm-8',
    name: 'Pistachio Creme',
    description: 'Nutty, creamy, buttery. Rasa pistachio dan brownbutter yang nyaman di setiap tegukan',
    kategori: [{ jenis: 'Reguler', harga: 25000 }, { jenis: 'Large', harga: 35000 }],
    category: 'coffee-milk',
    image: getImagePath('coffee&milk/Pistachio Creme'),
  },
  {
    id: 'cm-9',
    name: 'Butterscotch Creme',
    description: 'Syrup Butterscotch Yang Manis Dipadu Dengan Segarnya Freshmilk dan Esspreso',
    kategori: [{ jenis: 'Reguler', harga: 25000 }, { jenis: 'Large', harga: 35000 }],
    category: 'coffee-milk',
    image: getImagePath('coffee&milk/Butterscotch'),
  },
  {
    id: 'cm-10',
    name: 'Salted Butter Symphony',
    description: 'Perpaduan harmonis antara gurih lembut salted butter dengan sentuhan manis yang seimbang. Rasa creamy, rich, dan sedikit savory menghadirkan sensasi elegan yang memanjakan lidah.',
    kategori: [{ jenis: 'Reguler', harga: 28000 }, { jenis: 'Large', harga: 38000 }],
    category: 'coffee-milk',
    image: getImagePath('coffee&milk/Salted Butter Symphony'),
  },
  {
    id: 'cm-11',
    name: 'Hazeloats Crumble',
    description: 'Hazelnut Flavour, Espresso, Oatside Milk With Crumble',
    kategori: [{ jenis: 'Reguler', harga: 28000 }, { jenis: 'Large', harga: 38000 }],
    category: 'coffee-milk',
    image: getImagePath('coffee&milk/Hazeloats Crumble'),
  },
  {
    id: 'cm-12',
    name: 'Treviso Crumbs',
    description: 'Tiramisu flavour, espresso, milk and crumble',
    kategori: [{ jenis: 'Reguler', harga: 28000 }, { jenis: 'Large', harga: 38000 }],
    category: 'coffee-milk',
    image: getImagePath('coffee&milk/TREVISO CRUMBS'),
  },

  // Non Coffee
  {
    id: 'nc-1',
    name: 'Matcha',
    description: 'Matcha premium dengan susu steamed',
    kategori: [{ jenis: 'Hot', harga: 23000 }, { jenis: 'Cold', harga: 23000 }],
    category: 'non-coffee',
    image: getImagePath('noncoffee/MATCHA'),
    isPopular: true,
  },
  {
    id: 'nc-2',
    name: 'Chocolate',
    description: 'Cokelat yang creamy dan manis',
    kategori: [{ jenis: 'Hot', harga: 23000 }, { jenis: 'Cold', harga: 23000 }],
    category: 'non-coffee',
    image: getImagePath('noncoffee/Chocolate'),
  },
  {
    id: 'nc-3',
    name: 'Red Velvet',
    description: 'Red velvet dengan susu steamed',
    kategori: [{ jenis: 'Hot', harga: 23000 }, { jenis: 'Cold', harga: 23000 }],
    category: 'non-coffee',
    image: getImagePath('noncoffee/RED VELVET'),
  },
  {
    id: 'nc-5',
    name: 'Choco Cheese Lava',
    description: 'Chocolate flavour, espresso, milk and crumble',
    kategori: [{ jenis: 'Hot', harga: 23000 }, { jenis: 'Cold', harga: 23000 }],
    category: 'non-coffee',
    image: getImagePath('noncoffee/Choco Cheese Lava'),
  },
  {
    id: 'nc-6',
    name: 'Matcha Cheese Lava',
    description: 'Matcha flavour, espresso, milk and crumble',
    kategori: [{ jenis: 'Hot', harga: 23000 }, { jenis: 'Cold', harga: 23000 }],
    category: 'non-coffee',
    image: getImagePath('noncoffee/Matcha Cheese Lava'),
  },
  {
    id: 'nc-7',
    name: 'Red Velvet Cheese Lava',
    description: 'Red velvet flavour, espresso, milk and crumble',
    kategori: [{ jenis: 'Hot', harga: 23000 }, { jenis: 'Cold', harga: 23000 }],
    category: 'non-coffee',
    image: getImagePath('noncoffee/RED VELVET CHEESE LAVA'),
  },

  // Mocktail
  {
    id: 'mk-1',
    name: 'Pinky Berry Punch',
    description: 'Mocktail dengan berry yang segar',
    kategori: [{ jenis: 'Normal', harga: 23000 }],
    category: 'mocktail',
    image: getImagePath('mocktail/pink berry punch'),
  },
  {
    id: 'mk-2',
    name: 'Purple Fox',
    description: 'Mocktail dengan warna ungu yang menarik',
    kategori: [{ jenis: 'Normal', harga: 23000 }],
    category: 'mocktail',
    image: getImagePath('mocktail/purple fox'),
  },
  {
    id: 'mk-3',
    name: 'Rosella Royale',
    description: '',
    kategori: [{ jenis: 'Normal', harga: 23000 }],
    category: 'mocktail',
    image: getImagePath('mocktail/rosella royale'),
  },
  {
    id: 'mk-4',
    name: 'Crimson Muse',
    description: 'Segar, floral dan sedikit misterius. orange sanguin bertemu vanilla dan chamomile, dibalut jus apel dan sentuhan rum non alkohol',
    kategori: [{ jenis: 'Normal', harga: 23000 }],
    category: 'mocktail',
    image: getImagePath('mocktail/crimson muse'),
  },
  {
    id: 'mk-5',
    name: 'Tropical Zing',
    description: 'Manis tropis, segar dan sedikit menggigit. Pineapple dan mango berpadu disambut hangat oleh ginger',
    kategori: [{ jenis: 'Normal', harga: 23000 }],
    category: 'mocktail',
    image: getImagePath('mocktail/tropical zing'),
  },
  {
    id: 'mk-6',
    name: 'Velvet Garden',
    description: 'Manis, Floral Dan Sedikit Tart. Raspberry Yang Berani Dipadukan Dengan Kelembutan Caramel, Guava Tropis Yang Juicy, Aroma Chamomile Yang Menenangkan.',
    kategori: [{ jenis: 'Normal', harga: 23000 }],
    category: 'mocktail',
    image: getImagePath('mocktail/velvet garden'),
  },
  {
    id: 'mk-7',
    name: 'Hanami Bliss',
    description: 'Floral, Fruity. Fantasi Musim Semi Dalam Tegukan',
    kategori: [{ jenis: 'Normal', harga: 23000 }],
    category: 'mocktail',
    image: getImagePath('mocktail/hanami bliss'),
  },
  {
    id: 'mk-8',
    name: 'Pink Orchard Cloud',
    description: 'Mocktail dengan rasa buah yang segar',
    kategori: [{ jenis: 'Normal', harga: 22000 }],
    category: 'mocktail',
    image: getImagePath('mocktail/pink orchard'),
  },

  // Coldbrew
  {
    id: 'cb-1',
    name: 'Mangifera Indica',
    description: '',
    kategori: [{ jenis: 'Normal', harga: 23000 }],
    category: 'coldbrew',
    image: getImagePath('Mangifera Indica'),
    isPopular: true,
  },
  {
    id: 'cb-2',
    name: 'Malus Domestica',
    description: '',
    kategori: [{ jenis: 'Normal', harga: 23000 }],
    category: 'coldbrew',
    image: getImagePath('Malus Domestica'),
  },

  // Frappe Series
  {
    id: 'fr-1',
    name: 'Choco Frappucino',
    description: 'Frappucino dengan cokelat yang kaya',
    kategori: [{ jenis: 'Normal', harga: 28000 }],
    category: 'frappe-series',
    image: getImagePath('frappe/choco frappuccino'),
  },
  {
    id: 'fr-2',
    name: 'Matcha Frappucino',
    description: 'Frappucino dengan matcha premium',
    kategori: [{ jenis: 'Normal', harga: 28000 }],
    category: 'frappe-series',
    image: getImagePath('frappe/matcha frappuccino'),
  },
  {
    id: 'fr-3',
    name: 'Strawberry Frappucino',
    description: 'Frappucino dengan strawberry premium',
    kategori: [{ jenis: 'Normal', harga: 28000 }],
    category: 'frappe-series',
    image: getImagePath('frappe/strawberry frappuccino'),
  },
  {
    id: 'fr-4',
    name: 'Red Velvet Frappucino',
    description: 'Frappucino dengan rasa red velvet yang manis',
    kategori: [{ jenis: 'Normal', harga: 28000 }],
    category: 'frappe-series',
    image: getImagePath('frappe/red velvet frappuccino'),
  },
  {
    id: 'fr-5',
    name: 'Butterscotch Frappucino',
    description: 'Frappucino dengan rasa butterscotch yang manis',
    kategori: [{ jenis: 'Normal', harga: 28000 }],
    category: 'frappe-series',
    image: getImagePath('frappe/butterscotch frappuccino'),
  },

    // Tea Based
    {
      id: 'tb-1',
      name: 'Lemon Tea',
      description: 'Teh lemon premium dengan aroma yang menyegarkan',
      kategori: [{ jenis: 'Regular', harga: 18000 }, { jenis: 'Large', harga: 28000 }],
      category: 'tea-based',
      image: getImagePath('teabased/Lemon Tea'),
    },
    {
      id: 'tb-2',
      name: 'Lychee Tea',
      description: 'Teh lychee premium dengan aroma yang menyegarkan',
      kategori: [{ jenis: 'Regular', harga: 18000 }, { jenis: 'Large', harga: 28000 }],
      category: 'tea-based',
      image: getImagePath('teabased/Lychee Tea'),
    },
    
    // Manual Brew
    {
      id: 'mab-1',
      name: 'Local Beans',
      description: 'Ask Our Barista For More Information',
      kategori: [{ jenis: 'Hot', harga: 30000 }, { jenis: 'Cold', harga: 40000 }],
      category: 'manual-brew',
      image: getImagePath('manualbrew/local beans'),
    },
    {
      id: 'mab-2',
      name: 'Import Beans',
      description: '',
      kategori: [{ jenis: 'Hot', harga: 60000 }, { jenis: 'Cold', harga: 70000 }],
      category: 'manual-brew',
      image: getImagePath('manualbrew/import beans'),
    },

  // Milk Based
  {
    id: 'mb-1',
    name: 'Caffe Latte',
    description: 'Espresso dengan susu steamed yang creamy dan halus',
    kategori: [{ jenis: 'Hot', harga: 20000 }, { jenis: 'Cold', harga: 20000 }],
    category: 'milk-based',
    image: getImagePath('milkbased/CAFFEE LATTE'),
  },
  {
    id: 'mb-2',
    name: 'Cappuccino',
    description: 'Espresso dengan susu steamed dan foam yang lembut',
    kategori: [{ jenis: 'Hot', harga: 20000 }, { jenis: 'Cold', harga: 20000 }],
    category: 'milk-based',
    image: getImagePath('milkbased/CAPPUCCINO'),
  },
  {
    id: 'mb-3',
    name: 'Magic',
    description: 'Espresso dengan susu steamed dan foam yang lembut',
    kategori: [{ jenis: 'Normal', harga: 20000 }],
    category: 'milk-based',
    image: getImagePath('milkbased/Magic'),
  },
  {
    id: 'mb-4',
    name: 'Piccolo',
    description: 'Espresso dengan susu steamed dan foam yang lembut',
    kategori: [{ jenis: 'Normal', harga: 18000 }],
    category: 'milk-based',
    image: getImagePath('milkbased/Piccolo'),
  },
  {
    id: 'mb-5',
    name: 'Flat White',
    description: 'Espresso dengan susu steamed tanpa foam',
    kategori: [{ jenis: 'Normal', harga: 20000 }],
    category: 'milk-based',
    image: getImagePath('milkbased/Flat Whie'),
  },

  // Espresso Based
  {
    id: 'eb-1',
    name: 'Black',
    description: 'Espresso dengan air panas',
    kategori: [{ jenis: 'Hot', harga: 20000 }, { jenis: 'Cold', harga: 20000 }],
    category: 'espresso-based',
    image: getImagePath('Americano'),
  },
  {
    id: 'eb-2',
    name: 'Single Shot',
    description: 'Espresso dengan air panas yang lebih banyak',
    kategori: [{ jenis: 'Normal', harga: 8000 }],
    category: 'espresso-based',
    image: getImagePath('Single Shot'),
  },
  {
    id: 'eb-3',
    name: 'Double Shot',
    description: 'Espresso dengan air panas yang lebih banyak',
    kategori: [{ jenis: 'Normal', harga: 16000 }],
    category: 'espresso-based',
    image: getImagePath('Double Shot'),
  },
  
  // Ricebowl
  {
    id: 'rb-1',
    name: 'Beef Teriyaki',
    description: 'Perpaduan Nasi Hangat dengan Nikmatnya Saus Teriyaki',
    kategori: [{ jenis: 'Normal', harga: 33000 }],
    category: 'ricebowl',
    image: getImagePath('ricebowl/Beef Teriyaki'),
    isPopular: true,
  },
  { 
    id: 'rb-2',
    name: 'Beef Yakiniku',
    description: 'Perpaduan Nasi dengan Beef Dibalut nikmatnya saus Yakiniku',
    kategori: [{ jenis: 'Normal', harga: 33000 }],
    category: 'ricebowl',
    image: getImagePath('ricebowl/Beef Yakiniku'),
  },
  { 
    id: 'rb-3',
    name: 'Chicken Popcorn Creamy Mushroom',
    description: 'Perpaduan Nasi dengan Ayam Dibalut Dengan Mushroom Sauce',
    kategori: [{ jenis: 'Normal', harga: 29000 }],
    category: 'ricebowl',
    image: getImagePath('ricebowl/Chicken Popcorn Creamy Mushroom'),
  },
  { 
    id: 'rb-4',
    name: 'Chicken Popcorn Korean Sauce',
    description: 'Perpaduan Nasi dengan Ayam Dibalut Dengan Saus Korean',
    kategori: [{ jenis: 'Normal', harga: 29000 }],
    category: 'ricebowl',
    image: getImagePath('ricebowl/Chicken Popcorn Korean Sauce'),
  },
  { 
    id: 'rb-5',
    name: 'Chicken Popcorn Matah Sauce',
    description: 'Perpaduan Nasi Hangat dengan Pedasnya Sambal Matah',
    kategori: [{ jenis: 'Normal', harga: 29000 }],
    category: 'ricebowl',
    image: getImagePath('ricebowl/Chicken Popcorn Matah Sauce'),
  },
  { 
    id: 'rb-6',
    name: 'Chicken Popcorn BBQ Sauce',
    description: 'Potongan ayam pilihan yang digoreng crispy, disajikan dalam bentuk bite-size yang praktis dan lezat. Dipadukan dengan saus BBQ khas Kasiko yang manis, menjadikan setiap gigitan terasa penuh rasa. Cocok sebagai camilan teman.',
    kategori: [{ jenis: 'Normal', harga: 29000 }],
    category: 'ricebowl',
    image: getImagePath('ricebowl/Chicken Popcorn BBQ Sauce'),
  },

  // Local Dish
  {
    id: 'ld-1',
    name: 'Nasi Ayam Bakar Cabe Ijo',
    description: 'Nasi dengan ayam bakar khas Kasiko',
    kategori: [{ jenis: 'Normal', harga: 25000 }],
    category: 'local-dish',
    image: getImagePath('localdish/Nasi Ayam Bakar Kasiko'),
    isPopular: true,
  },
  {
    id: 'ld-2',
    name: 'Nasi Ayam Goreng Serundeng Cabe Ijo',
    description: 'Hidangan khas Nusantara yang kaya cita rasa. Ayam goreng berbumbu rempah pilihan, digoreng hingga renyah di luar namun tetap juicy di dalam, disajikan bersama serundeng kelapa yang gurih dan harum. Lengkap dengan nasi hangat, lalapan segar, sambal',
    kategori: [{ jenis: 'Normal', harga: 25000 }],
    category: 'local-dish',
    image: getImagePath('localdish/Nasi Ayam Goreng Serundeng Cabe Ijo'),
  },
  {
    id: 'ld-3',
    name: 'Nasi Cumi Balado Kasiko',
    description: 'Nasi dengan cumi balado khas Kasiko',
    kategori: [{ jenis: 'Normal', harga: 25000 }],
    category: 'local-dish',
    image: getImagePath('localdish/Nasi Cumi Balado Kasiko'),
  },
  {
    id: 'ld-4',
    name: 'Nasi Goreng Kampung',
    description: 'Nasi goreng khas Nusantara dengan bumbu tradisional yang harum dan menggugah selera. Dimasak dengan cabai, bawang, serta rempah pilihan, menghadirkan cita rasa gurih yang autentik.',
    kategori: [{ jenis: 'Normal', harga: 25000 }],
    category: 'local-dish',
    image: getImagePath('localdish/Nasi Goreng Kampung'),
    isPopular: true,
  },
  {
    id: 'ld-5',
    name: 'Nasi Goreng Teri',
    description: 'Nasi goreng dengan cita rasa khas Nusantara, dimasak bersama teri crispy yang gurih dan harum. Setiap suapan menghadirkan perpaduan sempurna antara nasi berbumbu rempah pilihan dengan renyahnya ikan teri.',
    kategori: [{ jenis: 'Normal', harga: 25000 }],
    category: 'local-dish',
    image: getImagePath('localdish/Nasi Goreng Teri'),
  },
  {
    id: 'ld-6',
    name: 'Nasi Goreng Seafood',
    description: 'Nasi goreng khas Nusantara dengan bumbu tradisional yang harum dan menggugah selera. Dimasak dengan cabai, bawang, serta rempah pilihan, menghadirkan cita rasa gurih',
    kategori: [{ jenis: 'Normal', harga: 32000 }],
    category: 'local-dish',
    image: getImagePath('localdish/Nasi Goreng Seafood'),
  },

  // Cake & Cookies
  {
    id: 'ck-1',
    name: 'New York Cheese Cake with Caramel Sauce',
    description: 'Cheesecake lembut dengan tekstur creamy yang meleleh di mulut, dipadukan dengan manis legit saus karamel.',
    kategori: [{ jenis: 'Normal', harga: 28000 }],
    category: 'cake-cookies',
    image: getImagePath('CAKE&COOKIES/New York Cheese Cake with Caramel Sauce'),
  },
  {
    id: 'ck-2',
    name: 'New York Cheese Cake with Berry Compote',
    description: 'Cheesecake lembut nan creamy berpadu dengan segarnya berry compote yang manis dan asam. Setiap suapan menghadirkan harmoni rasa gurih dari cream cheese dan kesegaran buah beri yang kaya akan aroma',
    kategori: [{ jenis: 'Normal', harga: 28000 }],
    category: 'cake-cookies',
    image: getImagePath('CAKE&COOKIES/New York Cheese Cake with Berry Compote'),
  },
  {
    id: 'ck-3',
    name: 'New York Cheese Cake Original',
    description: '',
    kategori: [{ jenis: 'Normal', harga: 25000 }],
    category: 'cake-cookies',
    image: getImagePath('CAKE&COOKIES/New York Cheese Cake Original'),
  },
  {
    id: 'ck-4',
    name: 'Cookies Red Velvet',
    description: 'Kukis dengan rasa red velvet yang lembut dan kaya',
    kategori: [{ jenis: 'Normal', harga: 17000 }],
    category: 'cake-cookies',
    image: getImagePath('CAKE&COOKIES/Cookies Red Velvet'),
    isPopular: true,
  },
  {
    id: 'ck-5',
    name: 'Cookies Matcha',
    description: 'Kukis dengan rasa matcha yang lembut dan kaya',
    kategori: [{ jenis: 'Normal', harga: 17000 }],
    category: 'cake-cookies',
    image: getImagePath('CAKE&COOKIES/Cookies Matcha'),
    isPopular: true,
  },
  {
    id: 'ck-6',
    name: 'Cookies and Cream',
    description: 'Kukis dengan rasa cookies and cream yang lembut dan kaya',
    kategori: [{ jenis: 'Normal', harga: 17000 }],
    category: 'cake-cookies',
    image: getImagePath('CAKE&COOKIES/Cookies and Cream'),
    isPopular: true,
  },
  {
    id: 'ck-7',
    name: 'Cookies Original',
    description: 'Kukis dengan rasa original yang lembut dan kaya',
    kategori: [{ jenis: 'Normal', harga: 15000 }],
    category: 'cake-cookies',
    image: getImagePath('CAKE&COOKIES/Cookies Original'),
  },

  // Snack
  {
    id: 'sn-1',
    name: 'French Fries',
    description: 'Kentang goreng yang renyah',
    kategori: [{ jenis: 'Normal', harga: 18000 }],
    category: 'snack',
    image: getImagePath('snack/FRENCH FRIES'),
  },
  {
    id: 'sn-2',
    name: 'Cheesy Fries',
    description: 'French fries dengan keju yang melimpah',
    kategori: [{ jenis: 'Normal', harga: 20000 }],
    category: 'snack',
    image: getImagePath('snack/Cheesy Fries'),
  },
  {
    id: 'sn-3',
    name: 'Truffle Fries',
    description: 'Crispy Fries Tossed In Aromatic Truffle Oil With Parmesan Cheese',
    kategori: [{ jenis: 'Normal', harga: 22000 }],
    category: 'snack',
    image: getImagePath('snack/Truffle Fries'),
  },
  {
    id: 'sn-4',
    name: 'Mix Platter',
    description: 'Perpaduan camilan favorit dalam satu piring: nugget renyah, sosis gurih, dan kentang goreng golden crispy. Disajikan hangat dengan cocolan saus pilihan yang bikin setiap gigitan semakin nikmat.',
    kategori: [{ jenis: 'Normal', harga: 23000 }],
    category: 'snack',
    image: getImagePath('snack/Mix Platter'),
  },
  {
    id: 'sn-5',
    name: 'Corn Ribs',
    description: '',
    kategori: [{ jenis: 'Normal', harga: 20000 }],
    category: 'snack',
    image: getImagePath('snack/Corn Ribs'),
  },
  {
    id: 'sn-6',
    name: 'Brulee Bomb',
    description: 'Keju Mozarella Yang Lumer Dengan Tambahan Smoke Beef',
    kategori: [{ jenis: 'Normal', harga: 20000 }],
    category: 'snack',
    image: getImagePath('snack/Brulee Bomb'),
  },
  {
    id: 'sn-7',
    name: 'Cireng Rujak',
    description: 'Cireng dengan bumbu rujak yang pedas',
    kategori: [{ jenis: 'Normal', harga: 18000 }],
    category: 'snack',
    image: getImagePath('snack/Cireng Rujak'),
  },
  {
    id: 'sn-8',
    name: 'Tahu Cabe Garam',
    description: 'Tahu Goreng Yang Digoreng Crispy Dengan Tambahan Cabe Garam Yang Pedas',
    kategori: [{ jenis: 'Normal', harga: 18000 }],
    category: 'snack',
    image: getImagePath('snack/Tahu Cabe Garam'),
  },
  {
    id: 'sn-9',
    name: 'Onion Rings',
    description: 'Bawang Bombai Yang Digoreng Crispy Yang Memberikan Rasa Kenikmatan Dan Kerenyahan',
    kategori: [{ jenis: 'Normal', harga: 20000 }],
    category: 'snack',
    image: getImagePath('snack/Onion Rings'),
  },

  // Spaghetti
  {
    id: 'sp-1',
    name: 'Spaghetti Carbonara',
    description: 'Spaghetti Dengan Saus Carbonara Yang Manis Dan Gurih',
    kategori: [{ jenis: 'Normal', harga: 28000 }],
    category: 'spaghetti',
    image: getImagePath('spaghetti/SPAGHETTI CARBONARA'),
    isPopular: true,
  },
  {
    id: 'sp-2',
    name: 'Spaghetti Bolognese',
    description: 'Spaghetti Dengan Saus Bolognese Yang Manis Dan Gurih',
    kategori: [{ jenis: 'Normal', harga: 28000 }],
    category: 'spaghetti',
    image: getImagePath('spaghetti/Spaghetti Bolognese'),
  },
  {
    id: 'sp-3',
    name: 'Spaghetti Aglio Olio',
    description: 'Spaghetti Dengan Saus Aglio Olio Yang Manis Dan Gurih',
    kategori: [{ jenis: 'Normal', harga: 28000 }],
    category: 'spaghetti',
    image: getImagePath('spaghetti/Spaghetti Aglio Olio'),
  },
  {
    id: 'sp-4',
    name: 'Spaghetti Creamy Mushroom',
    description: 'Spaghetti Dengan Saus Creamy Mushroom Yang Manis Dan Gurih',
    kategori: [{ jenis: 'Normal', harga: 28000 }],
    category: 'spaghetti',
    image: getImagePath('spaghetti/Spaghetti Creamy Mushroom'),
  },

  // Sweet Treats
  {
    id: 'st-1',
    name: 'Pisang Bakar Kasiko',
    description: 'Pisang bakar khas Kasiko',
    kategori: [{ jenis: 'Normal', harga: 18000 }],
    category: 'sweet-treats',
    image: getImagePath('sweet/Pisang Bakar Kasiko'),
  },
  {
    id: 'st-2',
    name: 'Pisang Goreng Kasiko',
    description: 'Pisang goreng khas Kasiko',
    kategori: [{ jenis: 'Normal', harga: 18000 }],
    category: 'sweet-treats',
    image: getImagePath('sweet/Pisang Goreng Kasiko'),
  },
  {
    id: 'st-3',
    name: 'Kue Pukis',
    description: 'Kue pukis yang lembut',
    kategori: [{ jenis: 'Normal', harga: 15000 }],
    category: 'sweet-treats',
    image: getImagePath('sweet/Kue Pukis'),
  },
  {
    id: 'st-4',
    name: 'Churros',
    description: 'Churros dengan cokelat sauce',
    kategori: [{ jenis: 'Normal', harga: 15000 }],
    category: 'sweet-treats',
    image: getImagePath('sweet/Churros'),
  },
  {
    id: 'st-5',
    name: 'Mantao Goreng Aren',
    description: 'Mantao goreng dengan aren yang manis',
    kategori: [{ jenis: 'Normal', harga: 20000 }],
    category: 'sweet-treats',
    image: getImagePath('sweet/Mantao Goreng Aren'),
  }
  

  


  
  
  










];

