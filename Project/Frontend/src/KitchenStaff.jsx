import { useEffect, useState } from "react";
import { Typography, List, Box, Snackbar, Alert } from "@mui/material";
import Orders from "./Orders";
import notiSound from './assets/sound/Noti.mp3';
import { useWithSound } from './useWithSound';
import useWebSocket from "./useWebSocket";

function KitchenStaff() {
  // retrieve the username from session storage 
  const userName = sessionStorage.getItem("userName");

  // State variables  
  const [orders, setOrders] = useState([]); // stores the list of pending orders 
  const [notification, setNotification] = useState(""); // store notification messages 
  const [open, setOpen] = useState(false); // controls the visibility of the snackbar 

  // custom hook to play notification sound 
  const { playSound } = useWithSound(notiSound);


  // function to play the sound 
  const handleNotiSound = () => {
    playSound();
  }

  const handleOnMessage = (event) => {
    try {
          const message = JSON.parse(event.data);
          // check if the message is for the kitchen and type is "CONFIRMED"
          if (message.recipient === "kitchen" && message.type === "CONFIRMED") {
            handleNotiSound(); // play sound 
            setNotification(message.message); // set notification message
            setOpen(true); // show the snackbar
            fetchOrders(); // refresh the list of orders 
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
  }

  // function to fetch orders from server 
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/order/getAllOrders"
      );
      if (!response.ok) throw new Error("Error fetching orders");

      const data = await response.json();
      // Filter orders with "CONFIRMED"
      const pendingOrders = data.filter(
        (order) => order.orderStatus === "CONFIRMED"
      );
      setOrders(pendingOrders); // update the orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };  

  useEffect(()=>{
    fetchOrders();
  },[]);

  const ws = useWebSocket(handleOnMessage);

  // function to change the order status to "READY"
  const markAsReady = async (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.orderId !== orderId)
    );

    const settings = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: "READY" }),
    };

    // notification message to be sent to the waiter 
    const notificationMessage = {
      type: "READY",
      orderId: orderId,
      recipient: "waiter",
      message: `#${orderId} is ready to be delivered`,
    };

    try {
      // update the order status using the API
      await fetch(
        `http://localhost:8080/api/order/${orderId}/updateOrderStatus`,
        settings
      );

      // send the message to the waiter with an API end point 
      const sendMessage = await fetch(
        "http://localhost:8080/api/notification/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notificationMessage),
        }
      );

      if (!sendMessage.ok) throw new Error("Failed to send notification");

      // send the notification via websocket if the connection is open 
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(notificationMessage));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // function to close the snackbar 
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Box sx={{ padding: 3, color: "white", minHeight: "100vh" }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Welcome, {userName}!
      </Typography>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Pending Orders
      </Typography>

      {/* Display the list of pending orders if there's any */}
      {orders.length > 0 ? (
        <List>
          {orders.map((order) => (
            <Orders
              key={order.orderId}
              order={order}
              buttonName="Mark as Ready"
              onButtonClick={markAsReady}
              fetchOrders={fetchOrders}
              buttonStyle={{
                backgroundColor: "#5762d5",
                color: "white",
                "&:hover": { backgroundColor: "#4751b3" },
              }}
              forKitchen={true}
            />
          ))}
        </List>
      ) : (
        <Typography variant="h6" sx={{ mt: 2, color: "gray" }}>
          No orders to mark as ready
        </Typography>
      )}

      {/* Snackbar for notifications */} 
      <Snackbar open={open} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{
            width: "100%",
            backgroundColor: "#5762d5",
            color: "white",
            borderRadius: "8px",
            "& .MuiAlert-icon": { color: "white" },
          }}
        >
          {notification}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default KitchenStaff;