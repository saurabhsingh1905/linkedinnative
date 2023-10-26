const mongoose = require ("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    verficationToken:String,
    profileImage:String,
    userDiscription:{
        type:String,
       default:null
    },
    connections:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    connectionRequest:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    sentConnectionRequests:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const User = mongoose.model("User",userSchema)

module.exports = User;