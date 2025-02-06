package rhul.cs2810.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import rhul.cs2810.model.Customer;
import rhul.cs2810.model.Menu;
import rhul.cs2810.model.MenuItem;
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

    // empty list, order items through other post
    List<MenuItem> orderedItems = new ArrayList<MenuItem>();

    // grab everything from menuitem repository ?
    List<MenuItem> menuItems = new ArrayList<MenuItem>();

    // also add menu? redo this
    Menu menu = new Menu();

    Customer customer =
        new Customer(Integer.valueOf(params.get("order_no")), orderedItems, menuItems, menu);
    customer = customerRepository.save(customer);

    return ResponseEntity.ok(customer);
  }

}
