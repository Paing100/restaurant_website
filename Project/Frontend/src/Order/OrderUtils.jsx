
// Function to handle table number change
export const handleTableNumChange = ({newTableNum, setMessage, setSeverity, setOpen, customer, setCustomer, setTableNum, setTableEditModalOpen, setNewTableNum}) => {
        // Validate table number
        const tableNumInt = parseInt(newTableNum, 10);
        if (!newTableNum || isNaN(tableNumInt) || tableNumInt <= 0 || tableNumInt > 40) {
            setMessage('Table number must be between 1 and 40');
            setSeverity('error');
            setOpen(true);
            return;
        }

        // Update customer table number in state and local storage
        const updatedCustomer = {
            ...customer,
            tableNum: tableNumInt // Set the updated table number
        };
        setCustomer(updatedCustomer); // update customer state 
        setTableNum(tableNumInt); // update table number state
        localStorage.setItem('tableNum', tableNumInt.toString()); // save the updated table number in local storage
        localStorage.setItem('customer', JSON.stringify(updatedCustomer)); // save updated customer data 
        setMessage('Table number updated successfully');
        setSeverity('success'); // set success serverity 
        setOpen(true); // open notification modal 
        setTableEditModalOpen(false); // close table number edit modal
        setNewTableNum(''); // reset table number input field 
};