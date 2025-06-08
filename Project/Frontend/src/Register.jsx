import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import axios from "axios";
import BackButton from "./BackButton";
import RegisterEmployeeForm from "./Register/RegisterEmployeeForm";

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

  const validateUserId = (userId) => {
    // no space is allowed
    const userIdRegex = /^[A-Za-z0-9]+$/;
    return userIdRegex.test(userId);
  }

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

    // validate userid with no space 
    if (!validateUserId(userId)) {
      setMessage("User ID should only contain letters and digits, no spaces.");
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

    registerEmployee(userId, password, firstName, lastName, role);  
  }

  const registerEmployee = async (userId, password, firstName, lastName, role) => {
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
       <BackButton></BackButton>

      <RegisterEmployeeForm
        values={{ userId, password, firstName, lastName, role }}
        errors={{ passwordError, nameError }}
        handlers={{
          handleSelectChange,
          handleRegister,
          setUserId,
          setPassword,
          setFirstName,
          setLastName,
          setPasswordError
        }}
      ></RegisterEmployeeForm>

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