import mongoose from "mongoose";

const servedSchema =new mongoose.Schema({
        fullName: {
        type: String,
        
    },

    Birthdate:{
        type: Date,
        required: true,
    },

        email: {
        type: String,
        required: true,
        unique: true,
    },
        address: {
        type: String,
        required: true,

    },

        address2: {
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

    Church: {
        type: String,
        required: true,
    },

    priestName:{
        type: String,
        required: true,
    },

    collegeOrInstitute:{
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

    Cohort:{
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
        }
    

},{timestamps:true});


const servedModel = mongoose.model("served", servedSchema);

    export default servedModel;