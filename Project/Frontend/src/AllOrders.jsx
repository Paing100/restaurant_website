import { useRef, useState, useEffect, useContext, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CartContext } from './CartContext/CartContextContext.jsx';
import BackButton from './BackButton';
import OrderList from './AllOrder/OrderList.jsx';
import useWebSocket from './useWebSocket.jsx';
import axios from 'axios';
import CommonSnackBar from './CommonSnackBar.jsx';

const AllOrders = () => {
    // State to store orders and the currently expanded order ID
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Access customer data from CartContext
    const { customer } = useContext(CartContext);

    const prevOrderRef = useRef([]);

    // Function to fetch orders for current customer using its unique ID 
    const fetchOrders = useCallback(async () => {
        if (!customer || !customer.customerId) {
            console.error('No customer found');
            return;
        }

        try {
            const {data: customerOrders} = await axios.get(`http://localhost:8080/api/customers/${customer.customerId}/orders`);
            const prevOrders = prevOrderRef.current;
            const currentLength = customerOrders.length;

            if (currentLength < prevOrders ) {
                setSnackbarOpen(true); 
            }
            setOrders(customerOrders); // update orders state 
            prevOrderRef.current = currentLength; 
        } 
        catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, [customer]);

    // Fetch orders on component mount
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useWebSocket(fetchOrders);

    return (
        <>
            <Box sx={{ padding: 3 }}>
                {/*Header with Back and Refresh button*/}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <Box>
                        <BackButton />
                    </Box>
                    <IconButton
                        onClick={() => fetchOrders()} // Call fetchOrders to refresh the orders
                        sx={{
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            position: 'relative',
                            top: '85px',
                            left: '-10px',
                        }}
                    >
                        <RefreshIcon />
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: '1rem',
                                marginLeft: '8px',
                            }}
                        >
                            Refresh
                        </Typography>
                    </IconButton>
                </Box>
                <Typography variant="h4" sx={{ marginBottom: 3 }}>Your Order History</Typography>
                {/*List of orders*/}
                <OrderList 
                    orders={orders}
                    expandedOrderId={expandedOrderId}
                    setExpandedOrderId={setExpandedOrderId}
                />
            </Box >
            <CommonSnackBar
                open={snackbarOpen}
                severity="error"
                handleClose={() => setSnackbarOpen(false)}
                notification="An order has been cancelled."
                backgroundColor='#ff748c'
            />
        </>
    );
};

export default AllOrders;