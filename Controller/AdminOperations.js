const user = require("../Models/User")

const rev = require("../Models/Review");

const admin = require("../Models/Admin")

const sharing = require("../Models/RoomSharing")

const contact = require("../Models/ContactUs")

const notify = require('../Models/Notifications')

const mongoose = require('mongoose')

const jwt = require("jsonwebtoken")

async function getContact(req, res) {
    try {
        const contacts = await contact.find()
        res.status(200).json(contacts)
    }
    catch (err) {
        res.status(400).json(err.message)
    }
}

async function adminlogin(req, res) {
    try {
        const { password } = req.body
        const ifExist = await admin.findOne({ password: password })
        if (ifExist) {
            const token = jwt.sign({ "admin": admin }, process.env.SecretKey, { expiresIn: "5h" })
            res.status(200).json({ token, status: "ok" })
        }
        else {
            res.status(200).json({ status: "invalid" })
        }
    }
    catch (err) {
        res.status(400).json(err.message)
    }
}
async function getUserInfo(req, res) {
    try {
        const { ownner } = req.params;
        const userData = await user.findById({ _id: ownner })
        console.log(userData)
        res.status(200).json(userData);
    } catch (err) {
        res.status(400).json(err.message);
    }
}
async function getAllUsers(req, res) {
    try {
        const allUsers = await user.find()
        res.status(200).json(allUsers)
    }
    catch (err) {
        res.status(400).json(err.message)
    }
}

async function getAllOwner(req, res) {
    try {
        const allOwners = await owner.find()
        res.status(200).json(allOwners)
    }
    catch (err) {
        res.status(400).json(err.message)
    }
}

async function getAllRooms(req, res) {
    try {
        const shareProperty = await sharing.find({});
        res.status(200).json({
            shareProperty,
        })
    } catch (err) {
        res.status(400).json(err.message);
    }
}

async function deleteRoom(req, res) {
    try {
        const { _id } = req.params
        const room = await sharing.findById({ _id: _id })
        const owner = await user.findById({ _id: room.owner })
        const roomId = new mongoose.Types.ObjectId(_id)
        var index = 0;
        for (var i = 0; i < owner.sharingPropertyOwned.length; i++) {
            if (roomId.equals(owner.sharingPropertyOwned[i]._id)) {
               index = i
            }//
        }
        //property deleted from owners array
        owner.sharingPropertyOwned.splice(index, 1)
        await owner.save()
        const rooms = await sharing.deleteOne({ _id: _id })
        const roomNotification = await notify.deleteMany({ owner: owner._id, room_id: room._id })
        res.status(200).json("room delete successfully")
    }
    catch (err) {
        res.status(400).json(err.message);
    }
}

async function deleteUser(req, res) {
    try {
        const { _id } = req.body
        const users = await user.findById({ _id: _id })
        const ownerNotifications = await notify.deleteMany({ owner: _id })
        const userNotifications = await notify.deleteMany({ user_id: _id })
        const userss = await user.findByIdAndDelete(_id)
        if (users.sharingPropertyOwned.length > 0) {
            for (var i = 0; i < users.sharingPropertyOwned.length; i++) {
                console.log(users.sharingPropertyOwned[i]._id)
                const room = await sharing.findOneAndDelete({ _id: users.sharingPropertyOwned[i]._id })
                console.log(room)
            }
        }
        else {
            console.log("zero")
        }
        res.status(200).json("user deleted successfully")
    }
    catch (err) {
        res.status(400).json(err.message);
    }
}

async function getContact(req, res) {
    try {
        const contacts = await contact.find()
        res.status(200).json(contacts)
    }
    catch (err) {
        res.status(400).json(err.message)
    }
}
async function getOneShareRoom(req, res) {
    try {
        const { _id } = req.params;
        const findOneRoom = await sharing.findById({ _id: _id });
        res.status(200).json(findOneRoom);
    } catch (err) {
        res.status(400).json(err.message);
    }
}
async function getReview(req, res) {
    try {
        const revi = await rev.find({}).limit(3);
        res.status(200).json(revi);
    } catch (err) {
        res.status(400).json(err.message);
    }
}
module.exports = { getReview,getAllUsers,getOneShareRoom, getAllOwner, adminlogin, getAllRooms, deleteUser, getContact, getUserInfo, deleteRoom }