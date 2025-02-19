import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Typography, List, ListItem, ListItemText, Box } from "@mui/material";
import { Button } from "@mui/material";

function Waiter() {
  const [orders, setOrders] = useState([]);

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
          customer: { name: "Carlos Mendoza" },
          orderedItems: [{ name: "Tacos al Pastor", quantity: 3, price: 9.99 }],
          totalPrice: 29.97,
        },
        {
          orderId: 102,
          customer: { name: "Maria Lopez" },
          orderedItems: [{ name: "Birria Tacos", quantity: 2, price: 12.99 }],
          totalPrice: 25.98,
        },
        {
          orderId: 103,
          customer: { name: "Alejandro Rivera" },
          orderedItems: [
            { name: "Chiles Rellenos", quantity: 1, price: 11.99 },
            { name: "Horchata", quantity: 1, price: 3.99 },
          ],
          totalPrice: 15.98,
        },
        {
          orderId: 104,
          customer: { name: "Sofia Martinez" },
          orderedItems: [
            { name: "Enchiladas Verdes", quantity: 1, price: 10.99 },
            { name: "Flan", quantity: 1, price: 4.99 },
          ],
          totalPrice: 15.98,
        },
      ]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markAsDelivered = (orderId) => {
    console.log(`Marked order ${orderId} as delivered`);
    setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
  };

  return (
    <Box>
      <Typography variant="h4">Waiter Dashboard</Typography>
      <List>
        {orders.map((order) => (
          <ListItem key={order.orderId} sx={{ borderBottom: "1px solid gray" }}>
            <ListItemText
              primary={`Order #${order.orderId} - ${order.customer.name}`}
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
    </Box>
  );
}

export default Waiter;
