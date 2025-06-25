import axios from 'axios';

const calculateTotalPrice = (orderData) => {
  const totalPrice = orderData.orderMenuItems.reduce((total, item) => 
    total +((item.quantity || 0) * (item.menuItem?.price || 0)), 0
  );
  return parseFloat(totalPrice.toFixed(2));
}

// fetch the cart data 
export const fetchCart = async (customer) => {
        if (!customer) {
            console.error('Customer or order ID is not set');
            return { orderedItems: {}, totalPrice: 0 };
        }
        try {
            const {data: orderData} = await axios.get(`http://localhost:8080/api/orders/${customer.orderId}/getOrder`)
            if (!orderData || !Array.isArray(orderData.orderMenuItems)){
              throw new Error("Invalid order data format.");
            }

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

            const totalPrice = calculateTotalPrice(orderData);
            console.log("PRICE: " + totalPrice);

            return { orderedItems, totalPrice };

        } catch (error) {
            console.error('Error fetching order:', error);
            return { orderedItems: {}, totalPrice: 0 };
        }
    };

export const addItemToCart = async (customer, itemId, quantity, cart) => {
        if (!customer) {
            console.error('Customer is not set');
            return;
        }
        try {
            // First check the order status
            const {data: orderData} = await axios.get(`http://localhost:8080/api/orders/${customer.orderId}/getOrder`);

            if (orderData.orderStatus !== 'CREATED') {
                throw new Error('Cannot modify a submitted order');
            }

            const currentItem = Object.values(cart.orderedItems).find(item => item.itemId === itemId);
            const newQuantity = currentItem ? currentItem.quantity + quantity : quantity;

            const { data: currentComment } = await axios.get(`http://localhost:8080/api/${customer.orderId}/comments`);
            const key = `${customer.orderId} - ${itemId}`;
            const comment = currentComment[key] || '';

            console.log("CURRNET: " + comment);
            await axios.post(`http://localhost:8080/api/orders/${customer.orderId}/addItems?itemId=${itemId}&quantity=${newQuantity}&comment=${comment}`);
            return fetchCart(customer);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw error;
        }
}

// replace a suggestion after the customer puts it in cart 
export const replaceSuggestion = (cart, menuItems, suggestions, addedItemId) => {
        try {
            const cartItemIds = [...Object.values(cart.orderedItems).map(item => item.itemId), addedItemId];

            const availableItems = menuItems.filter(item => 
                item.available && 
                !cartItemIds.includes(item.itemId) && 
                !suggestions.some(suggestion => suggestion.itemId === item.itemId)
            );

            if (availableItems.length === 0) return;

            const randomIndex = Math.floor(Math.random() * availableItems.length);
            const replacementItem = availableItems[randomIndex];
            
            return suggestions.map(item => 
                    item.itemId === addedItemId ? replacementItem : item
                );
        } catch (error) {
            console.error('Error replacing suggestion:', error);
        }
    };

// use API end point to fetch menu items 
export const fetchMenuItems = async () => {
    try{
        const {data: menuData} = await axios.get('http://localhost:8080/MenuItems');
        if (menuData && Array.isArray(menuData)) {
            return menuData; 
        }
        else{
            console.error('Invalid menu data format received');
            return [];
        }
    }
    catch (error) {
        console.error('Error fetching menu items:', error);
        return [];
    }
}

// function to clear the whole cart 
export const clearCart = async (customer, cart) => {
    if (!customer) {
        console.error('Customer is not set');
        return;
    }

    try {
        const itemIds = Object.values(cart.orderedItems).map(item => item.itemId);
        for (const itemId of itemIds) {
            try{
                await axios.delete(`http://localhost:8080/api/orders/${customer.orderId}/removeItems?itemId=${itemId}`);
            }
            catch{
                console.error(`Error removing item ${itemId} during cart clear`);
            }
        }
        console.log('Cart cleared successfully');
        return { orderedItems: {}, totalPrice: 0 };
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
};

// generate random menu item suggestions 
export const getRandomSuggestions = (cart, menuItems) => {
    try {
        const cartItemIds = Object.values(cart.orderedItems).map(item => item.itemId);
        const availableItems = menuItems.filter(item => 
            item.available && !cartItemIds.includes(item.itemId)
        );

        if (availableItems.length <= 5) {
            return availableItems;
        }
        const randomItems = [];
        const availableCopy = [...availableItems];
        
        for (let i = 0; i < 5 && availableCopy.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableCopy.length);
            randomItems.push(availableCopy[randomIndex]);
            availableCopy.splice(randomIndex, 1);
        }
        return randomItems;
    } catch (error) {
        console.error('Error generating suggestions:', error);
        return [];
    }
};

// function to remove an item from cart 
export const removeItemFromCart = async (customer, cart, itemId, removeAll = false) => {
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
                try{
                    await axios.delete(`http://localhost:8080/api/orders/${customer.orderId}/removeItems?itemId=${itemId}`);
                    console.log('All items removed from cart');
                    return true;
                }
                catch {
                    console.error('Error removing all items from cart');
                }
            } else {
                if (currentItem.quantity === 1) {
                    await axios.delete(`http://localhost:8080/api/orders/${customer.orderId}/removeItems?itemId=${itemId}`);   
                    console.log('Last item removed from cart');
                    return true;
                } else {

                    const { data: currentComment } = await axios.get(`http://localhost:8080/api/${customer.orderId}/comments`);
                    const key = `${customer.orderId} - ${itemId}`;
                    const comment = currentComment[key] || '';
                    const newQuantity = currentItem.quantity - 1;
                    await axios.post(`http://localhost:8080/api/orders/${customer.orderId}/addItems?itemId=${itemId}&quantity=${newQuantity}&comment=${comment}`);

                    console.log('Item quantity decreased by 1');
                    return true;
                }
            }
        } catch (error) {
            console.error('Error modifying cart:', error);
        }
    };


// Submit the order
export const submitOrder = async (customer, cart, ws, tableNum) => {
        if (!customer || !customer.customerId) {
            throw new Error("Customer is not logged in or order ID is missing.");
        }
        try {
            // First get the current order to get the waiter ID
            let orderData;
            try{
                const orderResponse = await axios.get(`http://localhost:8080/api/orders/${customer.orderId}/getOrder`);
                orderData = orderResponse.data;
            }
            catch(error){
                console.log(`Failed to fetch order details: ${error.response?.status}`);
            }

            
            // Update the order's table number if it has changed
            const currentTableNum = localStorage.getItem('tableNum') || tableNum;
            if (currentTableNum && orderData.tableNum !== parseInt(currentTableNum)) {
                try{
                    await axios.post(`http://localhost:8080/api/orders/${customer.orderId}/updateOrder`,{
                        tableNum: parseInt(currentTableNum) 
                    });
                } catch (error){
                    console.log(`Failed to update table number: ${error.response?.status}`);
                }
            }

            const waiterId = orderData.waiter?.employee?.employeeId;

            // Submit the order
            try{
                await axios.post(`http://localhost:8080/api/order/${customer.orderId}/submitOrder`);
            }
            catch(error){
                console.log(`Server responded with status: ${error.response?.status}`);
            }

            const currentSales = parseFloat(localStorage.getItem('sales')) || 0;
            const totalSales = currentSales + cart.totalPrice;
            localStorage.setItem('sales', totalSales);
            console.log('Order submitted successfully');
            
            // Send WebSocket message if we have a waiter ID
            if (waiterId && ws.current && ws.current.readyState === WebSocket.OPEN) {
                const message = JSON.stringify({
                    type: 'ORDER_SUBMIT',
                    customerId: customer.customerId,
                    orderId: customer.orderId,
                    message: 'A new order has been submitted',
                    waiterId: waiterId,
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


// create multiple orders 
export const createNewOrder = async (customer, tableNum) => {
        if (!customer || !customer.customerId) {
            throw new Error("Customer is not logged in or customer ID is missing.");
        }

        const currentTableNum = localStorage.getItem('tableNum') || tableNum;
        if (!currentTableNum) {
            throw new Error("Table number is required to create a new order");
        }

        // Only check current order if orderId is not 0
        let orderData;
        if (customer.orderId !== 0) {
            try{
                const currentOrder = await axios.get(`http://localhost:8080/api/orders/${customer.orderId}/getOrder`);
                orderData = currentOrder.data;
            } catch (error){
                console.log('Failed to fetch current order ' + error);
            }

            if (orderData.orderStatus === 'CREATED' && (!orderData.orderMenuItems || orderData.orderMenuItems.length === 0)) {
                return { success: false, message: 'Cannot create a new order while current cart is empty' };
            }
        }


        try {
            const newOrderData = await getNewTable(customer, currentTableNum);
            const storedCustomer = JSON.parse(localStorage.getItem('customer') || '{}');
            localStorage.setItem('customer', JSON.stringify({
                ...storedCustomer,
                orderId: newOrderData.orderId
            }));

            return { success: true, message: 'New order created successfully!', orderId: newOrderData.orderId };
        } catch (err) {
            console.error('Error creating new order:', err.message);
            return { success: false, message: `Error creating new order: ${err.message}` };
        }
    };
  

export const getNewTable = async(customer, currentTableNum) => {
    try{
        const response = await axios.post(`http://localhost:8080/api/customers/${customer.customerId}/newOrder?tableNum=${currentTableNum}`);
        return response.data;
    }
    catch(error) {
        console.error('Failed to fetch new table ' + error);
    }
}