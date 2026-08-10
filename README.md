# 🚀 FlyTripVisa Central Database & API Engine

This is the **Centralized Database and Core API Engine** for the FlyTripVisa ecosystem. Powered by **Next.js (App Router)** and deployed globally on **Cloudflare Workers / Pages** using **Cloudflare D1 SQL Database**.

It provides a single source of truth for user authentication, visa catalog management, and order processing across all connected applications (`flytripvisa.site`, Admin Dashboards, Mobile Apps, etc.).

---

## 📁 Project Directory Structure

```text
FlyTripVisa-Database/
├── README.md                  <-- Project Documentation
├── package.json               <-- Dependencies & Deployment Scripts
├── wrangler.jsonc             <-- Cloudflare Worker & D1 Database Config
├── schema.sql                 <-- Central Database Architecture
├── tsconfig.json              <-- TypeScript Configuration
└── src/
    ├── env.d.ts               <-- Cloudflare D1 Type Definitions
    └── app/
        └── api/
            ├── health/
            │   └── route.ts   <-- System Health & DB Connection Check
            └── v1/
                ├── auth/
                │   ├── signup/
                │   │   └── route.ts  <-- Central Signup API
                │   └── login/
                │       └── route.ts  <-- Central Login API
                ├── visa/
                │   └── route.ts      <-- Central Visa Catalog API
                └── orders/
                    └── route.ts      <-- Central Order System API
