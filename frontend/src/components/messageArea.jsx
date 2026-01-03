import { IoMdArrowBack } from "react-icons/io";
import DP from '/emptyDP.png'
import { useDispatch, useSelector } from "react-redux";
import { setMessages, setSelectedUser } from "../redux/userSlice.js";
import { RiEmojiStickerLine, RiSendPlane2Fill } from "react-icons/ri";
import { FaImages } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from "./senderMessage.jsx";
import ReceiverMessage from "./receiverMessage.jsx";
import axios from "axios";
import { serverUrl } from "../main.jsx";
import toast from "react-hot-toast";

const MessageArea = () => {

  const {selectedUser,messages,socket}=useSelector((state)=>state.user)
  const dispatch=useDispatch()
  const [showpicker,setShowPicker]=useState(false)
  const [message,setMessage]=useState("")
  const [frontEndImage,setFrontEndImage]=useState(null)
  const [backEndImage,setBackEndImage]=useState(null)
  let image=useRef()
  const {userData}=useSelector((state)=>state.user)


  const handleSendMessage=async(e)=>{
    e.preventDefault()
    try {
      const formData=new FormData()
      formData.append("message",message)
      if(backEndImage){
        formData.append("image",backEndImage)
      }
      const result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData, {withCredentials:true})
      dispatch(setMessages([...messages,result.data]))
      // console.log(result.data);
      setMessage("")
      setFrontEndImage(null)
      setBackEndImage(null)
      
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const handleImage = async(e)=>{
    const file=e.target.files[0]
    setBackEndImage(file)
    setFrontEndImage(URL.createObjectURL(file))
  }

  const emojiClick=(EmojiPick)=>{                                //emojiPick is an objet
    // console.log(EmojiPick);
    setMessage((prev)=>prev+EmojiPick.emoji)                     //prev messsage and add the emoji
  }

  useEffect(()=>{
   socket.on("newMessage",(mess)=>{
    dispatch(setMessages([...messages,mess]))
   })
   return ()=>socket.off("newMessage")                    //off the newMessage event
  },[messages,setMessages])

  return (
    <div className={`lg:w-[70%] ${selectedUser?"flex":"hidden"} lg:block w-full h-full bg-gray-200 border-l-2 border-gray-400 `}>
     
     {!selectedUser && 
       <div className="e-full h-full flex flex-col justify-center items-center">
        <h1 className="text-gray-700 font-bold text-[50px]">Welcome to chatly</h1>
        <span className="text-gray-700 font-semibold text-[30px]">Chat Friendly !</span>
        </div>
     } 

     {selectedUser && 
     <div className="w-full h-[100vh] flex flex-col">
 
      {/* top bar */}
      <div className="w-full h-[15vh]  bg-[#1e96be] rounded-b-[20px] shadow-gray-400 shadow-lg flex items-center px-[20px]  gap-[20px]">
       <div className='text-4xl cursor-pointer text-white '>
         <IoMdArrowBack onClick={()=>dispatch(setSelectedUser(null))}/>
       </div>
       <div className=' w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-gray-200 cursor-pointer'>
        <img src={selectedUser?.image || DP}  alt="" />
       </div>
       <h1 className="text-white font-semibold text-[20px]"> {selectedUser?.name || selectedUser?.userName}</h1>  
      </div>
      
      {/* messages Area */}
      <div onClick={()=>setShowPicker(false)} className="w-full h-[78vh]  flex flex-col pt-[30px] pb-[60px] px-[30px] rounded-4xl gap-[10px] overflow-auto thin-scrollbar">
       {messages?.map((mess)=>(
        mess.sender==userData.user._id?<SenderMessage key={mess._id} image={mess.image} message={mess.message}/>:<ReceiverMessage key={mess._id}image={mess.image} message={mess.message}/>
      ))}
      </div>
     </div>
     }
     
  
      
     {/* bottom bar  */}
     {selectedUser && 
     <div className="w-full lg:w-[70%]  h-[100px] fixed bottom-[20px]  flex justify-center items-center">

       <form onSubmit={handleSendMessage} className="w-[95%]  h-[60px] bg-[#1e96be] rounded-full shadow-gray-400 shadow-lg flex items-center gap-[20px] px-[20px]">

        <div onClick={()=>setShowPicker((prev)=>!prev)}> 
        <RiEmojiStickerLine className="w-[25px] h-[25px] text-white  cursor-pointer"/>
        </div>

        {/* set the position of emoji box */}
        {showpicker && 
        <div className="absolute bottom-[90px] shadow-gray-400 shadow-lg rounded-4xl overflow-hidden">
        <EmojiPicker width={300} height={400} onEmojiClick={emojiClick}/>
        </div>}

        <input 
        type='text' 
        placeholder="write a message" 
        value={message}
        onChange={(e)=>setMessage(e.target.value)}
        className="text-[20px] w-full h-full bg-transparent text-white outline-none placeholder-"/>

        <input
        type="file"
        accept="image/*"
        hidden
        ref={image}
        onChange={handleImage}
        />
        
        {/* set position of image to send */}
        <img src={frontEndImage} alt="" className="w-[80px] absolute bottom-[100px] right-[100px] rounded-lg"/>

        <div onClick={()=>image.current.click()}>
        <FaImages className="w-[25px] h-[25px] text-white cursor-pointer"/>
        </div>

        <button type="submit" className=" p-2 rounded-full
          transition-all duration-150
        hover:bg-white/20
          active:scale-95
          focus:outline-none focus:ring-0">
        <RiSendPlane2Fill className="w-[25px] h-[25px] text-white cursor-pointer"/>
        </button>

       </form>
     </div>}

    </div>
  );
};

export default MessageArea





// <----------------------Notes----------------------->
// for add emoji : https://www.npmjs.com/package/emoji-picker-react