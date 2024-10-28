import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh" 
      bgcolor="#f5f5f5" 
      textAlign="center"
      sx={{ 
        margin: 0, 
        padding: 0, 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0 
      }}
    >
      <Typography variant="h4" sx={{ color: '#333' }}>
        You have successfully logged out!
      </Typography>
      
    </Box>
  );
}
export default Logout;
