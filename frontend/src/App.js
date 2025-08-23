import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { theme } from './theme/theme';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Invoice from './pages/Invoice/Invoice';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
     const authStatus = localStorage.getItem('isAuthenticated') === 'true';
     setIsAuthenticated(authStatus);
  }, []);

  return (
    <ThemeProvider theme={theme}>
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
                <Invoice setAuth={setIsAuthenticated}/>
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/invoice" : "/login"} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;