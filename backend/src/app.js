import express from "express";
import userRoutes from "./routes/user.routes.js";
import cors from "cors";

const app = express();


app.use(cors({
  origin: "*",  
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/v1/users", userRoutes);

export default app;