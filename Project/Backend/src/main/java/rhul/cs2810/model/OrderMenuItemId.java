package rhul.cs2810.model;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;

/**
 * A class represents order menu item id.
 */
public class OrderMenuItemId implements Serializable {
  @Column(name = "order_id")
  private int orderId;

  @Column(name = "item_id")
  private int itemId;

  public OrderMenuItemId() {

  }

  /**
   * A constructor that accepts two arguments.
   *
   * @param orderId of the order
   * @param itemId of the item
   */
  public OrderMenuItemId(int orderId, int itemId) {
    this.orderId = orderId;
    this.itemId = itemId;
  }

  /**
   * Gets the order id
   * 
   * @return order id
   */
  public int getOrderId() {
    return orderId;
  }

  /**
   * Gets the item id
   *
   * @return item id
   */
  public int getItemId() {
    return itemId;
  }

  /**
   * Overriden method of equals that compare two objects
   */
  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    OrderMenuItemId otherId = (OrderMenuItemId) o;
    return orderId == otherId.orderId && itemId == otherId.itemId;
  }

  /**
   * Overriden method of hashcode that works with equals
   */
  @Override
  public int hashCode() {
    return Objects.hash(orderId, itemId);
  }


  @Override
  public String toString() {
    return orderId + " - " + itemId;
  }

}
