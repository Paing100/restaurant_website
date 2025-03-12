/* eslint-disable */
import { useEffect, useState } from 'react';

const WebSocketComponent = () => {
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    ws.currrent = new WebSocket("ws://localhost:8080/ws/notifications")

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onclose = () => {
      console.log("Websocket session is closed");
    }

    return () => {
      if (ws.current){
        socket.close();
      }
    };
  }, []);

  const handleNotification = async() => {
    const response = fetch('http://localhost:8080/api/notification/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify("New notification"),
    });

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
