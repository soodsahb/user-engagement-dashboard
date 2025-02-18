import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = {
  // Dashboard endpoints
  getDashboardMetrics: () => axios.get(`${API_URL}/dashboard/metrics`),
  getUsers: (params) => axios.get(`${API_URL}/dashboard/users`, { params }),
  getActiveUsers: () => axios.get(`${API_URL}/dashboard/active-users`),
  getRetentionRate: () => axios.get(`${API_URL}/dashboard/retention-rate`),
  getAIInsights: () => axios.get(`${API_URL}/dashboard/ai-insights`),
  getFeatureUsage: () => axios.get(`${API_URL}/dashboard/feature-usage`),
};
