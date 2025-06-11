

// function to validate inputs when adding the first item to cart
export const validateInputs = (name, tableNum) => {
        // Trim inputs to remove leading/trailing whitespace
        const trimmedName = name.trim();
        const trimmedTableNum = tableNum.trim();

        if (!trimmedName) {
            console.error('Name is required');
            return false;
        }
        if (trimmedName.length < 3 || trimmedName.length > 20) {
            console.error('Name must be between 3 and 20 characters');
            return false;
        }

        const nameRegex = /^[a-zA-Z\s-]+$/;
        if (!nameRegex.test(trimmedName)) {
            console.error('Name can only contain letters, spaces, and hyphens');
            return false;
        }

        if (!trimmedTableNum) {
            console.error('Table number is required');
            return false;
        }

        // Check table number range (e.g., between 1 and 40)
        const tableNumInt = parseInt(trimmedTableNum, 10);
        if (isNaN(tableNumInt) || tableNumInt <= 0) {
            console.error('Table number must be between 1 and 40');
            return false;
        }

        // Check table number range (e.g., between 1 and 40)
        if (tableNumInt > 40) {
            console.error('Table number must be between 1 and 40');
            return false;
        }

        return true;
    };
