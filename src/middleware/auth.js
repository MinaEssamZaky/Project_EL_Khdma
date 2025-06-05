import jwt from 'jsonwebtoken';
import userModel from '../../DataBase/models/user.model.js';
export const auth=()=>{
    return async (req,res,next)=>{
        const {token}= req.headers;
        if(!token){
            return res.status(401).json({message:"Unauthorized Access"});
        }
        const tokenData = jwt.verify(token, process.env.TOKEN);
        if(!tokenData){
            return res.status(401).json({message:"Unauthorized Access"});
        }
        if(!tokenData.id){
            return res.status(401).json({message:"Invalid Token"});
        }

        const user = await userModel.findById(tokenData.id).select("-password -__v");
        if(!user){
            return res.status(401).json({message:"User Not Found"});
        }

        req.user = user;
        next();

    }
}

export function authorizeRoles(...roles) {
return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access Denied' });
    }
    next();
};
}