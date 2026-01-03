import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chatly-frontend-tnlz.onrender.com",           // frontend URL
  }
});

const userSocketMap={}

//connect with frontend, io.on(event,callback)

io.on("connection", (socket) => {      // when user login then function fire and give socket id to user and using socket id comunicate with user
//   console.log("User connected:", socket.id);

  const userId=socket.handshake.query.userId
  if(userId!=undefined){
    // console.log(userId);
    userSocketMap[userId]=socket.id
  }

  io.emit("getOnlineUsers",Object.keys(userSocketMap))
  
  socket.on("disconnect",()=>{                                   
      delete  userSocketMap[userId]
      io.emit("getOnlineUsers",Object.keys(userSocketMap))
  })

  });

  export const getReceiverSocketId=(receiverId)=>{
    return userSocketMap[receiverId]
  }
  

  export {app, server, io}






//   🔹 Line-by-Line Explanation
// 1️⃣ const userSocketMap = {}

// An empty object used to store:

// userId → socketId

// Example:

// {
//   "user123": "Dsf89sdF",
//   "user456": "Hj78sdK9"
// }


// Purpose:

// Track which users are online

// Know which socket belongs to which user

// Send messages to a specific user

// 2️⃣ io.on("connection", (socket) => {

// This event fires every time a user connects to Socket.IO.

// socket = one connected client

// Each client has a unique socket.id

// 3️⃣ const userId = socket.handshake.query.userId

// Read the userId sent from frontend during connection:

// Frontend:

// io(serverUrl, {
//   query: { userId }
// })


// Backend:

// socket.handshake.query.userId


// Purpose:

// Identify which user just connected

// Map socket to that user

// 4️⃣ if (userId != undefined) { ... }

// Safety check:

// Ensure userId exists

// Avoid storing undefined keys

// 5️⃣ userSocketMap[userId] = socket.id

// Store mapping:

// userSocketMap[userId] = socket.id


// Meaning:

// This user is now online and connected with this socket.

// Used later for:

// Private messaging

// Online/offline status

// Notifications

// 6️⃣ io.emit("getOnlineUsers", Object.keys(userSocketMap))

// Broadcast event to ALL connected clients.

// Object.keys(userSocketMap) = array of online user IDs

// Example:

// ["user123", "user456"]


// Frontend listens:

// socket.on("getOnlineUsers", users => { ... })


// Purpose:

// Update online users list in real time

// Show green dots / status

// 7️⃣ socket.on("disconnect", () => {

// Triggered automatically when:

// User closes tab

// Refreshes page

// Loses internet

// Calls socket.disconnect()

// 8️⃣ delete userSocketMap[userId]

// Remove user from online map.

// Meaning:

// This user is no longer online.

// Prevents:

// Ghost users

// Wrong online status

// 9️⃣ io.emit("getOnlineUsers", Object.keys(userSocketMap))

// Again broadcast updated online users list.

// So all clients immediately know:

// User went offline

// 🔹 Complete Flow (Simple)
// User connects
//    ↓
// userId → socketId stored
//    ↓
// All users receive updated online list
//    ↓
// User disconnects
//    ↓
// user removed from map
//    ↓
// All users receive updated online list

// 🧠 Interview-ready explanation

// We maintain a map of userId to socketId to track online users. When a user connects or disconnects, we update the map and broadcast the online users list to all clients in real time.