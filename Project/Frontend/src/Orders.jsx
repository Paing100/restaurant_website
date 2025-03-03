import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography, List, ListItem, ListItemText, Box, Button, Tabs, Tab, Grid } from "@mui/material";

function Orders({order, buttonName, onButtonClick}) {

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", { 
      year: "numeric", month: "long", day: "numeric", 
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  };

  const formatElapsedTime = (orderPlaced) => {
    const now = new Date();
    const orderTime = new Date(orderPlaced);
    const diffInMinutes = Math.floor((now - orderTime) / 60000);  // Difference in minutes
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute(s) ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return `${hours} hour(s) and ${minutes} minute(s) ago`;
    }
  };

  return (
    <>
              <ListItem key={order.orderId} sx={{ borderBottom: "1px solid gray" }}>
                <ListItemText
                  primary={`Order #${order.orderId} - Table ${order.tableNum}`}
                  secondary={
                    <>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        Ordered At: {formatDate(order.orderPlaced)}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold", color: 'gray' }}>
                        Time in Progress: {formatElapsedTime(order.orderPlaced)}
                      </Typography>
                      {order.orderMenuItems.map(item => (
                        <Typography key={item.orderMenuItemsId.itemId} variant="body2">
                          {item.menuItem.name} x{item.quantity} (£{(item.menuItem.price * item.quantity).toFixed(2)})
                        </Typography>
                      ))}
                    </>
                  }
                />
                <Button variant="contained" color="success" onClick={() => onButtonClick(order.orderId)}>
                  {buttonName}
                </Button>
              </ListItem>
    </>
  )
}

export default Orders; 

