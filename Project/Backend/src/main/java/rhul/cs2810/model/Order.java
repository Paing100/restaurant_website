package rhul.cs2810.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyJoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import rhul.cs2810.serializer.MenuItemKeyDeserializer;
import rhul.cs2810.serializer.MenuItemKeySerializer;

/**
 * Represents an Order class to handle customers orders.
 */
@Entity
@Table(name = "ORDERS")
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "order_id")
  int orderId;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "customer_id", unique = true)
  @JsonBackReference
  Customer customer;

  @ElementCollection
  @CollectionTable(name = "order_menu_items", joinColumns = @JoinColumn(name = "order_id"))
  @MapKeyJoinColumn(name = "item_id")
  @JsonSerialize(keyUsing = MenuItemKeySerializer.class)
  @JsonDeserialize(keyUsing = MenuItemKeyDeserializer.class)
  Map<MenuItem, Integer> orderedItems;

  @Column(name = "total_price")
  double totalPrice;

  /**
   * Creates an order object with empty hashmap.
   */
  public Order() {
    this.orderedItems = new HashMap<>();
  }

  /**
   * Creates an order object with empty hashmap, given id, customer
   */
  public Order(int orderId, Customer customer) {
    this.orderId = orderId;
    this.customer = customer;
    this.orderedItems = new HashMap<>();
  }

  /**
   * Creates an order object with a customer, initializing an empty cart.
   *
   * @param customer the customer associated with the order
   */
  public Order(Customer customer) {
    this.customer = customer;
    this.orderedItems = new HashMap<>();
  }

  /**
   * Creates an order object with customer object and menuitems.
   *
   * @param customer
   * @param orderedItems
   */
  public Order(Customer customer, Map<MenuItem, Integer> orderedItems) {
    this.customer = customer;
    this.orderedItems = orderedItems;
    this.totalPrice = calculateTotal();
  }

  /**
   * Calculates the total price of the order.
   *
   * @return the total price in double
   */
  private double calculateTotal() {
    this.totalPrice = 0;
    for (Map.Entry<MenuItem, Integer> entry : orderedItems.entrySet()) {
      this.totalPrice += entry.getKey().getPrice() * entry.getValue();
    }
    return this.totalPrice;
  }

  /**
   * Getter for customer.
   *
   * @return customer
   */
  public Customer getCustomer() {
    return customer;
  }

  /**
   * Setter for customer.
   *
   * @param customer
   */
  public void setCustomer(Customer customer) {
    this.customer = customer;
  }

  /**
   * Getter for ordered items.
   *
   * @return orderedItems as Map
   */
  public Map<MenuItem, Integer> getOrderedItems() {
    return orderedItems;
  }

  /**
   * Setter for ordered items.
   *
   * @param orderedItems
   */
  public void setOrderedItems(Map<MenuItem, Integer> orderedItems) {
    this.orderedItems = orderedItems;
    calculateTotal();
  }

  /**
   * Getter for total price.
   *
   * @return total in double
   */
  public double getTotalPrice() {
    return totalPrice;
  }

  /**
   * Removes an item from the customer's cart.
   *
   * @param menuItem the menu item to remove
   */
  public void removeItemsFromCart(MenuItem menuItem) {
    if (this.orderedItems.isEmpty()) {
      return;
    }
    if (this.orderedItems.containsKey(menuItem)) {
      this.orderedItems.remove(menuItem);
    }
  }

  /**
   * Adds an item to the customer's cart.
   *
   * @param newItem the menu item to add
   */
  public void addItemToCart(MenuItem newItem, int quantity) {
    orderedItems.put(newItem, quantity);
  }

  public int getOrderId() {
    return orderId;
  }

}
