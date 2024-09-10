import jwt from "jsonwebtoken";

export const authAdmin = (req, res, next) => {
    try {
        console.log("Cookies:", req.cookies);
        const {token} = req.cookies;
        console.log("Token:", token);

        if (!token) {
            return res.status(400).json({ success: false, message: "Admin not authenticated" });
        }

        console.log("Token:", token);

        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

        console.log("Token Verified:", tokenVerified);  

        if (!tokenVerified || tokenVerified.role !== "admin") {
            return res.status(400).json({ success: false, message: "Admin Not authorized" });
        }
        console.log("verifying error",tokenVerified);
        

        req.admin = tokenVerified;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
