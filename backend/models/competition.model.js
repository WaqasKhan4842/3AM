const competitionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rounds: [{
      roundName: String,
      date: Date,
      contestants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contestant" }]
    }]
  }, { timestamps: true });
  
  export default mongoose.model("Competition", competitionSchema);
  