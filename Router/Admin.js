const express = require('express')

const adminRouter = express.Router()

const adminOp = require("../Controller/AdminOperations")

adminRouter.get("/Admin/getAllUsers",adminOp.getAllUsers)

adminRouter.get("/admin/getOneShareRoom/:_id", adminOp.getOneShareRoom);

adminRouter.get("/user/getReview",adminOp.getReview);

adminRouter.get("/Admin/getAllOwners",adminOp.getAllOwner)

adminRouter.get("/Admin/getAllRooms",adminOp.getAllRooms)

adminRouter.get("/Admin/getMessages",adminOp.getContact)

adminRouter.get("/users/getUserInfo/:owner",adminOp.getUserInfo)

adminRouter.post("/Admin/login",adminOp.adminlogin)

adminRouter.post("/Admin/deleteUser",adminOp.deleteUser)

adminRouter.delete("/Admin/deleteRoom/:_id",adminOp.deleteRoom)

//adminRouter.post("/Admin/signup",adminOp.adminsignup)

module.exports = adminRouter

