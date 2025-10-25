# 🚀 Deployment Guide - EchoAI

## Overview

EchoAI is a full-stack application that requires:
1. **Frontend** (React) → Deploy to **Vercel**
2. **Backend** (Node.js/Express) → Deploy to **Render** (free)

---

## 📋 Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to: https://render.com/
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### 1.2 Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your **EchoAI** repository
3. Configure:
   - **Name:** `echoai-backend`
   - **Region:** Choose closest to you
   - **Branch:** `master`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`

### 1.3 Add Environment Variables
In Render dashboard, add these environment variables:

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_URL=your_gemini_api_url_with_key
PORT=8000
```

### 1.4 Get Backend URL
After deployment, Render will give you a URL like:
`https://echoai-backend.onrender.com`

**Copy this URL!** You'll need it for frontend deployment.

---

## 🎨 Step 2: Deploy Frontend to Vercel

### 2.1 Update API URL in Frontend

**Open:** `client/src/context/UserContext.jsx`

**Change:**
```javascript
const serverUrl="http://localhost:8000"
```

**To:**
```javascript
const serverUrl="https://echoai-backend.onrender.com"
```
*(Use your actual Render URL)*

### 2.2 Push Changes to GitHub
```bash
cd /Users/pragyatripathi/Desktop/QuickAi-main
git add .
git commit -m "🚀 Configure for deployment"
git push origin master
```

### 2.3 Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd /Users/pragyatripathi/Desktop/QuickAi-main
vercel
```

Follow the prompts:
- **Set up and deploy?** `Y`
- **Which scope?** Choose your account
- **Link to existing project?** `N`
- **Project name?** `echoai` or `echo-ai-voice-assistant`
- **Directory with code?** `./client`
- **Override settings?** `N`

#### Option B: Using Vercel Dashboard

1. Go to: https://vercel.com/
2. Sign up with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your **EchoAI** repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

6. Click **"Deploy"**

---

## 🔧 Step 3: Update Backend CORS

After getting your Vercel URL (e.g., `https://echoai.vercel.app`):

### 3.1 Update CORS in Backend

**Open:** `server/server.js`

**Change:**
```javascript
app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5175'],
    credentials: true
}));
```

**To:**
```javascript
app.use(cors({
    origin: [
        'http://localhost:5174', 
        'http://localhost:5175',
        'https://echoai.vercel.app',  // Your actual Vercel URL
        'https://echoai-voice-assistant.vercel.app'  // If different
    ],
    credentials: true
}));
```

### 3.2 Push Backend Update
```bash
git add server/server.js
git commit -m "✅ Add production CORS"
git push origin master
```

Render will automatically redeploy with the new CORS settings.

---

## 🗄️ Step 4: Set Up Production MongoDB

### Option 1: MongoDB Atlas (Recommended - Free)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0)
3. Create database user
4. Whitelist all IPs: `0.0.0.0/0`
5. Get connection string
6. Update `MONGO_URI` in Render environment variables

---

## ✅ Step 5: Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Test signup/login
3. Test assistant customization
4. **Test voice features** (make sure browser permissions are allowed)

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"
- ✅ Check Render backend is running
- ✅ Check CORS includes your Vercel URL
- ✅ Check `serverUrl` in UserContext.jsx is correct

### Issue: "Database connection error"
- ✅ Check MongoDB Atlas IP whitelist
- ✅ Check `MONGO_URI` in Render environment variables
- ✅ Make sure connection string has correct username/password

### Issue: Voice not working
- ✅ Make sure you're using HTTPS (Vercel provides this)
- ✅ Allow microphone permissions
- ✅ Use Chrome or Edge browser

### Issue: AI not responding
- ✅ Check `GEMINI_API_URL` in Render environment variables
- ✅ Make sure API key is valid
- ✅ Check Render logs for errors

---

## 📊 Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Environment variables set in Render
- [ ] Backend URL copied
- [ ] Frontend updated with backend URL
- [ ] Changes pushed to GitHub
- [ ] Frontend deployed to Vercel
- [ ] Vercel URL copied
- [ ] CORS updated with Vercel URL
- [ ] MongoDB Atlas configured
- [ ] Test signup/login
- [ ] Test voice features
- [ ] Test AI responses

---

## 🎉 Your Live URLs

After deployment:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://echoai-backend.onrender.com`

---

## 💡 Important Notes

1. **Render Free Tier:** Backend will sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds.
2. **Voice Features:** Only work on HTTPS (Vercel provides this automatically)
3. **API Keys:** Never commit `.env` files - they're in `.gitignore`
4. **MongoDB:** Use Atlas for production (free tier available)

---

## 🆘 Need Help?

Check logs:
- **Render:** Dashboard → Your Service → Logs
- **Vercel:** Dashboard → Your Project → Deployments → View Function Logs

---

**Good luck with deployment! 🚀**

