package rhul.cs2810.controller;

import org.springframework.stereotype.Service;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.model.Order;

@Service
public class OrderService {

  private Order order = new Order();

  public Order getOrder() {
    return order;
  }

  public Order addItemToCart(MenuItem item) {
    order.addItemToCart(item, order.getOrderedItems().getOrDefault(item, 0) + 1);
    return order;
  }

  public Order removeItemFromCart(MenuItem item) {
    order.removeItemsFromCart(item);
    return order;
  }
}
