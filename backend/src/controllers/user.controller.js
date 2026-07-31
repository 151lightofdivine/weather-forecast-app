import User from "../models/User.js";

 export const registerUser = async (req, res) => {
  try {
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      email,
      password
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { refreshToken: null },
      { new: true }
    );

    res.status(200).json({
      message: "Logged out successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = user.generateAccessToken();
    res.status(200).json({ accessToken: newAccessToken });

  } catch (error) {
    console.log("REFRESH ERROR:", error.message);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const subscribeCity = async (req, res) => {
  try {
    const { city } = req.body;
    req.user.city = city;

     console.log("Saving city:", city);          
    console.log("User:", req.user.email); 

    
    await req.user.save({ validateBeforeSave: false });
    res.status(200).json({ message: `Subscribed to daily weather for ${city}` });
  } catch (err) {
    res.status(500).json({ message: "Subscription failed" });
  }
};