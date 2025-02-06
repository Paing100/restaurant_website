package rhul.cs2810;

import java.util.List;
import java.util.Set;

public class Customer {

  int order_No; // have this be ID?
  List<MenuItem> orderedItems;
  List<MenuItem> menuItems;
  Menu menu;

  public Customer(int order_No, List<MenuItem> orderedItems, List<MenuItem> menuItems, Menu menu) {
    this.order_No = order_No;
    this.orderedItems = orderedItems;
    this.menuItems = menuItems;
    this.menu = menu;

  }

  public void viewMenu() {
    menuItems = menu.getMenuItems();
    for (MenuItem item : menuItems) {
      System.out.print(item);
    }
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
    for (MenuItem item : orderedItems) {
      System.out.print(item);
    }
  }
}
