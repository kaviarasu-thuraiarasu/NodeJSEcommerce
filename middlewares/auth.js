const jwt = require("jsonwebtoken")
const user = require("../models/userModel")

const auth = async (req,res,next)=>{
    const token = req?.headers?.authorization
    if(!token){
        throw new Error("You are not authorized to access this endpoint")
    }
    if(token.startsWith('Bearer ')){
        const tkn = token.split(' ')[1]
        const validToken = await jwt.verify(tkn,process.env.JWT_SECRET_KEY)
        if(!validToken){
            throw new Error("Token Expired")
        }
        const userData = await user.findById(validToken?.id)
        req.user = userData
        next()
    }

}

const isAdmin = (req,res,next)=>{

    const {user:{role,_id,email}} = req
    if(role!='Admin'){
        throw new Error("Not an Admin user")
    }
    next()
}

module.exports = {auth,isAdmin}