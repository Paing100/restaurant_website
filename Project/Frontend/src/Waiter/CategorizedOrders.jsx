import { Grid, List, Typography } from "@mui/material";
import Orders from "../Orders";
import PropTypes from "prop-types";

function CategorizedOrders({ filteredOrders, selectedTab, categories, fetchOrders, handleAlertOthers, handleUpdateOrderStatus, setOrderStatus}) {
  return(
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {filteredOrders.length > 0 ? (
            <List>
              {filteredOrders.map((order) => (
                <Orders
                  key={order.orderId}
                  order={order}
                  buttonName={
                    selectedTab === 0
                      ? "Confirm Order"
                      : selectedTab === 1
                        ? "Deliver"
                        : selectedTab === 2
                          ? order.isPaid
                            ? "Paid"
                            : "Unpaid"
                          : ""
                  }
                  buttonStyle={
                    selectedTab === 2
                      ? {
                        backgroundColor: order.isPaid ? "#2e7d32" : "#d32f2f",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "default",
                        textTransform: "uppercase",
                        pointerEvents: "none",
                      }
                      : {
                        backgroundColor: "#2e7d32",
                      }
                  }
                  onButtonClick={() => {
                    if (selectedTab === 2) return; // do nothing for "Delivered" tab
                    const newStatus =
                      selectedTab === 0
                        ? "CONFIRMED"
                        : selectedTab === 1
                          ? "DELIVERED"
                          : "";
                    handleUpdateOrderStatus(order.orderId, newStatus);
                    setOrderStatus({
                      orderId: order.orderId,
                      orderStatus: order.orderStatus,
                    });
                  }}

                  fetchOrders={fetchOrders}
                  alertButton={handleAlertOthers}
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
  );
}

CategorizedOrders.propTypes={
  filteredOrders: PropTypes.array.isRequired,
  selectedTab: PropTypes.number.isRequired,
  categories: PropTypes.array.isRequired,
  fetchOrders: PropTypes.func.isRequired,
  handleAlertOthers: PropTypes.func.isRequired,
  handleUpdateOrderStatus: PropTypes.func.isRequired,
  setOrderStatus: PropTypes.func.isRequired
}

export default CategorizedOrders; 