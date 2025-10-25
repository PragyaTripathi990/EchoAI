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
        className='absolute top-8 left-8 glass rounded-2xl px-4 py-2.5 hover-lift group z-10 flex items-center gap-2'
      >
        <MdKeyboardBackspace className='text-white w-5 h-5 group-hover:-translate-x-1 transition-transform'/>
        <span className='text-white font-medium text-sm'>Back</span>
      </button>

      {/* Main Content */}
      <div className='w-full max-w-2xl glass rounded-3xl p-8 md:p-12 flex flex-col gap-8 animate-scale-in relative z-10'>
        {/* Header */}
        <div className='text-center'>
          <div className='flex justify-center mb-6'>
            <div className='relative'>
              <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-xl'>
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div className='absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-slate-900'></div>
            </div>
          </div>
          <h1 className='text-white text-4xl md:text-5xl font-bold mb-4 tracking-tight'>
            Name Your Assistant
          </h1>
          <p className='text-slate-400 text-lg max-w-xl mx-auto'>Give your AI companion a unique identity. Choose something memorable and easy to say.</p>
        </div>

        {/* Name Input */}
        <div className='space-y-3'>
          <label className='text-slate-300 text-base font-medium ml-2 block'>Assistant Name</label>
          <input 
            type="text" 
            placeholder='e.g., Jarvis, Friday, Nova...' 
            className='w-full h-16 outline-none border-2 border-white/20 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white text-xl placeholder-gray-400 px-6 py-4 rounded-2xl transition-all duration-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/30 text-center font-semibold' 
            required 
            onChange={(e)=>setAssistantName(e.target.value)} 
            value={assistantName}
            maxLength={20}
          />
          <div className='flex items-center justify-center gap-2 text-slate-400 text-sm'>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>You'll say this name to activate your assistant</span>
          </div>
        </div>

        {/* Suggestions */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2 justify-center'>
            <div className='h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
            <p className='text-slate-400 text-sm font-medium'>Popular Names</p>
            <div className='h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
          </div>
          <div className='flex flex-wrap justify-center gap-3'>
            {suggestions.map((name) => (
              <button
                key={name}
                onClick={() => setAssistantName(name)}
                className='px-5 py-2.5 glass-dark rounded-xl text-white text-sm font-medium hover-lift hover:bg-white/10 transition-all border border-white/10 hover:border-white/20'
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Card */}
        {assistantName && (
          <div className='glass-dark rounded-2xl p-6 animate-slide-up border border-white/10 shadow-xl'>
            <div className='flex items-center gap-2 mb-4'>
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <p className='text-slate-400 text-sm font-medium'>Preview</p>
            </div>
            <div className='flex items-center justify-center gap-5'>
              <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg'>
                <span className='text-white text-2xl font-bold'>
                  {assistantName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className='text-white text-2xl font-bold tracking-tight'>{assistantName}</p>
                <p className='text-slate-400 text-sm'>Your AI Assistant</p>
              </div>
            </div>
          </div>
        )}

        {/* Create Button */}
        <button 
          className={`
            w-full h-16 rounded-2xl text-xl font-bold transition-all duration-300 flex items-center justify-center gap-3
            ${assistantName.trim() 
              ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white hover-lift shadow-xl' 
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'}
          `}
          disabled={loading || !assistantName.trim()} 
          onClick={(e)=>{
            e.preventDefault();
            handleUpdateAssistant();
          }}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating Your Assistant...</span>
            </>
          ) : (
            <>
              <span>Create Your Assistant</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>

        {/* Info Box */}
        <div className='glass-dark rounded-xl p-4 border-l-4 border-blue-500 flex items-start gap-3'>
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className='text-slate-300 text-sm'>
            <span className='font-semibold text-white'>Pro Tip:</span> Choose a name that's easy to pronounce. 
            You'll say "<span className='text-blue-400 font-semibold'>{assistantName || 'YourName'}</span>, what time is it?" 
            to activate your assistant.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Customize2
