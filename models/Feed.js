const mongoose = require("mongoose")

const feedSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    files:[{
        data:String,
        taged:[{
            type:mongoose.Types.ObjectId,
            ref:'User',
        }]
    }],
    likes:[{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }],
    content:{
        type:String,

    }
    },
    {
        timestamps: true
    }
    )

    module.exports  = mongoose.model('Feed',feedSchema)