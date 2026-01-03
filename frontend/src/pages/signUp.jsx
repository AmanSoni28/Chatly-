import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { serverUrl } from "../main.jsx";
import axios from "axios"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";



function SignUp() {
  const navigate=useNavigate()
  const [show,setShow] = useState(false)
  const [userName,setUserName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [loading,setLoading]=useState(false)
  const dispatch=useDispatch()
  
  const handleSignUp = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup`, {userName,email,password},{withCredentials:true})
      const data=result.data
      // console.log(data);
      navigate('/profile')
      dispatch(setUserData(data))
      toast.success(data?.message)
      setUserName("")
      setEmail("")
      setPassword("")
      setLoading(false)
    } catch (error) {
      toast.error(error?.response?.data?.message || "SignUp Error");
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#6B7C93] flex items-center justify-center" style={{ backgroundImage: "url('/back2.png')" }}>
      
      <div className="w-full max-w-[500px] h-[620px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="w-full h-[220px] bg-gradient-to-r from-[#1fb6ff] to-[#20c7ff] rounded-b-[30%] shadow-lg flex items-center justify-around px-6">
          
          <h1 className="text-gray-700 font-bold text-[28px] leading-tight">
            welcome to
            <div className="text-white text-5xl tracking-wide">chatly</div>
          </h1>

          <img
            src="/front_new.png"
            className="h-[210px] w-[210px] drop-shadow-xl"
            alt="chat icon"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp}   className="w-full flex flex-col gap-[18px] items-center mt-6">

          <input
            type="text"
            placeholder="username"
            value={userName}
            onChange={(e)=>setUserName(e.target.value)}
            className="w-[88%] h-[48px] outline-none border border-[#20c7ff] px-[18px] bg-white rounded-xl
            shadow-sm focus:ring-2 focus:ring-[#20c7ff] text-gray-700 text-[17px]"
          />

          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-[88%] h-[48px] outline-none border border-[#20c7ff] px-[18px] bg-white rounded-xl
            shadow-sm focus:ring-2 focus:ring-[#20c7ff] text-gray-700 text-[17px]"
          />
          
          <div className="w-[88%] h-[48px] border border-[#20c7ff] relative rounded-xl ">
          <input
            type={show?"text":"password"}
            placeholder="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full h-full outline-none  px-[18px] bg-white rounded-xl
            shadow-sm focus:ring-3 focus:ring-[#20c7ff] text-gray-700 text-[17px]"
          />
          <span className="absolute top-3 right-4 text-sky-500 font-semibold cursor-pointer"
           onClick={()=>setShow((prev)=>!prev)}>{show?<IoIosEye className="size-6"/>:<IoMdEyeOff className="size-6"/>}</span>
          </div>

          <button
            className="mt-4 px-[34px] py-[12px] bg-gradient-to-r from-[#1fb6ff] to-[rgb(32,199,255)]
            rounded-full shadow-lg text-white text-[18px] font-bold 
            hover:scale-105 hover:shadow-xl transition-all duration-200 active:scale-95"
            disabled={loading}
          >
            {loading?"Loadind":"Sign Up"}
          </button>

          <p className="mt-3 text-gray-600 text-[14px]">
            already have an account?
            <span className="ml-1 text-[#20c7ff] font-semibold hover:underline cursor-pointer hover:font-bold" onClick={()=> navigate('/login')}>
              Login
            </span>
          </p>

        </form>
      </div>
    </div>
    
  );
}

export default SignUp;


