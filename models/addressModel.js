const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var addressSchema = new mongoose.Schema({
    place:{
        type:String,
        required:true,
        index:true,
    },
    street:{
        type:String,
       
    },
    pincode:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('Address', addressSchema);