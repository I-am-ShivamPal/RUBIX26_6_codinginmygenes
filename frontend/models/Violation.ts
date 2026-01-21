import mongoose, { Schema } from 'mongoose';

const ViolationSchema = new Schema(
    {
        session_id: { type: String, required: true },
        type: { type: String, required: true }, // 'frame_violation' or 'browser_event'
        severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
        details: { type: String },
        timestamp: { type: Date, default: Date.now },
    },
    {
        collection: 'violations', // Must match backend collection name
    }
);

// Prevent overwriting the model if it already exists (Next.js hot reload)
const Violation = mongoose.models.Violation || mongoose.model('Violation', ViolationSchema);

export default Violation;
