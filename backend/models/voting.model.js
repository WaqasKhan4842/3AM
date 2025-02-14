const voteSchema = new mongoose.Schema({
    performance: { type: mongoose.Schema.Types.ObjectId, ref: "Performance", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  }, { timestamps: true });
  
  export default mongoose.model("Vote", voteSchema);
  