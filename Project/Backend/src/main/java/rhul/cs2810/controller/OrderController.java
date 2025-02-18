package rhul.cs2810.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.model.Order;
import rhul.cs2810.service.OrderService;

@RestController
@RequestMapping("/api")
public class OrderController {

  @Autowired
  private OrderService orderService;

  @GetMapping("/cart")
  public ResponseEntity<Order> getCart() {
    Order order = orderService.getOrder();
    return ResponseEntity.ok(order);
  }

  @PostMapping("/cart")
  public ResponseEntity<Order> addItemToCart(@RequestBody MenuItem item) {
    Order order = orderService.addItemToCart(item);
    return ResponseEntity.ok(order);
  }

  @PostMapping("/cart/remove")
  public ResponseEntity<Order> removeItemFromCart(@RequestBody MenuItem item) {
    Order order = orderService.removeItemFromCart(item);
    return ResponseEntity.ok(order);
  }

  @PostMapping("/orders")
  public ResponseEntity<String> submitOrder(@RequestBody Order order) {
    orderService.submitOrder(order);
    return ResponseEntity.ok("Order submitted successfully");
  }
}