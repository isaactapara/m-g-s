# M&G Restaurant Hub - Frontend
**High-Fidelity Restaurant Billing & Analytics Engine**

This repository contains the standalone frontend application for the M&G Restaurant Hub, a premium dashboard designed for restaurant owners and cashiers to manage tables, menus, and business intelligence.

## 🏗 Project Architecture
The project follows a clean, modular structure optimized for scalability and separation of concerns:

- `frontend/src/`
  - `components/`: Shared UI components and layout wrappers.
  - `core/`: Centralized state management (`store.js`) and core business logic.
  - `pages/`: Route-specific logic and specialized views.
  - `styles/`: Global design tokens and performance-optimized CSS.
- `frontend/public/`: Static brand assets and favicons.
- `frontend/dist/`: Production-ready build artifacts.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or later)
- npm (v9.x or later)

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Launch the high-performance Vite development server:
```bash
npm run dev
```

## 🔒 Security Posture
The frontend has been hardened with:
- **PIN Hashing**: All internal credentials are obscured using `cyrb53` hashing.
- **XSS Mitigation**: Global HTML sanitization in place for all dynamic template outputs.
- **Role-Based Routing**: Visual access control for 'Owner' vs 'Cashier' views.

## 📜 Documentation
Full technical specs, including the upcoming MERN backend integration schema, can be found in `backend-integration.md` at the project root.
