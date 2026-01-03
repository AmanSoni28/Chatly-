import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import toast from "react-hot-toast";
import { serverUrl } from "../main";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";




function LogIn() {

  const navigate=useNavigate()              
  const [show,setShow] = useState(false)
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [loading,setLoading]=useState(false)
  const dispatch=useDispatch()

  const handleLogIn = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/login`, {email,password},{withCredentials:true})
    //   console.log(result.data);
      const data=result.data
      dispatch(setUserData(data))
      navigate('/')
      toast.success(data.message)
      setEmail("")
      setPassword("")
      setLoading(false)
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Error");
      setLoading(false)
    }
  }  

  return (
    <div className="w-full min-h-screen bg-[#6B7C93] flex items-center justify-center " style={{ backgroundImage: "url('/back2.png')" }}>
      
      <div className="w-full max-w-[500px] h-[620px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="w-full h-[220px] bg-gradient-to-r from-[#1fb6ff] to-[#20c7ff] rounded-b-[30%] shadow-lg flex items-center justify-around px-6">
          
          <h1 className="text-gray-700 font-bold text-[28px] leading-tight">
            Login to
            <div className="text-white text-5xl tracking-wide">chatly</div>
          </h1>

          <img
            src="/front_new.png"
            className="h-[210px] w-[210px] drop-shadow-xl"
            alt="chat icon"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleLogIn} className="w-full flex flex-col gap-[24px] items-center mt-12">

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
          <span className="absolute top-3 right-4 text-sky-500 font-semibold cursor-pointer "
           onClick={()=>setShow((prev)=>!prev)}>{show?<IoIosEye className="size-6"/>:<IoMdEyeOff className="size-6"/>}</span>
          </div>

          <button
            className="mt-4 px-[34px] py-[12px] bg-gradient-to-r from-[#1fb6ff] to-[rgb(32,199,255)]
            rounded-full shadow-lg text-white text-[18px] font-bold 
            hover:scale-105 hover:shadow-xl transition-all duration-200 active:scale-95" disabled={loading}
          >
            {loading?"Loading...":"Log In"}
          </button>

          <p className="mt-3 text-gray-600 text-[14px]">
            Want to create new account?
            <span className="ml-1 text-[#20c7ff] font-semibold hover:underline cursor-pointer hover:font-bold" onClick={()=> navigate('/signup')}>
              signUp
            </span>
          </p>

        </form>
      </div>
    </div>
    
  );
}

export default LogIn;