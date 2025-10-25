import React, { useContext, useEffect, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Customize2() {
  const {userData,backendImage,selectedImage,serverUrl,setUserData}=useContext(userDataContext)
  const [assistantName,setAssistantName]=useState(userData?.AssistantName || "")
  const [loading,setLoading]=useState(false)
  const navigate=useNavigate()

  useEffect(() => {
    console.log("Customize2 page loaded")
    console.log("userData:", userData)
    console.log("selectedImage from context:", selectedImage)
    console.log("backendImage from context:", backendImage)
  }, [])

  const handleUpdateAssistant=async ()=>{
    console.log("Button clicked! Creating assistant...")
    console.log("Assistant name:", assistantName)
    console.log("Selected image:", selectedImage)
    console.log("Backend image:", backendImage)
    
    setLoading(true)
    try {
      let formData=new FormData()
      formData.append("assistantName",assistantName)
      if(backendImage){
        formData.append("assistantImage",backendImage)
      }else{
        formData.append("imageUrl",selectedImage)
      }
      
      console.log("Sending request to:", `${serverUrl}/api/user/update`)
      const result=await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
      setLoading(false)
      console.log("Success! Result:", result.data)
      setUserData(result.data)
      navigate("/")
    } catch (error) {
      setLoading(false)
      console.error("Error creating assistant:", error)
      console.error("Error response:", error.response?.data)
      alert("Error: " + (error.response?.data?.message || error.message))
    }
  }

  const suggestions = ['Jarvis', 'Friday', 'Alexa', 'Cortana', 'Nova', 'Atlas', 'Echo'];

  return (
    <div className='w-full min-h-screen animated-gradient flex justify-center items-center p-6 relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
      
      {/* Back Button */}
      <button 
        onClick={()=>navigate("/customize")}
        className='absolute top-8 left-8 glass rounded-full p-3 hover-lift group z-10'
      >
        <MdKeyboardBackspace className='text-white w-7 h-7 group-hover:scale-110 transition-transform'/>
      </button>

      {/* Main Content */}
      <div className='w-full max-w-2xl glass rounded-3xl p-8 md:p-12 flex flex-col gap-8 animate-scale-in relative z-10'>
        {/* Header */}
        <div className='text-center'>
          <div className='flex justify-center mb-6'>
            <div className='w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center animate-pulse-glow'>
              <span className='text-5xl'>✨</span>
            </div>
          </div>
          <h1 className='text-white text-4xl md:text-5xl font-bold mb-3 tracking-tight'>
            Name Your Assistant
          </h1>
          <p className='text-gray-300 text-lg'>Give your AI companion a unique identity</p>
        </div>

        {/* Name Input */}
        <div className='space-y-3'>
          <label className='text-gray-300 text-base font-medium ml-2 block'>Assistant Name</label>
          <input 
            type="text" 
            placeholder='e.g., Jarvis, Friday, Nova...' 
            className='w-full h-16 outline-none border-2 border-white/20 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white text-xl placeholder-gray-400 px-6 py-4 rounded-2xl transition-all duration-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/30 text-center font-semibold' 
            required 
            onChange={(e)=>setAssistantName(e.target.value)} 
            value={assistantName}
            maxLength={20}
          />
          <p className='text-gray-400 text-sm text-center'>
            You'll say this name to activate your assistant
          </p>
        </div>

        {/* Suggestions */}
        <div className='space-y-3'>
          <p className='text-gray-300 text-sm font-medium text-center'>Popular Names</p>
          <div className='flex flex-wrap justify-center gap-2'>
            {suggestions.map((name) => (
              <button
                key={name}
                onClick={() => setAssistantName(name)}
                className='px-4 py-2 glass-dark rounded-full text-white text-sm font-medium hover-lift hover:bg-white/10 transition-all'
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Card */}
        {assistantName && (
          <div className='glass-dark rounded-2xl p-6 animate-slide-up border border-white/10'>
            <p className='text-gray-400 text-sm mb-2 text-center'>Preview</p>
            <div className='flex items-center justify-center gap-4'>
              <div className='w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center'>
                <span className='text-3xl'>🤖</span>
              </div>
              <div>
                <p className='text-white text-2xl font-bold'>{assistantName}</p>
                <p className='text-gray-400 text-sm'>Your AI Assistant</p>
              </div>
            </div>
          </div>
        )}

        {/* Create Button */}
        <button 
          className={`
            w-full h-16 rounded-2xl text-xl font-bold transition-all duration-300 
            ${assistantName.trim() 
              ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white hover-lift shadow-xl' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
          `}
          disabled={loading || !assistantName.trim()} 
          onClick={(e)=>{
            e.preventDefault();
            handleUpdateAssistant();
          }}
        >
          {loading ? (
            <span className='flex items-center justify-center gap-3'>
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Your Assistant...
            </span>
          ) : (
            <span>🚀 Create Your Assistant</span>
          )}
        </button>

        {/* Info Box */}
        <div className='glass-dark rounded-xl p-4 border-l-4 border-blue-500'>
          <p className='text-gray-300 text-sm'>
            <span className='font-semibold text-white'>💡 Tip:</span> Choose a name that's easy to pronounce. 
            You'll say "<span className='text-blue-400 font-semibold'>{assistantName || 'YourName'}</span>, what time is it?" 
            to activate your assistant.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Customize2
