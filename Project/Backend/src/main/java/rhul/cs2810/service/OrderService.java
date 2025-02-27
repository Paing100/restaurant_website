package rhul.cs2810.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import rhul.cs2810.model.Customer;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderMenuItem;
import rhul.cs2810.model.OrderMenuItemId;
import rhul.cs2810.repository.CustomerRepository;
import rhul.cs2810.repository.MenuItemRepository;
import rhul.cs2810.repository.OrderMenuItemRepository;
import rhul.cs2810.repository.OrderRepository;

@Service
public class OrderService {

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private OrderMenuItemRepository orderMenuItemRepository;

  @Autowired
  private MenuItemRepository menuItemRepository;

  public Order getOrder(int orderId) {
    return orderRepository.findById(orderId).orElse(null);
  }

  public void addItemToOrder(int orderId, int itemId, int quantity) {
    Order order = orderRepository.findById(orderId).orElseThrow(
        () -> new IllegalArgumentException("Order with ID " + orderId + " not found."));

    MenuItem item = menuItemRepository.findById(itemId).orElseThrow(
        () -> new IllegalArgumentException("Menu item with ID " + itemId + " not found."));

    OrderMenuItem orderMenuItem = new OrderMenuItem(order, item, quantity);
    orderMenuItemRepository.save(orderMenuItem);
  }

  public void removeItemFromOrder(int orderId, int itemId) {
    OrderMenuItemId orderMenuItemId = new OrderMenuItemId(orderId, itemId);
    orderMenuItemRepository.deleteById(orderMenuItemId);
  }

  public void submitOrder(Order order) {
    orderRepository.save(order);
  }
}
