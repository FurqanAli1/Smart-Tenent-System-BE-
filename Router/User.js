const express = require("express")

const userRouter = express.Router()

const userOp = require("../Controller/UserOperations")

const checkToken = require("../Middleware/checkToken")

userRouter.get("/users/getMyNotification/:owner", userOp.getNotifications);

userRouter.get(
  "/users/getMySentNotification/:owner",
  userOp.getSentNotifications
);

userRouter.get("/users/getAllProperty", userOp.getAllProperty)

userRouter.get("/users/getFeatured", userOp.getFeatured);

userRouter.get(
  "/users/getOneShareRoom/:_id",
  checkToken.verifyToken,
  userOp.getOneShareRoom
);

userRouter.get("/users/getUserInfo/:_id", userOp.getUserInfo);

userRouter.get("/user/makeFeature/:_id", userOp.makeFeature);

userRouter.get("/user/getReview", userOp.getReview);

userRouter.put("/updateProfile", userOp.updateProfile);

userRouter.post("/userSignUp", userOp.userSignUp);

userRouter.post("/userLogin", userOp.userLogin);

userRouter.post("/user/addProperty", userOp.addProperty);

userRouter.post("/users/searchProperty", userOp.userSearch);

userRouter.post("/user/contact", userOp.contactUs);

userRouter.post("/user/sendNotification", userOp.sendNotification);

userRouter.post("/user/acceptRequest", userOp.acceptRequest);

userRouter.post("/user/addReview", userOp.addReview);

userRouter.delete("/user/deleteRoom/:_id", userOp.deleteProperty);

userRouter.post("/user/rejectRequest",userOp.rejectRequest)

module.exports = userRouter