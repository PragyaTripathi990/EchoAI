import React, { useContext, useEffect, useRef, useState } from 'react'
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {
  const {serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  const navigate=useNavigate()
  const inputImage=useRef()

  const handleImage=(e)=>{
    const file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleColorSelect = (color) => {
    console.log("Color selected:", color)
    setSelectedImage(color)
    console.log("Selected image after set:", color)
  }

  useEffect(() => {
    console.log("selectedImage changed to:", selectedImage)
  }, [selectedImage])

  const avatarColors = [
    { name: 'gray', bgClass: 'bg-gradient-to-br from-slate-400 via-gray-500 to-slate-600', label: 'Silver', icon: 'M' },
    { name: 'blue', bgClass: 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600', label: 'Ocean', icon: 'A' },
    { name: 'green', bgClass: 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600', label: 'Forest', icon: 'I' },
    { name: 'red', bgClass: 'bg-gradient-to-br from-rose-400 via-red-500 to-pink-600', label: 'Fire', icon: 'X' },
    { name: 'yellow', bgClass: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600', label: 'Sun', icon: 'S' },
    { name: 'purple', bgClass: 'bg-gradient-to-br from-purple-400 via-violet-500 to-fuchsia-600', label: 'Magic', icon: 'N' },
    { name: 'pink', bgClass: 'bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600', label: 'Rose', icon: 'V' }
  ]

  return (
    <div className='w-full min-h-screen animated-gradient flex justify-center items-center p-6 relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '1.5s'}}></div>
      
      {/* Back Button */}
      {userData?.assistantImage && userData?.assistantName && (
        <button 
          onClick={()=>navigate("/")}
          className='absolute top-8 left-8 glass rounded-2xl px-4 py-2.5 hover-lift group z-10 flex items-center gap-2'
        >
          <MdKeyboardBackspace className='text-white w-5 h-5 group-hover:-translate-x-1 transition-transform'/>
          <span className='text-white font-medium text-sm'>Back</span>
        </button>
      )}

      {/* Main Content */}
      <div className='w-full max-w-5xl glass rounded-3xl p-8 md:p-12 animate-scale-in relative z-10'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='flex justify-center mb-6'>
            <div className='relative'>
              <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl'>
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className='absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center'>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className='text-white text-4xl md:text-5xl font-bold mb-4 tracking-tight'>
            Choose Your Assistant Avatar
          </h1>
          <p className='text-slate-400 text-lg max-w-2xl mx-auto'>Select a style that represents your AI companion. Each avatar has a unique personality.</p>
        </div>

        {/* Avatar Selection Grid */}
        <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 mb-10'>
          {avatarColors.map((color, index) => (
            <div 
              key={color.name}
              className={`
                group cursor-pointer transition-all duration-300 animate-slide-up
                ${selectedImage === color.name ? 'scale-105' : 'hover:scale-105'}
              `}
              style={{animationDelay: `${index * 0.05}s`}}
              onClick={() => handleColorSelect(color.name)}
            >
              <div className={`
                aspect-[3/4] rounded-2xl ${color.bgClass} 
                flex items-center justify-center relative overflow-hidden
                ${selectedImage === color.name 
                  ? 'ring-4 ring-white shadow-2xl' 
                  : 'ring-2 ring-white/20 hover:ring-white/40'}
                transition-all duration-300
              `}>
                {/* Abstract Letter Design */}
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='text-white/20 text-[120px] font-bold leading-none select-none'>
                    {color.icon}
                  </div>
                </div>
                
                {/* Geometric Pattern Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
                
                {/* Selected Checkmark */}
                {selectedImage === color.name && (
                  <div className='absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg animate-scale-in'>
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <p className='text-white text-center mt-3 font-semibold text-sm md:text-base tracking-wide'>
                {color.label}
              </p>
            </div>
          ))}

          {/* Custom Upload Option */}
          <div 
            className={`
              group cursor-pointer transition-all duration-300 animate-slide-up
              ${selectedImage === "input" ? 'scale-105' : 'hover:scale-105'}
            `}
            style={{animationDelay: `${avatarColors.length * 0.05}s`}}
            onClick={() => {
              inputImage.current.click()
              setSelectedImage("input")
            }}
          >
            <div className={`
              aspect-[3/4] rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900
              flex items-center justify-center relative overflow-hidden
              ${selectedImage === "input" 
                ? 'ring-4 ring-white shadow-2xl' 
                : 'ring-2 ring-white/20 hover:ring-white/40'}
              transition-all duration-300
            `}>
              {!frontendImage && (
                <div className='flex flex-col items-center gap-3'>
                  <div className='w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center'>
                    <RiImageAddLine className='text-white w-8 h-8'/>
                  </div>
                  <span className='text-white text-sm font-medium'>Upload Image</span>
                </div>
              )}
              {frontendImage && (
                <img src={frontendImage} alt="Custom" className='w-full h-full object-cover'/>
              )}
              
              {/* Selected Checkmark */}
              {selectedImage === "input" && (
                <div className='absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg animate-scale-in'>
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            <p className='text-white text-center mt-3 font-semibold text-sm md:text-base tracking-wide'>
              Custom
            </p>
          </div>
          <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
        </div>

        {/* Selected Info */}
        {selectedImage && (
          <div className='text-center mb-8 animate-slide-up'>
            <div className='glass-dark rounded-2xl p-4 inline-flex items-center gap-3'>
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className='text-slate-300 text-sm'>
                Selected: <span className='text-white font-semibold'>{
                  selectedImage === 'input' ? 'Custom Upload' : 
                  avatarColors.find(c => c.name === selectedImage)?.label
                }</span>
              </p>
            </div>
          </div>
        )}

        {/* Next Button */}
        <div className='flex justify-center'>
          <button 
            className={`
              px-12 py-4 rounded-2xl text-lg font-bold transition-all duration-300 flex items-center gap-3
              ${selectedImage 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover-lift shadow-xl' 
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'}
            `}
            onClick={() => {
              if(selectedImage) {
                console.log("Navigating with selectedImage:", selectedImage)
                navigate("/customize2")
              }
            }}
            disabled={!selectedImage}
          >
            <span>{selectedImage ? 'Continue to Naming' : 'Select an Avatar'}</span>
            {selectedImage && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Customize
