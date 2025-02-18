import React, { useEffect, useContext } from 'react';
import { Button, Typography, Stack, List, ListItem, ListItemText, Divider } from '@mui/material';
import { CartContext } from './CartContext';

function Order() {
    const { localCart, fetchCart, removeItemFromCart, saveCartToDatabase } = useContext(CartContext);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:8080/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(localCart),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Order submitted:', data);
            })
            .catch(err => console.error('Error submitting order:', err));
    };

    return (
        <div>
            <Typography variant="h4">Place Your Order</Typography>
            <Typography variant="h5" sx={{ marginTop: 4 }}>Ordered Items</Typography>
            <List>
                {Object.entries(localCart.orderedItems).map(([itemName, { quantity, price }]) => {
                    const itemTotal = price * quantity;
                    return (
                        <ListItem key={itemName}>
                            <ListItemText primary={`${itemName} x${quantity}`} secondary={`Total: $${itemTotal.toFixed(2)}`} />
                            <Button onClick={() => removeItemFromCart({ name: itemName, price })} color="secondary">Remove</Button>
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            <Typography variant="h6" sx={{ marginTop: 2 }}>Total Price: ${localCart.totalPrice.toFixed(2)}</Typography>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2} sx={{ marginTop: 2 }}>
                    <Button type="submit" variant="contained" color="primary">Submit Order</Button>
                </Stack>
            </form>
        </div>
    );
}

export default Order;