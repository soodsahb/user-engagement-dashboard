import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activityType: {
        type: String,
        required: true,
        enum: ['login', 'feature_usage', 'page_view', 'interaction']
    },
    featureName: {
        type: String,
        required: function() {
            return this.activityType === 'feature_usage';
        }
    },
    duration: {
        type: Number,
        default: 0 
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: new Map()
    }
}, {
    timestamps: true
});


activitySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Activity', activitySchema);
