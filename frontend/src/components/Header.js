import React from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DescriptionIcon from '@mui/icons-material/Description';

const Header = ({ setAuth }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    setAuth(false);
    toast.info('You have been logged out.');
    navigate('/login');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: "linear-gradient(135deg, #5d9edeff, #091b2aff)", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <Avatar sx={{ bgcolor: "white", color: "primary.main", mr: 1 }}>
            <DescriptionIcon />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Invoice Generator
          </Typography>
        </Box>
        <Button 
          color="inherit" 
          variant="contained" 
          sx={{ 
            bgcolor: "white", 
            color: "primary.main", 
            borderRadius: "20px", 
            px: 3,
            "&:hover": { bgcolor: "grey.100" }
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
