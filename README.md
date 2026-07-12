# TransitOps – Smart Transport Operations Platform

TransitOps is a production-ready, fully functional full-stack MERN platform built to streamline fleet dispatching, document verification auditing, parts servicing logs, safety counsels, fuel budgets, and real-time operations telemetry.

---

## 🚀 Key Features

- **Role-Based Session Guarding**: Custom dashboards tailored specifically for 5 distinct roles:
  - **Admin**: Full database access, onboard approval, role overrides.
  - **Fleet Manager**: Trip dispatches, truck/driver CRUD, preventive service schedules.
  - **Safety Officer**: Driver safety audits, compliance uploads, document verification.
  - **Financial Analyst**: Refuel logs, toll ledgers, repair billing, expense analytics.
  - **Driver / Operator**: Active route coordinates checklist, odometer inputs, fuel invoices.
- **Visual GIS Telemetry**: Simulated real-time SVG routing map demonstrating vehicle coordinates updates.
- **Analytical Area & Pie Charts**: Interactive monthly mileage, deliveries ratio, consumption charts, and category splits.
- **Compliance document Expirations**: Automated Socket.IO warnings triggered 30 days prior to RC, license, or insurance expirations.
- **CSV & PDF Exporter**: Instant downloading of aggregated spreadsheet logs or styled print format PDFs.
- **Mock Seeding**: Complete mock records database seeder file included.
- **Robust Mongoose Fallback Mode**: If no local MongoDB is detected on `127.0.0.1:27017` during startup, the application transparently falls back to an **In-Memory RAM database engine**, pre-seeding all credentials and dashboard curves automatically.

---
<img width="1917" height="953" alt="image" src="https://github.com/user-attachments/assets/f0485942-74ea-4af6-bc50-b165609710e9" />


## 📁 Project Folder Tree

```text
TransitOps/
├── backend/
│   ├── config/              # MongoDB & Cloudinary configurations
│   ├── controllers/         # REST API route controllers
│   ├── middleware/          # JWT auth guards, Multer uploads, Errors handler
│   ├── models/              # Mongoose schema models (Proxy fallback wrapped)
│   ├── routes/              # Express API route bindings
│   ├── seed/                # Seed scripts (Disk & RAM fallbacks)
│   ├── services/            # Real-time Socket.IO coordinator
│   ├── utils/               # SendEmail, Notification Helpers, Mock DB manager
│   ├── package.json
│   ├── server.js            # App entry point
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/      # Reusable status cards, charts, loaders, modals
    │   ├── context/         # Auth and Socket context sessions
    │   ├── layouts/         # Dashboard Sidebar & Navbar shell
    │   ├── pages/           # Landing, Login, Registers, CRUD views
    │   ├── routes/          # AppRoutes definition
    │   ├── index.css        # Tailwind custom layers & Outfit typography
    │   ├── App.jsx          # Providers wrapping
    │   └── main.jsx
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🛠️ Getting Started & Launch Guide

### Prerequisites
- Node.js installed on host system (version 18+ recommended)
- MongoDB running on port 27017 (Optional: if not running, backend enters RAM DB mode automatically)

### Step 1: Install Dependencies

Open separate terminal windows for backend and frontend directories:

```bash
# In backend folder
cd backend
npm install

# In frontend folder
cd ../frontend
npm install
```

### Step 2: Configure Environment

We have pre-seeded active `.env` values in the backend directory. You can adjust the credentials template `.env.example` as required:

```ini
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/transitops
JWT_SECRET=transitops_super_secret_jwt_key_12345
CLIENT_URL=http://localhost:5173
```

### Step 3: Run the Servers

Execute the startup commands concurrently:

```bash
# In backend folder (launches API server on port 5000)
cd backend
npm start

# In frontend folder (launches Vite dev client on port 5173)
cd ../frontend
npm run dev
```

Open your browser to `http://localhost:5173` to interact with the SaaS landing page.

---

## 🔑 Reviewer Demo Accounts

To test role customized interfaces directly, navigate to `http://localhost:5173/roles` or click the **Launch Demo Deck** button on the landing page hero banner to bypass credential writing.

Alternatively, authenticate manually using the following seeds:
- **Default password**: `password123` for all demo accounts.
- **Admin**: `admin@transitops.com`
- **Fleet Manager**: `manager@transitops.com`
- **Safety Officer**: `safety@transitops.com`
- **Financial Analyst**: `finance@transitops.com`
- **Driver**: `driver@transitops.com`
