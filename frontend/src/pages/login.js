import '../styles/index.css';
import { store } from '../core/store.js';
import { createIcons, icons } from 'lucide';

let showPassword = false;

function renderLogin() {
  const isDarkMode = store.isDarkMode;

  const html = `
    <div class="flex items-center justify-center min-h-screen w-full transition-colors duration-300 p-6 ${isDarkMode ? "bg-black" : "bg-gray-50"}">
      <div class="w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden flex flex-col transition-colors duration-300 ${isDarkMode ? "bg-gray-950 border border-gray-900" : "bg-white border border-gray-100"}">
        <div class="p-12 flex flex-col items-center">
          <div class="mb-8 relative flex justify-center w-full">
            <div class="absolute inset-0 bg-white/40 dark:bg-white/10 blur-[60px] rounded-full scale-150"></div>
            <img src="/brand-logo-v2.png" alt="M&G Logo" class="relative w-56 h-56 object-contain dark:drop-shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-transform hover:scale-105 duration-500" />
          </div>
          
          <div class="flex flex-col items-center select-none">
            <span class="text-[11px] font-black uppercase tracking-[1em] text-gray-400 dark:text-gray-500 mb-1 ml-[1em]">THE</span>
            <h1 class="text-8xl font-[900] text-[#FF0000] tracking-tighter leading-[0.85] mb-2 drop-shadow-sm">M&G's</h1>
            <div class="flex items-center gap-4 w-full">
              <div class="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
              <span class="text-[14px] font-black uppercase tracking-[0.6em] text-gray-900 dark:text-white whitespace-nowrap ml-[0.6em]">RESTAURANT</span>
              <div class="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
            </div>
          </div>

          <form id="login-form" class="w-full space-y-6">
            <div class="space-y-2">
              <label class="block text-xs font-black uppercase tracking-widest ml-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}">
                Username
              </label>
              <div class="relative group">
                <i data-lucide="user" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF0000] transition-colors"></i>
                <input 
                  type="text" 
                  id="username"
                  placeholder="Enter username"
                  class="w-full pl-14 pr-5 py-5 rounded-2xl text-sm font-bold transition-all focus:ring-2 focus:ring-[#FF0000] focus:outline-none ${isDarkMode ? "bg-gray-900 border-transparent text-white" : "bg-gray-100 border-transparent text-gray-900"}"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-xs font-black uppercase tracking-widest ml-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}">
                Security PIN
              </label>
              <div class="relative group">
                <i data-lucide="lock" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF0000] transition-colors"></i>
                <input 
                  type="${showPassword ? 'text' : 'password'}" 
                  id="password"
                  placeholder="Enter security PIN"
                  class="w-full pl-14 pr-14 py-5 rounded-2xl text-sm font-bold transition-all focus:ring-2 focus:ring-[#FF0000] focus:outline-none ${isDarkMode ? "bg-gray-900 border-transparent text-white" : "bg-gray-100 border-transparent text-gray-900"}"
                />
                <button 
                  type="button"
                  id="toggle-password"
                  class="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF0000] transition-colors"
                >
                  <i data-lucide="${showPassword ? 'eye-off' : 'eye'}" class="w-5 h-5"></i>
                </button>
              </div>
            </div>

            <div id="error-message" class="hidden p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-[#FF0000] text-xs font-bold text-center">
            </div>

            <button
              type="submit"
              class="w-full mt-6 py-5 rounded-2xl bg-[#FF0000] text-white font-black uppercase tracking-[0.2em] flex items-center justify-center shadow-xl shadow-red-500/30 hover:bg-red-600 transition-all hover:-translate-y-1 active:scale-95 text-sm"
            >
              LOG IN
            </button>
          </form>


        </div>
      </div>
    </div>
  `;

  document.getElementById('root').innerHTML = html;
  
  // Need a tiny delay for Lucide to process the new DOM
  setTimeout(() => {
    createIcons({ icons });
    attachListeners();
  }, 0);
}

function attachListeners() {
  const form = document.getElementById('login-form');
  const toggleBtn = document.getElementById('toggle-password');
  const errorDiv = document.getElementById('error-message');
  
  const originalUsername = document.getElementById('username').value;
  const originalPassword = document.getElementById('password').value;

  toggleBtn.addEventListener('click', () => {
    const unInput = document.getElementById('username');
    const pwInput = document.getElementById('password');
    // Save current values before re-rendering
    const currentUn = unInput.value;
    const currentPw = pwInput.value;
    
    showPassword = !showPassword;
    renderLogin();
    
    // Restore values
    setTimeout(() => {
      document.getElementById('username').value = currentUn;
      document.getElementById('password').value = currentPw;
    }, 10);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim().toLowerCase();
    const pin = document.getElementById('password').value;

    const result = await store.login(username, pin);
    
    if (result.success) {
      window.location.href = '/';
    } else {
      errorDiv.textContent = result.message || 'Invalid username or PIN. Please try again.';
      errorDiv.classList.remove('hidden');
    }
  });
}

// Initial render
renderLogin();
