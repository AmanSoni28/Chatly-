import { uploadOnCloudinary } from "../config/Cloudinary.js"
import { User } from "../models/user.model.js"

const getCurrentUser = async (req,res)=>{
try {
    const userId=req.userId

    const user=await User.findById(userId).select("-password")      
    
    if(!user){
        return res.status(400).json({message:"User Not Found"})
    }

    return res.status(200).json({user,message:"Current user fetched successfully"})
} catch (error) {
    res.status(500).json({message: `getCurrent User Error ${error}`})
}
}

const editProfile=async(req,res)=>{
    try {
        const {name}=req.body 
        let image;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path)
        }

        console.log("image",image);
        

        const user = await User.findByIdAndUpdate(req.userId,{
                name,
                image : image
            },
            {new:true}
        )

        if(!user){
            return res.status(404).json({message:"User Not Found"})
        }    
         
        return res.status(200).json({user,message:"Profile Save Successfully"})    
    } catch (error) {
        return res.status(500).json({message:"Profile Error :",error})
    }

}

const getOtherUsers=async (req,res)=>{
    try {
        const users=await User.find({                            //find other users except current user
            _id:{$ne:req.userId}                           //ne:not equal
        }).select("-password")

        // console.log(users);

        return res.status(200).json({users,message:"User Fetch Successfully"})
    } catch (error) {
        return res.status(500).json({message:"Other User Fetch Error :",error})
    }
}

const search=async(req,res)=>{
   try {
    const {query} =  req.query                     //take data from URL after ?, EX-/search?query=aman
 
    const users=await User.find({
        $and:[
            {
             $or:[
                  {userName : {$regex:query,$options:'i'}},    //'regex' use to pattern matching, '.*' use to take skip letters
                  {name : {$regex:query,$options:'i'}}     //'options: i' → means case-insensitive search   
                 ]
            },
            {
            _id : {$ne:req.userId}          //$ne stands for "not equal".   use for not take own id
            }
        ]
    })
 
      return res.status(200).json(users)
   } catch (error) {
       return res.status(500).json({message:`search user error : ${error}`})
   }   
}

export {getCurrentUser,editProfile,getOtherUsers,search}










// <------------------Notes------------------->
// What is req.query?
// req.query is an object that holds the query parameters sent in the URL after a question mark (?).

// 📘 Syntax Example
// Suppose you send a request like this:

// GET /users?name=Aman&age=23

// Then in your Express route:

// app.get('/users', (req, res) => {
//   console.log(req.query);
// });

// Output:
// { name: 'Aman', age: '23' }

// ✅ So req.query.name → "Aman"
// ✅ And req.query.age → "23"

// <-------------------------------------------->
// Difference Between req.query, req.params, and req.body
// Property         	Data Source                       	Example                            	Use Case
// req.query     	URL query string	                /users?name=Aman	                Filters/searches
// req.params     	URL parameters	                    /users/:id → /users/101 	        Identify specific resource
// req.body    	    Request body (POST/PUT)         	JSON/form data	                    Sending data to server

// <------------------------------------------------>

// $regex
// $regex means Regular Expression (pattern matching).
// It allows you to search for values that partially match a given pattern instead of matching exactly.

// For example:

// { username: { $regex: "aman" } }

// will match any document where the username contains “aman” (like "aman", "Aman123", "superAman").


// $options: 'i'

// The $options key adds flags to the regular expression.

// 'i' → means case-insensitive search

// So "Aman", "AMAN", and "aman" will all match.

