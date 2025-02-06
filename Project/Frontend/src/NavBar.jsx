import { Toolbar, AppBar, Stack, Button, Typography } from "@mui/material";
import { Link } from 'react-router-dom';

function NavBar(){
  return (
    <>
    <AppBar color="primary" position="static">
        <Toolbar>
          <Typography variant="h4"sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Oaxaca
          </Link>
          </Typography>
          
          <Stack direction="row" spacing={2}>
            <Button variant="text" color="inherit" component={Link} to="/">About</Button>
            <Button variant="text" color="inherit" component={Link} to="/menu">Menu</Button>
            <Button variant="text" color="inherit" component={Link} to="/login">Staff Login</Button>
          </Stack>
        </Toolbar>
      </AppBar>
 
    </>
  );
}
export default NavBar;