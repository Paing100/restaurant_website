import { createContext, useEffect, useState } from 'react';
import PropTypes from "prop-types"
import useWebSocket from "./useWebSocket.jsx";
import {fetchCart, addItemToCart, fetchMenuItems, getRandomSuggestions} from "./CartContext/cartUtils.jsx";

// Create a context for the cart 
export const CartContext = createContext();

// CartProvider component to manage global cart state
export const CartProvider = ({ children }) => {

    // State variables 
    const [cart, setCart] = useState({ orderedItems: {}, totalPrice: 0 }); // stores cart items and total price 
    const [customer, setCustomer] = useState(null); // stores customer info 
    const [tableNum, setTableNum] = useState(''); // stores table no. 
    const [loading, setLoading] = useState(true); // indicates if the app is loading 
    const [menuItems, setMenuItems] = useState([]); // stores menu items 
    const [suggestions, setSuggestions] = useState([]); // stores suggested items 

    // Establish WebSocket connection
    const ws = useWebSocket();
    
    useEffect(() => {
        // Retrieve customer and tableNum from localStorage when the app loads
        const storedCustomer = localStorage.getItem('customer');
        const storedTableNum = localStorage.getItem('tableNum');
        if (storedCustomer) {
            const parsedCustomer = JSON.parse(storedCustomer);
            if (parsedCustomer) {
                setCustomer(parsedCustomer);
                setTableNum(storedTableNum || parsedCustomer.tableNum || '');
            }
        }
    }, []);

    // save customer data persistently in localStorage 
    const setPersistentCustomer = (customerData) => {
        setCustomer(customerData);
        setTableNum(customerData.tableNum || '');
        localStorage.setItem('customer', JSON.stringify(customerData));
        localStorage.setItem('tableNum', customerData.tableNum || '');
    };

    // Logout function to clear customer and cart data 
    const logout = () => {
        localStorage.removeItem('customer');
        localStorage.removeItem('orderInfo');
        setCustomer(null);
        setTableNum('');
        setCart({ orderedItems: {}, totalPrice: 0 });
    };

    useEffect(() => {
        fetchMenuItems().then(setMenuItems);
    }, []);

    useEffect(() => {
        if (menuItems.length > 0 && suggestions.length === 0) {
            const suggestions = getRandomSuggestions(cart, menuItems);
            setSuggestions(suggestions);
        }
    }, [menuItems]);

    // function to remove an item from cart 
    const removeItemFromCart = async (itemId, removeAll = false) => {
        if (!customer) {
            console.error('Customer is not set');
            return;
        }

        try {
            const currentItem = Object.values(cart.orderedItems).find(item => item.itemId === itemId);

            if (!currentItem) {
                console.error('Item not found in cart');
                return;
            }

            if (removeAll) {
                const response = await fetch(`http://localhost:8080/api/orders/${customer.orderId}/removeItems?itemId=${itemId}`, {
                    method: 'DELETE',
                    headers: {
                        'accept': 'application/hal+json',
                    },
                });

                if (response.ok) {
                    await fetchCart(customer).then(setCart);
                    console.log('All items removed from cart');
                } else {
                    console.error('Error removing all items from cart');
                }
            } else {
                if (currentItem.quantity === 1) {
                    const response = await fetch(`http://localhost:8080/api/orders/${customer.orderId}/removeItems?itemId=${itemId}`, {
                        method: 'DELETE',
                        headers: {
                            'accept': 'application/hal+json',
                        },
                    });

                    if (response.ok) {
                        await fetchCart(customer).then(setCart);
                        console.log('Last item removed from cart');
                    }
                } else {
                    const newQuantity = currentItem.quantity - 1;
                    const response = await fetch(`http://localhost:8080/api/orders/${customer.orderId}/addItems?itemId=${itemId}&quantity=${newQuantity}`, {
                        method: 'POST',
                        headers: {
                            'accept': 'application/hal+json',
                        },
                    });

                    if (response.ok) {
                        await fetchCart(customer).then(setCart);
                        console.log('Item quantity decreased by 1');
                    }
                }
            }
        } catch (error) {
            console.error('Error modifying cart:', error);
        }
    };

    // Submit the order
    const submitOrder = async () => {
        if (!customer || !customer.customerId) {
            throw new Error("Customer is not logged in or order ID is missing.");
        }
        try {
            // First get the current order to get the waiter ID
            const orderResponse = await fetch(`http://localhost:8080/api/orders/${customer.orderId}/getOrder`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            });

            if (!orderResponse.ok) {
                throw new Error(`Failed to fetch order details: ${orderResponse.status}`);
            }

            const orderData = await orderResponse.json();
            
            // Update the order's table number if it has changed
            const currentTableNum = localStorage.getItem('tableNum') || tableNum;
            if (currentTableNum && orderData.tableNum !== parseInt(currentTableNum)) {
                const updateResponse = await fetch(`http://localhost:8080/api/orders/${customer.orderId}/updateOrder`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tableNum: parseInt(currentTableNum) })
                });
                
                if (!updateResponse.ok) {
                    throw new Error(`Failed to update table number: ${updateResponse.status}`);
                }
            }

            const waiterId = orderData.waiter?.employee?.employeeId;

            // Submit the order
            const response = await fetch(`http://localhost:8080/api/order/${customer.orderId}/submitOrder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            const currentSales = parseFloat(localStorage.getItem('sales')) || 0;
            const totalSales = currentSales + cart.totalPrice;
            localStorage.setItem('sales', totalSales);
            console.log('Order submitted successfully');
            
            // Send WebSocket message if we have a waiter ID
            if (waiterId && ws.current && ws.current.readyState === WebSocket.OPEN) {
                const message = JSON.stringify({
                    type: 'ORDER_SUBMIT',
                    customerId: customer.customerId,
                    orderId: customer.orderId,
                    message: 'A new order has been submitted',
                    waiterId: waiterId,
                });
                ws.current.send(message);
                console.log('WebSocket message sent:', message);
            }

            return { success: true, message: 'Order submitted successfully!' };
        } catch (err) {
            console.error('Error submitting order:', err.message);
            return { success: false, message: `Error submitting order: ${err.message}` };
        }
    };

    // create multiple orders 
    const createNewOrder = async () => {
        if (!customer || !customer.customerId) {
            throw new Error("Customer is not logged in or customer ID is missing.");
        }

        const currentTableNum = localStorage.getItem('tableNum') || tableNum;
        if (!currentTableNum) {
            throw new Error("Table number is required to create a new order");
        }

        // Only check current order if orderId is not 0
        if (customer.orderId !== 0) {
            const currentOrder = await fetch(`http://localhost:8080/api/orders/${customer.orderId}/getOrder`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            });

            if (!currentOrder.ok) {
                throw new Error('Failed to fetch current order');
            }

            const orderData = await currentOrder.json();
            if (orderData.orderStatus === 'CREATED' && (!orderData.orderMenuItems || orderData.orderMenuItems.length === 0)) {
                return { success: false, message: 'Cannot create a new order while current cart is empty' };
            }
        }

        try {
            const response = await fetch(`http://localhost:8080/api/customers/${customer.customerId}/newOrder?tableNum=${currentTableNum}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to create new order: ${response.status}`);
            }

            const newOrderData = await response.json();
            setCustomer(prevCustomer => ({
                ...prevCustomer,
                orderId: newOrderData.orderId
            }));
            const storedCustomer = JSON.parse(localStorage.getItem('customer') || '{}');
            localStorage.setItem('customer', JSON.stringify({
                ...storedCustomer,
                orderId: newOrderData.orderId
            }));
            // Clear the cart for the new order
            setCart({ orderedItems: {} });
            return { success: true, message: 'New order created successfully!' };
        } catch (err) {
            console.error('Error creating new order:', err.message);
            return { success: false, message: `Error creating new order: ${err.message}` };
        }
    };

    useEffect(() => {
        if (customer) fetchCart(customer).then(setCart);
    }, [customer]);

    useEffect(() => {
        if (customer !== null) setLoading(false);
    }, [customer]);

    return (
        <CartContext.Provider
            value={{
                cart,
                customer,
                tableNum,
                menuItems,
                suggestions,
                setCart,
                setCustomer: setPersistentCustomer,
                setTableNum,
                fetchCart,
                fetchMenuItems,
                addItemToCart,
                removeItemFromCart,
                submitOrder,
                createNewOrder,
                logout,
                loading,
                setSuggestions
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
