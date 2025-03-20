/* eslint-disable */
import { Typography, ListItem, ListItemText, Button } from "@mui/material";
import PropTypes from "prop-types";

function Orders({ order, buttonName, onButtonClick, fetchOrders, buttonStyle }) {

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

  const handleCancelOrder = async (orderId) => {
    const response = await fetch(`http://localhost:8080/api/order/${orderId}/cancelOrder`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    if (response.ok) {
      console.log("Order deleted successfully");
      fetchOrders();
    }
  }

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
        {
          buttonName === "Confirm Order" &&
          (
            <Button onClick={() => handleCancelOrder(order.orderId)}>
              Cancel
            </Button>
          )
        }
        {buttonName !== "No Button" &&
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
  fetchOrders: PropTypes.func.fetchOrders
}

export default Orders;

