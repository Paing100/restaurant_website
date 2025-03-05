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
        password: password
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        const expirationTime = new Date().getTime() + 30 * 60 * 1000;
        localStorage.setItem("sessionExpiration", expirationTime);

        const { firstName, role } = response.data;
        localStorage.setItem("userName", firstName);
        localStorage.setItem("userRole", role.toUpperCase());
        const storedRole = localStorage.getItem("userRole");
        if (storedRole === "WAITER") {
          navigate("/waiter");
        } else if (storedRole === "KITCHEN") {
          navigate("/kitchen");
        }

      }
    } catch (error) {
      setMessage("Error: Could not connect to the server OR Wrong credentials" + error);
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
                  borderColor: 'white', // Dark grey border
                },
                '&:hover fieldset': {
                  borderColor: 'white', // Lighter grey on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Even lighter grey when focused
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white', // Dark grey text color
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white', // Lighter grey text color when focused
              },
              '& .MuiInputBase-input': {
                color: 'white', // Dark grey text color
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
                  borderColor: 'white', // Dark grey border
                },
                '&:hover fieldset': {
                  borderColor: 'white', // Lighter grey on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Even lighter grey when focused
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white', // Dark grey text color
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white', // Lighter grey text color when focused
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
            backgroundColor: '#333', // Dark grey background
            color: 'white', // White text color
            '&:hover': {
              backgroundColor: '#666', // Lighter grey on hover
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
