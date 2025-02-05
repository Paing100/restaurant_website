package rhul.cs2810;

import java.util.List;
import java.util.Set;

public class Customer {

  int order_No;
  List<MenuItem> orderedItems;

  public void viewMenu() {

  }

  public void addItemToCart() {

  }

  public void removeItemFromCart() {

  }

  public List<MenuItem> filterMenu(Set<DiretaryRestrictions> filter) {
    return orderedItems;
  }

  public void order() {
    for (MenuItem item : orderedItems) {
      System.out.print(item);
    }
  }
}
