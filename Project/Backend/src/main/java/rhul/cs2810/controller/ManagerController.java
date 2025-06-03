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
import rhul.cs2810.repository.*;
import rhul.cs2810.service.ManagerService;
import rhul.cs2810.service.OrderService;

/**
 * Controller class for the manager class.
 */
@RestController
public class ManagerController {

  @Autowired
  private OrderService orderService;
  @Autowired
  private CustomerRepository customerRepository;
  @Autowired
  private EmployeeRepository employeeRepository;
  @Autowired
  private OrderRepository orderRepository;
  @Autowired
  private MenuItemRepository menuItemRepository;
  @Autowired
  private OrderMenuItemRepository orderMenuItemRepository;
  @Autowired
  private ManagerService managerService;

  /**
   * Retrieves all outstanding orders in the system.
   * 
   * @return ResponseEntity containing a list of outstanding orders.
   */
  @GetMapping("/Manager/getOutstandingOrders")
  public ResponseEntity<List<Order>> getOutstandingOrders() {
    List<Order> outstandingOrders = managerService.getOutstandingOrders();
    return ResponseEntity.ok(outstandingOrders);
  }

  /**
   * Calculates the recommended price for a menu item based on cost and margin.
   * 
   * @param cost The original cost of the menu item.
   * @param margin The profit margin to be applied.
   * @return ResponseEntity containing the recommended price.
   */
  @GetMapping("/Manager/calculateRecommendedPrice") // redundant?
  public ResponseEntity<Double> calculateRecommendedPrice(@RequestParam double cost,
      @RequestParam double margin) {
    return ResponseEntity.ok((double) Math.round(cost / (1 - margin))); // 60% markup?

  }

  /**
   * Displays all stock items in the menu along with their availability status.
   * 
   * @return ResponseEntity containing a list of all stock items, including unavailable ones.
   */
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

  /**
   * Retrieves all employees in the system.
   * 
   * @return ResponseEntity containing a list of all employees.
   */
  @GetMapping("/Manager/getAllEmployeeData")
  public ResponseEntity<List<Employee>> getAllEmployeeData() {
    List<Employee> employeesList = new ArrayList<>();
    for (Employee employee : employeeRepository.findAll()) {
      employeesList.add(employee);
    }
    return ResponseEntity.ok(employeesList);
  }

  /**
   * Deletes all data in the system at the end of the day.
   * 
   * @return ResponseEntity containing a message confirming that all data has been deleted.
   */
  @PostMapping("/Manager/endOfDay")
  public ResponseEntity<String> endOfDay() {
    orderRepository.deleteAll();
    customerRepository.deleteAll();
    orderMenuItemRepository.deleteAll();
    return ResponseEntity.ok("DATA DELETED!");
  }
}
