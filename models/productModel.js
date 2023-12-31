const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
       
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
        
    },
    price:{
        type:Number,
        required:true,
        select:false // this will help to hide this properties while send the response.
    },
    category:{
        type:String,//mongoose.Schema.Types.ObjectId,
        required:true,
        //ref:"Category"
    },
    quantity:{
        type:Number,
        required:true
    },sold:{
        type:Number,
        default:0
        
    },
    images:{
        type:Array
    },
    brand:{
        type:String,
        //enum:['Apple','Samsung','Lenovo']
        required:true
    },
    color:{
        type:String,
        //enum:['Black','Brown','Red']
        required:true
    },
    ratings:[{
        star:Number,
        comment:String,
        postedby:
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            }
        
    }],
    totalratings:{
        type:String,
        default:0
    }
},{timeseries:true});

//Export the model
module.exports = mongoose.model('Product', productSchema);