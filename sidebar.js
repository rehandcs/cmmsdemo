/**
 * sidebar.js - Komponen Mandiri Sidebar CMMS PT. Can Sports Industrial Indonesia
 * Menghasilkan dan menyuntikkan sidebar secara otomatis ke halaman web,
 * baik dijalankan via HTTP server (localhost/Firebase) maupun dibuka langsung (file:///).
 */

(function () {
  const SIDEBAR_HTML = `
<style id="cmms-sidebar-styles">
  #sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 50;
    width: 15rem;
    transform: translateX(0);
    transition: width 0.3s ease, transform 0.3s ease;
  }
  @media (min-width: 768px) {
    #sidebar { position: relative; }
  }
  @media (max-width: 767px) {
    #sidebar:not(.sidebar-open) { transform: translateX(-100%) !important; }
  }
  .sidebar-collapsed { width: 5rem !important; }
  .sidebar-collapsed .sidebar-text,
  .sidebar-collapsed .dropdown-icon { display: none !important; }
  .sidebar-collapsed .header-sidebar { justify-content: center !important; padding: 0 !important; }
  .sidebar-collapsed .sidebar-link,
  .sidebar-collapsed .submenu-trigger { justify-content: center !important; padding-left: 0 !important; padding-right: 0 !important; }
  .sidebar-collapsed .submenu-trigger > div { justify-content: center !important; width: 100%; }
  .sidebar-collapsed .bx { margin-right: 0 !important; }
  .sidebar-collapsed [id^="submenu-"] { display: none !important; }
</style>
<aside id="sidebar" class="h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm shrink-0">
  <div class="h-14 flex items-center px-4 border-b border-gray-200 bg-white header-sidebar justify-between md:justify-start">
    <div class="flex items-center">
      <i onclick="toggleSidebar()" class='bx bx-menu text-2xl text-gray-800 hover:text-orange-500 cursor-pointer transition-colors mr-3 hidden md:block'></i>
      <img src="https://res.cloudinary.com/bfvxjarw/image/upload/v1787793240/zzbzwaygnskgion7kslx.jpg" class="w-22" style="width: 50px; height: auto;" alt="Logo" />
    </div>
    <!-- Tombol Tutup (Hanya tampil di Mobile) -->
    <i onclick="toggleSidebar()" class='bx bx-x text-2xl text-gray-800 hover:text-red-500 cursor-pointer md:hidden'></i>
  </div>

  <nav class="flex-1 overflow-y-auto py-4 space-y-1 px-2 text-sm min-h-0" id="sidebar-nav">
    <a href="Index.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200">
      <i class='bx bx-home text-xl mr-3'></i> <span class="sidebar-text">Home</span>
    </a>
    <a href="Schedule.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200 mt-2">
      <i class='bx bx-calendar text-xl mr-3'></i> <span class="sidebar-text">Schedule</span>
    </a>

    <div class="mt-2">
      <div class="flex justify-between items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer transition-colors duration-200 submenu-trigger" onclick="toggleSubmenu('submenu-workorder', this)">
        <div class="flex items-center"><i class='bx bx-book text-xl mr-3'></i> <span class="sidebar-text">Work Order</span></div>
        <i class='bx bx-chevron-down text-gray-400 dropdown-icon transition-transform'></i>
      </div>
      <div id="submenu-workorder" class="pl-9 pr-2 py-1 space-y-1 bg-orange-50/50 rounded-lg mt-1 hidden">
        <a href="WorkOrder.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-desktop text-lg mr-3'></i> <span class="sidebar-text">Live Dashboard</span>
        </a>
        <a href="TicketWO.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-task text-lg mr-3'></i> <span class="sidebar-text">Ticket Order</span>
        </a>
        <a href="WorkOrderHistory.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-history text-lg mr-3'></i> <span class="sidebar-text">WO History</span>
        </a>
      </div>
    </div>

    <div class="mt-2">
      <div class="flex justify-between items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer transition-colors duration-200 submenu-trigger" onclick="toggleSubmenu('submenu-maintenance', this)">
        <div class="flex items-center"><i class='bx bx-wrench text-xl mr-3'></i> <span class="sidebar-text">Maintenance</span></div>
        <i class='bx bx-chevron-down text-gray-400 dropdown-icon transition-transform'></i>
      </div>
      <div id="submenu-maintenance" class="pl-9 pr-2 py-1 space-y-1 bg-orange-50/50 rounded-lg mt-1 hidden">
        <a href="Preventive.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-calendar-check text-lg mr-3'></i> <span class="sidebar-text">Preventive</span>
        </a>
        <a href="Corrective.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-error-circle text-lg mr-3'></i> <span class="sidebar-text">Corrective</span>
        </a>
      </div>
    </div>

    <div class="mt-2">
      <div class="flex justify-between items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer transition-colors duration-200 submenu-trigger" onclick="toggleSubmenu('submenu-workshop', this)">
        <div class="flex items-center"><i class='bx bx-building text-xl mr-3'></i> <span class="sidebar-text">Supply and Placement</span></div>
        <i class='bx bx-chevron-down text-gray-400 dropdown-icon transition-transform'></i>
      </div>
      <div id="submenu-workshop" class="pl-9 pr-2 py-1 space-y-1 bg-orange-50/50 rounded-lg mt-1 hidden">
        <a href="Pickup.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-cog text-lg mr-3'></i> <span class="sidebar-text">Pick Up Sparepart</span>
        </a>
        <a href="SparepartArrival.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-archive text-lg mr-3'></i> <span class="sidebar-text">Sparepart Arrival</span>
        </a>
        <a href="AssetPlacement.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-cube text-lg mr-3'></i> <span class="sidebar-text">Asset Placement</span>
        </a>
      </div>
    </div>

    <div class="mt-2">
      <div class="flex justify-between items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer transition-colors duration-200 submenu-trigger" onclick="toggleSubmenu('submenu-inventory', this)">
        <div class="flex items-center"><i class='bx bx-package text-xl mr-3'></i> <span class="sidebar-text">Inventory</span></div>
        <i class='bx bx-chevron-down text-gray-400 dropdown-icon transition-transform'></i>
      </div>
      <div id="submenu-inventory" class="pl-9 pr-2 py-1 space-y-1 bg-orange-50/50 rounded-lg mt-1 hidden">
        <a href="UsageLog.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-history text-lg mr-3'></i> <span class="sidebar-text">Sparepart Management</span>
        </a>
        <a href="AssetManagement.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-spreadsheet text-lg mr-3'></i> <span class="sidebar-text">Asset Management</span>
        </a>
        <a href="DatabaseMaster.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-data text-lg mr-3'></i> <span class="sidebar-text">Master Database</span>
        </a>
      </div>
    </div>

    <a href="mechanic.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200 mt-2">
      <i class='bx bx-refresh text-lg mr-3'></i> <span class="sidebar-text">Mechanic</span>
    </a>

    <div class="mt-2">
      <div class="flex justify-between items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer transition-colors duration-200 submenu-trigger" onclick="toggleSubmenu('submenu-reports', this)">
        <div class="flex items-center"><i class='bx bx-pie-chart-alt-2 text-xl mr-3'></i> <span class="sidebar-text">Reports Analysis</span></div>
        <i class='bx bx-chevron-down text-gray-400 dropdown-icon transition-transform'></i>
      </div>
      <div id="submenu-reports" class="pl-9 pr-2 py-1 space-y-1 bg-orange-50/50 rounded-lg mt-1 hidden">
        <a href="TrackingAssets.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-radar text-lg mr-3'></i> <span class="sidebar-text">Asset History</span>
        </a>
        <a href="mttrmtbdanalysis.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-bar-chart text-lg mr-3'></i> <span class="sidebar-text">MTTR and MTBF Analysis</span>
        </a>
        <a href="TrackingSpareparts.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-folder text-lg mr-3'></i> <span class="sidebar-text">Spareparts Usage</span>
        </a>
        <a href="costanalysis.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-pie-chart-alt text-lg mr-3'></i> <span class="sidebar-text">Cost Analysis</span>
        </a>
        <a href="mechanicperformance.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-orange-100 rounded-md transition-colors duration-200">
          <i class='bx bx-line-chart text-lg mr-3'></i> <span class="sidebar-text">Mechanic Analysis</span>
        </a>
      </div>
    </div>

    <a href="UserSettings.html" class="sidebar-link flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200 mt-2">
      <i class='bx bx-user text-xl mr-3'></i> <span class="sidebar-text">User Settings</span>
    </a>

    <!-- Tombol Logout -->
    <div class="pt-4 mt-auto border-t border-gray-100 pb-2">
      <a href="javascript:void(0)" onclick="handleLogout()" class="sidebar-link flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200">
        <i class='bx bx-log-out text-xl mr-3'></i> <span class="sidebar-text font-medium">Logout</span>
      </a>
    </div>

  </nav>
</aside>
`;

  // Intercept fetch('sidebar.html') agar selalu berhasil tanpa kena blokir CORS pada file:///
  try {
    const existingFetch = window.fetch;
    window.fetch = function (input, init) {
      const urlStr = typeof input === 'string' ? input : (input && input.url ? input.url : '');
      if (urlStr && (urlStr === 'sidebar.html' || urlStr.endsWith('/sidebar.html') || urlStr.endsWith('sidebar.html'))) {
        return Promise.resolve(new Response(SIDEBAR_HTML, {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'text/html; charset=UTF-8' }
        }));
      }
      return existingFetch.apply(this, arguments);
    };
  } catch (e) { }

  // 1. Injeksi Otomatis Sidebar ke DOM
  function injectSidebar() {
    // Jangan tampilkan sidebar pada Login.html
    const currentPath = window.location.pathname.split("/").pop().toLowerCase();
    if (currentPath === 'login.html') return;

    if (!document.body) return;

    // Pastikan mobile-overlay ada
    if (!document.getElementById('mobile-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'mobile-overlay';
      overlay.className = 'fixed inset-0 bg-black/50 z-40 md:hidden hidden';
      overlay.setAttribute('onclick', 'toggleSidebar()');
      document.body.prepend(overlay);
    }

    // Cari atau buat sidebar-container
    let container = document.getElementById('sidebar-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'sidebar-container';
      container.className = 'z-40 shrink-0';
      const overlay = document.getElementById('mobile-overlay');
      if (overlay && overlay.nextSibling) {
        document.body.insertBefore(container, overlay.nextSibling);
      } else {
        document.body.prepend(container);
      }
    }

    // Injeksi konten sidebar jika belum terisi
    if (!document.getElementById('sidebar')) {
      container.innerHTML = SIDEBAR_HTML;
    }

    // Inisialisasi status menu dan user header
    setActiveMenu();
    syncSidebar();
    syncHeaderUser();
  }

  // 2. Fungsi Kompatibilitas loadSidebar untuk halaman yang memanggilnya
  window.loadSidebar = function () {
    injectSidebar();
  };

  // 3. Highlight Menu Sidebar yang Aktif
  window.setActiveMenu = function () {
    let path = window.location.pathname.split("/").pop();
    if (path === '' || path === '/') path = 'Index.html';

    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || (path === 'AssetManagement.html' && href === 'AssetManagement.html')) {
        link.classList.remove('text-gray-600', 'hover:bg-gray-50', 'hover:bg-orange-100');
        link.classList.add('bg-orange-500', 'text-white');

        const parentSubmenu = link.closest('[id^="submenu-"]');
        if (parentSubmenu) {
          parentSubmenu.classList.remove('hidden');
          parentSubmenu.classList.add('block');
          const trigger = parentSubmenu.previousElementSibling;
          if (trigger) {
            const icon = trigger.querySelector('.dropdown-icon');
            if (icon) icon.style.transform = 'rotate(180deg)';
          }
        }
      }
    });
  };

  // 4. Sinkronisasi User Profile pada Header
  function syncHeaderUser() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {
      name: 'Rehand Naifi Surya',
      role: 'Admin Developer',
      profile_picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
    };

    const nameEl = document.getElementById('header-user-name');
    const roleEl = document.getElementById('header-user-role');
    const avatarEl = document.getElementById('header-avatar');

    if (nameEl && (nameEl.innerText === 'Loading...' || !nameEl.innerText.trim())) {
      nameEl.innerText = userData.name;
    }
    if (roleEl && (roleEl.innerText === 'Loading...' || !roleEl.innerText.trim())) {
      roleEl.innerText = userData.role || 'User';
    }
    if (avatarEl && (!avatarEl.src || avatarEl.src === window.location.href)) {
      avatarEl.src = userData.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=f97316&color=fff&bold=true`;
    }
  }

  // 5. Kontrol Lebar & Responsivitas Sidebar
  function syncSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    if (!sidebar) return;

    sidebar.style.setProperty('transition', 'width 0.3s ease', 'important');
    if (window.innerWidth >= 768) {
      sidebar.classList.remove('sidebar-open');
      sidebar.style.setProperty('transform', 'translateX(0)', 'important');
      sidebar.style.setProperty('width', sidebar.classList.contains('sidebar-collapsed') ? '5rem' : '15rem', 'important');
      if (overlay) overlay.classList.add('hidden');
      return;
    }

    sidebar.classList.remove('sidebar-collapsed');
    sidebar.style.setProperty('width', '15rem', 'important');
    const isOpen = sidebar.classList.contains('sidebar-open');
    sidebar.style.setProperty('transform', isOpen ? 'translateX(0)' : 'translateX(-100%)', 'important');
    if (overlay) overlay.classList.toggle('hidden', !isOpen);
  }

  // 6. Toggle Buka/Tutup Sidebar
  window.toggleSidebar = function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    if (!sidebar) {
      injectSidebar();
      return;
    }

    if (window.innerWidth >= 768) {
      const isCollapsed = sidebar.classList.toggle('sidebar-collapsed');
      sidebar.style.setProperty('width', isCollapsed ? '5rem' : '15rem', 'important');
      sidebar.style.setProperty('transform', 'translateX(0)', 'important');
      if (overlay) overlay.classList.add('hidden');
      return;
    }

    sidebar.classList.remove('sidebar-collapsed');
    sidebar.style.setProperty('width', '15rem', 'important');
    const isOpen = sidebar.classList.toggle('sidebar-open');
    sidebar.style.setProperty('transform', isOpen ? 'translateX(0)' : 'translateX(-100%)', 'important');
    if (overlay) overlay.classList.toggle('hidden', !isOpen);
  };

  // 7. Toggle Submenu Accordion
  window.toggleSubmenu = function (id, element) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('sidebar-collapsed')) {
      sidebar.classList.remove('sidebar-collapsed');
      sidebar.style.setProperty('width', '15rem', 'important');
    }
    const submenu = document.getElementById(id);
    if (!submenu) return;
    const icon = element ? element.querySelector('.dropdown-icon') : null;
    if (submenu.classList.contains('hidden')) {
      submenu.classList.remove('hidden');
      submenu.classList.add('block');
      if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
      submenu.classList.remove('block');
      submenu.classList.add('hidden');
      if (icon) icon.style.transform = 'rotate(0deg)';
    }
  };

  // 8. Logout Global
  window.handleLogout = function () {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    window.location.href = 'Login.html';
  };

  // 9. Jalankan Injeksi saat dokumen siap
  if (typeof document !== 'undefined') {
    if (document.body) {
      injectSidebar();
    }
    document.addEventListener('DOMContentLoaded', injectSidebar);
  }
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('load', injectSidebar);
    window.addEventListener('resize', syncSidebar);
  }
})();
