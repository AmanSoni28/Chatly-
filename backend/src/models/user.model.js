import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:""
    }
},{timestamps : true})



userSchema.pre("save", async function(){            //hash(encrypt) the password before save 'userSchema' into the database.
  if(!this.isModified("password")) return ;      //if password not modified then go to next middleware, 'isModified' is predefine method  

  this.password = await bcrypt.hash(this.password,10)               //encrypt the password in 10 rounds 
})

export const User = mongoose.model("User",userSchema)

