# Setup Google Apps Script untuk Reservasi

## Cara Setup:

1. Buka Google Sheets Anda (spreadsheet reservasi)

2. Klik **Extensions** → **Apps Script**

3. Hapus kode default dan paste kode berikut:

```javascript
function doPost(e) {
  try {
    // Parse data dari POST request
    const data = JSON.parse(e.postData.contents);
    
    // Buka spreadsheet - menggunakan getActiveSpreadsheet() karena script ini 
    // di-attach ke spreadsheet yang sama
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Pilih sheet - default gunakan sheet pertama
    // Jika Anda ingin menggunakan sheet spesifik, ganti 'Sheet1' dengan nama sheet Anda
    const sheetName = 'Sheet1'; // Ganti jika nama sheet berbeda
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    // Jika sheet dengan nama tersebut tidak ditemukan, gunakan sheet pertama
    if (!sheet) {
      sheet = spreadsheet.getSheets()[0];
      Logger.log('Sheet "' + sheetName + '" tidak ditemukan, menggunakan sheet pertama: ' + sheet.getName());
    }
    
    // Urutan data sesuai dengan header kolom:
    // Timestamp | Nama | Jumlah Orang | Tempat | Tanggal | Jam | Menu yang dipesan | Total Harga | ID WA | NO WA | Pembayaran | Catatan
    const rowData = [
      new Date(), // Timestamp
      data.nama || '', // Nama
      data.jumlahOrang || '', // Jumlah Orang
      data.tempat || '', // Tempat
      data.tanggal || '', // Tanggal
      data.jam || '', // Jam
      data.menu || '', // Menu yang dipesan
      data.totalHarga || '', // Total Harga
      data.idWa || '', // ID WA
      data.noWa || '', // NO WA
      'belum bayar', // Pembayaran (default)
      data.catatan || '' // Catatan
    ];
    
    // Append row ke sheet
    sheet.appendRow(rowData);
    
    // Log untuk debugging (cek di Executions di Apps Script)
    Logger.log('Data berhasil ditambahkan ke sheet: ' + sheet.getName());
    Logger.log('Row data: ' + JSON.stringify(rowData));
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Data berhasil ditambahkan ke sheet: ' + sheet.getName()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error untuk debugging
    Logger.log('Error: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString(),
        stack: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fungsi untuk test manual (opsional - untuk test di Apps Script editor)
function testDoPost() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        nama: "Test User",
        jumlahOrang: "2",
        tempat: "Indoor",
        tanggal: "2026-01-23",
        jam: "14:00",
        menu: "Test Menu",
        totalHarga: "50000",
        idWa: "6281234567890@c.us",
        noWa: "081234567890",
        catatan: "Test catatan"
      })
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log('Test result: ' + result.getContent());
}
```

4. Simpan script (Ctrl+S atau Cmd+S)

5. Deploy script sebagai Web App:
   - Klik **Deploy** → **New deployment**
   - Pilih **Web app** sebagai type
   - **⚠️ PENTING**: Set **Execute as**: **Me** (bukan "User accessing the web app")
     - Ini memungkinkan script write ke sheet yang di-restrict/private
     - Script akan dijalankan sebagai **pemilik script** (Anda), bukan sebagai user yang akses web app
   - Set **Who has access**: Anyone (atau Anyone with Google account)
   - Klik **Deploy**
   - **Copy Web App URL** yang muncul (contoh: `https://script.google.com/macros/s/.../exec`)

6. Update environment variable:
   - Tambahkan di `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

## Catatan:
- Script ini menulis ke sheet aktif (active sheet)
- Pastikan kolom sesuai urutan: timestamp, nama, jumlah orang, tempat, tanggal, jam, menu, total harga, id wa, no wa, pembayaran, catatan

## 🔒 Sheet Restricted/Private - Apakah Bisa?

**✅ BISA!** Asalkan:

1. **Apps Script di-deploy dengan "Execute as: Me"** (sudah dijelaskan di step 5)
   - Script akan dijalankan sebagai **pemilik script** (Anda)
   - Jadi meskipun sheet di-restrict ke user tertentu atau fully private, script tetap bisa write

2. **Script harus punya akses ke sheet:**
   - Jika script dibuat di dalam spreadsheet (Extensions → Apps Script), otomatis punya akses
   - Jika script standalone, pastikan sheet di-share ke email yang punya script dengan permission **Editor**

3. **Sheet bisa di-restrict tanpa masalah:**
   - ✅ Sheet bisa di-set ke "Restricted" (hanya user tertentu yang bisa akses)
   - ✅ Sheet bisa fully private (hanya owner)
   - ✅ Web app URL tetap bisa diakses publik untuk POST request
   - ✅ Data tetap bisa di-write ke sheet via Apps Script

**Catatan Keamanan:**
- Web App URL bisa diakses siapa saja (jika set "Anyone")
- Tapi mereka **hanya bisa POST data** ke script, tidak bisa akses sheet langsung
- Untuk keamanan ekstra, bisa set "Who has access" ke "Anyone with Google account" atau buat autentikasi di Apps Script

