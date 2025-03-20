package rhul.cs2810.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.Objects;

/**
 * Represents an Order class to handle customers orders.
 */
@Entity
@Table(name = "orders")
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "order_id")
  private int orderId;

  @ManyToOne
  @JoinColumn(name = "customer_id", referencedColumnName = "customer_id")
  @JsonBackReference
  private Customer customer;

  @Column(name = "table_num", nullable = false)
  private int tableNum;

  @Column(name = "order_placed", columnDefinition = "TIMESTAMP")
  private LocalDateTime orderPlaced;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<OrderMenuItem> orderMenuItems = new ArrayList<>();

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private OrderStatus orderStatus;

  @Column(name = "order_paid", nullable = false)
  private boolean orderPaid;

  public Order() {
    this.orderStatus = OrderStatus.CREATED;
    this.orderPaid = false;
  }

  public Order(int tableNum, LocalDateTime orderPlaced, Customer customer) {
    this.customer = customer;
    this.orderPlaced = LocalDateTime.now();
    this.tableNum = tableNum;
    this.orderStatus = OrderStatus.CREATED;
    this.orderPaid = false;
  }

  public int getOrderId() {
    return orderId;
  }

  public void setOrderId(int orderId) {
    this.orderId = orderId;
  }

  public Customer getCustomer() {
    return customer;
  }

  public void setCustomer(Customer customer) {
    this.customer = customer;
  }

  public int getTableNum() {
    return tableNum;
  }

  public void setTableNum(int tableNum) {
    this.tableNum = tableNum;
  }

  public LocalDateTime getOrderPlaced() {
    return orderPlaced;
  }

  public void setOrderPlaced(LocalDateTime orderPlaced) {
    this.orderPlaced = orderPlaced;
  }

  public List<OrderMenuItem> getOrderMenuItems() {
    return orderMenuItems;
  }

  public void setOrderMenuItems(List<OrderMenuItem> orderMenuItems) {
    this.orderMenuItems = orderMenuItems;
  }

  /**
   * Adds a menu item to the order with a specified quantity.
   *
   * @param menuItem the menu item to add
   * @param quantity the quantity of the item
   */
  public void addItemToCart(MenuItem menuItem, int quantity) {
    OrderMenuItem orderMenuItem = new OrderMenuItem(this, menuItem, quantity, false);
    this.orderMenuItems.add(orderMenuItem);
  }

  public OrderStatus getOrderStatus() {
    return orderStatus;
  }

  public void setOrderStatus(OrderStatus orderStatus) {
    this.orderStatus = orderStatus;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Order order = (Order) o;
    return orderId == order.orderId && tableNum == order.tableNum
        && Objects.equals(orderPlaced, order.orderPlaced);
  }

  @Override
  public int hashCode() {
    return Objects.hash(orderId, tableNum, orderPlaced);
  }

  public boolean isOrderPaid() {
    return orderPaid;
  }

  public void setOrderPaid(boolean orderPaid) {
    this.orderPaid = orderPaid;
  }

}
