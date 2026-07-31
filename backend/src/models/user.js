import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new  mongoose.Schema(
  {
    
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    city: {
      type: String,
    },

    refreshToken: {
  type: String
}
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;

  this.password = await bcrypt.hash(this.password, 10);
 
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};


export default mongoose.model("User", userSchema);