import {useEffect, useState, useRef} from "react";
import {Typography, List, ListItem, ListItemText, Box, Button, Snackbar, Alert} from "@mui/material";

function KitchenStaff() {
  const userName = sessionStorage.getItem("userName");
  const userRole = sessionStorage.getItem("userRole");
  const [orders, setOrders] = useState([]);
  const ws = useRef(null);
  const [notification, setNotification] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ws.current){
      ws.current = new WebSocket("ws://localhost:8080/ws/notifications")

      ws.current.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.current.onclose = () => {
        console.log('WebSocket closed. Attempting to reconnect...');
      };

      ws.current.onmessage = (event) => {
        let message;
        console.log("EVENT IN KITCHEN: " + event.data);
        fetchOrders();
        try{
          message = JSON.parse(event.data);
          if (message.recipient === "kitchen" && message.type === "CONFIRMED") {
            setNotification(message.message);
            setOpen(true);
          }
          console.log(message);
        }
        catch(error){
          console.log(error);
        }
      }
    }

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        console.log("Closing WebSocket on cleanup");
        ws.current.close();
      }
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
          "http://localhost:8080/api/order/getAllOrders");
      if (!response.ok) {
        throw new Error("Error fetching orders");
      }
      const data = await response.json();
      console.log(data);
      const pendingOrders = data.filter(
          order => order.orderStatus === "CONFIRMED");
      setOrders(pendingOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const markAsReady = async (orderId) => {
    setOrders(
        (prevOrders) => prevOrders.filter(order => order.orderId !== orderId));

    const settings = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"orderStatus": "READY"}),
    };

    const notificationMessage = {
          type: "READY", 
          orderId: orderId, 
          recipient: "waiter",
          message: `#${orderId} is ready to be delivered`
    };

    try {
      await fetch(
          `http://localhost:8080/api/order/${orderId}/updateOrderStatus`,
          settings);
          console.log('WebSocket State:', ws.current.readyState);

        const sendMessage = await fetch('http://localhost:8080/api/notification/send',{
          method:"POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(notificationMessage),
        });

        if (!sendMessage.ok) {
          throw new Error("Failed to send message via /send API");
        }

        if (ws.current && ws.current.readyState === WebSocket.OPEN){
          const message = JSON.stringify(
            notificationMessage
          );
          ws.current.send(message);
          console.log("SEND FROM KITCHEN " + JSON.stringify(message))
        }
      
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setOpen(false);
  };

  return (
    <>
      <Box>
        <Typography variant="h3">Welcome {userName}!</Typography>
        <Typography variant="h4">{userRole} Dashboard</Typography>

        <Typography variant="h5" sx={{mt: 2}}>Pending Orders</Typography>
        <List>
          {orders.map(order => (
              <ListItem key={order.orderId}
                        sx={{borderBottom: "1px solid gray"}}>
                <ListItemText
                    primary={`Order #${order.orderId} - Table ${order.tableNum} --- ${new Date(order.orderPlaced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    secondary={
                      <>
                          {order.orderMenuItems.map(item => (
                              <Typography key={item.orderMenuItemsId.itemId} variant="body2">
                                  {item.menuItem.name} x{item.quantity}
                              </Typography>
                          ))}
                      </>
                  }
                />
                <Button variant="contained" color="primary"
                        onClick={() => markAsReady(order.orderId)}>
                  Mark as Ready
                </Button>
              </ListItem>
          ))}
        </List>
      </Box>
                  <Snackbar open={open} onClose={handleClose}>
                      <Alert onClose={handleClose} severity={"success"} sx={{ width: '100%' }}>
                          {notification}
                      </Alert>
                  </Snackbar>
    </>
  );
}

export default KitchenStaff;
