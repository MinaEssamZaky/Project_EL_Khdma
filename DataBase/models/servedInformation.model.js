import mongoose from "mongoose";

const servedSchema =new mongoose.Schema({
        fullName: {
        type: String,
        
    },

    birthDay :{
        type: Date,
        required: true,
    },

        birthMonth:{
        type: Date,
        required: true,
    },

        birthYear:{
        type: Date,
        required: true,
    },


        email: {
        type: String,
        required: true,
        unique: true,
    },
        Address: {
        type: String,
        required: true,

    },

        Address2: {
        type: String,
    },


        mobileNumber1: {
        type: String,
        required: true,
        unique: true,
        minlength: 11,
        maxlength: 11,
    },

            
    mobileNumber2: {
        type: String,
    },

    IsExpatriate:{
        type: Boolean,
        default: false,
    },
    Landline :{
        type: String,
    },

    church: {
        type: String,
        required: true,
    },

    priestName:{
        type: String,
        required: true,
    },

    college:{
        type: String,
        required: true,
    },

    governorateOfBirth:{
        type: String,
        required: true,
    },

    maritalStatus:{
        type: String,
        enum: ["Single", "Married", "Engaged"],
        required: true,
    },

    cohort:{
        type: String,
        required: true,
    },

    Profession:{
        type: String,
    },

        creatorId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true
        },

        dayOff: {
            type: String,
            enum: ["Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        }
    

},{timestamps:true});


const servedModel = mongoose.model("served", servedSchema);

    export default servedModel;