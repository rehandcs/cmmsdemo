/**
 * server.js - CMMS PT. Can Sports Industrial Indonesia
 * Demo Server (Tanpa Database Luar / In-Memory Mock Data)
 * Siap dijalankan lokal (Node.js/Express) atau dideploy ke Firebase / Cloud Run / Vercel.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Cek apakah Express terpasang, jika tidak gunakan built-in HTTP server agar 100% runnable tanpa instalasi manual
let expressModule = null;
let expressApp = null;
let useExpress = false;

try {
  const express = require('express');
  const cors = require('cors');
  const app = express();
  
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  
  expressModule = express;
  expressApp = app;
  useExpress = true;
} catch (e) {
  useExpress = false;
  console.log('[Notice] Modul Express belum terinstal, menggunakan built-in Node.js HTTP engine.');
}

// -------------------------------------------------------------
// HELPER TANGGAL DINAMIS (Agar Live Dashboard & Calendar selalu aktif)
// -------------------------------------------------------------
const now = new Date();
const todayStr = now.toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const twoDaysAgoStr = new Date(Date.now() - 172800000).toISOString().split('T')[0];

// -------------------------------------------------------------
// IN-MEMORY MOCK DATABASE (DEMO DATA LENGKAP)
// -------------------------------------------------------------
const db = {
  assets: [
    {
      id: 1,
      nomor_asset: "AST-CUT-001",
      machine_id: "MC-CUT-01",
      machine_name: "Automatic Fabric Cutting Machine",
      brand: "Gerber Technology",
      machine_type: "GTxL Conveyor",
      area: "Area A - Cutting",
      location: "Building 1 Floor 1",
      department: "Production",
      purchase_date: "2021-03-15",
      status: "OPERATIONAL"
    },
    {
      id: 2,
      nomor_asset: "AST-SEW-014",
      machine_id: "MC-SEW-14",
      machine_name: "High-Speed Lockstitch Sewing Machine",
      brand: "Juki",
      machine_type: "DDL-9000C",
      area: "Area B - Sewing Line 3",
      location: "Building 2 Floor 2",
      department: "Production",
      purchase_date: "2022-01-20",
      status: "OPERATIONAL"
    },
    {
      id: 3,
      nomor_asset: "AST-EMB-003",
      machine_id: "MC-EMB-03",
      machine_name: "Multi-Head Computerized Embroidery",
      brand: "Barudan",
      machine_type: "BEXY-Z1506C",
      area: "Area C - Embroidery",
      location: "Building 1 Floor 2",
      department: "Finishing",
      purchase_date: "2020-07-10",
      status: "OPERATIONAL"
    },
    {
      id: 4,
      nomor_asset: "AST-PRS-008",
      machine_id: "MC-PRS-08",
      machine_name: "Pneumatic Heat Press Transfer",
      brand: "Stahls",
      machine_type: "Hotronix Air Fusion",
      area: "Area D - Printing",
      location: "Building 2 Floor 1",
      department: "Finishing",
      purchase_date: "2023-05-12",
      status: "UNDER_MAINTENANCE"
    },
    {
      id: 5,
      nomor_asset: "AST-CMP-002",
      machine_id: "MC-CMP-02",
      machine_name: "Rotary Screw Air Compressor",
      brand: "Atlas Copco",
      machine_type: "GA 37 VSD+",
      area: "Area Utility - Powerhouse",
      location: "Building Utility",
      department: "Utility",
      purchase_date: "2019-11-05",
      status: "OPERATIONAL"
    },
    {
      id: 6,
      nomor_asset: "AST-BLR-001",
      machine_id: "MC-BLR-01",
      machine_name: "Industrial Steam Boiler 2-Ton",
      brand: "Miura",
      machine_type: "EX-2000SGI",
      area: "Area Utility - Boiler Room",
      location: "Building Utility",
      department: "Utility",
      purchase_date: "2018-09-01",
      status: "OPERATIONAL"
    }
  ],

  spareparts: [
    {
      id: 1,
      id_part: "SP-BRG-6204",
      supplier_name: "PT. Bearing Indonesia",
      material_name: "Deep Groove Ball Bearing 6204-ZZ",
      name: "Ball Bearing 6204-ZZ",
      item_short_text: "Bearing High Temp SKF 6204",
      spec: "ID 20mm, OD 47mm, W 14mm",
      stock: 45,
      purchase_unit: "PCS",
      unit: "PCS",
      min_stock: 15,
      storage: "Rack A-01",
      price_per_unit: "85000"
    },
    {
      id: 2,
      id_part: "SP-BLT-380T",
      supplier_name: "PT. V-Belt Makmur",
      material_name: "Industrial Timing Belt 380-5M",
      name: "Timing Belt 380-5M",
      item_short_text: "Rubber Timing Belt Pitch 5mm",
      spec: "Length 380mm, Width 15mm, 76 Teeth",
      stock: 12,
      purchase_unit: "PCS",
      unit: "PCS",
      min_stock: 10,
      storage: "Rack A-03",
      price_per_unit: "125000"
    },
    {
      id: 3,
      id_part: "SP-NDL-DBX1",
      supplier_name: "Organ Needle Co.",
      material_name: "Sewing Machine Needle DBx1 #14",
      name: "Needle DBx1 #14",
      item_short_text: "Lockstitch Standard Needles",
      spec: "Size 90/14 Chromium Finish",
      stock: 250,
      purchase_unit: "BOX",
      unit: "BOX",
      min_stock: 50,
      storage: "Cabinet B-02",
      price_per_unit: "65000"
    },
    {
      id: 4,
      id_part: "SP-SOL-24V",
      supplier_name: "SMC Pneumatics Indonesia",
      material_name: "5/2 Way Solenoid Valve DC 24V",
      name: "Solenoid Valve 24V",
      item_short_text: "Pneumatic Control Valve",
      spec: "SY5120-5LZD-01 Port 1/8",
      stock: 8,
      purchase_unit: "PCS",
      unit: "PCS",
      min_stock: 5,
      storage: "Rack C-05",
      price_per_unit: "450000"
    },
    {
      id: 5,
      id_part: "SP-OIL-ISO68",
      supplier_name: "Pertamina Lubricants",
      material_name: "Hydraulic Oil Turalik 68 ISO VG",
      name: "Hydraulic Oil ISO 68",
      item_short_text: "Anti-wear Hydraulic Fluid",
      spec: "Drum 20 Liters ISO VG 68",
      stock: 18,
      purchase_unit: "CAN",
      unit: "CAN",
      min_stock: 5,
      storage: "Area Oli Gudang",
      price_per_unit: "780000"
    }
  ],

  workorders: [
    {
      id: 1,
      wo_id: "WO-2026-001",
      type: "CORRECTIVE",
      status: "IN PROGRESS",
      priority: "Critical",
      asset_id: "MC-CUT-01",
      machine_name: "Automatic Fabric Cutting Machine",
      location: "Building 1 Floor 1",
      department: "Production",
      target_date: todayStr,
      request_time: `${todayStr}T08:30:00`,
      problem_description: "Blade sensor error E-402, conveyor belt macet saat memotong bahan elastis.",
      pic_name: "Agus Pratama",
      elapsed_time: 1450000,
      is_paused: false,
      created_at: `${todayStr}T08:30:00`
    },
    {
      id: 2,
      wo_id: "WO-2026-002",
      type: "PREVENTIVE",
      status: "OPEN",
      priority: "High",
      asset_id: "MC-SEW-14",
      machine_name: "High-Speed Lockstitch Sewing Machine",
      location: "Building 2 Floor 2",
      department: "Production",
      target_date: todayStr,
      request_time: `${todayStr}T09:15:00`,
      problem_description: "Jadwal Pelumasan Mingguan & Kalibrasi Ketegangan Benang Hook Assembly.",
      pic_name: "Budi Santoso",
      elapsed_time: 0,
      is_paused: false,
      created_at: `${todayStr}T09:15:00`
    },
    {
      id: 3,
      wo_id: "WO-2026-003",
      type: "CORRECTIVE",
      status: "COMPLETED",
      priority: "Medium",
      asset_id: "MC-PRS-08",
      machine_name: "Pneumatic Heat Press Transfer",
      location: "Building 2 Floor 1",
      department: "Finishing",
      target_date: yesterdayStr,
      request_time: `${yesterdayStr}T11:00:00`,
      problem_description: "Penggantian Solenoid Valve silinder atas karena tekanan angin bocor.",
      pic_name: "Agus Pratama",
      elapsed_time: 3600000,
      is_paused: false,
      created_at: `${yesterdayStr}T11:00:00`
    },
    {
      id: 4,
      wo_id: "WO-2026-004",
      type: "PREVENTIVE",
      status: "OPEN",
      priority: "Medium",
      asset_id: "MC-CMP-02",
      machine_name: "Rotary Screw Air Compressor",
      location: "Building Utility",
      department: "Utility",
      target_date: tomorrowStr,
      request_time: `${tomorrowStr}T08:00:00`,
      problem_description: "Inspeksi filter oli & pembersihan kondensor pendingin kompresor sentral.",
      pic_name: "Tim Utility",
      elapsed_time: 0,
      is_paused: false,
      created_at: `${todayStr}T07:00:00`
    },
    {
      id: 5,
      wo_id: "WO-2026-005",
      type: "CORRECTIVE",
      status: "CLOSED",
      priority: "Low",
      asset_id: "MC-EMB-03",
      machine_name: "Multi-Head Computerized Embroidery",
      location: "Building 1 Floor 2",
      department: "Finishing",
      target_date: twoDaysAgoStr,
      request_time: `${twoDaysAgoStr}T14:20:00`,
      problem_description: "Penggantian jarum putus head 4 dan pembersihan sisa benang di rotary hook.",
      pic_name: "Budi Santoso",
      elapsed_time: 1800000,
      is_paused: false,
      created_at: `${twoDaysAgoStr}T14:20:00`
    }
  ],

  users: [
    {
      id: 1,
      userId: "DEV-001",
      nik: "NIK-202601",
      name: "Rehand Naifi Surya",
      email: "rehand@cansports.co.id",
      role: "Admin Developer",
      password: "password123",
      department: "Engineering & IT",
      specialization: "Fullstack Systems & IoT CMMS",
      skills: "System Architecture, Automation, Database",
      phone: "0812-3456-7890",
      tanggal_join: "2021-01-01",
      profile_picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
    },
    {
      id: 2,
      userId: "AST-002",
      nik: "NIK-202602",
      name: "Budi Santoso",
      email: "budi.santoso@cansports.co.id",
      role: "Admin Asset",
      password: "password123",
      department: "Maintenance Production",
      specialization: "Asset Maintenance & Reliability",
      skills: "Predictive Maintenance, Vibration Analysis",
      phone: "0812-9876-5432",
      tanggal_join: "2022-03-15",
      profile_picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
    },
    {
      id: 3,
      userId: "SPR-003",
      nik: "NIK-202603",
      name: "Siti Rahmawati",
      email: "siti.rahma@cansports.co.id",
      role: "Admin Sparepart",
      password: "password123",
      department: "Warehouse & Inventory",
      specialization: "Inventory Management & Supply Chain",
      skills: "ERP, SAP MM, 5S Warehouse",
      phone: "0813-1122-3344",
      tanggal_join: "2022-08-01",
      profile_picture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80"
    },
    {
      id: 4,
      userId: "MEC-004",
      nik: "NIK-202604",
      name: "Agus Pratama",
      email: "agus.pratama@cansports.co.id",
      role: "Mekanik",
      password: "password123",
      department: "Workshop Team A",
      specialization: "Electromechanical & Pneumatics",
      skills: "Troubleshooting, PLC, Motor Rewinding",
      phone: "0815-5566-7788",
      tanggal_join: "2023-02-10",
      profile_picture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"
    }
  ],

  pickup: [
    {
      id: 1,
      id_part: "SP-BRG-6204",
      material_name: "Deep Groove Ball Bearing 6204-ZZ",
      quantity: 2,
      action_type: "PICKUP",
      user_name: "Agus Pratama",
      wo_id: "WO-2026-001",
      machine_id: "MC-CUT-01",
      timestamp: `${todayStr} 09:10:00`,
      created_at: `${todayStr} 09:10:00`
    },
    {
      id: 2,
      id_part: "SP-SOL-24V",
      material_name: "5/2 Way Solenoid Valve DC 24V",
      quantity: 1,
      action_type: "PICKUP",
      user_name: "Budi Santoso",
      wo_id: "WO-2026-003",
      machine_id: "MC-PRS-08",
      timestamp: `${yesterdayStr} 11:30:00`,
      created_at: `${yesterdayStr} 11:30:00`
    }
  ],

  staging: [
    {
      id: 1,
      id_part: "SP-OIL-ISO68",
      material_name: "Hydraulic Oil Turalik 68 ISO VG",
      supplier_name: "Pertamina Lubricants",
      quantity: 10,
      purchase_unit: "CAN",
      price_per_unit: "780000",
      date_arrived: todayStr,
      received_by: "Siti Rahmawati",
      status: "STAGING"
    }
  ],

  notifications: [
    {
      id: 1,
      report_type: "sparepart",
      report_month: "October 2026",
      schedule_day: "Setiap Senin",
      schedule_time: "08:00",
      target_numbers: "081234567890, 081298765432",
      is_active: 1
    },
    {
      id: 2,
      report_type: "workorder",
      report_month: "October 2026",
      schedule_day: "Setiap Hari Kerja",
      schedule_time: "17:00",
      target_numbers: "081234567890",
      is_active: 1
    }
  ],

  completionsCorrective: [],
  completionsPreventive: []
};

// -------------------------------------------------------------
// CONTROLLERS & LOGIKA BISNIS REST API
// -------------------------------------------------------------
function handleApiRoute(method, pathname, query, body, res) {
  // Set JSON headers
  const sendJson = (statusCode, data) => {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(data));
  };

  // 1. ASSETS
  if (pathname === '/api/assets') {
    if (method === 'GET') {
      return sendJson(200, db.assets);
    }
    if (method === 'POST') {
      const item = body || {};
      const newId = (db.assets.length > 0 ? Math.max(...db.assets.map(a => a.id || 0)) : 0) + 1;
      const newAsset = { id: newId, ...item };
      db.assets.push(newAsset);
      return sendJson(201, { message: 'Asset berhasil disimpan', asset: newAsset });
    }
  }

  if (pathname.startsWith('/api/assets/')) {
    const idParam = pathname.split('/')[3];
    if (method === 'DELETE') {
      db.assets = db.assets.filter(a => String(a.id) !== idParam && String(a.machine_id) !== idParam);
      return sendJson(200, { message: 'Asset berhasil dihapus' });
    }
    if (method === 'PUT') {
      const idx = db.assets.findIndex(a => String(a.id) === idParam || String(a.machine_id) === idParam);
      if (idx !== -1) {
        db.assets[idx] = { ...db.assets[idx], ...(body || {}) };
        return sendJson(200, { message: 'Asset berhasil diperbarui', asset: db.assets[idx] });
      }
      return sendJson(404, { error: 'Asset tidak ditemukan' });
    }
  }

  // 2. SPAREPARTS
  if (pathname === '/api/spareparts') {
    if (method === 'GET') {
      return sendJson(200, db.spareparts);
    }
    if (method === 'POST') {
      const item = body || {};
      const newId = (db.spareparts.length > 0 ? Math.max(...db.spareparts.map(s => s.id || 0)) : 0) + 1;
      const newPart = { id: newId, ...item };
      db.spareparts.push(newPart);
      return sendJson(201, { message: 'Sparepart berhasil disimpan', sparepart: newPart });
    }
  }

  if (pathname.startsWith('/api/spareparts/')) {
    const idParam = pathname.split('/')[3];
    if (method === 'DELETE') {
      db.spareparts = db.spareparts.filter(s => String(s.id) !== idParam && String(s.id_part) !== idParam);
      return sendJson(200, { message: 'Sparepart berhasil dihapus' });
    }
    if (method === 'PUT') {
      const idx = db.spareparts.findIndex(s => String(s.id) === idParam || String(s.id_part) === idParam);
      if (idx !== -1) {
        db.spareparts[idx] = { ...db.spareparts[idx], ...(body || {}) };
        return sendJson(200, { message: 'Sparepart berhasil diperbarui', sparepart: db.spareparts[idx] });
      }
      return sendJson(404, { error: 'Sparepart tidak ditemukan' });
    }
  }

  // 3. WORKORDERS
  if (pathname === '/api/workorders') {
    if (method === 'GET') {
      return sendJson(200, db.workorders);
    }
    if (method === 'POST') {
      const item = body || {};
      const newId = (db.workorders.length > 0 ? Math.max(...db.workorders.map(w => w.id || 0)) : 0) + 1;
      const newWo = {
        id: newId,
        wo_id: item.wo_id || `WO-2026-${String(newId).padStart(3, '0')}`,
        status: item.status || 'OPEN',
        priority: item.priority || 'Medium',
        created_at: new Date().toISOString(),
        ...item
      };
      db.workorders.unshift(newWo);
      return sendJson(201, { message: 'Work Order berhasil dibuat', workorder: newWo });
    }
  }

  if (pathname === '/api/workorders/action' && method === 'POST') {
    const { id, wo_id, action, elapsed_time } = body || {};
    const wo = db.workorders.find(w => String(w.id) === String(id) || w.wo_id === wo_id);
    if (wo) {
      if (elapsed_time !== undefined) wo.elapsed_time = elapsed_time;
      if (action === 'START' || action === 'RESUME') {
        wo.status = 'IN PROGRESS';
        wo.is_paused = false;
      } else if (action === 'PAUSE') {
        wo.is_paused = true;
      } else if (action === 'FINISH' || action === 'COMPLETE') {
        wo.status = 'COMPLETED';
        wo.is_paused = false;
      }
      return sendJson(200, { message: `Status WO ${wo.wo_id} diperbarui: ${action}`, workorder: wo });
    }
    return sendJson(404, { error: 'Work Order tidak ditemukan' });
  }

  if (pathname.startsWith('/api/workorders/')) {
    const idParam = pathname.split('/')[3];
    if (method === 'DELETE') {
      db.workorders = db.workorders.filter(w => String(w.id) !== idParam && String(w.wo_id) !== idParam);
      return sendJson(200, { message: 'Work Order berhasil dihapus' });
    }
  }

  // 4. USERS & AUTH
  if (pathname === '/api/users') {
    if (method === 'GET') {
      return sendJson(200, db.users);
    }
    if (method === 'POST') {
      const item = body || {};
      const newId = (db.users.length > 0 ? Math.max(...db.users.map(u => u.id || 0)) : 0) + 1;
      const newUser = { id: newId, ...item };
      db.users.push(newUser);
      return sendJson(201, { message: 'User berhasil disimpan', user: newUser });
    }
  }

  if (pathname.startsWith('/api/users/')) {
    const idParam = pathname.split('/')[3];
    if (method === 'DELETE') {
      db.users = db.users.filter(u => String(u.id) !== idParam && String(u.userId) !== idParam);
      return sendJson(200, { message: 'User berhasil dihapus' });
    }
  }

  if ((pathname === '/api/login' || pathname === '/api/auth/login') && method === 'POST') {
    const { email, username, password } = body || {};
    const user = db.users.find(u => 
      (email && u.email.toLowerCase() === email.toLowerCase()) || 
      (username && (u.userId === username || u.email === username))
    ) || db.users[0]; // Fallback ke akun default jika demo

    return sendJson(200, {
      message: 'Login berhasil',
      token: 'jwt-demo-token-' + Date.now(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        profile_picture: user.profile_picture
      }
    });
  }

  // 5. PICKUP & SPAREPART LOGS
  if (pathname === '/api/pickup' || pathname === '/api/sparepart-logs') {
    if (method === 'GET') {
      return sendJson(200, db.pickup);
    }
    if (method === 'POST') {
      const p = body || {};
      const newId = db.pickup.length + 1;
      const newLog = {
        id: newId,
        id_part: p.id_part,
        material_name: p.material_name || p.name,
        quantity: parseInt(p.quantity || 1, 10),
        action_type: p.action_type || 'PICKUP',
        user_name: p.user_name || 'Admin Demo',
        wo_id: p.wo_id || '-',
        machine_id: p.machine_id || '-',
        timestamp: new Date().toLocaleString('sv').replace(' ', 'T'),
        created_at: new Date().toISOString()
      };

      // Potong / Tambah stok suku cadang di memori
      const part = db.spareparts.find(s => s.id_part === p.id_part || s.id === p.id);
      if (part) {
        if (newLog.action_type === 'PICKUP') {
          part.stock = Math.max(0, part.stock - newLog.quantity);
        } else if (newLog.action_type === 'RETURN') {
          part.stock = part.stock + newLog.quantity;
        }
      }

      db.pickup.unshift(newLog);
      return sendJson(201, { message: 'Log pickup berhasil dicatat', log: newLog, currentStock: part ? part.stock : null });
    }
  }

  // 6. STAGING (Sparepart Arrival)
  if (pathname === '/api/staging') {
    if (method === 'GET') {
      return sendJson(200, db.staging);
    }
    if (method === 'POST') {
      const item = body || {};
      const newId = db.staging.length + 1;
      const newItem = { id: newId, ...item };
      db.staging.push(newItem);
      return sendJson(201, { message: 'Item berhasil masuk staging', item: newItem });
    }
  }

  if (pathname.startsWith('/api/staging/')) {
    const idParam = pathname.split('/')[3];
    if (method === 'DELETE') {
      db.staging = db.staging.filter(s => String(s.id) !== idParam);
      return sendJson(200, { message: 'Item staging dihapus' });
    }
  }

  // 7. SUBMISSION FORMS (Corrective / Preventive)
  if (pathname === '/api/corrective' && method === 'POST') {
    const p = body || {};
    const newWo = {
      id: db.workorders.length + 1,
      wo_id: `COR-${Date.now().toString().slice(-4)}`,
      type: 'CORRECTIVE',
      status: 'OPEN',
      priority: p.priority || 'High',
      asset_id: p.asset_id || p.machine_id || 'MC-GEN-01',
      machine_name: p.machine_name || 'Mesin Pabrik',
      location: p.location || 'Building 1',
      department: p.department || 'Production',
      target_date: todayStr,
      request_time: new Date().toISOString(),
      problem_description: p.problem_description || p.damage_description || 'Laporan Kerusakan Corrective',
      pic_name: p.user_name || p.reporter_name || 'Operator',
      elapsed_time: 0,
      is_paused: false,
      created_at: new Date().toISOString()
    };
    db.workorders.unshift(newWo);
    return sendJson(201, { message: 'Form Corrective berhasil dibuat', workorder: newWo });
  }

  if (pathname === '/api/preventive' && method === 'POST') {
    const p = body || {};
    const newWo = {
      id: db.workorders.length + 1,
      wo_id: `PRV-${Date.now().toString().slice(-4)}`,
      type: 'PREVENTIVE',
      status: 'OPEN',
      priority: p.priority || 'Medium',
      asset_id: p.asset_id || p.machine_id || 'MC-GEN-01',
      machine_name: p.machine_name || 'Mesin Pabrik',
      location: p.location || 'Building 1',
      department: p.department || 'Production',
      target_date: p.target_date || tomorrowStr,
      request_time: new Date().toISOString(),
      problem_description: p.notes || p.description || 'Pemeriksaan Rutin Preventive',
      pic_name: p.user_name || 'Teknisi Preventive',
      elapsed_time: 0,
      is_paused: false,
      created_at: new Date().toISOString()
    };
    db.workorders.unshift(newWo);
    return sendJson(201, { message: 'Form Preventive berhasil dijadwalkan', workorder: newWo });
  }

  if (pathname === '/api/completion/corrective') {
    if (method === 'GET') return sendJson(200, db.completionsCorrective);
    if (method === 'POST') {
      db.completionsCorrective.push(body);
      return sendJson(201, { message: 'Penyelesaian Corrective berhasil disimpan' });
    }
  }

  if (pathname === '/api/completion/preventive') {
    if (method === 'GET') return sendJson(200, db.completionsPreventive);
    if (method === 'POST') {
      db.completionsPreventive.push(body);
      return sendJson(201, { message: 'Penyelesaian Preventive berhasil disimpan' });
    }
  }

  // 8. NOTIFIKASI WHATSAPP
  if (pathname === '/api/wa-notifications') {
    if (method === 'GET') return sendJson(200, db.notifications);
    if (method === 'POST') {
      const p = body || {};
      const newNotif = {
        id: db.notifications.length + 1,
        report_type: p.reportType || p.report_type || 'workorder',
        report_month: p.reportMonth || p.report_month || 'Current Month',
        schedule_day: p.scheduleDay || p.schedule_day || 'Senin',
        schedule_time: p.scheduleTime || p.schedule_time || '08:00',
        target_numbers: p.targetNumbers || p.target_numbers || '-',
        is_active: 1
      };
      db.notifications.push(newNotif);
      return sendJson(201, { message: 'Jadwal notifikasi berhasil disimpan', notification: newNotif });
    }
  }

  if (pathname.startsWith('/api/wa-notifications/')) {
    const idParam = pathname.split('/')[3];
    if (method === 'DELETE') {
      db.notifications = db.notifications.filter(n => String(n.id) !== idParam);
      return sendJson(200, { message: 'Notifikasi berhasil dihapus' });
    }
  }

  // 9. ANALYTICS (MTTR / MTBF / LEADERBOARD)
  if (pathname === '/api/analytics/mechanic-leaderboard') {
    return sendJson(200, [
      { name: "Agus Pratama", total_wo: 28, completed_wo: 26, avg_time_minutes: 42, rating: 4.9 },
      { name: "Budi Santoso", total_wo: 22, completed_wo: 21, avg_time_minutes: 38, rating: 4.8 },
      { name: "Rehand Naifi Surya", total_wo: 15, completed_wo: 15, avg_time_minutes: 30, rating: 5.0 },
      { name: "Dani Ramadhan", total_wo: 18, completed_wo: 16, avg_time_minutes: 55, rating: 4.6 }
    ]);
  }

  if (pathname === '/api/analytics/mttr-mtbf') {
    return sendJson(200, {
      mttr: 1.45, // jam
      mtbf: 168.2, // jam
      availability: 98.7, // %
      monthly_trend: [
        { month: "May", mttr: 1.8, mtbf: 140 },
        { month: "Jun", mttr: 1.6, mtbf: 152 },
        { month: "Jul", mttr: 1.5, mtbf: 160 },
        { month: "Aug", mttr: 1.4, mtbf: 165 },
        { month: "Sep", mttr: 1.3, mtbf: 172 },
        { month: "Oct", mttr: 1.45, mtbf: 168 }
      ]
    });
  }

  // 10. AI ASSISTANT / RAG CHAT
  if (pathname === '/api/rag/chat' && method === 'POST') {
    const userMsg = (body && (body.message || body.prompt || body.question || '')).toLowerCase();
    let reply = `Halo! Saya adalah AI Maintenance Assistant PT. Can Sports Industrial Indonesia.\n\n`;
    
    if (userMsg.includes('bearing') || userMsg.includes('skf')) {
      reply += `Untuk penggantian bearing tipe **SKF 6204-ZZ**, gunakan pelumas berstandar ISO VG 68 dengan interval penggantian setiap 2.000 jam kerja. Pastikan clearance radial telah diperiksa sebelum perakitan housing.`;
    } else if (userMsg.includes('cutting') || userMsg.includes('e-402')) {
      reply += `Kode kesalahan **E-402 pada Mesin Potong Otomatis** menandakan adanya slip pada conveyor encoder atau sensor pisau kotor oleh debu kain. Langkah penanganan:\n1. Bersihkan sensor fotolistrik di dekat head pisau.\n2. Cek ketegangan belt penggerak 380-5M.\n3. Lakukan kalibrasi posisi home via menu Maintenance.`;
    } else if (userMsg.includes('sparepart') || userMsg.includes('stok')) {
      reply += `Berdasarkan database gudang terkini:\n- **Ball Bearing 6204-ZZ**: Tersedia 45 PCS (Aman)\n- **Timing Belt 380-5M**: Tersedia 12 PCS (Mendekati Minimum 10 PCS)\n- **Jarum DBx1 #14**: Tersedia 250 BOX (Aman)`;
    } else {
      reply += `Pertanyaan Anda: "${userMsg || 'Bantuan umum'}" telah dianalisis berdasarkan manual SOP pemeliharaan mesin Can Sports. Pastikan seluruh prosedur keselamatan kerja (LOTO) telah dipasang sebelum teknisi membuka panel elektrikal.`;
    }

    return sendJson(200, { reply, answer: reply, status: 'success' });
  }

  if (pathname === '/api/rag/upload' && method === 'POST') {
    return sendJson(200, { status: 'success', message: 'Dokumen SOP berhasil diunggah ke indeks AI Assistant.' });
  }

  if (pathname === '/api/rag/stats') {
    return sendJson(200, { total_docs: 14, total_chunks: 185, status: 'ready' });
  }

  if (pathname === '/api/rag/clear') {
    return sendJson(200, { status: 'success', message: 'Knowledge base berhasil di-reset.' });
  }

  // Endpoint tidak ditemukan
  return sendJson(404, { error: 'API endpoint not found', path: pathname });
}

// -------------------------------------------------------------
// KONFIGURASI EXPRESS JIKA TERSEDIA
// -------------------------------------------------------------
if (useExpress && expressApp && expressModule) {
  // Semua request /api dikelola oleh Express
  expressApp.all('/api/*', (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    handleApiRoute(req.method, parsedUrl.pathname, parsedUrl.query, req.body, res);
  });

  // Sajikan seluruh static file (.html, .js, .css, images)
  expressApp.use(expressModule.static(__dirname));

  // Default route: arahkan ke Index.html atau Login.html
  expressApp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Index.html'));
  });

  expressApp.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Login.html'));
  });
}

// -------------------------------------------------------------
// HTTP SERVER NATIVE NODE.JS (BUILT-IN FALLBACK & STANDALONE)
// -------------------------------------------------------------
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

function serveStaticFile(reqPath, res) {
  let safePath = reqPath;
  if (safePath === '/' || safePath === '') safePath = '/Index.html';

  const fullPath = path.join(__dirname, safePath);

  // Mencegah path traversal
  if (!fullPath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      return res.end(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2>404 - Halaman Tidak Ditemukan</h2>
          <p>File <code>${safePath}</code> tidak ada.</p>
          <a href="/Index.html" style="color: #f97316; font-weight: bold;">Kembali ke Home Dashboard &rarr;</a>
        </div>
      `);
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(fullPath);
    stream.pipe(res);
  });
}

const server = http.createServer((req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Tangani rute API
  if (pathname.startsWith('/api/')) {
    let rawBody = '';
    req.on('data', chunk => { rawBody += chunk; });
    req.on('end', () => {
      let body = {};
      if (rawBody) {
        try {
          body = JSON.parse(rawBody);
        } catch (e) {
          // Jika urlencoded
          try {
            const params = new URLSearchParams(rawBody);
            body = Object.fromEntries(params.entries());
          } catch(err2) {
            body = { raw: rawBody };
          }
        }
      }
      handleApiRoute(req.method, pathname, parsedUrl.query, body, res);
    });
    return;
  }

  // Tangani static file
  serveStaticFile(pathname, res);
});

// -------------------------------------------------------------
// MENJALANKAN SERVER (KHUSUS PORT 3001)
// -------------------------------------------------------------
const PORT = 3001;
const activeServer = useExpress && expressApp ? expressApp : server;

if (require.main === module) {
  const serverInstance = activeServer.listen(PORT, '0.0.0.0', () => {
    console.log('========================================================');
    console.log(`🚀 CMMS PT. Can Sports Industrial Indonesia Demo Server`);
    console.log(`📡 Akses Lokal:          http://localhost:3001`);
    console.log(`🌐 Akses Jaringan (LAN): http://10.18.1.25:3001`);
    console.log(`🔐 Halaman Login:        http://10.18.1.25:3001/Login.html`);
    console.log(`📦 Status Mock DB:       Aktif (In-Memory, Tidak Perlu MySQL/PostgreSQL)`);
    console.log('========================================================');
  });

  serverInstance.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const fallbackPort = Number(PORT) + 1;
      console.warn(`\n[Peringatan] Port ${PORT} sedang dipakai oleh proses lain.`);
      console.warn(`Mengalihkan otomatis ke port alternatif: http://localhost:${fallbackPort}\n`);
      activeServer.listen(fallbackPort, '0.0.0.0', () => {
        console.log('========================================================');
        console.log(`🚀 Server berjalan pada port cadangan: http://localhost:${fallbackPort}`);
        console.log(`🌐 Halaman Utama:        http://localhost:${fallbackPort}/Index.html`);
        console.log(`🔐 Halaman Login:        http://localhost:${fallbackPort}/Login.html`);
        console.log('========================================================');
      });
    } else {
      console.error('[Server Error]:', err);
    }
  });
}

// Export untuk Firebase Cloud Functions / Serverless
module.exports = activeServer;

