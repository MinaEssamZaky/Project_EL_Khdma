import mongoose from "mongoose";

const servedSchema =new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        
    },

        secondName: {
        type: String,
        required: true,
        
    },
        familyName: {
        type: String,
        required: true,
        
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
        unique: true,
        minlength: 11,
        maxlength: 11,
    },

    IsExpatriate:{
        type: Boolean,
        default: false,
    },
    Landline :{
        type: String,
        unique: true,
        minlength: 9,
        maxlength: 9,
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
        required: true,
    },

        creatorId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true
        }
    

},{timestamps:true});


const servedModel = mongoose.model("served", servedSchema);

    export default servedModel;