const mongoose = require('mongoose')
const isValidID = async (id)=>{

    const isValid= await mongoose.Types.ObjectId.isValid(id)
    if(!isValid){
        throw new Error("Mongoose ObjectID is not valid")
    }
}
module.exports = isValidID