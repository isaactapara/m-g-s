import '../styles/index.css';
import { store } from '../core/store.js';
import { renderLayout, initLayoutListeners } from '../components/Layout.js';
import { createIcons, icons } from 'lucide';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

let barChartInstance = null;
let timeframe = 'week';

window.setTimeframe = (val) => {
  timeframe = val;
  renderReports();
};

window.exportToPDF = async () => {
  const btn = document.getElementById('export-btn');
  const originalText = btn.innerHTML;
  
  btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> GENERATING...`;
  btn.classList.add('opacity-80', 'cursor-not-allowed');
  createIcons({ icons });

  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    const margins = 20;

    const loadLogo = () => new Promise((resolve) => {
      const img = new Image();
      img.src = '/brand-logo-v2.png';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
    });
    
    const logoImg = await loadLogo();
    if (logoImg) {
      doc.addImage(logoImg, 'PNG', margins, margins - 5, 25, 25);
    }
    
    // Header
    const titleX = logoImg ? margins + 35 : margins;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("THE", titleX, margins + 5);
    
    doc.setFontSize(28);
    doc.setTextColor(255, 0, 0);
    doc.text("M&G's", titleX, margins + 13);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("RESTAURANT ANALYTICS", titleX, margins + 19);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    const rangeText = timeframe === 'day' ? 'Today' : timeframe === 'week' ? 'Last 7 Days' : 'This Month';
    doc.text(`Timeframe: ${rangeText}   |   Generated: ${new Date().toLocaleString()}`, titleX, margins + 18);
    
    doc.setDrawColor(220, 220, 220);
    doc.line(margins, margins + 24, 210 - margins, margins + 24);
    
    // Fetch Metrics
    const chartInfo = getChartData();
    const totalSales = chartInfo.salesData.reduce((sum, val) => sum + val, 0);
    const todayBills = store.bills.filter(b => b.timestamp.toDateString() === new Date().toDateString());
    const latestBill = todayBills.length > 0 ? todayBills[0] : null;
    const activeCashier = latestBill ? latestBill.cashierName : 'System Idle';
    
    // Summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Executive Summary", margins, margins + 40);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Total Revenue (${rangeText}): KSH ${totalSales.toLocaleString()}`, margins, margins + 50);
    
    doc.setDrawColor(240, 240, 240);
    doc.line(margins, margins + 60, 210 - margins, margins + 60);
    
    // Breakdown
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Sales Breakdown Timeline", margins, margins + 75);
    
    let yPos = margins + 88;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    doc.setTextColor(100, 100, 100);
    doc.text("Period", margins, yPos);
    doc.text("Actual Volume", margins + 80, yPos);
    doc.setTextColor(0, 0, 0);
    
    yPos += 8;
    doc.setDrawColor(200, 200, 200);
    doc.line(margins, yPos, 210 - margins, yPos);
    yPos += 8;
    
    chartInfo.labels.forEach((label, i) => {
       const val = chartInfo.salesData[i];
       
       // Handle page overflow
       if (yPos > 270) {
           doc.addPage();
           yPos = margins + 10;
       }
       
       doc.text(`${label}`, margins, yPos);
       doc.setFont("helvetica", "bold");
       doc.text(`KSH ${val.toLocaleString()}`, margins + 80, yPos);
       doc.setFont("helvetica", "normal");
       
       yPos += 4;
       doc.setDrawColor(240, 240, 240);
       doc.line(margins, yPos, 210 - margins, yPos);
       yPos += 8;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Official M&G's Restaurant Report", margins, 285);
    
    doc.save(`MandGs-Analytics-${timeframe}-${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('PDF Native Generation Failed:', error);
    btn.innerHTML = `<i data-lucide="alert-circle" class="w-4 h-4"></i> EXPORT FAILED`;
    setTimeout(() => {
       btn.innerHTML = originalText;
       createIcons({ icons });
    }, 3000);
  } finally {
    btn.innerHTML = originalText;
    btn.classList.remove('opacity-80', 'cursor-not-allowed');
    createIcons({ icons });
  }
};

function getChartData() {
  const bills = store.bills || [];
  const now = new Date();
  let labels = [];
  let salesData = [];
  
  if (timeframe === 'day') {
    labels = Array.from({length: 12}, (_, i) => `${(i*2).toString().padStart(2, '0')}:00`);
    salesData = new Array(12).fill(0);
    bills.forEach(b => {
      const bDate = new Date(b.timestamp);
      if (bDate.toDateString() === now.toDateString()) {
        const hourIndex = Math.floor(bDate.getHours() / 2);
        salesData[hourIndex] += b.total;
      }
    });
  } else if (timeframe === 'week') {
    labels = [];
    salesData = new Array(7).fill(0);
    for(let i=6; i>=0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString('en-US', {weekday: 'short'}));
    }
    bills.forEach(b => {
      const bDate = new Date(b.timestamp);
      const diffDays = Math.floor((now - bDate) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        salesData[6 - diffDays] += b.total;
      }
    });
  } else if (timeframe === 'month') {
    labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    salesData = new Array(4).fill(0);
    bills.forEach(b => {
      const bDate = new Date(b.timestamp);
      const diffDays = Math.floor((now - bDate) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 28) {
        const weekIndex = 3 - Math.floor(diffDays / 7);
        salesData[weekIndex] += b.total;
      }
    });
  }
  return { labels, salesData };
}

function renderReports() {
  const isDarkMode = store.isDarkMode;
  const settings = store.settings;
  const chartInfo = getChartData();
  const totalSales = chartInfo.salesData.reduce((sum, val) => sum + val, 0);

  const driftCount = store.bills.filter(b => {
    if (b.status !== 'PENDING' || !b.checkoutRequestId) return false;
    const ageMs = Date.now() - new Date(b.updatedAt).getTime();
    return ageMs > (10 * 60 * 1000); // >10m
  }).length;

  const activeUser = store.currentUser ? store.currentUser.username : 'Offline';

  const stats = [
    { label: 'Total Sales', value: `${settings.currency} ${totalSales.toLocaleString()}`, icon: 'dollar-sign', growth: '+12.5%', positive: true },
    { label: 'Active User', value: activeUser, icon: 'user', growth: 'Online Now', positive: true },
    { label: 'M-Pesa Reconciliation Drift', value: `${driftCount}`, icon: 'alert-triangle', growth: driftCount > 0 ? 'Immediate Action' : 'Good', positive: driftCount === 0 }
  ];

  const html = `
    <!-- Wrapper with ID for PDF Exporting -->
    <div id="report-container" class="lg:h-[calc(100vh-80px)] flex-1 flex flex-col pt-4 md:pt-0 overflow-hidden bg-gray-50/10 dark:bg-black p-4 md:p-8 space-y-6 md:space-y-8 relative">
      
      <!-- Header -->
      <div class="flex flex-col items-center select-none w-full border-b ${isDarkMode ? "border-gray-800" : "border-gray-100"} pb-6">
        <span class="text-[9px] font-black uppercase tracking-[0.8em] text-gray-400 dark:text-gray-500 mb-1 ml-[0.8em]">THE</span>
        <h2 class="text-5xl font-black text-[#FF0000] tracking-tighter leading-[0.85] mb-2 drop-shadow-sm">M&G's</h2>
        <div class="flex items-center gap-4 w-full px-12">
          <div class="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
          <span class="text-[12px] font-black uppercase tracking-[0.6em] text-gray-900 dark:text-white whitespace-nowrap ml-[0.6em]">RESTAURANT</span>
          <div class="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
        </div>
      </div>
        <div class="flex flex-wrap items-center gap-2 md:gap-3 w-full sm:w-auto">
          <div class="relative flex-1 sm:flex-none flex items-center ${isDarkMode ? "bg-black dark:bg-black text-[#FF0000] shadow-sm border dark:border-gray-900" : "bg-white"} rounded-2xl shadow-sm px-4 transition-all hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer">
             <i data-lucide="calendar" class="w-4 h-4 text-[#FF0000] absolute left-4 pointer-events-none"></i>
             <select 
               onchange="window.setTimeframe(this.value)"
               class="pl-8 py-3 pr-8 bg-transparent text-xs font-black uppercase tracking-widest text-[#FF0000] outline-none cursor-pointer w-full appearance-none"
             >
               <option class="text-gray-900 dark:text-gray-900" value="day" ${timeframe === 'day' ? 'selected' : ''}>Today</option>
               <option class="text-gray-900 dark:text-gray-900" value="week" ${timeframe === 'week' ? 'selected' : ''}>Last 7 Days</option>
               <option class="text-gray-900 dark:text-gray-900" value="month" ${timeframe === 'month' ? 'selected' : ''}>This Month</option>
             </select>
             <i data-lucide="chevron-down" class="w-4 h-4 text-[#FF0000] pointer-events-none absolute right-4"></i>
          </div>
          <button id="export-btn" onclick="window.exportToPDF()" class="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 py-3 bg-[#FF0000] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all hover:-translate-y-0.5 whitespace-nowrap">
            <i data-lucide="download" class="w-4 h-4"></i> Export
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        ${stats.map((stat, idx) => `
          <div class="p-6 md:p-8 rounded-[2rem] md:rounded-[32px] border shadow-sm flex flex-col justify-between animate-in slide-in-from-bottom cascade-${idx} ${isDarkMode ? "bg-black border-gray-900" : "bg-white border-gray-100"} relative overflow-hidden">
            <div class="absolute -right-6 -top-6 w-24 h-24 bg-red-50 dark:bg-red-500/5 rounded-full z-0 pointer-events-none"></div>
            <div class="relative z-10 flex justify-between items-start mb-6">
              <div class="p-4 rounded-2xl bg-red-100 text-[#FF0000] dark:bg-red-500/20 shadow-inner">
                <i data-lucide="${stat.icon}" class="w-6 h-6"></i>
              </div>
              <div class="flex items-center px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-[10px] md:text-xs font-black ${stat.positive ? "text-green-500" : "text-red-500"} border border-green-100 dark:border-green-900/50">
                <i data-lucide="${stat.positive ? 'arrow-up-right' : 'arrow-down-right'}" class="w-3 h-3 mr-1"></i>
                ${stat.growth}
              </div>
            </div>
            <div class="relative z-10">
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">${store.sanitize(stat.label)}</p>
              <h3 class="text-3xl md:text-4xl font-black tracking-tight flex items-baseline gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}">
                ${store.sanitize(stat.value)}
              </h3>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Charts Section -->
      <div class="w-full pb-8 md:pb-10 flex-1 flex flex-col">
        <div class="w-full p-6 md:p-8 rounded-[2rem] md:rounded-[40px] border shadow-sm flex-1 flex flex-col ${isDarkMode ? "bg-black border-gray-900" : "bg-white border-gray-100"}">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 md:mb-8">
            <div>
               <h4 class="font-black text-lg md:text-xl ${isDarkMode ? "text-white" : "text-gray-900"} tracking-tight">Sales Barcode</h4>
               <p class="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Real-time revenue flow</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-400">
                <div class="w-3 h-3 rounded-md bg-[#FF0000]"></div> Actual Volume
              </div>
            </div>
          </div>
          <div class="flex-1 w-full min-h-[300px] md:min-h-[400px] relative">
            <canvas id="barChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('root').innerHTML = renderLayout(html, '/reports.html');
  initLayoutListeners();
  
  setTimeout(() => {
    createIcons({ icons });
    initCharts(isDarkMode, chartInfo);
  }, 0);
}

function initCharts(isDarkMode, chartInfo) {
  const textColor = isDarkMode ? '#fff' : '#111';
  const gridColor = isDarkMode ? '#222' : '#f0f0f0';

  const barCtx = document.getElementById('barChart');
  if (barCtx) {
    if (barChartInstance) barChartInstance.destroy();
    barChartInstance = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: chartInfo.labels,
        datasets: [{
          label: 'Revenue',
          data: chartInfo.salesData,
          backgroundColor: '#FF0000',
          borderRadius: 4,
          barPercentage: 0.6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false, drawBorder: false },
            ticks: { color: isDarkMode ? '#888' : '#aaa', font: { weight: 'bold' } }
          },
          y: {
            grid: { color: gridColor, drawBorder: false, borderDash: [5, 5] },
            ticks: { 
              color: isDarkMode ? '#888' : '#aaa',
              font: { weight: 'bold' },
              beginAtZero: true,
              callback: function(value) {
                 return value >= 1000 ? (value / 1000) + 'k' : value;
              }
            }
          }
        }
      }
    });
  }
}

store.subscribe(renderReports);
renderReports();
