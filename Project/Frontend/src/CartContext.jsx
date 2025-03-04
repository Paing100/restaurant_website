/* eslint-disable */
import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ orderedItems: {}, totalPrice: 0 });
    const [customer, setCustomer] = useState(null);
    const [tableNum, setTableNum] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch cart data from the backend
    const fetchCart = async () => {
        if (!customer) {
            console.error('Customer is not set');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/orders/${customer.customerId}/getOrder`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json', // Changed from application/hal+json to standard JSON
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const text = await response.text(); // Read response as text first

            if (!text) {
                throw new Error("Received empty response from server.");
            }

            const orderData = JSON.parse(text); // Parse only if response is not empty
            console.log('Order Data:', orderData);

            if (!orderData || !Array.isArray(orderData.orderMenuItems)) {
                throw new Error("Invalid order data format.");
            }

            // Map the orderMenuItems to include quantity and price
            const orderedItems = orderData.orderMenuItems.reduce((acc, item) => {
                if (!item.menuItem) return acc; // Ensure menuItem exists

                acc[item.menuItem.name] = {
                    itemId: item.menuItem.itemId,
                    quantity: item.quantity || 0,
                    price: item.menuItem.price || 0,
                    imagePath: item.menuItem.imagePath || '' // Include image path safely
                };
                return acc;
            }, {});

            // Calculate total price safely
            const totalPrice = orderData.orderMenuItems.reduce((total, item) =>
                total + ((item.quantity || 0) * (item.menuItem?.price || 0)), 0
            );

            setCart({
                orderedItems: orderedItems,
                totalPrice: totalPrice
            });

            console.log('Updated Cart:', { orderedItems, totalPrice });

        } catch (error) {
            console.error('Error fetching order:', error);
            setCart({ orderedItems: {}, totalPrice: 0 }); // Set fallback cart to prevent crashes
        }
    };


    // Handle adding item to the cart
    const addItemToCart = async (itemId, quantity) => {
        if (!customer) {
            console.error('Customer is not set');
            return;
        }

        try {
            const currentItem = Object.values(cart.orderedItems).find(item => item.itemId === itemId);
            const newQuantity = currentItem ? currentItem.quantity + quantity : quantity;

            const response = await fetch(`http://localhost:8080/api/orders/${customer.customerId}/addItems?itemId=${itemId}&quantity=${newQuantity}`, {
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
                }
            } else {
                console.error('Error adding item to cart');
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    // Handle removing a single item from the cart
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

            // If removeAll is true, remove the item completely
            if (removeAll) {
                const response = await fetch(`http://localhost:8080/api/orders/${customer.customerId}/removeItems?itemId=${itemId}`, {
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
                // If quantity is 1, remove the item completely
                if (currentItem.quantity === 1) {
                    const response = await fetch(`http://localhost:8080/api/orders/${customer.customerId}/removeItems?itemId=${itemId}`, {
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
                    // If quantity > 1, decrease by 1
                    const newQuantity = currentItem.quantity - 1;
                    const response = await fetch(`http://localhost:8080/api/orders/${customer.customerId}/addItems?itemId=${itemId}&quantity=${newQuantity}`, {
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

    // Clear the cart
    const clearCart = async () => {
        if (!customer) {
            console.error('Customer is not set');
            return;
        }

        try {
            // Get all item IDs from the cart
            const itemIds = Object.values(cart.orderedItems).map(item => item.itemId);

            // Remove each item one by one
            for (const itemId of itemIds) {
                // Use the API's removeItems endpoint to remove all quantities of each item
                const response = await fetch(`http://localhost:8080/api/orders/${customer.customerId}/removeItems?itemId=${itemId}`, {
                    method: 'DELETE',
                    headers: {
                        'accept': 'application/hal+json',
                    },
                });

                if (!response.ok) {
                    console.error(`Error removing item ${itemId} during cart clear`);
                }
            }

            // Reset the cart state after all items are removed
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
            return { success: true, message: 'Order submitted successfully!' };
        } catch (err) {
            console.error('Error submitting order:', err.message);
            return { success: false, message: `Error submitting order: ${err.message}` };
        }
    };

    // Use effect to fetch cart data when customer is set
    useEffect(() => {
        fetchCart();
    }, [customer]);

    useEffect(() => {
        if (customer !== null) {
            setLoading(false);
        }
    }, [customer]);

    return (
        <CartContext.Provider
            value={{
                cart,
                customer,
                tableNum,
                setCustomer,
                setTableNum,
                addItemToCart,
                removeItemFromCart,
                fetchCart,
                clearCart,
                submitOrder,
                loading
            }}
        >
            {children}
        </CartContext.Provider>
    );
};