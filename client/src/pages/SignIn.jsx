import React, { useContext, useState } from 'react'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from "axios"

function SignIn() {
  const [showPassword,setShowPassword]=useState(false)
  const {serverUrl,userData,setUserData}=useContext(userDataContext)
  const navigate=useNavigate()
  const [email,setEmail]=useState("")
  const [loading,setLoading]=useState(false)
  const [password,setPassword]=useState("")
  const [err,setErr]=useState("")
  
  const handleSignIn=async (e)=>{
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      let result=await axios.post(`${serverUrl}/api/auth/signin`,{
        email,password
      },{withCredentials:true})
      setUserData(result.data)
      setLoading(false)
      navigate("/")
    } catch (error) {
      console.log(error)
      setUserData(null)
      setLoading(false)
      setErr(error.response.data.message)
    }
  }
  
  return (
    <div className='w-full min-h-screen animated-gradient flex justify-center items-center p-6 relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
      
      {/* Sign In Form */}
      <form className='w-full max-w-md glass rounded-3xl p-8 md:p-10 flex flex-col gap-6 animate-scale-in relative z-10' onSubmit={handleSignIn}>
        {/* Logo */}
        <div className='flex justify-center mb-4'>
          <div className='relative'>
            <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg'>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900'></div>
          </div>
        </div>
        
        {/* Title */}
        <div className='text-center space-y-2 mb-2'>
          <h1 className='text-white text-4xl font-bold tracking-tight'>Welcome Back</h1>
          <p className='text-slate-400 text-base'>Sign in to <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold'>QuickAI</span></p>
        </div>

        {/* Email Input */}
        <div className='space-y-2'>
          <label className='text-gray-300 text-sm font-medium ml-2'>Email Address</label>
          <input 
            type="email" 
            placeholder='you@example.com' 
            className='w-full h-14 outline-none border-2 border-white/20 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder-gray-400 px-5 py-3 rounded-2xl text-base transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30' 
            required 
            onChange={(e)=>setEmail(e.target.value)} 
            value={email}
          />
        </div>

        {/* Password Input */}
        <div className='space-y-2'>
          <label className='text-gray-300 text-sm font-medium ml-2'>Password</label>
          <div className='w-full h-14 border-2 border-white/20 bg-white/5 hover:bg-white/10 focus-within:bg-white/10 text-white rounded-2xl relative transition-all duration-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/30'>
            <input 
              type={showPassword?"text":"password"} 
              placeholder='Enter your password' 
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
          <div className='glass-dark rounded-xl p-3.5 border-l-4 border-red-500 flex items-start gap-3'>
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className='text-red-400 text-sm font-medium'>{err}</p>
          </div>
        )}

        {/* Submit Button */}
        <button 
          className='w-full h-14 mt-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-2xl text-lg transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed shadow-lg' 
          disabled={loading}
        >
          {loading ? (
            <span className='flex items-center justify-center gap-2'>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </span>
          ) : "Sign In"}
        </button>

        {/* Sign Up Link */}
        <p className='text-gray-300 text-center mt-4'>
          Don't have an account? <span className='text-blue-400 hover:text-blue-300 cursor-pointer font-semibold transition-colors' onClick={()=>navigate("/signup")}>Sign Up</span>
        </p>
      </form>
    </div>
  )
}

export default SignIn
