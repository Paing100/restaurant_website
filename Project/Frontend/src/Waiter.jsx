import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography, List, ListItem, ListItemText, Box, Button } from "@mui/material";

function Waiter() {
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  const [orders, setOrders] = useState([]);
  const[delivered, setDelivered] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/order/getAllOrders");
      if (!response.ok) throw new Error("Error fetching orders");
      const data = await response.json();
      const submittedOrders = data.filter(order => order.orderStatus === 'SUBMITTED'); // only show SUBMITTED order in watier interface 
      const deliveredOrders = data.filter(order => order.orderStatus === 'DELIVERED'); // only show DELIVERED order in watier interface 
      console.log("Submitted Orders:", submittedOrders);
      setOrders(submittedOrders);
      setDelivered(deliveredOrders);
      console.log("Delivered Orders:", deliveredOrders);

      } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markAsDelivered = async (orderId) => {
    const updatedOrder = orders.find((order) => order.orderId === orderId);
  
    setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));
    setDelivered((prevDelivered) => [...prevDelivered, { ...updatedOrder, orderStatus: "DELIVERED" }]);
    
    const settings = {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"orderStatus": "DELIVERED"})
    }
    try {
      await fetch(`http://localhost:8080/api/order/${orderId}/updateOrderStatus`, settings);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", { 
      year: "numeric", month: "long", day: "numeric", 
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  };

  const formatElapsedTime = (orderPlaced) => {
    const now = new Date();
    const orderTime = new Date(orderPlaced);
    const diffInMinutes = Math.floor((now - orderTime) / 60000);  // Difference in minutes
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute(s) ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return `${hours} hour(s) and ${minutes} minute(s) ago`;
    }
  };

  return (
    <Box>
      <Typography variant="h3">Welcome {userName}!</Typography>
      <Typography variant="h4">{userRole} Dashboard</Typography>
      <Link to="/waiter_menu">
        <Button>Edit Menu</Button>
      </Link>

      <Typography variant="h5" sx={{ mt: 2 }}>Active Orders</Typography>
      <List>
        {orders.filter(order => order.orderStatus === "SUBMITTED" && order.orderMenuItems.length > 0).map(order => (
          <ListItem key={order.orderId} sx={{ borderBottom: "1px solid gray" }}>
            <ListItemText
              primary={`Order #${order.orderId} - Table ${order.tableNum}`}
              secondary={
                <>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Ordered At: {formatDate(order.orderPlaced)}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: 'gray' }}>
                    Time in Progress: {formatElapsedTime(order.orderPlaced)}
                  </Typography>
                  {order.orderMenuItems.map(item => (
                    <Typography key={item.orderMenuItemsId.itemId} variant="body2">
                      {item.menuItem.name} x{item.quantity} (£{(item.menuItem.price * item.quantity).toFixed(2)})
                    </Typography>
                  ))}
                </>
              }
            />
            <Button variant="contained" color="success" onClick={() => markAsDelivered(order.orderId)}>
              Mark as Delivered
            </Button>
          </ListItem>
        ))}
      </List>

       <Typography variant="h5" sx={{ mt: 2 }}>Delivered Orders</Typography>
      <List>
        {delivered.filter(order => order.orderStatus === "DELIVERED" && order.orderMenuItems.length > 0).map(order => (
          <ListItem key={order.orderId} sx={{ borderBottom: "1px solid gray" }}>
            <ListItemText
              primary={`Order #${order.orderId} - Table ${order.tableNum}`}
              secondary={
                <>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Ordered At: {formatDate(order.orderPlaced)}
                  </Typography>
                  {order.orderMenuItems.map(item => (
                    <Typography key={item.orderMenuItemsId.itemId} variant="body2">
                      {item.menuItem.name} x{item.quantity} (£{(item.menuItem.price * item.quantity).toFixed(2)})
                    </Typography>
                  ))}
                </>
              }
            />
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
