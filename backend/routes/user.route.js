import express from "express";
import isAuth from "../middleware/isAuth.js";
import User from "../model/user.model.js";

const userRouter = express.Router();

userRouter.get("/currentuser", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

export default userRouter;


