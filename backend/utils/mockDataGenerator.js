import User from '../models/User.js';
import Activity from '../models/Activity.js';
import mongoose from 'mongoose';

const features = ['dashboard', 'analytics', 'reports', 'settings', 'profile', 'messaging'];
const activityTypes = ['login', 'feature_usage', 'interaction'];

// Generate random date between two dates
const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate mock users
const generateUsers = async (count = 50) => {
    const users = [];
    
    for (let i = 0; i < count; i++) {
        // First generate engagement score
        const engagementScore = Math.floor(Math.random() * 100);
        
        // Calculate churn risk inversely proportional to engagement score
        // Higher engagement = Lower churn risk
        const churnRisk = 100 - engagementScore;
        
        // Determine retention category based on engagement score
        let retentionCategory;
        if (engagementScore > 70) {
            retentionCategory = 'High';
        } else if (engagementScore > 30) {
            retentionCategory = 'Medium';
        } else {
            retentionCategory = 'Low';
        }

        const user = {
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            lastLoginDate: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
            engagementScore,
            churnRisk,
            retentionCategory,
            activeStatus: {
                daily: Math.random() > 0.5,
                weekly: Math.random() > 0.3,
                monthly: Math.random() > 0.1
            },
            features: features.reduce((acc, feature) => {
                acc[feature] = Math.floor(Math.random() * 100);
                return acc;
            }, {})
        };
        users.push(user);
    }

    try {
        await User.deleteMany({}); // Clear existing users
        const createdUsers = await User.insertMany(users);
        console.log(`Created ${createdUsers.length} users`);
        return createdUsers;
    } catch (error) {
        console.error('Error generating users:', error);
        throw error;
    }
};


// Generate mock activities for users
const generateActivities = async (users, activitiesPerUser = 20) => {
    const activities = [];

    for (const user of users) {
        for (let i = 0; i < activitiesPerUser; i++) {
            const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
            const activity = {
                userId: user._id,
                activityType,
                featureName: activityType === 'feature_usage' ? 
                    features[Math.floor(Math.random() * features.length)] : undefined,
                duration: Math.floor(Math.random() * 3600), // Random duration up to 1 hour
                metadata: {
                    browser: Math.random() > 0.5 ? 'Chrome' : 'Firefox',
                    platform: Math.random() > 0.5 ? 'Desktop' : 'Mobile'
                },
                createdAt: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
            };
            activities.push(activity);
        }
    }

    try {
        await Activity.deleteMany({}); // Clear existing activities
        const createdActivities = await Activity.insertMany(activities);
        console.log(`Created ${createdActivities.length} activities`);
        return createdActivities;
    } catch (error) {
        console.error('Error generating activities:', error);
        throw error;
    }
};

// Main function to generate all mock data
export const generateMockData = async () => {
    try {
        const users = await generateUsers();
        await generateActivities(users);
        console.log('Mock data generation completed');
    } catch (error) {
        console.error('Error in mock data generation:', error);
        throw error;
    }
};
