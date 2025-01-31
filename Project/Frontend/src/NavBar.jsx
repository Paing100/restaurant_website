import { Toolbar, AppBar, Stack, Link, Button, Typography } from "@mui/material";

function NavBar(){
  return (
    <>
    <AppBar color="primary" position="static">
        <Toolbar>
          <Typography variant="h4"sx={{ flexGrow: 1 }}>
            <Link href="/" color="inherit" underline="none">
              Oaxaca
            </Link>
          </Typography>
          
          <Stack direction="row" spacing={2}>
            <Button variant="text" color="inherit" href="/">About</Button>
            <Button variant="text" color="inherit" href="/menu">Menu</Button>
            <Button variant="text" color="inherit" href="/login">Staff Login</Button>
          </Stack>
        </Toolbar>
      </AppBar>
 
    </>
  );
}
export default NavBar;