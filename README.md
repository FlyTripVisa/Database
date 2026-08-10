FlyTripVisa-Database/
├── package.json               <-- Dependencies & Deployment Scripts
├── wrangler.jsonc             <-- Cloudflare Worker & D1 Database Config
├── schema.sql                 <-- Central Database Architecture
├── tsconfig.json              <-- TypeScript Configuration
└── src/
    ├── env.d.ts               <-- Cloudflare D1 Type Definitions
    └── app/
        └── api/
            ├── v1/
            │   ├── auth/
            │   │   ├── signup/
            │   │   │   └── route.ts  <-- Central Signup API (Any Project Can Call)
            │   │   └── login/
            │   │       └── route.ts  <-- Central Login API
            │   ├── visa/
            │   │   └── route.ts      <-- Central Visa Catalog API
            │   └── orders/
            │       └── route.ts      <-- Central Order System API
            └── health/
                └── route.ts          <-- System Status & DB Connection Check
