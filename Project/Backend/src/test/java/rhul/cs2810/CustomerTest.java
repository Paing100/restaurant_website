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

import rhul.cs2810.model.Allergen;
import rhul.cs2810.model.Customer;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.model.Order;



public class CustomerTest {
  Customer customer;
  MenuItem veganItem;
  MenuItem nonVeganItem;
  List<MenuItem> menuItems = new ArrayList<>();

  @BeforeEach
  void beforeEach() {
    customer = new Customer();
    veganItem = new MenuItem("Vegan Burger", "Tasty vegan burger", 10.99,
        new HashSet<>(Set.of(Allergen.NUTS)), 300, new HashSet<>(Set.of(DietaryRestrictions.VEGAN)),
        false);

    nonVeganItem = new MenuItem("Beef Burger", "Juicy beef burger", 12.99F,
        new HashSet<>(Set.of(Allergen.EGG)), 500,
        new HashSet<>(Set.of(DietaryRestrictions.GLUTENFREE)), false);
    menuItems.add(veganItem);
    menuItems.add(nonVeganItem);
  }

  @Test
  void testCustomerEmptyConstructor() {
    assertEquals(0, customer.getMenuItems().size());
  }

  @Test
  void testArgumentConstructor() {
    Customer customer1 = new Customer(menuItems);
    assertEquals(2, customer1.getMenuItems().size());
  }


  @Test
  void testFilterMenu() {
    customer.setMenuItems(menuItems);
    Set<DietaryRestrictions> dietaryRestrictions =
        new HashSet<>(Set.of(DietaryRestrictions.GLUTENFREE));
    Set<Allergen> allergens = new HashSet<>(Set.of(Allergen.NUTS));

    List<MenuItem> filteredItems = customer.filterMenu(dietaryRestrictions, allergens);

    assertEquals(1, filteredItems.size());
    assertFalse(filteredItems.contains(veganItem));
    assertTrue(filteredItems.contains(nonVeganItem));
  }

  @Test
  void testFilterMenuCustomerNullForDietsAndAllergens() {
    customer.setMenuItems(menuItems);
    List<MenuItem> filteredItems = customer.filterMenu(null, null);
    assertEquals(2, filteredItems.size());
    assertTrue(filteredItems.contains(veganItem));
    assertTrue(filteredItems.contains(nonVeganItem));
  }

  @Test
  void testFilterMenuCustomerNullForDiets() {
    customer.setMenuItems(menuItems);
    Set<Allergen> allergens = new HashSet<>(Set.of(Allergen.NUTS));
    List<MenuItem> filteredItems = customer.filterMenu(null, allergens);
    assertEquals(1, filteredItems.size());
    assertFalse(filteredItems.contains(veganItem));
    assertTrue(filteredItems.contains(nonVeganItem));
  }


  @Test
  void testFilterMenuCustomerNullForAllergens() {
    customer.setMenuItems(menuItems);
    Set<DietaryRestrictions> dietaryRestrictions =
        new HashSet<>(Set.of(DietaryRestrictions.GLUTENFREE));
    List<MenuItem> filteredItems = customer.filterMenu(dietaryRestrictions, null);
    assertEquals(1, filteredItems.size());
    assertFalse(filteredItems.contains(veganItem));
    assertTrue(filteredItems.contains(nonVeganItem));
  }


  @Test
  void testGetAndSetMenuItems() {
    List<MenuItem> menuItems = new ArrayList<>();
    menuItems.add(veganItem);
    customer.setMenuItems(menuItems);
    assertEquals(veganItem.getItemId(), customer.getMenuItems().get(0).getItemId());
  }

  @Test
  void testGetAndSetOrder() {
    Order order = new Order();
    customer.setOrder(order);
    assertEquals(order, customer.getOrder());
  }


}
