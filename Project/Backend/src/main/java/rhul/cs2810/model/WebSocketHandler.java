package rhul.cs2810.model;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

  private static final List<WebSocketSession> sessions = new ArrayList<>();

  public static void sendNotification(String type, int orderId, String recipient, String message, String waiterId){
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

  @Override
  public void afterConnectionEstablished(WebSocketSession webSocketSession){
    sessions.add(webSocketSession);
    System.out.println("New session added!");
  }

  @Override
  public void afterConnectionClosed(WebSocketSession webSocketSession, CloseStatus status){
    sessions.remove(webSocketSession);
  }

  @Override
  public void handleTextMessage(WebSocketSession session, TextMessage message) {
    System.out.println("Received message: " + message.getPayload());
  }

  public List<WebSocketSession> getSessions(){
    return this.sessions;
  }

}
