import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Typography, Box, Button, Snackbar, Alert, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import NewOrderModal from "./NewOrderModal";

function Manager() {
  const [orders, setOrders] = useState([]);
  const [stock, setStock] = useState("");
  const [error, setError] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const ws = useRef(null);
  const [endOfDayOpen, setEndOfDayOpen] = useState(false);

  useEffect(() => {
    fetchOutstandingOrders();
    fetchStock();
  }, []);

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket("ws://localhost:8080/ws/notifications");

      ws.current.onopen = () => {
        console.log("WebSocket connected", ws.current.readyState);
      };

      ws.current.onclose = () => {
        console.log("Websocket session is closed");
      };

      ws.current.onmessage = (event) => {
        console.log("MANAGER Event: " + event.data);
        fetchOutstandingOrders();
      };
    }

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [])

  const fetchOutstandingOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/Manager/getOutstandingOrders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    }
  };

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

  const handleEndOfDayButton = async() => {
    try {
      const response = await fetch("http://localhost:8080/Manager/endOfDay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) throw new Error("Failed to end the day");
      setEndOfDayOpen(false);
    }catch(err){
      setError(err.message);
    }
  }

  return (
    <Box sx={{ padding: 3, color: "white", backgroundColor: "black", minHeight: "100vh" }}>
      <Typography variant="h3">Welcome, Manager!</Typography>
      <Typography variant="h4">Manager Dashboard</Typography>

      <Box sx={{ marginBottom: 2 }}>
        <Link to="/waiter_menu">
          <Button variant="contained" sx={{ marginRight: 1 }}>Edit Menu</Button>
        </Link>
        <Link target="_blank" to="/calculatePrice">
          <Button variant="contained" sx={{ marginLeft: 1 }}>Calculate Price</Button>
        </Link>
        <Link to="/employeeData">
          <Button variant="contained" sx={{ marginLeft: 1 }}>Employee Data</Button>
        </Link>
        <Link to="/register">
          <Button variant="contained">Register Staff</Button>
        </Link>
        <Button
          variant="contained"
          sx={{ marginLeft: 1 }}
          onClick={() => setEndOfDayOpen(true)} // Open the modal
        >
          End Of Business Day
        </Button>
      </Box>

      <Tabs 
        value={tabIndex} 
        onChange={(event, newValue) => setTabIndex(newValue)} 
        variant="fullWidth" 
        sx={{ 
          "& .MuiTab-root": { 
            color: "white", 
            fontFamily: "'Roboto', sans-serif", 
            fontWeight: "bold" 
          }, 
          "& .Mui-selected": { 
            color: "white", 
            textDecoration: "underline" 
          } 
        }}
      >
        <Tab label="Outstanding Orders" />
        <Tab label="Stock Status" />
      </Tabs>

      {tabIndex === 0 && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h5">Outstanding Orders:</Typography>
          {orders.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="outstanding orders table">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Order Status</TableCell>
                    <TableCell>Table Number</TableCell>
                    <TableCell>Order Placed</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => {
                    const orderTotal = order.orderMenuItems.reduce(
                      (total, item) => total + item.menuItem.price * item.quantity, 0
                    );
                    return (
                      <TableRow key={order.orderId}>
                        <TableCell>{order.orderId}</TableCell>
                        <TableCell>{order.orderStatus}</TableCell>
                        <TableCell>{order.tableNum}</TableCell>
                        <TableCell>{new Date(order.orderPlaced).toLocaleString()}</TableCell>
                        <TableCell>£{orderTotal.toFixed(2)}</TableCell>
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

      {tabIndex === 1 && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h5">Stock Status:</Typography>
          <Typography component="pre">{stock}</Typography>
        </Box>
      )}

      {error && (
        <Snackbar open autoHideDuration={6000} onClose={() => setError("")}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}

      <NewOrderModal 
        open={endOfDayOpen} 
        onClose={() => setEndOfDayOpen(false)} 
        onConfirm={handleEndOfDayButton} 
        title="End Of Business Day"
        content="Do you want to end the day? This will clear all orders"
        confirmButtonText="End Day"
        cancelButtonText="Cancel"
      />

    </Box>
  );
}

export default Manager;
