# 💻 HirePilot Frontend (Client)

The frontend client for **HirePilot**, built with React 19, Vite, Tailwind CSS v4, and Redux Toolkit.

---

## 🛠️ Architecture & Tech Stack

- **React 19 & Vite:** Component-based UI with fast Hot Module Replacement.
- **Redux Toolkit:** Manages user session state (`userData`, wallet credit balance) globally.
- **React Router DOM v7:** Client-side SPA routing (`/`, `/interview`, `/history`, `/pricing`, `/report/:id`).
- **Web Speech API:**
  - `speechSynthesis`: Powers the AI interviewer voice.
  - `webkitSpeechRecognition`: Browser-native real-time speech-to-text.
- **Recharts & CircularProgressbar:** Visual rendering of interview analytics, score rings, and skill indicators.
- **jsPDF & jsPDF-autotable:** Browser-side PDF generation for downloadable interview report cards.
- **Tailwind CSS v4:** Modern `@tailwindcss/vite` utility styling.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env` in this directory:
```env
VITE_SERVER_URL=http://localhost:8000
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Run Development Server
```bash
npm run dev
```

App runs at `http://localhost:5173`.
