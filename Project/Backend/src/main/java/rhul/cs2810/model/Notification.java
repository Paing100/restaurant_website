package rhul.cs2810.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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

  public Notification() {}

  public Notification(String type, int orderId, String recipient, String message, String waiterId) {
    this.messageType = type;
    this.orderId = orderId;
    this.recipient = recipient;
    this.message = message;
    this.waiterId = waiterId;
  }

  public int getNotifId() {
    return notifId;
  }

  public String getType() {
    return messageType;
  }

  public String getWaiterId() {
    return waiterId;
  }

  public void setWaiterId(String waiterId) {
    this.waiterId = waiterId;
  }

  public void setType(String type) {
    this.messageType = type;
  }

  public int getOrderId() {
    return orderId;
  }

  public void setOrderId(int orderId) {
    this.orderId = orderId;
  }

  public String getRecipient() {
    return recipient;
  }

  public void setRecipient(String recipient) {
    this.recipient = recipient;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }
}
