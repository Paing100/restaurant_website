
export const fetchTables = async (employeeId) => { 
    const response = await fetch(
        `http://localhost:8080/api/waiter/${employeeId}/tables`
    );
    if (!response.ok) throw new Error("Error fetching tables");
    return await response.json();
};

 // Fetch orders assigned to the waiter
export const fetchOrders = async (employeeId) => {
    const response = await fetch(
      `http://localhost:8080/api/waiter/${employeeId}/orders`
    );  
    if (!response.ok) throw new Error("Error fetching orders");
    const data = await response.json();
    const ordersWithPayment = data.map((order) => ({
        ...order,
        isPaid: order.orderPaid === true,
      }));

    return ordersWithPayment;
}

// Update order status on the server
export const updateOrderStatus = async (employeeId, orderId, newStatus) => {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderStatus: newStatus }),
    }; 
    await fetch(
        `http://localhost:8080/api/order/${orderId}/updateOrderStatus`,
        settings
      );
    return await fetchOrders(employeeId)
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
    const sendAlert = await fetch(
        "http://localhost:8080/api/notification/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(alertMessage),
        }
      );
    if (!sendAlert.ok) throw new Error("Failed to send an alert");
    setAlerts((prevAlerts) => [...prevAlerts, alertMessage]); // Add the alert to the alerts state
}

