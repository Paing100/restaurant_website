import { Button, TextField, InputLabel, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

function RegisterEmployeeForm({values, errors, handlers}) {

  const { userId, password, firstName, lastName, role } = values; 
  const {passwordError, nameError} = errors; 
  const {handleSelectChange, handleRegister, setUserId, setPassword, setFirstName, setLastName, setPasswordError} = handlers;
  
  const textFieldStyles = {
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
            };

  return (
    <>
        <div className="username">
          <TextField
            id="outlined-basic"
            label="User ID"
            variant="outlined"
            value={userId}
            required
            error={!userId}
            onChange={(e) => setUserId(e.target.value)}
            sx={textFieldStyles}
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
            sx={textFieldStyles}
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
            sx={textFieldStyles}
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
            sx={textFieldStyles}
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
    </>
  );
}

RegisterEmployeeForm.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handlers: PropTypes.func.isRequired
};

export default RegisterEmployeeForm;