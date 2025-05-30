import { AppError } from "../utils/AppError.js";

//handleError function
// This function takes a function as an argument and returns a new function that handles errors
export const handleError = (fn)=>{
    return (req, res, next) =>{
        fn(req, res, next).catch((err) => {
            return next(err)
        });
    }
}

// Global error handling middleware
// This middleware catches errors thrown in the application and sends a response
// with the error message and status code
export const GlobalErrorHandler =(err, req, res, next)=> {
    if(process.env.MODE=="development"){
        return DeveloperMode(err, res);
    }else{
        return ProductionMode(err, res);
    }
    
}
const ProductionMode=(err,res)=>{
const statusCode = err.statusCode || 500
    return res.status(statusCode).json({
        err: err.message || "Internal Server Error",
        statusCode: statusCode,
    })  
}

const DeveloperMode=(err,res)=>{
const statusCode = err.statusCode || 500
    return res.status(statusCode).json({
        err: err.message || "Internal Server Error",
        statusCode: statusCode,
        stack: err.stack,
    })  
}