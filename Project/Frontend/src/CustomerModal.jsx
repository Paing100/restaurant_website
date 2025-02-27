import { useState, useContext, useEffect, useRef } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';

const CustomerModal = () => {
    const { setCustomer, customer } = useContext(CartContext);
    const [name, setName] = useState('');
    const [tableNum, setTableNum] = useState('');
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const nameInputRef = useRef(null);

    useEffect(() => {
        if (customer) {
            setOpen(false);
        }
    }, [customer]);

    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    const handleSubmit = async () => {
        if (name && tableNum) {
            try {
                const response = await fetch(`http://localhost:8080/api/customers/add?name=${name}&tableNum=${tableNum}`, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/hal+json'
                    },
                });
                const newCustomer = await response.json();
                setCustomer(newCustomer);
                setOpen(false);
            } catch (error) {
                console.error('Error adding customer:', error);
            }
        }
    };

    const handleStaffLogin = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/customers/add?name=staff&tableNum=1`, {
                method: 'POST',
                headers: {
                    'accept': 'application/hal+json'
                },
            });
            const newCustomer = await response.json();
            setCustomer(newCustomer);
            setOpen(false);
            navigate('/login'); // Navigate to the staff login page
        } catch (error) {
            console.error('Error adding staff customer:', error);
        }
    };

    return (
        <>
            <Typography variant="h2" align="center" sx={{ marginTop: 2, color: 'white' }}>
                Oaxaca
            </Typography>
            <Modal open={open} onClose={() => { }}>
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
                        outline: '2px solid rgba(60, 58, 58, 0.93)', // Change this to your desired outline style
                    }
                }}>
                    <Typography variant="h6" component="h2" sx={{ color: 'white' }}>
                        Enter Your Details
                    </Typography>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        inputRef={nameInputRef}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'white',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'white',
                            },
                            '& .MuiInputBase-input': {
                                color: 'white',
                            },
                        }}
                    />
                    <TextField
                        label="Table Number"
                        fullWidth
                        margin="normal"
                        value={tableNum}
                        onChange={(e) => setTableNum(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'white',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'white',
                            },
                            '& .MuiInputBase-input': {
                                color: 'white',
                            },
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 0.1 }}>
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
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleStaffLogin}
                            sx={{
                                backgroundColor: '#333',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#666',
                                },
                            }}
                        >
                            Staff Login
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default CustomerModal;
