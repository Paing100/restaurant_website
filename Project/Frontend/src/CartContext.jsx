/* eslint-disable */
import React, { createContext, useEffect, useState } from 'react';
import PropTypes from "prop-types"

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ orderedItems: {}, totalPrice: 0 });
    const [customer, setCustomer] = useState(null);
    const [tableNum, setTableNum] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Retrieve customer from localStorage when the app loads
        const storedCustomer = localStorage.getItem('customer');
        if (storedCustomer) {
            const parsedCustomer = JSON.parse(storedCustomer);
            setCustomer(parsedCustomer);
            setTableNum(parsedCustomer.tableNum || '');
        }
    }, []);

    const setPersistentCustomer = (customerData) => {
        setCustomer(customerData);
        localStorage.setItem('customer', JSON.stringify(customerData));
    };

    const logout = () => {
        localStorage.removeItem('customer');
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
            const response = await fetch(`http://localhost:8080/api/orders/${customer.customerId}/getOrder`, {
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
