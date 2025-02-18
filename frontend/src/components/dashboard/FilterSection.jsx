import { 
  Paper, 
  Grid, 
  TextField, 
  MenuItem, 
  Box,
  IconButton,
  InputAdornment,
  Typography,
  Collapse,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useState } from 'react';

const FilterSection = ({ onFilterChange }) => {
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState({
      startDate: '',
      endDate: ''
  });

  const handleDateChange = (type, value) => {
      const newDateRange = { ...dateRange, [type]: value };
      setDateRange(newDateRange);
      
      // Only trigger filter if both dates are selected
      if (newDateRange.startDate && newDateRange.endDate) {
          onFilterChange({ dateRange: newDateRange });
      }
  };

  return (
      <Paper sx={{ p: 2, mb: 3, boxShadow: 3 }}>
          <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={3}>
                  <TextField
                      fullWidth
                      placeholder="Search users..."
                      InputProps={{
                          startAdornment: (
                              <InputAdornment position="start">
                                  <SearchIcon />
                              </InputAdornment>
                          ),
                      }}
                      onChange={(e) => onFilterChange({ search: e.target.value })}
                  />
              </Grid>

              {/* Retention Category Filter */}
              <Grid item xs={12} md={2}>
                  <TextField
                      select
                      fullWidth
                      label="Retention Category"
                      defaultValue=""
                      onChange={(e) => onFilterChange({ retentionCategory: e.target.value })}
                  >
                      <MenuItem value="">All Categories</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                  </TextField>
              </Grid>

              {/* Engagement Score Range */}
              <Grid item xs={12} md={2}>
                  <TextField
                      select
                      fullWidth
                      label="Engagement Score"
                      defaultValue=""
                      onChange={(e) => onFilterChange({ engagementScore: e.target.value })}
                  >
                      <MenuItem value="">All Scores</MenuItem>
                      <MenuItem value="high">High (70-100%)</MenuItem>
                      <MenuItem value="medium">Medium (30-70%)</MenuItem>
                      <MenuItem value="low">Low (0-30%)</MenuItem>
                  </TextField>
              </Grid>

              {/* Sort By */}
              <Grid item xs={12} md={2}>
                  <TextField
                      select
                      fullWidth
                      label="Sort By"
                      defaultValue="engagementScore"
                      onChange={(e) => onFilterChange({ sortBy: e.target.value })}
                  >
                      <MenuItem value="engagementScore">Engagement Score</MenuItem>
                      <MenuItem value="lastLoginDate">Last Login</MenuItem>
                      <MenuItem value="name">Name</MenuItem>
                  </TextField>
              </Grid>

              {/* Date Range Toggle Button */}
              <Grid item xs={12} md={3}>
                  <Button
                      variant={showDateFilter ? "contained" : "outlined"}
                      startIcon={<CalendarTodayIcon />}
                      onClick={() => setShowDateFilter(!showDateFilter)}
                      fullWidth
                      sx={{ height: '56px' }}
                  >
                      Date Range Filter
                  </Button>
              </Grid>

              {/* Date Range Filters */}
              <Grid item xs={12}>
                  <Collapse in={showDateFilter}>
                      <Box sx={{ 
                          p: 2, 
                          bgcolor: 'background.paper', 
                          borderRadius: 1,
                          border: 1,
                          borderColor: 'divider'
                      }}>
                          {/* <Typography variant="subtitle2" gutterBottom>
                              Filter by Date Range
                          </Typography> */}
                          <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                  <TextField
                                      fullWidth
                                      type="date"
                                      label="Start Date"
                                      value={dateRange.startDate}
                                      onChange={(e) => handleDateChange('startDate', e.target.value)}
                                      InputLabelProps={{
                                          shrink: true,
                                      }}
                                  />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                  <TextField
                                      fullWidth
                                      type="date"
                                      label="End Date"
                                      value={dateRange.endDate}
                                      onChange={(e) => handleDateChange('endDate', e.target.value)}
                                      InputLabelProps={{
                                          shrink: true,
                                      }}
                                      inputProps={{
                                          min: dateRange.startDate // Prevents selecting end date before start date
                                      }}
                                  />
                              </Grid>
                          </Grid>
                      </Box>
                  </Collapse>
              </Grid>
          </Grid>
      </Paper>
  );
};

export default FilterSection;
