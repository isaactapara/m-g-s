import{s as l,c as u,i as g}from"./lucide-BDXvBw8E.js";let r=!1;function c(){const e=l.isDarkMode,s=`
    <div class="flex items-center justify-center min-h-screen w-full transition-colors duration-300 p-6 ${e?"bg-gray-950":"bg-gray-100"}">
      <div class="w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden flex flex-col transition-colors duration-300 ${e?"bg-gray-950 border border-gray-800":"bg-white"}">
        <div class="p-12 flex flex-col items-center">
          <div class="w-20 h-20 bg-[#FF0000] rounded-[24px] text-white flex items-center justify-center mb-6 shadow-xl shadow-red-500/20">
            <i data-lucide="receipt-text" style="width: 40px; height: 40px; stroke-width: 2.5px;"></i>
          </div>
          
          <h1 class="text-3xl font-black mb-2 text-center tracking-tight">BRM <span class="text-[#FF0000]">System</span></h1>
          <p class="text-sm font-bold mb-10 text-center uppercase tracking-widest ${e?"text-gray-500":"text-gray-400"}">
            Restaurant Management Portal
          </p>

          <form id="login-form" class="w-full space-y-6">
            <div class="space-y-2">
              <label class="block text-xs font-black uppercase tracking-widest ml-1 ${e?"text-gray-500":"text-gray-400"}">
                Username
              </label>
              <div class="relative group">
                <i data-lucide="user" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF0000] transition-colors"></i>
                <input 
                  type="text" 
                  id="username"
                  placeholder="e.g. owner or cashier"
                  class="w-full pl-14 pr-5 py-5 rounded-2xl text-sm font-bold transition-all focus:ring-2 focus:ring-[#FF0000] focus:outline-none ${e?"bg-gray-900 border-transparent text-white":"bg-gray-50 border border-transparent text-gray-900 shadow-sm"}"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-xs font-black uppercase tracking-widest ml-1 ${e?"text-gray-500":"text-gray-400"}">
                Security PIN
              </label>
              <div class="relative group">
                <i data-lucide="lock" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF0000] transition-colors"></i>
                <input 
                  type="${r?"text":"password"}" 
                  id="password"
                  placeholder="••••"
                  class="w-full pl-14 pr-14 py-5 rounded-2xl text-sm font-bold transition-all focus:ring-2 focus:ring-[#FF0000] focus:outline-none ${e?"bg-gray-900 border-transparent text-white":"bg-gray-50 border border-transparent text-gray-900 shadow-sm"}"
                />
                <button 
                  type="button"
                  id="toggle-password"
                  class="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF0000] transition-colors"
                >
                  <i data-lucide="${r?"eye-off":"eye"}" class="w-5 h-5"></i>
                </button>
              </div>
            </div>

            <div id="error-message" class="hidden p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-[#FF0000] text-xs font-bold text-center">
            </div>

            <button
              type="submit"
              class="w-full mt-4 py-5 rounded-2xl bg-[#FF0000] text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-red-500/30 hover:bg-red-600 transition-all hover:-translate-y-1"
            >
              <i data-lucide="key-round" class="w-5 h-5"></i> Access Portal
            </button>
          </form>

          <!-- Demo Credentials Box -->
          <div class="mt-10 p-6 rounded-3xl w-full border border-dashed ${e?"bg-gray-900/50 border-gray-800":"bg-gray-50 border-gray-200"}">
            <p class="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-center text-gray-400">System Information</p>
            <p class="text-xs text-center font-bold ${e?"text-gray-400":"text-gray-500"}">Ask an owner/administrator to provision your cashier credentials if you cannot login.</p>
          </div>

        </div>
      </div>
    </div>
  `;document.getElementById("root").innerHTML=s,setTimeout(()=>{u({icons:g}),m()},0)}function m(){const e=document.getElementById("login-form"),s=document.getElementById("toggle-password"),d=document.getElementById("error-message");document.getElementById("username").value,document.getElementById("password").value,s.addEventListener("click",()=>{const a=document.getElementById("username"),o=document.getElementById("password"),n=a.value,t=o.value;r=!r,c(),setTimeout(()=>{document.getElementById("username").value=n,document.getElementById("password").value=t},10)}),e.addEventListener("submit",a=>{a.preventDefault();const o=document.getElementById("username").value.trim().toLowerCase(),n=document.getElementById("password").value,t=l.users.find(i=>i.username===o&&i.pin===n);t?(l.login(t),window.location.href="/"):(d.textContent="Invalid username or PIN. Please try again.",d.classList.remove("hidden"))})}c();
