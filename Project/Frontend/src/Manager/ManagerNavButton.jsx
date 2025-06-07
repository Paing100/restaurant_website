import { Link } from "react-router-dom";
import { Button, Box } from "@mui/material";
import PropTypes from 'prop-types';

// styling for button
const buttonStyle = {
  margin: "0 8px",
  fontWeight: "bold",
  textTransform: "none",
  backgroundColor: '#333',
  color: 'white',
  '&:hover': {
    backgroundColor: 'darkgray',
  },
};
function ManagerNavButton({setEndOfDayOpen}) {
  return (
      <Box sx={{ marginBottom: 2 }}>
        <Link to="/waiter_menu">
          <Button variant="contained" sx={buttonStyle}>Edit Menu</Button>
        </Link>
        <Link to="/calculatePrice">
          <Button variant="contained" sx={buttonStyle}>Calculate Price</Button>
        </Link>
        <Link to="/employeeData">
          <Button variant="contained" sx={buttonStyle}>Employee Data</Button>
        </Link>
        <Link to="/register">
          <Button variant="contained" sx={buttonStyle}>Register Staff</Button>
        </Link>
        <Button
          variant="contained"
          sx={buttonStyle}
          onClick={() => setEndOfDayOpen(true)}
        >
          End Of Business Day
        </Button>
      </Box>
  );
}

ManagerNavButton.propTypes = {
  setEndOfDayOpen: PropTypes.func.isRequired,
};

export default ManagerNavButton;