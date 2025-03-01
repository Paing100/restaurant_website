package rhul.cs2810.model;

/**
 * Enum representing allergens for menu items.
 */
public enum Allergen {
  DAIRY("Dairy products"), GLUTEN("Wheat, barley, and rye"), NUTS("Peanuts, tree nuts"), SHELLFISH(
      "Crustaceans and mollusks"), SOYA("Soy products"), EGG("Eggs");

  private final String description;

  Allergen(String description) {
    this.description = description;
  }

  /**
   * Description of an allergen.
   * 
   * @return the description
   */
  public String getDescription() {
    return this.description;
  }
}
