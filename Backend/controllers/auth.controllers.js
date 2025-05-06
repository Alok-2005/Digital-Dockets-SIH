import User from "../models/user.model.js"
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
const generateToken = (userID) => {
    const accessToken = jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userID }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    return { accessToken, refreshToken };
  };



  const storeRefreshToken = async (userID, refreshToken) => {
    // await redis.set(`refresh token:${userID}`,refreshToken,"Expires",7*24*60*60)  // 7 days
    await redis.set(
      `refresh_token:${userID}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    ); // 7 days
  };


  const setCookie = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
      // Set the cookie to be "httpOnly".
      // This means the cookie cannot be accessed by JavaScript running in the browser,
      // which helps prevent XSS (Cross-Site Scripting) attacks.
      // reducing the risk of XSS attacks by preventing malicious scripts from reading the token.
      httpOnly: true,
  
      secure: process.env.NODE_ENV === "production",
      // Ensures that the cookie is not sent along with cross-site requests.
      // Helps protect against CSRF (Cross-Site Request Forgery) attacks, as the cookie will only be included with requests made from the same site.
      // Setting this to "strict" means that the cookie will not be sent even if the user navigates to the site from an external link.
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, //This specifies how long the cookie will last before expiring, in milliseconds  ...15 min
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
  };



  export const checkAuth = async (req, res) => {
    try {
      // Extract the access token from cookies
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        return res.status(401).json({ success: false, message: "No access token provided" });
      }
  
      // Verify the access token
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
  
        // Fetch the user from the database using the decoded user ID from the token
        const user = await User.findById(decoded.userID).select("-password");
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
  
        // Return the user data if authentication is successful
        res.status(200).json({ success: true, user });
      });
    } catch (error) {
      console.error("Error in checkAuth:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  


 // Add these detailed logs in your login controller:
 export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("email name role phone countryCode fullPhoneNumber password");

    if (user && (await user.comparePasswords(password))) {

        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookie(res, accessToken, refreshToken);

        return res.status(200).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          message: "Logged in successfully",
        });
      
    } else {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in logging in", error: error.message });
  }
};

// Also, let's verify the signup hashing is correct
export const signup = async (req, res) => {
  // const {name,email,password,confirmPassword}=req.body
  const { name, email, password ,phone,countryCode} = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }
    // if(password!==confirmPassword){
    //     return res.status(400).json({message:"Passwords do not match"})
    // }

    const user = await User.create({ name, email, password,phone,countryCode });

    // authenticate and generate token
    const { accessToken, refreshToken } = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    // setting cookie for both
    setCookie(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        countryCode: user.countryCode
        // password:user.password
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
  
export const logout=async(req,res)=>{
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
          const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
          );
          await redis.del(`refresh token:${decoded.userID}`);
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logged out successfully" });
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
}


