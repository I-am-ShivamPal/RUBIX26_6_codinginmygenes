import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        hashed_password: { type: String, required: true },
        full_name: { type: String, required: true },
        role: { type: String, required: true, enum: ['student', 'admin'], default: 'student' },
        is_active: { type: Boolean, default: true },
        created_at: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        collection: 'users' // Explicitly define collection name to ensure consistency with backend
    }
);

// Prevent overwriting the model if it already exists (Next.js hot reload)
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
