const mongoose = require('mongoose')

const NotificationSchema = mongoose.Schema({
    owner:{
        type:String,
        required:true
    },
    room_id:{
        type:String,
        required:true
    },
    Address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    propertyRent:{
        type:String,
        required:true
    },
    user_id:{
        type:String,
        required:true
    },
    useremail:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true   
    },
    status:{
        type:String,
        default:"Pending",
    }
})

const NotificationModel = mongoose.model("Notification",NotificationSchema)

module.exports = NotificationModel
