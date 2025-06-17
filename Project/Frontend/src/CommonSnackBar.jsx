import {Snackbar,Alert} from "@mui/material";
import PropTypes from 'prop-types';

function CommonSnackBar({open, severity, handleClose, notification, backgroundColor="#5762d5"}) {
  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{
            width: "100%",
            backgroundColor: {backgroundColor},
            color: "white",
            borderRadius: "8px",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
        >
          {notification}
        </Alert>
      </Snackbar>
    </>
  );
}

CommonSnackBar.propTypes = {
  open: PropTypes.bool.isRequired,
  severity: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  notification: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
}

export default CommonSnackBar;