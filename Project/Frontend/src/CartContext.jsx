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
