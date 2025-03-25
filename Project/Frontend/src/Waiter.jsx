import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Typography, List, Box, Button, Tabs, Tab, Grid, Snackbar, Alert } from "@mui/material";
import Orders from "./Orders";

function Waiter() {
  const userName = sessionStorage.getItem("userName");
  const userRole = sessionStorage.getItem("userRole");
  const employeeId = sessionStorage.getItem("employeeId");
  const [orders, setOrders] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [notification, setNotification] = useState("");
  const [tables, setTables] = useState({ defaultTables: [], activeTables: [] });
  const ws = useRef(null);
  const [open, setOpen] = useState(false);


  // use orderId to trigger use Effect, but if the same order is clicked again for other purpose
  // use effect doesn't work anymore 
  const [orderStatus, setOrderStatus] = useState({ orderId: "", orderStatus: "" });

  const categories = ["To Confirm", "Ready To Deliver", "Delivered"];

  const statusMap = new Map([
    ["To Confirm", "SUBMITTED"],
    ["Ready To Deliver", "READY"],
    ["Delivered", "DELIVERED"]
  ]);

  // fetch waiter's assigned tables
  const fetchTables = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/waiter/${employeeId}/tables`);
      if (!response.ok) throw new Error("Error fetching tables");
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  // fetch waiter's orders
  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/waiter/${employeeId}/orders`);
      if (!response.ok) throw new Error("Error fetching orders");
      const data = await response.json();
      // Add console.log to debug the incoming data
      console.log("Raw order data:", data);

      const ordersWithPayment = data.map(order => ({
        ...order,
        isPaid: order.orderPaid === true // Ensure boolean conversion
      }));
      // Add console.log to verify the transformed data
      console.log("Transformed orders:", ordersWithPayment);
      setOrders(ordersWithPayment);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // use effect for fetching all orders 
  useEffect(() => {
    fetchTables();
    fetchOrders();
    if (!ws.current) {
      ws.current = new WebSocket("ws://localhost:8080/ws/notifications")

      ws.current.onopen = () => {
        console.log('WebSocket connected', ws.current.readyState);
      };

      ws.current.onclose = () => {
        console.log("Websocket session is closed");
      };

      ws.current.onmessage = (event) => {
        let message;
        console.log("Event WAITER: " + event.data);
        setOrderStatus({orderId: event.data.orderId, orderStatus: event.data.orderStatus}); 
        fetchOrders();
        try {
          message = JSON.parse(event.data);

          // Check if the message is for the current waiter
          console.log("Message waiterId: ", message.waiterId);
          console.log("Employee ID: ", employeeId);
          if (message.waiterId && message.waiterId !== employeeId) {
            console.log("Notification ignored: Not for this waiter.");
            return; // Ignore the message if the waiterId does not match
          }

          if ((message.recipient === "waiter" && message.type === "READY") || message.type === "ORDER_SUBMIT") {
            setOpen(true);
            setNotification(message.message);
            fetchOrders();
            fetchTables();
          }
        } catch (error) {
          message = event.data;
          console.log(error);
        }
      };
    }
  }, [employeeId, orderStatus]);

  // change the status an order 
  const updateOrderStatus = async (orderId, newStatus) => {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "orderStatus": newStatus })
    }
    try {
      await fetch(`http://localhost:8080/api/order/${orderId}/updateOrderStatus`, settings);
      await fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  }

  const filteredOrders = orders.filter((order) => order.orderStatus === statusMap.get(categories[selectedTab]));


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <h1>{notification}</h1>
      <Box>
        <Typography variant="h3">Welcome {userName}!</Typography>
        <Typography variant="h4">{userRole} Dashboard</Typography>
        
        <Typography variant="h6" sx={{ mb: 1 }}>Your Assigned Tables</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {Array.from(new Set([...(tables.defaultTables || []), ...(tables.activeTables || [])])).sort((a, b) => a - b).join(", ")}
        </Typography>

        <Link to="/waiter_menu">
          <Button>Edit Menu</Button>
        </Link>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: '#5762d5' } }}
          sx={{
            '& .MuiTab-root': {
              color: 'white',
            },
            '& .Mui-selected': {
              color: '#5762d5',
            },
          }}
        >
          {categories.map((category, index) => (
            <Tab key={index} label={category} />
          ))}
        </Tabs>

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
                            pointerEvents: "none"
                          }
                        : {
                            backgroundColor: "#2e7d32"
                          }
                    }
                    onButtonClick={() => {
                      if (selectedTab === 2) return;
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
      </Box>
      <Snackbar open={open} onClose={handleClose}>
        <Alert onClose={handleClose} severity={"success"} sx={{ width: '100%' }}>
          {notification}
        </Alert>
      </Snackbar>
    </>
  );
}
export default Waiter;
