import express from "express";
import UserController from "../controllers/user.controller.js";
import GoogleAuthController from "../controllers/GoogleAuthController.js";

const router = express.Router();

/**
 * @desc Register a new user (Password-based)
 */
router.post("/register", async (req, res, next) => {
  try {
    const userData = req.body;
    const result = await UserController.registerUser(userData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @desc Login a user (Password-based)
 */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Email and password are required");

    const { token, user } = await UserController.loginUser(email, password);
    res.json({ success: true, token, user, message: "Login successful!" });  // Include a message
  } catch (error) {
    next(error);
  }
});

/**
 * @desc Initiates Google Login flow
 */
router.get("/google", (req, res) => {
  console.log("GoogleAuthController:", GoogleAuthController); // 🔍 Debugging Step
  res.redirect(GoogleAuthController.getGoogleAuthURL());
});

/**
 * @desc Handles Google Login callback
 */
router.get("/google/callback", async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) throw new Error("Authorization code missing");

    // Get user profile from Google
    const profile = await GoogleAuthController.handleGoogleCallback(code);

    // Authenticate user or create a new one
    const { token, user } = await UserController.loginWithOAuth(profile);

   // Redirect to frontend with token and user data as query parameters
  //  const frontendUrl = `http://localhost:5173/login-success?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
  //  res.redirect(frontendUrl);
  // Redirect to frontend with token and user data as query parameters
  const frontendUrl = `http://localhost:5173/dashboard`;
  res.redirect(frontendUrl);
  } catch (error) {
    next(error);
  }
});

/**
 * @desc Logout user (Clears token from client-side)
 */
router.get("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;
