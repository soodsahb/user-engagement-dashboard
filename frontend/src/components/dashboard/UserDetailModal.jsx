import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import InfoIcon from '@mui/icons-material/Info';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VideocamIcon from '@mui/icons-material/Videocam';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const UserDetailModal = ({ open, onClose, user }) => {
  if (!user) return null;

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Mock data for feature usage
  const featureData = Object.entries(user.features).map(([name, value]) => ({
    name,
    value
  }));

  const getAISuggestions = (engagementScore, churnRisk) => {
    if (churnRisk > 70) {
      return {
        title: "High Risk - Immediate Action Required",
        suggestions: [
          "Schedule an urgent customer success meeting",
          "Offer a personalized discount on their next renewal",
          "Provide premium features access for 30 days",
          "Send a dedicated customer success representative",
          "Create a customized re-engagement plan"
        ],
        priority: "high",
        color: "#ff4444"
      };
    } else if (churnRisk > 40) {
      return {
        title: "Medium Risk - Proactive Measures Needed",
        suggestions: [
          "Send educational materials about unused features",
          "Offer a product walkthrough session",
          "Schedule a quarterly review meeting",
          "Provide case studies of similar successful users",
          "Send usage optimization tips"
        ],
        priority: "medium",
        color: "#ffbb33"
      };
    } else {
      return {
        title: "Low Risk - Enhancement Opportunities",
        suggestions: [
          "Invite to beta testing program",
          "Ask for product feedback and testimonials",
          "Offer referral program benefits",
          "Share advanced usage tips and tricks",
          "Consider for case study features"
        ],
        priority: "low",
        color: "#00C851"
      };
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: 'background.default'
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Typography component="span" variant="h6">
    User Profile: {user.name}
  </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* User Info Section */}
          <Grid item xs={12} md={4}>
  <Paper 
    sx={{ 
      p: 3, 
      height: '100%',
      backgroundColor: '#fff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
    }}
  >
    <Typography component="div" variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
  User Details
</Typography>

    <Box sx={{ mt: 3 }}>
      {/* Basic Info */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          component={'div'}
          gutterBottom 
          sx={{ 
            fontWeight: '500',
            color: 'text.primary'
          }}
        >
          {user.name}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            mb: 2 
          }}
        >
          Last active: {new Date(user.lastLoginDate).toLocaleDateString()}
        </Typography>
      </Box>

      {/* Status Indicators */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3 
        }}
      >
        <Box 
          sx={{ 
            backgroundColor: 'primary.light',
            p: 1.5,
            borderRadius: 2,
            flex: 1,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" sx={{ color: 'white' }}>
            {user.engagementScore}%
          </Typography>
          <Typography variant="caption" sx={{ color: 'white' }}>
            Engagement
          </Typography>
        </Box>
        <Box 
          sx={{ 
            backgroundColor: user.churnRisk > 70 ? '#ff4444' : 
                           user.churnRisk > 40 ? '#ffbb33' : '#00C851',
            p: 1.5,
            borderRadius: 2,
            flex: 1,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" sx={{ color: 'white' }}>
            {user.churnRisk}%
          </Typography>
          <Typography variant="caption" sx={{ color: 'white' }}>
            Churn Risk
          </Typography>
        </Box>
      </Box>

      {/* Contact Actions */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: 'text.secondary',
            mb: 2,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Email Action */}
          <Box 
            component="a"
            href={`mailto:${user.email}`}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              p: 1.5,
              borderRadius: 1,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              textDecoration: 'none',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'action.hover',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <EmailIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">Send Email</Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>

          {/* Phone Action */}
          <Box 
            component="a"
            href="tel:+1234567890"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              p: 1.5,
              borderRadius: 1,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              textDecoration: 'none',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'action.hover',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <PhoneIcon sx={{ color: 'success.main', mr: 1 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">Call User</Typography>
              <Typography variant="caption" color="text.secondary">
                +1 (234) 567-890
              </Typography>
            </Box>
          </Box>

          {/* Video Call Action */}
          <Box 
            component="a"
            href="https://meet.google.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              p: 1.5,
              borderRadius: 1,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              textDecoration: 'none',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'action.hover',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <VideocamIcon sx={{ color: 'error.main', mr: 1 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">Start Video Call</Typography>
              <Typography variant="caption" color="text.secondary">
                Google Meet
              </Typography>
            </Box>
          </Box>

          {/* Schedule Meeting Action */}
          <Box 
            component="a"
            href="https://calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              p: 1.5,
              borderRadius: 1,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              textDecoration: 'none',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'action.hover',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <CalendarMonthIcon sx={{ color: 'warning.main', mr: 1 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">Schedule Meeting</Typography>
              <Typography variant="caption" color="text.secondary">
                Google Calendar
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Retention Category */}
      <Box sx={{ mt: 3 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: 'text.secondary',
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Retention Status
        </Typography>
        <Box 
          sx={{ 
            p: 2,
            borderRadius: 1,
            bgcolor: user.retentionCategory === 'High' ? 'success.light' : 
                    user.retentionCategory === 'Medium' ? 'warning.light' : 
                    'error.light',
            color: 'white'
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {user.retentionCategory} Priority Customer
          </Typography>
        </Box>
      </Box>
    </Box>
  </Paper>
</Grid>

          {/* Feature Usage Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '100%' }}>
            <Typography component="div" variant="h6" gutterBottom>
  Feature Usage
</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={featureData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Active Status */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
            <Typography component="div" variant="h6" gutterBottom>
  Activity Status
</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Daily Active', value: user.activeStatus.daily ? 1 : 0 },
                      { name: 'Weekly Active', value: user.activeStatus.weekly ? 1 : 0 },
                      { name: 'Monthly Active', value: user.activeStatus.monthly ? 1 : 0 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {featureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Engagement Trends */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
            <Typography component="div" variant="h6" gutterBottom>
  Engagement Trends
</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  Current Engagement Score: {user.engagementScore}%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Retention Category: {user.retentionCategory}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Risk Level: {user.churnRisk}%
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* AI Suggestions Section */}
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 3, 
                mt: 2,
                border: 3,
                borderColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.1)' 
                  : 'rgba(0,0,0,0.05)',
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AutoFixHighIcon 
                  sx={{ 
                    mr: 2, 
                    color: getAISuggestions(user.engagementScore, user.churnRisk).color 
                  }} 
                />
                <Typography component="div" variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
  AI-Powered Recommendations
</Typography>
              </Box>
              
              <Box 
                sx={{ 
                  backgroundColor: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(255,255,255,0.05)' 
                    : 'rgba(0,0,0,0.02)',
                  p: 2,
                  borderRadius: 1
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  sx={{ 
                    color: getAISuggestions(user.engagementScore, user.churnRisk).color,
                    fontWeight: 'bold'
                  }}
                >
                  {getAISuggestions(user.engagementScore, user.churnRisk).title}
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {getAISuggestions(user.engagementScore, user.churnRisk).suggestions.map((suggestion, index) => (
                    <Grid item xs={12} key={index}>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          p: 1.5,
                          backgroundColor: 'background.paper',
                          borderRadius: 1,
                          boxShadow: 1,
                          '&:hover': {
                            backgroundColor: (theme) => theme.palette.mode === 'dark' 
                              ? 'rgba(255,255,255,0.05)' 
                              : 'rgba(0,0,0,0.02)',
                            transform: 'translateX(5px)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                      >
                        <ArrowRightIcon 
                          sx={{ 
                            mr: 1, 
                            color: getAISuggestions(user.engagementScore, user.churnRisk).color,
                            fontSize: 20
                          }} 
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {suggestion}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <InfoIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 'small' }} />
                <Typography variant="caption" color="text.secondary">
                  Recommendations are based on user engagement patterns and historical data
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
