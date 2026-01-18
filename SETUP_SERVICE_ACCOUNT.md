# Setup Google Service Account untuk Write ke Google Sheets

## ⚠️ Catatan Penting:
**API Key TIDAK bisa digunakan untuk write operations.** Hanya bisa untuk read public sheets.

Untuk write operations, Anda perlu menggunakan **Service Account**.

## Alternatif Lebih Mudah:
Sebelum setup Service Account, pertimbangkan menggunakan **Google Apps Script** (sudah disediakan di `GOOGLE_APPS_SCRIPT.md`) karena lebih mudah dan tidak perlu setup kompleks.

---

## Cara Setup Service Account (Jika Tetap Ingin Menggunakan API Langsung):

### 1. Buat Service Account di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang sudah ada
3. Aktifkan **Google Sheets API**:
   - Pergi ke **APIs & Services** → **Library**
   - Cari "Google Sheets API"
   - Klik **Enable**

4. Buat Service Account:
   - Pergi ke **APIs & Services** → **Credentials**
   - Klik **Create Credentials** → **Service Account**
   - Isi nama (contoh: "kasiko-reservasi")
   - Klik **Create and Continue**
   - Skip role assignment (atau pilih "Editor" jika perlu)
   - Klik **Done**

5. Buat Key untuk Service Account:
   - Klik service account yang baru dibuat
   - Pergi ke tab **Keys**
   - Klik **Add Key** → **Create new key**
   - Pilih format **JSON**
   - Klik **Create**
   - File JSON akan terdownload (simpan dengan aman!)

### 2. Share Spreadsheet dengan Service Account

1. Buka file JSON yang terdownload
2. Cari field `client_email` (contoh: `kasiko-reservasi@project-id.iam.gserviceaccount.com`)
3. Buka Google Sheets spreadsheet reservasi Anda
4. Klik tombol **Share** (di kanan atas)
5. Paste email service account (`client_email`) ke field share
6. Berikan permission **Editor**
7. Klik **Send** (atau cukup klik di luar dialog, tidak perlu benar-benar send)

### 3. Setup di Project Next.js

1. Copy file JSON ke folder project (bisa di root atau folder `config/`)
   - **⚠️ PENTING**: Jangan commit file ini ke Git! Tambahkan ke `.gitignore`

2. Update `.gitignore`:
   ```
   # Google Service Account credentials
   *.json
   !package.json
   !package-lock.json
   !tsconfig.json
   !next.config.json
   service-account-key.json
   config/service-account-key.json
   ```

3. Install package yang diperlukan:
   ```bash
   npm install googleapis
   ```

4. Update environment variable di `.env.local`:
   ```
   GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service-account-key.json
   # atau path lengkap ke file JSON Anda
   ```

5. Update API route untuk menggunakan Service Account (akan saya buatkan kodenya)

---

## Keuntungan Service Account:
- ✅ Langsung menggunakan Google Sheets API
- ✅ Tidak perlu deploy Google Apps Script
- ✅ Lebih kontrol penuh

## Kekurangan Service Account:
- ❌ Setup lebih kompleks
- ❌ Perlu manage credentials file dengan aman
- ❌ Perlu share setiap spreadsheet dengan service account email

---

## Rekomendasi:
**Gunakan Google Apps Script** (solusi di `GOOGLE_APPS_SCRIPT.md`) karena:
- ✅ Setup lebih mudah (5 menit)
- ✅ Tidak perlu credentials file
- ✅ Tidak perlu share spreadsheet dengan service account
- ✅ Lebih aman (tidak perlu store credentials)

Jika Anda tetap ingin menggunakan Service Account, saya bisa buatkan kode untuk API route-nya.

