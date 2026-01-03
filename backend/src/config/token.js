import jwt from 'jsonwebtoken'

const genToken = async (userId)=>{
    try {
        const token = await jwt.sign(
            {
              userId
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
               expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            } 
    )
    return token;
    } catch (error) {
        console.log("genToken error : ",error);
    }
}

export default genToken