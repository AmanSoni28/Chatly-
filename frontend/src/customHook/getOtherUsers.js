import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { serverUrl } from "../main"
import { setOtherUsers } from "../redux/userSlice.js"

const useGetOtherUsers=()=>{
    const dispatch=useDispatch()
    
    const {userData}=useSelector((state)=>state.user)            
    useEffect(()=>{
     const fetchOtherUsers=async ()=>{
        try {
            if(!userData) return          //when userData null then return
            const result=await axios.get(`${serverUrl}/api/user/other-users`,{withCredentials:true})
            // console.log("hello");
            dispatch(setOtherUsers(result.data))
        } catch (error) {
            console.log("getOtherUsers error:",error);
        }
     }
      fetchOtherUsers()
    },[userData])
}

export default useGetOtherUsers