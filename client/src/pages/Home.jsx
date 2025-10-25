import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

function Home() {
  const {userData,serverUrl,setUserData,getGeminiResponse}=useContext(userDataContext)
  const navigate=useNavigate()
  const [listening,setListening]=useState(false)
  const [userText,setUserText]=useState("")
  const [aiText,setAiText]=useState("")
  const isSpeakingRef=useRef(false)
  const recognitionRef=useRef(null)
  const [ham,setHam]=useState(false)
  const isRecognizingRef=useRef(false)
  const synth=window.speechSynthesis
  const [hasGreeted, setHasGreeted]=useState(false)

  const handleLogOut=async ()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  // AI Greeting on first load
  useEffect(() => {
    if (userData && !hasGreeted) {
      const greetingTimeout = setTimeout(() => {
        const hour = new Date().getHours();
        let greeting = "";
        if (hour < 12) {
          greeting = `Good morning! I'm ${userData.assistantName}, your AI assistant. I'm here to help you today.`;
        } else if (hour < 18) {
          greeting = `Good afternoon! I'm ${userData.assistantName}, your AI assistant. How can I help you?`;
        } else {
          greeting = `Good evening! I'm ${userData.assistantName}, your AI assistant. Ready to assist you.`;
        }
        speak(greeting);
        setHasGreeted(true);
      }, 1000);

      return () => clearTimeout(greetingTimeout);
    }
  }, [userData]);

  const startRecognition = () => {
    console.log("🔵 startRecognition called");
    
    if (!recognitionRef.current) {
      console.error("❌ Recognition not initialized");
      alert("Voice recognition not initialized. Please refresh the page.");
      return;
    }
    
    if (isRecognizingRef.current) {
      console.log("⚠️ Already listening, ignoring request");
      return;
    }
    
    if (isSpeakingRef.current) {
      console.log("⚠️ AI is speaking, please wait...");
      return;
    }
    
    try {
      console.log("🎤 Attempting to start recognition...");
      recognitionRef.current.start();
      console.log("✅ Recognition start requested");
    } catch (error) {
      console.error("❌ Start error:", error.name, error.message);
      
      if (error.name === "InvalidStateError") {
        console.log("⚠️ Recognition in invalid state, trying to reset...");
        try {
          recognitionRef.current.stop();
        } catch (e) {}
        
        isRecognizingRef.current = false;
        setListening(false);
        
        setTimeout(() => {
          try {
            recognitionRef.current.start();
            console.log("✅ Recognition restarted after reset");
          } catch (e2) {
            console.error("❌ Still failed:", e2);
            alert("Voice recognition stuck. Please refresh the page (Cmd+Shift+R)");
          }
        }, 300);
      } else {
        alert("Error starting voice recognition: " + error.message);
      }
    }
  }

  const speak=(text)=>{
    console.log("🗣️ AI will speak:", text);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log("🛑 Stopped recognition for AI speech");
      } catch(e) {
        console.log("⚠️ Recognition already stopped");
      }
    }
    
    isRecognizingRef.current = false;
    setListening(false);
    isSpeakingRef.current = true;
    setAiText(text);
    
    window.speechSynthesis.cancel();
    
    const utterence=new SpeechSynthesisUtterance(text)
    utterence.lang = 'en-US';
    utterence.rate = 1.0;
    utterence.pitch = 1.0;
    
    utterence.onstart = () => {
      console.log("🗣️ AI is now speaking");
      isSpeakingRef.current = true;
    }
    
    utterence.onend = ()=>{
      console.log("✅ AI finished speaking");
      isSpeakingRef.current = false;
      setTimeout(() => {
        setAiText("");
      }, 2000);
    }
    
    utterence.onerror = (e) => {
      console.error("❌ Speech error:", e);
      isSpeakingRef.current = false;
    }
    
    window.speechSynthesis.speak(utterence);
  }

  const handleCommand=(data)=>{
    const {type,userInput,response}=data
    
    if (type === 'get_time') {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      speak(`The time is ${timeStr}`);
      return;
    }
    
    if (type === 'get_date') {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      speak(`Today's date is ${dateStr}`);
      return;
    }
    
    if (type === 'get_day') {
      const now = new Date();
      const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' });
      speak(`Today is ${dayStr}`);
      return;
    }
    
    if (type === 'get_month') {
      const now = new Date();
      const monthStr = now.toLocaleDateString('en-US', { month: 'long' });
      speak(`The current month is ${monthStr}`);
      return;
    }
    
    speak(response);
    
    if (type === 'google-search' || type === 'google_search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
    
    if (type === 'calculator-open' || type === 'calculator_open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
    
    if (type === "instagram-open" || type === 'instagram_open') {
      window.open(`https://www.instagram.com/`, '_blank');
    }
    
    if (type ==="facebook-open" || type === 'facebook_open') {
      window.open(`https://www.facebook.com/`, '_blank');
    }
    
    if (type ==="weather-show" || type === 'weather_show') {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }

    if (type === 'youtube-search' || type === 'youtube_search' || type === 'youtube-play' || type === 'youtube_play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser doesn't support voice recognition. Please use Chrome or Edge.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log("🎤 Microphone is now active!");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      console.log("🛑 Microphone stopped");
      isRecognizingRef.current = false;
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("❌ Recognition error:", event.error);
      
      isRecognizingRef.current = false;
      setListening(false);
      
      if (event.error === "not-allowed") {
        alert("❌ Microphone permission denied! Please allow microphone access in your browser settings and refresh the page.");
      } else if (event.error === "no-speech") {
        console.log("⚠️ No speech detected. Click Start Listening again.");
      } else if (event.error === "aborted") {
        console.log("ℹ️ Recognition was aborted (this is OK if intentional)");
      } else {
        console.log("⚠️ Error:", event.error);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("🎤 Heard:", transcript);
      
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        console.log("✅ Assistant name detected! Processing command...");
        
        try {
          recognition.stop();
        } catch(e) {}
        isRecognizingRef.current = false;
        setListening(false);
        
        setUserText(transcript);
        
        try {
          const data = await getGeminiResponse(transcript);
          console.log("🤖 AI Response:", data);
          handleCommand(data);
          setUserText("");
        } catch (error) {
          console.error("❌ Error getting response:", error);
          setAiText("Sorry, I couldn't process that.");
          speak("Sorry, I couldn't process that.");
        }
      } else {
        console.log("⚠️ Assistant name not detected in:", transcript);
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, [userData]);

  const stopRecognition = () => {
    if (recognitionRef.current && isRecognizingRef.current) {
      recognitionRef.current.stop();
      isRecognizingRef.current = false;
      setListening(false);
      console.log("🛑 Voice recognition stopped");
    }
  }

  return (
    <div className='w-full min-h-screen animated-gradient flex flex-col relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '1s'}}></div>

      {/* Top Navigation */}
      <div className='absolute top-6 left-6 right-6 z-50 flex justify-between items-center'>
        {/* Logo/Brand */}
        <div className='glass rounded-2xl px-4 py-2 flex items-center gap-2'>
          <HiSparkles className='text-yellow-400 w-6 h-6' />
          <span className='text-white font-bold text-lg hidden sm:block'>QuickAI</span>
        </div>

        {/* Desktop Buttons */}
        <div className='hidden lg:flex gap-3'>
          <button 
            onClick={()=>navigate("/customize")}
            className='glass rounded-2xl px-6 py-3 text-white font-semibold hover-lift transition-all'
          >
            ⚙️ Customize
          </button>
          <button 
            onClick={handleLogOut}
            className='glass rounded-2xl px-6 py-3 text-white font-semibold hover-lift transition-all'
          >
            🚪 Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className='lg:hidden glass rounded-2xl p-3'
          onClick={()=>setHam(true)}
        >
          <CgMenuRight className='text-white w-6 h-6'/>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed lg:hidden top-0 right-0 w-full h-full glass-dark backdrop-blur-2xl p-8 flex flex-col gap-6 z-50 transition-transform ${ham?"translate-x-0":"translate-x-full"}`}>
        <button 
          className='self-end glass rounded-full p-3'
          onClick={()=>setHam(false)}
        >
          <RxCross1 className='text-white w-6 h-6'/>
        </button>
        
        <div className='flex flex-col gap-4'>
          <button 
            className='glass rounded-2xl px-6 py-4 text-white font-semibold text-lg hover-lift' 
            onClick={()=>{setHam(false); navigate("/customize")}}
          >
            ⚙️ Customize Assistant
          </button>
          <button 
            className='glass rounded-2xl px-6 py-4 text-white font-semibold text-lg hover-lift' 
            onClick={handleLogOut}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col items-center justify-center p-6 relative z-10 gap-8'>
        {/* Assistant Avatar */}
        <div className='animate-scale-in'>
          <div className='relative'>
            <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden glass shadow-2xl ${aiText ? 'animate-pulse-glow' : ''}`}>
              <img 
                src={userData?.assistantImage} 
                alt="Assistant" 
                className='w-full h-full object-cover'
              />
            </div>
            {listening && (
              <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 glass rounded-full px-6 py-2'>
                <div className='voice-wave flex items-center justify-center gap-1'>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assistant Name */}
        <div className='text-center animate-slide-up'>
          <h1 className='text-white text-3xl md:text-4xl font-bold mb-2'>
            {userData?.assistantName}
          </h1>
          <p className='text-gray-300 text-sm md:text-base'>Your AI Voice Assistant</p>
        </div>

        {/* Status Display */}
        <div className='glass rounded-2xl p-6 min-w-[300px] max-w-lg text-center animate-slide-up'>
          {userText && (
            <div className='mb-4'>
              <p className='text-blue-400 text-sm font-medium mb-1'>You said:</p>
              <p className='text-white text-lg font-semibold'>{userText}</p>
            </div>
          )}
          {aiText && (
            <div>
              <p className='text-purple-400 text-sm font-medium mb-1'>{userData?.assistantName} says:</p>
              <p className='text-white text-lg font-semibold'>{aiText}</p>
            </div>
          )}
          {!userText && !aiText && listening && (
            <div>
              <p className='text-green-400 text-lg font-semibold mb-2'>🎤 Listening...</p>
              <p className='text-gray-400 text-sm'>Say "<span className='text-white font-semibold'>{userData?.assistantName}</span>" to activate</p>
            </div>
          )}
          {!userText && !aiText && !listening && (
            <div>
              <p className='text-gray-400 text-base'>Click the microphone button below to start</p>
            </div>
          )}
        </div>

        {/* Microphone Button */}
        <div className='animate-slide-up'>
          {!listening ? (
            <button 
              onClick={startRecognition}
              className='w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 flex items-center justify-center shadow-2xl hover-lift transition-all group'
            >
              <FaMicrophone className='text-white w-10 h-10 md:w-12 md:h-12 group-hover:scale-110 transition-transform' />
            </button>
          ) : (
            <button 
              onClick={stopRecognition}
              className='w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 flex items-center justify-center shadow-2xl animate-pulse-glow transition-all group'
            >
              <FaMicrophoneSlash className='text-white w-10 h-10 md:w-12 md:h-12 group-hover:scale-110 transition-transform' />
            </button>
          )}
        </div>

        {/* Quick Tips */}
        <div className='glass rounded-2xl p-4 max-w-2xl animate-slide-up'>
          <p className='text-gray-300 text-xs md:text-sm text-center'>
            <span className='text-yellow-400 font-semibold'>💡 Try saying:</span> 
            <span className='text-white'> "{userData?.assistantName}, what time is it?"</span> or 
            <span className='text-white'> "{userData?.assistantName}, tell me a joke"</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
