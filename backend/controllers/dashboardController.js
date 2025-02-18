import User from '../models/User.js';
import Activity from '../models/Activity.js';

// Get overall dashboard metrics
export const getDashboardMetrics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        
        // Get active users counts
        const now = new Date();
        const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        const dailyActiveUsers = await User.countDocuments({
            lastLoginDate: { $gte: oneDayAgo }
        });

        const weeklyActiveUsers = await User.countDocuments({
            lastLoginDate: { $gte: oneWeekAgo }
        });

        const monthlyActiveUsers = await User.countDocuments({
            lastLoginDate: { $gte: oneMonthAgo }
        });

        // Calculate average engagement score
        const avgEngagement = await User.aggregate([
            {
                $group: {
                    _id: null,
                    avgScore: { $avg: "$engagementScore" }
                }
            }
        ]);

        res.json({
            totalUsers,
            activeUsers: {
                daily: dailyActiveUsers,
                weekly: weeklyActiveUsers,
                monthly: monthlyActiveUsers
            },
            averageEngagement: avgEngagement[0]?.avgScore || 0
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get active users statistics
export const getActiveUsers = async (req, res) => {
    try {
        const { timeframe } = req.query; // daily, weekly, monthly
        const now = new Date();
        let timeAgo;

        switch(timeframe) {
            case 'daily':
                timeAgo = new Date(now - 24 * 60 * 60 * 1000);
                break;
            case 'weekly':
                timeAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'monthly':
                timeAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                timeAgo = new Date(now - 24 * 60 * 60 * 1000);
        }

        const activeUsers = await User.find({
            lastLoginDate: { $gte: timeAgo }
        }).select('name email lastLoginDate engagementScore');

        res.json(activeUsers);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get retention rate
export const getRetentionRate = async (req, res) => {
    try {
        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        const totalUsers = await User.countDocuments();
        const retainedUsers = await User.countDocuments({
            lastLoginDate: { $gte: oneMonthAgo }
        });

        const retentionRate = (retainedUsers / totalUsers) * 100;

        res.json({
            retentionRate,
            totalUsers,
            retainedUsers
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get AI insights
export const getAIInsights = async (req, res) => {
    try {
        // Get users with high churn risk (> 70)
        const atRiskUsers = await User.find({
            churnRisk: { $gt: 70 }
        }).select('name email engagementScore churnRisk');

        const insights = {
            recommendations: [
                "Offer discounts to users with high churn risk",
                "Send email campaigns to users who haven't logged in for a week",
                "Provide tutorial sessions for underutilized features"
            ],
            atRiskUsers,
            suggestedActions: [
                "Schedule follow-up calls with users having churn risk > 70%",
                "Launch re-engagement campaign for medium risk users",
                "Optimize onboarding process for new users"
            ]
        };

        res.json(insights);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get feature usage statistics
export const getFeatureUsage = async (req, res) => {
    try {
        const featureStats = await Activity.aggregate([
            {
                $match: { activityType: 'feature_usage' }
            },
            {
                $group: {
                    _id: '$featureName',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.json(featureStats);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const { 
            search, 
            sortBy = 'engagementScore',
            order = 'desc',
            retentionCategory
        } = req.query;

        let query = {};

        // Search by name or email
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        // Filter by retention category
        if (retentionCategory) {
            query.retentionCategory = retentionCategory;
        }

        const users = await User.find(query)
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};