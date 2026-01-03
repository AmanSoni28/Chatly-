import genToken from "../config/token.js"
import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'


const signUp = async (req,res)=>{
try {

    const {userName,email,password} = req.body

    if([userName,email,password].some((field) => field?.trim() === "")){                          //some() return true/false
      return res.status(400).json({message : "All fields are required"})
   }

   const existedUser = await User.findOne({                                //User.findOne:find the first matching user and return the all detail
      $or: [{ userName }, {email}]                                         //mongoDB operator
   }) 
    
   if(existedUser){
       return res.status(400).json({message : "User with email or username already exists"})
   }

   if(password.length <6 ){
    return res.status(400).json({message : "password must be at least 6 characters"})
   }

   const user = await User.create({
    userName,
    email,
    password
   })

   const token = await genToken(user._id)

   const options={
    httpOnly:true, 
    maxAge:7*24*60*60*1000,                                     //7 day
    sameSite:"None",
    secure:true
   }

   return res.status(201)
   .cookie("token",token,options)
   .json({user,message : "User sign Up Successfully"})

} catch (error) {
    return res.status(500).json({message : `signUp error : ${error}`})
}
}

const logIn = async (req,res)=>{
try {

    const {email,password} = req.body

    if([email,password].some((field) => field?.trim() === "")){                          //some() return true/false
      return res.status(400).json({message : "All fields are required"})
   }

   const user = await User.findOne({email})
   
    
   if(!user){
       return res.status(400).json({message : "User does not exists"})
   }

   const isPsswordValid = await bcrypt.compare(password, user.password)
   
   if(!isPsswordValid){
    return res.status(400).json({message : "Invalid Password"})
   }

   const token = await genToken(user._id)

   const options={
    httpOnly:true,
    maxAge:7*24*60*60*1000,                         //7 day
    sameSite:"None",
    secure:true
   }

   return res.status(200)
   .cookie("token",token,options)
   .json({user,message:"User Log In Successfully"})

} catch (error) {
    return res.status(500).json({message : `logIn error ${error}`})
}
}


const logOut = async (req,res)=>{
    try {
        return res.status(200)
        .clearCookie("token",{
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
        .json({message : "logOut Successfully"})
    } catch (error) {
        return res.status(500).json({messasge : `logOut error ${error}`})
    }
}

export {signUp,logIn,logOut}




// <-------------------------Notes------------------------>
// 🍪 Cookie Options ka Meaning
// 1️⃣ httpOnly
// 🔐 Matlab:

// Cookie JavaScript se access nahi ho sakti

// ❓ Kyun use karte hain?

// XSS attack se protection

// document.cookie se token chori nahi hoga

// ✅ Example:
// httpOnly: true

// 2️⃣ secure
// 🔒 Matlab:

// Cookie sirf HTTPS connection par hi jayegi

// Kab use kare?

// Localhost (HTTP) → ❌ false

// Production (HTTPS) → ✅ true

// Example:
// secure: true

// 3️⃣ sameSite
// 🛡️ Matlab:

// Cookie cross-site request me jayegi ya nahi

// Options:
// Value	         Meaning
// "Lax"	         Same-site + limited cross-site
// "Strict"         	Sirf same-site
// "None"	          Sabhi requests (secure required)
// Example:
// sameSite:"Lax"

// 4️⃣ maxAge (tumne maxSite likha tha 🙂)
// ⏱️ Matlab:

// Cookie kitni der tak valid rahegi (milliseconds me)

// Example:
// maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days

// 🧠 Simple Real-Life Example
// res.cookie("accessToken", token, {
//   httpOnly: true,        // JS se safe
//   secure: false,         // localhost
//   sameSite: "Lax",       // cross-origin allowed (safe)
//   maxAge: 86400000,      // 1 day
// });

// ❌ Galat combinations (avoid)
// secure: false
// sameSite: "None"   // ❌ browser block karega

// 🏆 Interview One-liner

// httpOnly XSS se protect karta hai, secure HTTPS enforce karta hai, sameSite CSRF control karta hai, aur maxAge cookie ki expiry define karta hai.

// ✅ Quick Summary (yaad rakhne ke liye)
// Option	         Kaam
// httpOnly	         JS access band
// secure	         HTTPS only
// sameSite         Cross-site control
// maxAge	         Expiry time