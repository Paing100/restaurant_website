/* eslint-disable */
import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ orderedItems: {}, totalPrice: 0 });
    const [customer, setCustomer] = useState(null);
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
                    'accept': 'application/hal+json',
                },
            });

            if (response.ok) {
                const orderData = await response.json();
                console.log('Order Data:', orderData);

                // Map the orderMenuItems to include both quantity and price
                const orderedItems = orderData.orderMenuItems.reduce((acc, item) => {
                    acc[item.menuItem.name] = {
                        itemId: item.menuItem.itemId,
                        quantity: item.quantity,
                        price: item.menuItem.price,
                        imagePath: item.menuItem.imagePath // Include image path if needed
                    };
                    return acc;
                }, {});

                // Calculate total price from items
                const totalPrice = orderData.orderMenuItems.reduce((total, item) =>
                    total + (item.quantity * item.menuItem.price), 0
                );

                setCart({
                    orderedItems: orderedItems,
                    totalPrice: totalPrice
                });

                console.log('Updated Cart:', { orderedItems, totalPrice });
            } else {
                console.error('Error fetching order');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    };

    // Handle adding item to the cart
    const addItemToCart = async (itemId, quantity) => {
        if (!customer) {
            console.error('Customer is not set');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/orders/1/addItems?itemId=1&quantity=1`, {
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

    // Handle removing item from the cart
    const removeItemFromCart = async (itemId) => {
        if (!customer) {
            console.error('Customer is not set');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/orders/${customer.customerId}/removeItems?itemId=${itemId}`, {
                method: 'DELETE',
                headers: {
                    'accept': 'application/hal+json',
                },
            });

            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const updatedCart = await response.json();
                    setCart(updatedCart);
                    if (updatedCart.totalPrice === 0) {
                        setCart({ orderedItems: {}, totalPrice: 0 });
                    }
                } else {
                    // If response is not JSON, fetch the updated cart
                    await fetchCart();
                    console.log('Item removed from cart');
                }
            } else {
                console.error('Error removing item from cart');
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
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
                await removeItemFromCart(itemId);
            }

            // Reset the cart state after all items are removed
            setCart({ orderedItems: {}, totalPrice: 0 });
            console.log('Cart cleared successfully');
        } catch (error) {
            console.error('Error clearing cart:', error);
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
                setCustomer,
                addItemToCart,
                removeItemFromCart,
                fetchCart,
                clearCart,
                loading
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
