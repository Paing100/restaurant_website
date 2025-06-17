import { useEffect, useState, useCallback } from "react";
import { Typography, Box } from "@mui/material";
import NewOrderModal from "./NewOrderModal";
import useWebSocket from "./useWebSocket.jsx";
import OutstandingOrdersTable from "./Manager/OutstandingOrdersTable.jsx";
import StockStatusTable from "./Manager/StockStatusTable.jsx";
import OrdersAndStockTabs from "./Manager/OrdersAndStockTabs.jsx";
import ManagerNavButton from "./Manager/ManagerNavButton.jsx";
import ErrorBar from "./ErrorBar.jsx";
import axios from 'axios';

function Manager() {
  // state variables 
  const [orders, setOrders] = useState([]); // stores outstanding orders
  const [stock, setStock] = useState(""); // stores stock data 
  const [error, setError] = useState(""); // stores error messages 
  const [tabIndex, setTabIndex] = useState(0); // tracks the active tab 
  const [endOfDayOpen, setEndOfDayOpen] = useState(false); // controls the visibility of the end-of-day modal 
  const [totalSales, setTotalSales] = useState(0); // stores the total sales 



  // Fetch outstanding orders from the server
  const fetchOutstandingOrders = useCallback(async () => {
    try {
      const {data: data} = await axios.get("http://localhost:8080/Manager/getOutstandingOrders");
      setOrders(data);
      // Calculate total sales from the list of orders
      const total = data.reduce((total, order) => {
        const orderTotal = order.orderMenuItems.reduce(
          (sum, item) => sum + item.menuItem.price * item.quantity, 0);
        return total + orderTotal;
      }, 0);
      setTotalSales(total);

      } catch (err) {
        setError(err.message);
      }
    }, []);

  // Fetch stock data from the server
  const fetchStock = useCallback(async () => {
    try {
      const {data: data} = await axios.get("http://localhost:8080/Manager/showAllStock");
      setStock(data);
    } catch (err) {
      setError(err.message);
    }
  },[]);

    // fetch outstanding orders and stock data when the component mounts 
  useEffect(() => {
    fetchOutstandingOrders();
    fetchStock();
  }, [fetchOutstandingOrders, fetchStock]);
  
  // Establish WebSocket connection 
  useWebSocket(fetchOutstandingOrders);

  // Handle the end-of-day button click
  const handleEndOfDayButton = async () => {
    try {
      const response = await axios.post("http://localhost:8080/Manager/endOfDay");
      setEndOfDayOpen(false);
      fetchOutstandingOrders(); 
    }catch(err){
      setError(err.message);
    }
  };

  return (
    <Box sx={{ padding: 3, color: "white", minHeight: "100vh" }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", marginBottom: 5 }}>
        Welcome, Manager!
      </Typography>

      {/* Navigation buttons */}
      <ManagerNavButton setEndOfDayOpen={setEndOfDayOpen}></ManagerNavButton>

      {/* Tabs for Outstanding Orders and Stock Status */}
      <OrdersAndStockTabs tabIndex={tabIndex} setTabIndex={setTabIndex}></OrdersAndStockTabs>

      {/* Outstanding Orders Table */}
      {tabIndex === 0 && (
        <OutstandingOrdersTable orders={orders} totalSales={totalSales}></OutstandingOrdersTable>
      )}

      {/* Stock Status Table */}
      {tabIndex === 1 && (
        <StockStatusTable stock={stock}></StockStatusTable>
      )}

      {/* Error Snackbar */}
      {error && (
        <ErrorBar error={error} setError={setError}></ErrorBar>
      )}
      
      {/* End-of-Day Modal */}
      <NewOrderModal
        open={endOfDayOpen}
        onClose={() => setEndOfDayOpen(false)}
        onConfirm={handleEndOfDayButton}
        title="End Of Business Day"
        content="Do you want to end the day? This will clear all orders."
        confirmButtonText="End Day"
        cancelButtonText="Cancel"
      />
    </Box>
  );
}

export default Manager;
