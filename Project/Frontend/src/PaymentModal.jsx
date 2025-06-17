import { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
import './index.css';
import axios from 'axios';
import PaymentForm from './PaymentModal/PaymentForm.jsx';
import CommonSnackBar from './CommonSnackBar.jsx';

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
            await axios.post(`http://localhost:8080/api/order/${orderId}/markAsPaid`);
            // If the payment is successful, call the success callback and close the modal
            onPaymentSuccess();
            onClose();
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
                
                <PaymentForm
                    cardNumber={cardNumber}
                    setCardNumber={setCardNumber}
                    sortCode={sortCode}
                    setSortCode={setSortCode}
                    expiryDate={expiryDate}
                    setExpiryDate={setExpiryDate}
                    cvv={cvv}
                    setCvv={setCvv}
                    cardName={cardName}
                    setCardName={setCardName}
                />

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
                          <CommonSnackBar
                            open={true}
                            severity={"error"}
                            handleClose={() => setError('')}
                            notification={error}
                            backgroundColor="#ff748c"
                        />
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
