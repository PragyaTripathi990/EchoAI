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

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative '>
        <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]' onClick={()=>navigate("/customize")}/>
      <h1 className='text-white mb-[40px] text-[30px] text-center '>Enter Your <span className='text-blue-200'>Assistant Name</span> </h1>
      <input type="text" placeholder='eg. shifra' className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent  text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}/>
      {assistantName &&  <button 
        className='min-w-[300px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer  bg-white rounded-full text-[19px]' 
        disabled={loading} 
        onClick={(e)=>{
          e.preventDefault();
          alert("Button clicked! Check console for logs.");
          handleUpdateAssistant();
        }}
      >
        {!loading?"Finally Create Your Assistant":"Loading..."}
      </button>}
      <div className='text-white mt-4'>
        <p>Debug: Assistant Name = {assistantName}</p>
        <p>Debug: Selected Image = {selectedImage || 'None'}</p>
        <p>Debug: Loading = {loading ? 'Yes' : 'No'}</p>
      </div>
     
    </div>
  )
}

export default Customize2