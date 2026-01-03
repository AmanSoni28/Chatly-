import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/signUp.jsx'
import LogIn from './pages/logIn.jsx'
import { Toaster } from "react-hot-toast";
// import getCurrentUser from './customHook/getCurrentUser.js';
import Home from './pages/home.jsx';
import Profile from './pages/profile.jsx';
import { useDispatch, useSelector } from 'react-redux';
// import getOtherUsers from './customHook/getOtherUsers.js';
import { io } from "socket.io-client";
import { serverUrl } from './main.jsx';
import { setSocket,setOnlineUsers } from './redux/userSlice.js';
import useGetCurrentUser from './customHook/getCurrentUser.js';
import useGetOtherUsers from './customHook/getOtherUsers.js';

function App() {
  const {userData,socket}=useSelector((state)=>state.user)    //when any field Change then App component re-render
  const dispatch=useDispatch()

  useGetCurrentUser()          
  useGetOtherUsers 

  //connect socket.io with backend
  useEffect(()=>{      
    if(userData){

      const socketIo = io(`${serverUrl}`,{
      query:{
        userId:userData?.user._id                    
      }
    })
   
    // console.log(socketIo);
    
    dispatch(setSocket(socketIo))

    socketIo.on("getOnlineUsers",(users)=>{                
      dispatch(setOnlineUsers(users))
    })

    return ()=>socketIo.disconnect()                    
    
    }else{
      if(socket){
        socket.disconnect()
        dispatch(setSocket(null))
      }
    }

  },[userData,socket])
  
  return (
    <>
    <Routes>
      <Route path='/signup'   element={!userData?<SignUp/>:<Navigate to='/profile'/>} />
      <Route path='/login'   element={!userData?<LogIn/>:<Navigate to='/'/>} />
      <Route path='/'  element={userData?<Home/>:<Navigate to='/login'/>} />
      <Route path='/profile'   element={userData?<Profile/>:<Navigate to='/signup'/>} />
    </Routes>
    <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

export default App









// <------------------------Note---------------------------->
// getCurrentUser(),getOtherUsers() use for, when reload the page then come to same page it is use instead of local Storage


//Socket.io

// 🔹 Line-by-line Explanation
// 1️⃣ useEffect(() => {

// React hook that runs side effects
// Here, it is used to connect / disconnect Socket.IO.

// 2️⃣ if (userData) {

// Check:
// 👉 Is the user logged in?

// If yes → connect socket
// If no → disconnect socket

// 3️⃣ const socketIo = io(${serverUrl}, { ... })

// Creates a new Socket.IO connection with the backend server.

// io(serverUrl)


// = open real-time connection

// 4️⃣ query: { userId: userData?.user._id }

// Sends userId to backend during connection.

// Purpose:

// Identify which user is connected

// Track online users

// Join user-specific room

// Backend can read:

// socket.handshake.query.userId

// 5️⃣ dispatch(setSocket(socketIo))

// Save the socket instance in Redux store.

// Why?

// Access socket anywhere in app

// Avoid multiple socket connections

// Centralized socket management

// 6️⃣ socketIo.on("getOnlineUsers", (users) => { ... })

// Listen for an event from the server.

// Event name:

// "getOnlineUsers"


// Server sends:

// users  // array of online user IDs

// 7️⃣ dispatch(setOnlineUsers(users))

// Update Redux state with currently online users.

// Used for:

// Online/offline indicator

// Green dot in chat list

// Status UI

// 8️⃣ return () => socketIo.disconnect()

// Cleanup function of useEffect.

// Runs when:

// component unmounts

// userData changes

// user logs out

// Purpose:
// ✔ Close socket connection
// ✔ Prevent memory leaks
// ✔ Prevent duplicate events

// In Socket.IO, .close() / .disconnect() ends the connection.

// 🔹 else block (User logged out)
// 9️⃣ else {

// Runs when userData is null / undefined
// (i.e., user logged out)

// 🔟 if (socket) {

// Check:
// 👉 Is there an existing socket connection?

// 1️⃣1️⃣ socket.disconnect()

// disconnect the old socket connection.

// Prevents:

// Ghost users

// Multiple connections

// Wrong online status

// 1️⃣2️⃣ dispatch(setSocket(null))

// Remove socket from Redux store.

// Why?

// App knows socket is inactive

// Avoid accidental emits

// 1️⃣3️⃣ }, [userData])

// Dependency array.

// Effect runs when:

// user logs in

// user logs out

// user data changes

// 🔹 How this works as a flow
// User logs in
//    ↓
// Socket connects
//    ↓
// User joins online list
//    ↓
// Server sends online users
//    ↓
// Redux updates UI
//    ↓
// User logs out
//    ↓
// Socket disconnects

// 🧠 Interview-ready summary

// This useEffect manages the socket lifecycle by connecting when the user logs in, listening for online user updates, and properly disconnecting when the user logs out or component unmounts.