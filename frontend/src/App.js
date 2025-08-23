import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, CircularProgress, Box } from '@mui/material';
import { ThemeProvider as StyledThemeProvider } from 'styled-components'; // 1. Import from styled-components
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { theme } from './theme/theme';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Invoice from './pages/Invoice/Invoice';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Could not check authentication status", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    // The MUI provider handles MUI components
    <MuiThemeProvider theme={theme}>
      {/* 2. The styled-components provider makes the theme available to styled() components */}
      <StyledThemeProvider theme={theme}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Router>
          <Routes>
            <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/invoice"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Invoice setAuth={setIsAuthenticated} />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to={isAuthenticated ? '/invoice' : '/login'} />} />
          </Routes>
        </Router>
      </StyledThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;