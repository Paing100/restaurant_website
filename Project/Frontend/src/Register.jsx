import { useState } from "react";
import { Button, TextField, Snackbar, Alert, InputLabel, Select, MenuItem } from "@mui/material";
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
  const [passwordError, setPasswordError] = useState(false);
  const [nameError, setNameError] = useState({ firstName: false, lastName: false });

  const validatePassword = (pwd) => {
    // Password must:
    // - Contain at least one uppercase letter
    // - Contain at least one lowercase letter
    // - Contain at least one digit
    // - Contain at least one special character
    // - Be at least 8 characters long
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>?]).{8,}$/;

    return passwordRegex.test(pwd);
  };

  const validateName = (name) => {
    // Only allow letters (including accented characters)
    const nameRegex = /^[A-Za-zÀ-ÿ]+$/;
    return nameRegex.test(name);
  };

  const handleRegister = async () => {
    // Reset name errors
    setNameError({ firstName: false, lastName: false });
    
    // Validate all required fields
    if (!userId || !password || !firstName || !lastName) {
      setMessage("All fields are required");
      setSeverity("error");
      setOpen(true);
      return;
    }

    // Check name validations
    if (!validateName(firstName)) {
      setNameError(prev => ({ ...prev, firstName: true }));
      setMessage("First name should only contain letters and no spaces");
      setSeverity("error");
      setOpen(true);
      return;
    }

    if (!validateName(lastName)) {
      setNameError(prev => ({ ...prev, lastName: true }));
      setMessage("Last name should only contain letters and no spaces");
      setSeverity("error");
      setOpen(true);
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      setPasswordError(true);
      setMessage("Invalid password format");
      setSeverity("error");
      setOpen(true);
      return;
    }

    try {
      // Send registration request to backend
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
       // If registration is successful
      if (response.status === 200) {
        console.log("Employee registered!");
        setMessage("Registered/Updated Successfully!");
        setSeverity("success");
        setOpen(true);
        removeInputs(); // Clear form fields
      }

    } catch (error) {
      console.log(error);
      setMessage("Error: could not connect to the server");
      setSeverity("error");
      setOpen(true);
    }
  }
 // Clears input fields after successful registration
  const removeInputs = () => {
    setUserId("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setRole("waiter");
    setPasswordError(false);
    setNameError({ firstName: false, lastName: false });
  }
  // Closes the Snackbar notification
  const handleClose = () => {
    setOpen(false);
  };
  // Handles role selection change
  const handleSelectChange = (event) => {
    setRole(event.target.value);
  }

  return (
    <>
      <div
        className="register"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          gap: "16px",
        }}
      >
        <Button
          onClick={() => window.history.back()}
          sx={{
            position: "absolute",
            top: "100px",
            left: "50px",
            backgroundColor: '#333',
            color: 'white',
            '&:hover': {
              backgroundColor: 'darkgray',
            },
            marginBottom: 2,
          }}
        >
          ← Back
        </Button>
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
            required
            value={password}
            error={passwordError}
            autoComplete="current-password"
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(false);
            }}
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
        <div className="firstName">
          <TextField
            id="firstName-input"
            label="First Name"
            type="text"
            value={firstName}
            required
            error={nameError.firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
        <div className="lastName">
          <TextField
            id="lastName-input"
            label="Last Name"
            type="text"
            value={lastName}
            required
            error={nameError.lastName}
            onChange={(e) => setLastName(e.target.value)}
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
            label="Role"
            error={!role}
            sx={{
              width: "200px",
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "& .MuiSelect-icon": {
                color: "white",
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
            backgroundColor: '#333',
            color: 'white',
            '&:hover': {
              backgroundColor: '#666',
            },
            alignSelf: "center", // Center the button
          }}
        >
          Register/ Update
        </Button>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{
            width: '100%',
            backgroundColor: '#333',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Register;