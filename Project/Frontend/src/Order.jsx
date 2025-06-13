import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Typography, List, ListItem, ListItemText, Divider, Grid, Box, Snackbar, Alert, Paper, Slide, TextField } from '@mui/material';
import { CartContext } from './CartContext/CartContextContext.jsx';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from "prop-types";
import PaymentModal from './PaymentModal';
import NewOrderModal from './NewOrderModal';
import MenuCard from './MenuCard';
import { Link } from 'react-router-dom';
import { addItemToCart, replaceSuggestion, clearCart, removeItemFromCart, submitOrder, createNewOrder, fetchCart } from './CartContext/cartUtils';
import BackButton from './BackButton';
import OrderButtons from './Order/OrderButtons';
import ItemsInCart from './Order/ItemsInCart.jsx';

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

function Order() {
    // Context and state variables
    const { cart, menuItems, customer, tableNum, setCart, setCustomer, setTableNum, suggestions, setSuggestions } = useContext(CartContext);
    const [message, setMessage] = useState(''); // snackbar message
    const [severity, setSeverity] = useState('success'); // snackbar severity
    const [showOrderInfo, setShowOrderInfo] = useState(() => { // Controls order info popup visibility
        const savedOrderInfo = localStorage.getItem('orderInfo');
        return savedOrderInfo ? JSON.parse(savedOrderInfo).show : false;
    });
    const [expanded, setExpanded] = useState(() => { // Controls popup expansion
        const savedOrderInfo = localStorage.getItem('orderInfo');
        return savedOrderInfo ? JSON.parse(savedOrderInfo).expanded : false;
    });
    const [orderStatus, setOrderStatus] = useState(() => {  // Tracks order status
        const savedOrderInfo = localStorage.getItem('orderInfo');
        return savedOrderInfo ? JSON.parse(savedOrderInfo).status : 'PENDING';
    });
    const [receipt, setReceipt] = useState(() => { // Stores receipt details
        const savedOrderInfo = localStorage.getItem('orderInfo');
        return savedOrderInfo ? JSON.parse(savedOrderInfo).receipt : [];
    });
    const [receiptTotal, setReceiptTotal] = useState(() => { // Stores total receipt amount
        const savedOrderInfo = localStorage.getItem('orderInfo');
        return savedOrderInfo ? JSON.parse(savedOrderInfo).total : 0;
    });
    const [orderTime, setOrderTime] = useState(() => { // Tracks order time
        const savedOrderInfo = localStorage.getItem('orderInfo');
        const savedOrderTime = savedOrderInfo ? JSON.parse(savedOrderInfo).orderTime : null;
        return savedOrderTime ? new Date(savedOrderTime) : null;
    });
    const [storedTableNum, setStoredTableNum] = useState(() => { // Stores table number
        const savedOrderInfo = localStorage.getItem('orderInfo');
        return savedOrderInfo ? JSON.parse(savedOrderInfo).tableNum : null;
    });
    const [open, setOpen] = useState(false); // Controls Snackbar visibility
    const [elapsedTime, setElapsedTime] = useState('00:00:00'); // Tracks elapsed time
    const [paymentModalOpen, setPaymentModalOpen] = useState(false); // Controls payment modal visibility
    const [newOrderModalOpen, setNewOrderModalOpen] = useState(false); // Controls new order modal visibility
    const [hasCreatedOrder, setHasCreatedOrder] = useState(false); // Tracks if an order has been created
    const timerRef = useRef(null); // Timer reference for elapsed time
    const ws = useRef(null); // WebSocket reference 
    const [tableEditModalOpen, setTableEditModalOpen] = useState(false); // Controls table edit modal visibility
    const [newTableNum, setNewTableNum] = useState(''); // Tracks new table number input

    const orderedItems = cart?.orderedItems || {}; // Extract ordered items from the cart

    // WebSocket setup for real-time updates
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

    // function to stop the timer for customer 
    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setOrderTime(null);
            setElapsedTime('00:00:00');
        }
    };

    // function to alert others 
    const alertOthers = async (tableNumber, orderId) => {
        const alertMessage = {
            // Define the userName variable
            type: "ALERT",
            orderId: orderId,
            recipient: "waiter",
            message: `Table ${tableNumber} needs assistance`,
            userName: sessionStorage.getItem("userName")
        };

        try {
          const sendAlert = await fetch('http://localhost:8080/api/notification/send', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alertMessage),
          });
      
          if (!sendAlert.ok) {
            throw new Error("Failed to send an alert");
          }
          setMessage(`Assistance requested! A waiter will be with you shortly.`,);
          setOpen(true);
        } catch (error) {
            console.error("Error from alert: " + error);
        }
    };

    // update the status of an order that accepts two arguments
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
        setReceipt((prevReceipt) => {
            const updatedReceipt = prevReceipt.filter((item) => item.orderId !== orderId);

            if (prevReceipt.length > 0 && prevReceipt[prevReceipt.length - 1].orderId === orderId) {
                if (updatedReceipt.length === 0) {
                    stopTimer();
                    setOrderTime(null);
                } else {
                    setOrderStatus(updatedReceipt.status);
                }
            }
            const updatedTotal = updatedReceipt.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );
            setReceiptTotal(updatedTotal);
            setMessage(`Your Order #${orderId} is cancelled by the waiter!`);
            stopTimer();
            setSeverity('error');
            setOpen(true);
            return updatedReceipt;
        });
    };

    // Timer for elapsed time
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

    // Save order info to localStorage
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

    // Add new useEffect to check for existing orders
    useEffect(() => {
        const checkExistingOrders = async () => {
            if (customer?.customerId) {
                try {
                    const response = await fetch(`http://localhost:8080/api/customers/${customer.customerId}/orders`, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' },
                    });

                    if (response.ok) {
                        const orders = await response.json();
                        // Filter for submitted orders (status not CREATED)
                        const submittedOrders = orders.filter(order => order.orderStatus !== 'CREATED');
                        
                        if (submittedOrders.length > 0) {
                            const latestOrder = submittedOrders[submittedOrders.length - 1];

                            setReceipt(submittedOrders.map(order => ({
                                orderId: order.orderId,
                                receipt: order.orderMenuItems.map(item => ({
                                    itemName: item.menuItem.name,
                                    quantity: item.quantity,
                                    price: item.menuItem.price
                                })),
                                receiptTotal: order.orderMenuItems.reduce((total, item) => 
                                    total + (item.quantity * item.menuItem.price), 0),
                                orderTime: order.orderPlaced,
                                tableNum: order.tableNum,
                                status: order.orderStatus
                            })));

                            setShowOrderInfo(true);
                            setOrderStatus(latestOrder.orderStatus);

                            const latestNonDeliveredOrder = submittedOrders.reverse().find(order => order.orderStatus !== 'DELIVERED');
                            if (latestNonDeliveredOrder) {
                                setOrderTime(new Date(latestNonDeliveredOrder.orderPlaced));
                            }

                            const orderInfo = {
                                show: true,
                                expanded: false,
                                status: latestOrder.orderStatus,
                                receipt: receipt,
                                total: latestOrder.orderMenuItems.reduce((total, item) => 
                                    total + (item.quantity * item.menuItem.price), 0),
                                orderTime: latestOrder.orderPlaced,
                                tableNum: latestOrder.tableNum
                            };
                            localStorage.setItem('orderInfo', JSON.stringify(orderInfo));
                        } else {
                            // No submitted orders, clear the status bar
                            setShowOrderInfo(false);
                            setReceipt([]);
                            localStorage.removeItem('orderInfo');
                        }
                    }
                } catch (error) {
                    console.error('Error fetching customer orders:', error);
                }
            }
        };

        checkExistingOrders();
    }, [customer?.customerId]); // Only run when customerId changes

    // Function to decrease item quantity by removing it from the cart
    const decreaseItemQuantity = async (itemId) => {
        const result = await removeItemFromCart(customer, cart, itemId, false);
        if (result){
            fetchCart(customer).then(setCart);
        }
    };

    // Function to increase item quantity by adding it to the cart
    const increaseItemQuantity = (itemId) => {
        addItemToCartHandler(itemId);    
    };

    const addItemToCartHandler = (itemId) => {
        const updatedCart = addItemToCart(customer, itemId, 1, cart, suggestions); 
        if (suggestions && suggestions.some(item => item.itemId === itemId)) {
            const newSuggestions = replaceSuggestion(cart, menuItems, suggestions, itemId);
            setSuggestions(newSuggestions);
        }
        updatedCart.then(setCart);  
    }

    // Handles payment success by submitting the order and updating the UI and local storage
    const handlePaymentSuccess = async () => {
        const result = await submitOrder(customer, cart, ws, tableNum); // submit order and get result 
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

            await fetchCart(customer);
            setCart({ ...cart, orderedItems: [], totalPrice: 0 });

            const customerNullOrderID = {
                ...customer,
                orderId: 0,
                tableNum: customer.tableNum || tableNum
            };

            setCustomer(customerNullOrderID);
            localStorage.setItem('tableNum', customer.tableNum || tableNum);
        } else {
            setMessage(result.message);
            setSeverity('error');
        }
        setOpen(true);
    };

    // Function to handle confirming a new order
    const handleNewOrderConfirm = async () => {
        const result = await createNewOrder(customer, tableNum);
        if (result.success) {
            setCart({ orderedItems: {} }); // Clear the cart for the new order
            setCustomer(prevCustomer => ({
                    ...prevCustomer,
                    orderId: result.orderId
            }));
            setTableNum(tableNum);
            setMessage(result.message);
            setSeverity('success');
            setNewOrderModalOpen(false);
        } else {
            setMessage(result.message);
            setSeverity('error');
        }
        setOpen(true); 
    };

    // Function to handle order submission
    const handleSubmit = () => {
        if (!orderedItems || Object.keys(orderedItems).length === 0) { // check if the cart is empty 
            console.error("Error: Cart is empty. Cannot submit order.");
            setMessage("Error: Cart is empty. Cannot submit order.");
            setSeverity('error');
            setOpen(true);
            return;
        }

        setPaymentModalOpen(true); // Open the payment modal if the cart is not empty
    };

    // Function to handle closing the notification modal
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    // Fetches the current order status from the backend using orderId
    const fetchOrderStatus = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}/getOrder`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            });
            if (response.ok) {
                const orderData = await response.json(); // Parse order data from the response
                updateOrderStatus(orderData.orderId, orderData.orderStatus); // Update the order status
                setOrderStatus(orderData.orderStatus); // Set the new order status in state
                if (orderData.orderStatus === 'DELIVERED') {
                    stopTimer();
                    setOrderTime(null);
                }
            }
            else {
                console.error("Failed to fetch order status");
            }
        }
        catch (error) {
            console.error("Failed to fetch order status", error);
        }
    }

    // Function to handle table number change
    const handleTableNumChange = () => {
        // Validate table number
        const tableNumInt = parseInt(newTableNum, 10);
        if (!newTableNum || isNaN(tableNumInt) || tableNumInt <= 0 || tableNumInt > 40) {
            setMessage('Table number must be between 1 and 40');
            setSeverity('error');
            setOpen(true);
            return;
        }

        // Update customer table number in state and local storage
        const updatedCustomer = {
            ...customer,
            tableNum: tableNumInt // Set the updated table number
        };
        setCustomer(updatedCustomer); // update customer state 
        setTableNum(tableNumInt); // update table number state
        localStorage.setItem('tableNum', tableNumInt.toString()); // save the updated table number in local storage
        localStorage.setItem('customer', JSON.stringify(updatedCustomer)); // save updated customer data 
        setMessage('Table number updated successfully');
        setSeverity('success'); // set success serverity 
        setOpen(true); // open notification modal 
        setTableEditModalOpen(false); // close table number edit modal
        setNewTableNum(''); // reset table number input field 
    };

    return (
        <Box sx={{ padding: 3, paddingBottom: showOrderInfo ? 8 : 3 }}>
            {/* Back button */}
            <BackButton />

            {/* Section for displaying order buttons (includes Call Assistance, New Order, and Table Number) */}
            <OrderButtons 
                tableNum={tableNum}
                customer={customer}
                alertOthers={alertOthers}
                hasCreatedOrder={hasCreatedOrder}
                setNewOrderModalOpen={setNewOrderModalOpen}
                setNewTableNum={setNewTableNum}
                setTableEditModalOpen={setTableEditModalOpen}
            />
            
            {/* Section for displaying ordered items in cart*/}
            <ItemsInCart 
                orderedItems={orderedItems}
                decreaseItemQuantity={decreaseItemQuantity}
                increaseItemQuantity={increaseItemQuantity}
                removeItemFromCart={removeItemFromCart}
                customer={customer}
                cart={cart}
                fetchCart={fetchCart}
                setCart={setCart}
            />

            <Typography variant="h6" sx={{ marginTop: 2 }}>
                Total Price: £{(cart.totalPrice || 0).toFixed(2)}
            </Typography>
            {suggestions && suggestions.length > 0 && customer?.orderId > 0 && Object.keys(orderedItems).length > 0 && (
                <Box sx={{
                    mb: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <Typography variant="h5" sx={{
                        padding: '15px',
                        borderBottom: '1px solid #333',
                        textAlign: 'center',
                        width: '100%'
                    }}>
                        Waiter&apos;s Suggestions
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            overflowX: 'auto',
                            pt: 2,
                            pb: 2,
                            width: '100%',
                            justifyContent: 'center',
                            '&::-webkit-scrollbar': {
                                height: 8,
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#333',
                                borderRadius: 4,
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#5762d5',
                                borderRadius: 4,
                            },
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            px: 2,
                            maxWidth: '1400px',
                            margin: '0 auto'
                        }}>
                            {suggestions.map((item) => (
                                <Box key={item.itemId} sx={{ minWidth: 260, maxWidth: 260, flexShrink: 0 }}>
                                    <MenuCard item={item} isWaiterView={false} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Section for displaying total price and options to clear cart or submit */}
            <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button
                            onClick={() => clearCart(customer, cart).then(setCart)}
                            sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
                            fullWidth
                        >
                            Clear Cart
                        </Button>
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
            </Box>

            {/* Snackbar for displaying messages */}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>

            </Snackbar>

            {/* Modal to show order details */}
            {receipt.length > 0 && (
                <OrderInfoPopup
                    showOrderInfo={showOrderInfo}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    customer={customer}
                    tableNum={receipt[receipt.length - 1]?.tableNum}
                    elapsedTime={elapsedTime}
                    orderStatus={receipt[receipt.length - 1]?.status}
                    receipt={receipt.length > 0 && receipt[receipt.length - 1]?.receipt ? receipt[receipt.length - 1].receipt : []}
                    receiptTotal={receipt.length > 0 && receipt[receipt.length - 1]?.receiptTotal ? receipt[receipt.length - 1].receiptTotal : 0}
                />
            )}

            {/* Modal for handling payment */}
            <PaymentModal
                open={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                totalPrice={cart.totalPrice}
                onPaymentSuccess={handlePaymentSuccess}
                orderId={customer?.orderId}
            />

            {/* Modal for creating a new order */}
            <NewOrderModal
                open={newOrderModalOpen}
                onClose={() => setNewOrderModalOpen(false)}
                onConfirm={handleNewOrderConfirm}
                title="Create New Order?"
                content="Would you like to create a new order to add more items?"
                confirmButtonText="Yes, Create New Order"
                cancelButtonText="No, Go Back"
            />

            {/* Modal for editing table number */}
            <NewOrderModal
                open={tableEditModalOpen}
                onClose={() => {
                    setTableEditModalOpen(false);
                    setNewTableNum('');
                }}
                onConfirm={handleTableNumChange}
                title="Change Table Number"
                content={
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            autoFocus
                            fullWidth
                            label="New Table Number"
                            type="number"
                            value={newTableNum}
                            onChange={(e) => setNewTableNum(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'white',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                            }}
                        />
                    </Box>
                }
                confirmButtonText="Update Table Number"
                cancelButtonText="Cancel"
            />
        </Box>
    );
}

export default Order;


