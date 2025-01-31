package rhul.cs2810;

import java.util.List;

public class Customer {

  String name;
  int order_No;
  List<MenuItem> orderedItems;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public int getOrder_No() {
    return order_No;
  }

  public void setOrder_No(int order_No) {
    this.order_No = order_No;
  }

  public List<MenuItem> getOrderedItems() {
    return orderedItems;
  }

  public void setOrderedItems(List<MenuItem> orderedItems) {
    this.orderedItems = orderedItems;
  }

}
