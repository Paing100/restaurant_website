import { Box, TextField, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

function InputBox({setEmail, setPassword, onClose, email, password, handleLogin, error}) {
  const textStyle = {
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'white' },
                                '&:hover fieldset': { borderColor: 'white' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
                                '& input': { color: 'white' },
                            },
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                            '& .MuiInputBase-input': { color: 'white' },
                        };

  return (
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
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'lightgray',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" component="h2" sx={{ color: 'white', mb: 2 }}>
                        Customer Login
                    </Typography>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!error}
                        sx={textStyle}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!error}
                        sx={textStyle}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleLogin}
                            sx={{
                                backgroundColor: '#333',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#666',
                                },
                            }}
                        >
                            Login
                        </Button>
                    </Box>
                </Box>
  ); 
}

InputBox.propTypes = {
  setEmail: PropTypes.func.isRequired, 
  setPassword: PropTypes.func.isRequired, 
  onClose: PropTypes.func.isRequired, 
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired, 
  handleLogin: PropTypes.func.isRequired, 
  error: PropTypes.string.isRequired,
};

export default InputBox; 
