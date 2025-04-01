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
  public ResponseEntity<Customer> addCustomer(@RequestParam String name, @RequestParam int tableNum, @RequestParam(required = false) String email, @RequestParam(required = false) String password) {

    // Check if email is provided and already exists
    if (email != null && customerRepository.findByEmail(email) != null) {
      return ResponseEntity.badRequest().build();
    }

    // Create and save customer with hashed password
    Customer newCustomer = (email != null && password != null)
        ? new Customer(name, email, password)
        : new Customer(name);
    newCustomer = customerService.saveCustomer(newCustomer);

    // Create order linked to the persisted customer
    Order order = new Order();
    order.setTableNum(tableNum);
    order.setCustomer(newCustomer);
    order.setOrderStatus(OrderStatus.CREATED);

    // Try to assign a waiter
    Optional<Waiter> waiter = waiterService.findWaiterForTable(tableNum);
    if (waiter.isEmpty()) {
      return ResponseEntity.badRequest().build(); // No waiter available
    }
    order.setWaiter(waiter.get());
    
    newCustomer.addOrder(order);

    // Save the order
    orderRepository.save(order);

    return ResponseEntity.ok(newCustomer);
  }

  /**
   * Creates a new order for an existing customer.
   *
   * @param customerId the ID of the customer
   * @param tableNum the table number for the new order
   * @return the newly created order, or 400 if customer not found or no waiter available
   */
  @PostMapping("/{customerId}/newOrder")
  public ResponseEntity<Order> createNewOrder(@PathVariable int customerId,
      @RequestParam int tableNum) {
    Optional<Customer> customerOptional = customerRepository.findById(customerId);

    if (customerOptional.isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    Customer customer = customerOptional.get();

    // Create a new order for the existing customer
    Order newOrder = new Order();
    newOrder.setTableNum(tableNum);
    newOrder.setCustomer(customer);
    newOrder.setOrderStatus(OrderStatus.CREATED);

    // Try to assign a waiter
    Optional<Waiter> waiter = waiterService.findWaiterForTable(tableNum);
    if (waiter.isEmpty()) {
      return ResponseEntity.badRequest().build(); // No waiter available
    }
    newOrder.setWaiter(waiter.get());

    // Save the new order
    Order savedOrder = orderRepository.save(newOrder);

    return ResponseEntity.ok(savedOrder);
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
