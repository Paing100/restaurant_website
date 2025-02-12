import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ orderedItems: {}, totalPrice: 0 });

    const addItemToCart = (item) => {
        // Call backend API to add item to cart
        fetch('http://localhost:2810/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ item }),
        })
            .then(response => response.json())
            .then(data => {
                // Update the cart context
                setCart((prevCart) => {
                    const newOrderedItems = { ...prevCart.orderedItems, [item.name]: (prevCart.orderedItems[item.name] || 0) + 1 };
                    const newTotalPrice = Object.keys(newOrderedItems).reduce((total, key) => {
                        const menuItem = item; // Assuming item contains price
                        return total + (menuItem.price * newOrderedItems[key]);
                    }, 0);
                    return { ...prevCart, orderedItems: newOrderedItems, totalPrice: newTotalPrice };
                });
            })
            .catch(err => console.error(err));
    };

    return (
        <CartContext.Provider value={{ cart, addItemToCart }}>
            {children}
        </CartContext.Provider>
    );
};