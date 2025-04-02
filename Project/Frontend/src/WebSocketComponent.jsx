/* eslint-disable */
import { useEffect, useState } from 'react';

const WebSocketComponent = () => {
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
     // Creating a new WebSocket connection
    ws.currrent = new WebSocket("ws://localhost:8080/ws/notifications")
    // Event handler when the WebSocket connection is opened
    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };
     // Event handler when the WebSocket connection is closed
    ws.onclose = () => {
      console.log("Websocket session is closed");
    }
    // Cleanup function to close WebSocket on component unmount
    return () => {
      if (ws.current){
        socket.close();
      }
    };
  }, []);

  const handleNotification = async() => {
    // Sending a POST request to notify the server
    const response = fetch('http://localhost:8080/api/notification/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify("New notification"), // Request body with the notification message
    });
   // Checking if the response was successful
    if (((await response).ok)){
      console.log("Notification sent");
    }
    else{
      error("Error sending notification");
    }

  }

  return (
    {message, socket}
  );
};

export default WebSocketComponent;
