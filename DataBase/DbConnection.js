import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const DataBaseConnection = async  () => {
  await mongoose.connect(process.env.DataBase_URL) .then(() => {
        console.log("DataBase Connected");
    }).catch((err) => {
        console.log("DataBase Connection Error", err);})
    
    }
