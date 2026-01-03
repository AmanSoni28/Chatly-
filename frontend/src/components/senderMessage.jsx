import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import DP from '/emptyDP.png'


const SenderMessage = ({image,message}) => {
    const scroll=useRef()
    const {userData}=useSelector((state)=>state.user)

    useEffect(()=>{
      scroll.current.scrollIntoView ({behavior:"smooth"})
    },[image,message])

  return (
    <div className="flex gap-[10px] ">

     <div ref={scroll} className="w-fit max-w-[500px] px-[10px] py-[5px] bg-[#1e96be] text-white text-[19px] rounded-tr-none rounded-2xl relative right-0 ml-auto shadow-gray-400 shadow-lg flex flex-col gap-[10px]">
       {image &&
       <img src={image} className="h-[150px] w-[150px] bg rounded-lg" />}
       {message && <span>{message}</span>}  
     </div>

     <div className=' w-[30px] h-[30px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-gray-200 cursor-pointer'>
        <img src={userData.user.image || DP}  alt="" />
    </div>
      
    </div>
  );
};

export default SenderMessage






