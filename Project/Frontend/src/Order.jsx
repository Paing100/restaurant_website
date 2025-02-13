import React, { useEffect, useState } from 'react';
import { Button, Typography, Stack, List, ListItem, ListItemText, Divider } from '@mui/material';

function Order() {
    const [order, setOrder] = useState({ orderedItems: {}, totalPrice: 0 });

    // Fetch the current order from the backend
    useEffect(() => {
        fetch('http://localhost:8080/order')
            .then(response => response.json())
            .then(data => setOrder(data))
            .catch(err => console.error('Error fetching order:', err));
    }, []);

    // Function to add an item to the order
    const addItem = (itemName, quantity) => {
        fetch(`http://localhost:8080/order/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemName, quantity }),
        })
            .then(response => response.json())
            .then(data => setOrder(data))
            .catch(err => console.error('Error adding item:', err));
    };

    // Function to remove an item from the order
    const removeItem = (itemName) => {
        fetch(`http://localhost:8080/order/remove`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemName }),
        })
            .then(response => response.json())
            .then(data => setOrder(data))
            .catch(err => console.error('Error removing item:', err));
    };

    // Function to submit the order
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:8080/order/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
        })
            .then(response => response.json())
            .then(data => console.log('Order submitted:', data))
            .catch(err => console.error(err));
    };

    return (
        <div>
            <Typography variant="h4">Place Your Order</Typography>
            <Typography variant="h5" sx={{ marginTop: 4 }}>Ordered Items</Typography>
            <List>
                {Object.entries(order.orderedItems).map(([itemName, quantity]) => (
                    <ListItem key={itemName}>
                        <ListItemText primary={`${itemName} x${quantity}`} />
                        <Button onClick={() => removeItem(itemName)} color="secondary">Remove</Button>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <Typography variant="h6" sx={{ marginTop: 2 }}>Total Price: ${order.totalPrice.toFixed(2)}</Typography>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2} sx={{ marginTop: 2 }}>
                    <Button type="submit" variant="contained" color="primary">Submit Order</Button>
                </Stack>
            </form>
        </div>
    );
}

export default Order;
