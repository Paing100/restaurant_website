package rhul.cs2810.controller;

import java.util.EnumSet;
import java.util.Map;
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

/**
 * A Controller for Customers.
 */
@RestController
public class CustomerController {
  private final CustomerRepository customerRepository;
  private final MenuItemRepository menuItemRepository;


  /**
   * A constructor for the MenuItemController.
   *
   * @param menuItemRepository the repository for menu items
   * @param customerRepository the repository for customers
   */
  public CustomerController(CustomerRepository customerRepository,
      MenuItemRepository menuItemRepository) {
    this.menuItemRepository = menuItemRepository;
    this.customerRepository = customerRepository;

  }

  /**
   * A response entity for adding customers.
   *
   * @param params input parameters given to read off of.
   */
  @PostMapping(value = "/Customers/addCustomer")
  public ResponseEntity<Customer> addCustomer(@RequestBody Map<String, String> params) {

    Customer customer = new Customer(Integer.valueOf(params.get("customer_id")));
    Order order = new Order(Integer.valueOf(params.get("order_id")), customer);
    customer.setOrder(order);

    customer = customerRepository.save(customer);

    return ResponseEntity.ok(customer);


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
  public ResponseEntity<Customer> addItem(@RequestBody Map<String, String> params) {

    Customer customer =
        customerRepository.findById(Long.valueOf(params.get("customer_id"))).orElseThrow();
    MenuItem item = menuItemRepository.findById(Long.valueOf(params.get("item_id"))).orElseThrow();
    int count = 1;
    if (params.containsKey("amount")) {
      count = Integer.valueOf(params.get("amount"));
    }
    customer.getOrder().addItemToCart(item, count);

    customer = customerRepository.save(customer);

    return ResponseEntity.ok(customer);

  }

}
