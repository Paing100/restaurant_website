package rhul.cs2810.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

  @Transactional
  @DeleteMapping("/order/{orderId}/cancelOrder")
  public ResponseEntity<String> cancelOrder(@PathVariable int orderId) {
    Order order = orderService.getOrder(orderId);
    if (order == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
    }

    if (order.getWaiter() != null && order.getWaiter().getEmployee() != null) {
      String waiterId = order.getWaiter().getEmployee().getEmployeeId();
      notificationService.sendNotification("ORDER_CANCELLED", orderId, "customer",
        "#" + orderId + " is cancelled by waiter", waiterId);
    }

    Query query = entityManager.createNativeQuery("DELETE FROM orders WHERE order_id = :orderId");
    query.setParameter("orderId", orderId);
    int rowDeleted = query.executeUpdate();

    if (rowDeleted > 0) {
      return ResponseEntity.ok("Order deleted successfully");
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
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
        Optional<Order> orderOptional = Optional.ofNullable(orderService.getOrder(orderId));
        if (orderOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }

        Order order = orderOptional.get();

        order.setOrderPlaced(LocalDateTime.now());
        orderService.saveUpdatedOrder(order);

        orderService.submitOrder(orderId);

        if (order.getWaiter() != null && order.getWaiter().getEmployee() != null) {
            String waiterId = order.getWaiter().getEmployee().getEmployeeId();
            notificationService.sendNotification("ORDER_SUBMITTED", orderId, "kitchen", "A new order has been submitted", waiterId);
        }
        
        return ResponseEntity.ok("Order submitted successfully");
    } catch (IllegalStateException e) {
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
    Employee employee = order.getWaiter().getEmployee();
    String waiterId = employee.getEmployeeId();
    order.setOrderStatus(orderStatus);
    orderService.saveUpdatedOrder(order);
    if (param.get("orderStatus").equals("READY")) {
      notificationService.sendNotification("READY", orderId, "waiter",
          orderId + " is ready to be delivered", waiterId);
    } else {
      notificationService.sendNotification(param.get("orderStatus"), orderId, "kitchen",
          "Order # " + orderId + " has been confirmed", waiterId);
    }
    return ResponseEntity.ok("Order Status changed to " + order.getOrderStatus());
  }

  // @GetMapping("/order/{orderId}/getOrderStatus")
  // public ResponseEntity<OrderStatus> getOrderStatus(@PathVariable int orderId){
  // Optional<Order> orderOptional = Optional.ofNullable(orderService.getOrder(orderId));
  //
  // if (!orderOptional.isPresent()){
  // // do something
  // }
  //
  // Order order = orderOptional.get();
  // OrderStatus status = order.getOrderStatus();
  // return ResponseEntity.ok(status);
  // }


  /**
   * Update the status of order paid for.
   * 
   * @param orderId of the order
   * @return
   */
  @PostMapping("/order/{orderId}/markAsPaid")
  public ResponseEntity<String> markOrderAsPaid(@PathVariable int orderId) {
    Optional<Order> orderOptional = Optional.ofNullable(orderService.getOrder(orderId));

    if (!orderOptional.isPresent()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found!");
    }

    Order order = orderOptional.get();
    order.setOrderPaid(true);
    orderService.saveUpdatedOrder(order);

    return ResponseEntity.ok("Order marked as paid successfully");
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
          Optional<Order> orderOptional = Optional.ofNullable(orderService.getOrder(orderId));
          if (orderOptional.isEmpty()) {
              return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
          }

          Order order = orderOptional.get();
          Integer newTableNum = updateRequest.get("tableNum");
          
          if (newTableNum == null) {
              return ResponseEntity.badRequest().body("Table number is required");
          }

          // Try to find a waiter for the new table
          Optional<Waiter> newWaiter = waiterService.findWaiterForTable(newTableNum);
          if (newWaiter.isEmpty()) {
              return ResponseEntity.badRequest().body("No waiter available for the new table");
          }

          order.setTableNum(newTableNum);
          order.setWaiter(newWaiter.get());
          orderService.saveUpdatedOrder(order);

          return ResponseEntity.ok("Order updated successfully");
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .body("Error updating order: " + e.getMessage());
      }
  }
}
