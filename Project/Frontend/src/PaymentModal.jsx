import { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, Snackbar, Alert } from '@mui/material';
import PropTypes from 'prop-types';
import './index.css';

const PaymentModal = ({ open, onClose, totalPrice, onPaymentSuccess, orderId }) => {
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [sortCode, setSortCode] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState('');

    // Function to validate the card details entered by the user
    const validateCardInfo = () => {
        if (!cardName) return "Card name is required.";
        if (!/^[A-Za-z ]+$/.test(cardName)) return "Card name must only contain letters and spaces.";
        if (!/^\d{16}$/.test(cardNumber)) return "Card number must be 16 digits.";
        if (!/^\d{6}$/.test(sortCode)) return "Sort code must be 6 digits.";
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) return "Expiry date must be in MM/YY format.";

        // Check if the expiry date is in the future
        const [month, year] = expiryDate.split('/').map(Number);
        const currentDate = new Date();
        const expiry = new Date(`20${year}`, month - 1);
        if (expiry <= currentDate) return "Expiry date must be in the future.";
        if (!/^\d{3}$/.test(cvv)) return "CVV must be 3 digits.";
        return "";
    };
     // Handles the form submission by validating card details and processing the payment
    const handleSubmit = () => {
        const errorMessage = validateCardInfo();
        if (errorMessage) {
            setError(errorMessage);
            return;
        }
        handlePaymentSuccess();
    };
    // Handles the payment process by sending a request to the backend
    const handlePaymentSuccess = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/order/${orderId}/markAsPaid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                 // If the payment is successful, call the success callback and close the modal
                onPaymentSuccess();
                onClose();
            } else {
                console.error('Error marking order as paid:', response.statusText);
            }
        } catch (error) {
            console.error('Error marking order as paid:', error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            BackdropProps={{ onClick: (e) => e.stopPropagation() }}
        >
            <Box className="payment-modal">
                <Typography
                    variant="h6"
                    component="h2"
                >
                    Enter Payment Details
                </Typography>
                <Box className="payment-form">
                    <TextField
                        label="Card Number"
                        margin="normal"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        fullWidth
                    />
                    <Box className="payment-row">
                        <TextField
                            label="Sort Code"
                            margin="normal"
                            value={sortCode}
                            onChange={(e) => setSortCode(e.target.value)}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Expiry Date"
                            margin="normal"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="CVV"
                            margin="normal"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            sx={{ flex: 1 }}
                        />
                    </Box>
                    <TextField
                        label="Name on Card"
                        margin="normal"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box className="button-container">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Pay £{totalPrice}
                    </Button>
                </Box>
                {error && (
                    <Snackbar
                        open={true}
                        autoHideDuration={6000}
                        onClose={() => setError('')}
                    >
                        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                            {error}
                        </Alert>
                    </Snackbar>
                )}
            </Box>
        </Modal>
    );
};
// Define prop types to ensure correct usage of the component
PaymentModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    totalPrice: PropTypes.number.isRequired,
    onPaymentSuccess: PropTypes.func.isRequired,
    orderId: PropTypes.number.isRequired,
};

export default PaymentModal;
