import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography, List, Box, Button, Tabs, Tab, Grid } from "@mui/material";
import Orders from "./Orders";

function Waiter() {
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  const [orders, setOrders] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  // use orderId to trigger use Effect, but if the same order is clicked again for other purpose
  // use effect doesn't work anymore 
  const[orderStatus, setOrderStatus] = useState({orderId:"", orderStatus:""});

  const categories = ["To Confirm", "Ready To Deliver", "Delivered"];

  const statusMap = new Map([
    ["To Confirm", "SUBMITTED"],
    ["Ready To Deliver", "READY"],
    ["Delivered", "DELIVERED"]
  ]);

  // fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/order/getAllOrders");
      if (!response.ok) throw new Error("Error fetching orders");
      const data = await response.json();
      setOrders(data);
      } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // use effect for fetching all orders
  useEffect(() => {
    console.log("USE EFFECT RAN!");
    fetchOrders();
  }, [orderStatus]);

  // change the status an order 
  const updateOrderStatus = async (orderId, newStatus) => {
    const settings = {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"orderStatus": newStatus})
    }
    try {
      await fetch(`http://localhost:8080/api/order/${orderId}/updateOrderStatus`, settings);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  }

  const filteredOrders = orders.filter((order) => order.orderStatus === statusMap.get(categories[selectedTab]));

  return (
    <>
      <Box>
        <Typography variant="h3">Welcome {userName}!</Typography>
        <Typography variant="h4">{userRole} Dashboard</Typography>
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
                      selectedTab === 0 ? "Confirm Order" :
                      selectedTab === 1 ? "Deliver" : 
                      selectedTab === 2 ? "No Button" : 
                    ""}
                    onButtonClick={() => {
                      const newStatus = 
                        selectedTab === 0 ? "CONFIRMED" :
                        selectedTab === 1 ? "DELIVERED" : "";
                      updateOrderStatus(order.orderId, newStatus);
                      setOrderStatus({orderId: order.orderId, orderStatus: order.orderStatus});
                    }}
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
    </>

  );
}
  
export default Waiter;
