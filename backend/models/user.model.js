import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Only for password-based login
  oauthProvider: { type: String, enum: ["google", "facebook", "email"], required: function() { return !this.password; } },
  oauthId: { type: String }, // Stores OAuth ID for Google/Facebook users
  role: { type: String, enum: ["tutor", "student"], required: true }
}, { timestamps: true });

export default mongoose.model("User", userSchema);