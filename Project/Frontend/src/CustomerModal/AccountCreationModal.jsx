import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import PropTypes from "prop-types";

const AccountCreationModal = ({showEmailPassword, setShowEmailPassword, setEmail, error, setPassword, handleAccountCreation, email, password}) => {
  
  const inputStyle = {
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'white' },
                                '&:hover fieldset': { borderColor: 'white' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
                            },
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiInputBase-input': { color: 'white' },
  }
  
  return(
            <Modal open={showEmailPassword} onClose={() => setShowEmailPassword(false)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'rgba(60, 58, 58, 0.93)',
                    color: 'white',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}>
                    <Typography variant="h6" component="h2" sx={{ color: 'white', mb: 2 }}>
                        Create Your Account
                    </Typography>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!error && error.includes('email')}
                        helperText={error && error.includes('email') ? error : ''}
                        sx={inputStyle}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!error && error.includes('Password')}
                        helperText={error && error.includes('Password') ? error : ''}
                        sx={inputStyle}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAccountCreation}
                            sx={{
                                backgroundColor: '#333',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#666',
                                },
                            }}
                        >
                            Create Account
                        </Button>
                    </Box>
                </Box>
            </Modal>
  );
}

export default AccountCreationModal;

AccountCreationModal.propTypes = {
    showEmailPassword: PropTypes.bool.isRequired,
    setShowEmailPassword: PropTypes.func.isRequired,
    setEmail: PropTypes.func.isRequired,
    error: PropTypes.string,
    setPassword: PropTypes.func.isRequired,
    handleAccountCreation: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired, 
    password: PropTypes.string.isRequired,
};