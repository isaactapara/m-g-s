# BRM Backend Integration Guide

This application is built with pure HTML, CSS (Tailwind), and Vanilla JavaScript to ensure maximum speed and minimal overhead. The entire application state is currently managed by a centralized in-memory store (`src/store.js`) which uses `localStorage` to simulate a database.

Integrating this frontend with a real backend (Node.js, Django, Python) is incredibly straightforward. You only need to modify one single file: `src/store.js`.

---

## 1. The Core Architecture: `store.js`
In `src/store.js`, the `Store` class holds the master state:
\`\`\`javascript
this.menu = []; // Array of Objects
this.tables = []; // Array of Objects
this.bills = []; // Array of Objects
this.settings = {}; // Object
this.users = []; // Array of Objects
\`\`\`

Currently, when the app loads, the `constructor()` hydrates these arrays from `localStorage`. 
**To integrate your backend:** Replace the `localStorage.getItem` block inside `constructor()` with asynchronous API calls fetching your data.

---

## 2. API Endpoint Requirements
You should build the following REST API endpoints on your backend to support the frontend operations.

### Menu Endpoints
- \`GET /api/menu\` - Returns an array of menu items.
- \`POST /api/menu\` - Creates a new menu item.
- \`PUT /api/menu/:id\` - Updates an existing menu item.
- \`DELETE /api/menu/:id\` - Deletes a menu item.

**Expected Menu Object Schema:**
\`\`\`json
{
  "id": "uuid-string",
  "name": "Beef Stew",
  "price": 200,
  "category": "Mains"
}
\`\`\`

### Bill / Transaction Endpoints
- \`GET /api/bills\` - Returns all bills (for Owner) or filtered bills by Cashier.
- \`POST /api/bills\` - Submits a new completed checkout cart.
- \`PATCH /api/bills/:id\` - Updates bill status (e.g. changing \`PENDING\` to \`PAID\`).

**Expected Bill Object Schema:**
\`\`\`json
{
  "id": "uuid-string",
  "billNumber": "123456",
  "timestamp": "2026-03-21T14:30:00Z", // ISO string
  "cashierId": "user-uuid",
  "cashierName": "john_doe",
  "total": 500,
  "status": "PAID", // 'PAID' or 'PENDING'
  "paymentMethod": "M-Pesa", // 'M-Pesa' or 'Cash'
  "items": [
    { "id": "menu-uuid", "name": "Beef Stew", "price": 200, "quantity": 2 }
  ]
}
\`\`\`

### Staff / User Endpoints
- \`GET /api/users\` - Returns all staff (for Owner management).
- \`POST /api/users\` - Creates a new Cashier account.
- \`DELETE /api/users/:id\` - Deletes a Cashier account.
- \`POST /api/auth/login\` - Receives \`{ username, pin }\` and securely returns the authenticated User Object.

**Expected User Object Schema:**
\`\`\`json
{
  "id": "uuid-string",
  "username": "cashier_1",
  "role": "cashier" // 'owner' or 'cashier'
}
\`\`\`

---

## 3. How to Execute the Migration (Step-by-Step)

### Step 1: Remove `localStorage`
Inside `src/store.js`, go to the `notify()` function. Delete all the `localStorage.setItem` commands. This stops the frontend from writing to the browser's cache.

### Step 2: Hydrate data with `fetch()`
Modify the `Store` constructor to asynchronously load data from your backend upon boot.
\`\`\`javascript
async loadInitialData() {
  try {
    const [menuRes, billsRes, usersRes] = await Promise.all([
      fetch('/api/menu').then(r => r.json()),
      fetch('/api/bills').then(r => r.json()),
      fetch('/api/users').then(r => r.json())
    ]);
    
    this.menu = menuRes;
    this.bills = billsRes;
    this.users = usersRes;
    
    this.notify(); // Re-renders all screens automatically
  } catch (error) {
    console.error("Failed to boot system", error);
  }
}
\`\`\`

### Step 3: Wire up the Mutations
Whenever user actions happen (like clicking "Pay Now"), the frontend scripts call methods like `store.createBill(billData)`. 
Refactor these synchronous methods to await the backend response before updating the UI state.

**Example refactoring of `createBill`:**
\`\`\`javascript
async createBill(billData) {
    // 1. Prepare payload with frontend context
    const payload = {
        ...billData,
        cashierId: this.currentUser ? this.currentUser.id : null,
        cashierName: this.currentUser ? this.currentUser.username : 'Unknown',
        timestamp: new Date().toISOString()
    };

    // 2. Transmit to actual backend
    const response = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    const savedBill = await response.json();

    // 3. Inject new datastore response and trigger UI Repaint
    this.bills.unshift(savedBill);
    this.notify();
}
\`\`\`

---
*Following this exact pattern across `addMenuItem`, `deleteUser`, and `updateBillStatus` will seamlessly upgrade the local MVP into a production-grade, network-connected Client.*
