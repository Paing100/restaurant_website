import { Typography, List } from "@mui/material";
import Orders from "../Orders";
import PropTypes from "prop-types";

function ConfirmedOrders ({orders, markAsReady, fetchOrders}) {
  return (
      orders.length > 0 ? (
        <List>
          {orders.map((order) => (
            <Orders
              key={order.orderId}
              order={order}
              buttonName="Mark as Ready"
              onButtonClick={() => markAsReady(order.orderId)}
              fetchOrders={fetchOrders}
              buttonStyle={{
                backgroundColor: "#5762d5",
                color: "white",
                "&:hover": { backgroundColor: "#4751b3" },
              }}
              forKitchen={true}
            />
          ))}
        </List>
      ) : (
        <Typography variant="h6" sx={{ mt: 2, color: "gray" }}>
          No orders to mark as ready
        </Typography>
      )
  );
}

ConfirmedOrders.propTypes = {
  orders: PropTypes.array.isRequired,
  markAsReady: PropTypes.func.isRequired,
  fetchOrders: PropTypes.func.isRequired,
};

export default ConfirmedOrders;