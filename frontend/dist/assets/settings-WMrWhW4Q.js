import{s as r,c as n,i as c}from"./lucide-BDXvBw8E.js";import{r as d,i as g}from"./Layout-T-bwAtME.js";function a(){const e=r.isDarkMode;if(r.userRole!=="owner")return document.getElementById("root").innerHTML=d(`
      <div class="flex flex-col items-center justify-center min-h-[50vh]">
        <i data-lucide="shield-alert" class="w-16 h-16 text-[#FF0000] mb-4 opacity-50"></i>
        <h2 class="text-2xl font-black ${e?"text-white":"text-gray-900"}">Access Denied</h2>
        <p class="text-gray-500 font-bold mt-2">Only owners can manage staff accounts.</p>
      </div>
    `,"/settings.html");const i=`
    <div class="h-[calc(100vh-80px)] -m-8 flex flex-col overflow-y-auto bg-gray-50/30 dark:bg-transparent p-8">
      <div class="max-w-4xl mx-auto w-full space-y-8">
        <!-- Header -->
        <div class="flex justify-between items-end">
          <div>
            <h2 class="text-3xl font-black tracking-tight ${e?"text-white":"text-gray-900"}">Staff Management</h2>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Create and manage cashier credentials</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Create Cashier Form -->
          <div class="lg:col-span-1 space-y-6">
            <form id="create-cashier-form" class="p-8 rounded-[40px] border shadow-sm space-y-6 flex flex-col ${e?"bg-gray-900 border-gray-800":"bg-white border-gray-100"}">
              <div>
                 <div class="w-12 h-12 bg-red-100 text-[#FF0000] dark:bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    <i data-lucide="user-plus" class="w-6 h-6"></i>
                 </div>
                 <h4 class="font-black text-xl tracking-tight mb-2 ${e?"text-white":"text-gray-900"}">New Cashier</h4>
                 <p class="text-xs font-bold text-gray-400">Provision a new login for a staff member.</p>
              </div>
              
              <div class="space-y-4 pt-4 border-t ${e?"border-gray-800":"border-gray-100"}">
                <div class="space-y-2">
                  <label class="text-[10px] items-center gap-1 font-black uppercase tracking-widest text-gray-400 ml-1">Username</label>
                  <div class="relative">
                    <i data-lucide="user" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                    <input 
                      id="newUsername"
                      required
                      placeholder="e.g. john"
                      class="w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-bold transition-all focus:ring-2 focus:ring-[#FF0000] focus:outline-none ${e?"bg-gray-800 text-white border-transparent":"bg-gray-50 text-gray-900 border-transparent"}"
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] items-center gap-1 font-black uppercase tracking-widest text-gray-400 ml-1">Security PIN (4 digits)</label>
                  <div class="relative">
                    <i data-lucide="lock" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                    <input 
                      id="newPin"
                      required
                      type="password"
                      placeholder="e.g. 5678"
                      class="w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-bold transition-all focus:ring-2 focus:ring-[#FF0000] focus:outline-none ${e?"bg-gray-800 text-white border-transparent":"bg-gray-50 text-gray-900 border-transparent"}"
                    />
                  </div>
                </div>
              </div>

              <div id="form-error" class="hidden text-xs font-bold text-[#FF0000] bg-red-50 dark:bg-red-500/10 p-3 rounded-xl"></div>

              <button 
                type="submit"
                class="w-full py-4 mt-auto rounded-[20px] bg-[#FF0000] text-white font-black uppercase tracking-widest shadow-xl shadow-red-500/30 hover:bg-red-600 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Create Cashier
              </button>
            </form>

          </div>

          <!-- Active Staff List -->
          <div class="lg:col-span-2">
            <div class="h-full rounded-[40px] border shadow-sm flex flex-col overflow-hidden ${e?"bg-gray-900 border-gray-800":"bg-white border-gray-100"}">
              <div class="p-8 border-b ${e?"border-gray-800":"border-gray-100"}">
                 <h4 class="font-black text-xl tracking-tight ${e?"text-white":"text-gray-900"}">Active Accounts</h4>
                 <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Manage system access</p>
              </div>
              <div class="overflow-y-auto flex-1 p-8 space-y-4 styled-scrollbar max-h-[500px]">
                ${r.users.map(t=>`
                  <div class="p-5 rounded-3xl border flex items-center justify-between transition-all hover:border-gray-300 dark:hover:border-gray-700 ${e?"bg-gray-950 border-gray-800":"bg-gray-50 border-gray-200"}">
                     <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black uppercase text-white shadow-md ${t.role==="owner"?"bg-blue-500":"bg-gray-400"}">
                          ${t.username[0]}
                        </div>
                        <div>
                          <p class="font-black text-lg ${e?"text-white":"text-gray-900"} capitalize">${t.username}</p>
                          <span class="inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${t.role==="owner"?"bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400":"bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}">
                            ${t.role}
                          </span>
                        </div>
                     </div>
                     
                     ${t.role!=="owner"?`
                       <button onclick="window.deleteUser('${t.id}')" class="p-3 bg-red-50 text-[#FF0000] hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-2xl transition-all shadow-sm" title="Delete Cashier">
                         <i data-lucide="trash-2" class="w-5 h-5"></i>
                       </button>
                     `:`
                       <div class="p-3 text-gray-300 dark:text-gray-700">
                         <i data-lucide="shield-check" class="w-5 h-5"></i>
                       </div>
                     `}
                  </div>
                `).join("")}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;document.getElementById("root").innerHTML=d(i,"/settings.html"),g(),setTimeout(()=>{n({icons:c}),u()},0)}function u(){const e=document.getElementById("create-cashier-form"),s=document.getElementById("form-error");e&&e.addEventListener("submit",i=>{i.preventDefault();const t=document.getElementById("newUsername").value.trim(),l=document.getElementById("newPin").value;if(!(!t||!l)){if(r.users.some(o=>o.username.toLowerCase()===t.toLowerCase())){s.textContent="A user with this username already exists.",s.classList.remove("hidden");return}r.addUser(t,l),a()}})}window.deleteUser=e=>{confirm("Are you sure you want to completely remove this cashier account? They will lose access immediately.")&&(r.deleteUser(e),a())};r.subscribe(a);a();
