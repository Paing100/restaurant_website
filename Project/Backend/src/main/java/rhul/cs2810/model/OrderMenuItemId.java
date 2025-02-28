package rhul.cs2810.model;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;

public class OrderMenuItemId implements Serializable {
  @Column(name = "order_id")
  private int orderId;

  @Column(name = "item_id")
  private int itemId;

  public OrderMenuItemId() {

  }

  public OrderMenuItemId(int orderId, int itemId) {
    this.orderId = orderId;
    this.itemId = itemId;
  }

  public int getOrderId() {
    return orderId;
  }

  public int getItemId() {
    return itemId;
  }

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

  @Override
  public int hashCode() {
    return Objects.hash(orderId, itemId);
  }


}
