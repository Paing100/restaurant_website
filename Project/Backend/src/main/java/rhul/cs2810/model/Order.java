package rhul.cs2810.model;

import java.util.HashMap;
import java.util.Map;


/**
 * Represents an Order class to handle customers orders.
 */
public class Order {
  int orderId;
  Customer customer;
  Map<MenuItem, Integer> orderedItems;
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


}
