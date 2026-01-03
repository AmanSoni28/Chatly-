import { useDispatch, useSelector } from "react-redux";
import DP from '/emptyDP.png'
import { IoIosSearch } from "react-icons/io";
import { useState } from "react";
import {RxCross2} from 'react-icons/rx'
import { BiLogOutCircle } from "react-icons/bi";
import axios from "axios";
import { serverUrl } from "../main.jsx";
import { setMessages, setOtherUsers, setSearchData, setSelectedUser, setUserData, setOnlineUsers } from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";



const SideBar = () => {
   
  const {userData,otherUsers,selectedUser,onlineUsers,searchData}=useSelector((state)=>state.user)
  const [search,setSearch]=useState(false)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [query,setQuery]=useState("")

  const handleLogOut=async ()=>{
    try {
        const resutl = await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
        dispatch(setUserData(null))
        dispatch(setOtherUsers(null))
        dispatch(setSelectedUser(null))
        dispatch(setMessages([]))
        dispatch(setOnlineUsers())
        navigate('/login')
        toast.success(resutl?.data?.message)
    } catch (error) {
        toast.error(error?.response?.data?.message || "Log Out Error")
    }
  }

  const handleSearch=async ()=>{
    try {
        const result = await axios.get(`${serverUrl}/api/user/search?query=${query}`,{withCredentials:true})
        dispatch(setSearchData(result.data))
        // console.log(result.data);
        
    } catch (error) {
        toast.error(error?.response?.data?.message || "search user error")
    }
  }
  useEffect(()=>{
    if(query){
      handleSearch()
    }else{
      dispatch(setSearchData(null))
    }
  },[query])

  return (
    <div className={`lg:w-[30%] lg:block ${!selectedUser?"block":"hidden"}  w-full h-full bg-gray-200`}>
    
    {/* LogOut */}
     <div
     onClick={handleLogOut} 
     className="p-2 fixed bottom-[20px] left-[10px] size-12 flex justify-center items-center rounded-full bg-[#1e96be] shadow-gray-500 shadow-lg cursor-pointer text-black z-50 transition-all duration-150 active:scale-95 focus:outline-none focus:ring-0">
      <BiLogOutCircle  className="size-6"/>
     </div>
      

      <div className="w-full h-[220px]  bg-[#1e96be] rounded-b-[20%] shadow-gray-400 shadow-lg flex flex-col  justify-center px-[25px]">
      <h1 className="text-white font-bold text-[25px]">Chatly</h1>  
      <div className="w-full flex justify-between items-center">
        <h1 className="text-gray-700 font-bold text-[20px]">Hii , {userData.user.name || "User"}</h1>
        <div onClick={()=>navigate('/profile')} className=' w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-gray-200 cursor-pointer '>
          <img src={userData.user.image || DP}  alt="" />
        </div>
      </div> 
      
      {/* search */}
      <div className="w-full flex items-center gap-[5px]">
        {!search && 
        <div className=" w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center mt-2 shadow-gray-500 shadow-lg bg-white cursor-pointer" onClick={()=>setSearch(true)}>
         <IoIosSearch className="w-[25px] h-[25px]"/>
        </div>
        }  

        {search && 
        <form onSubmit={(e)=>e.preventDefault()} className=" w-[350px] h-[60px] rounded-full overflow-hidden flex items-center mt-2 shadow-gray-500 shadow-lg bg-white cursor-pointer gap-[10px] mt[10px]">
         <IoIosSearch className="w-[50px] h-[25px] ml-4"/>
         <input 
         type="text" 
         placeholder="search users" 
         value={query}
         onChange={(e)=>setQuery(e.target.value)}
         className="w-full h-full p-[10px] text-[20px] outline-0" />
         <RxCross2 className="w-[35px] h-[35px] cursor-pointer mr-5" onClick={()=>setSearch(false)}/>

          <div></div>
        </form>
        }

        {!search && otherUsers?.users?.map((user,index)=>(
            onlineUsers?.includes(user._id)  &&
            <div  className="relative cursor-pointer" onClick={()=>dispatch(setSelectedUser(user))}>
            <div className=' w-[60px] h-[60px] mt-2  rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-gray-200'
            key={index}>
          <img src={user.image || DP}  alt="" />
          
          <span className="w-[15px] h-[15px] rounded-full bg-[#3aff20] border-2 border-black absolute  top-[50px]  right-[1px] shadow-gray-500 shadow-lg"></span>
          
        </div>
        </div>
        ))}
      
      </div>  
      </div>
      
        <div className="w-full h-[64vh] overflow-auto thin-scrollbar flex flex-col gap-[10px] mt-2">    {/*thin-scrollbar define in index.css*/}
        {!query && otherUsers?.users?.map((user,index)=>(

         <div key={index} className="w-[95%] h-[60px] bg-white ml-2 flex justify-start items-center gap-[20px] shadow-gray-400 shadow-lg rounded-full hover:bg-[#1e96be] " onClick={()=>dispatch(setSelectedUser(user))}>

          <div className="relative ">
           <div className=' w-[60px] h-[60px]  rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-gray-200'
            key={index}>
            <img src={user.image || DP}  alt="" />
            {onlineUsers?.includes(user._id)  &&
            <span className="w-[15px] h-[15px] rounded-full bg-[#3aff20] border-2 border-black absolute  top-[40px]  right-[2px] shadow-gray-500 shadow-lg"></span>}
           </div>
          </div>

          <h1 className="text-gray-800 font-semibold text-[20px]">{user.name || user.userName}</h1>

         </div>
        ))}

        {query && searchData?.map((user,index)=>(

         <div key={index} className="w-[95%] h-[60px] bg-white ml-2 flex justify-start items-center gap-[20px] shadow-gray-400 shadow-lg rounded-full hover:bg-[#1e96be] " onClick={()=>dispatch(setSelectedUser(user))}>

          <div className="relative ">
           <div className=' w-[60px] h-[60px]  rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-gray-200'
            key={index}>
            <img src={user.image || DP}  alt="" />
            {onlineUsers?.includes(user._id)  &&
            <span className="w-[15px] h-[15px] rounded-full bg-[#3aff20] border-2 border-black absolute  top-[40px]  right-[2px] shadow-gray-500 shadow-lg"></span>}
           </div>
          </div>

          <h1 className="text-gray-800 font-semibold text-[20px]">{user.name || user.userName}</h1>

         </div>
        ))}

      </div>
    </div>
  );
};

export default SideBar