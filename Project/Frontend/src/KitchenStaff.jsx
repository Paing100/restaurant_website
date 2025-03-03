import { useEffect, useState } from "react";
import { Typography, List, ListItem, ListItemText, Box } from "@mui/material";

function KitchenStaff() {
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/order/getAllOrders");
      if (!response.ok) throw new Error("Error fetching orders");
      const data = await response.json();
      const pendingOrders = data.filter(order => order.orderStatus === "SUBMITTED");
      setOrders(pendingOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box>
      <Typography variant="h3">Welcome {userName}!</Typography>
      <Typography variant="h4">{userRole} Dashboard</Typography>

      <Typography variant="h5" sx={{ mt: 2 }}>Pending Orders</Typography>
      <List>
        {orders.map(order => (
          <ListItem key={order.orderId} sx={{ borderBottom: "1px solid gray" }}>
            <ListItemText
              primary={`Order #${order.orderId} - Table ${order.tableNum}`}
              secondary={order.orderMenuItems.map(item => (
                <Typography key={item.orderMenuItemsId.itemId} variant="body2">
                  {item.menuItem.name} x{item.quantity}
                </Typography>
              ))}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default KitchenStaff;
