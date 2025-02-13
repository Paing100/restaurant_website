import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null); // Start as null to indicate loading

    const fetchCart = () => {
        fetch('http://localhost:8080/api/cart')
            .then(response => response.json())
            .then(data => setCart(data))
            .catch(err => console.error('Failed to fetch cart:', err));
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addItemToCart = (item) => {
        fetch('http://localhost:8080/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        })
            .then(response => response.json())
            .then(data => setCart(data)) // Update cart with the response from the server
            .catch(err => console.error('Failed to add item to cart:', err));
    };

    const removeItemFromCart = (item) => {
        fetch('http://localhost:8080/api/cart/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        })
            .then(response => response.json())
            .then(data => setCart(data)) // Update cart with the response from the server
            .catch(err => console.error('Failed to remove item from cart:', err));
    };

    return (
        <CartContext.Provider value={{ cart, addItemToCart, removeItemFromCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};