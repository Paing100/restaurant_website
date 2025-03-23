/* eslint-disable */
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Grid, CardMedia, Paper, Button, IconButton } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CartContext } from './CartContext';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const { customer } = useContext(CartContext);
    const ws = useRef(null);

    const fetchOrders = async () => {
        if (!customer || !customer.customerId) {
            console.error('No customer found');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/customers/${customer.customerId}/orders`);
            if (response.ok) {
                const customerOrders = await response.json();
                setOrders(customerOrders);
            } else {
                console.error('Error fetching orders:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Refresh orders every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [customer]);

    useEffect(() => {
        if (!ws.current){
          ws.current = new WebSocket("ws://localhost:8080/ws/notifications")
    
          ws.current.onopen = () => {
            console.log('WebSocket connected');
          };
    
          ws.current.onclose = () => {
            console.log('WebSocket closed. Attempting to reconnect...');
          };
    
          ws.current.onmessage = (event) => {
            console.log("EVENT IN CUSTOMER: " + event.data);
            fetchOrders();
          }
        }
        return () => {
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            console.log("Closing WebSocket on cleanup");
            ws.current.close();
          }
        };
      }, []);

    const formatTime = (orderPlaced) => {
        if (!orderPlaced) return 'N/A';
        const date = new Date(orderPlaced);
        return date.toLocaleString();
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <Button
                    onClick={() => window.history.back()}
                    sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
                >
                    ← Back
                </Button>
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
            <List>
                {orders.map((order) => (
                    <Paper
                        key={order.orderId}
                        sx={{
                            backgroundColor: '#333',
                            color: 'white',
                            marginBottom: 2,
                            padding: 2,
                            cursor: 'pointer'
                        }}
                        onClick={() => setExpandedOrderId(expandedOrderId === order.orderId ? null : order.orderId)}
                    >
                        <Box>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        Order #{order.orderId}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        Table {order.tableNum}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        {formatTime(order.orderPlaced)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                backgroundColor: 
                                                    order.orderStatus === 'SUBMITTED' ? 'orange' :
                                                    order.orderStatus === 'CONFIRMED' ? 'yellow' :
                                                    order.orderStatus === 'READY' ? 'green' : 'red',
                                                border: '2px solid white',
                                                marginRight: 2,
                                                boxShadow: order.orderStatus === 'SUBMITTED' ? '0 0 10px orange, 0 0 20px orange, 0 0 30px orange' :
                                                    order.orderStatus === 'CONFIRMED' ? '0 0 10px blue, 0 0 20px yellow, 0 0 30px blue' :
                                                    order.orderStatus === 'READY' ? '0 0 10px green, 0 0 20px green, 0 0 30px green' :
                                                            '0 0 10px red, 0 0 20px red, 0 0 30px red',
                                            }}
                                        />
                                        <Typography variant="body2">
                                            {order.orderStatus}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={1}>
                                    {expandedOrderId === order.orderId ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                                </Grid>
                            </Grid>
                        </Box>
                        {expandedOrderId === order.orderId && (
                            <Box sx={{ mt: 2, overflowY: 'auto', maxHeight: '80vh' }}>
                                <Typography variant="h6" sx={{ mb: 2, borderBottom: '1px solid #555', pb: 1 }}>
                                    Order Details
                                </Typography>
                                <List>
                                    {order.orderMenuItems.map((item) => (
                                        <ListItem key={item.orderMenuItemsId.itemId} sx={{ py: 1 }}>
                                            <ListItemText
                                                primary={item.menuItem.name}
                                                secondary={
                                                    <Typography variant="body2" sx={{ color: '#aaa' }}>
                                                        {item.quantity} x £{item.menuItem.price.toFixed(2)}
                                                    </Typography>
                                                }
                                            />
                                            <Typography variant="body2">
                                                £{(item.quantity * item.menuItem.price).toFixed(2)}
                                            </Typography>
                                        </ListItem>
                                    ))}
                                </List>
                                <Divider sx={{ my: 2, backgroundColor: '#555' }} />
                                <Grid container spacing={2} sx={{ px: 2 }}>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">Total</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                        <Typography variant="body1">
                                            £{order.orderMenuItems.reduce((total, item) =>
                                                total + (item.quantity * item.menuItem.price), 0).toFixed(2)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Paper>
                ))}
            </List>
        </Box >
    );
};

export default AllOrders;