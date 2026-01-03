import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { serverUrl } from "../main.jsx"
import { setMessages } from "../redux/userSlice.js"

const useGetMessages=()=>{
    const dispatch=useDispatch()
    
    const {userData,selectedUser}=useSelector((state)=>state.user)            
    useEffect(()=>{
     const fetchMessages=async ()=>{
        try {
            const result=await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`,{withCredentials:true})
            // console.log(result.data);
            dispatch(setMessages(result.data))
        } catch (error) {
            console.log("getMessages error:",error);
        }
     }
      fetchMessages()
    },[userData,selectedUser])
}

export default useGetMessages