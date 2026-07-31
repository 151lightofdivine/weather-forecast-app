import express from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, subscribeCity } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser); 
router.post("/logout", verifyJWT, logoutUser);


router.post("/subscribe", verifyJWT, subscribeCity);

router.post("/refresh-token", refreshAccessToken);


router.get("/profile", verifyJWT, (req, res) => {
  res.json({
    message: "Protected route",
    user: {
      id: req.user._id,
      email: req.user.email
    }
  });
});

export default router;