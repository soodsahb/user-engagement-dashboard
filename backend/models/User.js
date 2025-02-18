import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    lastLoginDate: {
        type: Date,
        default: Date.now
    },
    engagementScore: {
        type: Number,
        default: 0
    },
    retentionCategory: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    activeStatus: {
        daily: { type: Boolean, default: false },
        weekly: { type: Boolean, default: false },
        monthly: { type: Boolean, default: false }
    },
    churnRisk: {
        type: Number,
        default: 0 // 0-100 scale
    },
    features: {
        type: Map,
        of: Number,
        default: new Map() // Track feature usage count
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);
