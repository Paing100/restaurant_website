import axios from "axios"; 

// Fetch employee details from the server
export const fetchTables = async (employeeId) => { 
    const response = await axios.get(
        `http://localhost:8080/api/waiter/${employeeId}/tables`
    );
    if (response.status !== 200) throw new Error("Error fetching tables");
    return response.data;
};

 // Fetch orders assigned to the waiter
export const fetchOrders = async (employeeId) => {
    const response = await axios.get(
      `http://localhost:8080/api/waiter/${employeeId}/orders`
    );
    if (response.status !== 200) throw new Error("Error fetching orders");
    const data = response.data;
    const ordersWithPayment = data.map((order) => ({
        ...order,
        isPaid: order.orderPaid === true,
      }));

    return ordersWithPayment;
}

// Update order status on the server
export const updateOrderStatus = async (employeeId, orderId, newStatus) => {
    const response = await axios.post(
      `http://localhost:8080/api/order/${orderId}/updateOrderStatus`,
      { orderStatus: newStatus }
    );
    if (response.status !== 200) throw new Error("Error updating order status");
    return await fetchOrders(employeeId);
}

// Send alert notification to waiter if assistance is needed
export const alertOthers = async (tableNumber, orderId, employeeId, setAlerts) => {
    const alertMessage = {
      type: "ALERT",
      orderId: orderId,
      recipient: "waiter",
      message: `Table ${tableNumber} needs assistance`,
      waiterId: employeeId,
    };
    const sendAlert = await axios.post(
        "http://localhost:8080/api/notification/send",alertMessage);
    if (sendAlert.status !== 200) throw new Error("Error sending alert");
    setAlerts((prevAlerts) => [...prevAlerts, alertMessage]); // Add the alert to the alerts state
}

