import{s as a,c as k,i as $}from"./lucide-BDXvBw8E.js";import{r as F,i as M}from"./Layout-T-bwAtME.js";let d="",x="All",u=!1,c=null,w="M-Pesa",y="idle",o={name:"",price:"",category:"Mains"};function f(){const e=a.isDarkMode,r=a.userRole,s=a.settings,i=a.cart,p=a.menu.filter(t=>{const n=t.name.toLowerCase().includes(d.toLowerCase())||t.category.toLowerCase().includes(d.toLowerCase()),g=x==="All"||t.category===x;return n&&g}),b=i.reduce((t,n)=>t+n.price*n.quantity,0),h=i.reduce((t,n)=>t+n.quantity,0),m=`
    <div class="h-[calc(100vh-80px)] -m-8 flex flex-col xl:flex-row overflow-hidden relative">
      
      <!-- Main Content Area (Menu Grid) -->
      <div class="flex-1 flex flex-col overflow-hidden bg-gray-50/50 dark:bg-transparent relative">
        <!-- Search & Actions Header -->
        <div class="p-6 border-b flex flex-wrap gap-4 items-center justify-between sticky top-0 z-10 backdrop-blur-md ${e?"bg-gray-950/80 border-gray-800":"bg-white/80 border-gray-200"}">
          <div class="flex items-center gap-4 flex-1 min-w-[300px]">
            <div class="relative flex-1 max-w-md">
              <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
              <input 
                type="text" 
                id="search-input"
                placeholder="Find dishes, drinks, appetizers..."
                value="${d}"
                class="w-full pl-12 pr-4 py-3 rounded-2xl text-sm font-medium transition-all focus:ring-2 focus:ring-[#FF0000] focus:outline-none ${e?"bg-gray-900 text-white border-transparent":"bg-gray-100 text-gray-900 border-transparent shadow-sm"}"
              />
            </div>
            
            <div class="flex flex-wrap gap-2">
              ${["All","Mains","Sides","Drinks"].map(t=>`
                <button onclick="window.setCategory('${t}')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${x===t?"bg-[#FF0000] text-white shadow-lg shadow-red-500/20":"bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"}">
                  ${t}
                </button>
              `).join("")}
            </div>
          </div>

          ${r==="owner"?`
            <button 
              onclick="window.openAddItemModal()"
              class="px-6 py-3 bg-[#FF0000] text-white rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-red-500/30 active:scale-95 transition-all"
            >
              <i data-lucide="plus-circle" class="w-5 h-5"></i>
              Add New Item
            </button>
          `:""}
        </div>

        <!-- Menu Grid -->
        <div class="p-6 overflow-y-auto flex-1 h-full pb-24">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            ${p.map(t=>{const n=i.find(v=>v.id===t.id),g=(n==null?void 0:n.quantity)||0;return`
                <div class="rounded-[28px] p-6 flex flex-col justify-between shadow-xl border-2 transition-all relative group cursor-pointer ${g>0?"border-[#FF0000] "+(e?"bg-gray-900":"bg-red-50/20"):"border-transparent hover:border-gray-300 dark:hover:border-gray-700 "+(e?"bg-gray-900":"bg-white")}" onclick="window.handleAdd('${t.id}')">
                  
                  ${r==="owner"?`
                    <div class="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onclick="window.openEditModal('${t.id}'); event.stopPropagation();"
                        class="p-2 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600"
                      >
                        <i data-lucide="edit-2" class="w-[14px] h-[14px]"></i>
                      </button>
                      <button 
                        onclick="window.deleteItem('${t.id}'); event.stopPropagation();"
                        class="p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600"
                      >
                        <i data-lucide="trash-2" class="w-[14px] h-[14px]"></i>
                      </button>
                    </div>
                  `:""}

                  <div class="space-y-4 relative z-10 pointer-events-none">
                    <div class="flex justify-between items-start">
                      <div class="space-y-1">
                        <span class="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-[10px] font-black uppercase tracking-widest text-[#FF0000] rounded-full">
                          ${t.category}
                        </span>
                        <h3 class="font-black text-lg leading-tight mt-2 ${e?"text-white":"text-gray-900"}">
                          ${t.name}
                        </h3>
                      </div>
                      <div class="text-right">
                        <p class="text-xl font-black text-[#FF0000]">${s.currency} ${t.price}</p>
                      </div>
                    </div>
                  </div>

                  <div class="mt-8 flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-2xl p-2 relative z-10">
                     ${g>0?`
                        <div class="flex items-center gap-3 w-full justify-between" onclick="event.stopPropagation()">
                          <button 
                            onclick="window.handleRemove('${t.id}')"
                            class="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-700 border dark:border-gray-600 shadow-sm text-[#FF0000] active:scale-90 transition-transform"
                          >
                            <i data-lucide="minus" class="w-[18px] h-[18px]"></i>
                          </button>
                          <span class="font-black text-lg w-8 text-center ${e?"text-white":"text-gray-900"}">
                            ${g}
                          </span>
                          <button 
                            onclick="window.handleAdd('${t.id}')"
                            class="w-10 h-10 flex items-center justify-center rounded-xl bg-[#FF0000] text-white shadow-lg shadow-red-500/20 active:scale-90 transition-transform"
                          >
                            <i data-lucide="plus" class="w-[18px] h-[18px]"></i>
                          </button>
                        </div>
                     `:`
                       <div class="w-full py-3 flex items-center justify-center gap-2 rounded-xl font-black text-sm transition-all bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-[#FF0000] hover:text-white pointer-events-none">
                         <i data-lucide="plus" class="w-[18px] h-[18px]"></i> Add to Order
                       </div>
                     `}
                  </div>
                </div>
              `}).join("")}
          </div>
        </div>
      </div>

      <!-- Checkout Sidebar (Right Side) -->
      <div class="w-full xl:w-[450px] border-l flex flex-col p-8 h-full shadow-2xl z-20 ${e?"bg-gray-900/90 border-gray-800":"bg-white border-gray-200"}">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-[#FF0000] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
              <i data-lucide="shopping-cart" class="w-6 h-6"></i>
            </div>
            <div>
               <h2 class="text-2xl font-black ${e?"text-white":"text-gray-900"}">Current Order</h2>
               <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">${h} items selected</p>
            </div>
          </div>
          <button onclick="window.clearCart()" class="text-xs font-bold text-gray-400 hover:text-[#FF0000] tracking-widest uppercase transition-colors">
            Clear
          </button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-4 mb-8 styled-scrollbar pr-2">
          ${i.length===0?`
            <div class="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 opacity-50">
              <i data-lucide="shopping-bag" class="w-16 h-16 stroke-1"></i>
              <p class="font-bold text-sm tracking-widest uppercase">Cart is empty</p>
            </div>
          `:i.map(t=>`
              <div class="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-800/50 relative group">
                <div class="w-12 h-12 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center font-black text-[#FF0000] shadow-sm">
                  ${t.quantity}x
                </div>
                <div class="flex-1">
                  <p class="font-bold text-sm leading-tight ${e?"text-gray-200":"text-gray-800"}">${t.name}</p>
                  <p class="text-xs text-gray-400 font-bold mt-1">${s.currency} ${t.price}</p>
                </div>
                <div class="text-right">
                  <p class="font-black ${e?"text-white":"text-gray-900"}">${s.currency} ${t.price*t.quantity}</p>
                </div>
                <button 
                  onclick="window.handleRemove('${t.id}')"
                  class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 text-red-500 border border-red-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white dark:bg-red-900/50 dark:border-red-500/30"
                >
                  <i data-lucide="x" class="w-3 h-3"></i>
                </button>
              </div>
          `).join("")}
        </div>

        ${i.length>0?`
          <div class="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div class="flex justify-between items-end">
              <span class="font-black text-xl text-gray-500 uppercase tracking-widest">Total</span>
              <span class="text-4xl font-black text-[#FF0000]">${s.currency} ${b}</span>
            </div>

            <!-- Payment Methods -->
            <div class="flex gap-2 p-1.5 rounded-2xl bg-gray-100 dark:bg-gray-800">
              ${["M-Pesa","Cash"].map(t=>`
                <button onclick="window.setPayment('${t}')" class="flex-1 py-3 rounded-xl text-sm font-bold transition-all ${w===t?"bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white":"text-gray-500 hover:text-gray-700 dark:text-gray-400"}">
                  ${t}
                </button>
              `).join("")}
            </div>

            <div class="grid grid-cols-2 gap-3">
              <button 
                onclick="window.submitOrder('PENDING')"
                class="py-4 rounded-2xl font-black transition-all flex flex-col items-center justify-center gap-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-2 border-transparent hover:border-amber-500/30"
              >
                <i data-lucide="clock" class="w-6 h-6 mb-1"></i> PAY LATER
              </button>
              <button 
                onclick="window.submitOrder('PAID')"
                class="py-4 rounded-2xl font-black text-white flex flex-col items-center justify-center gap-1 transition-all shadow-xl hover:-translate-y-1 ${y==="success"?"bg-green-500 shadow-green-500/40":"bg-[#FF0000] shadow-red-500/40 hover:bg-red-600"}"
              >
                ${y==="success"?'<i data-lucide="check-circle-2" class="w-6 h-6 mb-1"></i> PAID':'<i data-lucide="banknote" class="w-6 h-6 mb-1"></i> PAY NOW'}
              </button>
            </div>
          </div>
        `:""}
      </div>

      <!-- Add/Edit Overlay Drawer -->
      ${u?`
        <div 
          class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity animate-in fade-in"
          onclick="window.closeAddItemModal()"
        ></div>
        <div class="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 shadow-2xl p-8 flex flex-col transition-transform slide-in-from-right animate-in ${e?"bg-gray-900":"bg-white"}">
          <div class="flex justify-between items-center mb-10">
            <h2 class="text-2xl font-black ${e?"text-white":"text-gray-900"}">
              ${c?"Edit Dish":"New Dish"}
            </h2>
            <button onclick="window.closeAddItemModal()" class="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500">
              <i data-lucide="x" class="w-6 h-6"></i>
            </button>
          </div>

          <form id="add-item-form" class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Dish Name</label>
              <input 
                id="form-name"
                required
                value="${o.name}"
                class="w-full p-4 rounded-2xl font-bold transition-all focus:ring-2 focus:ring-[#FF0000] focus:outline-none ${e?"bg-gray-800 text-white border-transparent":"bg-gray-50 text-gray-900 border-transparent"}"
                placeholder="e.g. Masala Chips"
              />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (${s.currency})</label>
              <input 
                type="number"
                id="form-price"
                required min="1"
                value="${o.price}"
                class="w-full p-4 rounded-2xl font-black transition-all focus:ring-2 focus:ring-[#FF0000] focus:outline-none ${e?"bg-gray-800 text-white border-transparent":"bg-gray-50 text-gray-900 border-transparent"}"
              />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
              <select
                id="form-category"
                required
                class="w-full p-4 rounded-2xl font-bold transition-all focus:ring-2 focus:ring-[#FF0000] focus:outline-none ${e?"bg-gray-800 text-white border-transparent":"bg-gray-50 text-gray-900 border-transparent"}"
              >
                <option value="Mains" ${o.category==="Mains"?"selected":""}>Main Courses</option>
                <option value="Sides" ${o.category==="Sides"?"selected":""}>Side Dishes</option>
                <option value="Staples" ${o.category==="Staples"?"selected":""}>Staples</option>
                <option value="Vegetables" ${o.category==="Vegetables"?"selected":""}>Vegetables</option>
                <option value="Drinks" ${o.category==="Drinks"?"selected":""}>Drinks</option>
              </select>
            </div>

            <button
              type="submit"
              class="w-full mt-10 py-5 rounded-[24px] bg-[#FF0000] text-white font-black uppercase tracking-widest shadow-xl shadow-red-500/30 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
            >
              <i data-lucide="check-circle-2" class="w-5 h-5"></i> Save Changes
            </button>
          </form>
        </div>
      `:""}

    </div>
  `;document.getElementById("root").innerHTML=F(m,"/menu.html"),M(),setTimeout(()=>{k({icons:$}),I()},0)}function l(){f()}function I(){const e=document.getElementById("search-input");e&&(e.addEventListener("input",s=>{d=s.target.value,l()}),e.focus(),e.setSelectionRange(d.length,d.length));const r=document.getElementById("add-item-form");r&&r.addEventListener("submit",s=>{s.preventDefault();const i=document.getElementById("form-name").value,p=Number(document.getElementById("form-price").value),b=document.getElementById("form-category").value;c?a.updateMenuItem(c,{name:i,price:p,category:b}):a.addMenuItem({name:i,price:p,category:b}),u=!1,c=null,l()})}window.setCategory=e=>{d="",x=e,l()};window.handleAdd=e=>{const r=a.menu.find(s=>s.id===e);r&&a.addToCart(r)};window.handleRemove=e=>{a.removeFromCart(e)};window.clearCart=()=>{a.clearCart()};window.setPayment=e=>{w=e,l()};window.submitOrder=(e="PAID")=>{if(a.cart.length===0)return;const r=a.cart.reduce((s,i)=>s+i.price*i.quantity,0);a.createBill({items:[...a.cart],total:r,status:e,paymentMethod:w}),e==="PAID"?(y="success",l(),setTimeout(()=>{y="idle",l()},2e3)):alert("Bill marked as PENDING!"),a.clearCart()};window.openAddItemModal=()=>{c=null,o={name:"",price:"",category:"Mains"},u=!0,l()};window.openEditModal=e=>{const r=a.menu.find(s=>s.id===e);r&&(c=r.id,o={name:r.name,price:r.price,category:r.category},u=!0,l())};window.deleteItem=e=>{confirm("Are you sure you want to delete this menu item?")&&(a.deleteMenuItem(e),l())};window.closeAddItemModal=()=>{u=!1,l()};a.subscribe(l);f();
