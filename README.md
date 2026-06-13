# 🏥 Healthykuttan

![Healthykuttan](https://img.shields.io/badge/Status-Live-success)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Python FastAPI](https://img.shields.io/badge/RAG_Engine-Python_FastAPI-yellow)

**Live Demo:** [https://health-chatbot-dun.vercel.app/](https://health-chatbot-dun.vercel.app/)

Healthykuttan is an accessible, safety-first **Health-Awareness Triage Assistant** designed specifically for common users, including those with limited health literacy. It helps users understand their symptoms, learn about diseases, and get preventative health tips in simple, plain language.

> ⚠️ **Medical Disclaimer:** Healthykuttan is for educational and awareness purposes only. It does not provide medical diagnoses or replace professional medical advice. Always consult a qualified healthcare provider for medical emergencies and treatments.

---

## ✨ Features

- 🟢 **Highly Accessible UI:** Completely redesigned with large touch targets, emoji-guided navigation, and plain language labels to assist illiterate or semi-literate users.
- 🩺 **Symptom Triage:** Users can describe their symptoms and get simple explanations, potential causes (not diagnoses!), and guidance on when to seek professional medical help.
- 🛡️ **Safety-First Architecture:** Employs a strict pre-LLM emergency screening layer that intercepts critical symptoms and immediately prompts the user to call emergency services.
- 📚 **Disease Information & Prevention:** Easy-to-understand explanations of various health conditions and practical daily health tips.
- 🔒 **Privacy Focused:** Completely anonymous guest sessions. No user data, names, or chat histories are stored on remote servers. All chats stay local to the device.

---

## 🏗️ Architecture

The project consists of three main decoupled services:

1. **Frontend (`/frontend`)**
   - Built with React, Tailwind CSS, and Framer Motion.
   - Features a warm, calming teal/green color palette and utilizes the highly readable Noto Sans font.
   - Completely responsive, mobile-first design.

2. **Backend API (`/backend`)**
   - Node.js & Express server.
   - Handles API routing, rate limiting, and securely proxies requests from the frontend to the AI engine.

3. **RAG Engine (`/rag-engine`)**
   - Python FastAPI server handling Retrieval-Augmented Generation (RAG).
   - Powered by advanced LLMs (Groq/Llama) with specialized system prompts crafted for health triage and safety.
   - Includes deterministic emergency keyword screening before any LLM generation occurs.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v16+)
- Python (3.9+)
- Groq API Key (for the RAG Engine)

### 1. Setup RAG Engine
```bash
cd rag-engine
pip install -r requirements.txt
# Create a .env file and add your GROQ_API_KEY
uvicorn api:app --reload --port 8000
```

### 2. Setup Node Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### 3. Setup React Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## 📞 Emergency Contacts
The application prominently displays emergency numbers (e.g., 108 / 102 for Ambulance services) throughout the interface to ensure users experiencing emergencies get immediate help.

---

## 📝 License
This project is licensed under the MIT License.
