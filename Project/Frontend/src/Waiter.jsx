/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Typography, List, ListItem, ListItemText, Box } from "@mui/material";
import { Button } from "@mui/material";


function Waiter() {
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  const [orders, setOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/orders");
      if (!response.ok) throw new Error("Backend error");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([
        {
          orderId: 101,
          customer: { name: "Carlos Mendoza", tableNumber: 5 },
          orderedItems: [{ name: "Tacos al Pastor", quantity: 3, price: 9.99 }],
          totalPrice: 29.97,
          delivered: false,
        },
        {
          orderId: 102,
          customer: { name: "Maria Lopez", tableNumber: 2 },
          orderedItems: [{ name: "Birria Tacos", quantity: 2, price: 12.99 }],
          totalPrice: 25.98,
          delivered: false,
        },
        {
          orderId: 103,
          customer: { name: "Alejandro Rivera", tableNumber: 7 },
          orderedItems: [
            { name: "Chiles Rellenos", quantity: 1, price: 11.99 },
            { name: "Horchata", quantity: 1, price: 3.99 },
          ],
          totalPrice: 15.98,
          delivered: false,
        },
        {
          orderId: 104,
          customer: { name: "Sofia Martinez", tableNumber: 3 },
          orderedItems: [
            { name: "Enchiladas Verdes", quantity: 1, price: 10.99 },
            { name: "Flan", quantity: 1, price: 4.99 },
          ],
          totalPrice: 15.98,
          delivered: false,
        },
      ]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markAsDelivered = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId ? { ...order, delivered: true } : order
      )
    );
  };

  return (
    <Box>
      <Typography variant="h3">Welcome {userName}!</Typography>
      <Typography variant="h4">{userRole} Dashboard</Typography>
      <Typography variant="h5" sx={{ mt: 2 }}>
        Active Orders
      </Typography>
      <List>
        {orders
          .filter((order) => !order.delivered)
          .map((order) => (
            <ListItem key={order.orderId} sx={{ borderBottom: "1px solid gray" }}>
              <ListItemText
                primary={`Order #${order.orderId} - ${order.customer.name} (Table ${order.customer.tableNumber})`}
                secondary={order.orderedItems
                  .map((item) => `${item.name} x${item.quantity}`)
                  .join(", ")}
              />
              <Typography variant="body2">£{order.totalPrice.toFixed(2)}</Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => markAsDelivered(order.orderId)}
              >
                Mark as Delivered
              </Button>
            </ListItem>
          ))}
      </List>

      <Typography variant="h5" sx={{ mt: 2 }}>
        Delivered Orders
      </Typography>
      <List>
        {orders
          .filter((order) => order.delivered)
          .map((order) => (
            <ListItem key={order.orderId} sx={{ borderBottom: "1px solid gray" }}>
              <ListItemText
                primary={`Order #${order.orderId} - ${order.customer.name} (Table ${order.customer.tableNumber})`}
                secondary={order.orderedItems
                  .map((item) => `${item.name} x${item.quantity}`)
                  .join(", ")}
              />
              <Typography variant="body2">£{order.totalPrice.toFixed(2)}</Typography>
              <Button variant="contained" color="secondary" disabled>
                Delivered
              </Button>
            </ListItem>
          ))}
      </List>
    </Box>
  );
}

export default Waiter;
