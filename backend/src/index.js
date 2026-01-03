import express from 'express'
import dotenv from 'dotenv'
dotenv.config({ path : './.env' })
import connectDb from './config/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { app,server } from './socket/socket.js'

const port = process.env.PORT || 6000

app. use(cors({                                                
    origin:"https://chatly-frontend-tnlz.onrender.com",                         
    credentials:true
}))

app.use(express.json({limit:"16kb"}))                      
app.use(express.urlencoded({limit:"16kb", extended:true}))  
app.use(express.static("public"))            
app.use(cookieParser()) 

//routes import
import authRouter from './routers/auth.router.js'
import userRouter from './routers/user.router.js'
import messageRouter from './routers/message.router.js'

// routes Declaration
app.use("/api/auth", authRouter)                //http://localhost:500/api/auth controll pass to authRouter
app.use("/api/user",userRouter)                 //http://localhost:500/api/user controll pass to userRouter
app.use("/api/message",messageRouter)           //http://localhost:500/api/message controll pass to messageRouter


server.listen(port, ()=>{
    connectDb();
    console.log("server run on port :", port);
})




// <----------------------withOut Socket.io------------------------------->
                             
// import express from 'express'
// import dotenv from 'dotenv'
// dotenv.config({ path : './.env' })
// import connectDb from './config/db.js'
// import cors from 'cors'
// import cookieParser from 'cookie-parser'

// const port = process.env.PORT || 6000

// const app = express()

// app.use(cors({                                                
//     origin:process.env.CORS_ORIGIN,                         
//     credentials:true
// }))

// app.use(express.json({limit:"16kb"}))                      
// app.use(express.urlencoded({limit:"16kb", extended:true}))  
// app.use(express.static("public"))            
// app.use(cookieParser()) 

// //routes import
// import authRouter from './routers/auth.router.js'
// import userRouter from './routers/user.router.js'
// import messageRouter from './routers/message.router.js'

// // routes Declaration
// app.use("/api/auth", authRouter)                //http://localhost:500/api/auth controll pass to authRouter
// app.use("/api/user",userRouter)                 //http://localhost:500/api/user controll pass to userRouter
// app.use("/api/message",messageRouter)           //http://localhost:500/api/message controll pass to messageRouter


// app.listen(port, ()=>{
//     connectDb();
//     console.log("server run on port :", port);
// })
                             
