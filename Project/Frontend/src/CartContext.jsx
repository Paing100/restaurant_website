/* eslint-disable */
import React, { createContext, useEffect, useState } from 'react';
import PropTypes from "prop-types"
import { useRef } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ orderedItems: {}, totalPrice: 0 });
    const [customer, setCustomer] = useState(null);
    const [tableNum, setTableNum] = useState('');
    const [loading, setLoading] = useState(true);
    const ws = useRef(null);
    // Establish WebSocket connection
    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8080/ws/notifications");

        ws.current.onopen = () => {
            console.log('WebSocket connected', ws.current.readyState);
        };

        ws.current.onclose = () => {
            console.log("WebSocket session is closed");
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);
    
    useEffect(() => {
        // Retrieve customer from localStorage when the app loads
        const storedCustomer = localStorage.getItem('customer');
        if (storedCustomer) {
            const parsedCustomer = JSON.parse(storedCustomer);
            if (parsedCustomer) {
                setCustomer(parsedCustomer);
                setTableNum(parsedCustomer.tableNum || '');
            }
        }
    }, []);

    const setPersistentCustomer = (customerData) => {
        setCustomer(customerData);
        localStorage.setItem('customer', JSON.stringify(customerData));
    };

    const logout = () => {
        localStorage.removeItem('customer');
        localStorage.removeItem('orderInfo');
        setCustomer(null);
        setTableNum('');
        setCart({ orderedItems: {}, totalPrice: 0 });
    };

    const fetchCart = async () => {
        if (!customer) {
            console.error('Customer is not set');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/orders/${customer.orderId}/getOrder`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            });
            if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
            const text = await response.text();
            if (!text) throw new Error("Received empty response from server.");
            const orderData = JSON.parse(text);
            if (!orderData || !Array.isArray(orderData.orderMenuItems)) throw new Error("Invalid order data format.");

            const orderedItems = orderData.orderMenuItems.reduce((acc, item) => {
                if (!item.menuItem) return acc;
                acc[item.menuItem.name] = {
                    itemId: item.menuItem.itemId,
                    quantity: item.quantity || 0,
                    price: item.menuItem.price || 0,
                    imagePath: item.menuItem.imagePath || ''
                };
                return acc;
            }, {});

            const totalPrice = orderData.orderMenuItems.reduce((total, item) =>
                total + ((item.quantity || 0) * (item.menuItem?.price || 0)), 0
            );

            setCart({ orderedItems, totalPrice });
        } catch (error) {
            console.error('Error fetching order:', error);
            setCart({ orderedItems: {}, totalPrice: 0 });
        }
    };

    const addItemToCart = async (itemId, quantity) => {
        if (!customer) {
            console.error('Customer is not set');
            return;
        }

        try {
            const currentItem = Object.values(cart.orderedItems).find(item => item.itemId === itemId);
            const newQuantity = currentItem ? currentItem.quantity + quantity : quantity;

            const response = await fetch(`http://localhost:8080/api/orders/${customer.orderId}/addItems?itemId=${itemId}&quantity=${newQuantity}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/hal+json',
                },
            });


            if (response.ok) {
                console.log(response);
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const updatedCart = await response.json();
                    setCart(updatedCart); // Update the cart with new data
                } else {
                    fetchCart();
                    console.log('Item added to order');
                    console.log(customer);
                }
            } else {
                console.error('Error adding item to cart');
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

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
                    await fetchCart();
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
                        await fetchCart();
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
                        await fetchCart();
                        console.log('Item quantity decreased by 1');
                    }
                }
            }
        } catch (error) {
            console.error('Error modifying cart:', error);
        }
    };

    const clearCart = async () => {
        if (!customer) {
            console.error('Customer is not set');
            return;
        }

        try {
            const itemIds = Object.values(cart.orderedItems).map(item => item.itemId);

            for (const itemId of itemIds) {
                const response = await fetch(`http://localhost:8080/api/orders/${customer.orderId}/removeItems?itemId=${itemId}`, {
                    method: 'DELETE',
                    headers: {
                        'accept': 'application/hal+json',
                    },
                });

                if (!response.ok) {
                    console.error(`Error removing item ${itemId} during cart clear`);
                }
            }

            setCart({ orderedItems: {}, totalPrice: 0 });
            console.log('Cart cleared successfully');
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

// Submit the order
const submitOrder = async () => {
    if (!customer || !customer.customerId) {
        throw new Error("Customer is not logged in or order ID is missing.");
    }
    try {
        const response = await fetch(`http://localhost:8080/api/order/${customer.customerId}/submitOrder`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        console.log('Order submitted successfully');

        // Send WebSocket message
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({
                type: 'ORDER_SUBMIT',
                customerId: customer.customerId,
                message: 'A new order has been submitted'
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

    useEffect(() => {
        if (customer) fetchCart();
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
                setCart,
                setCustomer: setPersistentCustomer,
                setTableNum,
                fetchCart,
                addItemToCart,
                removeItemFromCart,
                clearCart,
                submitOrder,
                logout,
                loading
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};