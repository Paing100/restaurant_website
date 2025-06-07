import { Alert, Snackbar } from '@mui/material';
import PropTypes from 'prop-types';

function ErrorBar({error, setError}) {
  return(
        <Snackbar open autoHideDuration={6000} onClose={() => setError("")}>
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        </Snackbar>
  );
}

ErrorBar.propTypes = {
  error: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired
}

export default ErrorBar;