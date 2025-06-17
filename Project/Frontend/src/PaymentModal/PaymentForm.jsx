import {Box, TextField} from '@mui/material';
import PropTypes from 'prop-types';

function PaymentForm({cardNumber, setCardNumber, sortCode, setSortCode, expiryDate, setExpiryDate, cvv, setCvv, cardName, setCardName}) {

  return (
    <>
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
    </>
  );
}

PaymentForm.propTypes = {
  cardNumber: PropTypes.string.isRequired,
  setCardNumber: PropTypes.func.isRequired,
  sortCode: PropTypes.string.isRequired,
  setSortCode: PropTypes.func.isRequired,
  expiryDate: PropTypes.string.isRequired,
  setExpiryDate: PropTypes.func.isRequired,
  cvv: PropTypes.string.isRequired,
  setCvv: PropTypes.func.isRequired,
  cardName: PropTypes.string.isRequired,
  setCardName: PropTypes.func.isRequired
}


export default PaymentForm;