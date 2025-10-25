# 🚀 QuickAI Setup Guide - Step by Step

Follow these steps carefully to get your voice assistant up and running!

## 📋 Prerequisites Checklist

Before you start, make sure you have:
- ✅ Node.js installed (v14 or higher) - [Download here](https://nodejs.org/)
- ✅ MongoDB installed or MongoDB Atlas account - [Get MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- ✅ Google Gemini API Key - [Get it here](https://makersuite.google.com/app/apikey)
- ✅ Chrome or Edge browser (for best voice support)
- ✅ Microphone connected and working

---

## 🔧 Step 1: Install Dependencies

### Backend Dependencies
```bash
# From the root directory (QuickAi-main)
npm install
```

This installs:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cookie-parser
- cors
- dotenv
- axios
- multer
- nodemon

### Frontend Dependencies
```bash
# Navigate to client folder
cd client
npm install
```

This installs:
- react
- react-dom
- react-router-dom
- axios
- tailwindcss
- vite
- and more...

---

## 🔐 Step 2: Set Up Environment Variables

Create a `.env` file in the **server** folder:

```bash
# From QuickAi-main directory
touch server/.env
```

Add the following to `server/.env`:

```env
# Server Configuration
PORT=8000

# MongoDB Configuration
# Option 1: Local MongoDB
MONGO_URI=mongodb://localhost:27017/quickai

# Option 2: MongoDB Atlas (recommended)
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/quickai?retryWrites=true&w=majority

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Google Gemini API
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_GEMINI_API_KEY_HERE
```

### 🔑 How to Get Gemini API Key:
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and replace `YOUR_GEMINI_API_KEY_HERE` in the `.env` file

---

## 🗄️ Step 3: Set Up MongoDB

### Option A: Local MongoDB
```bash
# Install MongoDB locally
brew install mongodb-community@7.0  # macOS
# OR use Windows/Linux installer from mongodb.com

# Start MongoDB service
brew services start mongodb-community@7.0  # macOS
```

### Option B: MongoDB Atlas (Recommended - Free)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier - M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Update `MONGO_URI` in `.env` file

---

## 🎯 Step 4: Update Frontend Configuration

Open `client/src/context/UserContext.jsx` and verify the server URL:

```javascript
const serverUrl="http://localhost:8000"
```

**Important:** Make sure the port matches your backend `.env` PORT!

---

## ▶️ Step 5: Start the Application

### Terminal 1 - Start Backend
```bash
# From QuickAi-main directory
npm run dev
```

You should see:
```
Server is running on port 8000
MongoDB connected successfully
```

### Terminal 2 - Start Frontend
```bash
# From QuickAi-main directory
cd client
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
```

---

## 🎉 Step 6: First Time Setup

### 6.1 Open Your Browser
Navigate to: `http://localhost:5174`

### 6.2 Allow Microphone Access
- Your browser will ask for microphone permission
- Click **"Allow"** - this is essential for voice features!

### 6.3 Create Your Account
1. Click **"Sign Up"**
2. Enter your name, email, and password (min 6 characters)
3. Click **"Create Account"**

### 6.4 Customize Your Assistant
**Step 1 - Choose Avatar:**
- Pick a color gradient (Ocean, Forest, Fire, etc.)
- OR upload a custom image
- Click **"Continue →"**

**Step 2 - Name Your Assistant:**
- Enter a name (e.g., Jarvis, Friday, Nova)
- Click **"🚀 Create Your Assistant"**

---

## 🎤 Step 7: Start Talking!

### Testing Voice Commands

1. **Click the green microphone button** 🎤
2. **Say your assistant's name + command**

### Example Commands to Try:

#### Time & Date
- "Jarvis, what time is it?"
- "Friday, what's today's date?"
- "Nova, what day is today?"

#### General Knowledge
- "Jarvis, what is JavaScript?"
- "Friday, who is Elon Musk?"
- "Nova, what is artificial intelligence?"

#### Fun Commands
- "Jarvis, tell me a joke"
- "Friday, who created you?"

#### Open Applications
- "Nova, open calculator"
- "Jarvis, open Instagram"
- "Friday, open Facebook"

#### Search
- "Jarvis, search Google for pizza recipes"
- "Friday, search YouTube for funny cats"
- "Nova, what's the weather?"

---

## 🐛 Troubleshooting

### Issue: "Voice recognition not initialized"
**Solution:**
- Refresh the page (Cmd+R or Ctrl+R)
- Clear browser cache (Cmd+Shift+R or Ctrl+Shift+F5)
- Make sure you're using Chrome or Edge

### Issue: "Microphone permission denied"
**Solution:**
1. Click the lock icon in the address bar
2. Find "Microphone" permission
3. Change to "Allow"
4. Refresh the page

### Issue: "Server error" or "Login error"
**Solution:**
- Check if MongoDB is running
- Verify `.env` file in server folder exists
- Check Terminal 1 for error messages
- Verify `MONGO_URI` is correct

### Issue: AI doesn't respond or gives errors
**Solution:**
- Check your Gemini API key is correct
- Verify you have internet connection
- Check Terminal 1 for error messages
- Make sure the API key is active

### Issue: "Cannot connect to server"
**Solution:**
- Make sure backend is running (Terminal 1)
- Verify PORT in `.env` matches `serverUrl` in UserContext.jsx
- Check for CORS errors in browser console

### Issue: Voice not detected
**Solution:**
- Speak clearly and at normal volume
- Make sure you say the assistant name first
- Check microphone is not muted
- Try moving closer to microphone
- Reduce background noise

---

## 📱 Browser Compatibility

| Browser | Voice Recognition | Text-to-Speech | Recommended |
|---------|-------------------|----------------|-------------|
| Chrome  | ✅ Excellent      | ✅ Excellent   | ⭐ YES     |
| Edge    | ✅ Excellent      | ✅ Excellent   | ⭐ YES     |
| Firefox | ⚠️ Limited        | ✅ Good        | ❌ No      |
| Safari  | ⚠️ Limited        | ✅ Good        | ❌ No      |

**Recommendation:** Use Google Chrome or Microsoft Edge for the best experience!

---

## 🔒 Security Notes

### For Development:
- The current setup is for development only
- `secure: false` in cookie settings (okay for localhost)
- CORS allows `localhost:5174`

### For Production:
- Set `secure: true` for cookies (HTTPS only)
- Update CORS origin to your production domain
- Use strong JWT_SECRET (minimum 32 characters)
- Enable MongoDB authentication
- Never commit `.env` file to GitHub

---

## 📊 Project Structure

```
QuickAi-main/
├── client/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/      # All pages (SignIn, SignUp, Home, etc.)
│   │   ├── context/    # UserContext for state management
│   │   └── index.css   # Global styles with animations
│   └── package.json
│
├── server/              # Backend (Node.js + Express)
│   ├── controllers/    # Business logic
│   ├── routes/         # API endpoints
│   ├── models/         # Database schemas
│   ├── middleware/     # Auth & file upload
│   ├── config/         # DB connection & JWT
│   ├── .env           # Environment variables (CREATE THIS!)
│   └── server.js      # Entry point
│
└── package.json        # Root dependencies
```

---

## 🎨 Features You'll Love

- ✨ **Modern Dark Theme** with animated gradients
- 🎭 **Glass Morphism UI** with blur effects
- 🎬 **Smooth Animations** throughout
- 🎤 **Natural Voice Interaction** - just like talking to a person
- 🤖 **Smart AI Responses** powered by Google Gemini
- 📱 **Fully Responsive** - works on all devices
- 🔐 **Secure Authentication** with JWT
- 🎨 **Customizable Assistant** - choose colors and names

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🆘 Need Help?

If you're stuck:
1. Check the troubleshooting section above
2. Look at browser console for errors (F12)
3. Check terminal output for server errors
4. Verify all environment variables are set correctly
5. Make sure all dependencies are installed

---

## ✅ Quick Test Checklist

After setup, verify:
- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:5174
- [ ] MongoDB connected successfully
- [ ] Can create an account (Sign Up works)
- [ ] Can login (Sign In works)
- [ ] Can customize assistant (choose avatar + name)
- [ ] Microphone permission granted
- [ ] Green mic button appears on home page
- [ ] Can click mic button and see "Listening..."
- [ ] AI responds when you say assistant name + command
- [ ] Can logout successfully

---

## 🎯 Ready to Get Full Marks!

Your project now has:
- ✅ Beautiful, modern UI/UX
- ✅ Smooth animations and effects
- ✅ Working authentication system
- ✅ Voice recognition functionality
- ✅ AI-powered responses
- ✅ Customization options
- ✅ Professional code quality
- ✅ Complete documentation

**Good luck with your presentation! 🚀🌟**

---

Made with ❤️ for your 100 marks project!

