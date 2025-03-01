package rhul.cs2810.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import rhul.cs2810.model.MenuItem;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderMenuItem;
import rhul.cs2810.model.OrderMenuItemId;
import rhul.cs2810.model.OrderStatus;
import rhul.cs2810.repository.MenuItemRepository;
import rhul.cs2810.repository.OrderMenuItemRepository;
import rhul.cs2810.repository.OrderRepository;

/**
 * A class contains business logic of Order
 */
@Service
public class OrderService {

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private OrderMenuItemRepository orderMenuItemRepository;

  @Autowired
  private MenuItemRepository menuItemRepository;

  /**
   * Retrieves a specific order from the given id.
   *
   * @param orderId
   * @return order matches the id
   */
  public Order getOrder(int orderId) {
    return orderRepository.findById(orderId).orElse(null);
  }

  /**
   * Adds an item to order.
   *
   * @param orderId of the order
   * @param itemId of the item
   * @param quantity of the item
   */
  public void addItemToOrder(int orderId, int itemId, int quantity) {
    Order order = orderRepository.findById(orderId).orElseThrow(
        () -> new IllegalArgumentException("Order with ID " + orderId + " not found."));

    MenuItem item = menuItemRepository.findById(itemId).orElseThrow(
        () -> new IllegalArgumentException("Menu item with ID " + itemId + " not found."));

    OrderMenuItem orderMenuItem = new OrderMenuItem(order, item, quantity);
    orderMenuItemRepository.save(orderMenuItem);
  }

  /**
   * Removes an item from order.
   *
   * @param orderId of the order
   * @param itemId of the item
   */
  public void removeItemFromOrder(int orderId, int itemId) {
    OrderMenuItemId orderMenuItemId = new OrderMenuItemId(orderId, itemId);
    orderMenuItemRepository.deleteById(orderMenuItemId);
  }

  /**
   * Submits an order to the repository.
   *
   * @param orderId of the order
   * @throws Exception
   */
  public void submitOrder(int orderId) {
    Optional<Order> orderOptional = orderRepository.findById(orderId);
    if (orderOptional.isPresent()) {
      Order order = orderOptional.get();
      order.setOrderStatus(OrderStatus.SUBMITTED);
      orderRepository.save(order);
    }
  }

  /**
   * Retrieves all orders.
   *
   * @return a list of orders
   */
  public List<Order> getAllOrders() {
    return (List<Order>) orderRepository.findAll();
  }

  public void saveUpdatedOrder(Order order) {
    orderRepository.save(order);
  }

}
