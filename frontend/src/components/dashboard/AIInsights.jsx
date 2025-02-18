import { useEffect, useState } from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Divider,
  Box,
  Chip,
  Collapse,
  IconButton,
  Pagination,
  Stack
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { api } from '../../services/api';

const CollapsibleSection = ({ title, icon, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ mb: 3 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          cursor: 'pointer',
          bgcolor: 'background.paper',
          p: 1,
          borderRadius: 1,
          '&:hover': { bgcolor: 'action.hover' }
        }}
        onClick={() => setOpen(!open)}
      >
        <Typography 
          variant="subtitle1" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 'medium'
          }}
        >
          {icon}
          {title}
        </Typography>
        <IconButton size="small">
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </Box>
      <Collapse in={open} timeout="auto">
        <Box sx={{ mt: 2 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

const AIInsights = () => {
  const [insights, setInsights] = useState(null);
  const [page, setPage] = useState(1);
  const [usersPerPage] = useState(2);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await api.getAIInsights();
        setInsights(response.data);
      } catch (error) {
        console.error('Error fetching insights:', error);
      }
    };
    fetchInsights();
  }, []);

  if (!insights) return 'Loading...';

  // Pagination calculation for at-risk users
  const indexOfLastUser = page * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = insights.atRiskUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(insights.atRiskUsers.length / usersPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        height: '100%', 
        boxShadow: 3,
        bgcolor: '#fafafa'
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{
          color: 'primary.main',
          fontWeight: 'bold',
          mb: 3
        }}
      >
        AI Insights
      </Typography>

      {/* Recommendations Section */}
      <CollapsibleSection 
        title="Recommendations" 
        icon={<TipsAndUpdatesIcon sx={{ mr: 1, color: 'primary.main' }} />}
      >
        <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          {insights.recommendations.map((rec, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
              <ListItemText 
                primary={rec}
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontSize: '0.9rem',
                    color: 'text.secondary' 
                  } 
                }}
              />
            </ListItem>
          ))}
        </List>
      </CollapsibleSection>

      <Divider sx={{ my: 2 }} />

      {/* At Risk Users Section */}
      <CollapsibleSection 
        title="Users at Risk" 
        icon={<WarningIcon sx={{ mr: 1, color: 'error.main' }} />}
      >
        <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          {currentUsers.map((user) => (
            <ListItem 
              key={user._id}
              sx={{
                py: 1.5,
                '&:hover': { bgcolor: 'action.hover' },
                borderRadius: 1,
                mb: 1
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle2">{user.name}</Typography>
                }
                secondary={
                  <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      Engagement: {user.engagementScore}%
                    </Typography>
                    <Chip 
                      label={`Risk: ${user.churnRisk}%`}
                      size="small"
                      color="error"
                      sx={{ height: 20 }}
                    />
                  </Stack>
                }
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
            size="small"
            color="primary"
          />
        </Box>
      </CollapsibleSection>

      <Divider sx={{ my: 2 }} />

      {/* Suggested Actions Section */}
      <CollapsibleSection 
        title="Suggested Actions" 
        icon={<AssignmentIcon sx={{ mr: 1, color: 'success.main' }} />}
      >
        <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          {insights.suggestedActions.map((action, index) => (
            <ListItem 
              key={index}
              sx={{
                py: 1,
                '&:hover': { bgcolor: 'action.hover' },
                borderRadius: 1
              }}
            >
              <ListItemText 
                primary={action}
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontSize: '0.9rem',
                    color: 'text.secondary' 
                  } 
                }}
              />
            </ListItem>
          ))}
        </List>
      </CollapsibleSection>
    </Paper>
  );
};

export default AIInsights;
