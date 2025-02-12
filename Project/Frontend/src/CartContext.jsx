import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ orderedItems: {}, totalPrice: 0 });

    const addItemToCart = (item) => {
        setCart((prevCart) => {
            const newOrderedItems = { ...prevCart.orderedItems, [item.name]: (prevCart.orderedItems[item.name] || 0) + 1 };
            const newTotalPrice = Object.keys(newOrderedItems).reduce((total, key) => {
                const menuItem = item; // Assuming item contains price
                return total + (menuItem.price * newOrderedItems[key]);
            }, 0);
            return { ...prevCart, orderedItems: newOrderedItems, totalPrice: newTotalPrice };
        });
    };

    return (
        <CartContext.Provider value={{ cart, addItemToCart }}>
            {children}
        </CartContext.Provider>
    );
};