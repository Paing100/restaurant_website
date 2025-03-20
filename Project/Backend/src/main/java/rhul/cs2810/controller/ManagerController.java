package rhul.cs2810.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.model.Employee;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderStatus;
import rhul.cs2810.repository.CustomerRepository;
import rhul.cs2810.repository.EmployeeRepository;
import rhul.cs2810.repository.MenuItemRepository;
import rhul.cs2810.repository.OrderRepository;
import rhul.cs2810.service.OrderService;

@RestController
public class ManagerController {

  @Autowired
  private OrderService orderService;
  @Autowired

  private final CustomerRepository customerRepository;
  private final EmployeeRepository employeeRepository;
  private final OrderRepository orderRepository;
  private final MenuItemRepository menuItemRepository;


  public ManagerController(CustomerRepository customerRepository,
      EmployeeRepository employeeRepository, OrderRepository orderRepository,
      MenuItemRepository menuItemRepository) {
    this.customerRepository = customerRepository;
    this.orderRepository = orderRepository;
    this.menuItemRepository = menuItemRepository;
    this.employeeRepository = employeeRepository;
  }

  @GetMapping("/Manager/getOutstandingOrders")
  public ResponseEntity<List<Order>> getOutstandingOrders() {

    List<Order> orders = orderService.getAllOrders();
    List<Order> outstandingOrders = new ArrayList<Order>();

    for (Order order : orders) {
        outstandingOrders.add(order);
    }
    return ResponseEntity.ok(outstandingOrders);
  }

  @GetMapping("/Manager/calculateRecommendedPrice") // redundant?
  public ResponseEntity<Double> calculateRecommendedPrice(@RequestParam double cost, @RequestParam double margin) {
    return ResponseEntity.ok((double) Math.round(cost/(1-margin))); // 60% markup?

  }

  @GetMapping("/Manager/showAllStock")
  public ResponseEntity<String> showAllStock() { // should be done in front end?
    List<MenuItem> menuItems = (List<MenuItem>) menuItemRepository.findAll();
    StringBuilder data = new StringBuilder();
    StringBuilder dataOut = new StringBuilder();

    for (MenuItem menuItem : menuItems) {
      String available = "AVAILABLE";
      if (!menuItem.isAvailable()) {
        available = "OUT OF STOCK";
        dataOut.append(menuItem.getName()).append(": ").append(available).append("\n");
      } else {
        data.append(menuItem.getName()).append(": ").append(available).append("\n");
      }

    }

    String availableItems = data.toString();
    String outOfStockItems = dataOut.toString();
    return ResponseEntity.ok(availableItems + "\n" + outOfStockItems);
  }

  @GetMapping("/Manager/getAllEmployeeData")
  public ResponseEntity<List<Employee>> getAllEmployeeData(){
    List<Employee> employeesList = new ArrayList<>();
    for (Employee employee: employeeRepository.findAll()){
      employeesList.add(employee);
    }
    return ResponseEntity.ok(employeesList);
  }

  // @PostMapping("/Manager/getWaiterSales")
  // public ResponseEntity<List<Order>> getWaiterSales(@RequestParam String waiter_id) {
  // Optional<Employee> waiterOptional = employeeRepository.findByEmployeeId(waiter_id);
  // Employee waiter = waiterOptional.get();
  // String waiterName = waiter.getFirstName() + " " + waiter.getLastName();
  //
  // List<Order> orders = orderService.getAllOrders();
  // List<Order> waiterOrders = new ArrayList<Order>();
  //
  // for (Order order : orders) {
  //
  // }
  // }
  //
  // }



}
