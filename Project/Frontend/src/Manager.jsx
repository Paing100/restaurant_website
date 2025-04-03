import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Typography, Box, Button, Snackbar, Alert, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import NewOrderModal from "./NewOrderModal";

// styling for button
const buttonStyle = {
  margin: "0 8px",
  fontWeight: "bold",
  textTransform: "none",
  backgroundColor: '#333',
  color: 'white',
  '&:hover': {
    backgroundColor: 'darkgray',
  },
};

function Manager() {
  // state variables 
  const [orders, setOrders] = useState([]); // stores outstanding orders
  const [stock, setStock] = useState(""); // stores stock data 
  const [error, setError] = useState(""); // stores error messages 
  const [tabIndex, setTabIndex] = useState(0); // tracks the active tab 
  const ws = useRef(null); // websocket reference 
  const [endOfDayOpen, setEndOfDayOpen] = useState(false); // controls the visibility of the end-of-day modal 
  const [totalSales, setTotalSales] = useState(0); // stores the total salses 

  // fetch outstanding orders and stock data when the component mounts 
  useEffect(() => {
    fetchOutstandingOrders();
    fetchStock();
  }, []);

  // Establish WebSocket connection 
  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket("ws://localhost:8080/ws/notifications");

      ws.current.onopen = () => console.log("WebSocket connected");
      ws.current.onclose = () => console.log("WebSocket session closed");

      // Refresh outstanding orders when a WebSocket message is received
      ws.current.onmessage = () => fetchOutstandingOrders();
    }

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, []);

  // Calculate total sales from the list of orders
  const calculateTotalSales = (orders) => {
    return orders.reduce((total, order) => {
      const orderTotal = order.orderMenuItems.reduce( 
        (sum, item) => sum + item.menuItem.price * item.quantity, 0);
      return total + orderTotal;
    }, 0);
  };

  // Fetch outstanding orders from the server
  const fetchOutstandingOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/Manager/getOutstandingOrders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
      setTotalSales(calculateTotalSales(data)); // Calculate and set total sales
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch stock data from the server
  const fetchStock = async () => {
    try {
      const response = await fetch("http://localhost:8080/Manager/showAllStock");
      if (!response.ok) throw new Error("Failed to fetch stock");
      const data = await response.text();
      setStock(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle the end-of-day button click
  const handleEndOfDayButton = async () => {
    try {
      const response = await fetch("http://localhost:8080/Manager/endOfDay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to end the day");
      setEndOfDayOpen(false);
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
      <Box sx={{ marginBottom: 2 }}>
        <Link to="/waiter_menu">
          <Button variant="contained" sx={buttonStyle}>Edit Menu</Button>
        </Link>
        <Link to="/calculatePrice">
          <Button variant="contained" sx={buttonStyle}>Calculate Price</Button>
        </Link>
        <Link to="/employeeData">
          <Button variant="contained" sx={buttonStyle}>Employee Data</Button>
        </Link>
        <Link to="/register">
          <Button variant="contained" sx={buttonStyle}>Register Staff</Button>
        </Link>
        <Button
          variant="contained"
          sx={buttonStyle}
          onClick={() => setEndOfDayOpen(true)}
        >
          End Of Business Day
        </Button>
      </Box>

      {/* Tabs for Outstanding Orders and Stock Status */}
      <Tabs
        value={tabIndex}
        onChange={(event, newValue) => setTabIndex(newValue)}
        variant="fullWidth"
        TabIndicatorProps={{ style: { backgroundColor: '#5762d5' } }}
        sx={{
          paddingTop: 2,
          paddingBottom: 2,
          "& .MuiTab-root": {
            color: "darkgray",
            fontWeight: "bold",
          },
          "& .Mui-selected": {
            color: "#5762d5",
            textDecoration: "none",
          },
          "& .MuiTab-root:hover": {
            backgroundColor: "transparent",
          },
          "& .MuiTab-root:focus": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Tab label="Outstanding Orders" />
        <Tab label="Stock Status" />
      </Tabs>

      {/* Outstanding Orders Tab */}
      {tabIndex === 0 && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Total Sales: £{totalSales.toFixed(2)}
          </Typography>
          <Typography variant="h5">Outstanding Orders:</Typography>
          {orders.length > 0 ? (
            <TableContainer component={Paper}>
              <Table
                sx={{
                  minWidth: 650,
                  backgroundColor: "#242424",
                  color: "transparent",
                }}
                aria-label="outstanding orders table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Order ID</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Order Status</TableCell>
                    <TableCell sx={{color: "white", fontWeight: "bold"}}>Waiter</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Table Number</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Order Placed</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => {
                    const orderTotal = order.orderMenuItems.reduce(
                      (total, item) => total + item.menuItem.price * item.quantity,
                      0
                    );
                    return (
                      <TableRow key={order.orderId}>
                        <TableCell sx={{ color: "white" }}>{order.orderId}</TableCell>
                        <TableCell sx={{ color: "white" }}>{order.orderStatus}</TableCell>
                        <TableCell sx={{ color: "white" }}>{order.waiter.employee.firstName}</TableCell>
                        <TableCell sx={{ color: "white" }}>{order.tableNum}</TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {new Date(order.orderPlaced).toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>£{orderTotal.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No outstanding orders.</Typography>
          )}
        </Box>
      )}

      {/* Stock Status Tab */}
      {tabIndex === 1 && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Stock Status:
          </Typography>
          {stock ? (
            <TableContainer component={Paper}>
              <Table
                sx={{
                  minWidth: 650,
                  backgroundColor: "#242424",
                  color: "white",
                }}
                aria-label="stock status table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Item</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stock.split("\n").map((line, index) => {
                    const [item, quantity] = line.split(":");
                    return (
                      <TableRow key={index}>
                        <TableCell sx={{ color: "white" }}>{item}</TableCell>
                        <TableCell sx={{ color: "white" }}>{quantity}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No stock data available.</Typography>
          )}
        </Box>
      )}

      {/* Error Snackbar */}
      {error && (
        <Snackbar open autoHideDuration={6000} onClose={() => setError("")}>
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        </Snackbar>
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
