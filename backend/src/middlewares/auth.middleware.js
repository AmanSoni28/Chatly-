import jwt from 'jsonwebtoken'

export const isAuth = async (req, res, next)=>{

    try {
        const token = req.cookies.token                    
    
        if(!token){
            return res.status(401).json({message:"Unauthorized request"})                       
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)                     //return userId  
    
        req.userId=decodedToken.userId  
        next()                       
    } catch (error) {
        return res.status(401).json({message: "Invalid Acceess Token:",error})
    }
}

