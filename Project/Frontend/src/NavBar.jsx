import { useState, useContext } from "react";
import { Toolbar, AppBar, Stack, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import CustomerModal from "./CustomerModal"; // Import the modal

function NavBar() {
  const navigate = useNavigate();
  const { customer, logout } = useContext(CartContext); // Use logout from context
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCartClick = () => {
    if (!customer) {
      setIsModalOpen(true);
      return;
    }
    navigate("/order");
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
            {!customer ? (
              <Button variant="text" sx={{ color: "#ccc" }} component={Link} to="/login">
                Staff Login
              </Button>
            ) : (
              <Button variant="text" sx={{ color: "#f44336" }} onClick={logout}>
                Logout
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {isModalOpen && <CustomerModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

export default NavBar;
