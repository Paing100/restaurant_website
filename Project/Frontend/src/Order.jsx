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
                                    backgroundColor:
                                        orderStatus === 'SUBMITTED' ? 'orange' :
                                            orderStatus === 'CONFIRMED' ? 'yellow' :
                                                orderStatus === 'READY' ? 'green' : 'red',
                                    border: '2px solid white',
                                    boxShadow:
                                        orderStatus === 'SUBMITTED' ? '0 0 10px orange, 0 0 20px orange, 0 0 30px orange' :
                                            orderStatus === 'CONFIRMED' ? '0 0 10px yellow, 0 0 20px yellow, 0 0 30px yellow' :
                                                orderStatus === 'READY' ? '0 0 10px green, 0 0 20px green, 0 0 30px green' :
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
        const savedOrderTime = savedOrderInfo ? JSON.parse(savedOrderInfo).orderTime : null;
        return savedOrderTime ? new Date(savedOrderTime) : null;
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
    const [hasCreatedOrder, setHasCreatedOrder] = useState(false);
    const timerRef = useRef(null);
    const ws = useRef(null);

    const orderedItems = cart?.orderedItems || {};

    useEffect(() => {
        if (!ws.current) {
            ws.current = new WebSocket("ws://localhost:8080/ws/notifications")

            ws.current.onopen = () => {
                console.log('WebSocket connected');
            };

            ws.current.onclose = () => {
                console.log('WebSocket closed. Attempting to reconnect...');
            };
            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("DATA: " + data)
                    //if (data.orderId && customer?.orderId && data.orderId === customer.orderId) {
                    updateOrderStatus(data.orderId, data.status);
                    fetchOrderStatus(data.orderId);
                    if (receipt.length === 0) {
                        setElapsedTime('00:00:00');
                    }
                    //}
                    if (data.type === "ORDER_CANCELLED") {
                        removeOrderItem(data.orderId);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
        }

        return () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                console.log("Closing WebSocket on cleanup");
                ws.current.close();
            }
        };
    }, []);

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setOrderTime(null);
            setElapsedTime('00:00:00');
            console.log("Timer stopped.");
        }
    };

    const alertOthers = async (tableNumber, orderId) => {
        const alertMessage = {
        // Define the userName variable
          type: "ALERT",
          orderId: orderId,
          recipient: "waiter",
          message: `Table ${tableNumber} needs assistance`,
          userName: sessionStorage.getItem("userName")
        };
        console.log("MESSAGE: " + JSON.stringify(alertMessage));
        try {
          const sendAlert = await fetch('http://localhost:8080/api/notification/send', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alertMessage),
          });
      
          if (!sendAlert.ok) {
            throw new Error("Failed to send an alert");
          }
          console.log("Alert sent via server");
          setMessage(`Assistance requested! A waiter will be with you shortly.`,);
          setOpen(true);
        } catch (error) {
          console.error("Error from alert: " + error);
        }
      };

    const restartTimer = () => {
        stopTimer();
        const now = new Date();
        setOrderTime(now);
        console.log("Timer restarted.");
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setReceipt((prevReceipt) => {
            // Find and update the status of the specific order
            const updatedReceipt = prevReceipt.map((order) =>
                order.orderId === orderId ? { ...order, status: newStatus } : order
            );

            return updatedReceipt;
        });
    };

    // remove the order based on its id 
    const removeOrderItem = (orderId) => {
        console.log("Removing item from order: ", orderId);
        setReceipt((prevReceipt) => {
            const updatedReceipt = prevReceipt.filter((item) => item.orderId !== orderId);

            if (prevReceipt.length > 0 && prevReceipt[prevReceipt.length - 1].orderId === orderId) {
                if (updatedReceipt.length === 0) {
                    stopTimer();
                    setOrderTime(null);
                } else {
                    setOrderStatus(updatedReceipt.status);
                    console.log("REMOVE: " + orderStatus);
                }
            }
            const updatedTotal = updatedReceipt.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );
            setReceiptTotal(updatedTotal);
            console.log("Updated RECEIPT:", JSON.stringify(updatedReceipt));
            setMessage(`Your Order #${orderId} is cancelled by the waiter!`);
            setSeverity('error');
            setOpen(true);
            return updatedReceipt;
        });
    };

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
        } else {
            setElapsedTime('00:00:00');
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

    useEffect(() => {
        const checkOrderStatus = async () => {
            if (customer?.orderId) {
                try {
                    const response = await fetch(`http://localhost:8080/api/orders/${customer.orderId}/getOrder`, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' },
                    });

                    if (response.ok) {
                        const orderData = await response.json();
                        setHasCreatedOrder(orderData.orderStatus === 'CREATED');
                    }
                } catch (error) {
                    console.error('Error checking order status:', error);
                }
            }
        };

        checkOrderStatus();
    }, [customer]);

    const decreaseItemQuantity = (itemId) => {
        removeItemFromCart(itemId, false);
    };

    const increaseItemQuantity = (itemId) => {
        addItemToCart(itemId, 1);
    };

    const handlePaymentSuccess = async () => {
        const result = await submitOrder();
        if (result.success) {
            // create a new order object 
            const newOrder = {
                orderId: customer?.orderId,
                receipt: Object.entries(orderedItems).map(([itemName, item]) => ({ itemName, ...item })),
                receiptTotal: cart.totalPrice,
                orderTime: new Date().toISOString(),
                tableNum: tableNum,
                status: 'SUBMITTED',
            };
            setOrderCount(orderCount => orderCount + 1);
            setOrderStatus('SUBMITTED');
            setShowOrderInfo(true);
            setMessage(result.message);
            setSeverity('success');
            // Append the new order to the receipt array
            setReceipt((prevReceipt) => [...prevReceipt, newOrder]);
            setReceiptTotal(cart.totalPrice);
            setOrderTime(new Date());
            setHasCreatedOrder(false);

            const orderInfo = {
                show: true,
                expanded: false,
                status: 'SUBMITTED',
                receipt: [...receipt, newOrder], // append the new order to the receipt array
                total: cart.totalPrice,
                orderTime: new Date().toISOString(),
                tableNum: tableNum
            };
            localStorage.setItem('orderInfo', JSON.stringify(orderInfo));
            setStoredTableNum(tableNum);

            await fetchCart();
            setCart({ ...cart, orderedItems: [], totalPrice: 0 });

            const customerNullOrderID = {
                ...customer,
                orderId: 0,
                tableNum: customer.tableNum || tableNum
            };

            setCustomer(customerNullOrderID);
            localStorage.setItem('tableNum', customer.tableNum || tableNum);
            console.log("RECEIPT: " + JSON.stringify(receipt));
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

    const fetchOrderStatus = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}/getOrder`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            });
            if (response.ok) {
                const orderData = await response.json();
                updateOrderStatus(orderData.orderId, orderData.orderStatus);
                setOrderStatus(orderData.orderStatus);
                if (orderData.orderStatus === 'DELIVERED') {
                    stopTimer();
                    setOrderTime(null);
                }
                console.log("NEW STATUS: ", orderData.orderStatus);
            }
            else {
                console.error("Failed to fetch order status");
            }
        }
        catch (error) {
            console.error("Failed to fetch order status", error);
        }
    }

    return (
        <Box sx={{ padding: 3, paddingBottom: showOrderInfo ? 8 : 3 }}>
            <Button
                onClick={() => window.history.back()}
                sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' }, marginBottom: 2 }}
            >
                ← Back
            </Button>

            <Button
                        onClick={() => alertOthers(tableNum, customer.orderId)}
                        variant="contained"
                        sx={{ backgroundColor: '#5762d5', color: 'white', '&:hover': { backgroundColor: '#4751b3' }, display: 'block', marginLeft: 'auto', marginTop: 2}}
                    >
                        Call Assistance
                    </Button>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
                <Typography variant="h4">Place Your Order</Typography>
                {!hasCreatedOrder && (
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
            {receipt.length > 0 && (
                <OrderInfoPopup
                    showOrderInfo={showOrderInfo}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    customer={customer}
                    tableNum={tableNum || storedTableNum}
                    elapsedTime={elapsedTime}
                    orderStatus={receipt[receipt.length - 1]?.status}
                    receipt={receipt.length > 0 && receipt[receipt.length - 1]?.receipt ? receipt[receipt.length - 1].receipt : []}
                    receiptTotal={receipt.length > 0 && receipt[receipt.length - 1]?.receiptTotal ? receipt[receipt.length - 1].receiptTotal : 0} // always show the latest receipt total otherwise 0
                />
            )}
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
                title="Create New Order?"
                content="Would you like to create a new order to add more items?"
                confirmButtonText="Yes, Create New Order"
                cancelButtonText="No, Go Back"
            />
        </Box>
    );
}

export default Order;
