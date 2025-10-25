import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

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
    console.log("startRecognition called");
    
    if (!recognitionRef.current) {
      console.error("Recognition not initialized");
      alert("Voice recognition not initialized. Please refresh the page.");
      return;
    }
    
    if (isRecognizingRef.current) {
      console.log("Already listening, ignoring request");
      return;
    }
    
    if (isSpeakingRef.current) {
      console.log("AI is speaking, please wait...");
      return;
    }
    
    try {
      console.log("Attempting to start recognition...");
      recognitionRef.current.start();
      console.log("Recognition start requested");
    } catch (error) {
      console.error("Start error:", error.name, error.message);
      
      if (error.name === "InvalidStateError") {
        console.log("Recognition in invalid state, trying to reset...");
        try {
          recognitionRef.current.stop();
        } catch (e) {}
        
        isRecognizingRef.current = false;
        setListening(false);
        
        setTimeout(() => {
          try {
            recognitionRef.current.start();
            console.log("Recognition restarted after reset");
          } catch (e2) {
            console.error("Still failed:", e2);
            alert("Voice recognition stuck. Please refresh the page (Cmd+Shift+R)");
          }
        }, 300);
      } else {
        alert("Error starting voice recognition: " + error.message);
      }
    }
  }

  const speak=(text)=>{
    console.log("AI will speak:", text);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log("Stopped recognition for AI speech");
      } catch(e) {
        console.log("Recognition already stopped");
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
      console.log("AI is now speaking");
      isSpeakingRef.current = true;
    }
    
    utterence.onend = ()=>{
      console.log("AI finished speaking");
      isSpeakingRef.current = false;
      setTimeout(() => {
        setAiText("");
      }, 2000);
    }
    
    utterence.onerror = (e) => {
      console.error("Speech error:", e);
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
      console.log("Microphone is now active!");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      console.log("Microphone stopped");
      isRecognizingRef.current = false;
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      
      isRecognizingRef.current = false;
      setListening(false);
      
      if (event.error === "not-allowed") {
        alert("Microphone permission denied! Please allow microphone access in your browser settings and refresh the page.");
      } else if (event.error === "no-speech") {
        console.log("No speech detected. Click Start Listening again.");
      } else if (event.error === "aborted") {
        console.log("Recognition was aborted (this is OK if intentional)");
      } else {
        console.log("Error:", event.error);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);
      
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        console.log("Assistant name detected! Processing command...");
        
        try {
          recognition.stop();
        } catch(e) {}
        isRecognizingRef.current = false;
        setListening(false);
        
        setUserText(transcript);
        
        try {
          const data = await getGeminiResponse(transcript);
          console.log("AI Response:", data);
          handleCommand(data);
          setUserText("");
        } catch (error) {
          console.error("Error getting response:", error);
          setAiText("Sorry, I couldn't process that.");
          speak("Sorry, I couldn't process that.");
        }
      } else {
        console.log("Assistant name not detected in:", transcript);
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
      console.log("Voice recognition stopped");
    }
  }

  return (
    <div className='w-full h-screen mesh-gradient flex flex-col relative overflow-hidden'>
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Floating Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>

      {/* Top Navigation - Fixed */}
      <div className='absolute top-0 left-0 right-0 z-50 p-6'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          {/* Logo/Brand */}
          <div className='glass-premium rounded-2xl px-5 py-3 flex items-center gap-3 animate-slide-up shadow-2xl'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg animate-pulse-glow'>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className='text-white font-bold text-xl tracking-tight hidden sm:block'>QuickAI</span>
          </div>

          {/* Desktop Buttons */}
          <div className='hidden lg:flex gap-4 animate-slide-up' style={{animationDelay: '0.1s'}}>
            <button 
              onClick={()=>navigate("/customize")}
              className='glass-premium rounded-2xl px-6 py-3 text-white font-medium hover-lift transition-all flex items-center gap-2.5 shadow-xl group'
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Customize</span>
            </button>
            <button 
              onClick={handleLogOut}
              className='glass-premium rounded-2xl px-6 py-3 text-white font-medium hover-lift transition-all flex items-center gap-2.5 shadow-xl group'
            >
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className='lg:hidden glass-premium rounded-2xl p-3 animate-slide-up shadow-xl'
            onClick={()=>setHam(true)}
            style={{animationDelay: '0.1s'}}
          >
            <CgMenuRight className='text-white w-6 h-6'/>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed lg:hidden top-0 right-0 w-full h-full glass-dark backdrop-blur-3xl p-8 flex flex-col gap-6 z-50 transition-all duration-500 ${ham?"translate-x-0 opacity-100":"translate-x-full opacity-0"}`}>
        <button 
          className='self-end glass-premium rounded-full p-3 hover:rotate-90 transition-transform duration-300'
          onClick={()=>setHam(false)}
        >
          <RxCross1 className='text-white w-6 h-6'/>
        </button>
        
        <div className='flex flex-col gap-5 mt-10'>
          <button 
            className='glass-premium rounded-2xl px-8 py-5 text-white font-semibold text-lg hover-lift flex items-center gap-4 shadow-xl group' 
            onClick={()=>{setHam(false); navigate("/customize")}}
          >
            <svg className="w-7 h-7 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Customize Assistant</span>
          </button>
          <button 
            className='glass-premium rounded-2xl px-8 py-5 text-white font-semibold text-lg hover-lift flex items-center gap-4 shadow-xl group' 
            onClick={handleLogOut}
          >
            <svg className="w-7 h-7 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className='flex-1 flex flex-col items-center justify-center px-6 pb-6 pt-24 relative z-10 max-w-4xl mx-auto w-full'>
        {/* Assistant Avatar with Advanced Animation */}
        <div className='mb-8 animate-scale-in'>
          <div className='relative group'>
            <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden glass-premium shadow-2xl transition-all duration-500 ${aiText ? 'animate-pulse-glow scale-110' : 'scale-100'} ${listening ? 'ring-4 ring-green-400 ring-opacity-50' : ''}`}>
              <img 
                src={userData?.assistantImage} 
                alt="Assistant" 
                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
              />
            </div>
            {/* Status Ring */}
            {listening && (
              <div className='absolute -bottom-3 left-1/2 transform -translate-x-1/2 glass-premium rounded-full px-6 py-2 shadow-xl animate-slide-up'>
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

        {/* Assistant Name with Gradient */}
        <div className='text-center mb-8 animate-slide-up' style={{animationDelay: '0.2s'}}>
          <h1 className='text-white text-5xl md:text-6xl font-bold mb-3 tracking-tight'>
            {userData?.assistantName}
          </h1>
          <p className='text-slate-300 text-lg md:text-xl font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
            Your AI Voice Assistant
          </p>
        </div>

        {/* Status Display with Premium Card */}
        <div className='glass-premium rounded-3xl p-8 min-w-[320px] max-w-xl w-full text-center animate-slide-up shadow-2xl mb-8' style={{animationDelay: '0.3s'}}>
          {userText && (
            <div className='mb-6 animate-slide-up'>
              <div className='flex items-center justify-center gap-2 mb-3'>
                <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                <p className='text-blue-400 text-sm font-semibold uppercase tracking-wider'>You said</p>
              </div>
              <p className='text-white text-xl md:text-2xl font-bold'>{userText}</p>
            </div>
          )}
          {aiText && (
            <div className='animate-slide-up'>
              <div className='flex items-center justify-center gap-2 mb-3'>
                <div className='w-2 h-2 bg-purple-400 rounded-full animate-pulse'></div>
                <p className='text-purple-400 text-sm font-semibold uppercase tracking-wider'>{userData?.assistantName} says</p>
              </div>
              <p className='text-white text-xl md:text-2xl font-bold'>{aiText}</p>
            </div>
          )}
          {!userText && !aiText && listening && (
            <div className='flex flex-col items-center gap-4 animate-pulse'>
              <div className='flex items-center gap-3'>
                <div className='w-3 h-3 bg-green-400 rounded-full animate-ping'></div>
                <p className='text-green-400 text-2xl font-bold'>Listening...</p>
              </div>
              <p className='text-slate-300 text-base'>Say "<span className='text-white font-bold text-lg'>{userData?.assistantName}</span>" to activate</p>
            </div>
          )}
          {!userText && !aiText && !listening && (
            <div className='py-2'>
              <p className='text-slate-300 text-lg'>Click the microphone to start</p>
            </div>
          )}
        </div>

        {/* Microphone Button - Larger and More Prominent */}
        <div className='animate-slide-up mb-8' style={{animationDelay: '0.4s'}}>
          {!listening ? (
            <button 
              onClick={startRecognition}
              className='w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 hover:from-green-500 hover:to-teal-700 flex items-center justify-center shadow-2xl hover-lift transition-all group relative overflow-hidden'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
              <FaMicrophone className='text-white w-14 h-14 md:w-16 md:h-16 group-hover:scale-110 transition-transform relative z-10' />
            </button>
          ) : (
            <button 
              onClick={stopRecognition}
              className='w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-red-400 via-rose-500 to-pink-600 hover:from-red-500 hover:to-pink-700 flex items-center justify-center shadow-2xl animate-pulse-glow transition-all group relative overflow-hidden'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent'></div>
              <FaMicrophoneSlash className='text-white w-14 h-14 md:w-16 md:h-16 group-hover:scale-110 transition-transform relative z-10' />
            </button>
          )}
        </div>

        {/* Quick Tips - Premium Card */}
        <div className='glass-premium rounded-2xl p-5 max-w-2xl w-full animate-slide-up shadow-xl' style={{animationDelay: '0.5s'}}>
          <div className='flex items-start gap-4'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg'>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className='text-blue-400 font-bold text-sm uppercase tracking-wider mb-2'>Pro Tips</p>
              <p className='text-slate-200 text-sm md:text-base leading-relaxed'>
                Try: "<span className='text-white font-semibold'>{userData?.assistantName}, what time is it?</span>" 
                or "<span className='text-white font-semibold'>{userData?.assistantName}, tell me a joke</span>"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
