package rhul.cs2810;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import rhul.cs2810.model.Category;
import rhul.cs2810.model.Customer;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.Menu;
import rhul.cs2810.model.MenuItem;


public class CustomerTest {
  Customer customer;
  MenuItem veganItem;
  MenuItem nonVeganItem;
  Menu menu;

  @BeforeEach
  void beforeEach() {
    menu = new Menu();
    customer = new Customer();
    veganItem = new MenuItem(1, "Vegan Burger", Category.MAIN, "Tasty vegan burger", 10.99F, null,
        300, new HashSet<>(Set.of(DietaryRestrictions.VEGAN)), false);

    nonVeganItem = new MenuItem(2, "Beef Burger", Category.MAIN, "Juicy beef burger", 12.99F, null,
        500, new HashSet<>(), false);
    menu.addMenuItem(veganItem);
    menu.addMenuItem(nonVeganItem);
    customer.setMenu(menu);
  }

  @Test
  void testCustomerConstructor() {
    List<MenuItem> orderedItems = new ArrayList<>();
    orderedItems.add(veganItem);
    List<MenuItem> menuItems = menu.getMenuItems();

    Customer c = new Customer(1, orderedItems, menuItems, menu);

    assertEquals(1, c.getOrderNo());
    assertEquals(orderedItems.size(), c.getOrderedItems().size());
    assertTrue(c.getOrderedItems().contains(veganItem));
    assertFalse(c.getOrderedItems().contains(nonVeganItem));


    assertEquals(menuItems.size(), c.getMenuItems().size());
    assertTrue(c.getMenuItems().contains(veganItem));
    assertTrue(c.getMenuItems().contains(nonVeganItem));

    assertEquals(menu, c.getMenu());
  }

  @Test
  void testZeroItemFromCart() {
    assertEquals(0, customer.getOrderedItems().size());
  }

  @Test
  void testAddItemFromCard() {
    customer.addItemToCart(veganItem);
    assertEquals(1, customer.getOrderedItems().size());
  }

  @Test
  void testRemoveItemFromCard() {
    customer.addItemToCart(veganItem);
    customer.removeItemFromCart(veganItem);
    assertEquals(0, customer.getOrderedItems().size());
  }

  @Test
  void testOrder() {
    customer.addItemToCart(veganItem);
    assertEquals(1, customer.getOrderedItems().size());
    customer.order();
    assertEquals(0, customer.getOrderedItems().size(), "Empty cart after ordering");
  }

  @Test
  void testEmptyOrder() {
    customer.order();
    assertEquals(0, customer.getOrderedItems().size());
  }

  @Test
  void testFilterMenu() {
    Set<DietaryRestrictions> filter = new HashSet<>(Set.of(DietaryRestrictions.VEGAN));
    List<MenuItem> filteredItems = customer.filterMenu(filter);

    assertEquals(1, filteredItems.size());
    assertTrue(filteredItems.contains(veganItem));
    assertFalse(filteredItems.contains(nonVeganItem));
  }

  @Test
  void testViewMenu() {
    String menuOutputString = customer.viewMenu();

    List<MenuItem> menuItems = customer.getMenu().getMenuItems();
    assertTrue(menuItems.stream().anyMatch(item -> item.getItemId() == 1));
    assertTrue(menuItems.stream().anyMatch(item -> item.getItemId() == 2));

    assertEquals(1, menuItems.get(0).getItemId());
    assertEquals(2, menuItems.get(1).getItemId());
  }


  @Test
  void testGetAndSetOrderNo() {
    customer.setOrderNo(1);
    assertEquals(1, customer.getOrderNo());
  }

  @Test
  void testGetAndSetOrderedItems() {
    List<MenuItem> orderedItems = new ArrayList<>();
    orderedItems.add(veganItem);
    customer.setOrderedItems(orderedItems);
    assertEquals(veganItem.getItemId(), customer.getOrderedItems().get(0).getItemId());
  }

  @Test
  void testGetAndSetMenuItems() {
    List<MenuItem> menuItems = new ArrayList<>();
    menuItems.add(veganItem);
    customer.setMenuItems(menuItems);
    assertEquals(veganItem.getItemId(), customer.getMenuItems().get(0).getItemId());
  }

  @Test
  void testGetAndSetMenu() {
    customer.setMenu(menu);
    assertEquals(menu, customer.getMenu());
  }

}
