package rhul.cs2810.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rhul.cs2810.model.Notification;
import rhul.cs2810.model.WebSocketHandler;
import rhul.cs2810.repository.NotificationRepository;

import javax.management.NotificationFilter;
import java.util.ArrayList;
import java.util.List;

/**
 * Service class for handling notifications.
 */
@Service
public class NotificationService {

  private final WebSocketHandler webSocketHandler;

  private final NotificationRepository notificationRepository;



  /**
   * Constructor for NotificationService.
   * 
   * @param webSocketHandler the WebSocketHandler instance to be used for sending notifications
   */
  public NotificationService(WebSocketHandler webSocketHandler, NotificationRepository notificationRepository) {
    this.webSocketHandler = webSocketHandler;
    this.notificationRepository = notificationRepository;
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

  public void processNotification(Notification notification) {
    this.sendNotification(notification.getType(), notification.getOrderId(),
      notification.getRecipient(), notification.getMessage(), notification.getWaiterId());
    notificationRepository.save(notification);
  }

  public List<Notification> getMessages() {
    Iterable<Notification> notifsIterable = notificationRepository.findAll();
    List<Notification> items = new ArrayList<>();
    notifsIterable.forEach(items::add);
    return items;
  }

}
