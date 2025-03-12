package rhul.cs2810.model;

public class Notification {
  private String type;
  private int orderId;
  private String recipient;
  private String message;

  public Notification(){}

  public Notification(String type, int orderId, String recipient, String message) {
    this.type = type;
    this.orderId = orderId;
    this.recipient = recipient;
    this.message = message;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
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
