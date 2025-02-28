/* eslint-disable */
import React, { useContext, useState } from 'react';
import { Button, Typography, List, ListItem, ListItemText, Divider, Grid, Box, CardMedia, Snackbar, Alert, IconButton } from '@mui/material';
import { CartContext } from './CartContext';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function Order() {
    const { cart, fetchCart, removeItemFromCart, clearCart, setCustomer, customer, addItemToCart } = useContext(CartContext);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [customerName, setCustomerName] = useState('');
    const [tableNum, setTableNum] = useState(1);

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

        if (!customerName) {
            console.error("Error: Customer name is required.");
            setMessage("Error: Customer name is required.");
            setSeverity('error');
            setOpen(true);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/customers/add?name=${customerName}&tableNum=${tableNum}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/hal+json'
                },
            });
            const newCustomer = await response.json();
            setCustomer(newCustomer);

            const orderedItemsArray = Object.entries(orderedItems).map(([itemName, quantity]) => ({
                itemName: itemName,  // Use the itemName here
                quantity: quantity
            }));

            const orderData = {
                customer: newCustomer,
                orderedItems: orderedItemsArray,
            };

            const orderResponse = await fetch('http://localhost:8080/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!orderResponse.ok) {
                throw new Error(`Server responded with status: ${orderResponse.status}`);
            }

            const data = await orderResponse.json();
            console.log('Order submitted successfully:', data);

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

    return (
        <Box sx={{ padding: 3 }}>
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
        </Box>
    );
}

export default Order;