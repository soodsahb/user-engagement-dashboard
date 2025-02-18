import Activity from '../models/Activity.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Log new activity
export const logActivity = async (req, res) => {
    try {
        const { userId, activityType, featureName, duration, metadata } = req.body;

        // Create new activity
        const activity = await Activity.create({
            userId,
            activityType,
            featureName,
            duration,
            metadata
        });

        // Update user's last login date if activity is login
        if (activityType === 'login') {
            await User.findByIdAndUpdate(userId, {
                lastLoginDate: new Date()
            });
        }

        // Update feature usage count
        if (activityType === 'feature_usage') {
            await User.findByIdAndUpdate(userId, {
                $inc: { [`features.${featureName}`]: 1 }
            });
        }

        // Wait for engagement score update
        await updateEngagementScore(userId);

        // Fetch updated user to return in response
        const updatedUser = await User.findById(userId);
        
        res.status(201).json({
            activity,
            updatedUser
        });
    } catch (error) {
        console.error('Error in logActivity:', error);
        res.status(500).json({ message: error.message });
    }
};


// Get user activities
export const getUserActivities = async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.query;

        let query = { userId };

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const activities = await Activity.find(query)
            .sort({ createdAt: -1 })
            .limit(100);

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get activity statistics
export const getActivityStats = async (req, res) => {
    try {
        const stats = await Activity.aggregate([
            {
                $group: {
                    _id: '$activityType',
                    count: { $sum: 1 },
                    averageDuration: { $avg: '$duration' }
                }
            }
        ]);

        const featureUsage = await Activity.aggregate([
            {
                $match: { activityType: 'feature_usage' }
            },
            {
                $group: {
                    _id: '$featureName',
                    usageCount: { $sum: 1 }
                }
            },
            {
                $sort: { usageCount: -1 }
            }
        ]);

        res.json({
            activityTypeStats: stats,
            featureUsageStats: featureUsage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get recent activities
export const getRecentActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('userId', 'name email');

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to update engagement score


const updateEngagementScore = async (userId) => {
    try {
        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        // Get activity counts
        const activityCounts = await Activity.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    createdAt: { $gte: oneMonthAgo }
                }
            },
            {
                $group: {
                    _id: '$activityType',
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('Activity Counts:', activityCounts); // Debug log

        // Calculate engagement score based on activity
        let score = 0;
        activityCounts.forEach(activity => {
            switch(activity._id) {
                case 'login':
                    score += activity.count * 10;
                    break;
                case 'feature_usage':
                    score += activity.count * 5;
                    break;
                case 'interaction':
                    score += activity.count * 2;
                    break;
                default:
                    score += activity.count;
            }
        });

        console.log('Calculated Score:', score); // Debug log

        // Normalize score to 0-100 range
        score = Math.min(100, score);

        // Calculate new churn risk (inverse of engagement score)
        const churnRisk = 100 - score;

        console.log('Final Score:', score, 'Churn Risk:', churnRisk); // Debug log

        // Update user with new scores
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                engagementScore: score,
                retentionCategory: score > 70 ? 'High' : score > 30 ? 'Medium' : 'Low',
                churnRisk: churnRisk
            },
            { new: true } // This returns the updated document
        );

        console.log('Updated User:', updatedUser); // Debug log

    } catch (error) {
        console.error('Error updating engagement score:', error);
    }
};

