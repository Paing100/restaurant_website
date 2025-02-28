package rhul.cs2810.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import rhul.cs2810.model.Order;
import rhul.cs2810.service.OrderService;

@RestController
@RequestMapping("/api")
public class OrderController {

  @Autowired
  private OrderService orderService;

  @GetMapping("/orders/{orderId}/getOrder")
  public ResponseEntity<Order> getOrder(@PathVariable int orderId) {
    Order order = orderService.getOrder(orderId);
    return ResponseEntity.ok(order);
  }

  @PostMapping("/orders/{orderId}/addItems")
  public ResponseEntity<String> addItemToOrder(@PathVariable int orderId, @RequestParam int itemId,
      @RequestParam int quantity) {
    orderService.addItemToOrder(orderId, itemId, quantity);
    return ResponseEntity.ok("Item added to order");
  }

  @DeleteMapping("/orders/{orderId}/removeItems")
  public ResponseEntity<String> removeItemFromOrder(@PathVariable int orderId,
      @RequestParam int itemId) {
    orderService.removeItemFromOrder(orderId, itemId);
    return ResponseEntity.ok("Item removed from order");
  }

  @PostMapping("/Order/{orderId}/submitOrder")
  public ResponseEntity<String> submitOrder(@PathVariable int orderId) {
    orderService.submitOrder(orderId);
    return ResponseEntity.ok("Order submitted successfully");
  }

  @GetMapping("/Order/getAllOrders")
  public ResponseEntity<List<Order>> getAllOrders() {
    List<Order> orders = orderService.getAllOrders();
    return ResponseEntity.ok(orders);
  }

}
