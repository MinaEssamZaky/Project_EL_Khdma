import jwt from 'jsonwebtoken';
import userModel from '../../DataBase/models/user.model.js';

export const auth = () => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const tokenData = jwt.verify(token, process.env.TOKEN);

      if (!tokenData?.id) {
        return res.status(401).json({ message: "Invalid Token" });
      }

      const user = await userModel.findById(tokenData.id).select("-password -__v");
      if (!user) {
        return res.status(401).json({ message: "User Not Found" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or Expired Token", error: error.message });
    }
  };
};

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access Denied' });
    }
    next();
  };
}
