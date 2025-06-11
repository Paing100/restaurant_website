import { useState, useContext, useEffect, useRef } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { CartContext } from './CartContext';
import PropTypes from "prop-types";
import {validateInputs, validateEmail, validatePassword} from './CustomerModal/customerLoginUtils.jsx';
import axios from 'axios';
import InitialCustomerCreationModal from './CustomerModal/InitialCustomerCreationModal.jsx';
import AccountCreationOptionModal from './CustomerModal/AccountCreationOptionModal.jsx';
import AccountCreationModal from './CustomerModal/AccountCreationModal.jsx';

const CustomerModal = ({ onClose }) => {
    const { setCustomer, setTableNum, customer } = useContext(CartContext);
    
    // state variables 
    const [name, setName] = useState(''); // name input 
    const [tableNum, setTableNumState] = useState(''); // table number input 
    const [open, setOpen] = useState(true); // modal visibility 
    const [error, setError] = useState(''); // error messages
    const [showAccountPrompt, setShowAccountPrompt] = useState(false); // prompt for account createion 
    const [showEmailPassword, setShowEmailPassword] = useState(false); // email/ password modal visibility 
    const [email, setEmail] = useState(''); // email input 
    const [password, setPassword] = useState(''); // password input 
    const nameInputRef = useRef(null); // reference to the name input field 

    // if a customer is set, close the modal 
    useEffect(() => {
        if (customer) {
            setOpen(false);
        }
    }, [customer]);

    // focus on the name input field when the modal opens automatically 
    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    // initial customer creation (submit after the first item added)
    const handleSubmit = async () => {
        // Validate inputs before submittingf
        const errorMessage = validateInputs(name, tableNum);
        if (errorMessage) {
            setError(errorMessage);
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8080/api/customers/add?name=${encodeURIComponent(name.trim())}&tableNum=${tableNum.trim()}`);
            const newCustomer = response.data;
            const customerWithOrderId = {
                ...newCustomer,
                orderId: newCustomer.orders[0].orderId
            };
            setCustomer(customerWithOrderId);
            setTableNum(tableNum.trim());
            setShowAccountPrompt(true);
        } catch (error) {
            console.error('Error adding customer:', error);
            setError('Failed to submit. Please try again.');
        }
    };

    // handle account creation with email and password 
    const handleAccountCreation = async () => {
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (!validatePassword(password)) {
            setError('Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/api/customers/${customer.customerId}/createAccount?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
            );
            const updatedCustomer = response.data;
            const customerWithOrderId = {
                ...updatedCustomer,
                orderId: customer.orderId,
                tableNum: parseInt(tableNum.trim(), 10)
            };
            setCustomer(customerWithOrderId);
            setShowEmailPassword(false);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('An account with this email already exists');
            } else {
                setError('Failed to create account. Please try again.');
            }
        }
    };

    // close the modal 
    const handleClose = () => {
        setOpen(false);
        onClose && onClose();
    };

    // close the error snackbar 
    const handleErrorClose = () => {
        setError('');
    };

    return (
        <>
            {/* Initial Customer Creation Modal */}
            <InitialCustomerCreationModal 
                handleClose={handleClose}
                name={name}
                open={open}
                setName={setName}
                nameInputRef={nameInputRef}
                error={error}
                tableNum={tableNum}
                handleSubmit={handleSubmit}
                setTableNumState={setTableNumState}
            />

            {/* Account creation prompt modal */}
            <AccountCreationOptionModal
                showAccountPrompt={showAccountPrompt}
                setShowAccountPrompt={setShowAccountPrompt} 
                setShowEmailPassword={setShowEmailPassword}
                customer={customer}
                setCustomer={setCustomer}
                tableNum={tableNum}
            />
    
            {/* Email/password modal for account creation */}
            <AccountCreationModal
                showEmailPassword={showEmailPassword}
                setShowEmailPassword={setShowEmailPassword}
                setEmail={setEmail}
                error={error}
                setPassword={setPassword}
                handleAccountCreation={handleAccountCreation}
                email={email}
                password={password}
            />

            {/* Error Snackbar */}
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

CustomerModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default CustomerModal;
