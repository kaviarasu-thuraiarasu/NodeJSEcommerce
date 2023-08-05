const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'Product'
            },
            quantity:{
                type:Number
            },
            color:{
                type:String
            },
            price:{
                type:Number
            }
        }

    ],
    orderBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    payment:{},
    orderStatus:{
        type:String,
        default:"Not processed",
        enum:["Not processed","Cash on Delivery","Processing","Dispatched","Cancelled","Delivered"]
    }
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Orders', orderSchema);