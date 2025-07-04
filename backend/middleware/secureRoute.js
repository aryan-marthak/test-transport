import jwt from "jsonwebtoken";
import Employee from "../models/employee.model.js";

const secureRoute = async (req, res, next) => {
    try {
        if (!req.cookies) {
            return res.status(401).json({ error: "No cookies, authorization denied" });
        }
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "No token, authorization denied" });
        }
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid Token" });
        }
        const employee = await Employee.findById(decoded.userId).select("-password"); // current loggedin user
        if (!employee) {
            return res.status(401).json({ error: "No user found" });
        }
        req.user = employee;
        next();
    } catch (error) {
        console.log("Error in secureRoute: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export default secureRoute;