import{s as l,c as d,i as c}from"./lucide-BDXvBw8E.js";window.toggleSidebar=()=>{const e=document.getElementById("main-sidebar"),t=document.getElementById("mobile-sidebar-overlay");e.classList.contains("-translate-x-full")?(e.classList.remove("-translate-x-full"),t.classList.remove("hidden")):(e.classList.add("-translate-x-full"),t.classList.add("hidden"))};function h(e,t="/"){const o=l.isDarkMode,r=l.userRole;if(!r&&!window.location.pathname.includes("login.html"))return window.location.href="/login.html","";const i=[{to:"/",icon:"home",label:"Dashboard",roles:["owner","cashier"]},{to:"/menu.html",icon:"grid-3x3",label:"Menu",roles:["owner","cashier"]},{to:"/tables.html",icon:"grid-2x2",label:"Table Plan",roles:["owner","cashier"]},{to:"/bills.html",icon:"receipt-text",label:"Billing History",roles:["owner","cashier"]},{to:"/reports.html",icon:"pie-chart",label:"Analytics",roles:["owner"]},{to:"/settings.html",icon:"settings",label:"Settings",roles:["owner"]}].filter(a=>a.roles.includes(r)),s=i.find(a=>a.to===t)||i[0];return`
    <div class="flex h-screen w-full transition-colors duration-300 overflow-hidden ${o?"bg-gray-950 text-white":"bg-gray-50 text-gray-900"}">
      
      <!-- Mobile Sidebar Overlay -->
      <div id="mobile-sidebar-overlay" class="fixed inset-0 bg-black/50 z-40 hidden md:hidden transition-opacity" onclick="window.toggleSidebar()"></div>

      <!-- Desktop & Mobile Sidebar -->
      <aside id="main-sidebar" class="fixed md:static inset-y-0 left-0 w-64 flex flex-col border-r transition-transform duration-300 z-50 shrink-0 -translate-x-full md:translate-x-0 ${o?"bg-gray-950 border-gray-800":"bg-white border-gray-200"}">
        <div class="p-6 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="bg-[#FF0000] p-2 rounded-xl text-white shadow-lg shadow-red-500/20">
              <i data-lucide="receipt-text" class="w-6 h-6"></i>
            </div>
            <span class="font-black text-xl tracking-tight">BRM <span class="text-[#FF0000]">System</span></span>
          </div>
          <button onclick="window.toggleSidebar()" class="md:hidden p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto styled-scrollbar">
          ${i.map(a=>{const n=t===a.to;return`
              <a href="${a.to}" class="flex flex-row items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200 ${n?"text-[#FF0000] bg-red-50 dark:bg-red-500/10 shadow-sm":"text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50"}">
                <i data-lucide="${a.icon}" class="w-5 h-5" stroke-width="${n?"2.5":"2"}"></i>
                <span>${a.label}</span>
              </a>
            `}).join("")}
        </nav>

        <div class="p-4 border-t dark:border-gray-800 space-y-2 bg-inherit">
          <button id="toggle-theme-btn" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50 transition-all">
            <i data-lucide="${o?"sun":"moon"}" class="w-5 h-5"></i>
            <span>${o?"Light Mode":"Dark Mode"}</span>
          </button>
          
          <button id="logout-btn" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
            <i data-lucide="log-out" class="w-5 h-5"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        <!-- Top Header -->
        <header class="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 border-b shrink-0 z-20 transition-colors ${o?"bg-gray-950/80 border-gray-800 backdrop-blur-md":"bg-white/80 border-gray-200 backdrop-blur-md"}">
          <div class="flex items-center gap-3">
            <button onclick="window.toggleSidebar()" class="md:hidden p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <i data-lucide="menu" class="w-5 h-5"></i>
            </button>
            <div>
              <h2 class="text-sm font-bold uppercase tracking-widest text-[#FF0000]">
                ${s?s.label:"Overview"}
              </h2>
              <p class="text-xs font-medium hidden sm:block ${o?"text-gray-400":"text-gray-500"}">
                Welcome back, <span class="text-primary capitalize">${r}</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
             <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-inner ${o?"bg-gray-800 text-white":"bg-gray-100 text-gray-900"}">
               ${r?r[0].toUpperCase():""}
             </div>
          </div>
        </header>

        <!-- Scrollable Content -->
        <main class="flex-1 overflow-y-auto p-4 md:p-8 styled-scrollbar relative">
          <div class="max-w-[1400px] mx-auto" id="page-content">
            ${e}
          </div>
        </main>
      </div>
    </div>
  `}function x(){setTimeout(()=>{d({icons:c});const e=document.getElementById("toggle-theme-btn");e&&e.addEventListener("click",()=>{l.toggleDarkMode(),window.location.reload()});const t=document.getElementById("logout-btn");t&&t.addEventListener("click",()=>{l.logout(),window.location.href="/login.html"})},0)}export{x as i,h as r};
