const mongoose = require("mongoose")

const AdminSchema = mongoose.Schema({
    password:{
        type:String,
        trim:true,
        required:true,
    }
})

const AdminModel = mongoose.model("admin",AdminSchema)

module.exports = AdminModel
