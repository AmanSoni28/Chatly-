import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { serverUrl } from "../main"
import { setUserData } from "../redux/userSlice.js"


const useGetCurrentUser=()=>{
    // console.log("hello")
    const dispatch=useDispatch()
    useEffect(()=>{
     const fetchUser=async ()=>{
        try {
            const result=await axios.get(`${serverUrl}/api/user/current-user`,{withCredentials:true})
            // console.log("hello")
            dispatch(setUserData(result.data))
        } catch (error) {
            dispatch(setUserData(null));
            console.log("getCurrentUser error:",error);
        }
     }
      fetchUser()
    },[])
}

export default useGetCurrentUser