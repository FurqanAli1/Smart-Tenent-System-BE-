const user = require("../Models/User")

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const sharing = require("../Models/RoomSharing")

const contact = require("../Models/ContactUs")

const notify = require("../Models/Notifications")

const rev = require("../Models/Review");

const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

const { log } = require("console");

// Set storage engine
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb("Error: Images Only!");
    }
}

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 }, // 1MB limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
}).single("profileImage");

//user sign up
async function userSignUp(req, res) {
    try {
        const { name, email, password, cpassword, profession } = req.body;
        const ifUserAlreadyExist = await user.findOne({ email: email });
        if (ifUserAlreadyExist) {
            res
                .status(200)
                .json("A user has already been registered with this email");
        } else {
            if (password === cpassword) {
                const password = await bcrypt.hash(cpassword, 10);
                const newUser = new user({ name, email, password, profession });
                await newUser.save();
                res.status(200).json({
                    message: "ok",
                });
            } else {
                res.status(200).json({
                    message: "bad",
                });
            }
        }
    } catch (err) {
        res.status(400).json(err.message);
    }
}

async function userLogin(req, res) {
    try {
        const { email, password } = req.body;
        const ifUserExist = await user.findOne({ email: email });
        if (ifUserExist) {
            const ifCorrectPassword = await user.findOne({ email: email });
            const pass = await bcrypt.compare(password, ifCorrectPassword.password);
            const token = jwt.sign({ _id: ifUserExist._id },
                process.env.SecretKey, {
                expiresIn: "5h",
            }
            );
            if (ifCorrectPassword && pass) {
                res.status(200).json({ message: "ok", token });
            } else {
                res.status(200).json("Wrong password");
            }
        } else {
            res.status(200).json("No user is registered with this email");
        }
    } catch (err) {
        res.status(400).json(err.message);
    }
}

async function getAllProperty(req, res) {
    try {
        const shareProperty = await sharing.find({});
        res.status(200).json({ shareProperty });
    } catch (err) {
        res.status(400).json(err.message);
    }
}

async function userSearch(req, res) {
    try {
        const area = req.body.areaa;
        const city = req.body.cityy;
        const ifPropertyExist = await sharing.find({
            area: area,
            city: city,
        });
        if (ifPropertyExist.length !== 0) {
            res.status(200).json({ ifPropertyExist });
        } else {
            res.status(201).json({ ifPropertyExist });
        }
    } catch (err) {
        res.status(400).json(err.message);
    }
}

async function getUserInfo(req, res) {
    try {
        const { _id } = req.params;
        const userData = await user.findById({ _id: _id });
        res.status(200).json(userData);
    } catch (err) {
        res.status(400).json(err.message);
    }
}

async function updateProfile(req, res) {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }

        const { userId, email, phoneNumber, cnic } = req.body;

        const imagePath = req.file ? `uploads/${req.file.filename}` : "default.png";

        try {
            // Build the query criteria based on userId or email
            const query = userId ? { _id: userId } : { email };

            // Build the update object
            const updateData = {
                ...(phoneNumber && { phoneNumber }),
                ...(cnic && { cnic }),
                image: imagePath, // Ensure the image path is included in the update data
            };

            // Find and update the user document
            const updatedUser = await user.findOneAndUpdate(query, updateData, {
                new: true, // Return the updated document
                runValidators: true, // Validate fields based on schema validators
            });

            // Ensure the updated user document is properly checked
            if (!updatedUser) {
                return res.status(404).json({ msg: "User not found" });
            }

            res.status(200).json({
                msg: "Profile updated successfully",
                updatedUser,
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({ msg: "Server error" });
        }
    });
}


//addProperty
async function addProperty(req, res) {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }
        console.log(req.body)

        try {
            const {
                title,
                city,
                address,
                date,
                propertyRent,
                area,
                famousPlace,
                totalPeople,
                description,
                wifi,
                water,
                tv,
                fridge,
                roof,
                pets,
                closet,
                balcony,
                kitchen,
                electricity,
                airConditioner,
                parking,
                bath,
                owner,
                endDate,
            } = req.body;
            const imagePath = req.file ?
                `uploads/${req.file.filename}` :
                "room.jpeg";

            const checkIfExist = await sharing.findOne({
                city: city,
                address: address,
                owner: owner,
            });
            if (!checkIfExist) {
                const newSharing = new sharing({
                    title,
                    city,
                    address,
                    date,
                    propertyRent,
                    area,
                    famousPlace,
                    totalPeople,
                    description,
                    wifi,
                    water,
                    tv,
                    fridge,
                    roof,
                    pets,
                    closet,
                    balcony,
                    kitchen,
                    electricity,
                    airConditioner,
                    parking,
                    bath,
                    owner,
                    endDate,
                    image: imagePath,
                });
                const submit = await newSharing.save();
                const userr = await user.findById({ _id: owner });
                userr.sharingPropertyOwned.push(newSharing);
                userr.isOwner = true;
                await userr.save();
                res.status(200).json("property registered successfully");
            } else {
                res.status(200).json("property has already been registered");
            }
        } catch (err) {
            res.status(400).json(err.message);
        }
    });
}



//owner notification user sends owner a request to owner
async function sendNotification(req, res) {
    try {
        const {
            username,
            owner,
            Address,
            city,
            propertyRent,
            room_id,
            user_id,
            useremail,
        } = req.body;
        const ifRequestAlreadySent = await notify.findOne({
            owner: owner,
            room_id: room_id,
            user_id: user_id,
        });
        if (!ifRequestAlreadySent) {
            const newNotification = new notify({
                username,
                owner,
                Address,
                city,
                propertyRent,
                room_id,
                user_id,
                useremail,
            });
            await newNotification.save();
            return res.status(200).json("request recieved");
        } else {
            return res.status(200).json("request already sent");
        }
    } catch (err) {
        res.status(400).json(err.message);
    }
}

//get all the notifications of an owner that owner has recieved
async function getNotifications(req, res) {
    try {
        const { owner } = req.params;
        const findOwner = await notify.find({ owner: owner });
        res.status(200).json(findOwner);
    } catch (err) {
        res.status(400).json(err.message);
    }
}

//get all the notifications of users that user has sent to other room owners
async function getSentNotifications(req, res) {
    try {
        const { owner } = req.params;
        const findOwner = await notify.find({ user_id: owner });
        res.status(200).json(findOwner);
    } catch (err) {
        res.status(400).json(err.message);
    }
}

async function contactUs(req, res) {
    try {
        const { firstName, lastName, email, messages } = req.body;
        const newContact = new contact({ firstName, lastName, email, messages });
        await newContact.save();
        res
            .status(200)
            .json("Your response has been submitted thanks for your message");
    } catch (err) {
        res.status(400).json(err.message);
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

//add tenent to room
async function acceptRequest(req, res) {
    try {
        const { user_id, owner, room_id } = req.body;
        const findRoom = await sharing.findById({ _id: room_id }); //room in which tenent is to be added
        const u_id = new mongoose.Types.ObjectId(user_id);
        var flag = false;
        for (var i = 0; i < findRoom.residents.length; i++) {
            if (findRoom.residents[i]._id.equals(u_id)) {
                flag = true;
            }
        }
        if (flag === true) {
            return res.status(200).json("a tenent cannot be added twice");
        } else {
            const userr = await user.findById({ _id: user_id }); //user id
            const propertyOwner = await user.findById({ _id: owner }); // room registered to specific user
            const peopleAllowed = parseInt(findRoom.totalPeople);
            const alreadyLiving = findRoom.residents.length;
            const ownersRoomId = new mongoose.Types.ObjectId(room_id);
            var i = 0;
            var index = 0;
            while (i < propertyOwner.sharingPropertyOwned.length) {
                if (ownersRoomId.equals(propertyOwner.sharingPropertyOwned[i]._id)) {
                    index = i;
                    i++;
                }
                i++;
            }
            if (peopleAllowed <= alreadyLiving) {
                res.status(200).json("No room available to add another tenent");
            } else {
                findRoom.residents.push(userr);
                await findRoom.save();
                propertyOwner.sharingPropertyOwned[index] = findRoom;
                await propertyOwner.save();
                const userNotification = await notify.findOne({
                    user_id: user_id,
                    room_id: room_id,
                    owner: owner,
                });
                userNotification.status = "approved";
                await userNotification.save();
                //console.log(userNotification)
                res.status(200).json("Tenent added successfully");
            }
        }
    } catch (err) {
        res.status(400).json(err.message);
    }
}

async function makeFeature(req, res) {
    try {
        const { _id } = req.params;
        console.log({ _id });
        const property = await sharing.findById({ _id: _id });
        //console.log(property)
        if (property.isfeatured = true) {
            return res.status(200).json("room is already featured")
        }
        else {
            property.isfeatured = true
            await property.save();
            //console.log(property)
            const ownerId = property.owner;
            //console.log(ownerId)
            const owner = await user.findById({ _id: ownerId });
            //console.log(owner.sharingPropertyOwned)
            //var i=0
            //while(i<owner.sharingPropertyOwned.length){
            //if(_id===owner.sharingPropertyOwned[i]._id){
            // console.log(i)
            //}
            //i++
            //}
            return res.status(200).json("request recieved");
        }
    } catch (err) {
        res.status(400).json(err.message);
    }
}

//when room is deleted
//the data of room in the sharingownedproperty of user is also deleted
//the notification related to the room is also deleted
async function deleteProperty(req, res) {
    try {
        const { _id } = req.params;
        const room = await sharing.findById({ _id: _id });
        const uid = room.owner;
        const owner = await user.findById({ _id: uid });
        const roomId = new mongoose.Types.ObjectId(_id);
        var index = 0;
        for (var i = 0; i < owner.sharingPropertyOwned.length; i++) {
            if (roomId.equals(owner.sharingPropertyOwned[i]._id)) {
                console.log(owner.sharingPropertyOwned[i]._id);
                index = i;
            }
        }
        //property deleted from owners array
        owner.sharingPropertyOwned.splice(index, 1);
        await owner.save();
        //property deleted from property table
        const del = await sharing.findByIdAndDelete({ _id: _id });
        //notifications deleted related to property
        const roomsNotifications = await notify.deleteMany({ room_id: _id });
        console.log(roomsNotifications);
        res.status(200).json("deleted");
    } catch (err) {
        res.status(400).json(err.message);
    }
}

async function getFeatured(req, res) {
    try {
        const featured = await sharing.find({ isfeatured: true });
        if (featured.length > 0) {
            res.status(200).json({
                status: "ok",
                featured,
            });
        } else {
            res.status(200).json({ status: "bad" });
        }
    } catch (err) {
        res.status(400).json(err.message);
    }
}

async function addReview(req, res) {
    try {
        const { tittle, review, user } = req.body;
        const revie = new rev({ tittle, review, user });
        await revie.save();
        res.status(200).json("ok");
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
async function rejectRequest(req, res) {
    try {
        const { user_id, owner, room_id } = req.body
        const not = await notify.findOne({ user_id: user_id, owner: owner, room_id })
        not.status = "Rejected"
        await not.save()
        res.status(200).json("request rejected successfully");
    }
    catch (err) {
        res.status(400).json(err.message);
    }
}
module.exports = {
    getReview,
    addReview,
    getFeatured,
    getSentNotifications,
    makeFeature,
    deleteProperty,
    acceptRequest,
    userSignUp,
    userLogin,
    getAllProperty,
    userSearch,
    getUserInfo,
    addProperty,
    contactUs,
    getOneShareRoom,
    sendNotification,
    getNotifications,
    updateProfile,
    rejectRequest
};