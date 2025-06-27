import PropTypes from 'prop-types';
import { Box, Typography, List, ListItem, ListItemText, Divider, Grid, Paper, CardMedia } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CancelOrder from './CancelOrder.jsx'; 

function OrderList({orders, expandedOrderId, setExpandedOrderId, fetchOrders}) {

    // Format the order time into a readable string 
    const formatTime = (orderPlaced) => {
        if (!orderPlaced) return 'N/A';
        const date = new Date(orderPlaced);
        return date.toLocaleString();
    };

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
                    >
                        <Box 
                            onClick={() => {
                                    if (!expandedOrderId.includes(order.orderId)) {
                                        setExpandedOrderId(prevOrderId => [...prevOrderId, order.orderId])
                                    }    
                                    else{ 
                                        setExpandedOrderId(prevOrderId => prevOrderId.filter(orderId => orderId !== order.orderId));
                                    }
                                }
                            }
                        >
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
                                                            order.orderStatus === 'READY' ? 'green' : 
                                                                order.orderStatus === 'CANCELLED' ? 'purple' : 'red',

                                                border: '2px solid white',
                                                marginRight: 2,
                                                boxShadow: order.orderStatus === 'SUBMITTED' ? '0 0 10px orange, 0 0 20px orange, 0 0 30px orange' :
                                                    order.orderStatus === 'CONFIRMED' ? '0 0 10px yellow, 0 0 20px yellow, 0 0 30px blue' :
                                                        order.orderStatus === 'READY' ? '0 0 10px green, 0 0 20px green, 0 0 30px green' :
                                                            order.orderStatus === "CANCELLED" ? '0 0 10px purple, 0 0 20px purple, 0 0 30px purple':
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
                                    {
                                        expandedOrderId.includes(order.orderId) ? <ExpandMoreIcon/> : <ExpandLessIcon/>
                                    }
                                </Grid>
                            </Grid>
                        </Box>

                        {/*Expanded order details*/}
                        {expandedOrderId.includes(order.orderId) && (
                            <Box sx={{ mt: 2, overflowY: 'auto', maxHeight: '80vh', cursor:'default' }}>
                                <Typography variant="h6" sx={{ mb: 2, borderBottom: '1px solid #555', pb: 1 }}>
                                    Order Details
                                </Typography>
                                <List>
                                    {order.orderMenuItems.map((item) => (
                                        <ListItem
                                            key={item.orderMenuItemsId.itemId} 
                                            sx={{ py: 1, "&:hover": {background: 'rgba(128, 128, 128, 0.3)'}, transition: 'background-color 0.3s ease'}}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="50"
                                                image={item.menuItem.imagePath}
                                                sx={{ marginRight: 2, width: 50, borderRadius: "25%" }}
                                            />
                                            <ListItemText
                                                primary={item.menuItem.name}
                                                secondary={
                                                    <Typography variant="body2" sx={{ color: '#aaa' }}>
                                                        {item.quantity} x £{item.menuItem.price.toFixed(2)}
                                                    </Typography>
                                                }
                                            />
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Box>{item.comment}</Box>
                                                <Typography variant="body2">
                                                    £{(item.quantity * item.menuItem.price).toFixed(2)}
                                                </Typography>
                                            </Box>
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
                                { order.orderStatus === "SUBMITTED" && (
                                <CancelOrder 
                                    orderId={order.orderId}
                                    fetchOrders={fetchOrders}
                                />
                                )}
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
  expandedOrderId: PropTypes.arrayOf(PropTypes.number).isRequired,
  setExpandedOrderId: PropTypes.func.isRequired,
  fetchOrders: PropTypes.func.isRequired,
}

export default OrderList;