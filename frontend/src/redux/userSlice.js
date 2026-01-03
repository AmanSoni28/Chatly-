import { createSlice } from "@reduxjs/toolkit";

const initialState={
    userData:null,
    otherUsers:null,
    selectedUser:null,
    messages:[],
    socket:null,
    onlineUsers:null,
    searchData:null
}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setUserData:(state,action)=>{
          state.userData=action.payload
        },
        setOtherUsers:(state,action)=>{
          state.otherUsers=action.payload
        },
        setSelectedUser:(state,action)=>{
          state.selectedUser=action.payload
        },
        setMessages:(state,action)=>{
          state.messages=action.payload
        },
        setSocket:(state,action)=>{
          state.socket=action.payload
        },
        setOnlineUsers:(state,action)=>{
          state.onlineUsers=action.payload
        },
        setSearchData:(state,action)=>{
          state.searchData=action.payload
        },
    }
})

export const {setUserData,setOtherUsers,setSelectedUser,setMessages,setSocket,setOnlineUsers,setSearchData} = userSlice.actions

export default userSlice.reducer