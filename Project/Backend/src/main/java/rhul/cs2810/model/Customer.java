package rhul.cs2810.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class Customer {

  int orderNo; // have this be ID?
  List<MenuItem> orderedItems;
  List<MenuItem> menuItems;
  Menu menu;

  public Customer(int orderNo, List<MenuItem> orderedItems, List<MenuItem> menuItems, Menu menu) {
    this.orderNo = orderNo;
    this.orderedItems = orderedItems;
    this.menuItems = menuItems;
    this.menu = menu;
  }

  public Customer() {
    this.menu = new Menu();
    this.orderedItems = new ArrayList<>();
  }


  public String viewMenu() {
    StringBuilder menuOutput = new StringBuilder();
    for (MenuItem item : menu.getMenuItems()) {
      menuOutput.append(item.toString()).append("\n");
    }
    return menuOutput.toString();
  }


  public int getOrderNo() {
    return orderNo;
  }

  public void setOrderNo(int orderNo) {
    this.orderNo = orderNo;
  }

  public List<MenuItem> getOrderedItems() {
    return orderedItems;
  }

  public void setOrderedItems(List<MenuItem> orderedItems) {
    this.orderedItems = orderedItems;
  }

  public List<MenuItem> getMenuItems() {
    return menuItems;
  }

  public void setMenuItems(List<MenuItem> menuItems) {
    this.menuItems = menuItems;
  }

  public Menu getMenu() {
    return menu;
  }

  public void setMenu(Menu menu) {
    this.menu = menu;
  }

  public void addItemToCart(MenuItem newItem) {
    orderedItems.add(newItem);
  }

  public void removeItemFromCart(MenuItem menuItem) {
    orderedItems.remove(menuItem);
  }

  public List<MenuItem> filterMenu(Set<DietaryRestrictions> filter) {
    return menu.getDietaryRestrictions(filter);
  }

  public void order() {
    if (this.orderedItems.isEmpty()) {
      System.out.println("Cart is empty!");
    }
    for (MenuItem item : orderedItems) {
      System.out.print(item);
    }
    this.orderedItems.clear();
  }
}
