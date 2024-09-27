const mongoose = require('mongoose')

const contactSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    messages:{
        type:String,
        required:true,
    },
})

const contactUs = mongoose.model("contact",contactSchema)

module.exports = contactUs