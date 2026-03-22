import{s,c as y,i as h}from"./lucide-BDXvBw8E.js";import{r as f,i as m}from"./Layout-T-bwAtME.js";let l="",c="ALL",a=null;const p=e=>new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",day:"2-digit",month:"short",year:"numeric"}).format(e);function x(){const e=s.isDarkMode,r=s.userRole,o=s.settings,d=(s.userRole==="owner"?s.bills:s.bills.filter(t=>{var i;return t.cashierId===((i=s.currentUser)==null?void 0:i.id)})).filter(t=>{const i=t.billNumber.includes(l)||t.items.some(b=>b.name.toLowerCase().includes(l.toLowerCase())),u=c==="ALL"||t.status===c;return i&&u}),g=`
    <div class="h-[calc(100vh-80px)] -m-8 flex flex-col overflow-hidden bg-gray-50/30 dark:bg-transparent relative">
      <!-- Table Header / Actions -->
      <div class="p-6 border-b flex flex-wrap gap-4 items-center justify-between z-10 backdrop-blur-md ${e?"bg-gray-950/80 border-gray-800":"bg-white/80 border-gray-200"}">
        <div class="flex items-center gap-6">
          <h2 class="text-2xl font-black ${e?"text-white":"text-gray-900"}">Transaction Ledger</h2>
          <div class="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            ${["ALL","PAID","PENDING"].map(t=>`
              <button 
                onclick="window.setFilterStatus('${t}')"
                class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${c===t?"bg-white dark:bg-gray-700 text-[#FF0000] shadow-sm":"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}"
              >
                ${t}
              </button>
            `).join("")}
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="relative">
            <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
            <input 
              type="text" 
              id="search-input"
              placeholder="Search by Bill # or Dish..."
              value="${l}"
              class="pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium w-64 transition-all focus:ring-2 focus:ring-[#FF0000] focus:outline-none ${e?"bg-gray-900 border-transparent text-white":"bg-gray-100 border-transparent text-gray-900"}"
            />
          </div>
          ${r==="owner"?`
            <button class="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-[#FF0000] transition-all">
              <i data-lucide="download" class="w-5 h-5"></i>
            </button>
          `:""}
        </div>
      </div>

      <!-- Main Table Content -->
      <div class="flex-1 overflow-auto p-6 styled-scrollbar">
        <div class="rounded-[32px] overflow-hidden border shadow-sm ${e?"bg-gray-900 border-gray-800":"bg-white border-gray-100"}">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b text-[10px] font-black uppercase tracking-widest ${e?"bg-gray-800/50 border-gray-800 text-gray-500":"bg-gray-50 border-gray-100 text-gray-400"}">
                <th class="px-6 py-4 px-2">Bill Number</th>
                <th class="px-6 py-4 px-2">Date & Time</th>
                <th class="px-6 py-4 px-2">Items</th>
                <th class="px-6 py-4 px-2">Payment</th>
                <th class="px-6 py-4 px-2">Total Amount</th>
                <th class="px-6 py-4 px-2">Status</th>
                <th class="px-6 py-4 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              ${d.map(t=>`
                <tr 
                  onclick="window.openBillModal('${t.id}')"
                  class="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <td class="px-6 py-5 px-2">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 text-[#FF0000] flex items-center justify-center">
                        <i data-lucide="receipt-text" class="w-4 h-4"></i>
                      </div>
                      <span class="font-black ${e?"text-white":"text-gray-900"}">#${t.billNumber}</span>
                    </div>
                  </td>
                  <td class="px-6 py-5 px-2">
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">${p(t.timestamp)}</span>
                    ${r==="owner"&&t.cashierName?`<br><span class="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">${t.cashierName}</span>`:""}
                  </td>
                  <td class="px-6 py-5 max-w-xs px-2">
                    <p class="text-sm font-bold text-gray-600 dark:text-gray-300 truncate">
                      ${t.items.map(i=>`${i.quantity}x ${i.name}`).join(", ")}
                    </p>
                  </td>
                  <td class="px-6 py-5 px-2">
                    <div class="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-400">
                      ${t.paymentMethod==="M-Pesa"?'<i data-lucide="smartphone" class="w-3.5 h-3.5 text-green-500"></i>':""}
                      ${t.paymentMethod}
                    </div>
                  </td>
                  <td class="px-6 py-5 px-2">
                    <span class="text-lg font-black text-[#FF0000]">${o.currency} ${t.total.toFixed(2)}</span>
                  </td>
                  <td class="px-6 py-5 px-2">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${t.status==="PAID"?"bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400":"bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"}">
                      ${t.status}
                    </span>
                  </td>
                  <td class="px-6 py-5 text-right px-2">
                    <button class="p-2 text-gray-400 hover:text-[#FF0000] opacity-0 group-hover:opacity-100 transition-all">
                      <i data-lucide="chevron-right" class="w-5 h-5"></i>
                    </button>
                  </td>
                </tr>
              `).join("")}
              
              ${d.length===0?`
                <tr>
                  <td colspan="7" class="px-6 py-20 text-center text-gray-400 font-bold">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              `:""}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bill Detail Drawer Modal -->
      ${a?`
        <div 
          class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 px-6 py-12 flex justify-center items-center transition-opacity"
          onclick="window.closeBillModal()"
        >
          <div 
            class="w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-full transition-transform slide-in-from-bottom-4 ${e?"bg-gray-900":"bg-white"}"
            onclick="event.stopPropagation()"
          >
            <div class="bg-[#FF0000] p-10 text-white flex justify-between items-start shrink-0">
              <div>
                <span class="text-xs font-black uppercase tracking-[0.2em] text-white/60 mb-2 block">Invoice Details</span>
                <h2 class="text-5xl font-black">#${a.billNumber}</h2>
                <div class="mt-2 flex flex-col gap-1 text-white/80 font-bold">
                   <p>${p(a.timestamp)}</p>
                   ${a.cashierName?`<p class="flex items-center gap-2 text-xs opacity-75"><i data-lucide="user" class="w-3 h-3"></i> Cashier: ${a.cashierName}</p>`:""}
                </div>
              </div>
              <div class="flex flex-col items-end gap-3">
                <span class="bg-white text-[#FF0000] px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                  ${a.status}
                </span>
                <button onclick="window.closeBillModal()" class="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                  <i data-lucide="x" class="w-6 h-6"></i>
                </button>
              </div>
            </div>

            <div class="p-10 overflow-y-auto flex-1 space-y-10 styled-scrollbar">
              <div>
                <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Itemized Receipt</h4>
                <div class="space-y-4">
                  ${a.items.map(t=>`
                    <div class="flex justify-between items-center group">
                      <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center font-black text-[#FF0000] text-sm">
                          ${t.quantity}x
                        </div>
                        <span class="font-bold text-lg ${e?"text-gray-200":"text-gray-800"}">${t.name}</span>
                      </div>
                      <span class="font-black text-lg ${e?"text-white":"text-gray-900"}">
                        ${o.currency} ${t.price*t.quantity}
                      </span>
                    </div>
                  `).join("")}
                </div>
              </div>

              <div class="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <div class="flex justify-between items-center text-gray-400 font-bold">
                  <span class="uppercase tracking-widest text-xs">Payment Method</span>
                  <span class="text-sm flex items-center gap-2">
                    ${a.paymentMethod==="M-Pesa"?'<i data-lucide="smartphone" class="w-4 h-4 text-green-500"></i>':""}
                    ${a.paymentMethod}
                  </span>
                </div>
                ${a.mPesaRef?`
                  <div class="flex justify-between items-center text-gray-400 font-bold">
                    <span class="uppercase tracking-widest text-xs">M-Pesa Ref</span>
                    <span class="text-sm text-green-500">${a.mPesaRef}</span>
                  </div>
                `:""}
                <div class="flex justify-between items-end pt-4">
                  <span class="text-xl font-black ${e?"text-white":"text-black"}">Total Amount</span>
                  <span class="text-4xl font-black text-[#FF0000]">${o.currency} ${a.total.toFixed(2)}</span>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4 pt-4">
                <button class="py-4 rounded-2xl bg-[#FF0000] text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-red-500/20 hover:scale-[1.02] transition-transform">
                  <i data-lucide="printer" class="w-[18px] h-[18px]"></i> Print
                </button>
                <button class="py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] ${e?"bg-gray-800 text-white":"bg-gray-100 text-gray-900"}">
                  <i data-lucide="share-2" class="w-[18px] h-[18px]"></i> Share
                </button>
                ${r==="owner"?`
                  <button 
                    onclick="window.deleteBill('${a.id}')"
                    class="py-4 rounded-2xl bg-red-500/10 text-red-500 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
                  >
                    <i data-lucide="trash-2" class="w-[18px] h-[18px]"></i> Delete
                  </button>
                `:""}
              </div>
            </div>
          </div>
        </div>
      `:""}
    </div>
  `;document.getElementById("root").innerHTML=f(g,"/bills.html"),m(),setTimeout(()=>{y({icons:h}),w()},0)}function n(){x()}function w(){const e=document.getElementById("search-input");e&&(e.addEventListener("input",r=>{l=r.target.value,n()}),e.focus(),e.setSelectionRange(l.length,l.length))}window.setFilterStatus=e=>{c=e,n()};window.openBillModal=e=>{const r=s.bills.find(o=>o.id===e);r&&(a=r,n())};window.closeBillModal=()=>{a=null,n()};window.deleteBill=e=>{confirm("Are you sure you want to delete this bill?")&&(s.deleteBill(e),a=null,n())};s.subscribe(n);x();
