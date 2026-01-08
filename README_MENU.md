# Panduan Menambahkan Menu Kasiko Coffee

## Struktur Kategori Menu

Berdasarkan gambar menu di Google Drive, kategori menu yang tersedia:

1. **Classic Coffee** - Kopi klasik
2. **Coffee & Milk** - Kopi dengan susu
3. **Coldbrew** - Kopi coldbrew
4. **Frappe Series** - Seri frappe
5. **Non Coffee** - Minuman non kopi
6. **Basic Tea** - Teh dasar
7. **Mocktail** - Minuman mocktail
8. **Ricebowl** - Rice bowl
9. **Spaghetti** - Pasta spaghetti
10. **Local Dish** - Masakan lokal
11. **Chicken Wings** - Sayap ayam
12. **Snack** - Cemilan
13. **Cake & Cookies** - Kue dan kukis
14. **Sweet Treats** - Makanan manis

## Cara Menambahkan Menu

### 1. Download Gambar dari Google Drive

Download semua file PNG dari Google Drive:
- `CLASSIC COFFEE.png`
- `COFFEE & MILK.png`
- `COLDBREW.png`
- `FRAPPE SERIES.png`
- `NON COFFEE.png`
- `BASIC TEA.png`
- `MOCKTAIL.png`
- `RICEBOWL.png`
- `SPAGHETTI.png`
- `LOCAL DISH.png`
- `CHICKEN WINGS.png`
- `SNACK.png`
- `CAKE & COOKIES.png`
- `SWEET TREATS.png`

### 2. Simpan Gambar ke Folder Public

Buat folder `public/images/` dan simpan semua gambar PNG di sana.

### 3. Tambahkan Data Menu

Edit file `data/menu.ts` dan tambahkan menu items sesuai format:

```typescript
{
  id: 'unique-id',
  name: 'Nama Menu',
  description: 'Deskripsi menu',
  price: 25000,
  category: 'classic-coffee', // sesuai kategori
  image: '/images/CLASSIC COFFEE.png', // path ke gambar
  isPopular: false, // optional: true jika menu populer
}
```

### 4. Contoh Menu Item

```typescript
{
  id: 'cc-1',
  name: 'Espresso',
  description: 'Kopi espresso klasik dengan rasa yang kuat',
  price: 15000,
  category: 'classic-coffee',
  image: '/images/CLASSIC COFFEE.png',
  isPopular: true,
}
```

## Kategori yang Tersedia

- `'classic-coffee'` - Classic Coffee
- `'coffee-milk'` - Coffee & Milk
- `'coldbrew'` - Coldbrew
- `'frappe-series'` - Frappe Series
- `'non-coffee'` - Non Coffee
- `'basic-tea'` - Basic Tea
- `'mocktail'` - Mocktail
- `'ricebowl'` - Ricebowl
- `'spaghetti'` - Spaghetti
- `'local-dish'` - Local Dish
- `'chicken-wings'` - Chicken Wings
- `'snack'` - Snack
- `'cake-cookies'` - Cake & Cookies
- `'sweet-treats'` - Sweet Treats

## Catatan

- Jika setiap menu item punya gambar individual, simpan di `public/images/` dan gunakan path lengkap
- Jika menggunakan gambar kategori (satu gambar untuk semua item di kategori), gunakan path yang sama untuk semua item di kategori tersebut
- Harga dalam format Rupiah (number, tanpa titik atau koma)

