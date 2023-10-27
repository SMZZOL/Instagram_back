const mongoose = require("mongoose")

const storySchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    file:{
        data:String,
        taged:[{
            type:mongoose.Types.ObjectId,
            ref:'User',
        }]
    },
    viewed:[{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }],
    },
    {
        timestamps: true
    }
    )

    module.exports  = mongoose.model('Story',storySchema)