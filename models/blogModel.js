const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    description:{
        type:String,
        required:true,
        unique:true,
    },
    category:{
        type:String,
        required:true,
        unique:true,
    },
    numViews:{
        type:Number,
        default:0,
    },
    isLiked:{
        type:Boolean,
        default:false
    },
    isDisliked:{
        type:Boolean,
        default:false
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    dislikes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    image:{
        type:String,
        default:"https://as2.ftcdn.net/v2/jpg/06/04/13/45/1000_F_604134578_BIewvIAckVzGvFWnKLpoTTcr2KkignVC.jpg"
    },
    author:{
        type:String,
        default:"Admin"
    }
},{
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    },
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);