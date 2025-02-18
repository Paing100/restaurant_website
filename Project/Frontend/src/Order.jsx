import React, { useEffect, useContext } from 'react';
import { Button, Typography, List, ListItem, ListItemText, Divider, Grid, Box, CardMedia } from '@mui/material';
import { CartContext } from './CartContext';

function Order() {
    const { localCart, fetchCart, removeItemFromCart, clearCart } = useContext(CartContext);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleSubmit = (e) => {
        e.preventDefault();
        clearCart();
        const orderedItemsArray = Object.entries(localCart.orderedItems).map(([name, { quantity, price, imagePath }]) => ({
            name,
            quantity,
            price,
            imagePath
        }));
        const orderData = { ...localCart, orderedItems: orderedItemsArray };

        fetch('http://localhost:8080/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Order submitted:', data);
            })
            .catch(err => console.error('Error submitting order:', err));
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
                            <Box height="100"><CardMedia component="img" image={imagePath} /></Box>
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
        </Box>
    );
}

export default Order;