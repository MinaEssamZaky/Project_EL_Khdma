import mongoose from "mongoose";

export const DataBaseConnection =  () => {
    mongoose.connect(process.env.DataBase_URL) .then(() => {
        console.log("DataBase Connected");
    }).catch((err) => {
        console.log("DataBase Connection Error", err);})
    
    }