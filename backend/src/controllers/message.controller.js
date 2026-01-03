import { uploadOnCloudinary } from "../config/Cloudinary.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";


const sendMessage=async(req,res)=>{
try {
    const sender=req.userId
    const {receiver}=req.params
    const {message}=req.body

    if(!message && !req.file){
        return res.status(400).json({message:"Message or image is required"})
    } 

    let image="";
    if(req.file){                                           //if image send then upload on Cloudinary
        image=await uploadOnCloudinary(req.file.path)
    }

    let conversation=await Conversation.findOne({
        participants:{$all:[sender,receiver]}               //$all is used to match documents where an array contains all specified elements.
    })

    const newMessage=await Message.create({
        sender,
        receiver,
        message,
        image
    })

    if(!conversation){                                       //before not conversation then create 
        conversation=await Conversation.create({
            participants:[sender,receiver],
            messages:[newMessage._id]
        })
    }else{                                                   //before conversation then push the message
        conversation.messages.push(newMessage._id)
        await conversation.save()                           //save in database
    }

    const receiverSocketId=getReceiverSocketId(receiver) 
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessage)          //send instant msg to perticular receiver
    }

    return res.status(201).json(newMessage)

} catch (error) {
    return res.status(500).json({message:`send message error :${error}`})
}
} 


const getMessages=async (req,res)=>{
    try {
        const sender=req.userId
        const {receiver}=req.params

        const conversation=await Conversation.findOne({
            participants:{$all:[sender,receiver]}
        }).populate("messages")                                     //in messages only ids save but using populate get all the messages details

        if(!conversation){
            return res.status(200).json([])
        }

        return res.status(200).json(conversation?.messages)                   //only messages send participants not send

    } catch (error) {
        return res.status(500).json({message:`get messages error :${error}`})
    }
}


export {sendMessage,getMessages}    










// <----------------------------------Notes----------------------------------------->
// 📌uses of $all

// $all matches documents where the array includes every value mentioned in the query.

// ✅ Syntax
// {
//   fieldName: { $all: [value1, value2, ...] }
// }

// 🔍 Example

// Document
// {
//   name: "Aman",
//   skills: ["React", "Node", "MongoDB"]
// }


// Query

// db.users.find({
//   skills: { $all: ["React", "Node"] }
// })

// Result
// ✔ This document matches because both React and Node are present in the skills array.

// ❌ Not Matching Example
// db.users.find({
//   skills: { $all: ["React", "Python"] }
// })


// ❌ This will not match because Python is not in the array.

// 🆚 $all vs $in
// Operator	Meaning
// $all	All values must be present
// $in	At least one value must be present

// $in Example
// skills: { $in: ["React", "Python"] }


// ✔ This document matches because atleast one React or Node are present in the skills array.