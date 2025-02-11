import React, { useState, useEffect } from 'react';
import { Button, Typography, Stack, List, ListItem, ListItemText, Divider } from '@mui/material';
import MenuCard from './MenuCard';

function Order() {
    const [order, setOrder] = useState({ customer: {}, orderedItems: {}, totalPrice: 0 });
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
        setOrder((prevOrder) => {
            const newOrderedItems = { ...prevOrder.orderedItems, [item.name]: (prevOrder.orderedItems[item.name] || 0) + 1 };
            const newTotalPrice = Object.keys(newOrderedItems).reduce((total, key) => {
                const menuItem = menuItems.find((menuItem) => menuItem.name === key);
                return total + (menuItem.price * newOrderedItems[key]);
            }, 0);
            return { ...prevOrder, orderedItems: newOrderedItems, totalPrice: newTotalPrice };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle order submission logic here
        console.log('Order submitted:', order);
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
                {Object.keys(order.orderedItems).map((itemName) => {
                    const quantity = order.orderedItems[itemName];
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
            <Typography variant="h6" sx={{ marginTop: 2 }}>Total Price: ${order.totalPrice.toFixed(2)}</Typography>
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