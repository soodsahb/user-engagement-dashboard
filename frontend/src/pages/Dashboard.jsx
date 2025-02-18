import { useState, useEffect } from 'react';
import { 
  Grid, 
  Container, 
  Alert, 
  CircularProgress, 
  Box,
  Typography 
} from '@mui/material';
import DashboardMetrics from '../components/dashboard/DashboardMetrics';
import UserTable from '../components/dashboard/UserTable';
import AIInsights from '../components/dashboard/AIInsights';
import FilterSection from '../components/dashboard/FilterSection';
import UserDetailModal from '../components/dashboard/UserDetailModal';
import { api } from '../services/api';

const Dashboard = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    retentionCategory: '',
    engagementScore: '',
    sortBy: 'engagementScore',
    order: 'desc',
    dateRange: {
      startDate: '',
      endDate: ''
    }
  });

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  // Apply filters whenever filters change
  useEffect(() => {
    applyFilters();
  }, [filters, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.getUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users data');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...users];

    // Apply search filter
    if (filters.search) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply retention category filter
    if (filters.retentionCategory) {
      result = result.filter(user => 
        user.retentionCategory === filters.retentionCategory
      );
    }

    // Apply engagement score filter
    if (filters.engagementScore) {
      switch (filters.engagementScore) {
        case 'high':
          result = result.filter(user => user.engagementScore >= 70);
          break;
        case 'medium':
          result = result.filter(user => user.engagementScore >= 30 && user.engagementScore < 70);
          break;
        case 'low':
          result = result.filter(user => user.engagementScore < 30);
          break;
      }
    }

    // Apply date range filter
    if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
      const startDate = new Date(filters.dateRange.startDate);
      const endDate = new Date(filters.dateRange.endDate);
      endDate.setHours(23, 59, 59); // Include the entire end date

      result = result.filter(user => {
        const loginDate = new Date(user.lastLoginDate);
        return loginDate >= startDate && loginDate <= endDate;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'lastLoginDate') {
        return filters.order === 'desc' 
          ? new Date(b.lastLoginDate) - new Date(a.lastLoginDate)
          : new Date(a.lastLoginDate) - new Date(b.lastLoginDate);
      }
      
      return filters.order === 'desc' 
        ? b[filters.sortBy] - a[filters.sortBy]
        : a[filters.sortBy] - b[filters.sortBy];
    });

    setFilteredUsers(result);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Metrics Overview */}
        <Grid item xs={12}>
          <DashboardMetrics />
        </Grid>

        {/* Filters */}
        <Grid item xs={12}>
          <FilterSection 
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </Grid>

        {/* Results Count */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" color="text.secondary">
            Showing {filteredUsers.length} of {users.length} users
          </Typography>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12} md={8}>
          <UserTable 
            users={filteredUsers}
            loading={loading}
            onSelectUser={handleSelectUser}
          />
        </Grid>

        {/* AI Insights Panel */}
        <Grid item xs={12} md={4}>
          <AIInsights />
        </Grid>
      </Grid>

      {/* User Detail Modal */}
      <UserDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </Container>
  );
};

export default Dashboard;
