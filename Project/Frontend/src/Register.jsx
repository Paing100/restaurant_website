import { useState } from "react";
import { Button, TextField, Snackbar, Alert, InputLabel, Select, MenuItem  } from "@mui/material";
import axios from "axios";

function Register() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [severity, setSeverity] = useState("error");
  const [role, setRole] = useState("waiter");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");  

  const handleRegister = async () => {
    try{
      const response = await axios.post("http://localhost:8080/auth/register", {
        employeeId: userId, 
        password: password, 
        firstName: firstName,
        lastName: lastName,
        role: role, 
        }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200){
        console.log("Employee registered!");
        setMessage("Registered/Updated Successfully!");
        setSeverity("success");
        setOpen(true);
        removeInputs();
      }

    } catch(error){
      console.log(error);
      setMessage("Error: could not connect to the server");
      setSeverity("error");
      setOpen(true);
    }
  }

  const removeInputs = () => { 
    setUserId("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setRole("waiter");
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectChange = (event) => { 
    setRole(event.target.value);
  }

  return(
    <>
      <div 
        className="register"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "500px",
          gap: "16px",
          marginLeft: "50px", 
        }}
      >
        <div className="username">
          <TextField
            id="outlined-basic"
            label="User ID"
            variant="outlined"
            value={userId}
            required
            error={!userId}
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
            required
            value={password}
            error={!password}
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
        <div className="firstName">
          <TextField
            id="firstName-input"
            label="firstName"
            type="firstName"
            value={firstName}
            required  
            error={!firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
        <div className="lastName">
          <TextField
            id="lastName-input"
            label="lastName"
            type="lastName"
            value={lastName}
            required
            error={!lastName}
            onChange={(e) => setLastName(e.target.value)}
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
        <div className="role">
          <InputLabel id="demo-simple-select-label"   
          sx={{ color: "white", }}
          >Role
          </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={role}
              onChange={handleSelectChange}
              label="Age"
              error={!role}
              sx={{ 
                    width: "200px",
                    color: "white", // Change selected text color
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white", // Change border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "& .MuiSelect-icon": {
                      color: "white", // Change dropdown icon color
                    },
                  }}
            >
            <MenuItem value={"waiter"}>Waiter</MenuItem>
            <MenuItem value={"kitchen"}>Kitchen</MenuItem>
            <MenuItem value={"manager"}>Manager</MenuItem>
          </Select>

        </div>
        <Button
          variant="contained"
          onClick={handleRegister}
          sx={{
            backgroundColor: '#333', // Dark grey background
            color: 'white', // White text color
            '&:hover': {
              backgroundColor: '#666', // Lighter grey on hover
            },
            alignSelf: "flex-start",
          }}
        >
          Register/ Update
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

export default Register;