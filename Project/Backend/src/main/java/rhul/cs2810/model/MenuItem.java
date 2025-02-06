package rhul.cs2810.model;

import java.util.List;
import java.util.Set;

/**
 * Represents a menu item in the restaurant system.
 */
public class MenuItem {

  /** The unique identifier for the menu item. */
  private int itemId;

  /** The name of the menu item. */
  private String name;

  /** The category of the menu item. */
  private Category category;

  /** The description of the menu item. */
  private String description;

  /** The price of the menu item. */
  private float price;

  /** The list of allergens contained in the menu item. */
  private List<String> allergens;

  /** The calorie count of the menu item. */
  private int calories;

  /** The dietary restrictions applicable to the menu item. */
  private Set<DietaryRestrictions> dietaryRestrictions;

  /** Availability status of the menu item. */
  private boolean available;

  /**
   * Constructs a new MenuItem with the specified attributes.
   *
   * @param itemId the unique identifier of the item
   * @param name the name of the item
   * @param category the category of the item
   * @param description the description of the item
   * @param price the price of the item
   * @param allergens the list of allergens present in the item
   * @param calories the calorie count of the item
   * @param dietaryRestrictions the set of dietary restrictions applicable to the item
   * @param available the availability status of the item
   */
  public MenuItem(int itemId, String name, Category category, String description, float price,
      List<String> allergens, int calories, Set<DietaryRestrictions> dietaryRestrictions,
      boolean available) {
    this.itemId = itemId;
    this.name = name;
    this.category = category;
    this.description = description;
    this.price = price;
    this.allergens = allergens;
    this.calories = calories;
    this.dietaryRestrictions = dietaryRestrictions;
    this.available = available;
  }

  /**
   * Gets the unique identifier of the menu item.
   *
   * @return the item ID
   */
  public int getItemId() {
    return itemId;
  }

  /**
   * Sets the unique identifier of the menu item.
   *
   * @param itemId the item ID to set
   */
  public void setItemId(int itemId) {
    this.itemId = itemId;
  }

  /**
   * Gets the name of the menu item.
   *
   * @return the name of the item
   */
  public String getName() {
    return name;
  }

  /**
   * Sets the name of the menu item.
   *
   * @param name the name to set
   */
  public void setName(String name) {
    this.name = name;
  }

  /**
   * Gets the category of the menu item.
   *
   * @return the category of the item
   */
  public Category getCategory() {
    return category;
  }

  /**
   * Sets the category of the menu item.
   *
   * @param category the category to set
   */
  public void setCategory(Category category) {
    this.category = category;
  }

  /**
   * Gets the description of the menu item.
   *
   * @return the description of the item
   */
  public String getDescription() {
    return description;
  }

  /**
   * Sets the description of the menu item.
   *
   * @param description the description to set
   */
  public void setDescription(String description) {
    this.description = description;
  }

  /**
   * Gets the price of the menu item.
   *
   * @return the price of the item
   */
  public float getPrice() {
    return price;
  }

  /**
   * Sets the price of the menu item.
   *
   * @param price the price to set
   */
  public void setPrice(float price) {
    this.price = price;
  }

  /**
   * Gets the list of allergens in the menu item.
   *
   * @return the list of allergens
   */
  public List<String> getAllergens() {
    return allergens;
  }

  /**
   * Sets the list of allergens in the menu item.
   *
   * @param allergens the list of allergens to set
   */
  public void setAllergens(List<String> allergens) {
    this.allergens = allergens;
  }

  /**
   * Gets the calorie count of the menu item.
   *
   * @return the calorie count
   */
  public int getCalories() {
    return calories;
  }

  /**
   * Sets the calorie count of the menu item.
   *
   * @param calories the calorie count to set
   */
  public void setCalories(int calories) {
    this.calories = calories;
  }

  /**
   * Gets the dietary restrictions applicable to the menu item.
   *
   * @return the dietary restrictions
   */
  public Set<DietaryRestrictions> getDietaryRestrictions() {
    return dietaryRestrictions;
  }

  /**
   * Sets the dietary restrictions applicable to the menu item.
   *
   * @param dietaryRestrictions the dietary restrictions to set
   */
  public void setDietaryRestrictions(Set<DietaryRestrictions> dietaryRestrictions) {
    this.dietaryRestrictions = dietaryRestrictions;
  }

  /**
   * Checks whether the menu item is available.
   *
   * @return true if the item is available, false otherwise
   */
  public boolean isAvailable() {
    return available;
  }

  /**
   * Sets the availability status of the menu item.
   *
   * @param available the availability status to set
   */
  public void setAvailable(boolean available) {
    this.available = available;
  }

  /**
   * Returns a string representation of the menu item.
   *
   * @return a formatted string containing item details
   */
  @Override
  public String toString() {
    return "ID: " + this.itemId + "\nName: " + this.name + "\nCategory: " + this.category
        + "\nDescription: " + this.description + "\nPrice: " + this.price + "\nAllergens: "
        + this.allergens + "\nCalories: " + calories + "\nDietary Restrictions: "
        + this.dietaryRestrictions.toString() + "\nAvailable: " + this.available;
  }
}
