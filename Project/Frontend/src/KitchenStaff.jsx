import { useEffect, useState, useRef } from "react";
import { Typography, List, Box, Snackbar, Alert } from "@mui/material";
import Orders from "./Orders";

function KitchenStaff() {
  const userName = sessionStorage.getItem("userName");
  const [orders, setOrders] = useState([]);
  const ws = useRef(null);
  const [notification, setNotification] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket("ws://localhost:8080/ws/notifications");

      ws.current.onopen = () => console.log("WebSocket connected");

      ws.current.onclose = () => console.log("WebSocket closed");

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.recipient === "kitchen" && message.type === "CONFIRMED") {
            setNotification(message.message);
            setOpen(true);
            fetchOrders();
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    }

    fetchOrders();

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/order/getAllOrders"
      );
      if (!response.ok) throw new Error("Error fetching orders");

      const data = await response.json();
      const pendingOrders = data.filter(
        (order) => order.orderStatus === "CONFIRMED"
      );
      setOrders(pendingOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const markAsReady = async (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.orderId !== orderId)
    );

    const settings = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: "READY" }),
    };

    const notificationMessage = {
      type: "READY",
      orderId: orderId,
      recipient: "waiter",
      message: `#${orderId} is ready to be delivered`,
    };

    try {
      await fetch(
        `http://localhost:8080/api/order/${orderId}/updateOrderStatus`,
        settings
      );

      const sendMessage = await fetch(
        "http://localhost:8080/api/notification/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notificationMessage),
        }
      );

      if (!sendMessage.ok) throw new Error("Failed to send notification");

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(notificationMessage));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

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