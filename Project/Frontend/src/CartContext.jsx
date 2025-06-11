import { createContext, useEffect, useState } from 'react';
import PropTypes from "prop-types"
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
    
    useEffect(() => {
        // Retrieve customer and tableNum from localStorage when the app loads
        const storedCustomer = localStorage.getItem('customer');
        const storedTableNum = localStorage.getItem('tableNum');
        let parsedCustomer = null;
        try {
            if (storedCustomer && storedCustomer !== "undefined") {
                parsedCustomer = JSON.parse(storedCustomer);
            }
        } catch {
            parsedCustomer = null;
        }
        if (parsedCustomer) {
            setCustomer(parsedCustomer);
            setTableNum(storedTableNum || parsedCustomer.tableNum || '');
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
