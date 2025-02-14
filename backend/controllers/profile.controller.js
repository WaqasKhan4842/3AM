import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";

const createProfile = async (req, res, next) => {
  try {
    const { profileName, musicGenre, performanceDetails } = req.body;

    // Validate the user exists
    const userId = req.user.id; // Assume `req.user` is populated from JWT middleware
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Create and save the profile
    const newProfile = new Profile({
      userId: user._id,
      profileName,
      musicGenre,
      performanceDetails,
    });

    await newProfile.save();
    res.status(201).json({ success: true, profile: newProfile });
  } catch (error) {
    next(error);
  }
};

export { createProfile };
