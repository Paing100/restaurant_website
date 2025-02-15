import {Button,TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import React, {useState, useEffect} from "react";
import axios from "axios";

function Login() {
  const [userId, setUserId] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [message, setMessage] = useState(""); 
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
      if (response.status === 200){
        const expirationTime = new Date().getTime() + 30 * 60 * 1000;
        localStorage.setItem("sessionExpiration", expirationTime);

        const {firstName, role, message} = response.data;
        localStorage.setItem("userName", firstName);
        localStorage.setItem("userRole", role);
        navigate("/waiter");
      }
    } catch (error) {
      setMessage("Error: Could not connect to the server OR Wrong credentials");
    }
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
      }}>
        <div className="username">
        <TextField 
          id="outlined-basic" 
          label="User ID" 
          variant="outlined" 
          onChange={(e) => setUserId(e.target.value)}
        />
        </div>
        <div className="password">
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)} 
        />        </div>
        <Button variant="contained" onClick={handleLogin}>Login</Button>
      </div>
      <p>{message}</p> 
    </>
  );
}

export default Login; 