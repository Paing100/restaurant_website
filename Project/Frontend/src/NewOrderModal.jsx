import { Modal, Box, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
import './index.css';

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