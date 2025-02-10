package rhul.cs2810.model;

/**
 * Enum representing dietary restrictions for menu items.
 */
public enum DietaryRestrictions {
  HALAL("Halal - food prepared according to Islamic law"), VEGAN(
      "Vegan - no animal products used"), GLUTENFREE(
          "Gluten-free - free from wheat and gluten"), VEGETARIAN("Vegetarian - no meat or fish");

  private final String description;

  private DietaryRestrictions(String description) {
    this.description = description;
  }

  public String getDescription() {
    return this.description;
  }
}
