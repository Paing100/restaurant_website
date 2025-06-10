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

            await axios.post(`http://localhost:8080/api/orders/${customer.orderId}/addItems?itemId=${itemId}&quantity=${newQuantity}`);
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