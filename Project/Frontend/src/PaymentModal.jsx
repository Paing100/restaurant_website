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

    const validateCardInfo = () => {
        if (!cardName) return "Card name is required.";
        if (!/^[A-Za-z ]+$/.test(cardName)) return "Card name must only contain letters and spaces.";
        if (!/^\d{16}$/.test(cardNumber)) return "Card number must be 16 digits.";
        if (!/^\d{6}$/.test(sortCode)) return "Sort code must be 6 digits.";
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) return "Expiry date must be in MM/YY format.";
        const [month, year] = expiryDate.split('/').map(Number);
        const currentDate = new Date();
        const expiry = new Date(`20${year}`, month - 1);
        if (expiry <= currentDate) return "Expiry date must be in the future.";
        if (!/^\d{3}$/.test(cvv)) return "CVV must be 3 digits.";
        return "";
    };

    const handleSubmit = () => {
        const errorMessage = validateCardInfo();
        if (errorMessage) {
            setError(errorMessage);
            return;
        }
        handlePaymentSuccess();
    };

    const handlePaymentSuccess = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/order/${orderId}/markAsPaid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                onPaymentSuccess();
                console.log('Order marked as paid');
                onClose();
            } else {
                console.error('Error marking order as paid:', response.statusText);
            }
        } catch (error) {
            console.error('Error marking order as paid:', error);
        }
    };

// Skip payment for testing purposes
    // TAKE OUT BEFORE DEPLOYMENT
    const handleSkipPayment = () => {
        onPaymentSuccess();
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            BackdropProps={{ onClick: (e) => e.stopPropagation() }}
        >
            <Box className="payment-modal">
                <Typography variant="h6" component="h2" onClick={handleSkipPayment} style={{ cursor: 'pointer' }}>
                    Enter Payment Details
                </Typography>
                <TextField
                    label="Name on Card"
                    fullWidth
                    margin="normal"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                />
                <TextField
                    label="Card Number"
                    fullWidth
                    margin="normal"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                />
                <TextField
                    label="Sort Code"
                    fullWidth
                    margin="normal"
                    value={sortCode}
                    onChange={(e) => setSortCode(e.target.value)}
                />
                <TextField
                    label="Expiry Date"
                    fullWidth
                    margin="normal"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                />
                <TextField
                    label="CVV"
                    fullWidth
                    margin="normal"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Pay £{totalPrice}
                    </Button>
                </Box>
                {error && (
                    <Snackbar open={true} autoHideDuration={6000} onClose={() => setError('')}>
                        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                            {error}
                        </Alert>
                    </Snackbar>
                )}
            </Box>
        </Modal>
    );
};

PaymentModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    totalPrice: PropTypes.number.isRequired,
    onPaymentSuccess: PropTypes.func.isRequired,
    orderId: PropTypes.number.isRequired,
};

export default PaymentModal;
