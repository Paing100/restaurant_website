package rhul.cs2810.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rhul.cs2810.model.WebSocketHandler;

@Service
public class NotificationService {

  private final WebSocketHandler webSocketHandler;

  @Autowired
  public NotificationService(WebSocketHandler webSocketHandler) {
    this.webSocketHandler = webSocketHandler;
  }

  public void sendNotification(String type, int orderId, String recipient, String message, String waiterId) {
    webSocketHandler.sendNotification(type, orderId, recipient, message, waiterId); // Using instance method
  }
}
