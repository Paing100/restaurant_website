package rhul.cs2810;

import java.util.List;

public class Customer {

  int order_No;
  List<MenuItem> orderedItems;

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
