import{s as g,c as y,i as k}from"./lucide-BDXvBw8E.js";import{r as E,i as $}from"./Layout-T-bwAtME.js";let d=null,r=!1,x=null,p=0,m=0,b=null;function w(){var o;const e=g.isDarkMode,n=g.tables,a=n.find(t=>t.id===d),f=t=>{switch(t){case"FREE":return"bg-green-50/80 border-green-500/20 text-green-600 dark:bg-green-950/30 dark:text-green-400";case"OCCUPIED":return"bg-red-50/80 border-[#FF0000]/20 text-[#FF0000] dark:bg-red-950/30 dark:text-red-400";case"PENDING":return"bg-amber-50/80 border-amber-500/20 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400";default:return""}},i=t=>{switch(t){case"OCCUPIED":return"users";case"FREE":return"check-circle-2";case"PENDING":return"clock";default:return"circle"}},s=`
    <div class="h-[calc(100vh-80px)] -m-8 flex flex-col xl:flex-row overflow-hidden relative">
      <!-- Canvas Area -->
      <div class="flex-1 flex flex-col overflow-hidden relative ${e?"bg-black":"bg-gray-50"}">
        
        <div class="p-6 flex items-center justify-between z-10 absolute top-0 left-0 right-0 pointer-events-none">
          <div>
            <h2 class="text-3xl font-black drop-shadow-sm ${e?"text-white":"text-gray-900"}">Floor Plan</h2>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 bg-white/50 dark:bg-black/50 backdrop-blur-md px-3 py-1 rounded-full inline-block">
              ${r?"Drag tables to arrange • Click table to rename":"Select a table to manage orders"}
            </p>
          </div>

          <div class="flex gap-3 pointer-events-auto">
            <button 
              id="edit-mode-btn"
              class="px-6 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-2 shadow-xl backdrop-blur-md ${r?"bg-indigo-500 text-white shadow-indigo-500/30 hover:bg-indigo-600":"bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white hover:bg-white border border-gray-200 dark:border-gray-700"}"
            >
              <i data-lucide="${r?"save":"move"}" class="w-4 h-4"></i> 
              ${r?"Save Layout":"Edit Floor Plan"}
            </button>
          </div>
        </div>

        <!-- Interior Canvas -->
        <div 
          id="canvas-container"
          class="flex-1 w-full h-full relative overflow-hidden transition-all ${r?"cursor-crosshair":"cursor-default"}"
        >
          <!-- Grid Background pattern -->
          <div class="absolute inset-0 opacity-40 ${e?"bg-[radial-gradient(#ffffff20_2px,transparent_2px)]":"bg-[radial-gradient(#00000015_2px,transparent_2px)]"}" style="background-size: 50px 50px;"></div>

          ${n.map(t=>{var c,u;return`
            <div
              class="table-btn absolute w-28 h-28 rounded-[2rem] flex flex-col items-center justify-center border-4 transition-all shadow-xl backdrop-blur-md group ${f(t.status)} ${d===t.id&&!r?"border-[#FF0000] ring-8 ring-[#FF0000]/10 z-20 scale-110":"border-transparent z-10 scale-100"} ${r?"hover:scale-105 cursor-grab active:cursor-grabbing border-dashed border-indigo-400 hover:border-indigo-500 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white hover:shadow-2xl hover:shadow-indigo-500/20":"hover:-translate-y-1 hover:shadow-2xl cursor-pointer"}"
              style="left: ${((c=t.position)==null?void 0:c.x)??0}px; top: ${((u=t.position)==null?void 0:u.y)??0}px; transform-origin: center center;"
              data-id="${t.id}"
            >
              ${r?`
                <button onclick="window.openEditName(event, '${t.id}')" class="absolute -top-3 -right-3 bg-indigo-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95 cursor-pointer z-30">
                  <i data-lucide="pencil" class="w-3 h-3"></i>
                </button>
                <div class="absolute -top-3 -left-3 bg-white dark:bg-gray-800 text-gray-400 p-2 rounded-full shadow-lg border dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <i data-lucide="grip-horizontal" class="w-3 h-3"></i>
                </div>
              `:""}
              
              <div class="relative flex flex-col items-center pointer-events-none">
                <i data-lucide="${r?"move":i(t.status)}" class="w-8 h-8 mb-2 ${r?"text-indigo-400":""}"></i>
                <span class="font-black text-xs block text-center truncate px-2 max-w-full">${t.name}</span>
              </div>
            </div>
          `}).join("")}
        </div>
      </div>

      <!-- Control Sidebar -->
      <div class="w-full xl:w-[450px] flex flex-col shadow-2xl z-20 transition-transform duration-500 overflow-y-auto ${e?"bg-gray-900/95 border-l border-gray-800":"bg-white border-l border-gray-200"}">
        ${a?`
          <div class="p-8 h-full flex flex-col animate-in slide-in-from-right-8 fade-in duration-500">
            <!-- Header -->
            <div class="flex items-start justify-between mb-8 pb-8 border-b ${e?"border-gray-800":"border-gray-100"}">
              <div class="flex gap-5 items-center">
                <div class="w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner font-black text-2xl ${f(a.status)} ring-4 ring-gray-50 dark:ring-gray-950">
                   ${a.name.substring(0,2).toUpperCase()}
                </div>
                <div>
                  <h3 class="text-3xl font-black tracking-tight ${e?"text-white":"text-gray-900"}">${a.name}</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="relative flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${a.status==="FREE"?"bg-green-400":a.status==="OCCUPIED"?"bg-[#FF0000]":"bg-amber-400"}"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 ${a.status==="FREE"?"bg-green-500":a.status==="OCCUPIED"?"bg-[#FF0000]":"bg-amber-500"}"></span>
                    </span>
                    <span class="text-xs font-black uppercase tracking-widest text-gray-500">${a.status}</span>
                  </div>
                </div>
              </div>
              <button onclick="window.closeSidebar()" class="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                 <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>

            <!-- Creative Action Grid -->
            <div class="flex-1 flex flex-col justify-center space-y-4">
              <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 mb-2">Assign New Status</p>
              
              <button 
                onclick="window.setTableStatus('FREE')"
                class="relative overflow-hidden w-full p-6 rounded-[2rem] border-2 transition-all group text-left ${a.status==="FREE"?"border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20 ring-4 ring-green-500/10":"border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-800/50"}"
              >
                <div class="flex items-center gap-5 relative z-10">
                  <div class="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${a.status==="FREE"?"bg-green-500 text-white shadow-md shadow-green-500/30":"bg-white dark:bg-gray-700 text-green-500 shadow-sm"}">
                    <i data-lucide="check-circle-2" class="w-6 h-6"></i>
                  </div>
                  <div>
                     <span class="block text-xl font-black ${e?"text-white":"text-gray-900"}">Free Table</span>
                     <span class="block text-xs font-bold text-gray-400 mt-1">Clean and ready for new guests</span>
                  </div>
                </div>
              </button>

              <button 
                onclick="window.setTableStatus('OCCUPIED')"
                class="relative overflow-hidden w-full p-6 rounded-[2rem] border-2 transition-all group text-left ${a.status==="OCCUPIED"?"border-[#FF0000] bg-red-500/10 shadow-lg shadow-red-500/20 ring-4 ring-red-500/10":"border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800/50"}"
              >
                <div class="flex items-center gap-5 relative z-10">
                  <div class="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${a.status==="OCCUPIED"?"bg-[#FF0000] text-white shadow-md shadow-red-500/30":"bg-white dark:bg-gray-700 text-[#FF0000] shadow-sm"}">
                    <i data-lucide="users" class="w-6 h-6"></i>
                  </div>
                  <div>
                     <span class="block text-xl font-black ${e?"text-white":"text-gray-900"}">Occupied</span>
                     <span class="block text-xs font-bold text-gray-400 mt-1">Guests are currently seated</span>
                  </div>
                </div>
              </button>

              <button 
                onclick="window.setTableStatus('PENDING')"
                class="relative overflow-hidden w-full p-6 rounded-[2rem] border-2 transition-all group text-left ${a.status==="PENDING"?"border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20 ring-4 ring-amber-500/10":"border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-200 dark:hover:border-amber-800/50"}"
              >
                <div class="flex items-center gap-5 relative z-10">
                  <div class="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${a.status==="PENDING"?"bg-amber-500 text-white shadow-md shadow-amber-500/30":"bg-white dark:bg-gray-700 text-amber-500 shadow-sm"}">
                    <i data-lucide="clock" class="w-6 h-6"></i>
                  </div>
                  <div>
                     <span class="block text-xl font-black ${e?"text-white":"text-gray-900"}">Needs Attention</span>
                     <span class="block text-xs font-bold text-gray-400 mt-1">Waiting for food or bill payment</span>
                  </div>
                </div>
              </button>
            </div>

            <div class="pt-8 mt-auto">
              <button onclick="window.location.href='/menu.html'" class="w-full py-5 rounded-[24px] bg-[#FF0000] text-white font-black uppercase tracking-widest shadow-xl shadow-red-500/30 hover:bg-red-600 transition-all flex items-center justify-center gap-3 active:scale-95">
                <i data-lucide="smartphone" class="w-5 h-5"></i> Take Order
              </button>
            </div>
          </div>
        `:`
          <!-- Empty State -->
          <div class="flex flex-col items-center justify-start h-full text-center p-8 fade-in opacity-80 pt-24">
            <div class="w-32 h-32 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300 dark:border-gray-700 mb-6">
               <i data-lucide="hand" class="w-12 h-12 text-gray-300 dark:text-gray-700"></i>
            </div>
            <div class="mb-12">
              <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-2">No Table Selected</h3>
              <p class="text-sm font-bold text-gray-400">Tap any table on the floor plan to update its status or begin a transaction.</p>
            </div>

            <!-- Legend Status Guide moved here -->
            <div class="w-full bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4 text-left">
               <p class="text-[10px] font-black uppercase tracking-widest text-gray-500">Status Guide</p>
               <div class="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-300">
                 <div class="w-4 h-4 rounded-full bg-green-500 shadow-sm flex-shrink-0"></div> Free - Ready for guests
               </div>
               <div class="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-300">
                 <div class="w-4 h-4 rounded-full bg-[#FF0000] shadow-sm flex-shrink-0"></div> Occupied - Guests seated
               </div>
               <div class="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-300">
                 <div class="w-4 h-4 rounded-full bg-amber-500 shadow-sm flex-shrink-0"></div> Pending - Needs attention
               </div>
            </div>
          </div>
        `}
      </div>

      <!-- Edit Name Modal -->
      ${b?`
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in" onclick="window.closeEditModal()">
           <div class="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-2xl w-full max-w-sm flex flex-col gap-6" onclick="event.stopPropagation()">
              <div>
                <h3 class="text-2xl font-black ${e?"text-white":"text-gray-900"}">Rename Table</h3>
                <p class="text-xs font-bold text-gray-500 mt-1">Give this table a custom identifier</p>
              </div>
              <input 
                type="text" 
                id="edit-table-name"
                value="${((o=g.tables.find(t=>t.id===b))==null?void 0:o.name)||""}"
                class="w-full p-4 rounded-2xl font-black text-lg transition-all focus:ring-4 focus:ring-indigo-500/20 focus:outline-none ${e?"bg-gray-800 text-white border-transparent":"bg-gray-50 text-gray-900 border-gray-200"} border"
              />
              <div class="flex gap-3">
                <button onclick="window.closeEditModal()" class="flex-1 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button onclick="window.saveTableName()" class="flex-1 py-4 rounded-xl font-bold bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-colors">Save Name</button>
              </div>
           </div>
        </div>
      `:""}

    </div>
  `;document.getElementById("root").innerHTML=E(s,"/tables.html"),$(),setTimeout(()=>{y({icons:k}),C(),F()},0)}function l(){w()}function F(){const e=document.getElementById("canvas-container");if(!e)return;const n=i=>{if(r&&x){const s=e.getBoundingClientRect();let o=i.clientX-s.left-p,t=i.clientY-s.top-m;const c=112,u=Math.max(s.width,800)-c,h=Math.max(s.height,600)-c;o=Math.max(20,Math.min(o,u)),t=Math.max(100,Math.min(t,h));const v=document.querySelector(`.table-btn[data-id="${x}"]`);v&&(v.style.left=`${o}px`,v.style.top=`${t}px`)}},a=i=>{if(r&&x){const s=e.getBoundingClientRect();let o=i.clientX-s.left-p,t=i.clientY-s.top-m;const c=112,u=Math.max(s.width,800)-c,h=Math.max(s.height,600)-c;o=Math.max(20,Math.min(o,u)),t=Math.max(100,Math.min(t,h)),g.updateTablePosition(x,o,t),x=null,document.removeEventListener("mousemove",n),document.removeEventListener("mouseup",a)}};document.querySelectorAll(".table-btn").forEach(i=>{i.addEventListener("mousedown",s=>{if(!s.target.closest("button")&&r){x=i.getAttribute("data-id");const o=i.getBoundingClientRect();p=s.clientX-o.left,m=s.clientY-o.top,document.addEventListener("mousemove",n),document.addEventListener("mouseup",a)}}),i.addEventListener("click",s=>{s.stopPropagation(),r||(d=i.getAttribute("data-id"),l())})}),e.addEventListener("mousedown",i=>{i.target.closest(".table-btn")||!r&&d&&(d=null,l())})}function C(){const e=document.getElementById("edit-mode-btn");e&&e.addEventListener("click",()=>{r=!r,r&&(d=null),l()})}window.openEditName=(e,n)=>{e.stopPropagation(),b=n,l()};window.closeSidebar=()=>{d=null,l()};window.setTableStatus=e=>{d&&(g.updateTableStatus(d,e),l())};window.closeEditModal=()=>{b=null,l()};window.saveTableName=()=>{const e=document.getElementById("edit-table-name");if(e&&b){const n=g.tables.find(a=>a.id===b);n&&(n.name=e.value,g.notify()),b=null,l()}};g.subscribe(l);w();
