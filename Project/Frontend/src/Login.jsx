import {Button,TextField} from "@mui/material";

function Login() {
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
        />
        </div>
        <div className="password">
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
        />        </div>
        <Button variant="contained">Login</Button>
      </div>
    </>
  );
}

export default Login; 