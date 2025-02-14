import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User receiving the notification
  type: { 
    type: String, 
    enum: ["deadline", "result", "general"], 
    required: true 
  }, // Type of notification
  message: { type: String, required: true }, // Notification message
  status: { type: String, enum: ["pending", "sent"], default: "pending" }, // Email status
  scheduledTime: { type: Date, required: true } // When the email should be sent
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
