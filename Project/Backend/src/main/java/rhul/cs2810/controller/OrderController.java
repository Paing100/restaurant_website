package rhul.cs2810.controller;

import java.time.LocalDateTime;
import java.util.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import rhul.cs2810.model.*;
import rhul.cs2810.repository.OrderMenuItemRepository;
import rhul.cs2810.repository.OrderRepository;
import rhul.cs2810.service.OrderService;
import rhul.cs2810.service.NotificationService;
import rhul.cs2810.service.WaiterService;

/**
 * Controller for order.s
 */
@RestController
@RequestMapping("/api")
public class OrderController {

  @Autowired
  private OrderService orderService;

  @Autowired
  private NotificationService notificationService;

  @Autowired
  private EntityManager entityManager;

  @Autowired
  private WaiterService waiterService;

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private OrderMenuItemRepository orderMenuItemRepository;


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

  @PostMapping("orders/{orderId}/addComment")
  public ResponseEntity<String> addCommentToOrder(@PathVariable int orderId, @RequestParam int itemId, @RequestParam int quantity, @RequestParam String comment) {
    orderService.addCommentToOrder(orderId, itemId, quantity, comment);
    return ResponseEntity.ok("Comment added to the item of the order");
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
   * Cancels an order.
   * 
   * @param orderId of the order
   * @return a response entity with a success or error message
   */
  @Transactional
  @DeleteMapping("/order/{orderId}/cancelOrder")
  public ResponseEntity<String> cancelOrder(@PathVariable int orderId) {
    try {
      orderService.cancelOrder(orderId);
      return ResponseEntity.ok("Order deleted successfully");
    }
    catch(NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
    catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
  }

  /**
   * Submits an order.
   * 
   * @param orderId of the order that needs to be submitted
   * @return a saved order
   */
  @PostMapping("/order/{orderId}/submitOrder")
  public ResponseEntity<String> submitOrder(@PathVariable int orderId) {
    try {
      orderService.submitOrder(orderId);
      return ResponseEntity.ok("Order submitted successfully");
    }
    catch(NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
    catch (IllegalStateException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error submitting order: " + e.getMessage());
    }
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

  @GetMapping("/{orderId}/comments")
  public ResponseEntity<Map<String, String>> getComments(@PathVariable int orderId) {
    return ResponseEntity.ok(orderService.getComments(orderId));
  }

  /**
   * Update the status of an order.
   * 
   * @param orderId of the order
   * @param param of Map with orderStatus as a key and related value
   * @return
   */
  @PostMapping("/order/{orderId}/updateOrderStatus")
  public ResponseEntity<String> updateOrderStatus(@PathVariable int orderId,
    @RequestBody Map<String, String> param) {
    try {
      Order order = orderService.updateOrderStatus(orderId, param);
      return ResponseEntity.ok("Order Status changed to " + order.getOrderStatus());
    }
    catch (NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
    catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
  }

  /**
   * Update the status of order paid for.
   * 
   * @param orderId of the order
   * @return
   */
  @PostMapping("/order/{orderId}/markAsPaid")
  public ResponseEntity<String> markOrderAsPaid(@PathVariable int orderId) {
    try {
      orderService.markOrderAsPaid(orderId);
      return ResponseEntity.ok("Order marked as paid successfully");
    }
    catch (NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
    catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
  }

  /**
   * Updates an order's table number and reassigns the waiter if needed.
   * 
   * @param orderId the ID of the order to update
   * @param updateRequest a map containing the new table number
   * @return ResponseEntity with success or error message
   */
  @PostMapping("/orders/{orderId}/updateOrder")
  public ResponseEntity<String> updateOrder(@PathVariable int orderId, @RequestBody Map<String, Integer> updateRequest) {
    try {
      orderService.updateOrderDetails(orderId, updateRequest);
      return ResponseEntity.ok("Order updated successfully");
    }
    catch(NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
    catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
    catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
  }
}
