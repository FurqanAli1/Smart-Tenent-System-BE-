const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  isOwner: {
    type: Boolean,
    default: false,
  },
  profession: {
    type: String,
    trim: true,
    required: true,
  },
  phoneNumber: {
    type: Number,
    trim: true,
  },
  cnic: {
    type: Number,
    trim: true,
  },
  image: {
    type: String,
    default: "Default.png",
  },

  sharingPropertyOwned: [],
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel