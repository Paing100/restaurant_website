package rhul.cs2810.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Represents a customer in the restaurant system.
 */
public class Customer {

  /** The order number associated with the customer. */
  int orderNo; // have this be ID?

  /** List of items ordered by the customer. */
  List<MenuItem> orderedItems;

  /** List of available menu items. */
  List<MenuItem> menuItems;

  /** The menu available to the customer. */
  Menu menu;

  /**
   * Constructs a Customer with specified order number, ordered items, menu items, and menu.
   *
   * @param orderNo the order number
   * @param orderedItems the list of items ordered
   * @param menuItems the list of available menu items
   * @param menu the menu
   */
  public Customer(int orderNo, List<MenuItem> orderedItems, List<MenuItem> menuItems, Menu menu) {
    this.orderNo = orderNo;
    this.orderedItems = orderedItems;
    this.menuItems = menuItems;
    this.menu = menu;
  }

  /**
   * Constructs a Customer with an empty order list and a new menu.
   */
  public Customer() {
    this.menu = new Menu();
    this.orderedItems = new ArrayList<>();
  }

  /**
   * Returns a formatted string representation of the menu.
   *
   * @return the menu as a string
   */
  public String viewMenu() {
    StringBuilder menuOutput = new StringBuilder();
    for (MenuItem item : menu.getMenuItems()) {
      menuOutput.append(item.toString()).append("\n");
    }
    return menuOutput.toString();
  }

  /**
   * Gets the order number.
   *
   * @return the order number
   */
  public int getOrderNo() {
    return orderNo;
  }

  /**
   * Sets the order number.
   *
   * @param orderNo the order number to set
   */
  public void setOrderNo(int orderNo) {
    this.orderNo = orderNo;
  }

  /**
   * Gets the list of items ordered by the customer.
   *
   * @return the list of ordered items
   */
  public List<MenuItem> getOrderedItems() {
    return orderedItems;
  }

  /**
   * Sets the list of items ordered by the customer.
   *
   * @param orderedItems the list of ordered items to set
   */
  public void setOrderedItems(List<MenuItem> orderedItems) {
    this.orderedItems = orderedItems;
  }

  /**
   * Gets the list of available menu items.
   *
   * @return the list of menu items
   */
  public List<MenuItem> getMenuItems() {
    return menuItems;
  }

  /**
   * Sets the list of available menu items.
   *
   * @param menuItems the list of menu items to set
   */
  public void setMenuItems(List<MenuItem> menuItems) {
    this.menuItems = menuItems;
  }

  /**
   * Gets the menu available to the customer.
   *
   * @return the menu
   */
  public Menu getMenu() {
    return menu;
  }

  /**
   * Sets the menu available to the customer.
   *
   * @param menu the menu to set
   */
  public void setMenu(Menu menu) {
    this.menu = menu;
  }

  /**
   * Adds an item to the customer's cart.
   *
   * @param newItem the menu item to add
   */
  public void addItemToCart(MenuItem newItem) {
    orderedItems.add(newItem);
  }

  /**
   * Removes an item from the customer's cart.
   *
   * @param menuItem the menu item to remove
   */
  public void removeItemFromCart(MenuItem menuItem) {
    orderedItems.remove(menuItem);
  }

  /**
   * Filters the menu based on dietary restrictions.
   *
   * @param filter the set of dietary restrictions
   * @return a list of menu items that meet the dietary restrictions
   */
  public List<MenuItem> filterMenu(Set<DietaryRestrictions> filter) {
    return menu.getDietaryRestrictions(filter);
  }

  /**
   * Processes the customer's order. Prints the order and clears the cart.
   */
  public void order() {
    if (this.orderedItems.isEmpty()) {
      System.out.println("Cart is empty!");
      return;
    }
    for (MenuItem item : orderedItems) {
      System.out.print(item);
    }
    this.orderedItems.clear();
  }
}
