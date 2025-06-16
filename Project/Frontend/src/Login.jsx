import { Button, TextField, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {inputStyle} from "./useCommonInputStyle";

function Login() {
  // state variables 
  const [userId, setUserId] = useState(""); // stores user id input 
  const [password, setPassword] = useState(""); // stores password input 
  const [message, setMessage] = useState(""); // stores message for the snackbar 
  const [severity, setSeverity] = useState("error"); // severity of the snackbar for display
  const [open, setOpen] = useState(false); // controls the visibility of the snackbar 
  const navigate = useNavigate(); // hook for navigation 

  // function to handle login 
  const handleLogin = async () => {
    try {
      // send login request to the server 
      const response = await axios.post("http://localhost:8080/auth/login", {
        employeeId: userId,
        password: password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Login successful 
      if (response.status === 200) {
        // set session time to 30 minutes 
        const expirationTime = new Date().getTime() + 30 * 60 * 1000;
        sessionStorage.setItem("sessionExpiration", expirationTime);

        // store user details in session storage 
        const { firstName, role } = response.data;
        sessionStorage.setItem("userName", firstName);
        sessionStorage.setItem("userRole", role.toUpperCase());
        sessionStorage.setItem("employeeId", userId);

        // Navigate to the appropriate page based on the user's role 
        const storedRole = sessionStorage.getItem("userRole");
        if (storedRole === "WAITER") {
          navigate("/waiter");
        } else if (storedRole === "KITCHEN") {
          navigate("/kitchen");
        } else if (storedRole === "MANAGER") {
          navigate("/manager");
        }
        window.location.reload(); // Reload the page after login
      }
    } catch (error) {
      console.log(error);
      setMessage("Error: Could not connect to the server OR Wrong credentials");
      setSeverity("error");
      setOpen(true);
    }
  };

  // function to close snakcbar 
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
    {/* Login form container */}
      <div
        className="login"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "300px",
          gap: "16px",
        }}
      >

        {/* User ID input field */}
        <div className="username">
          <TextField
            id="outlined-basic"
            label="User ID"
            variant="outlined"
            onChange={(e) => setUserId(e.target.value)}
            sx={inputStyle}
          />
        </div>

        {/* Password input field */}
        <div className="password">
          <TextField
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            sx={inputStyle}
          />
        </div>

        {/* Login button */}
        <Button
          variant="contained"
          onClick={handleLogin}
          sx={{
            backgroundColor: '#333',
            color: 'white',
            '&:hover': {
              backgroundColor: '#666',
            },
          }}
        >
          Login
        </Button>
      </div>
      
      {/* Snackbar for displaying messages */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Login;
