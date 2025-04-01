import { useState, useContext, useEffect, useRef } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
//import PropTypes from 'prop-types';

const CustomerModal = () => {
    const { setCustomer, setTableNum, customer } = useContext(CartContext);
    const [name, setName] = useState('');
    const [tableNum, setTableNumState] = useState('');
    const [open, setOpen] = useState(true);
    const [error, setError] = useState('');
    const [showAccountPrompt, setShowAccountPrompt] = useState(false);
    const [showEmailPassword, setShowEmailPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const nameInputRef = useRef(null);

    useEffect(() => {
        if (customer) {
            setOpen(false);
        }
    }, [customer]);

    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    const validateInputs = () => {
        // Trim inputs to remove leading/trailing whitespace
        const trimmedName = name.trim();
        const trimmedTableNum = tableNum.trim();

        if (!trimmedName) {
            setError('Name is required');
            return false;
        }
        if (trimmedName.length < 3 || trimmedName.length > 20) {
            setError('Name must be between 3 and 20 characters');
            return false;
        }

        const nameRegex = /^[a-zA-Z\s-]+$/;
        if (!nameRegex.test(trimmedName)) {
            setError('Name can only contain letters, spaces, and hyphens');
            return false;
        }

        if (!trimmedTableNum) {
            setError('Table number is required');
            return false;
        }

        // Check table number range (e.g., between 1 and 40)
        const tableNumInt = parseInt(trimmedTableNum, 10);
        if (isNaN(tableNumInt) || tableNumInt <= 0) {
            setError('Table number must be between 1 and 40');
            return false;
        }

        // Check table number range (e.g., between 1 and 40)
        if (tableNumInt > 40) {
            setError('Table number must be between 1 and 40');
            return false;
        }

        // Clear any previous errors
        setError('');
        return true;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (pwd) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>?]).{8,}$/;
        return passwordRegex.test(pwd);
    };

    const handleSubmit = async () => {
        // Validate inputs before submitting
        if (!validateInputs()) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/customers/add?name=${encodeURIComponent(name.trim())}&tableNum=${tableNum.trim()}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to add customer');
            }

            const newCustomer = await response.json();
            const customerWithOrderId = {
                ...newCustomer,
                orderId: newCustomer.orders[0].orderId
            };
            setCustomer(customerWithOrderId);
            setTableNum(tableNum.trim());
            setShowAccountPrompt(true);
        } catch (error) {
            console.error('Error adding customer:', error);
            setError('Failed to submit. Please try again.');
        }
    };

    const handleAccountCreation = async () => {
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (!validatePassword(password)) {
            setError('Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/customers/${customer.customerId}/createAccount?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to create account');
            }

            const updatedCustomer = await response.json();
            const customerWithOrderId = {
                ...updatedCustomer,
                orderId: customer.orderId,
                tableNum: parseInt(tableNum.trim(), 10)
            };
            setCustomer(customerWithOrderId);
            setShowEmailPassword(false);
        } catch (error) {
            console.error('Error creating account:', error);
            setError('Failed to create account. Please try again.');
        }
    };

    const handleStaffLogin = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/customers/add?name=staff&tableNum=1`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to add staff customer');
            }

            const newCustomer = await response.json();
            const customerWithOrderId = {
                ...newCustomer,
                orderId: newCustomer.order.orderId,
                tableNum: 1
            };
            setCustomer(customerWithOrderId);
            setTableNum(1);
            setOpen(false);
            navigate('/login');
        } catch (error) {
            console.error('Error adding staff customer:', error);
            setError('Failed to login. Please try again.');
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleErrorClose = () => {
        setError('');
    };

    return (
        <>
            <Modal open={open} onClose={handleClose}>
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
                    '&:focus-visible': {
                        outline: '2px solid rgba(60, 58, 58, 0.93)',
                    }
                }}>
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'lightgray',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" component="h2" sx={{ color: 'white' }}>
                        Enter Your Details
                    </Typography>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        inputRef={nameInputRef}
                        error={!!error && error.includes('Name')}
                        helperText={error && error.includes('Name') ? error : ''}
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
                    <TextField
                        label="Table Number"
                        fullWidth
                        margin="normal"
                        value={tableNum}
                        onChange={(e) => setTableNumState(e.target.value)}
                        error={!!error && error.includes('Table number')}
                        helperText={error && error.includes('Table number') ? error : ''}
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 0.1 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{
                                backgroundColor: '#333',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#666',
                                },
                            }}
                        >
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleStaffLogin}
                            sx={{
                                backgroundColor: '#333',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#666',
                                },
                            }}
                        >
                            Staff Login
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal 
                open={showAccountPrompt} 
                onClose={() => {}}
                disableEscapeKeyDown
            >
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
                        Would you like to create an account?
                    </Typography>
                    <Typography sx={{ color: 'white', mb: 3 }}>
                        You can track your orders in real-time and view your order history at Oaxaca.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                setShowAccountPrompt(false);
                                setShowEmailPassword(true);
                            }}
                            sx={{
                                backgroundColor: '#333',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#666',
                                },
                            }}
                        >
                            Yes
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setShowAccountPrompt(false);
                                setCustomer({
                                    ...customer,
                                    tableNum: parseInt(tableNum.trim(), 10)
                                });
                            }}
                            sx={{
                                backgroundColor: '#333',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#666',
                                },
                            }}
                        >
                            No
                        </Button>
                    </Box>
                </Box>
            </Modal>

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
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'white' },
                                '&:hover fieldset': { borderColor: 'white' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
                            },
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiInputBase-input': { color: 'white' },
                        }}
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
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'white' },
                                '&:hover fieldset': { borderColor: 'white' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
                            },
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiInputBase-input': { color: 'white' },
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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

            {/* Error Snackbar */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleErrorClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleErrorClose}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CustomerModal;
