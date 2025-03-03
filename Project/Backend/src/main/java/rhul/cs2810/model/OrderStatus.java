package rhul.cs2810.model;

/**
 * An enum class that represents the status of an order.
 */
public enum OrderStatus {
  CREATED("Order is created"), SUBMITTED("Order is submitted"), READY(
      "Ready to be delivered!"), IN_PROGRESS("IN preparation"), DELIVERED("Order is delivered!");

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
