/* eslint-disable */
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Typography, List, ListItem, ListItemText, Divider, Grid, Box, CardMedia, Snackbar, Alert, IconButton, Paper, Slide } from '@mui/material';
import { CartContext } from './CartContext';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from "prop-types";
import PaymentModal from './PaymentModal';
import NewOrderModal from './NewOrderModal';

import { Link } from 'react-router-dom';

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
                                    backgroundColor: orderStatus === 'In Progress' ? 'green' : 'red',
                                    border: '2px solid white',
                                    boxShadow: orderStatus === 'In Progress' ? '0 0 10px green, 0 0 20px green, 0 0 30px green' : '0 0 10px red, 0 0 20px red, 0 0 30px red',
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
                    {receipt.map((item) => (
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

function Order() {
    const { cart, fetchCart, removeItemFromCart, clearCart, customer, addItemToCart, submitOrder, createNewOrder, tableNum, setCart, setCustomer } = useContext(CartContext);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [showOrderInfo, setShowOrderInfo] = useState(() => {
        const savedOrderInfo = localStorage.getItem('orderInfo');
        return savedOrderInfo ? JSON.parse(savedOrderInfo).show : false;
    });
    const [expanded, setExpanded] = useState(() => {
        const savedOrderInfo = localStorage.getItem('orderInfo');
        return savedOrderInfo ? JSON.parse(savedOrderInfo).expanded : false;
    });
    const [orderStatus, setOrderStatus] = useState(() => {
        const savedOrderInfo = localStorage.getItem('orderInfo');
        return savedOrderInfo ? JSON.parse(savedOrderInfo).status : 'PENDING';
    });
    const [receipt, setReceipt] = useState(() => {
        const savedOrderInfo = localStorage.getItem('orderInfo');
        return savedOrderInfo ? JSON.parse(savedOrderInfo).receipt : [];
    });
    const [receiptTotal, setReceiptTotal] = useState(() => {
        const savedOrderInfo = localStorage.getItem('orderInfo');
        return savedOrderInfo ? JSON.parse(savedOrderInfo).total : 0;
    });
    const [orderTime, setOrderTime] = useState(() => {
        const savedOrderInfo = localStorage.getItem('orderInfo');
        return savedOrderInfo ? new Date(JSON.parse(savedOrderInfo).orderTime) : null;
    });
    const [storedTableNum, setStoredTableNum] = useState(() => {
        const savedOrderInfo = localStorage.getItem('orderInfo');
        return savedOrderInfo ? JSON.parse(savedOrderInfo).tableNum : null;
    });
    const [open, setOpen] = useState(false);
    const [elapsedTime, setElapsedTime] = useState('00:00:00');
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [orderCount, setOrderCount] = useState(() => {
        const savedOrderCount = localStorage.getItem('orderCount');
        return savedOrderCount ? parseInt(savedOrderCount, 10) : 0;
    });
    const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
    const timerRef = useRef(null);

    const orderedItems = cart?.orderedItems || {};

    useEffect(() => {
        if (orderTime) {
            timerRef.current = setInterval(() => {
                const now = new Date();
                const diff = now - orderTime;
                const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
                const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
                setElapsedTime(`${hours}:${minutes}:${seconds}`);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [orderTime]);

    useEffect(() => {
        const orderInfo = {
            show: showOrderInfo,
            expanded: expanded,
            status: orderStatus,
            receipt: receipt,
            total: receiptTotal,
            orderTime: orderTime ? orderTime.toISOString() : null,
            tableNum: tableNum || storedTableNum
        };
        localStorage.setItem('orderInfo', JSON.stringify(orderInfo));
    }, [showOrderInfo, expanded, orderStatus, receipt, receiptTotal, orderTime, tableNum, storedTableNum]);

    const decreaseItemQuantity = (itemId) => {
        removeItemFromCart(itemId, false);
    };

    const increaseItemQuantity = (itemId) => {
        addItemToCart(itemId, 1);
    };

    const handlePaymentSuccess = async () => {
        // Now submit the order
        const result = await submitOrder();
        if (result.success) {
            setOrderCount(orderCount => orderCount + 1);
            setOrderStatus('In Progress');
            setShowOrderInfo(true);
            setMessage(result.message);
            setSeverity('success');
            setReceipt(Object.entries(orderedItems).map(([itemName, item]) => ({ itemName, ...item })));
            setReceiptTotal(cart.totalPrice);
            setOrderTime(new Date());

            const orderInfo = {
                show: true,
                expanded: false,
                status: 'In Progress',
                receipt: Object.entries(orderedItems).map(([itemName, item]) => ({ itemName, ...item })),
                total: cart.totalPrice,
                orderTime: new Date().toISOString(),
                tableNum: tableNum
            };
            localStorage.setItem('orderInfo', JSON.stringify(orderInfo));
            setStoredTableNum(tableNum);

            await fetchCart();
            setCart({ ...cart, orderedItems: [], totalPrice: 0 });

            console.log("Cart cleared after order submission.");
        } else {
            setMessage(result.message);
            setSeverity('error');
        }
        setOpen(true);
    };

    const handleNewOrderConfirm = async () => {
        const result = await createNewOrder();
        if (result.success) {
            setMessage(result.message);
            setSeverity('success');
            setNewOrderModalOpen(false);
        } else {
            setMessage(result.message);
            setSeverity('error');
        }
        setOpen(true);
    };

    const handleSubmit = () => {
        if (!orderedItems || Object.keys(orderedItems).length === 0) {
            console.error("Error: Cart is empty. Cannot submit order.");
            setMessage("Error: Cart is empty. Cannot submit order.");
            setSeverity('error');
            setOpen(true);
            return;
        }

        setPaymentModalOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Box sx={{ padding: 3, paddingBottom: showOrderInfo ? 8 : 3 }}>
            <Button
                onClick={() => window.history.back()}
                sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' }, marginBottom: 2 }}
            >
                ← Back
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
                <Typography variant="h4">Place Your Order</Typography>
                {orderCount > 0 && cart.orderedItems && Object.keys(cart.orderedItems).length === 0 && (
                    <Button
                        onClick={() => setNewOrderModalOpen(true)}
                        variant="contained"
                        sx={{ backgroundColor: '#5762d5', color: 'white', '&:hover': { backgroundColor: '#4751b3' } }}
                    >
                        New Order
                    </Button>
                )}
            </Box>
            <Typography variant="h5" sx={{ marginTop: 4, padding: '15px', borderBottom: '1px solid #333' }}>Ordered Items</Typography>
            <List>
                {Object.entries(orderedItems).map(([itemName, item]) => {
                    const itemTotal = item.price * item.quantity;
                    return (
                        <ListItem key={itemName} sx={{ borderBottom: '1px solid #333' }}>
                            <CardMedia
                                component="img"
                                height="50"
                                image={item.imagePath}
                                sx={{ marginRight: 2, width: 50, borderRadius: "25%" }}
                            />
                            <ListItemText
                                primary={itemName}
                                secondary={`£${item.price.toFixed(2)} each • Total: £${itemTotal.toFixed(2)}`}
                                sx={{ color: 'white' }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                                <IconButton
                                    onClick={() => decreaseItemQuantity(item.itemId)}
                                    sx={{ color: 'white' }}
                                >
                                    <RemoveIcon />
                                </IconButton>
                                <Typography sx={{ margin: '0 10px', color: 'white' }}>
                                    {item.quantity}
                                </Typography>
                                <IconButton
                                    onClick={() => increaseItemQuantity(item.itemId)}
                                    sx={{ color: 'white' }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Box>
                            <Button
                                onClick={() => removeItemFromCart(item.itemId, true)}
                                sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
                            >
                                Remove All
                            </Button>
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            <Typography variant="h6" sx={{ marginTop: 2 }}>Total Price: £{(cart.totalPrice || 0).toFixed(2)}</Typography>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={6}>
                    <Box sx={{}}>
                        <Button
                            onClick={() => clearCart()}
                            sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
                            fullWidth
                        >
                            Clear Cart
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ backgroundColor: '#5762d5', color: 'white', '&:hover': { backgroundColor: '#4751b3' } }}
                        fullWidth
                    >
                        Submit Order
                    </Button>
                </Grid>
            </Grid>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
            <OrderInfoPopup
                showOrderInfo={showOrderInfo}
                expanded={expanded}
                setExpanded={setExpanded}
                customer={customer}
                tableNum={tableNum || storedTableNum}
                elapsedTime={elapsedTime}
                orderStatus={orderStatus}
                receipt={receipt}
                receiptTotal={receiptTotal}
            />
            <PaymentModal
                open={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                totalPrice={cart.totalPrice}
                onPaymentSuccess={handlePaymentSuccess}
                orderId={customer?.orderId}
            />
            <NewOrderModal
                open={newOrderModalOpen}
                onClose={() => setNewOrderModalOpen(false)}
                onConfirm={handleNewOrderConfirm}
            />
        </Box>
    );
}

export default Order;
