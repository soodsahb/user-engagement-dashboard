import express from 'express';
import { 
    getDashboardMetrics,
    getActiveUsers,
    getRetentionRate,
    getAIInsights,
    getFeatureUsage,
    getAllUsers
} from '../controllers/dashboardController.js';



const router = express.Router();

router.get('/metrics', getDashboardMetrics);
router.get('/active-users', getActiveUsers);
router.get('/retention-rate', getRetentionRate);
router.get('/ai-insights', getAIInsights);
router.get('/feature-usage', getFeatureUsage);

router.get('/users', getAllUsers);

export default router;
