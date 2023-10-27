const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        requied:true,
        unique:true
    },
    userid:{
        type:String,
        requied:true,
        unique:true
    },
    username:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        default:true
    },
    follower:[{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }],
    following:[{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }]
    ,
    profile_img:{
        type:String,
        name:String,
        data:Buffer
    },
    feeds:[{
        type:mongoose.Types.ObjectId,
        ref:'Feed'
    }],
    Story:[{
        type:mongoose.Types.ObjectId,
        ref:'Story'
    }]

})

module.exports = mongoose.model('User', userSchema)