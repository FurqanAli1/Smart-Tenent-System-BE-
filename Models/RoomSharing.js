const mongoose = require("mongoose")

const RoomSharingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    trim: true,
  },
  endDate: {
    type: Date,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  area: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  famousPlace: {
    type: String,
    trim: true,
  },
  propertyRent: {
    type: Number,
    required: true,
    trim: true,
  },
  wifi: {
    type: Boolean,
    default: false,
  },
  water: {
    type: Boolean,
    default: false,
  },
  tv: {
    type: Boolean,
    default: false,
  },
  fridge: {
    type: Boolean,
    default: false,
  },
  roof: {
    type: Boolean,
    default: false,
  },
  pets: {
    type: Boolean,
    default: false,
  },
  closet: {
    type: Boolean,
    default: false,
  },
  balcony: {
    type: Boolean,
    default: false,
  },
  kitchen: {
    type: Boolean,
    default: false,
  },
  electricity: {
    type: Boolean,
    default: false,
  },
  airConditioner: {
    type: Boolean,
    default: false,
  },
  parking: {
    type: Boolean,
    default: false,
  },
  bath: {
    type: Boolean,
    default: false,
  },
  residents: [],
  totalPeople: {
    type: String,
    immutable: true,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  isfeatured: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: "room.jpeg",
  },
});
const RoomSharingModel = mongoose.model("RoomSharing", RoomSharingSchema)

module.exports = RoomSharingModel