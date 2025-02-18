import express from 'express';
import {
    logActivity,
    getUserActivities,
    getActivityStats,
    getRecentActivities
} from '../controllers/activityController.js';

const router = express.Router();

router.post('/log', logActivity);
router.get('/user/:userId', getUserActivities);
router.get('/stats', getActivityStats);
router.get('/recent', getRecentActivities);

export default router;
