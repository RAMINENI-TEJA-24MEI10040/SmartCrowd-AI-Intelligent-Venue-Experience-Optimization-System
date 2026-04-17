# 🏟️ SmartCrowd AI: Production-Grade Venue Experience Optimization

A comprehensive, production-ready full-stack AI system designed to solve physical event congestion, optimize queue times, and provide real-time coordination for large-scale sporting venues.

## 🚀 Key Features & Production Upgrades
- **AI Crowd Management System:** Predicts crowd density and visualizes heatmaps in real-time.
- **Smart Queue Prediction:** Machine Learning model estimating wait times at food stalls, restrooms, and gates.
- **Dynamic Routing:** Suggests the fastest paths avoiding congested zones.
- **Live Admin Alerts:** Centralized dashboard for venue administrators to trigger emergency or directional alerts.
- **Premium User Experience:** Stunning UI with Next.js, Glassmorphism, Recharts, and Google Maps integration.
- **Enterprise Security:** JWT / Firebase Authentication, Helmet headers, Rate Limiting, and Zod input validation.
- **High Efficiency:** In-memory `node-cache` implemented for lightning-fast AI API responses.
- **Fully Accessible:** Strict ARIA roles and labels implemented across all UI components.

## 🏗️ Architecture

```mermaid
graph TD
    A[Attendee Phone / Next.js] -->|Fetches Live Data via HTTPS| B(Node.js Express Backend)
    C[Admin Dashboard / Next.js] -->|Secured Admin Auth| B
    B -->|Calls Python API (Cached)| D[FastAPI AI Service]
    D -->|Predicts Density & Wait Times| B
    B -->|Persists & Reads| E[(Firebase Firestore)]
```

## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router), React, Google Maps API, Recharts, Lucide Icons.
- **Backend:** Node.js, Express.js, Firebase Admin, Zod, Helmet.
- **AI / ML Service:** Python, FastAPI, NumPy, Scikit-learn (Simulated).
- **Testing:** Jest + Supertest (Backend), PyTest (AI Service).

## 💻 Running Locally

### 1. Environment Setup
Copy `.env.example` to `.env` in the root and fill in your Firebase and Google Maps API keys.

### 2. AI Service (Python)
```bash
cd ai-service
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*Run tests: `pytest tests/`*

### 3. Core Backend (Node.js)
```bash
cd backend
npm install
npm start
```
*Run tests: `npm test`*

### 4. Frontend Web App (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Deployment Guide
- AI & Backend: Deploy to Google Cloud Run via Dockerfiles.
- Frontend: Deploy easily to Vercel via `vercel` CLI.
