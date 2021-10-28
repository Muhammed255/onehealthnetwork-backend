import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import dotenv from "dotenv";
import { userRoutes } from "./routes/user.routes.js";

dotenv.config();
const app = express();

mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MongoDB Connection Succeeded.");
  })
  .catch((err) => {
    console.log("Error in DB connection: " + err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/user", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
