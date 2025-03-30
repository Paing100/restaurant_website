/* eslint-disable */
import { Button, TextField, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        employeeId: userId,
        password: password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const expirationTime = new Date().getTime() + 30 * 60 * 1000;
        sessionStorage.setItem("sessionExpiration", expirationTime);

        const { firstName, role } = response.data;
        sessionStorage.setItem("userName", firstName);
        sessionStorage.setItem("userRole", role.toUpperCase());
        sessionStorage.setItem("employeeId", userId);
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
      setMessage("Error: Could not connect to the server OR Wrong credentials");
      setSeverity("error");
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
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
        <div className="username">
          <TextField
            id="outlined-basic"
            label="User ID"
            variant="outlined"
            onChange={(e) => setUserId(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
            }}
          />
        </div>
        <div className="password">
          <TextField
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
            }}
          />
        </div>
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
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Login;
