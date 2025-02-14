import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    profileName: { type: String, required: true },
    musicGenre: { type: String, enum: ["rock", "melody", "jazz"], required: true },
    performanceDetails: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
