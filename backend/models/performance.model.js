const performanceSchema = new mongoose.Schema({
    contestant: { type: mongoose.Schema.Types.ObjectId, ref: "Contestant", required: true },
    competition: { type: mongoose.Schema.Types.ObjectId, ref: "Competition", required: true },
    round: { type: String, required: true },
    submissionUrl: { type: String, required: true }, // URL to audio/video file
    submissionStatus: { type: String, enum: ["submitted", "pending"], default: "pending" }
  }, { timestamps: true });
  
  export default mongoose.model("Performance", performanceSchema);
  