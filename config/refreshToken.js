const jwt = require("jsonwebtoken")

const refreshToken =async (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET_KEY,{expiresIn:'3d'})
}

module.exports = refreshToken