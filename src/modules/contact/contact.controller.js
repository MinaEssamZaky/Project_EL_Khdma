import express from "express";
import { AppError } from "../../utils/AppError.js";
import contactModel from "../../../DataBase/models/contact.model.js";
import { handleError } from "../../middleware/HandleError.js";
import userModel from "../../../DataBase/models/user.model.js";


export const addMessage = handleError(async (req, res, next) => {
  
    const {userName,phone,message} = req.body;

    const newMessage = await contactModel.create({userName,phone,message});

    res.status(201).json({ message: "Successfully", newMessage });
});


export const getAllMessage = handleError(async (req, res, next) => {

          if (req.user.role !== 'SuperAdmin' ) {return next(new AppError("Access Denied", 403));}
  
            const user = await userModel.findById(req.user._id)
                if(!user){return next(new AppError("User not found",404));}
        
        const getAllMessage = await contactModel.find();
        res.status(201).json({ message: "Successfully", getAllMessage });
})

export const deleteMessage = handleError(async (req, res, next) => {
  if ( req.user.role !== 'SuperAdmin' ) {return next(new AppError("Access Denied", 403));}
  
  const messageId = req.params.id;
  const deleted = await contactModel.findByIdAndDelete(messageId);

  if (!deleted) {
    return next(new AppError("Contact not found", 404));
  }

  return res.status(200).json({ message: "Contact Deleted Successfully" });
});
