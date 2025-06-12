import { useState, useContext } from 'react';
import { Modal, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext/CartContextContext.jsx';
import PropTypes from 'prop-types';
import axios from 'axios';
import InputBox from './CustomerLoginModal/InputBox.jsx'; 

// component for customer login modal 
const CustomerLoginModal = ({ open, onClose }) => {
    const { setCustomer } = useContext(CartContext); // access 'setCustomer' from CartContext
    const [email, setEmail] = useState(''); // state for email input 
    const [password, setPassword] = useState(''); // state for password input 
    const [error, setError] = useState(''); // state for errors 
    const navigate = useNavigate(); // hook for navigation 

    // function to handle logins 
    const handleLogin = async () => {
        try {
            const {data: customer} = await axios.post(`http://localhost:8080/api/customers/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
            
            // Get the customer's orders
            const {data: orders} = await axios.get(`http://localhost:8080/api/customers/${customer.customerId}/orders`);

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
                {/* Modal content for customer login */}
                <InputBox
                    setEmail={setEmail}
                    setPassword={setPassword}
                    onClose={onClose} 
                    email={email}
                    password={password}
                    handleLogin={handleLogin}
                    error={error}
                />
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
