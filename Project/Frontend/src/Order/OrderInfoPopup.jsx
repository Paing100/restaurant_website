import PropTypes from 'prop-types';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography, List, ListItem, ListItemText, Divider, Grid, Box, Paper, Slide } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';

// Popup component to display order information
const OrderInfoPopup = React.memo(({
    showOrderInfo,
    expanded,
    setExpanded,
    customer,
    tableNum,
    elapsedTime,
    orderStatus,
    receipt,
    receiptTotal
}) => (
    <Slide direction="up" in={showOrderInfo} mountOnEnter unmountOnExit>
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#333',
                color: 'white',
                padding: 2,
                zIndex: 1000,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                boxShadow: 3,
                maxHeight: expanded ? '80vh' : '64px',
                transition: 'max-height 0.3s ease-in-out',
                overflow: 'hidden'
            }}
        >
            {/* Header for the popup */}
            <Box sx={{ cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={2.5}>
                        <Typography variant="body2">
                            {customer?.name || 'N/A'}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="body2">
                            Table {tableNum || 'N/A'}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="body2">
                            {elapsedTime}
                        </Typography>
                    </Grid>
                    <Grid item xs={2.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    backgroundColor:
                                        orderStatus === 'SUBMITTED' ? 'orange' :
                                            orderStatus === 'CONFIRMED' ? 'yellow' :
                                                orderStatus === 'READY' ? 'green' : 
                                                    orderStatus === 'CANCELLED' ? 'purple' : 'red',
                                    border: '2px solid white',
                                    boxShadow:
                                        orderStatus === 'SUBMITTED' ? '0 0 10px orange, 0 0 20px orange, 0 0 30px orange' :
                                            orderStatus === 'CONFIRMED' ? '0 0 10px yellow, 0 0 20px yellow, 0 0 30px yellow' :
                                                orderStatus === 'READY' ? '0 0 10px green, 0 0 20px green, 0 0 30px green' : 
                                                    orderStatus === "CANCELLED" ? '0 0 10px purple, 0 0 20px purple, 0 0 30px purple':
                                                    '0 0 10px red, 0 0 20px red, 0 0 30px red',
                                    marginRight: 2, // Increased marginRight to add more space
                                }}
                            />
                            <Typography variant="body2">
                                {orderStatus}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        {expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    </Grid>
                </Grid>
            </Box>

            {/* Expanded Receipt View */}
            <Box sx={{
                mt: 2,
                display: expanded ? 'block' : 'none',
                overflowY: 'auto',
                maxHeight: 'calc(80vh - 64px)'
            }}>
                <Typography variant="h6" sx={{ mb: 2, borderBottom: '1px solid #555', pb: 1 }}>
                    Latest Order Receipt
                </Typography>
                <List>
                    {(receipt || []).map((item) => (
                        <ListItem key={item.itemName} sx={{ py: 1 }}>
                            <ListItemText
                                primary={item.itemName}
                                secondary={
                                    <Typography variant="body2" sx={{ color: '#aaa' }}>
                                        {item.quantity} x £{item.price.toFixed(2)}
                                    </Typography>
                                }
                            />
                            <Typography variant="body2">
                                £{(item.quantity * item.price).toFixed(2)}
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
                            £{receiptTotal.toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ textAlign: 'center', marginTop: 3 }}>
                <Link to="/allOrders" style={{ textDecoration: 'underline', color: '#5762d5' }}>
                    View All Orders
                </Link>
            </Box>
        </Paper>
    </Slide>
));
OrderInfoPopup.displayName = "OrderInfoPopup";
// PropTypes validation for `OrderInfoPopup`
OrderInfoPopup.propTypes = {
    showOrderInfo: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    setExpanded: PropTypes.func.isRequired,
    customer: PropTypes.shape({
        name: PropTypes.string
    }),
    tableNum: PropTypes.number,
    elapsedTime: PropTypes.string.isRequired,
    orderStatus: PropTypes.string.isRequired,
    receipt: PropTypes.arrayOf(
        PropTypes.shape({
            itemName: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
        })
    ),
    receiptTotal: PropTypes.number.isRequired,
}

export default OrderInfoPopup;