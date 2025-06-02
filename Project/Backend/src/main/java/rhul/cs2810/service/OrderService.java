package rhul.cs2810.service;

import java.time.LocalDateTime;
import java.util.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rhul.cs2810.model.*;
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

  @Autowired
  private NotificationService notificationService;

  @Autowired
  private WaiterService waiterService;

  @Autowired
  private EntityManager entityManager;

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

    if (order.getOrderStatus() != OrderStatus.CREATED) {
      throw new IllegalStateException("Cannot modify a submitted order.");
    }

    /*
     * if (order.getOrderStatus() != OrderStatus.CREATED) { throw new
     * IllegalStateException("Cannot modify a submitted order."); }
     */

    MenuItem item = menuItemRepository.findById(itemId).orElseThrow(
        () -> new IllegalArgumentException("Menu item with ID " + itemId + " not found."));

    OrderMenuItem orderMenuItem = new OrderMenuItem(order, item, quantity, false);
    orderMenuItemRepository.save(orderMenuItem);
  }

  /**
   * Removes an item from order.
   *
   * @param orderId of the order
   * @param itemId of the item
   */
  public void removeItemFromOrder(int orderId, int itemId) {
    Optional<Order> orderOptional = orderRepository.findById(orderId);

    if (orderOptional.isEmpty()) {
      throw new IllegalArgumentException("Order with ID " + orderId + " not found.");
    }

    Order order = orderOptional.get();

    if (order.getOrderStatus() != OrderStatus.CREATED) {
      throw new IllegalStateException("Cannot modify a submitted order.");
    }

    OrderMenuItemId orderMenuItemId = new OrderMenuItemId(orderId, itemId);
    orderMenuItemRepository.deleteById(orderMenuItemId);
  }

  /**
   * Submits an order to the repository.
   *
   * @param orderId of the order
   */
  public void submitOrder(int orderId) {

    Order order = getExistingOrderOrThrow(orderId);
    order.setOrderStatus(OrderStatus.SUBMITTED);
    order.setOrderPlaced(LocalDateTime.now());
    orderRepository.save(order);

    List<OrderMenuItem> orderItems = orderMenuItemRepository.findByOrder(order);
    for (OrderMenuItem item : orderItems) {
      item.setOrderSubmitted(true);
    }
    orderMenuItemRepository.saveAll(orderItems);
    notifyOrderDetails("ORDER_SUBMITTED", orderId, order, "kitchen", "A new order has been submitted");
  }

  private void notifyOrderDetails(String type, int orderId, Order order, String recipient, String message) {
    if (order.getWaiter() != null && order.getWaiter().getEmployee() != null) {
      String waiterId = order.getWaiter().getEmployee().getEmployeeId();
      notificationService.sendNotification(type, orderId, recipient, message, waiterId);
    }
    else {
      throw new IllegalArgumentException("Cannot notify: missing waiter or employee information for order ID " + orderId);
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

  /**
   * Saves the updated order status in the repository.
   *
   * @param order the order to update
   * @throws IllegalArgumentException if order is null
   */
  public void saveUpdatedOrder(Order order) {
    if (order == null) {
      throw new IllegalArgumentException("Order cannot be null");
    }
    orderRepository.save(order);
  }

  /**
   * Retrieves all menu items within an order.
   * 
   * @param orderId the ID of the order
   * @return a list of menu items within the order
   */
  public List<OrderMenuItem> getOrderedItems(int orderId) {
    Optional<Order> optionalOrder = orderRepository.findById(orderId);
    if (optionalOrder.isPresent()) {
      return optionalOrder.get().getOrderMenuItems();
    }
    return List.of();
  }

  public void updateOrderDetails(int orderId, Map<String, Integer> updateRequest){
    Order order = getExistingOrderOrThrow(orderId);

    Integer newTableNum = updateRequest.get("tableNum");

    if (newTableNum == null) {
      throw new IllegalArgumentException("Table number is required");
    }

    // Try to find a waiter for the new table
    Waiter newWaiter = getExistingWaiterOrThrow(newTableNum);

    order.setTableNum(newTableNum);
    order.setWaiter(newWaiter);
    this.saveUpdatedOrder(order);
  }

  private Order getExistingOrderOrThrow (int orderId) {
    return Optional.ofNullable(this.getOrder(orderId))
      .orElseThrow(() -> new NoSuchElementException("Order not found"));
  }

  private Waiter getExistingWaiterOrThrow (int tableNum) {
    return waiterService.findWaiterForTable(tableNum)
      .orElseThrow(() -> new IllegalArgumentException("No waiter available for the new table"));
  }

  public void markOrderAsPaid (int orderId) {
    Order order = getExistingOrderOrThrow(orderId);
    order.setOrderPaid(true);
    this.saveUpdatedOrder(order);
    this.submitOrder(orderId);
  }

  public Order updateOrderStatus(int orderId, Map<String, String> param) {
    Order order = getExistingOrderOrThrow(orderId);
    String status = param.get("orderStatus");
    if (status != null) {
      status = status.toUpperCase();
    }
    OrderStatus orderStatus = OrderStatus.valueOf(status);
    Employee employee = order.getWaiter().getEmployee();
    String waiterId = employee.getEmployeeId();
    order.setOrderStatus(orderStatus);
    this.saveUpdatedOrder(order);
    notifyOrderStatusChanges(orderId, waiterId, param);
    return order;
  }

  private void notifyOrderStatusChanges(int orderId, String waiterId, Map<String, String> param){
    if (param.get("orderStatus").equals("READY")) {
      notificationService.sendNotification("READY", orderId, "waiter",
        orderId + " is ready to be delivered", waiterId);
    } else {
      notificationService.sendNotification(param.get("orderStatus"), orderId, "kitchen",
        "Order # " + orderId + " has been confirmed", waiterId);
    }
  }

  public void cancelOrder(int orderId) {
    Order order = getExistingOrderOrThrow(orderId);
    notifyOrderDetails("ORDER_CANCELLED", orderId, order, "customer", "#" + orderId + " is cancelled by waiter");
    Query query = entityManager.createNativeQuery("DELETE FROM orders WHERE order_id = :orderId");
    query.setParameter("orderId", orderId);
    int rowDeleted = query.executeUpdate();

    if (rowDeleted == 0) {
      throw new NoSuchElementException("Order not found for deletion");
    }
  }

}
