import jwt from "jsonwebtoken";

const genToken = async (userId) => {
    try {
        return jwt.sign(
            { _id: userId },   // IMPORTANT FIX
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
    } catch (error) {
        console.log("Token error", error);
    }
};

export default genToken;