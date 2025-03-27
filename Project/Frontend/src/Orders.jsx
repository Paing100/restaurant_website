import { useState, useEffect } from "react";
import { Typography, ListItem, ListItemText, Button } from "@mui/material";
import PropTypes from "prop-types";

function Orders({ order, buttonName, onButtonClick, fetchOrders, buttonStyle, alertButton, forKitchen = false  }) {
  const [elapsedTime, setElapsedTime] = useState("");

  // Update timer every second
  useEffect(() => {
    // Only set up timer if order is not DELIVERED
    if (order.orderStatus !== "DELIVERED") {
      const updateTimer = () => {
        const now = new Date();
        const orderTime = new Date(order.orderPlaced);
        const diffInSeconds = Math.floor((now - orderTime) / 1000);
        
        const minutes = Math.floor(diffInSeconds / 60);
        const seconds = diffInSeconds % 60;
        
        setElapsedTime(`${minutes} min ${seconds} sec`);
      };


      updateTimer();
      
      // Set up interval to update every second
      const timerId = setInterval(updateTimer, 1000);
      

      return () => clearInterval(timerId);
    }
  }, [order.orderPlaced, order.orderStatus]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", { 
      year: "numeric", month: "long", day: "numeric", 
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  };

  const handleCancelOrder = async(orderId) => {
      const response = await fetch(`http://localhost:8080/api/order/${orderId}/cancelOrder`,{
        method: "DELETE", 
        headers: {"Content-Type":"application/json"}
      });
      if (response.ok){
        console.log("Order deleted successfully");
        fetchOrders();
      }
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

Orders.propTypes = {
  order: PropTypes.object.isRequired, 
  buttonName: PropTypes.string.isRequired, 
  onButtonClick: PropTypes.func.isRequired,
  fetchOrders: PropTypes.func.isRequired,
  buttonStyle: PropTypes.object.isRequired,
  alertButton: PropTypes.func,
  forKitchen: PropTypes.bool,
}

export default Orders;