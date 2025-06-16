import { useState, useEffect, useContext, useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CartContext } from './CartContext/CartContextContext.jsx';
import BackButton from './BackButton';
import OrderList from './AllOrder/OrderList.jsx';

const AllOrders = () => {
    // State to store orders and the currently expanded order ID
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // Access customer data from CartContext
    const { customer } = useContext(CartContext);

    // WebSocket reference 
    const ws = useRef(null);

    // Function to fetch orders for current customer using its unique ID 
    const fetchOrders = async () => {
        if (!customer || !customer.customerId) {
            console.error('No customer found');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/customers/${customer.customerId}/orders`);
            if (response.ok) {
                const customerOrders = await response.json();
                setOrders(customerOrders); // update orders state 
            } else {
                console.error('Error fetching orders:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Fetch orders on component mount
    useEffect(() => {
        fetchOrders();
        // Refresh orders every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [customer]);

    // set up websocket connection to listen for order updates 
    useEffect(() => {
        if (!ws.current) {
            ws.current = new WebSocket("ws://localhost:8080/ws/notifications")

            ws.current.onopen = () => {
                console.log('WebSocket connected');
            };

            ws.current.onclose = () => {
                console.log('WebSocket closed. Attempting to reconnect...');
            };

            ws.current.onmessage = (event) => {
                console.log("EVENT IN CUSTOMER: " + event.data);
                fetchOrders(); // refresh orders when a websocket message is received
            }
        }
        return () => {
            // Cleanup WebSocket connection on component unmount
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                console.log("Closing WebSocket on cleanup");
                ws.current.close();
            }
        };
    }, []);

    // Format the order time into a readable string 
    const formatTime = (orderPlaced) => {
        if (!orderPlaced) return 'N/A';
        const date = new Date(orderPlaced);
        return date.toLocaleString();
    };

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
                formatTime={formatTime}
            />
        </Box >
    );
};

export default AllOrders;