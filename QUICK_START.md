# ⚡ Quick Start Guide - 5 Minutes Setup

## 1️⃣ Install Dependencies (2 minutes)

```bash
# Root folder
npm install

# Client folder
cd client
npm install
cd ..
```

## 2️⃣ Create Environment File (1 minute)

Create `server/.env` file with:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/quickai
JWT_SECRET=your_secret_key_here_change_this
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_GEMINI_API_KEY
```

**Get Gemini API Key:** https://makersuite.google.com/app/apikey

## 3️⃣ Start MongoDB (30 seconds)

```bash
# macOS
brew services start mongodb-community

# OR use MongoDB Atlas (free cloud): https://www.mongodb.com/cloud/atlas
```

## 4️⃣ Run the App (30 seconds)

**Terminal 1 (Backend):**
```bash
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

## 5️⃣ Open Browser (30 seconds)

Go to: **http://localhost:5174**

## 6️⃣ First Use

1. **Sign Up** - Create account
2. **Choose Avatar** - Pick a color
3. **Name Assistant** - e.g., "Jarvis"
4. **Allow Microphone** - Click "Allow"
5. **Start Talking!** - Click green mic 🎤

## 🎤 Test Commands

Say: **"Jarvis, what time is it?"**
Say: **"Jarvis, tell me a joke"**
Say: **"Jarvis, what is HTML?"**

---

## ⚠️ Troubleshooting

**Voice not working?**
- Use Chrome or Edge browser
- Allow microphone permission
- Refresh page (Cmd+R)

**Server error?**
- Check MongoDB is running
- Verify `.env` file exists in `server/` folder
- Check Gemini API key is correct

**Need detailed help?** See `SETUP_GUIDE.md`

---

## 📋 What You Need

- ✅ Node.js installed
- ✅ MongoDB running (local or Atlas)
- ✅ Gemini API key
- ✅ Chrome or Edge browser
- ✅ Working microphone

**Total Setup Time: ~5 minutes** ⏱️

---

🎯 **Ready to impress with your 100 marks project!** 🌟

