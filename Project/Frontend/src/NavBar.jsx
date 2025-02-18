import { Toolbar, AppBar, Stack, Button, Typography } from "@mui/material";
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#333', width: '100%' }}>
        <Toolbar sx={{ padding: '0 24px' }}>
          <Typography variant="h4" sx={{ flexGrow: 1, color: '#fff' }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Oaxaca
            </Link>
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button variant="text" sx={{ color: '#ccc' }} component={Link} to="/">About</Button>
            <Button variant="text" sx={{ color: '#ccc' }} component={Link} to="/menu">Menu</Button>
            <Button variant="text" sx={{ color: '#ccc' }} component={Link} to="/order">Cart</Button>
            <Button variant="text" sx={{ color: '#ccc' }} component={Link} to="/login">Staff Login</Button>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default NavBar;