// firebase-config.js - Konfigurasi Firebase Web App CMMS
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";

// Konfigurasi Firebase Project Anda
export const firebaseConfig = {
  apiKey: "AIzaSyBJCnZQZcQLnr70npzWEX4gCWMzuz6g5Gc",
  authDomain: "cmmscsbcansport.firebaseapp.com",
  projectId: "cmmscsbcansport",
  storageBucket: "cmmscsbcansport.firebasestorage.app",
  messagingSenderId: "278435860047",
  appId: "1:278435860047:web:ba8cbde0175a2b1c44643a",
  measurementId: "G-WCYBLY72N0"
};

// Inisialisasi Firebase & Analytics
export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Simpan ke window agar bisa diakses global jika diperlukan
if (typeof window !== 'undefined') {
  window.firebaseApp = app;
  window.firebaseConfig = firebaseConfig;
}
