import { useDispatch, useSelector } from 'react-redux';
import DP from '/emptyDP.png'
import { CiCamera } from "react-icons/ci";
import { useRef, useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../main';
import toast from 'react-hot-toast';
import { setUserData } from '../redux/userSlice.js';

function Profile(){

  const {userData}=useSelector((state)=>state.user)
  const [name,setName]=useState(userData.user.name || "")
  const navigate = useNavigate()
  const [fronEndImage,setFrontEndImage]=useState(userData.user.image || DP)
  const [backEndImage,setBackEndImage]=useState(null)
  let image=useRef()
  const dispatch=useDispatch()
  const [loading,setLoading]=useState(false)

  const handleImage=(e)=>{
      const file=e.target.files[0]
      // console.log(e.target.files[0]);
      setBackEndImage(file)
      setFrontEndImage(URL.createObjectURL(file))
  }

  const handleProfile=async(e)=>{
    e.preventDefault()
    setLoading(true)
    try {
      const formData=new FormData()                             //use because form-data send 
      // console.log(formData);
      formData.append("name",name)
      if(backEndImage){
        formData.append("image",backEndImage)
      }
      const result = await axios.patch(`${serverUrl}/api/user/profile`,formData,{withCredentials:true})
      dispatch(setUserData(result.data))
      navigate('/')
      setLoading(false)
      toast.success(result?.data?.message)    
    } catch (error) {
      toast.error(error?.response?.data?.message)
      setLoading(false)
    }
  }

return(
    <div className="w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center " 
    style={{ backgroundImage: "url('/back2.png')" }}>

      <div className='fixed top-4 left-4 text-[#20c7ff] text-4xl cursor-pointer' onClick={()=>navigate('/')}>
         <IoMdArrowBack />
      </div>

      <div className="w-[200px] h-[200px] bg-white rounded-full relative ">
        <div className=' w-[200px] h-[200px] rounded-full overflow-hidden border-3 border-[#20c7ff] flex justify-center items-center'>
          <img src={fronEndImage}  alt="" className='relative' onClick={()=>image.current.click()}/>
        </div>
        <div className='absolute size-8 right-2 bottom-9 flex justify-center items-center bg-[#20c7ff] rounded-full' >
        <CiCamera className='size-6 font-bold text-gray-700 cursor-pointer'/>
        </div>
      </div>

      <form onSubmit={handleProfile} className="w-[500px] flex flex-col gap-[24px] items-center mt-12">

        <input 
        type="file" 
        accept="image/*" 
        hidden
        ref={image}
        onChange={handleImage}
        />

        <input 
         type="text" 
         placeholder='Enter your name' 
         value={name}
         onChange={(e)=>setName(e.target.value)}
         className="w-[88%] h-[48px] outline-none border border-[#20c7ff] px-[18px] bg-white rounded-xl not-last:shadow-sm focus:ring-2 focus:ring-[#20c7ff] text-gray-700 text-[17px]"
        />

        <input 
        type="text" 
        realOnly 
        value={userData?.user?.userName}
        className="w-[88%] h-[48px] outline-none border border-[#20c7ff] px-[18px] bg-white rounded-xl shadow-sm focus:ring-2 
        focus:ring-[#20c7ff] text-gray-400 text-[17px]"
        />

        <input 
         type="email" 
         realOnly 
         value={userData?.user?.email}
         className="w-[88%] h-[48px] outline-none border border-[#20c7ff] px-[18px] bg-white rounded-xl shadow-sm focus:ring-2 
         focus:ring-[#20c7ff] text-gray-400 text-[17px]"
        />

        <button
            className="mt-4 px-[34px] py-[12px] bg-gradient-to-r from-[#1fb6ff] to-[rgb(32,199,255)]
            rounded-full shadow-lg text-white text-[18px] font-bold 
            hover:scale-105 hover:shadow-xl transition-all duration-200 active:scale-95" disabled={loading}
          >
            {loading?"Saving...":"Save Profile"}
          </button>

      </form>
    </div>
)
}


export default Profile