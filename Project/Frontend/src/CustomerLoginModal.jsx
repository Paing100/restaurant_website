import { useState, useContext } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import PropTypes from 'prop-types';

const CustomerLoginModal = ({ open, onClose }) => {
    const { setCustomer } = useContext(CartContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/customers/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const customer = await response.json();
            
            // Get the customer's orders
            const ordersResponse = await fetch(`http://localhost:8080/api/customers/${customer.customerId}/orders`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                },
            });

            if (ordersResponse.ok) {
                const orders = await ordersResponse.json();
                if (orders && orders.length > 0) {
                    const lastOrder = orders[orders.length - 1];
                    const tableNum = lastOrder.tableNum;
                    localStorage.setItem('tableNum', tableNum.toString());
                    customer.tableNum = tableNum;

                    // Check if the last order is still in CREATED status
                    if (lastOrder.orderStatus === 'CREATED') {
                        customer.orderId = lastOrder.orderId;
                    } else {
                        // If no active order, set orderId to 0 to indicate need for new order
                        customer.orderId = 0;
                    }
                } else {
                    // If no orders at all, set orderId to 0
                    customer.orderId = 0;
                }
            } else {
                // If can't fetch orders, set orderId to 0
                customer.orderId = 0;
            }

            setCustomer(customer);
            onClose();
            navigate('/menu');
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Invalid email or password. Please try again.');
        }
    };

    const handleErrorClose = () => {
        setError('');
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
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
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'white' },
                                '&:hover fieldset': { borderColor: 'white' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
                                '& input': { color: 'white' },
                            },
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
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
                        error={!!error}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'white' },
                                '&:hover fieldset': { borderColor: 'white' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
                                '& input': { color: 'white' },
                            },
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                            '& .MuiInputBase-input': { color: 'white' },
                        }}
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
            </Modal>

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

CustomerLoginModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CustomerLoginModal; 
