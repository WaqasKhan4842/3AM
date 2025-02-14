const scoreSchema = new mongoose.Schema({
    performance: { type: mongoose.Schema.Types.ObjectId, ref: "Performance", required: true },
    judge: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    criteria: {
        pitch: { type: Number, min: 0, max: 10 },
        tone: { type: Number, min: 0, max: 10 },
        stagePresence: { type: Number, min: 0, max: 10 }
    },
    totalScore: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("Score", scoreSchema);
