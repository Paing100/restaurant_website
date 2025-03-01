package rhul.cs2810.model;

public enum OrderStatus {
  CREATED("Order is created"), SUBMITTED("Order is submitted"), READY(
      "Ready to be delivered!"), IN_PROGRESS("IN preparation"), DELIVERED("Order is delivered!");

  private final String description;

  OrderStatus(String description) {
    this.description = description;
  }

  public String getDescription() {
    return this.description;
  }

}
