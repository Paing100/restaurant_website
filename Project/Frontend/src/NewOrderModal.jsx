import { Modal, Box, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
import './index.css';

/**
 * NewOrderModal Component
 * Displays a modal dialog for confirming or canceling a new order.
 * 
 * Props:
 * - open (bool): Controls whether the modal is open or closed.
 * - onClose (func): Function to handle modal close action.
 * - onConfirm (func): Function to handle confirmation action.
 * - title (string): Title of the modal.
 * - content (string): Message displayed inside the modal.
 * - confirmButtonText (string): Text for the confirmation button.
 * - cancelButtonText (string): Text for the cancel button.
 */
const NewOrderModal = ({ open, onClose, onConfirm, title, content, confirmButtonText, cancelButtonText }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            BackdropProps={{ onClick: (e) => e.stopPropagation() }}
        >
            <Box className="payment-modal">
                <Typography variant="h6" component="h2">
                    {title}
                </Typography>
                <Typography sx={{ mt: 2, mb: 3, color: 'white' }}>
                    {content}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onConfirm}
                        sx={{
                            backgroundColor: '#333',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#666',
                            },
                        }}
                    >
                        {confirmButtonText}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onClose}
                        sx={{
                            backgroundColor: '#333',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#666',
                            },
                        }}
                    >
                        {cancelButtonText}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
// Prop type validation to ensure correct usage of the component
NewOrderModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    confirmButtonText: PropTypes.string.isRequired,
    cancelButtonText: PropTypes.string.isRequired,
};

export default NewOrderModal;