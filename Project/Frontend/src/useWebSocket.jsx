import { useEffect, useRef } from 'react'; 

const useWebSocket = (onMessage) => {
  const ws = useRef(null); 

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080/ws/notifications"); 
    ws.current.onopen = () => console.log("WebSocket connected");
    ws.current.onclose = () => console.log("WebSocket closed");
    ws.current.onmessage = onMessage; 

    return () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  },[]);
  return ws;
};

export default useWebSocket;