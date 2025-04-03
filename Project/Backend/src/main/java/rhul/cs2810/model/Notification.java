package rhul.cs2810.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Represents a notification entity in the system.
 * This class is mapped to the "notifications" table in the database.
 * It stores information about notifications such as type, order ID, recipient, message, and waiter ID.
 */
@Entity
@Table(name = "notifications")
public class Notification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "notification_id")
  private int notifId;

  @Column(name = "message_type")
  private String messageType;

  @Column(name = "order_id")
  private int orderId;

  @Column(name = "recipient")
  private String recipient;

  @Column(name = "message")
  private String message;

  @Column(name = "waiterId")
  private String waiterId;

  /**
   * Default constructor for the Notification class.
   */
  public Notification() {}

  /**
   * Constructs a new Notification with the specified details.
   *
   * @param type      the type of the notification
   * @param orderId   the ID of the order associated with the notification
   * @param recipient the recipient of the notification
   * @param message   the message content of the notification
   * @param waiterId  the ID of the waiter associated with the notification
   */
  public Notification(String type, int orderId, String recipient, String message, String waiterId) {
    this.messageType = type;
    this.orderId = orderId;
    this.recipient = recipient;
    this.message = message;
    this.waiterId = waiterId;
  }

  /**
   * Gets the notification ID.
   *
   * @return the notification ID
   */
  public int getNotifId() {
    return notifId;
  }

  /**
   * Gets the type of the notification.
   *
   * @return the notification type
   */
  public String getType() {
    return messageType;
  }

  /**
   * Gets the ID of the waiter associated with the notification.
   * 
   * @return the waiter ID
   */
  public String getWaiterId() {
    return waiterId;
  }

  /**
   * Sets the ID of the waiter associated with the notification.
   * 
   * @param waiterId the ID of the waiter
   */
  public void setWaiterId(String waiterId) {
    this.waiterId = waiterId;
  }

  /**
   * Sets the type of the notification.
   * 
   * @param type the notification type
   */
  public void setType(String type) {
    this.messageType = type;
  }

  /**
   * Gets the ID of the order associated with the notification.
   *
   * @return the order ID
   */
  public int getOrderId() {
    return orderId;
  }

  /**
   * Sets the ID of the order associated with the notification.
   *
   * @param orderId the order ID to set
   */
  public void setOrderId(int orderId) {
    this.orderId = orderId;
  }

  /**
   * Gets the recipient of the notification.
   *
   * @return the recipient
   */
  public String getRecipient() {
    return recipient;
  }

  /**
   * Sets the recipient of the notification.
   *
   * @param recipient the recipient to set
   */
  public void setRecipient(String recipient) {
    this.recipient = recipient;
  }

  /**
   * Gets the message content of the notification.
   *
   * @return the message content
   */
  public String getMessage() {
    return message;
  }

  /**
   * Sets the message content of the notification.
   *
   * @param message the message content to set
   */
  public void setMessage(String message) {
    this.message = message;
  }
}
