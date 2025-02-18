import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ orderedItems: {}, totalPrice: 0 });
    const [localCart, setLocalCart] = useState({ orderedItems: {}, totalPrice: 0 });

    const fetchCart = () => {
        // Simulate fetching cart from local storage or initial state
        const storedCart = JSON.parse(localStorage.getItem('cart')) || { orderedItems: {}, totalPrice: 0 };
        setCart(storedCart);
        setLocalCart(storedCart);
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addItemToCart = (item) => {
        // Update local cart state
        setLocalCart(prevCart => {
            const updatedOrderedItems = {
                ...prevCart.orderedItems,
                [item.name]: {
                    quantity: (prevCart.orderedItems[item.name]?.quantity || 0) + 1,
                    price: item.price
                }
            };
            const updatedTotalPrice = prevCart.totalPrice + item.price;
            const updatedCart = { orderedItems: updatedOrderedItems, totalPrice: updatedTotalPrice };
            localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save to local storage
            return updatedCart;
        });
    };

    const removeItemFromCart = (item) => {
        // Update local cart state
        setLocalCart(prevCart => {
            const updatedOrderedItems = { ...prevCart.orderedItems };
            if (updatedOrderedItems[item.name].quantity > 1) {
                updatedOrderedItems[item.name].quantity -= 0.5;
            } else {
                delete updatedOrderedItems[item.name];
            }
            const updatedTotalPrice = prevCart.totalPrice - item.price;
            const updatedCart = { orderedItems: updatedOrderedItems, totalPrice: updatedTotalPrice };
            localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save to local storage
            if (updatedTotalPrice <= 0) {
                clearCart();
            }
            return updatedCart;
        });
    };

    const clearCart = () => {
        setLocalCart({ orderedItems: {}, totalPrice: 0 });
        localStorage.removeItem('cart');
    };

    return (
        <CartContext.Provider value={{ cart, localCart, addItemToCart, removeItemFromCart, fetchCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};