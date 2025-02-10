package rhul.cs2810;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

import rhul.cs2810.model.DietaryRestrictions;

public class DietaryRestrictionsTest {
  @Test
  void testValueNotNull() {
    assertNotNull(DietaryRestrictions.HALAL);
    assertNotNull(DietaryRestrictions.VEGAN);
    assertNotNull(DietaryRestrictions.GLUTENFREE);
    assertNotNull(DietaryRestrictions.VEGETARIAN);
  }

  @Test
  void testDescriptions() {
    assertEquals("Halal - food prepared according to Islamic law",
        DietaryRestrictions.HALAL.getDescription());
    assertEquals("Vegan - no animal products used", DietaryRestrictions.VEGAN.getDescription());
    assertEquals("Gluten-free - free from wheat and gluten",
        DietaryRestrictions.GLUTENFREE.getDescription());
    assertEquals("Vegetarian - no meat or fish", DietaryRestrictions.VEGETARIAN.getDescription());

  }

  @Test
  void testValue() {
    assertEquals(DietaryRestrictions.HALAL, DietaryRestrictions.valueOf("HALAL"));
    assertEquals(DietaryRestrictions.VEGAN, DietaryRestrictions.valueOf("VEGAN"));
    assertEquals(DietaryRestrictions.GLUTENFREE, DietaryRestrictions.valueOf("GLUTENFREE"));
    assertEquals(DietaryRestrictions.VEGETARIAN, DietaryRestrictions.valueOf("VEGETARIAN"));
  }

  @Test
  void testValues() {
    DietaryRestrictions[] dietaryRestrictions = DietaryRestrictions.values();
    assertArrayEquals(new DietaryRestrictions[] {DietaryRestrictions.HALAL,
        DietaryRestrictions.VEGAN, DietaryRestrictions.GLUTENFREE, DietaryRestrictions.VEGETARIAN},
        dietaryRestrictions);
  }
}
