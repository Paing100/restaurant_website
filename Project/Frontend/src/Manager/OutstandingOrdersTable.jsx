import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import PropTypes from 'prop-types';

function OutstandingOrdersTable({orders, totalSales}) {
  return (
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
  )
}

OutstandingOrdersTable.propTypes = {
  orders: PropTypes.array.isRequired,
  totalSales: PropTypes.number.isRequired,
};

export default OutstandingOrdersTable;