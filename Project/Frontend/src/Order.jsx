/* eslint-disable */
import React, { useContext, useState } from 'react';
import { Button, Typography, List, ListItem, ListItemText, Divider, Grid, Box, CardMedia, Snackbar, Alert, IconButton, Paper, Slide } from '@mui/material';
import { CartContext } from './CartContext';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Order() {
    const { cart, fetchCart, removeItemFromCart, clearCart, customer, addItemToCart } = useContext(CartContext);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [orderStatus, setOrderStatus] = useState('PENDING');
    const [showOrderInfo, setShowOrderInfo] = useState(false);
    const [expanded, setExpanded] = useState(false);

    // Ensure cart.orderedItems exists before rendering
    const orderedItems = cart?.orderedItems || {};

    const handlePageClick = () => {
        fetchCart();
        document.removeEventListener('click', handlePageClick);
    };

    document.addEventListener('click', handlePageClick);

    // Decreases item quantity by one
    const decreaseItemQuantity = (itemId) => {
        removeItemFromCart(itemId, false); // Always pass false for single item removal
    };

    // Increases item quantity by one
    const increaseItemQuantity = (itemId) => {
        addItemToCart(itemId, 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!orderedItems || Object.keys(orderedItems).length === 0) {
            console.error("Error: Cart is empty. Cannot submit order.");
            setMessage("Error: Cart is empty. Cannot submit order.");
            setSeverity('error');
            setOpen(true);
            return;
        }

        if (!customer || !customer.orderId) {
            console.error("Error: Customer is not logged in or order ID is missing.");
            setMessage("Error: Customer is not logged in or order ID is missing.");
            setSeverity('error');
            setOpen(true);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/order/${customer.orderId}/submitOrder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            console.log('Order submitted successfully');
            setOrderStatus('SUBMITTED');
            setShowOrderInfo(true);
            setMessage('Order submitted successfully!');
            setSeverity('success');
            setOpen(true);
            clearCart();
        } catch (err) {
            console.error('Error submitting order:', err.message);
            setMessage(`Error submitting order: ${err.message}`);
            setSeverity('error');
            setOpen(true);
        }
    };


    const handleClose = () => {
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
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={3}>
                            <Typography variant="body2">
                                {customer?.name || 'N/A'}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="body2">
                                Table {customer?.tableNum || 'N/A'}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="body2">
                                £{(cart.totalPrice || 0).toFixed(2)}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="body2" sx={{
                                color: orderStatus === 'PENDING' ? 'orange' :
                                    orderStatus === 'COMPLETED' ? 'green' : 'white'
                            }}>
                                {orderStatus}
                            </Typography>
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
                        {Object.entries(orderedItems).map(([itemName, item]) => (
                            <ListItem key={itemName} sx={{ py: 1 }}>
                                <ListItemText
                                    primary={itemName}
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
                                £{(cart.totalPrice || 0).toFixed(2)}
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
            <form onSubmit={handleSubmit}>
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
                            type="submit"
                            variant="contained"
                            sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
                            fullWidth
                        >
                            Submit Order
                        </Button>
                    </Grid>
                </Grid>
            </form>
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