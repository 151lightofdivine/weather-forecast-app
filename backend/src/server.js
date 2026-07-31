import dotenv from "dotenv";
import "./utils/cron.js";
dotenv.config();
import mongoose from "mongoose";
import app from "./app.js";
 console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB CONNECTED");
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch(err => console.log("DB ERROR:", err));
 