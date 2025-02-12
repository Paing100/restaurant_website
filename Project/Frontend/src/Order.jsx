import React, { useContext, useEffect, useState } from 'react';
import { Button, Typography, Stack, List, ListItem, ListItemText, Divider } from '@mui/material';
import { CartContext } from './CartContext';
import MenuCard from './MenuCard';

function Order() {
    const { cart, addItemToCart } = useContext(CartContext);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:2810/items')
            .then(response => response.json())
            .then(data => {
                setMenuItems(data);
            })
            .catch(err => console.error(err));
    }, []);

    const handleAddItem = (item) => {
        // Call backend API to add item to cart
        fetch('http://localhost:2810/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ item }),
        })
            .then(response => response.json())
            .then(data => {
                addItemToCart(item); // Update the cart context
            })
            .catch(err => console.error(err));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call backend API to submit the order
        fetch('http://localhost:2810/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cart),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Order submitted:', data);
            })
            .catch(err => console.error(err));
    };

    return (
        <div>
            <Typography variant="h4">Place Your Order</Typography>
            <div>
                {menuItems.map((menuItem) => (
                    <MenuCard key={menuItem.id} item={menuItem} onAdd={handleAddItem} />
                ))}
            </div>
            <Typography variant="h5" sx={{ marginTop: 4 }}>Ordered Items</Typography>
            <List>
                {Object.keys(cart.orderedItems).map((itemName) => {
                    const quantity = cart.orderedItems[itemName];
                    const menuItem = menuItems.find((menuItem) => menuItem.name === itemName);
                    return (
                        <ListItem key={itemName}>
                            <ListItemText
                                primary={`${itemName} x${quantity}`}
                                secondary={`Price: $${menuItem.price * quantity}`}
                            />
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            <Typography variant="h6" sx={{ marginTop: 2 }}>Total Price: ${cart.totalPrice.toFixed(2)}</Typography>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2} sx={{ marginTop: 2 }}>
                    <Button type="submit" variant="contained" color="primary">
                        Submit Order
                    </Button>
                </Stack>
            </form>
        </div>
    );
}

export default Order;