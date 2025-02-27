package rhul.cs2810;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.EnumSet;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import rhul.cs2810.model.Allergen;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.MenuItem;

public class MenuItemTest {

  private MenuItem item;

  /**
   * Sets up a default MenuItem before each test.
   */
  @BeforeEach
  void setUp() {
    item = new MenuItem("Guacamole", "Classic Mexican dip made with avocados, cilantro, and lime",
        5.99, EnumSet.noneOf(Allergen.class), 150, EnumSet.noneOf(DietaryRestrictions.class), true);
  }

  /**
   * Test 1: Verify constructor and getters.
   */
  @Test
  void testConstructorAndGetters() {
    assertEquals("Guacamole", item.getName());
    assertEquals("Classic Mexican dip made with avocados, cilantro, and lime",
        item.getDescription());
    assertEquals(5.99, item.getPrice());
    assertTrue(item.getAllergens().isEmpty());
    assertEquals(150, item.getCalories());
    assertTrue(item.getDietaryRestrictions().isEmpty());
    assertTrue(item.isAvailable());
  }

  /**
   * Test 2: Verify setting and getting the item ID.
   */
  @Test
  void testSetAndGetItemId() {
    item.setItemId(2);
    assertEquals(2, item.getItemId());
  }

  /**
   * Test 3: Verify setting and getting the name.
   */
  @Test
  void testSetAndGetName() {
    item.setName("Tacos al Pastor");
    assertEquals("Tacos al Pastor", item.getName());
  }

  /**
   * Test 4: Verify setting and getting the description.
   */
  @Test
  void testSetAndGetDescription() {
    item.setDescription("Corn tortillas filled with marinated pork, pineapple, and onion.");
    assertEquals("Corn tortillas filled with marinated pork, pineapple, and onion.",
        item.getDescription());
  }

  /**
   * Test 5: Verify setting and getting the price.
   */
  @Test
  void testSetAndGetPrice() {
    item.setPrice(9.99f);
    assertEquals(9.99f, item.getPrice());
  }

  /**
   * Test 6: Verify setting and getting allergens.
   */
  @Test
  void testSetAndGetAllergens() {
    Set<Allergen> allergens = Set.of(Allergen.DAIRY, Allergen.NUTS);
    item.setAllergens(allergens);
    assertEquals(allergens, item.getAllergens());
  }

  /**
   * Test 7: Verify setting and getting calories.
   */
  @Test
  void testSetAndGetCalories() {
    item.setCalories(350);
    assertEquals(350, item.getCalories());
  }

  /**
   * Test 8: Verify setting and getting dietary restrictions.
   */
  @Test
  void testSetAndGetDietaryRestrictions() {
    EnumSet<DietaryRestrictions> restrictions = EnumSet.of(DietaryRestrictions.VEGAN);
    item.setDietaryRestrictions(restrictions);
    assertEquals(restrictions, item.getDietaryRestrictions());
  }

  /**
   * Test 9: Verify setting and getting availability.
   */
  @Test
  void testSetAndGetAvailable() {
    item.setAvailable(false);
    assertFalse(item.isAvailable());
  }

  /**
   * Test 10: Verify empty constructor.
   */
  @Test
  void testEmptyConstructor() {
    MenuItem menuItem = new MenuItem();
    assertNull(menuItem.getName());
    assertNull(menuItem.getDescription());
    assertEquals(0.0, menuItem.getPrice());
    assertEquals(0, menuItem.getCalories());
    assertFalse(menuItem.isAvailable());
    assertTrue(menuItem.getAllergens().isEmpty());
    assertTrue(menuItem.getDietaryRestrictions().isEmpty());

  }

}
