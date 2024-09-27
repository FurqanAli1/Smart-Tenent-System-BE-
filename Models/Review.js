const mongoose = require("mongoose")

const ReviewSchema = mongoose.Schema({
    user: {
        type: Object,
        required: true
    },
    tittle: {
        type: String,
        trim: true,
        required: true,
    },
    review: {
        type: String,
        trim: true,
        required: true,
    }
})

const Review = mongoose.model("review", ReviewSchema)

module.exports = Review
