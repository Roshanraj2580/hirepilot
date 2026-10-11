# 🚀 HirePilot — AI-Powered Mock Interview Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **HirePilot** is a production-grade full-stack MERN application that provides candidates with real-time, personalized AI mock interviews. It evaluates answers on **Confidence, Communication, and Correctness**, featuring dynamic speech interaction, animated avatar feedback, and automated performance analytics.

---

## 🌟 Key Features

- 📄 **Resume Parsing & Skill Extraction:** Upload a PDF resume to automatically extract candidate role, experience level, tech stack, and key projects via `pdfjs-dist` and LLM extraction.
- 🎙️ **Voice Interview Engine (Speech-to-Speech):**
  - **Text-to-Speech (TTS):** Browser-native `speechSynthesis` vocalizes questions with natural cadence.
  - **Speech-to-Text (STT):** Continuous transcription via `webkitSpeechRecognition` into real-time answer text.
  - **Acoustic Echo Prevention:** Deterministic microphone mute state machine prevents audio loops while the avatar speaks.
- ⏱️ **Real-Time Timed Rounds:** Customizable countdown timers per question (60s–120s) with auto-submission triggers.
- 🤖 **Multi-Dimensional AI Scoring:** Answers are evaluated across three rubrics: *Confidence*, *Communication*, and *Correctness* (0–10 scale) with concise, human-style feedback.
- 📊 **Analytics Dashboard & PDF Export:** Comprehensive visual breakdown with Recharts area curves, skill progress rings, and one-click downloadable PDF reports generated client-side via `jsPDF`.
- 💳 **Credit Economy & Payments:** Built-in credit wallet (50 credits per interview, 100 free on signup). Integrated with **Razorpay** checkout backed by server-side **HMAC-SHA256 cryptographic verification**.
- 🔐 **Stateless Authentication:** Firebase Google OAuth frontend handshake paired with secure, stateless 7-day `httpOnly` JWT session cookies on Express.

---

## 🏗️ System Architecture

```text
+-------------------------------------------------------------------------+
|                        BROWSER (Client Machine)                         |
|                                                                         |
|  [ React 19 SPA ]  <--->  [ Redux Toolkit ]  <--->  [ Web Speech API ]  |
|  (Vite Bundler)           (User Profile &            (speechSynthesis & |
|                            Wallet Credits)            SpeechRecognition)|
|                                                                         |
|  [ Firebase SDK ] (Google OAuth)     [ Razorpay Checkout ] (Script Popup|
+-----------------------------------|-------------------------------------+
                                    | HTTP/REST + Token Cookie
                                    v
+-------------------------------------------------------------------------+
|                     EXPRESS 5 SERVER (Node.js)                          |
|                                                                         |
|  [ CORS ]  -->  [ express.json ]  -->  [ cookieParser ]                 |
|                                                                         |
|  Protected Pipeline:                                                    |
|  --> [ isAuth Middleware ] (JWT verification & req.userId attachment)   |
|  --> [ Multer Middleware ] (Multipart memory/disk streaming for PDF)    |
|                                                                         |
|  Controllers: Auth | User | Interview | Payment                         |
+-----------------|------------------------|------------------------------+
                  |                        |
                  v                        v
        [ MongoDB Atlas ]        [ External Microservices ]
        - Users                  - OpenRouter API (gpt-4o-mini)
        - Interviews (+Questions)- Razorpay Cloud APIs
        - Payments               - Firebase Auth
```

---

## 🛠️ Tech Stack Breakdown

| Layer | Technologies | Role / Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite | Fast modular SPA with instant HMR and reusable component architecture. |
| **Styling** | Tailwind CSS v4 | Modern utility-first styling with `@tailwindcss/vite`. |
| **State Management**| Redux Toolkit | Centralized store for user profile and wallet credits, eliminating prop drilling. |
| **Routing** | React Router DOM v7 | Client-side routing across setup, interview room, history, and report views. |
| **Data Viz / PDF** | Recharts, jsPDF | Interactive performance trend charts and browser-side PDF report rendering. |
| **Backend** | Node.js, Express 5 | High-throughput asynchronous event-driven REST API. |
| **Database** | MongoDB Atlas, Mongoose 9| Document store with embedded question subdocuments for $O(1)$ single-read queries. |
| **AI Layer** | OpenRouter (GPT-4o-mini)| Low-latency LLM gateway for resume analysis, question drafting, and grading. |
| **Payments** | Razorpay + Node Crypto | Secure checkout with server-side HMAC-SHA256 signature validation. |

---

## 📂 Repository Structure

```text
hirepilot/
├── client/                     # Frontend React application
│   ├── public/                 # Static assets and icons
│   ├── src/
│   │   ├── assets/             # Avatar video clips and illustrations
│   │   ├── components/         # Reusable UI (Navbar, Timer, Step Cards)
│   │   ├── pages/              # Route views (Home, Interview, Report, Pricing)
│   │   ├── redux/              # RTK store and user slice
│   │   ├── utils/              # Firebase initialization
│   │   ├── App.jsx             # Route definitions and session hydration
│   │   └── main.jsx            # React root mount
│   ├── vite.config.js          # Vite + Tailwind v4 config
│   └── package.json
│
└── server/                     # Backend Express API
    ├── config/                 # DB connection and token signers
    ├── controllers/            # Core business logic (interview, payment, auth)
    ├── middlewares/            # isAuth gate, multer upload filters
    ├── models/                 # Mongoose schemas (User, Interview, Payment)
    ├── routes/                 # REST route declarations
    ├── services/               # OpenRouter AI gateway & Razorpay client
    ├── index.js                # Server entry point & middleware chain
    └── package.json
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/google` | Public | Google OAuth handshake: finds or creates user and sets JWT cookie. |
| `GET` | `/api/auth/logout` | Public | Clears session cookie and invalidates browser session. |
| `GET` | `/api/user/current-user`| `isAuth` | Hydrates current logged-in user profile and balance on app mount. |
| `POST` | `/api/interview/resume` | `isAuth` + `multer` | Extracts raw text from uploaded PDF resume via `pdfjs-dist`. |
| `POST` | `/api/interview/generate-questions` | `isAuth` | Deducts 50 credits and drafts 5 role-specific interview questions. |
| `POST` | `/api/interview/submit-answer` | `isAuth` | Grades individual answer (0–10) with AI feedback and persists subdocument. |
| `POST` | `/api/interview/finish` | `isAuth` | Aggregates all scores and marks interview completed. |
| `GET` | `/api/interview/get-interview` | `isAuth` | Retrieves user's interview history (projected for high speed). |
| `GET` | `/api/interview/report/:id` | `isAuth` | Retrieves full analytics report for a specific interview. |
| `POST` | `/api/payment/order` | `isAuth` | Creates a Razorpay order ID for purchasing credit packs. |
| `POST` | `/api/payment/verify` | `isAuth` | Cryptographically validates HMAC-SHA256 signature and adds credits. |

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas cluster URL
- Firebase Web App credentials
- OpenRouter API key
- Razorpay test mode credentials

### 2. Clone the Repository
```bash
git clone https://github.com/Roshanraj2580/hirepilot.git
cd hirepilot
```

### 3. Server Configuration
```bash
cd server
npm install
```
Create a `.env` file inside `/server`:
```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```
Start backend:
```bash
npm run dev
```

### 4. Client Configuration
```bash
cd ../client
npm install
```
Create a `.env` file inside `/client`:
```env
VITE_SERVER_URL=http://localhost:8000
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```
Start frontend:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in Chrome or Edge.

---

## 🛡️ Engineering Highlights & Design Decisions

- **Promisified Speech Synthesis:** Browser `speechSynthesis.speak()` is an asynchronous, event-driven API without Promise support. We wrapped it in a custom Promise resolving on `utterance.onend`, allowing clean `await speakText(text)` sequential dialogue.
- **Embedded Document Architecture:** Question subdocuments are embedded directly inside the `Interview` document because they are bounded (exactly 5 items) and always read/updated as an atomic unit, avoiding costly SQL-style joins.
- **HMAC Payment Integrity:** Razorpay transactions verify authenticity on the server by recomputing `HMAC-SHA256(order_id + "|" + payment_id, SECRET)` before modifying wallet balances.
- **Projected Queries for History:** The history list query uses Mongoose `.select("role experience mode finalScore status createdAt")`, excluding large `resumeText` and embedded question arrays to ensure ultra-fast load times.

---

## 👨‍💻 Author

**Roshan Raj**  
B.Tech ECE · BIT Mesra  
- GitHub: [@Roshanraj2580](https://github.com/Roshanraj2580)
- Project Repository: [hirepilot](https://github.com/Roshanraj2580/hirepilot)

---
*Built with ❤️ for tech candidates preparing for placements.*
