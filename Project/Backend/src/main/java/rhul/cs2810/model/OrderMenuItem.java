package rhul.cs2810.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * A class representing order menu item.
 */
@Entity
@Table(name = "order_menu_items")
public class OrderMenuItem {

  @EmbeddedId
  private OrderMenuItemId orderMenuItemsId;

  @ManyToOne
  @JoinColumn(name = "order_id", referencedColumnName = "order_id", insertable = false,
      updatable = false)
  @JsonBackReference
  private Order order;

  @ManyToOne
  @JoinColumn(name = "item_id", referencedColumnName = "item_id", insertable = false,
      updatable = false)
  private MenuItem menuItem;

  @Column(name = "quantity", nullable = false)
  private int quantity;

  @Column(name = "orderSubmitted", nullable = false)
  private boolean orderSubmitted;

  public OrderMenuItem() {}

  /**
   * A constructor to create a orderMenuItem object.
   * 
   * @param order for the orderMenuItem
   * @param menuItem of the order
   * @param quantity of the item
   */
  public OrderMenuItem(Order order, MenuItem menuItem, int quantity, boolean orderSubmitted) {
    this.orderMenuItemsId = new OrderMenuItemId(order.getOrderId(), menuItem.getItemId());
    this.order = order;
    this.menuItem = menuItem;
    this.quantity = quantity;
    this.orderSubmitted = orderSubmitted;
  }

  /**
   * Gets OrderMenuItemId of the order menu item.
   *
   * @return OrderMenuItemId objects
   */
  public OrderMenuItemId getOrderMenuItemsId() {
    return orderMenuItemsId;
  }

  /**
   * Sets OrderMenuItemId.
   *
   * @param orderMenuItemsId of the OrderMenuItemId
   */
  public void setOrderMenuItemsId(OrderMenuItemId orderMenuItemsId) {
    this.orderMenuItemsId = orderMenuItemsId;
  }

  /**
   * Gets order.
   *
   * @return order of type Order
   */
  public Order getOrder() {
    return order;
  }

  /**
   * Sets order.
   *
   * @param order of type Order
   */
  public void setOrder(Order order) {
    this.order = order;
  }

  /**
   * Gets menu item.
   *
   * @return menuItem
   */
  public MenuItem getMenuItem() {
    return menuItem;
  }

  /**
   * Sets menu item.
   *
   * @param menuItem
   */
  public void setMenuItem(MenuItem menuItem) {
    this.menuItem = menuItem;
  }

  /**
   * Gets the quantity of the order menu item.
   * 
   * @return the quantity
   */
  public int getQuantity() {
    return quantity;
  }

  /**
   * Sets the quantity of the order menu item.
   *
   * @param quantity of the item
   */
  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public boolean isOrderSubmitted() {
    return orderSubmitted;
  }

  public void setOrderSubmitted(boolean orderSubmitted) {
    this.orderSubmitted = orderSubmitted;
  }

}
