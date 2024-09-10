
import jwt from "jsonwebtoken";
export const generateToken = (email, role,userId) => {
    const token = jwt.sign({email, role: role || 'user',userId }, process.env.JWT_SECRET_KEY);
    return token;
};

