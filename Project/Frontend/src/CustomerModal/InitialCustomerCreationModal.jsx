
import { Modal, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from "prop-types";
import {inputStyle} from '../useCommonInputStyle';

const InitialCustomerCreationModal = ({handleClose, name, open, setName, nameInputRef, error, tableNum, handleSubmit, setTableNumState}) => {
    return (
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
                    {/* Name Input */}
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        inputRef={nameInputRef}
                        error={!!error && error.includes('Name')}
                        helperText={error && error.includes('Name') ? error : ''}
                        sx={inputStyle}
                    />
                    {/* Table number input */}
                    <TextField
                        label="Table Number"
                        fullWidth
                        margin="normal"
                        value={tableNum}
                        onChange={(e) => setTableNumState(e.target.value)}
                        error={!!error && error.includes('Table number')}
                        helperText={error && error.includes('Table number') ? error : ''}
                        sx={inputStyle}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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
                    </Box>
                </Box>
            </Modal>
    );
}

export default InitialCustomerCreationModal;

InitialCustomerCreationModal.propTypes = {
    handleClose: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    setName: PropTypes.func.isRequired,
    nameInputRef: PropTypes.object.isRequired,
    error: PropTypes.string,
    tableNum: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    setTableNumState: PropTypes.func.isRequired,
};



