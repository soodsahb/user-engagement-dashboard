// components/common/Navbar.jsx
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

const Navbar = () => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar>
        <Box 
          display="flex" 
          alignItems="center" 
          sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
          }}
        >
          <AutoGraphIcon sx={{ color: 'white', mr: 1 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'white',
              letterSpacing: '1px',
              fontFamily: "'Poppins', sans-serif",
              textTransform: 'uppercase',
              '& span': {
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 300
              }
            }}
          >
            Engage<span>Hub</span>
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
