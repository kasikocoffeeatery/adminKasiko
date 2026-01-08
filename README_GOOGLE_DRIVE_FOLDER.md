# Cara Menggunakan Gambar dari Google Drive Folder

## Link Folder Google Drive Anda:
https://drive.google.com/drive/folders/1aNPqHNie5pyk8km3bgC3lU83XuODZZkt

## Cara Mendapatkan File ID untuk Setiap Gambar:

### Metode 1: Dari Link Sharing File Individual

1. Buka folder Google Drive di atas
2. Klik kanan pada file gambar yang ingin digunakan
3. Pilih "Get link" atau "Dapatkan tautan"
4. Ubah permission menjadi "Anyone with the link can view"
5. Copy link yang diberikan

Link akan berbentuk:
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

**FILE_ID** adalah bagian antara `/d/` dan `/view`

### Metode 2: Menggunakan Utility Function

Di file `data/menu.ts`, gunakan helper function:

```typescript
import { getDriveImageLink } from '@/utils/googleDrive';

{
  id: 'menu-1',
  name: 'Almond Harmony',
  image: getDriveImageLink('FILE_ID_DARI_GOOGLE_DRIVE'),
  // atau langsung:
  // image: 'https://drive.google.com/uc?export=view&id=FILE_ID',
}
```

### Metode 3: Format Langsung

```typescript
{
  id: 'menu-1',
  name: 'Almond Harmony',
  image: 'https://drive.google.com/uc?export=view&id=FILE_ID',
}
```

## Contoh Mapping Menu dari Folder:

Berdasarkan folder Google Drive Anda, berikut contoh mapping:

```typescript
// Coffee
{
  id: 'cappuccino',
  name: 'Cappuccino',
  image: 'https://drive.google.com/uc?export=view&id=FILE_ID_CAPPUCINO',
},
{
  id: 'caffe-latte',
  name: 'Caffe Latte',
  image: 'https://drive.google.com/uc?export=view&id=FILE_ID_CAFFEE_LATTE',
},
{
  id: 'manual-brew',
  name: 'Manual Brew',
  image: 'https://drive.google.com/uc?export=view&id=FILE_ID_MANUAL_BREW',
},

// Frappucino
{
  id: 'choco-frappucino',
  name: 'Choco Frappucino',
  image: 'https://drive.google.com/uc?export=view&id=FILE_ID_CHOCO_FRAPPUCINO',
},
{
  id: 'matcha-frappucino',
  name: 'Matcha Frappucino',
  image: 'https://drive.google.com/uc?export=view&id=FILE_ID_MATCHA_FRAPPUCINO',
},

// Food
{
  id: 'beef-teriyaki',
  name: 'Beef Teriyaki',
  image: 'https://drive.google.com/uc?export=view&id=FILE_ID_BEEF_TERIYAKI',
},
{
  id: 'nasi-ayam-bakar-kasiko',
  name: 'Nasi Ayam Bakar Kasiko',
  image: 'https://drive.google.com/uc?export=view&id=FILE_ID_NASI_AYAM_BAKAR',
},

// Dessert
{
  id: 'new-york-cheese-cake',
  name: 'New York Cheese Cake',
  image: 'https://drive.google.com/uc?export=view&id=FILE_ID_CHEESE_CAKE',
},
```

## Catatan Penting:

1. **Permission**: Pastikan setiap file diubah permission menjadi "Anyone with the link can view"
2. **File ID**: Setiap file memiliki FILE_ID yang unik
3. **Format Link**: Gunakan format `https://drive.google.com/uc?export=view&id=FILE_ID`
4. **Testing**: Buka link langsung di browser untuk memastikan gambar bisa diakses

## Tips:

- Untuk mendapatkan FILE_ID dengan cepat, buka file di Google Drive dan lihat URL di address bar
- Atau gunakan Google Drive API untuk mendapatkan semua file ID sekaligus (advanced)

