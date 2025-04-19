import mongoose from "mongoose";
const { Schema } = mongoose;

// Course Model
const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true }, // URL to the image
  price: { type: Number, default: 0 }, // 0 for free courses
  tutor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
  enrollmentCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  category: { type: String },
  tags: [{ type: String }],
}, { timestamps: true });

// Video Model
const videoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  videoUrl: { type: String, required: true }, // URL to the video file
  duration: { type: Number }, // Duration in seconds
  thumbnail: { type: String }, // URL to the thumbnail image
  order: { type: Number, required: true }, // Order in the course
  transcript: { type: Schema.Types.ObjectId, ref: "Transcript" },
}, { timestamps: true });

// Transcript Model
const transcriptSchema = new Schema({
  video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
  content: { type: String, required: true }, // Full transcript text
  // Timestamped segments for syncing with video
  segments: [{
    text: { type: String, required: true },
    startTime: { type: Number, required: true }, // Time in seconds
    endTime: { type: Number, required: true }, // Time in seconds
  }],
  isAIGenerated: { type: Boolean, default: true },
  language: { type: String, default: "en" }
}, { timestamps: true });

// Enrollment Model
const enrollmentSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  enrollmentDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ["free", "pending", "completed", "failed"], default: "free" },
  paymentId: { type: String }, // Reference to payment if applicable
  progress: {
    lastWatchedVideo: { type: Schema.Types.ObjectId, ref: "Video" },
    completedVideos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    progressPercentage: { type: Number, default: 0 } // 0-100
  },
  certificateIssued: { type: Boolean, default: false }
}, { timestamps: true });

// Chat Room Model (One per course)
const chatRoomSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true, unique: true },
  name: { type: String, default: function() { return `Chat for ${this.course}`; } },
  description: { type: String },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }], // Users who have joined the chat
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Chat Message Model
const chatMessageSchema = new Schema({
  chatRoom: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  attachments: [{ 
    type: { type: String, enum: ["image", "file", "link"] },
    url: { type: String },
    name: { type: String }
  }],
  replyTo: { type: Schema.Types.ObjectId, ref: "ChatMessage" }, // For threaded replies
  isAnnouncement: { type: Boolean, default: false }, // For tutor announcements
  readBy: [{ type: Schema.Types.ObjectId, ref: "User" }] // Track who has read the message
}, { timestamps: true });

// Payment Model
const paymentSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  status: { type: String, enum: ["pending", "completed", "failed", "refunded"], required: true },
  paymentMethod: { type: String, required: true }, // e.g., "credit_card", "paypal"
  transactionId: { type: String }, // ID from payment processor
  enrollmentId: { type: Schema.Types.ObjectId, ref: "Enrollment" },
  refundAmount: { type: Number, default: 0 },
  refundReason: { type: String }
}, { timestamps: true });

// Notification Model
const notificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["message", "enrollment", "announcement", "system"], required: true },
  relatedTo: {
    model: { type: String, enum: ["Course", "ChatMessage", "Enrollment"] },
    id: { type: Schema.Types.ObjectId }
  },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

// Rating and Review Model
const reviewSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
  isVisible: { type: Boolean, default: true }
}, { timestamps: true });

// Export all models
export const Course = mongoose.model("Course", courseSchema);
export const Video = mongoose.model("Video", videoSchema);
export const Transcript = mongoose.model("Transcript", transcriptSchema);
export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export const Payment = mongoose.model("Payment", paymentSchema);
export const Notification = mongoose.model("Notification", notificationSchema);
export const Review = mongoose.model("Review", reviewSchema);