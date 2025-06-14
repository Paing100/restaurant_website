import { useCallback, useContext, useState, useEffect, useRef } from 'react';
import { Typography, Box, Snackbar, Alert, TextField } from '@mui/material';
import { CartContext } from './CartContext/CartContextContext.jsx';
import PaymentModal from './PaymentModal';
import NewOrderModal from './NewOrderModal';
import { addItemToCart, replaceSuggestion, clearCart, removeItemFromCart, submitOrder, createNewOrder, fetchCart } from './CartContext/cartUtils';
import BackButton from './BackButton';
import OrderButtons from './Order/OrderButtons';
import ItemsInCart from './Order/ItemsInCart.jsx';
import WaiterSuggestions from './Order/WaiterSuggestions.jsx';
import ClearAndSubmit from './Order/ClearAndSubmit.jsx';
import { handleTableNumChange, buildNewOrder, createOrderInfo, createReceipt, orderInfoExisingOrder, assembleAlertMessage } from './Order/OrderUtils.jsx';
import axios from 'axios';
import useWebSocket from './useWebSocket.jsx';
import OrderInfoPopup from './Order/OrderInfoPopup.jsx';

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
    const [tableEditModalOpen, setTableEditModalOpen] = useState(false); // Controls table edit modal visibility
    const [newTableNum, setNewTableNum] = useState(''); // Tracks new table number input

    const orderedItems = cart?.orderedItems || {}; // Extract ordered items from the cart

    // function to stop the timer for customer 
    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setOrderTime(null);
            setElapsedTime('00:00:00');
        }
    },[]);

    // function to alert others 
    const alertOthers = async (tableNumber, orderId) => {
        try {
          await axios.post('http://localhost:8080/api/notification/send', assembleAlertMessage(orderId, tableNumber));
          setMessage(`Assistance requested! A waiter will be with you shortly.`,);
          setOpen(true);
        } catch (error) {
            console.error("Error from alert: " + error);
        }
    };

    // update the status of an order that accepts two arguments
    const updateOrderStatus = useCallback((orderId, newStatus) => {
    setReceipt((prevReceipt) =>
        prevReceipt.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
        )
    );
    }, []);


    // remove the order based on its id 
    const removeOrderItem = useCallback((orderId) => {
        setReceipt((prevReceipt) => {
            const updatedReceipt = prevReceipt.filter((item) => item.orderId !== orderId);

            if (prevReceipt.length > 0 && prevReceipt[prevReceipt.length - 1].orderId === orderId) {
                if (updatedReceipt.length === 0) {
                    stopTimer();
                    setOrderTime(null);
                } else {
                    setOrderStatus(updatedReceipt[updatedReceipt.length - 1]?.status || null); 
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

            return updatedReceipt; // Don't forget this return!
        });
    }, [stopTimer, setOrderTime, setOrderStatus, setReceiptTotal, setMessage, setSeverity, setOpen]);

    

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


    const checkExistingOrders = useCallback(async () => {
            if (customer?.customerId) {
                try {
                    const {data: orders} = await axios.get(`http://localhost:8080/api/customers/${customer.customerId}/orders`);

                        // Filter for submitted orders (status not CREATED)
                        const submittedOrders = orders.filter(order => order.orderStatus !== 'CREATED');
                        
                        if (submittedOrders.length > 0) {
                            const latestOrder = submittedOrders[submittedOrders.length - 1];

                            setReceipt(createReceipt(submittedOrders));

                            setShowOrderInfo(true);
                            setOrderStatus(latestOrder.orderStatus);

                            const latestNonDeliveredOrder = submittedOrders.reverse().find(order => order.orderStatus !== 'DELIVERED');
                            if (latestNonDeliveredOrder) {
                                setOrderTime(new Date(latestNonDeliveredOrder.orderPlaced));
                            }
                            
                            const orderInfo = orderInfoExisingOrder(latestOrder, receipt);
                            localStorage.setItem('orderInfo', JSON.stringify(orderInfo));
                        } else {
                            // No submitted orders, clear the status bar
                            setShowOrderInfo(false);
                            setReceipt([]);
                            localStorage.removeItem('orderInfo');
                        }
                    
                } catch (error) {
                    console.error('Error fetching customer orders:', error);
                }
            }
        },[customer?.customerId, receipt]);

    // Add new useEffect to check for existing orders
    useEffect(() => {
        checkExistingOrders();
    }, [checkExistingOrders]); // Only run when customerId changes

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
                const newOrder = await generateNewOrder(result);
                updateLocalStorage(newOrder);
            } else {
                setMessage(result.message);
                setSeverity('error');
            }
            setOpen(true);
        };
    
     const generateNewOrder = async (result) => {
                // create a new order object 
                const newOrder = buildNewOrder(customer, orderedItems, cart, tableNum);
                setOrderStatus('SUBMITTED');
                setShowOrderInfo(true);
                setMessage(result.message);
                setSeverity('success');
                // Append the new order to the receipt array
                setReceipt((prevReceipt) => [...prevReceipt, newOrder]);
                setReceiptTotal(cart.totalPrice);
                setOrderTime(new Date());
                setHasCreatedOrder(false);
                return newOrder;
        };
    
        // update local storage of the customer after the payment goes through
     const updateLocalStorage = async (newOrder) => {
                const orderInfo = createOrderInfo(newOrder, receipt, cart, tableNum);
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
    const fetchOrderStatus = useCallback(async (orderId) => {
        try {
            const {data: orderData} = await axios.get(`http://localhost:8080/api/orders/${orderId}/getOrder`);
                updateOrderStatus(orderData.orderId, orderData.orderStatus); // Update the order status
                setOrderStatus(orderData.orderStatus); // Set the new order status in state
                if (orderData.orderStatus === 'DELIVERED') {
                    stopTimer();
                    setOrderTime(null);
                }
        }
        catch (error) {
            console.error("Failed to fetch order status", error);
        }
    }, [updateOrderStatus, setOrderStatus, stopTimer, setOrderTime]);

    const changeTableNum = () => {
        handleTableNumChange({newTableNum, setMessage, setSeverity, setOpen, customer, setCustomer, setTableNum, setTableEditModalOpen, setNewTableNum});
    }

    // WebSocket setup for real-time updates
    const handleOnMessage = useCallback((event) => {
    try {
        const data = JSON.parse(event.data);
        updateOrderStatus(data.orderId, data.status);
        fetchOrderStatus(data.orderId);
        if (receipt.length === 0) {
            setElapsedTime('00:00:00'); 
        }
        if (data.type === "ORDER_CANCELLED") {
            removeOrderItem(data.orderId);
        }
    } catch (error) {
        console.log(error);
    }
    }, [updateOrderStatus, fetchOrderStatus, receipt.length, removeOrderItem, setElapsedTime]);

    const ws = useWebSocket(handleOnMessage);

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

            {/* Section for displaying waiter suggestions */}
            <WaiterSuggestions 
                suggestions={suggestions}
                customer={customer} 
                orderedItems={orderedItems}
            />

            {/* Section for displaying total price and options to clear cart or submit */}
            <ClearAndSubmit 
                clearCart={clearCart}
                setCart={setCart}
                handleSubmit={handleSubmit}
                customer={customer} 
                cart={cart}
            />

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
                onConfirm={changeTableNum}
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


