# M&G's Restaurant Hub | Enterprise POS & Billing Suite

<p align="center">
  <img src="frontend/public/brand-logo-v2.png" alt="M&G's Logo" width="400">
</p>

A high-performance, security-hardened Point of Sale (POS) and Restaurant Management ecosystem. Engineered for mission-critical reliability, this suite leverages a decoupled architecture to provide seamless real-time billing, automated M-Pesa settlements, and granular business intelligence.

## Technical Architecture

This repository is structured as a modern Full-Stack JavaScript monorepo, optimized for low-latency operations.

### Backend (Node.js/Express)
- **High-Concurrency Engine**: Powered by Express.js with a modular controller-service architecture.
- **Persistence Layer**: MongoDB (Mongoose ODM) with optimized schemas for relational-style data integrity.
- **Security Posture**: 
    - **M-Pesa Multi-Stage Auditor**: A sophisticated "Security Audit" system that cross-references Safaricom callbacks against internal database totals to prevent transaction tampering (e.g., "One Shilling" exploits).
    - **JWT & RBAC**: Stateless authentication with strict Role-Based Access Control (Owner vs. Cashier).
- **Dev-Ops Ready**: Integrated localtunnel support for rapid M-Pesa webhook development in local environments.

### Frontend (Vite/Vanilla JS/Tailwind 4)
- **Zero-Overhead Reactivity**: Built on a custom Observable State Manager (src/core/store.js), delivering framework-like reactivity without the performance penalties of a heavy Virtual DOM.
- **Micro-Animation Design**: Aesthetic excellence achieved via Tailwind CSS 4, featuring a premium "Glassmorphism" interface with a dynamic Dark/Light theme system.
- **Hard UI Locking**: Advanced DOM lifecycle management to prevent duplicate transaction initiation through hardware-accurate button states.
- **Client-Side Intelligence**: Real-time sales frequency tracking and visual floor plan management with persistent coordinate storage.

## Feature Highlights

- **Quick Billing**: A frequency-based ordering terminal ranking the Top 5 items for rapid cashier throughput.
- **Integrated Payments**: Full-cycle M-Pesa STK Push integration with real-time status polling and asynchronous webhook reconciliation.
- **Interactive Floor Plan**: Dynamic drag-and-drop table management for real-time occupancy tracking.
- **Business Intelligence**: High-fidelity data visualization via Chart.js, offering Executive Summaries across Daily, Weekly, and Monthly timeframes.
- **Professional Reporting**: Direct-to-PDF export functionality for daily revenue audits using jsPDF and html2canvas.

## Installation & Deployment

### Backend Setup
1. cd backend
2. npm install
3. Configure your .env (Daraja credentials, MongoDB URI).
4. npm start

### Frontend Setup
1. cd frontend
2. npm install
3. npm run dev

## Security First
The system is built to neutralize common POS attack vectors:
- **Amount Tampering**: The backend strictly ignores client-side payment amounts, sourcing the "Source of Truth" exclusively from the database.
- **Memory Safety**: Explicit management of setInterval and eventListeners to prevent orphans and leaks in long-running browser tabs.
- **Double-Charge Protection**: UI-level hardware locking ensures single-path transaction execution.

## Contribution & Credit

**Solo Developer & Architect**: Isaac Tapara

---
*Maintained internally by the Core Engineering Team.*