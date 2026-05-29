# 🚀 Health Chatbot Deployment Guide

This guide walks you through deploying the complete Health Chatbot stack—**RAG Engine (Python)**, **Backend (Node.js)**, and **Frontend (React)**—fully for free with live URLs!

---

## 🛠️ Step 0: Push Code to GitHub

First, commit the production-ready configurations we just set up and push them to your repository:

```bash
git add .
git commit -m "Configure environment variables and dynamic origins for production deployment"
git push origin main
```

---

## 🐍 Step 1: Deploy the Python RAG Engine
**Recommended Platform: [Render](https://render.com/) or [Railway](https://railway.app/)**

The RAG Engine contains `requirements.txt` (pinned dependencies) and `runtime.txt` (`python-3.11.9`), which make deployment extremely seamless.

### On Render:
1. Log in to [Render](https://render.com/) and click **New > Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `health-chatbot-rag`
   - **Root Directory**: `rag-engine`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`
4. Click **Advanced** and add these **Environment Variables**:
   - `GROQ_API_KEY`: `your_groq_api_key`
   - `PYTHON_VERSION`: `3.11.9`
5. Click **Create Web Service**. 
6. 📝 **Save the Live Link URL** (e.g., `https://health-chatbot-rag.onrender.com`).

---

## 🟢 Step 2: Deploy the Node.js Express Backend
**Recommended Platform: [Render](https://render.com/)**

The Node.js backend connects the frontend to your MongoDB database and routes requests to the RAG Engine.

### On Render:
1. Click **New > Web Service**.
2. Connect the same GitHub repository.
3. Configure the following settings:
   - **Name**: `health-chatbot-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Click **Advanced** and add these **Environment Variables**:
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `RAG_URL`: `https://health-chatbot-rag.onrender.com` (use the URL saved in **Step 1**)
   - `FRONTEND_URL`: `https://health-chatbot.vercel.app` (you can update this in Render after doing **Step 3**)
5. Click **Create Web Service**.
6. 📝 **Save the Live Link URL** (e.g., `https://health-chatbot-backend.onrender.com`).

---

## ⚛️ Step 3: Deploy the React Frontend
**Recommended Platform: [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/)**

The frontend is a React application that displays the gorgeous, responsive user interface.

### On Vercel:
1. Log in to [Vercel](https://vercel.com/) and click **Add New > Project**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Root Directory**: Select `frontend`
   - **Framework Preset**: `Create React App`
4. Expand **Environment Variables** and add:
   - `REACT_APP_API_URL`: `https://health-chatbot-backend.onrender.com` (use the URL saved in **Step 2**)
5. Click **Deploy**.
6. 🎉 **Get your Live Link!** (e.g., `https://health-chatbot.vercel.app`).

### 🔄 Final Loop-Back:
Once you have your Vercel URL, go back to your **Render Backend Web Service settings**, edit the `FRONTEND_URL` environment variable to match your Vercel URL, and trigger a redeploy. This guarantees safe, credentials-based CORS between your frontend and backend!
