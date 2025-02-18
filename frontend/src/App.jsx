import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box sx={{ pt: '84px' }}> {/* Add padding to account for fixed navbar */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;

