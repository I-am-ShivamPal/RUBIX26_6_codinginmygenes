import mongoose, { Schema } from 'mongoose';

const SessionSchema = new Schema(
    {
        session_id: { type: String, required: true, unique: true },
        user_id: { type: String }, // Optional, linking to User if available
        cum_risk_score: { type: Number, default: 0 },
        last_active: { type: Date, default: Date.now },
        start_time: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        collection: 'sessions', // Must match backend collection name
    }
);

// Prevent overwriting the model if it already exists (Next.js hot reload)
const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema);

export default Session;
