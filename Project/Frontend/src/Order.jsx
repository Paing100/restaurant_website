import React, { useEffect, useContext, useState } from 'react';
import { Button, Typography, List, ListItem, ListItemText, Divider, Grid, Box, CardMedia, Snackbar, Alert } from '@mui/material';
import { CartContext } from './CartContext';

function Order() {
    const { localCart, fetchCart, removeItemFromCart, clearCart } = useContext(CartContext);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    useEffect(() => {
        fetchCart();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!localCart.orderedItems || Object.keys(localCart.orderedItems).length === 0) {
            console.error("Error: Cart is empty. Cannot submit order.");
            setMessage("Error: Cart is empty. Cannot submit order.");
            setSeverity('error');
            setOpen(true);
            return;
        }

        const customerResponse = await fetch('http://localhost:8080/customers'); 
        if (!customerResponse.ok){
            console.log("ERROR")
        }
        const customer = await customerResponse.json();

        // Convert orderedItems into the expected array format
        const orderedItemsArray = Object.entries(localCart.orderedItems).map(([name, item]) => ({
            itemId: name,  // Use item ID or unique identifier here
            price: item.price,
            quantity: item.quantity
        }));

        const orderData = {
            customer: customer, 
            orderedItems: orderedItemsArray,
        };

        console.log(JSON.stringify(orderData, null, 2)); // Debugging log

        try {
            const response = await fetch('http://localhost:8080/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();
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
        <Box>
            <Typography variant="h4">Place Your Order</Typography>
            <Typography variant="h5" sx={{ marginTop: 4 }}>Ordered Items</Typography>
            <List>
                {Object.entries(localCart.orderedItems).map(([itemName, { quantity, price, imagePath }]) => {
                    const itemTotal = price * quantity;
                    return (
                        <ListItem key={itemName}>
                            <CardMedia
                                component="img"
                                height="50"
                                image="src/assets/flan.jpg"
                                sx={{ marginRight: 2, width: 50 }}
                            />
                            <ListItemText primary={`${itemName} x${quantity}`} secondary={`Total: £${itemTotal.toFixed(2)}`} />
                            <Button onClick={() => removeItemFromCart({ name: itemName, price })} color="secondary">Remove</Button>
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            <Typography variant="h6" sx={{ marginTop: 2 }}>Total Price: £{localCart.totalPrice.toFixed(2)}</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    <Grid item xs={6}>
                        <Box sx={{ border: '1px solid blue', borderRadius: 1 }}>
                            <Button onClick={() => clearCart()} color="primary" fullWidth>Clear Cart</Button>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>Submit Order</Button>
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