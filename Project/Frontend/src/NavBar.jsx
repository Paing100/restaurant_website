import { useState, useContext, useEffect } from "react";
import { Toolbar, AppBar, Stack, Button, Typography, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import CustomerModal from "./CustomerModal";
import CustomerLoginModal from "./CustomerLoginModal";

function NavBar() {
  const navigate = useNavigate();
  const { customer, logout } = useContext(CartContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomerLoginOpen, setIsCustomerLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (role) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleCartClick = () => {
    if (!customer) {
      setIsModalOpen(true);
      return;
    }
    navigate("/order");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("sessionExpiration");
    setIsLoggedIn(false);
    logout();
    navigate("/");
  };

  const handleLoginClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStaffLogin = () => {
    handleClose();
    navigate("/login");
  };

  const handleCustomerLogin = () => {
    handleClose();
    setIsCustomerLoginOpen(true);
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
            {!customer && !isLoggedIn ? (
              <>
                <Button variant="text" sx={{ color: "#ccc" }} onClick={handleLoginClick}>
                  Login
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: "#333",
                      color: "#ccc",
                      "& .MuiMenuItem-root": {
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      },
                    },
                  }}
                >
                  <MenuItem onClick={handleStaffLogin}>Staff Login</MenuItem>
                  <MenuItem onClick={handleCustomerLogin}>Customer Login</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                sx={{
                  color: "#f44336",
                  borderColor: "#f44336",
                  borderWidth: "2px",
                  "&:hover": {
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                  },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {isModalOpen && <CustomerModal onClose={() => setIsModalOpen(false)} />}
      {isCustomerLoginOpen && <CustomerLoginModal open={isCustomerLoginOpen} onClose={() => setIsCustomerLoginOpen(false)} />}
    </>
  );
}

export default NavBar;