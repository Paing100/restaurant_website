package rhul.cs2810;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

import rhul.cs2810.model.Allergen;

public class AllergenTest {

  @Test
  void testValueNotNull() {
    assertNotNull(Allergen.DAIRY);
    assertNotNull(Allergen.GLUTEN);
    assertNotNull(Allergen.SOYA);
    assertNotNull(Allergen.EGG);
    assertNotNull(Allergen.NUTS);
    assertNotNull(Allergen.SHELLFISH);
  }

  @Test
  void testDescriptions() {
    assertEquals("Dairy products", Allergen.DAIRY.getDescription());
    assertEquals("Wheat, barley, and rye", Allergen.GLUTEN.getDescription());
    assertEquals("Peanuts, tree nuts", Allergen.NUTS.getDescription());
    assertEquals("Crustaceans and mollusks", Allergen.SHELLFISH.getDescription());
    assertEquals("Soy products", Allergen.SOYA.getDescription());
    assertEquals("Eggs", Allergen.EGG.getDescription());
  }

  @Test
  void testValue() {
    assertEquals(Allergen.DAIRY, Allergen.valueOf("DAIRY"));
    assertEquals(Allergen.GLUTEN, Allergen.valueOf("GLUTEN"));
    assertEquals(Allergen.NUTS, Allergen.valueOf("NUTS"));
    assertEquals(Allergen.SHELLFISH, Allergen.valueOf("SHELLFISH"));
    assertEquals(Allergen.SOYA, Allergen.valueOf("SOYA"));
    assertEquals(Allergen.EGG, Allergen.valueOf("EGG"));
  }

  @Test
  void testValues() {
    Allergen[] allergens = Allergen.values();
    assertArrayEquals(new Allergen[] {Allergen.DAIRY, Allergen.GLUTEN, Allergen.NUTS,
        Allergen.SHELLFISH, Allergen.SOYA, Allergen.EGG}, allergens);
  }

}
