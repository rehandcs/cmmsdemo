# CMMS Demo - PT. Can Sports Industrial Indonesia 🏭⚙️

Aplikasi demo **Computerized Maintenance Management System (CMMS)** mandiri tanpa dependensi database eksternal. Seluruh endpoint REST API dan penyimpanan status data berjalan secara *In-Memory* di `server.js` serta didukung penyimpanan sesi lokal (`localStorage`), sehingga siap untuk presentasi demo dan langsung bisa di-deploy ke Firebase.

---

## 🚀 Fitur Utama & Pembaruan

1. **Halaman Login Interaktif ([Login.html](file:///Login.html))**:
   - Tampilan enterprise bertema industri modern dengan glassmorphism & dynamic gradients.
   - Fitur **1-Click Demo Account Picker**:
     - **Admin Developer** (Super Admin - Akses penuh Master Database & Cost Analysis)
     - **Admin Asset** (Akses Manajemen Mesin, Placement & Tracking)
     - **Admin Sparepart** (Akses Gudang, Pickup, & Staging)
     - **Lead Mekanik** (Akses Work Order, Tiket & Riwayat)
   - Otomatis menyimpan profil user (`userData`) dan status login (`isLoggedIn`) ke `localStorage`.

2. **Sidebar Komprehensif & Responsif ([sidebar.html](file:///sidebar.html) & [sidebar.js](file:///sidebar.js))**:
   - Sidebar terpadu yang memuat seluruh menu navigasi:
     - **Home** (`Index.html`)
     - **Schedule** (`Schedule.html`)
     - **Work Order**: Live Dashboard (`WorkOrder.html`), Ticket Order (`TicketWO.html`), WO History (`WorkOrderHistory.html`)
     - **Maintenance**: Preventive (`Preventive.html`), Corrective (`Corrective.html`)
     - **Supply and Placement**: Pick Up Sparepart (`Pickup.html`), Sparepart Arrival (`SparepartArrival.html`), Asset Placement (`AssetPlacement.html`)
     - **Inventory**: Sparepart Management (`UsageLog.html`), Asset Management (`AssetManagement.html`), Master Database (`DatabaseMaster.html`)
     - **Mechanic** (`mechanic.html`)
     - **Reports Analysis**: Asset History (`TrackingAssets.html`), MTTR & MTBF (`mttrmtbdanalysis.html`), Spareparts Usage (`TrackingSpareparts.html`), Cost Analysis (`costanalysis.html`), Mechanic Analysis (`mechanicperformance.html`)
     - **AI Assistant** (`Ai.html`)
     - **WA Notification** (`notifikasi.html`)
     - **User Settings** (`UserSettings.html`)
     - **Logout** (Membersihkan sesi login dan mengarahkan ke `Login.html`)
   - Toggle responsif untuk layar Desktop (collapsible ke icon 5rem) dan Mobile (off-canvas drawer dengan backdrop overlay).

3. **In-Memory Mock Backend ([server.js](file:///server.js))**:
   - Menyajikan file statis sekaligus 18+ endpoint REST API lengkap (CRUD Assets, Spareparts, Work Orders, Users, Pickup Logs, Staging, Submission Forms, Analytics MTTR/MTBF, WhatsApp Notifications, dan AI Chat RAG).
   - Data tanggal diset secara dinamis berdasarkan tanggal hari ini (`todayStr`), sehingga **Live Dashboard** dan **Calendar Schedule** selalu menampilkan data aktif saat diuji kapan pun.
   - Dual-engine: Menggunakan Express.js (jika terinstal) atau otomatis fallback ke built-in Node.js HTTP server.

---

## 💻 Cara Menjalankan Secara Lokal

1. **Jalankan Server**:
   ```bash
   node server.js
   # atau
   npm start
   ```

2. **Buka di Browser**:
   - **Login Page (LAN)**: [http://10.18.1.25:3001/Login.html](http://10.18.1.25:3001/Login.html)
   - **Login Page (Lokal)**: [http://localhost:3001/Login.html](http://localhost:3001/Login.html)
   - **Home Dashboard**: [http://localhost:3001/Index.html](http://localhost:3001/Index.html)

---

## ☁️ Panduan Deploy ke Firebase

### Metode 1: Firebase Hosting (Paling Cepat & Gratis)

Aplikasi ini sudah dirancang agar dapat berjalan langsung di Firebase Hosting (CDN global):

1. **Pastikan Firebase CLI sudah terpasang**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login ke Akun Firebase**:
   ```bash
   firebase login
   ```

3. **Inisialisasi Project (jika belum)**:
   ```bash
   firebase use --add
   ```
   *(Pilih project Firebase yang sudah Anda buat di Firebase Console)*

4. **Deploy**:
   ```bash
   firebase deploy --only hosting
   ```
   *File `firebase.json` sudah dikonfigurasi untuk menyajikan seluruh file HTML, CSS, JS, dan aset.*

---

### Metode 2: Firebase Cloud Functions + Hosting (Fullstack Node.js)

Jika Anda ingin `server.js` berjalan di backend serverless Firebase:
1. Jalankan `firebase init functions` (pilih JavaScript/TypeScript).
2. Pindahkan atau import `server.js` di dalam folder `functions/index.js`:
   ```javascript
   const functions = require('firebase-functions');
   const app = require('./server'); // export expressApp dari server.js
   exports.api = functions.https.onRequest(app);
   ```
3. Tambahkan rewrite di `firebase.json`:
   ```json
   "rewrites": [
     {
       "source": "/api/**",
       "function": "api"
     }
   ]
   ```
4. Deploy dengan perintah:
   ```bash
   firebase deploy
   ```
