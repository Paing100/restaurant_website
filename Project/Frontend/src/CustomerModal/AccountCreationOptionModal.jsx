import { Modal, Box, Button, Typography } from '@mui/material';
import PropTypes from "prop-types";

const AccountCreationOptionModal = ({showAccountPrompt, setShowAccountPrompt, setShowEmailPassword, customer, setCustomer, tableNum }) => {
  return (
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
  );
}

export default AccountCreationOptionModal;

AccountCreationOptionModal.propTypes = {
    showAccountPrompt: PropTypes.bool.isRequired,
    setShowAccountPrompt: PropTypes.func.isRequired,
    setShowEmailPassword: PropTypes.func.isRequired,
    customer: PropTypes.object.isRequired,
    setCustomer: PropTypes.func.isRequired,
    tableNum: PropTypes.string.isRequired,
};