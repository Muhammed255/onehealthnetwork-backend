import express from "express";
import { decode } from "../config/decode.js";
import userController from "../controllers/user.controller.js";

export const userRoutes = express.Router();


userRoutes.get("/all-users", decode, userController.getAllUsers);

userRoutes.get("/:userId", decode, userController.getOneUser);

userRoutes.post("/signup", userController.signup);

userRoutes.post("/login", userController.login);
