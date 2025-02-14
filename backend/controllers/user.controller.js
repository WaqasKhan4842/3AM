import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

class UserController {
  /**
   * @desc Register a new user (Password-based or OAuth)
   */
  static async registerUser(userData) {
    const { name, email, password, oauthProvider, oauthId, role } = userData;
  
    try {
      // Check if user already exists
      let existingUser = await User.findOne({ email });
  
      if (existingUser) {
        throw new Error("User already exists");
      }
  
      let hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  
      // Create new user
      let newUser = new User({
        name,
        email,
        password: hashedPassword,
        oauthProvider: oauthProvider || "email", // If OAuth, don't require this field
        oauthId,
        role,
      });
  
      await newUser.save();
      return { success: true, message: "User registered successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  

  /**
   * @desc Login a user (Password-based)
   */
  static async loginUser(email, password) {
    try {
      let user = await User.findOne({ email });

      if (!user || !user.password) {
        throw new Error("Invalid credentials");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      return { token, user };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * @desc Handle OAuth login (Google, Facebook)
   */
  static async loginWithOAuth(profile) {
    try {
        const { name, email, oauthProvider, oauthId } = profile;

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name: profile.name,
                email: profile.email,
                oauthProvider: "google",  // This is crucial
                oauthId: profile.id,      // Store Google OAuth ID
                role: "contestant"        // You can set a default role
            });
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Return the token and user object, indicating successful login
        return { success: true, token, user, message: "Login successful!" };
    } catch (error) {
        throw new Error(error.message);
    }
}


}

export default UserController;
