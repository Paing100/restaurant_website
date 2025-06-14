
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

export const buildNewOrder = ( customer, orderedItems, cart, tableNum) => {
            // create a new order object 
            const newOrder = {
                orderId: customer?.orderId,
                receipt: Object.entries(orderedItems).map(([itemName, item]) => ({ itemName, ...item })),
                receiptTotal: cart.totalPrice,
                orderTime: new Date().toISOString(),
                tableNum: tableNum,
                status: 'SUBMITTED',
            };
            return newOrder;
    };

    // update local storage of the customer after the payment goes through
export const createOrderInfo = (newOrder, receipt, cart, tableNum) => {
            const orderInfo = {
                show: true,
                expanded: false,
                status: 'SUBMITTED',
                receipt: [...receipt, newOrder], // append the new order to the receipt array
                total: cart.totalPrice,
                orderTime: new Date().toISOString(),
                tableNum: tableNum
            };
            return orderInfo;
    }

