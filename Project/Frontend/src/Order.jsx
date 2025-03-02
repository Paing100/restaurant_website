/* eslint-disable */
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Typography, List, ListItem, ListItemText, Divider, Grid, Box, CardMedia, Snackbar, Alert, IconButton, Paper, Slide } from '@mui/material';
import { CartContext } from './CartContext';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Order() {
    const { cart, fetchCart, removeItemFromCart, clearCart, customer, addItemToCart, submitOrder, tableNum } = useContext(CartContext);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [orderStatus, setOrderStatus] = useState('PENDING');
    const [showOrderInfo, setShowOrderInfo] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const [receipt, setReceipt] = useState([]);
    const [receiptTotal, setReceiptTotal] = useState(0);
    const [orderTime, setOrderTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState('00:00:00');
    const timerRef = useRef(null);

    const orderedItems = cart?.orderedItems || {};

    useEffect(() => {
        if (orderTime) {
            timerRef.current = setInterval(() => {
                const now = new Date();
                const diff = now - orderTime;
                const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
                const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
                setElapsedTime(`${hours}:${minutes}:${seconds}`);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [orderTime]);

    const decreaseItemQuantity = (itemId) => {
        removeItemFromCart(itemId, false);
    };

    const increaseItemQuantity = (itemId) => {
        addItemToCart(itemId, 1);
    };

    const handleSubmit = async () => {
        if (!orderedItems || Object.keys(orderedItems).length === 0) {
            console.error("Error: Cart is empty. Cannot submit order.");
            setMessage("Error: Cart is empty. Cannot submit order.");
            setSeverity('error');
            setOpen(true);
            return;
        }

        const result = await submitOrder();

        if (result.success) {
            setOrderStatus('In Progress');
            setShowOrderInfo(true);
            setMessage(result.message);
            setSeverity('success');
            setReceipt(Object.entries(orderedItems).map(([itemName, item]) => ({ itemName, ...item })));
            setReceiptTotal(cart.totalPrice);
            setOrderTime(new Date());
            fetchCart();
        } else {
            setMessage(result.message);
            setSeverity('error');
        }
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const OrderInfoPopup = () => (
        <Slide direction="up" in={showOrderInfo} mountOnEnter unmountOnExit>
            <Paper
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#333',
                    color: 'white',
                    padding: 2,
                    zIndex: 1000,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    boxShadow: 3,
                    maxHeight: expanded ? '80vh' : '64px',
                    transition: 'max-height 0.3s ease-in-out',
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={2.5}>
                            <Typography variant="body2">
                                {customer?.name || 'N/A'}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="body2">
                                Table {tableNum || 'N/A'}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="body2">
                                {elapsedTime}
                            </Typography>
                        </Grid>
                        <Grid item xs={2.5}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        backgroundColor: orderStatus === 'In Progress' ? 'green' : 'red',
                                        border: '2px solid white',
                                        boxShadow: orderStatus === 'In Progress' ? '0 0 10px green, 0 0 20px green, 0 0 30px green' : '0 0 10px red, 0 0 20px red, 0 0 30px red',
                                        marginRight: 2, // Increased marginRight to add more space
                                    }}
                                />
                                <Typography variant="body2">
                                    {orderStatus}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={1}>
                            {expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                        </Grid>
                    </Grid>
                </Box>

                {/* Expanded Receipt View */}
                <Box sx={{
                    mt: 2,
                    display: expanded ? 'block' : 'none',
                    overflowY: 'auto',
                    maxHeight: 'calc(80vh - 64px)'
                }}>
                    <Typography variant="h6" sx={{ mb: 2, borderBottom: '1px solid #555', pb: 1 }}>
                        Order Receipt
                    </Typography>
                    <List>
                        {receipt.map((item) => (
                            <ListItem key={item.itemName} sx={{ py: 1 }}>
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
                                £{receiptTotal.toFixed(2)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Slide>
    );

    return (
        <Box sx={{ padding: 3, paddingBottom: showOrderInfo ? 8 : 3 }}>
            <Typography sx={{ padding: '15px' }} variant="h4">Place Your Order</Typography>
            <Typography variant="h5" sx={{ marginTop: 4, padding: '15px', borderBottom: '1px solid #333' }}>Ordered Items</Typography>
            <List>
                {Object.entries(orderedItems).map(([itemName, item]) => {
                    const itemTotal = item.price * item.quantity;
                    return (
                        <ListItem key={itemName} sx={{ borderBottom: '1px solid #333' }}>
                            <CardMedia
                                component="img"
                                height="50"
                                image={item.imagePath}
                                sx={{ marginRight: 2, width: 50, borderRadius: "25%" }}
                            />
                            <ListItemText
                                primary={itemName}
                                secondary={`£${item.price.toFixed(2)} each • Total: £${itemTotal.toFixed(2)}`}
                                sx={{ color: 'white' }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                                <IconButton
                                    onClick={() => decreaseItemQuantity(item.itemId)}
                                    sx={{ color: 'white' }}
                                >
                                    <RemoveIcon />
                                </IconButton>
                                <Typography sx={{ margin: '0 10px', color: 'white' }}>
                                    {item.quantity}
                                </Typography>
                                <IconButton
                                    onClick={() => increaseItemQuantity(item.itemId)}
                                    sx={{ color: 'white' }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Box>
                            <Button
                                onClick={() => removeItemFromCart(item.itemId, true)}
                                sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
                            >
                                Remove All
                            </Button>
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            <Typography variant="h6" sx={{ marginTop: 2 }}>Total Price: £{(cart.totalPrice || 0).toFixed(2)}</Typography>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={6}>
                    <Box sx={{}}>
                        <Button
                            onClick={() => clearCart()}
                            sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
                            fullWidth
                        >
                            Clear Cart
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
                        fullWidth
                    >
                        Submit Order
                    </Button>
                </Grid>
            </Grid>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
            <OrderInfoPopup />
        </Box>
    );
}

export default Order;