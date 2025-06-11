import axios from 'axios';

// function to validate inputs when adding the first item to cart
export const validateInputs = (name, tableNum) => {
        // Trim inputs to remove leading/trailing whitespace
        const trimmedName = name.trim();
        const trimmedTableNum = tableNum.trim();

        if (!trimmedName) {
            return 'Name is required';
        }
        if (trimmedName.length < 3 || trimmedName.length > 20) {
            return 'Name must be between 3 and 20 characters';
        }

        const nameRegex = /^[a-zA-Z\s-]+$/;
        if (!nameRegex.test(trimmedName)) {
            return 'Name can only contain letters, spaces, and hyphens';
        }

        if (!trimmedTableNum) {
            return 'Table number is required';
        }

        // Check table number range (e.g., between 1 and 40)
        const tableNumInt = parseInt(trimmedTableNum, 10);
        if (isNaN(tableNumInt) || tableNumInt <= 0) {
            return 'Table number must be between 1 and 40';
        }

        // Check table number range (e.g., between 1 and 40)
        if (tableNumInt > 40) {
            return 'Table number must be between 1 and 40';
        }

        return null;
    };


// validate emails 
export const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }; 


// validate passwords 
export const validatePassword = (pwd) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>?]).{8,}$/;
        return passwordRegex.test(pwd);
    };

