package rhul.cs2810.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rhul.cs2810.model.WebSocketHandler;

/**
 * Service class for handling notifications.
 */
@Service
public class NotificationService {

  private final WebSocketHandler webSocketHandler;

  /**
   * Constructor for NotificationService.
   * 
   * @param webSocketHandler the WebSocketHandler instance to be used for sending notifications
   */
  @Autowired
  public NotificationService(WebSocketHandler webSocketHandler) {
    this.webSocketHandler = webSocketHandler;
  }

  /**
   * Sends a notification to a specific recipient.
   * 
   * @param type the type of notification
   * @param orderId the ID of the order which is associated with the notification
   * @param recipient the recipient of the notification
   * @param message the message to be sent within the notification
   * @param waiterId the ID of the waiter associated with the notification
   */
  public void sendNotification(String type, int orderId, String recipient, String message, String waiterId) {
    webSocketHandler.sendNotification(type, orderId, recipient, message, waiterId); // Using instance method
  }
}
