# AgriFeed AI - Intelligent Cattle Feed & Silage Quality Assessment

AgriFeed AI is an AI-powered agricultural quality analysis platform designed to help dairy farmers, feed mills, and livestock managers assess cattle feed and silage quality instantly using computer vision (Roboflow Google Gemini 3.1 Pro Workflow) and chemical parameter analysis.

---

## 🚀 Key Features

- **AI Visual Defect Detection**: Detects mould patches, discoloration, and foreign objects with labeled bounding boxes.
- **Physical & Chemical Parameter Evaluation**: Assesses Moisture, Crude Protein, Crude Fiber, Aflatoxin (ppb), pH, and Pit Temperature against scientific thresholds.
- **Actionable Farmer Advisory**: Generates specific, practical recommendations for storage, fermentation management, and animal safety.
- **Automated PDF Test Reports**: Download comprehensive assessment reports with color-coded charts and high-resolution annotated sample images.
- **Responsive Web Dashboard**: Works seamlessly across desktops, tablets, and mobile devices.

---

## 🛠️ Project Structure

```
Barely-Functional/
├── Backend/                 # Express.js REST API & AI Analysis Service
│   ├── src/
│   │   ├── controllers/     # AI, Analysis, Auth, Dashboard, Report controllers
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Roboflow Gemini workflow client & report generators
│   │   └── repositories/    # In-memory & DB data stores
│   ├── uploads/             # Sample image store
│   └── package.json
└── Frontend/                # React (Vite) Application
    ├── src/
    │   ├── components/      # UI components, layout, cards, navigation
    │   ├── context/         # Auth and session context
    │   ├── pages/           # Feed/Silage Analysis, Reports, Dashboard, Auth
    │   └── services/        # Axios API client
    └── package.json
```

---

## ⚡ Quick Start

### 1. Backend Setup

```bash
cd Backend
npm install
npm run dev # or node src/server.js
```
The backend will start at `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`.
