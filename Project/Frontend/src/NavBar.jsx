import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from './CartContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const NavBar = ({ user, setUser }) => {
  const { customer, logout } = useContext(CartContext);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Restaurant App
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/menu">
            Menu
          </Button>
          <Button color="inherit" component={Link} to="/order">
            Order
          </Button>
          {customer ? (
            <>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;