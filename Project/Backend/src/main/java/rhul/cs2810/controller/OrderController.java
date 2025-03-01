package rhul.cs2810.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderStatus;
import rhul.cs2810.service.OrderService;

/**
 * Controller for order.s
 */
@RestController
@RequestMapping("/api")
public class OrderController {

  @Autowired
  private OrderService orderService;

  /**
   * Retrieves a specific order with id.
   * 
   * @param orderId of the order
   * @return a saved order of the id
   */
  @GetMapping("/orders/{orderId}/getOrder")
  public ResponseEntity<Order> getOrder(@PathVariable int orderId) {
    Order order = orderService.getOrder(orderId);
    return ResponseEntity.ok(order);
  }

  /**
   * Adds a menu item to order.
   *
   * @param orderId of the order
   * @param itemId of the item that wish to be added in the order
   * @param quantity of the item
   * @return a saved order with the item and quantity
   */
  @PostMapping("/orders/{orderId}/addItems")
  public ResponseEntity<String> addItemToOrder(@PathVariable int orderId, @RequestParam int itemId,
      @RequestParam int quantity) {
    orderService.addItemToOrder(orderId, itemId, quantity);
    return ResponseEntity.ok("Item added to order");
  }

  /**
   * Deletes a specific item from order.
   *
   * @param orderId of the order
   * @param itemId of the item that wish to be deleted from the order
   * @return a saved order with the specified item removed
   */
  @DeleteMapping("/orders/{orderId}/removeItems")
  public ResponseEntity<String> removeItemFromOrder(@PathVariable int orderId,
      @RequestParam int itemId) {
    orderService.removeItemFromOrder(orderId, itemId);
    return ResponseEntity.ok("Item removed from order");
  }

  /**
   * Submits an order.
   * 
   * @param orderId of the order that needs to be submitted
   * @return a saved order
   */
  @PostMapping("/order/{orderId}/submitOrder")
  public ResponseEntity<String> submitOrder(@PathVariable int orderId) {
    orderService.submitOrder(orderId);
    return ResponseEntity.ok("Order submitted successfully");
  }

  /**
   * Retrieves all orders.
   *
   * @return a list of all orders.
   */
  @GetMapping("/order/getAllOrders")
  public ResponseEntity<List<Order>> getAllOrders() {
    List<Order> orders = orderService.getAllOrders();
    return ResponseEntity.ok(orders);
  }

  @PostMapping("/order/{orderId}/updateOrderStatus")
  public ResponseEntity<String> updateOrderStatus(@PathVariable int orderId,
      @RequestBody Map<String, String> param) {
    Optional<Order> orderOptional = Optional.ofNullable(orderService.getOrder(orderId));

    if (!orderOptional.isPresent()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found!");
    }

    Order order = orderOptional.get();
    String status = param.get("orderStatus");
    if (status != null) {
      status = status.toUpperCase();
    }
    OrderStatus orderStatus = OrderStatus.valueOf(status);
    order.setOrderStatus(orderStatus);
    orderService.saveUpdatedOrder(order);
    return ResponseEntity.ok("Order Status changed to " + order.getOrderStatus());
  }


}
