import { useEffect, useState } from "react";
import { Typography, Box} from "@mui/material";
import notiSound from './assets/sound/Noti.mp3';
import { useWithSound } from './useWithSound';
import useWebSocket from "./useWebSocket";
import ConfirmedOrders from "./KitchenStaff/ConfirmedOrders.jsx";
import axios from "axios";
import CommonSnackBar from "./CommonSnackBar.jsx";

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
      const response = await axios.get("http://localhost:8080/api/order/getAllOrders");
      const data = response.data;
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

  // notification message to be sent to the waiter 
  const notificationMessage = {
    type: "READY",
    orderId: orderId,
    recipient: "waiter",
    message: `#${orderId} is ready to be delivered`,
  };

  try {
    // update the order status using the API
    await axios.post(
      `http://localhost:8080/api/order/${orderId}/updateOrderStatus`,
      { orderStatus: "READY" }
    );

    // send the message to the waiter with an API end point 
    await axios.post(
      "http://localhost:8080/api/notification/send",
      notificationMessage
    );

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
      <ConfirmedOrders 
        orders={orders}
        markAsReady={markAsReady}
        fetchOrders={fetchOrders}
      />

      {/* Snackbar for notifications */} 
      <CommonSnackBar
        open={open}
        severity={"success"}
        handleClose={handleClose}
        notification={notification}
      />
    </Box>
  );
}

export default KitchenStaff;