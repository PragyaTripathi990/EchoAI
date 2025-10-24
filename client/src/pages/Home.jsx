import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
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
        // Force stop first
        try {
          recognitionRef.current.stop();
        } catch (e) {}
        
        isRecognizingRef.current = false;
        setListening(false);
        
        // Try again after a moment
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
    
    // IMPORTANT: Stop recognition before AI speaks
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log("🛑 Stopped recognition for AI speech");
      } catch(e) {
        console.log("⚠️ Recognition already stopped");
      }
    }
    
    // Force update state
    isRecognizingRef.current = false;
    setListening(false);
    isSpeakingRef.current = true;
    setAiText(text);
    
    // Cancel any ongoing speech
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
    
    // Handle time/date commands with actual values
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
    
    // For all other commands, speak the AI's response
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

  recognition.continuous = false;  // Changed to false - simpler
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
    
    // Clean up state
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
      
      // Stop listening immediately
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
    isMounted = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
    isRecognizingRef.current = false;
  };
}, []);




  const stopRecognition = () => {
    if (recognitionRef.current && isRecognizingRef.current) {
      recognitionRef.current.stop();
      isRecognizingRef.current = false;
      setListening(false);
      console.log("🛑 Voice recognition stopped");
    }
  }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
      <div className='absolute top-[20px] left-[20px] z-50 flex flex-col gap-2'>
        {!listening ? (
          <button 
            onClick={startRecognition}
            className='px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition shadow-lg'
          >
            🎤 START LISTENING
          </button>
        ) : (
          <button 
            onClick={stopRecognition}
            className='px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition shadow-lg animate-pulse'
          >
            🛑 STOP LISTENING
          </button>
        )}
        <p className='text-white text-xs bg-black bg-opacity-50 px-3 py-2 rounded'>
          Say: "<strong>{userData?.assistantName}</strong>, what time is it?"
        </p>
      </div>
      <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(true)}/>
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
 <RxCross1 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(false)}/>
 <button className='min-w-[150px] h-[60px]  text-black font-semibold   bg-white rounded-full cursor-pointer text-[19px] ' onClick={handleLogOut}>Log Out</button>
      <button className='min-w-[150px] h-[60px]  text-black font-semibold  bg-white  rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] ' onClick={()=>navigate("/customize")}>Customize your Assistant</button>

<div className='w-full h-[2px] bg-gray-400'></div>
<h1 className='text-white font-semibold text-[19px]'>History</h1>

<div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
  {userData.history?.map((his)=>(
    <div className='text-gray-200 text-[18px] w-full h-[30px]  '>{his}</div>
  ))}

</div>

      </div>
      <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px]  bg-white rounded-full cursor-pointer text-[19px] ' onClick={handleLogOut}>Log Out</button>
      <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold  bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block ' onClick={()=>navigate("/customize")}>Customize your Assistant</button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
<img src={userData?.assistantImage} alt="" className='h-full object-cover'/>
      </div>
      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
      {!aiText && <div className='w-[200px] h-[200px] bg-gray-500 rounded-full flex items-center justify-center'>
        <span className='text-white text-6xl'>{listening ? '🎤' : '😴'}</span>
      </div>}
      {aiText && <div className='w-[200px] h-[200px] bg-blue-500 rounded-full animate-pulse flex items-center justify-center'>
        <span className='text-white text-6xl'>🤖</span>
      </div>}
    
    <div className='text-center px-4'>
      {userText && <h1 className='text-yellow-300 text-[18px] font-semibold mb-2'>You: {userText}</h1>}
      {aiText && <h1 className='text-white text-[18px] font-semibold'>{aiText}</h1>}
      {!userText && !aiText && listening && <h1 className='text-gray-300 text-[16px]'>Listening... Say "{userData?.assistantName}" to activate</h1>}
      {!userText && !aiText && !listening && <h1 className='text-gray-400 text-[16px]'>Click "Start Voice" button to begin</h1>}
    </div>
      
    </div>
  )
}

export default Home