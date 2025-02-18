import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { api } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MetricCard = ({ title, value, subtitle }) => (
  <Paper 
    sx={{ 
      p: 3, 
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      bgcolor: 'background.default',
      boxShadow: 3
    }}
  >
    <Typography variant="h6" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h3" component="div" sx={{ mb: 1 }}>
      {value}
    </Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Paper>
);

const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.getDashboardMetrics();
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };
    fetchMetrics();
  }, []);

  if (!metrics) return 'Loading...';
  console.log('metrics',metrics)

  const activeUsersData = [
    { name: 'Daily', value: metrics.activeUsers.daily },
    { name: 'Weekly', value: metrics.activeUsers.weekly },
    { name: 'Monthly', value: metrics.activeUsers.monthly }
  ];

  // Calculate retention rate (Monthly active users / Total users)
  const retentionRate = ((metrics.activeUsers.monthly / metrics.totalUsers) * 100).toFixed(1);

  return (
    <Grid container spacing={3}>
      {/* Active Users Chart */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%', boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Active Users
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activeUsersData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3f51b5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Metrics Cards */}
      <Grid item xs={12} md={6}>
        <Grid container spacing={3} height="100%">
          <Grid item xs={6}>
            <MetricCard 
              title="Total Users"
              value={metrics.totalUsers}
              subtitle="Registered users"
            />
          </Grid>
          <Grid item xs={6}>
            <MetricCard 
              title="Avg. Engagement"
              value={`${Math.round(metrics.averageEngagement)}%`}
              subtitle="Based on user activity"
            />
          </Grid>
          <Grid item xs={6}>
            <MetricCard 
              title="Retention Rate"
              value={`${retentionRate}%`}
              subtitle="Monthly active users"
            />
          </Grid>
          <Grid item xs={6}>
            <MetricCard 
              title="Daily Active"
              value={metrics.activeUsers.daily}
              subtitle={`${((metrics.activeUsers.daily / metrics.totalUsers) * 100).toFixed(1)}% of total`}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardMetrics;
