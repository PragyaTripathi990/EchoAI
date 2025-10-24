import React, { useContext, useEffect, useRef, useState } from 'react'
import Card from '../components/Card'
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

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] '>
        <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]' onClick={()=>navigate("/")}/>
        <h1 className='text-white mb-[40px] text-[30px] text-center '>Select your <span className='text-blue-200'>Assistant Image</span></h1>
        <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]'>
      <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-gray-500 rounded-2xl cursor-pointer hover:border-4 hover:border-white transition-all ${selectedImage=="gray"?"border-4 border-white shadow-2xl shadow-blue-950":""}`} onClick={()=>handleColorSelect("gray")}></div>
       <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-blue-500 rounded-2xl cursor-pointer hover:border-4 hover:border-white transition-all ${selectedImage=="blue"?"border-4 border-white shadow-2xl shadow-blue-950":""}`} onClick={()=>handleColorSelect("blue")}></div>
        <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-green-500 rounded-2xl cursor-pointer hover:border-4 hover:border-white transition-all ${selectedImage=="green"?"border-4 border-white shadow-2xl shadow-blue-950":""}`} onClick={()=>handleColorSelect("green")}></div>
         <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-red-500 rounded-2xl cursor-pointer hover:border-4 hover:border-white transition-all ${selectedImage=="red"?"border-4 border-white shadow-2xl shadow-blue-950":""}`} onClick={()=>handleColorSelect("red")}></div>
          <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-yellow-500 rounded-2xl cursor-pointer hover:border-4 hover:border-white transition-all ${selectedImage=="yellow"?"border-4 border-white shadow-2xl shadow-blue-950":""}`} onClick={()=>handleColorSelect("yellow")}></div>
           <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-purple-500 rounded-2xl cursor-pointer hover:border-4 hover:border-white transition-all ${selectedImage=="purple"?"border-4 border-white shadow-2xl shadow-blue-950":""}`} onClick={()=>handleColorSelect("purple")}></div>
            <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-pink-500 rounded-2xl cursor-pointer hover:border-4 hover:border-white transition-all ${selectedImage=="pink"?"border-4 border-white shadow-2xl shadow-blue-950":""}`} onClick={()=>handleColorSelect("pink")}></div>
     <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${selectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-950 ":null}` } onClick={()=>{
        inputImage.current.click()
        setSelectedImage("input")
     }}>
        {!frontendImage &&  <RiImageAddLine className='text-white w-[25px] h-[25px]'/>}
        {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}
    
    </div>
    <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
      </div>
      <div className='mt-[20px] text-white text-center'>
        <p>Selected: {selectedImage || 'None'}</p>
      </div>
      <button 
        className={`min-w-[150px] h-[60px] mt-[30px] text-black font-semibold rounded-full text-[19px] ${selectedImage ? 'bg-white cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`} 
        onClick={()=>{
          if(selectedImage) {
            console.log("Navigating with selectedImage:", selectedImage)
            navigate("/customize2")
          }
        }}
        disabled={!selectedImage}
      >
        Next
      </button>
      
    </div>
  )
}

export default Customize
