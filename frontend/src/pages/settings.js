import '../styles/index.css';
import { store } from '../core/store.js';
import { renderLayout, initLayoutListeners } from '../components/Layout.js';
import { createIcons, icons } from 'lucide';

function renderSettings() {
  const isDarkMode = store.isDarkMode;
  const userRole = store.userRole;
  const settings = store.settings;

  if (userRole !== 'owner') {
    return document.getElementById('root').innerHTML = renderLayout(`
      <div class="flex flex-col items-center justify-center min-h-[50vh]">
        <i data-lucide="shield-alert" class="w-16 h-16 text-[#FF0000] mb-4 opacity-50"></i>
        <h2 class="text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}">Access Denied</h2>
        <p class="text-gray-500 font-bold mt-2">Only owners can manage staff accounts.</p>
      </div>
    `, '/settings.html');
  }

  const html = `
    <div class="h-[calc(100vh-80px)] -m-4 md:-m-8 flex flex-col overflow-y-auto bg-gray-50/30 dark:bg-transparent p-4 md:p-8">
      <div class="max-w-4xl mx-auto w-full space-y-8">
        <!-- Header -->
        <div class="flex flex-col items-center select-none w-full border-b ${isDarkMode ? "border-gray-800" : "border-gray-100"} pb-8">
          <span class="text-[10px] font-black uppercase tracking-[0.8em] text-gray-400 dark:text-gray-500 mb-1 ml-[0.8em]">THE</span>
          <h1 class="text-6xl font-[900] text-[#FF0000] tracking-tighter leading-[0.85] mb-2 drop-shadow-sm">${store.sanitize(settings.restaurantName)}</h1>
          <span class="text-[12px] font-black uppercase tracking-[0.5em] text-gray-900 dark:text-white ml-[0.5em]">RESTAURANT</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Create Cashier Form -->
          <div class="lg:col-span-1 space-y-6">
            <form id="create-cashier-form" class="h-full p-8 rounded-[40px] border shadow-sm space-y-6 flex flex-col ${isDarkMode ? "bg-gray-950 border-gray-900" : "bg-white border-gray-100"}">
              <div>
                 <div class="w-12 h-12 bg-red-100 text-[#FF0000] dark:bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    <i data-lucide="user-plus" class="w-6 h-6"></i>
                 </div>
                 <h4 class="font-black text-xl tracking-tight mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}">New Cashier</h4>
                 <p class="text-xs font-bold text-gray-400">Provision a new login for a staff member.</p>
              </div>
              
              <div class="space-y-4 pt-4 border-t ${isDarkMode ? "border-gray-800" : "border-gray-100"}">
                <div class="space-y-2">
                  <label class="text-[10px] items-center gap-1 font-black uppercase tracking-widest text-gray-400 ml-1">Username</label>
                  <div class="relative">
                    <i data-lucide="user" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                    <input 
                      id="newUsername"
                      required
                      placeholder="e.g. john"
                      class="w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-bold transition-all focus:ring-2 focus:ring-[#FF0000] focus:outline-none ${isDarkMode ? "bg-black text-white border border-gray-900" : "bg-gray-50 text-gray-900 border-transparent"}"
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
                      class="w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-bold transition-all focus:ring-2 focus:ring-[#FF0000] focus:outline-none ${isDarkMode ? "bg-black text-white border border-gray-900" : "bg-gray-50 text-gray-900 border-transparent"}"
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
            <div class="h-full rounded-[40px] border shadow-sm flex flex-col overflow-hidden ${isDarkMode ? "bg-gray-950 border-gray-900" : "bg-white border-gray-100"}">
              <div class="p-8 border-b ${isDarkMode ? "border-gray-800" : "border-gray-100"}">
                 <h4 class="font-black text-xl tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}">Active Accounts</h4>
                 <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Manage system access</p>
              </div>
              <div class="overflow-y-auto flex-1 p-8 space-y-4 styled-scrollbar max-h-[500px]">
                ${store.users.map(u => `
                  <div class="p-5 rounded-3xl border flex items-center justify-between transition-all hover:border-gray-300 dark:hover:border-gray-700 ${isDarkMode ? "bg-black border-gray-900" : "bg-gray-50 border-gray-200"}">
                     <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black uppercase text-white shadow-md ${u.role === 'owner' ? "bg-blue-500" : "bg-gray-400"}">
                          ${u.username[0]}
                        </div>
                        <div>
                          <p class="font-black text-lg ${isDarkMode ? "text-white" : "text-gray-900"} capitalize">${u.username}</p>
                          <span class="inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            u.role === 'owner' 
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" 
                              : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          }">
                            ${u.role}
                          </span>
                        </div>
                     </div>
                     
                     ${u.role !== 'owner' ? `
                       <button onclick="window.deleteUser('${u.id}')" class="p-3 bg-red-50 text-[#FF0000] hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-2xl transition-all shadow-sm" title="Delete Cashier">
                         <i data-lucide="trash-2" class="w-5 h-5"></i>
                       </button>
                     ` : `
                       <div class="p-3 text-gray-300 dark:text-gray-700">
                         <i data-lucide="shield-check" class="w-5 h-5"></i>
                       </div>
                     `}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  document.getElementById('root').innerHTML = renderLayout(html, '/settings.html');
  initLayoutListeners();

  setTimeout(() => {
    createIcons({ icons });
    attachListeners();
  }, 0);
}

function attachListeners() {
  const form = document.getElementById('create-cashier-form');
  const errorDiv = document.getElementById('form-error');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('newUsername').value.trim();
      const pin = document.getElementById('newPin').value;

      if (!username || !pin) return;

      if (store.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        errorDiv.textContent = "A user with this username already exists.";
        errorDiv.classList.remove('hidden');
        return;
      }

      const btn = e.submitter;
      const originalText = btn.innerHTML;
      btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> CREATING...`;
      btn.disabled = true;
      createIcons({ icons });

      store.addUser(username, pin).then((res) => {
        if (!res.success) {
          errorDiv.textContent = res.message;
          errorDiv.classList.remove('hidden');
        } else {
          errorDiv.classList.add('hidden');
          document.getElementById('newUsername').value = '';
          document.getElementById('newPin').value = '';
        }

        setTimeout(() => {
           btn.innerHTML = originalText;
           btn.disabled = false;
           createIcons({ icons });
           renderSettings();
        }, 500);
      });
    });
  }
}

window.deleteUser = (id) => {
  store.deleteUser(id);
  renderSettings();
};

store.subscribe(renderSettings);
renderSettings();
