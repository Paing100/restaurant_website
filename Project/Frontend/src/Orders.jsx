import { useState, useEffect } from "react";
import { Typography, ListItem, ListItemText, Button } from "@mui/material";
import PropTypes from "prop-types";
import axios from 'axios';

function Orders({ order, buttonName, onButtonClick, fetchOrders, buttonStyle, alertButton, forKitchen = false, employeeId, setOrders  }) {
  const [elapsedTime, setElapsedTime] = useState("");

  // useEffect to update the elapsed time every second for orders that are not DELIVERED
  useEffect(() => {
   // Only start the timer if the order is still in progress
    if (order.orderStatus !== "DELIVERED") {
      const updateTimer = () => {
        const now = new Date();
        const orderTime = new Date(order.orderPlaced);
        const diffInSeconds = Math.floor((now - orderTime) / 1000);
        
        const minutes = Math.floor(diffInSeconds / 60);
        const seconds = diffInSeconds % 60;
        
        setElapsedTime(`${minutes} min ${seconds} sec`);
      };

       // Initial call to update timer immediately
      updateTimer();
      
      // Set an interval to update the timer every second
      const timerId = setInterval(updateTimer, 1000);
      
      // Cleanup function to clear the interval when the component unmounts or order status changes
      return () => clearInterval(timerId);
    }
  }, [order.orderPlaced, order.orderStatus]);

  // Function to format the order date into a readable format
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", { 
      year: "numeric", month: "long", day: "numeric", 
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  };
  
  // Function to handle order cancellation
  const handleCancelOrder = async(orderId) => {
      await axios.delete(`http://localhost:8080/api/order/${orderId}/cancelOrder`);
      fetchOrders(employeeId).then(setOrders).catch(console.error);
  }

  return (
    <>
      <ListItem key={order.orderId} sx={{ borderBottom: "1px solid gray" }}>
        {!forKitchen && (
          <Button variant="outlined" size="small" onClick={() => {alertButton(order.tableNum, order.orderId)}}>Alert Others</Button>
        )}
        <ListItemText
          primary={`Order #${order.orderId} - Table ${order.tableNum}`}
          secondary={
            <>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Ordered At: {formatDate(order.orderPlaced)}
              </Typography>
              
              {/* Only show timer if order is not DELIVERED */}
              {order.orderStatus !== "DELIVERED" && (
                <Typography variant="body2" sx={{ fontWeight: "bold", color: 'gray' }}>
                  Time in Progress: {elapsedTime}
                </Typography>
              )}
              
              {order.orderMenuItems.map(item => (
                <Typography key={item.orderMenuItemsId.itemId} variant="body2">
                  {item.menuItem.name} x{item.quantity} (£{(item.menuItem.price * item.quantity).toFixed(2)})
                  : {item.comment || ''} 
                </Typography>
              ))}
            </>
          }
        />
        {
          buttonName === "Confirm Order" && 
          (
            <Button onClick={() => handleCancelOrder(order.orderId)}>
              Cancel
            </Button>
          )
        }
        { buttonName !== "No Button" && 
          (
          <Button 
            variant="contained" 
            style={buttonStyle}
            onClick={() => onButtonClick(order.orderId)}
          >
            {buttonName}
          </Button>
          )
        }
      </ListItem>
    </>
  )
}
// Prop type validation to ensure correct usage of component
Orders.propTypes = {
  order: PropTypes.object.isRequired, 
  buttonName: PropTypes.string.isRequired, 
  onButtonClick: PropTypes.func.isRequired,
  fetchOrders: PropTypes.func.isRequired,
  buttonStyle: PropTypes.object.isRequired,
  alertButton: PropTypes.func,
  forKitchen: PropTypes.bool,
  employeeId: PropTypes.string.isRequired,
  setOrders: PropTypes.func.isReuqired, 
}

export default Orders;