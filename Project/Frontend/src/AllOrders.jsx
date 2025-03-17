/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Grid, CardMedia, Paper, Button } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const timerRefs = useRef({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/orders/${customer.orderId - 1}/getOrder`);
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    console.error('Error fetching orders:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        orders.forEach(order => {
            if (!timerRefs.current[order.orderId]) {
                timerRefs.current[order.orderId] = setInterval(() => {
                    const now = new Date();
                    const diff = now - new Date(order.orderTime);
                    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
                    const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                    const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
                    setOrders(prevOrders => prevOrders.map(o => o.orderId === order.orderId ? { ...o, elapsedTime: `${hours}:${minutes}:${seconds}` } : o));
                }, 1000);
            }
        });

        return () => {
            Object.values(timerRefs.current).forEach(clearInterval);
        };
    }, [orders]);

    const handleExpandClick = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Button
                onClick={() => window.history.back()}
                sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' }, marginBottom: 2 }}
            >
                ← Back
            </Button>
            <Typography sx={{ padding: '15px' }} variant="h4">All Orders</Typography>
            <List>
                {orders.map(order => (
                    <Paper key={order.orderId} sx={{ marginBottom: 2, padding: 2, backgroundColor: '#333', color: 'white' }}>
                        <Box sx={{ cursor: 'pointer' }} onClick={() => handleExpandClick(order.orderId)}>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item xs={2.5}>
                                    <Typography variant="body2">
                                        {order.customerName || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        Table {order.tableNum || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        {order.elapsedTime || '00:00:00'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2.5}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                backgroundColor: order.status === 'In Progress' ? 'green' : 'red',
                                                border: '2px solid white',
                                                boxShadow: order.status === 'In Progress' ? '0 0 10px green, 0 0 20px green, 0 0 30px green' : '0 0 10px red, 0 0 20px red, 0 0 30px red',
                                                marginRight: 2,
                                            }}
                                        />
                                        <Typography variant="body2">
                                            {order.status}
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
                                    Order Receipt
                                </Typography>
                                <List>
                                    {order.items.map((item) => (
                                        <ListItem key={item.itemName} sx={{ py: 1 }}>
                                            <CardMedia
                                                component="img"
                                                height="50"
                                                image={item.imagePath}
                                                sx={{ marginRight: 2, width: 50, borderRadius: "25%" }}
                                            />
                                            <ListItemText
                                                primary={item.itemName}
                                                secondary={
                                                    <Typography variant="body2" sx={{ color: '#aaa' }}>
                                                        {item.quantity} x £{item.price.toFixed(2)}
                                                    </Typography>
                                                }
                                            />
                                            <Typography variant="body2">
                                                £{(item.quantity * item.price).toFixed(2)}
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
                                            £{order.total.toFixed(2)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Paper>
                ))}
            </List>
        </Box>
    );
};

export default AllOrders;