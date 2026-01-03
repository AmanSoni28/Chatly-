import { useEffect,useRef } from "react";
import { useSelector } from "react-redux";
import DP from '/emptyDP.png'



const ReceiverMessage = ({image,message}) => {
  const scroll=useRef()
  const {selectedUser}=useSelector((state)=>state.user)

  useEffect(()=>{
        scroll.current.scrollIntoView ({behavior:"smooth"})
      },[image,message])
      
  return (
    <div className="flex  gap-[10px]">

      <div className=' w-[30px] h-[30px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-gray-200 cursor-pointer'>
          <img src={selectedUser.image || DP}  alt="" />
    </div>

    <div ref={scroll} className="w-fit max-w-[500px] px-[10px] py-[5px] bg-[#1e96be] text-white text-[19px] rounded-tl-none rounded-2xl relative left-0 shadow-gray-400 shadow-lg flex flex-col gap-[10px]">
      {image &&
      <img src={image} className="h-[150px] w-[150px] bg rounded-lg" />}
      {message && <span>{message}</span>}
    </div>

    </div>
  );
};

export default ReceiverMessage