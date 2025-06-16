import { useState, useEffect, useContext } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CartContext } from './CartContext/CartContextContext.jsx';
import BackButton from './BackButton';
import OrderList from './AllOrder/OrderList.jsx';
import useWebSocket from './useWebSocket.jsx';
import axios from 'axios';

const AllOrders = () => {
    // State to store orders and the currently expanded order ID
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // Access customer data from CartContext
    const { customer } = useContext(CartContext);

    // Function to fetch orders for current customer using its unique ID 
    const fetchOrders = async () => {
        if (!customer || !customer.customerId) {
            console.error('No customer found');
            return;
        }

        try {
            const {data: customerOrders} = await axios.get(`http://localhost:8080/api/customers/${customer.customerId}/orders`);
            setOrders(customerOrders); // update orders state 
        } 
        catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Fetch orders on component mount
    useEffect(() => {
        fetchOrders();
    }, [customer]);

    useWebSocket(fetchOrders);

    return (
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
    );
};

export default AllOrders;