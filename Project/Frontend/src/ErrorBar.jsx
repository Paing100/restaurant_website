import React from 'react';
import { Alert, Snackbar } from '@mui/material';

function ErrorBar({error, setError}) {
  return(
        <Snackbar open autoHideDuration={6000} onClose={() => setError("")}>
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        </Snackbar>
  );
}

export default ErrorBar;