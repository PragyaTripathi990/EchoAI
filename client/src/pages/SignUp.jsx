import React, { useContext, useState } from 'react'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from "axios"

function SignUp() {
  const [showPassword,setShowPassword]=useState(false)
  const {serverUrl,userData,setUserData}=useContext(userDataContext)
  const navigate=useNavigate()
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [loading,setLoading]=useState(false)
  const [password,setPassword]=useState("")
  const [err,setErr]=useState("")
  
  const handleSignUp=async (e)=>{
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      let result=await axios.post(`${serverUrl}/api/auth/signup`,{
        name,email,password
      },{withCredentials:true})
      setUserData(result.data)
      setLoading(false)
      navigate("/customize")
    } catch (error) {
      console.log(error)
      setUserData(null)
      setLoading(false)
      if (error.response && error.response.data && error.response.data.message) {
        setErr(error.response.data.message)
      } else {
        setErr("An unexpected error occurred. Please try again.")
      }
    }
  }
  
  return (
    <div className='w-full min-h-screen animated-gradient flex justify-center items-center p-6 relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
      
      {/* Sign Up Form */}
      <form className='w-full max-w-md glass rounded-3xl p-8 md:p-10 flex flex-col gap-5 animate-scale-in relative z-10' onSubmit={handleSignUp}>
        {/* Logo/Icon */}
        <div className='flex justify-center mb-2'>
          <div className='w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center animate-pulse-glow'>
            <span className='text-4xl'>✨</span>
          </div>
        </div>
        
        {/* Title */}
        <div className='text-center space-y-2'>
          <h1 className='text-white text-4xl font-bold tracking-tight'>Create Account</h1>
          <p className='text-gray-300 text-lg'>Join <span className='gradient-text-blue font-semibold'>QuickAI</span> today</p>
        </div>

        {/* Name Input */}
        <div className='space-y-2'>
          <label className='text-gray-300 text-sm font-medium ml-2'>Full Name</label>
          <input 
            type="text" 
            placeholder='John Doe' 
            className='w-full h-14 outline-none border-2 border-white/20 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder-gray-400 px-5 py-3 rounded-2xl text-base transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30' 
            required 
            onChange={(e)=>setName(e.target.value)} 
            value={name}
          />
        </div>

        {/* Email Input */}
        <div className='space-y-2'>
          <label className='text-gray-300 text-sm font-medium ml-2'>Email Address</label>
          <input 
            type="email" 
            placeholder='you@example.com' 
            className='w-full h-14 outline-none border-2 border-white/20 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder-gray-400 px-5 py-3 rounded-2xl text-base transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30' 
            required 
            onChange={(e)=>setEmail(e.target.value)} 
            value={email}
          />
        </div>

        {/* Password Input */}
        <div className='space-y-2'>
          <label className='text-gray-300 text-sm font-medium ml-2'>Password</label>
          <div className='w-full h-14 border-2 border-white/20 bg-white/5 hover:bg-white/10 focus-within:bg-white/10 text-white rounded-2xl relative transition-all duration-300 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/30'>
            <input 
              type={showPassword?"text":"password"} 
              placeholder='Minimum 6 characters' 
              className='w-full h-full rounded-2xl outline-none bg-transparent placeholder-gray-400 px-5 py-3 pr-14' 
              required 
              onChange={(e)=>setPassword(e.target.value)} 
              value={password}
            />
            {!showPassword && <IoEye className='absolute top-4 right-5 w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors' onClick={()=>setShowPassword(true)}/>}
            {showPassword && <IoEyeOff className='absolute top-4 right-5 w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors' onClick={()=>setShowPassword(false)}/>}
          </div>
        </div>

        {/* Error Message */}
        {err.length>0 && (
          <div className='glass-dark rounded-xl p-3 border-l-4 border-red-500'>
            <p className='text-red-400 text-sm font-medium'>⚠️ {err}</p>
          </div>
        )}

        {/* Submit Button */}
        <button 
          className='w-full h-14 mt-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold rounded-2xl text-lg transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed shadow-lg' 
          disabled={loading}
        >
          {loading ? (
            <span className='flex items-center justify-center gap-2'>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : "Create Account"}
        </button>

        {/* Sign In Link */}
        <p className='text-gray-300 text-center mt-2'>
          Already have an account? <span className='text-purple-400 hover:text-purple-300 cursor-pointer font-semibold transition-colors' onClick={()=>navigate("/signin")}>Sign In</span>
        </p>
      </form>
    </div>
  )
}

export default SignUp
