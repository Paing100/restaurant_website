package rhul.cs2810.controller;

import java.util.EnumSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import rhul.cs2810.model.Allergen;
import rhul.cs2810.model.Customer;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.model.Order;
import rhul.cs2810.repository.CustomerRepository;
import rhul.cs2810.repository.MenuItemRepository;
import rhul.cs2810.repository.OrderRepository;

/**
 * A Controller for Customers.
 */
@RestController
public class CustomerController {
  private final CustomerRepository customerRepository;
  private final MenuItemRepository menuItemRepository;
  private final OrderRepository orderRepository;


  /**
   * A constructor for the MenuItemController.
   *
   * @param menuItemRepository the repository for menu items
   * @param customerRepository the repository for customers
   */
  public CustomerController(CustomerRepository customerRepository,
      MenuItemRepository menuItemRepository, OrderRepository orderRepository) {
    this.menuItemRepository = menuItemRepository;
    this.customerRepository = customerRepository;
    this.orderRepository = orderRepository;

  }

  /**
   * A response entity for adding customers.
   *
   * @param params input parameters given to read off of.
   */
  @PostMapping(value = "/Customers/addCustomer")
  public ResponseEntity<Customer> addCustomer(@RequestBody Map<String, String> params) {
    // Extract parameters
    String customerIdStr = params.get("customerID");
    int customerID = customerIdStr != null ? Integer.parseInt(customerIdStr) : 0;

    // Create new customer
    Customer newCustomer = new Customer(customerID);
    Order order = new Order(newCustomer);
    newCustomer.setOrder(order);

    // Save to database
    order = orderRepository.save(order);
    newCustomer = customerRepository.save(newCustomer);

    return ResponseEntity.ok(newCustomer);
  }


  /**
   * A response entity for filtering orders.
   *
   * @param params input parameters given to read off of.
   */
  @PostMapping(value = "/Menu/filter")
  public ResponseEntity<Customer> filter(@RequestBody Map<String, String> params) {

    Customer customer =
        customerRepository.findById(Long.valueOf(params.get("customer_id"))).orElseThrow();

    Set<DietaryRestrictions> dietaryRestrictions = EnumSet.noneOf(DietaryRestrictions.class);
    if (params.containsKey("dietary_restrictions")
        && params.get("dietary_restrictions").isEmpty() != true) {
      String[] dietaryStr = params.get("dietary_restrictions").split(",");
      for (String dietaryRestrict : dietaryStr) {
        DietaryRestrictions restrict = DietaryRestrictions.valueOf(dietaryRestrict);
        dietaryRestrictions.add(restrict);
      }
    }

    Set<Allergen> allergens = EnumSet.noneOf(Allergen.class);
    if (params.containsKey("allergens") && params.get("allergens").isEmpty() != true) {
      String[] allergensStr = params.get("allergens").split(",");
      for (String allergen : allergensStr) {
        Allergen allergy = Allergen.valueOf(allergen);
        allergens.add(allergy);
      }
    }

    customer.filterMenu(dietaryRestrictions, allergens);
    customer = customerRepository.save(customer);


    return ResponseEntity.ok(customer);

  }

  /**
   * A response entity for filtering orders.
   *
   * @param params input parameters given to read off of.
   */
  @PostMapping(value = "/Customers/addItemToCart")
  public ResponseEntity<?> addItem(@RequestBody Map<String, String> params) {

    // Convert IDs from String to Long
    Long customerId = Long.valueOf(params.get("customer_id"));
    Long itemId = Long.valueOf(params.get("item_id"));

    // Check if customer exists
    Optional<Customer> optionalCustomer = customerRepository.findById(customerId);
    if (optionalCustomer.isEmpty()) {
      return ResponseEntity.badRequest()
          .body("Error: Customer with ID " + customerId + " not found.");
    }

    // Check if menu item exists
    Optional<MenuItem> optionalItem = menuItemRepository.findById(itemId);
    if (optionalItem.isEmpty()) {
      return ResponseEntity.badRequest().body("Error: Menu item with ID " + itemId + " not found.");
    }

    // Get actual objects
    Customer customer = optionalCustomer.get();
    MenuItem item = optionalItem.get();

    // Set quantity (default is 1)
    int count = 1;
    if (params.containsKey("amount")) {
      count = Integer.parseInt(params.get("amount"));
    }

    // Add item to the customer's order
    customer.getOrder().addItemToCart(item, count);
    Order order = customer.getOrder();

    // Save updated customer (should cascade save the order)
    order = orderRepository.save(order);
    customer = customerRepository.save(customer);

    return ResponseEntity.ok(customer);
  }

}
