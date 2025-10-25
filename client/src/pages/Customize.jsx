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
    { name: 'gray', bgClass: 'bg-gradient-to-br from-gray-400 to-gray-600', label: 'Silver' },
    { name: 'blue', bgClass: 'bg-gradient-to-br from-blue-400 to-blue-600', label: 'Ocean' },
    { name: 'green', bgClass: 'bg-gradient-to-br from-green-400 to-green-600', label: 'Forest' },
    { name: 'red', bgClass: 'bg-gradient-to-br from-red-400 to-red-600', label: 'Fire' },
    { name: 'yellow', bgClass: 'bg-gradient-to-br from-yellow-400 to-yellow-600', label: 'Sun' },
    { name: 'purple', bgClass: 'bg-gradient-to-br from-purple-400 to-purple-600', label: 'Magic' },
    { name: 'pink', bgClass: 'bg-gradient-to-br from-pink-400 to-pink-600', label: 'Rose' }
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
          className='absolute top-8 left-8 glass rounded-full p-3 hover-lift group z-10'
        >
          <MdKeyboardBackspace className='text-white w-7 h-7 group-hover:scale-110 transition-transform'/>
        </button>
      )}

      {/* Main Content */}
      <div className='w-full max-w-5xl glass rounded-3xl p-8 md:p-12 animate-scale-in relative z-10'>
        {/* Header */}
        <div className='text-center mb-10'>
          <div className='flex justify-center mb-6'>
            <div className='w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse-glow'>
              <span className='text-5xl'>🎨</span>
            </div>
          </div>
          <h1 className='text-white text-4xl md:text-5xl font-bold mb-3 tracking-tight'>
            Choose Your Assistant Avatar
          </h1>
          <p className='text-gray-300 text-lg'>Pick a style that represents your AI companion</p>
        </div>

        {/* Avatar Selection Grid */}
        <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 mb-8'>
          {avatarColors.map((color, index) => (
            <div 
              key={color.name}
              className={`
                group cursor-pointer transition-all duration-300 animate-slide-up
                ${selectedImage === color.name ? 'scale-105' : 'hover:scale-105'}
              `}
              style={{animationDelay: `${index * 0.1}s`}}
              onClick={() => handleColorSelect(color.name)}
            >
              <div className={`
                aspect-[2/3] rounded-2xl ${color.bgClass} 
                flex items-center justify-center relative overflow-hidden
                ${selectedImage === color.name 
                  ? 'ring-4 ring-white ring-offset-4 ring-offset-transparent shadow-2xl animate-glow' 
                  : 'ring-2 ring-white/20 hover:ring-white/40'}
              `}>
                {/* Icon/Symbol */}
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-6xl filter drop-shadow-lg'>🤖</span>
                </div>
                
                {/* Selected Checkmark */}
                {selectedImage === color.name && (
                  <div className='absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg animate-scale-in'>
                    <span className='text-green-500 text-xl font-bold'>✓</span>
                  </div>
                )}
              </div>
              <p className='text-white text-center mt-3 font-medium text-sm md:text-base'>
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
            style={{animationDelay: `${avatarColors.length * 0.1}s`}}
            onClick={() => {
              inputImage.current.click()
              setSelectedImage("input")
            }}
          >
            <div className={`
              aspect-[2/3] rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900
              flex items-center justify-center relative overflow-hidden
              ${selectedImage === "input" 
                ? 'ring-4 ring-white ring-offset-4 ring-offset-transparent shadow-2xl animate-glow' 
                : 'ring-2 ring-white/20 hover:ring-white/40'}
            `}>
              {!frontendImage && (
                <div className='flex flex-col items-center gap-3'>
                  <RiImageAddLine className='text-white w-12 h-12'/>
                  <span className='text-white text-xs font-medium'>Upload</span>
                </div>
              )}
              {frontendImage && (
                <img src={frontendImage} alt="Custom" className='w-full h-full object-cover'/>
              )}
              
              {/* Selected Checkmark */}
              {selectedImage === "input" && (
                <div className='absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg animate-scale-in'>
                  <span className='text-green-500 text-xl font-bold'>✓</span>
                </div>
              )}
            </div>
            <p className='text-white text-center mt-3 font-medium text-sm md:text-base'>
              Custom
            </p>
          </div>
          <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
        </div>

        {/* Selected Info */}
        {selectedImage && (
          <div className='text-center mb-6 animate-slide-up'>
            <div className='glass-dark rounded-2xl p-4 inline-block'>
              <p className='text-gray-300 text-sm'>
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
              px-12 py-4 rounded-2xl text-lg font-bold transition-all duration-300 
              ${selectedImage 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover-lift shadow-xl' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
            `}
            onClick={() => {
              if(selectedImage) {
                console.log("Navigating with selectedImage:", selectedImage)
                navigate("/customize2")
              }
            }}
            disabled={!selectedImage}
          >
            {selectedImage ? 'Continue →' : 'Select an Avatar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Customize
