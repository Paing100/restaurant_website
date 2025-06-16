import PropTypes from 'prop-types';
import { Box, Typography, List, ListItem, ListItemText, Divider, Grid, Paper } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function OrderList({orders, expandedOrderId, setExpandedOrderId, formatTime}) {
  return (
      <>
              <List>
                {orders.map((order) => (
                    <Paper
                        key={order.orderId} // unique key for each order
                        sx={{
                            backgroundColor: '#333',
                            color: 'white',
                            marginBottom: 2,
                            padding: 2,
                            cursor: 'pointer'
                        }}
                        onClick={() => setExpandedOrderId(expandedOrderId === order.orderId ? null : order.orderId)}
                    >
                        <Box>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        Order #{order.orderId}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        Table {order.tableNum}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        {formatTime(order.orderPlaced)}
                                    </Typography>
                                </Grid>

                                {/* Order status with color-coded indicator */}
                                <Grid item xs={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                backgroundColor:
                                                    order.orderStatus === 'SUBMITTED' ? 'orange' :
                                                        order.orderStatus === 'CONFIRMED' ? 'yellow' :
                                                            order.orderStatus === 'READY' ? 'green' : 'red',
                                                border: '2px solid white',
                                                marginRight: 2,
                                                boxShadow: order.orderStatus === 'SUBMITTED' ? '0 0 10px orange, 0 0 20px orange, 0 0 30px orange' :
                                                    order.orderStatus === 'CONFIRMED' ? '0 0 10px yellow, 0 0 20px yellow, 0 0 30px blue' :
                                                        order.orderStatus === 'READY' ? '0 0 10px green, 0 0 20px green, 0 0 30px green' :
                                                            '0 0 10px red, 0 0 20px red, 0 0 30px red',
                                            }}
                                        />
                                        <Typography variant="body2">
                                            {order.orderStatus}
                                        </Typography>
                                    </Box>
                                </Grid>

                                {/*Expand/Collapse icon*/}
                                <Grid item xs={1}>
                                    {expandedOrderId === order.orderId ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                                </Grid>
                            </Grid>
                        </Box>

                        {/*Expanded order details*/}
                        {expandedOrderId === order.orderId && (
                            <Box sx={{ mt: 2, overflowY: 'auto', maxHeight: '80vh' }}>
                                <Typography variant="h6" sx={{ mb: 2, borderBottom: '1px solid #555', pb: 1 }}>
                                    Order Details
                                </Typography>
                                <List>
                                    {order.orderMenuItems.map((item) => (
                                        <ListItem key={item.orderMenuItemsId.itemId} sx={{ py: 1 }}>
                                            <ListItemText
                                                primary={item.menuItem.name}
                                                secondary={
                                                    <Typography variant="body2" sx={{ color: '#aaa' }}>
                                                        {item.quantity} x £{item.menuItem.price.toFixed(2)}
                                                    </Typography>
                                                }
                                            />
                                            <Typography variant="body2">
                                                £{(item.quantity * item.menuItem.price).toFixed(2)}
                                            </Typography>
                                        </ListItem>
                                    ))}
                                </List>
                                <Divider sx={{ my: 2, backgroundColor: '#555' }} />
                                <Grid container spacing={2} sx={{ px: 2 }}>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">Total</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                        <Typography variant="body1">
                                            £{order.orderMenuItems.reduce((total, item) =>
                                                total + (item.quantity * item.menuItem.price), 0).toFixed(2)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Paper>
                ))}
            </List>
      </>
  );
}

OrderList.propTypes = {
  orders: PropTypes.array.isRequired,
  expandedOrderId: PropTypes.number.isRequired,
  setExpandedOrderId: PropTypes.func.isRequired,
  formatTime:PropTypes.func.isRequired,
}

export default OrderList;