import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  Typography,
  List,
  Box,
  Button,
  Tabs,
  Tab,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import Orders from "./Orders";
import NotificationDrawer from "./NotificationDrawer";
import notiSound from './assets/sound/Noti.mp3';
import { useWithSound } from './useWithSound';
import useWebSocket from "./useWebSocket";


function Waiter() {
  // Retrieve session data for username and employee ID
  const userName = sessionStorage.getItem("userName");
  const employeeId = sessionStorage.getItem("employeeId");

  // state variables
  const [orders, setOrders] = useState([]); // stores list of orders
  const [selectedTab, setSelectedTab] = useState(0); // tracks the currently selected tab 
  const [notification, setNotification] = useState(""); // stores the notifiction messages
  const [alerts, setAlerts] = useState([]); // stores alert notifications
  const [tables, setTables] = useState({ defaultTables: [], activeTables: [] }); // stores assigned tables 
  const [open, setOpen] = useState(false); // controls the visibility of the snackbar 
  const [orderStatus, setOrderStatus] = useState({ orderId: "", orderStatus: "" }); // Tracks the status of an order

  // Use custom hook for handling notification sound
  const { playSound } = useWithSound(notiSound);

  const handleNotiSound = () => { // Play notification sound when a new notification arrives
    playSound();
  }

  // categories for the tabs 
  const categories = ["To Confirm", "Ready To Deliver", "Delivered"];

  // map order statuses to tab categories 
  const statusMap = new Map([
    ["To Confirm", "SUBMITTED"],
    ["Ready To Deliver", "READY"],
    ["Delivered", "DELIVERED"],
  ]);

  // Fetch tables assigned to the waiter
  const fetchTables = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/waiter/${employeeId}/tables`
      );
      if (!response.ok) throw new Error("Error fetching tables");
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

 // Fetch orders assigned to the waiter
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/waiter/${employeeId}/orders`
      );
      if (!response.ok) throw new Error("Error fetching orders");
      const data = await response.json();
      const ordersWithPayment = data.map((order) => ({
        ...order,
        isPaid: order.orderPaid === true,
      }));
      setOrders(ordersWithPayment);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleMessage = (event) => {
        let message = JSON.parse(event.data);
        try {
          message = JSON.parse(event.data);

          if (message.orderId && message.orderStatus) {
              // Update order status from WebSocket message
              setOrderStatus({ orderId: event.data.orderId, orderStatus: event.data.orderStatus });
          }

          if (message.waiterId && message.waiterId !== employeeId) return;
          
          if (
            (message.recipient === "waiter" && message.type === "READY") ||
            message.type === "ORDER_SUBMITTED"
          ) {
            handleNotiSound();
            setOpen(true);
            setNotification(message.message);
            fetchOrders();
            fetchTables();
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
    };

   // WebSocket connection for receiving real-time notifications
    const ws = useWebSocket(handleMessage);
    
  useEffect(() => {
    fetchTables();
    fetchOrders();
  }, [employeeId, orderStatus]);

  // Update order status on the server
  const updateOrderStatus = async (orderId, newStatus) => {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderStatus: newStatus }),
    };
    try {
      await fetch(
        `http://localhost:8080/api/order/${orderId}/updateOrderStatus`,
        settings
      );
      await fetchOrders(); // refresh orders after updating status
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // handle tab change 
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // filter orders based on selected tab 
  const filteredOrders = orders.filter(
    (order) => order.orderStatus === statusMap.get(categories[selectedTab])
  );

  // Close notification alert
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  // Send alert notification to waiter if assistance is needed
  const alertOthers = async (tableNumber, orderId) => {
    const alertMessage = {
      type: "ALERT",
      orderId: orderId,
      recipient: "waiter",
      message: `Table ${tableNumber} needs assistance`,
      waiterId: employeeId,
    };
    try {
      const sendAlert = await fetch(
        "http://localhost:8080/api/notification/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(alertMessage),
        }
      );
      if (!sendAlert.ok) throw new Error("Failed to send an alert");
      setAlerts((prevAlerts) => [...prevAlerts, alertMessage]); // Add the alert to the alerts state
    } catch (error) {
      console.error("Error sending alert:", error);
    }
  };

  return (
    <Box sx={{ padding: 3, color: "white", minHeight: "100vh", position: "relative" }}>

      <Typography variant="h3" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Welcome, {userName}!
      </Typography>

      {/* Notification drawer */}
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <NotificationDrawer notifications={alerts} />
      </Box>

      {/* Assigned tables */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          marginBottom: 3,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Your Assigned Tables:
        </Typography>
        <Typography variant="body1">
          {Array.from(
            new Set([...(tables.defaultTables || []), ...(tables.activeTables || [])])
          )
            .sort((a, b) => a - b)
            .join(", ")}
        </Typography>
      </Box>

      <Link to="/waiter_menu" style={{ textDecoration: "none" }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#5762d5",
            color: "white",
            "&:hover": { backgroundColor: "#4751b3" },
            marginBottom: 3,
          }}
        >
          Edit Menu
        </Button>
      </Link>

      {/* Tabs for order categories */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        centered
        textColor="inherit"
        TabIndicatorProps={{ style: { backgroundColor: "#5762d5" } }}
        sx={{
          "& .MuiTab-root": {
            color: "white",
          },
          "& .Mui-selected": {
            color: "#5762d5",
          },
        }}
      >
        {categories.map((category, index) => (
          <Tab key={index} label={category} />
        ))}
      </Tabs>

      {/* Display filtered orders */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {filteredOrders.length > 0 ? (
            <List>
              {filteredOrders.map((order) => (
                <Orders
                  key={order.orderId}
                  order={order}
                  buttonName={
                    selectedTab === 0
                      ? "Confirm Order"
                      : selectedTab === 1
                        ? "Deliver"
                        : selectedTab === 2
                          ? order.isPaid
                            ? "Paid"
                            : "Unpaid"
                          : ""
                  }
                  buttonStyle={
                    selectedTab === 2
                      ? {
                        backgroundColor: order.isPaid ? "#2e7d32" : "#d32f2f",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "default",
                        textTransform: "uppercase",
                        pointerEvents: "none",
                      }
                      : {
                        backgroundColor: "#2e7d32",
                      }
                  }
                  onButtonClick={() => {
                    if (selectedTab === 2) return; // do nothing for "Delivered" tab
                    const newStatus =
                      selectedTab === 0
                        ? "CONFIRMED"
                        : selectedTab === 1
                          ? "DELIVERED"
                          : "";
                    updateOrderStatus(order.orderId, newStatus);
                    setOrderStatus({
                      orderId: order.orderId,
                      orderStatus: order.orderStatus,
                    });
                  }}

                  fetchOrders={fetchOrders}
                  alertButton={alertOthers}
                />
              ))}
            </List>
          ) : (
            <Typography variant="h6" sx={{ mt: 2 }}>
              No orders in {categories[selectedTab]}
            </Typography>
          )}
        </Grid>
      </Grid>
      
      {/* Snackbar for notifications */}
      <Snackbar open={open} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={"success"}
          sx={{
            width: "100%",
            backgroundColor: "#5762d5",
            color: "white",
            borderRadius: "8px",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
        >
          {notification}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Waiter;
