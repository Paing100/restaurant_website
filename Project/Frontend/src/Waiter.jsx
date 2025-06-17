import { useEffect, useState } from "react";
import {
  Box
} from "@mui/material";
import notiSound from './assets/sound/Noti.mp3';
import { useWithSound } from './useWithSound';
import useWebSocket from "./useWebSocket";
import {
  fetchTables, 
  fetchOrders,
  alertOthers,
  updateOrderStatus
} from "./Waiter/WaiterUtils";
import CategorizedOrders from "./Waiter/CategorizedOrders";
import StaticUI from "./Waiter/StaticUI";
import CommonSnackBar from "./CommonSnackBar";


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
            fetchOrders(employeeId).then(setOrders).catch(console.error);
            fetchTables(employeeId).then(setTables).catch(console.error);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
    };

   // WebSocket connection for receiving real-time notifications
   useWebSocket(handleMessage);

  useEffect(() => {
    fetchTables(employeeId).then(setTables).catch(console.error);
    fetchOrders(employeeId).then(setOrders).catch(console.error);
  }, [employeeId, orderStatus]);

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

  const handleAlertOthers = (tableNumber, orderId) => {
    alertOthers(tableNumber, orderId, employeeId, setAlerts).catch(console.error);
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    updateOrderStatus(employeeId, orderId, newStatus).then(setOrders).catch(console.error);
  }

  return (
    <Box sx={{ padding: 3, color: "white", minHeight: "100vh", position: "relative" }}>

      <StaticUI
        userName={userName}
        alerts={alerts}
        tables={tables}
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
        categories={categories}
      ></StaticUI>

      {/* Display filtered orders */}
      <CategorizedOrders
        filteredOrders={filteredOrders}
        selectedTab={selectedTab}
        categories={categories}        
        fetchOrders={fetchOrders}
        handleAlertOthers={handleAlertOthers}
        handleUpdateOrderStatus={handleUpdateOrderStatus}
        setOrderStatus={setOrderStatus}
        employeeId={employeeId}
        setOrders={setOrders}
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

export default Waiter;
