package rhul.cs2810.model;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * WebSocketHandler class to manage WebSocket connections and send notifications.
 */
@Component
public class WebSocketHandler extends TextWebSocketHandler {

  private static final List<WebSocketSession> sessions = new ArrayList<>();

  /**
   * Sends a notification to all connected WebSocket sessions.
   * 
   * @param type the type of notification
   * @param orderId the ID of the order
   * @param recipient the recipient of the notification
   * @param message the message to be sent
   * @param waiterId the ID of the waiter
   */
  public void sendNotification(String type, int orderId, String recipient, String message, String waiterId){
    String jsonMessage = String.format(
      "{\"type\":\"%s\", \"orderId\":%d, \"recipient\":\"%s\", \"message\":\"%s\", \"waiterId\":\"%s\"}",
      type, orderId, recipient, message, waiterId
    );
    for(WebSocketSession session: sessions){
      if (session.isOpen()) {
        try {
          session.sendMessage(new TextMessage(jsonMessage));
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }

  /**
   * Handles the establishment of the WebSocket connection.
   * 
   * @param webSocketSession the WebSocket session that was established
   */
  @Override
  public void afterConnectionEstablished(WebSocketSession webSocketSession){
    sessions.add(webSocketSession);
    System.out.println("New session added!");
  }

  /**
   * Handles the closure of the WebSocket connection.
   * 
   * @param webSocketSession the WebSocket session that was closed
   */
  @Override
  public void afterConnectionClosed(WebSocketSession webSocketSession, CloseStatus status){
    sessions.remove(webSocketSession);
  }

  /**
   * Handles incoming text messages from the WebSocket.
   * 
   * @param session the WebSocket session that sent the message
   */
  @Override
  public void handleTextMessage(WebSocketSession session, TextMessage message) {
    System.out.println("Received message: " + message.getPayload());
  }

  /**
   * Gets the list of the active WebSocket sessions.
   * 
   * @return a list of the active WebSocket sessions
   */
  public List<WebSocketSession> getSessions(){
    return this.sessions;
  }

}
