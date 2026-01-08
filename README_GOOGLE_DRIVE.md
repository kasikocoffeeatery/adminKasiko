# Cara Menggunakan Gambar dari Google Drive

## Langkah-langkah:

### 1. Upload gambar ke Google Drive
- Upload gambar menu ke Google Drive Anda
- Pastikan gambar dalam format JPG, PNG, atau WebP

### 2. Dapatkan Link Sharing
- Klik kanan pada file gambar di Google Drive
- Pilih "Get link" atau "Dapatkan tautan"
- Ubah permission menjadi "Anyone with the link" atau "Siapa saja yang memiliki tautan"
- Copy link yang diberikan

### 3. Convert Link ke Format Direct Link

Google Drive memberikan link dalam format:
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

Untuk digunakan di website, ubah menjadi format direct link:
```
https://drive.google.com/uc?export=view&id=FILE_ID
```

**Cara mendapatkan FILE_ID:**
- Dari link sharing: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
- FILE_ID adalah bagian antara `/d/` dan `/view`

**Contoh:**
- Link asli: `https://drive.google.com/file/d/1ABC123xyz456/view?usp=sharing`
- FILE_ID: `1ABC123xyz456`
- Direct link: `https://drive.google.com/uc?export=view&id=1ABC123xyz456`

### 4. Alternatif: Gunakan Google Drive Thumbnail API

Format lain yang bisa digunakan:
```
https://lh3.googleusercontent.com/d/FILE_ID
```

### 5. Update Data Menu

Edit file `data/menu.ts` dan ganti path gambar:

```typescript
{
  id: 'cc-1',
  name: 'Espresso',
  description: 'Kopi espresso klasik dengan rasa yang kuat dan kental',
  price: 15000,
  category: 'classic-coffee',
  image: 'https://drive.google.com/uc?export=view&id=1ABC123xyz456', // Link Google Drive
  isPopular: true,
}
```

## Catatan Penting:

1. **Permission**: Pastikan file di Google Drive memiliki permission "Anyone with the link can view"
2. **Format Link**: Gunakan format `https://drive.google.com/uc?export=view&id=FILE_ID`
3. **Ukuran File**: Gambar besar mungkin perlu waktu loading lebih lama
4. **Caching**: Google Drive mungkin cache gambar, perubahan mungkin tidak langsung terlihat

## Troubleshooting:

Jika gambar tidak muncul:
1. Pastikan permission file sudah diubah ke "Anyone with the link"
2. Pastikan format link sudah benar
3. Cek console browser untuk error
4. Coba buka link langsung di browser untuk memastikan gambar bisa diakses

