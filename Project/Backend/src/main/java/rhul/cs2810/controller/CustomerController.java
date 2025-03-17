package rhul.cs2810.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import rhul.cs2810.model.Customer;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderStatus;
import rhul.cs2810.repository.CustomerRepository;
import rhul.cs2810.repository.OrderRepository;

import java.util.Optional;

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
   * @return the newly created order
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
}
