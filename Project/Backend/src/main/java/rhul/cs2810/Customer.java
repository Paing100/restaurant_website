package rhul.cs2810;

import java.util.List;
import java.util.Set;

public class Customer {

  int order_No;
  List<MenuItem> orderedItems;
  List<MenuItem> menuItems;
  Menu menu;

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

  public List<MenuItem> filterMenu(Set<DiretaryRestrictions> filter) {
    return menu.getDiretaryRestrictions(filter);
  }

  public void order() {
    for (MenuItem item : orderedItems) {
      System.out.print(item);
    }
  }
}
