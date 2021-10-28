import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export default {
  signup: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const checkExist = await User.findOne({ email });
      if (checkExist) {
        return res
          .status(401)
          .json({ success: false, msg: "Email already registered!" });
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });
      await user.save();
      return res.status(200).json({ success: true, msg: "User registered!" });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, msg: "Error occured!" + err.message });
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const checkExist = await User.findOne({ email });
      if (!checkExist) {
        return res
          .status(402)
          .json({ success: false, msg: "Email not exist, register first!" });
      }
      const compare = await bcrypt.compare(password, checkExist.password);
      if (!compare) {
        return res
          .status(400)
          .json({ success: false, msg: "Password is incorrect!" });
      }
      const token = jwt.sign(
        { userId: checkExist._id, user: checkExist },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      return res.status(200).json({
        success: true,
        msg: "Loggedin success",
        token,
        userId: checkExist._id,
        expiresIn: 86400
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, msg: "Error Occured!" + err.message });
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.find().select("-password -__v");
      return res.status(200).json({ success: true, users });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, msg: "Error occured!" + err.message });
    }
  },

  getOneUser: async(req, res, next) => {
    try {
      const user = await User.findById(req.params.userId);
      if(!user) {
        return res.status(401).json({success: false, msg: "No user found"});
      }
      return res.status(200).json({success: true, user});
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, msg: "Error occured!" + err.message });
    }
  }
};
