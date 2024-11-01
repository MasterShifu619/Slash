import React, { useContext, useState } from "react";
import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { AppContext } from "../header/AppContext";
import NavigationDrawer from "./NavigationDrawer";
import { Button } from "@mui/material";
import { createBrowserHistory } from "history";
import Logout from "../components/Logout";
import LogoutIcon from '@mui/icons-material/Logout';

const history = createBrowserHistory();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%"
  },
  title: {
    flexGrow: 1
  }
}));

/**
 * Template for constructing the navigational drawer and appbar
 * @returns
 */
export default function Navigation() {
  const classes = useStyles();
  const context = useContext(AppContext);
  const [isLoggedIn, setLoggedIn] = useState(true);
  
  const handleLogout = () => {
    //window.alert("User logged out successfully!");
    setLoggedIn(false);
    window.location.href = '/Logout';
    // Optionally, you can perform additional logout logic here

    // Update the login status to false
  };

  const handleLogin = () => {
    window.alert("User logged in successfully!");

    // Optionally, you can perform additional logout logic here

    // Update the login status to false
    setLoggedIn(true);
  };
  return (
    <div className={classes.root}>
      {isLoggedIn ? <div> <NavigationDrawer /> 
      <AppBar position="static" sx={{ bgcolor: '#87CEFA' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={context.toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            sx={{ 
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              fontWeight: 'bold'
            }}
          >
            SLASH
          </Typography>
          
          {isLoggedIn ? (
            <Button 
              color="inherit" 
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ 
                position: 'absolute',
                right: '20px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      </div>
      : <div/>}
    </div>
  );
}
