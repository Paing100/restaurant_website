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

  @ManyToOne
  @JoinColumn(name = "waiter_id", referencedColumnName = "waiter_id")
  private Waiter waiter;

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

  /**
   * Default constructor for the Order class.
   */
  public Order() {
    this.orderStatus = OrderStatus.CREATED;
    this.orderPaid = false;
  }

  /**
   * Constructs an Order object with the specified parameters.
   * 
   * @param tableNum 
   * @param orderPlaced
   * @param customer
   */
  public Order(int tableNum, LocalDateTime orderPlaced, Customer customer) {
    this.customer = customer;
    this.orderPlaced = LocalDateTime.now();
    this.tableNum = tableNum;
    this.orderStatus = OrderStatus.CREATED;
    this.orderPaid = false;
  }

  /**
   * Gets the order ID.
   * 
   * @return the order ID
   */
  public int getOrderId() {
    return orderId;
  }

  /**
   * Sets the order ID.
   * 
   * @param orderId the order ID to be set
   */
  public void setOrderId(int orderId) {
    this.orderId = orderId;
  }

  /**
   * Gets the customer associated to the order.
   * 
   * @return the customer associated to the order
   */
  public Customer getCustomer() {
    return customer;
  }

  /**
   * Sets the customer associated to the order.
   * 
   * @param customer the customer to be set
   */
  public void setCustomer(Customer customer) {
    this.customer = customer;
  }

  /**
   * Gets the table number associated to the order.
   * 
   * @return the table number associated to the order
   */
  public int getTableNum() {
    return tableNum;
  }

  /**
   * Sets the table number associated to the order.
   * 
   * @param tableNum the table number to be set
   */
  public void setTableNum(int tableNum) {
    this.tableNum = tableNum;
  }

  /**
   * Gets the waiter associated to the order.
   * 
   * @return the waiter associated to the order
   */
  public Waiter getWaiter() {
    return waiter;
  }

  /**
   *  Sets the waiter associated to the order.
   * 
   * @param waiter the waiter to be set
   */
  public void setWaiter(Waiter waiter) {
    this.waiter = waiter;
  }

  /**
   * Gets the date and time when the order was placed.
   * 
   * @return the date and time when the order was placed
   */
  public LocalDateTime getOrderPlaced() {
    return orderPlaced;
  }

  /**
   * Sets the date and time when the order was placed.
   * 
   * @param orderPlaced the date and time to be set
   */
  public void setOrderPlaced(LocalDateTime orderPlaced) {
    this.orderPlaced = orderPlaced;
  }

  /**
   * Gets the list of menu items associated to the order.
   * 
   * @return the list of menu items associated to the order
   */
  public List<OrderMenuItem> getOrderMenuItems() {
    return orderMenuItems;
  }

  /**
   * Sets the list of menu items associated to the order.
   * 
   * @param orderMenuItems the list of menu items to be set
   */
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

  /**
   * Gets the order status.
   * 
   * @return the order status
   */
  public OrderStatus getOrderStatus() {
    return orderStatus;
  }

  /**
   * Sets the order status.
   * 
   * @param orderStatus the order status to be set
   */
  public void setOrderStatus(OrderStatus orderStatus) {
    this.orderStatus = orderStatus;
  }

  /**
   * Checks if two orders are equal based on order ID, table number, and order placement time.
   * 
   * @param o the object to compare
   * @return true if the orders are equal, if they are not, return false
   */
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

  /**
   * Generates a hash code for the order based on order ID, table number, and order placement time.
   * 
   * @return the hash code of the order
   */
  @Override
  public int hashCode() {
    return Objects.hash(orderId, tableNum, orderPlaced);
  }

  /**
   * Checks if the order is paid.
   * 
   * @return true if the order is paid, otherwise it returns false
   */
  public boolean isOrderPaid() {
    return orderPaid;
  }

  /**
   * Sets the order paid status.
   * 
   * @param orderPaid the order paid status to be set
   */
  public void setOrderPaid(boolean orderPaid) {
    this.orderPaid = orderPaid;
  }
}
