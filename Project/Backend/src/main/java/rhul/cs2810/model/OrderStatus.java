package rhul.cs2810.model;

/**
 * An enum class that represents the status of an order.
 */
public enum OrderStatus {
  CREATED("Order is created"), SUBMITTED("Order is submitted"), CONFIRMED(
      "Order is confirmed by waiter"), IN_PROGRESS("IN preparation"), READY(
      "Ready to be delivered!"), DELIVERED("Order is delivered!");

  private final String description;

  OrderStatus(String description) {
    this.description = description;
  }

  /**
   * Describes the order status.
   *
   * @return description of type String
   */
  public String getDescription() {
    return this.description;
  }

}
