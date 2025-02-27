package rhul.cs2810.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_menu_items")
public class OrderMenuItem {

  @EmbeddedId
  private OrderMenuItemId orderMenuItemsId;

  @ManyToOne
  @JoinColumn(name = "order_id", referencedColumnName = "order_id", insertable = false, updatable = false)
  @JsonBackReference
  private Order order;

  @ManyToOne
  @JoinColumn(name = "item_id", referencedColumnName = "item_id", insertable = false, updatable = false)
  private MenuItem menuItem;

  @Column(name = "quantity", nullable = false)
  private int quantity;

  public OrderMenuItem() {}

  public OrderMenuItem(Order order, MenuItem menuItem, int quantity) {
    this.orderMenuItemsId = new OrderMenuItemId(order.getOrderId(), menuItem.getItemId());
    this.order = order;
    this.menuItem = menuItem;
    this.quantity = quantity;
  }

  public OrderMenuItemId getOrderMenuItemsId() {
    return orderMenuItemsId;
  }

  public void setOrderMenuItemsId(OrderMenuItemId orderMenuItemsId) {
    this.orderMenuItemsId = orderMenuItemsId;
  }


  public Order getOrder() {
    return order;
  }

  public void setOrder(Order order) {
    this.order = order;
  }

  public MenuItem getMenuItem() {
    return menuItem;
  }

  public void setMenuItem(MenuItem menuItem) {
    this.menuItem = menuItem;
  }

  public int getQuantity() {
    return quantity;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }



}
