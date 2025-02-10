package rhul.cs2810;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import rhul.cs2810.model.Allergen;
import rhul.cs2810.model.Customer;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.model.Order;

public class OrderTest {

  Order order;
  MenuItem veganItem;
  MenuItem nonVeganItem;
  Map<MenuItem, Integer> orderedItems;

  @BeforeEach
  public void beforeEach() {
    veganItem = new MenuItem("Vegan Burger", "Tasty vegan burger", 10.99,
        new HashSet<>(Set.of(Allergen.NUTS)), 300, new HashSet<>(Set.of(DietaryRestrictions.VEGAN)),
        false);

    nonVeganItem =
        new MenuItem("Beef Burger", "Juicy beef burger", 12.99, new HashSet<>(Set.of(Allergen.EGG)),
            500, new HashSet<>(Set.of(DietaryRestrictions.GLUTENFREE)), false);
    orderedItems = new HashMap<>();
    orderedItems.put(veganItem, 1);
    orderedItems.put(nonVeganItem, 2);
    order = new Order(new Customer(), orderedItems);
  }

  @Test
  void testEmptyConstructor() {
    Order order1 = new Order();
    assertEquals(0, order1.getOrderedItems().size());
  }

  @Test
  void testConstructor() {
    assertEquals(2, order.getOrderedItems().size());
  }

  @Test
  void testCalculateTotal() {
    assertEquals(36.97, order.getTotalPrice());
  }

  @Test
  void testRemoveItemsFromCart() {
    order.removeItemsFromCart(veganItem);
    assertEquals(1, order.getOrderedItems().size());
  }

  @Test
  void testRemoveItemsFromEmptyCart() {
    Order orderTest = new Order();
    orderTest.removeItemsFromCart(veganItem);
    assertTrue(orderTest.getOrderedItems().isEmpty(), "Cart is empty");
  }

  @Test
  void testRemoveItemsNotInCart() {
    MenuItem newItem = new MenuItem("Burger", "Tasty burger", 10, null, 300, null, false);
    order.removeItemsFromCart(newItem);
    assertEquals(2, order.getOrderedItems().size());
  }

  @Test
  void testAddItemsToCart() {
    MenuItem newItem = new MenuItem("Burger", "Tasty burger", 10, null, 300, null, false);
    order.addItemToCart(newItem, 2);
    assertEquals(3, order.getOrderedItems().size());
  }

  @Test
  void testGetAndSetCustomer() {
    Order orderTest = new Order();
    Customer customerTest = new Customer();
    orderTest.setCustomer(customerTest);

    assertEquals(customerTest, orderTest.getCustomer());
  }

  @Test
  void testGetAndSetOrderedItems() {
    Order orderTest = new Order();
    orderTest.setOrderedItems(orderedItems);
    assertEquals(orderedItems, orderTest.getOrderedItems());
  }



}
