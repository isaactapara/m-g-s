const API_BASE_URL = 'http://localhost:5000/api';

// Persistence Helpers
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const load = (key, defaultVal) => {
  const stored = localStorage.getItem(key);
  try {
    return stored ? JSON.parse(stored) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

class Store {
  constructor() {
    this.subscribers = [];
    
    // State initialization from localStorage
    this._isDarkMode = load('isDarkMode', false);
    this._isSidebarCollapsed = load('isSidebarCollapsed', false);
    this._currentUser = load('currentUser', null);
    this._userRole = load('userRole', null);
    this._settings = load('settings', { restaurantName: "M&G's", currency: "KSH" });
    this._tables = load('tables', [
      { id: '1', name: 'Table 1', status: 'FREE', position: { x: 50, y: 150 } },
      { id: '2', name: 'Table 2', status: 'FREE', position: { x: 200, y: 150 } },
      { id: '3', name: 'Table 3', status: 'FREE', position: { x: 350, y: 150 } }
    ]);

    // Memory-only state
    this._menu = [];
    this._bills = [];
    this._cart = [];
    this._users = [];
    this._isPaymentProcessing = false;
    this.pollingIntervals = {};

    // Polling starts immediately for responsiveness
    this.fetchInitialData();
  }

  // Getters & Setters
  get isDarkMode() { return this._isDarkMode; }
  set isDarkMode(v) { this._isDarkMode = v; save('isDarkMode', v); this.notify(); }

  get isSidebarCollapsed() { return this._isSidebarCollapsed; }
  set isSidebarCollapsed(v) { this._isSidebarCollapsed = v; save('isSidebarCollapsed', v); this.notify(); }

  get currentUser() { return this._currentUser; }
  get userRole() { return this._userRole; }
  get settings() { return this._settings; }
  get tables() { return this._tables; }
  set tables(v) { this._tables = v; save('tables', v); this.notify(); }

  get menu() { return this._menu; }
  get bills() { return this._bills; }
  get cart() { return this._cart; }
  get users() { return this._users; }
  get isPaymentProcessing() { return this._isPaymentProcessing; }
  set isPaymentProcessing(v) { this._isPaymentProcessing = v; this.notify(); }

  // Observable Pattern
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => this.subscribers = this.subscribers.filter(cb => cb !== callback);
  }

  notify() {
    this.subscribers.forEach(cb => cb(this));
  }

  // Helpers
  sanitize(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this._currentUser?.token) {
      headers['Authorization'] = `Bearer ${this._currentUser.token}`;
    }
    return headers;
  }

  async request(path, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: { ...this.getHeaders(), ...options.headers }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { response: { data: errorData, status: response.status } };
      }
      return await response.json();
    } catch (err) {
      throw err;
    }
  }

  // Data Normalization Helpers
  normalizeBill(bill) {
    return {
      ...bill,
      id: bill._id || bill.id,
      timestamp: new Date(bill.createdAt || bill.timestamp || Date.now())
    };
  }

  normalizeMenu(menuItems) {
    return menuItems.map(item => ({
      ...item,
      id: item._id || item.id
    }));
  }

  // Core Actions
  async fetchInitialData() {
    try {
      const [menuData, billsData, usersData] = await Promise.all([
        this.request('/menu'),
        this.request('/bills'),
        this._userRole === 'owner' ? this.request('/auth/users').catch(() => []) : Promise.resolve([])
      ]);
      this._menu = this.normalizeMenu(menuData);
      this._bills = billsData.map(b => this.normalizeBill(b));
      this._users = usersData.map(u => ({ ...u, id: u._id || u.id }));
      this.notify();
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  toggleSidebarCollapse() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  async login(username, pin) {
    try {
      const data = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, pin })
      });
      this._currentUser = data; // Expected { token, id, username, role }
      this._userRole = data.role;
      save('currentUser', this._currentUser);
      save('userRole', this._userRole);
      await this.fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  }

  logout() {
    this._currentUser = null;
    this._userRole = null;
    save('currentUser', null);
    save('userRole', null);
    window.location.href = '/login.html';
  }

  // Cart Management
  addToCart(item) {
    const existing = this._cart.find(i => i.id === item.id || i._id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this._cart.push({ ...item, quantity: 1, id: item.id || item._id });
    }
    this.notify();
  }

  removeFromCart(itemId) {
    const index = this._cart.findIndex(i => i.id === itemId || i._id === itemId);
    if (index > -1) {
      if (this._cart[index].quantity > 1) {
        this._cart[index].quantity -= 1;
      } else {
        this._cart.splice(index, 1);
      }
    }
    this.notify();
  }

  clearCart() {
    this._cart = [];
    this.notify();
  }

  // Menu Management
  async addMenuItem(itemData) {
    try {
      const data = await this.request('/menu', {
        method: 'POST',
        body: JSON.stringify(itemData)
      });
      this._menu.push(data);
      this.notify();
      return data;
    } catch (err) {
      console.error('Add Menu Item Error:', err);
      throw err;
    }
  }

  async updateMenuItem(id, itemData) {
    try {
      const data = await this.request(`/menu/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(itemData)
      });
      const idx = this._menu.findIndex(m => m._id === id || m.id === id);
      if (idx > -1) this._menu[idx] = data;
      this.notify();
      return data;
    } catch (err) {
      console.error('Update Menu Item Error:', err);
      throw err;
    }
  }

  async deleteMenuItem(id) {
    try {
      await this.request(`/menu/${id}`, { method: 'DELETE' });
      this._menu = this._menu.filter(m => m._id !== id && m.id !== id);
      this.notify();
    } catch (err) {
      console.error('Delete Menu Item Error:', err);
      throw err;
    }
  }

  // Bill Management
  async createBill(billData) {
    try {
      // Payload Sanitization: Ensure items match backend schema precisely
      const sanitizedItems = billData.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const payload = {
        ...billData,
        items: sanitizedItems
      };

      const data = await this.request('/bills', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const newBill = this.normalizeBill(data);
      this._bills.unshift(newBill);
      this.notify();
      return newBill;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.error('Create Bill Error Details:', msg);
      throw err;
    }
  }

  async deleteBill(id) {
    try {
      await this.request(`/bills/${id}`, { method: 'DELETE' });
      this._bills = this._bills.filter(b => b._id !== id && b.id !== id);
      this.notify();
    } catch (err) {
      console.error('Delete Bill Error:', err);
      throw err;
    }
  }

  async updateBillStatus(id, status, paymentMethod = null) {
    try {
      const body = { status };
      if (paymentMethod) body.paymentMethod = paymentMethod;
      const data = await this.request(`/bills/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body)
      });
      const updatedBill = this.normalizeBill(data);
      const idx = this._bills.findIndex(b => b._id === id || b.id === id);
      if (idx > -1) this._bills[idx] = updatedBill;
      this.notify();
      return updatedBill;
    } catch (err) {
      console.error(err);
    }
  }

  // Payment Management
  async triggerStkPushApi(phoneNumber, amount, billId) {
    try {
      const data = await this.request('/payments/stk-push', {
        method: 'POST',
        body: JSON.stringify({ 
          phone: phoneNumber, 
          amount: amount, 
          billId 
        })
      });
      return { ok: true, data };
    } catch (err) {
      console.error('STK Push Request Error:', err);
      return { ok: false, data: err.response?.data, status: err.response?.status };
    }
  }

  async pollBillStatus(billId, callback) {
    // Start polling immediately to be responsive
    
    return new Promise((resolve) => {
      let attempts = 0;
      let startTime = Date.now();
      const maxDuration = 300000; // 5 minutes total
      
      const poll = async () => {
        // Stop if globally cancelled or completed
        if (!this.pollingIntervals[billId]) return;

        try {
          const res = await this.request('/payments/check-status', {
            method: 'POST',
            body: JSON.stringify({ billId })
          });
          
          attempts++;
          const status = res.status;
          const billData = res.bill || res;

          if (status === 'PAID') {
            this.stopPolling(billId);
            const updatedBill = this.normalizeBill(billData);
            const idx = this._bills.findIndex(b => (b._id || b.id) === billId);
            if (idx > -1) this._bills[idx] = updatedBill;
            this.notify();
            resolve({ success: true, bill: updatedBill });
            return;
          } else if (status === 'SUCCESS_PENDING_ID') {
            if (callback) callback('verifying_id');
          } else if (status === 'FAILED' || status === 'CANCELLED') {
             this.stopPolling(billId);
             resolve({ success: false, message: res.failureReason || 'Payment failed or was cancelled.' });
             return;
          } else if (Date.now() - startTime > maxDuration) {
            this.stopPolling(billId);
            resolve({ success: false, message: 'Payment verification timed out. Please check your phone or Settled Bills.' });
            return;
          } else if (attempts > 3 && callback) {
            callback('verifying'); 
          }
        } catch (err) {
          console.error('Polling network error (retrying):', err);
        }

        // Schedule next poll adaptive interval
        const elapsed = Date.now() - startTime;
        const nextInterval = elapsed < 45000 ? 5000 : 13000; // 5s for first 45s, then 13s
        this.pollingIntervals[billId] = setTimeout(poll, nextInterval);
      };

      this.pollingIntervals[billId] = setTimeout(poll, 1000); // Start first poll after 1s
    });
  }

  stopPolling(billId) {
    if (this.pollingIntervals[billId]) {
      clearTimeout(this.pollingIntervals[billId]);
      delete this.pollingIntervals[billId];
    }
  }

  // Table Management
  updateTableStatus(id, status) {
    const table = this._tables.find(t => t.id === id);
    if (table) {
      table.status = status;
      save('tables', this._tables);
      this.notify();
    }
  }

  updateTablePosition(id, x, y) {
    const table = this._tables.find(t => t.id === id);
    if (table) {
      table.position = { x, y };
      table.x = x; // Compat
      table.y = y; // Compat
      save('tables', this._tables);
      this.notify();
    }
  }

  // User Management
  async addUser(username, pin) {
    try {
      const data = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, pin, role: 'cashier' })
      });
      this._users.push({ ...data, id: data.id || data._id });
      this.notify();
      return { success: true, message: `Staff character '${username}' provisioned successfully!` };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create user. Please check if username exists.';
      console.error('Add User Error:', msg, err);
      return { success: false, message: msg };
    }
  }

  async deleteUser(id) {
    try {
      await this.request(`/auth/users/${id}`, { method: 'DELETE' });
      this._users = this._users.filter(u => u._id !== id && u.id !== id);
      this.notify();
    } catch (err) {
      console.error('Delete User Error:', err);
      throw err;
    }
  }
}

export const store = new Store();