const contestantSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bio: { type: String },
    songPreferences: [{ type: String }], // Array of song genres/preferences
    performanceDetails: { type: String } // Any additional details
  }, { timestamps: true });
  
  export default mongoose.model("Contestant", contestantSchema);
  