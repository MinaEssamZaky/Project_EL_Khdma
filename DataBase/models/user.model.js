import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        localStorage: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        minlength: 11,
        maxlength: 11,
    },
    gender: {
        type: String,
        enum:["male","female"]
},
isconfirmed: {
        type: Boolean,
        default: false,
    },
    role:{
        type: String,
        enum: ["SuperAdmin","Admin", "User"],
        default: "User"
    }

},
{timestamps: true});

const userModel = mongoose.model("user", userSchema);
export default userModel;