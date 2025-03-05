package rhul.cs2810.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import rhul.cs2810.model.Customer;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderStatus;
import rhul.cs2810.repository.CustomerRepository;
import rhul.cs2810.repository.OrderRepository;

/**
 * A Controller for Customers.
 */
@RestController
@RequestMapping("/api/customers")
public class CustomerController {
  private final CustomerRepository customerRepository;
  private final OrderRepository orderRepository;

  /**
   * Constructor for CustomerController.
   *
   * @param customerRepository the repository for customers
   * @param orderRepository the repository for orders
   */
  public CustomerController(CustomerRepository customerRepository,
      OrderRepository orderRepository) {
    this.customerRepository = customerRepository;
    this.orderRepository = orderRepository;
  }

  /**
   * Adds a new customer with a name and creates an order with a table number.
   *
   * @param name the name of the customer
   * @param tableNum the table number for the order
   * @return the saved customer with the associated order
   */
  @PostMapping("/add")
  public ResponseEntity<Customer> addCustomer(@RequestParam String name,
      @RequestParam int tableNum) {
    // Create and save customer first
    Customer newCustomer = new Customer(name);
    newCustomer = customerRepository.save(newCustomer);

    // Create order linked to the persisted customer
    Order order = new Order();
    order.setTableNum(tableNum);
    order.setCustomer(newCustomer);
    order.setOrderStatus(OrderStatus.CREATED);
    newCustomer.setOrder(order);

    // Save the order
    orderRepository.save(order);

    return ResponseEntity.ok(newCustomer);
  }

  /**
   * Gets all customers.
   *
   * @return a list of all customers
   */
  @GetMapping("/all")
  public ResponseEntity<Iterable<Customer>> getAllCustomers() {
    Iterable<Customer> customers = (Iterable<Customer>) customerRepository.findAll();
    return ResponseEntity.ok(customers);
  }
}
