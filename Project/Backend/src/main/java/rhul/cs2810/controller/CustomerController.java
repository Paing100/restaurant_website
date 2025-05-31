package rhul.cs2810.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import rhul.cs2810.model.Customer;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderStatus;
import rhul.cs2810.model.Waiter;
import rhul.cs2810.repository.CustomerRepository;
import rhul.cs2810.repository.OrderRepository;
import rhul.cs2810.service.CustomerService;
import rhul.cs2810.service.OrderService;
import rhul.cs2810.service.WaiterService;

import java.util.List;
import java.util.Optional;

/**
 * A Controller for Customers.
 */
@RestController
@RequestMapping("/api/customers")
public class CustomerController {
  private final CustomerRepository customerRepository;
  private final OrderRepository orderRepository;
  private final WaiterService waiterService;
  private final CustomerService customerService;

  /**
   * Constructor for CustomerController.
   *
   * @param customerRepository the repository for customers
   * @param orderRepository the repository for orders
   * @param waiterService the service for waiter management
   * @param customerService the service for customer management
   */
  public CustomerController(CustomerRepository customerRepository,
      OrderRepository orderRepository, WaiterService waiterService, CustomerService customerService) {
    this.customerRepository = customerRepository;
    this.orderRepository = orderRepository;
    this.waiterService = waiterService;
    this.customerService = customerService;
  }

  /**
   * Adds a new customer with a name and creates an order with a table number.
   *
   * @param name the name of the customer
   * @param tableNum the table number for the order
   * @param email the email of the customer
   * @param password the password of the customer
   * @return the saved customer with the associated order, or 400 if no waiter available
   */
  @PostMapping("/add")
  public ResponseEntity<Customer> addCustomer(@RequestParam String name, @RequestParam int tableNum,
    @RequestParam(required = false) String email, @RequestParam(required = false) String password) {

    Customer customer = customerService.createCustomerAndAdd(name, tableNum, email, password);

    return ResponseEntity.ok(customer);
  }

  /**
   * Creates a new order for an existing customer.
   *
   * @param customerId the ID of the customer
   * @param tableNum the table number for the new order
   * @return the newly created order, or 400 if customer not found or no waiter available
   */
  @PostMapping("/{customerId}/newOrder")
  public ResponseEntity<?> createNewOrder(@PathVariable int customerId,
      @RequestParam int tableNum) {
    try {
      Order order = customerService.createNeworder(customerId, tableNum);
      return ResponseEntity.ok(order);
    }
    catch (IllegalArgumentException e){
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  /**
   * Gets all customers.
   *
   * @return a list of all customers
   */
  @GetMapping("/all")
  public ResponseEntity<Iterable<Customer>> getAllCustomers() {
    Iterable<Customer> customers = customerRepository.findAll();
    return ResponseEntity.ok(customers);
  }

  /**
   * Gets all orders for a specific customer.
   * 
   * @param customerId the ID of the customer
   * @return a list of orders for the customer, or 404 if the customer is not found
   */
  @GetMapping("/{customerId}/orders")
  public ResponseEntity<List<Order>> getCustomerOrders(@PathVariable int customerId) {
    Optional<Customer> customerOptional = customerRepository.findById(customerId);

    if (customerOptional.isEmpty()) {
      return ResponseEntity.notFound().build(); // Return 404 Not Found instead of throwing an
                                                // exception.
    }

    Customer customer = customerOptional.get();
    List<Order> orders = customer.getOrders();
    return ResponseEntity.ok(orders);
  }

  /**
   * Creates an account for an existing customer.
   *
   * @param customerId the ID of the customer
   * @param email the email for the account
   * @param password the password for the account
   * @return the updated customer, or 400 if customer not found or email already exists
   */
  @PostMapping("/{customerId}/createAccount")
  public ResponseEntity<Customer> createAccount(@PathVariable int customerId,
      @RequestParam String email,
      @RequestParam String password) {

    Optional<Customer> updatedCustomer = customerService.createAccount(customerId, email, password);
    return updatedCustomer.map(ResponseEntity::ok)
        .orElse(ResponseEntity.badRequest().build());
  }

  /**
   * Authenticates a customer with email and password.
   *
   * @param email the customer's email
   * @param password the customer's password
   * @return the customer if authentication successful, or 401 if not
   */
  @PostMapping("/login")
  public ResponseEntity<Customer> loginCustomer(@RequestParam String email,
      @RequestParam String password) {

    Optional<Customer> authenticatedCustomer = customerService.authenticateCustomer(email, password);
    return authenticatedCustomer.map(ResponseEntity::ok)
        .orElse(ResponseEntity.status(401).build());
  }
}
