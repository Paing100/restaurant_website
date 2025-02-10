import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleItemChange = (e) => {
    const { value } = e.target;
    setOrder({ ...order, orderedItems: { ...order.orderedItems, [value]: (order.orderedItems[value] || 0) + 1 } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle order submission logic here
    console.log('Order submitted:', order);
  };

  return (
    <div>
      <Typography variant="h4">Place Your Order</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <FormControl fullWidth required>
            <InputLabel id="item-label">Item</InputLabel>
            <Select
              labelId="item-label"
              name="item"
              onChange={handleItemChange}
              label="Item"
            >
              {menuItems.map((menuItem) => (
                <MenuItem key={menuItem.id} value={menuItem.name}>
                  {menuItem.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={order.quantity}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Submit Order
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default Order;