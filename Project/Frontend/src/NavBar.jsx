import { useState, useContext } from "react";
import { Toolbar, AppBar, Stack, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";

function NavBar() {
  const navigate = useNavigate();
  const { customer } = useContext(CartContext); // Get customer data from context
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCartClick = () => {
    if (customer) {
      navigate("/order");
    } else {
      setIsModalOpen(true);
      navigate("/order");
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#333", width: "100%" }}>
        <Toolbar sx={{ padding: "0 24px" }}>
          <Typography variant="h4" sx={{ flexGrow: 1, color: "#fff" }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Oaxaca
            </Link>
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button variant="text" sx={{ color: "#ccc" }} component={Link} to="/">
              About
            </Button>
            <Button variant="text" sx={{ color: "#ccc" }} component={Link} to="/menu">
              Menu
            </Button>
            <Button variant="text" sx={{ color: "#ccc" }} onClick={handleCartClick}>
              Cart
            </Button>
            <Button variant="text" sx={{ color: "#ccc" }} component={Link} to="/login">
              Staff Login
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default NavBar;
