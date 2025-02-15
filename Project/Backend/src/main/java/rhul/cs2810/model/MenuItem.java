package rhul.cs2810.model;

import java.util.Set;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

/**
 * Represents a menu item in the restaurant system.
 */
@Entity
@Table(name = "menu_item")
public class MenuItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "item_id")
  private int itemId;
  private String name;
  private String description;
  private double price;

  @ElementCollection(targetClass = Allergen.class, fetch = FetchType.EAGER)
  @Enumerated(EnumType.STRING)
  @CollectionTable(name = "menu_item_allergens", joinColumns = @JoinColumn(name = "item_id"))
  @Column(name = "allergen")
  private Set<Allergen> allergens;
  private int calories;

  @ElementCollection(targetClass = DietaryRestrictions.class, fetch = FetchType.EAGER)
  @Enumerated(EnumType.STRING)
  @CollectionTable(name = "menu_item_dietary_restrictions",
      joinColumns = @JoinColumn(name = "item_id"))
  @Column(name = "restriction")
  private Set<DietaryRestrictions> dietaryRestrictions;
  private boolean available;

  public MenuItem() {
    this.allergens = null;
    this.dietaryRestrictions = null;
    this.available = false;
  }

  /**
   * Constructs a new MenuItem with the specified attributes.
   *
   * @param name the name of the item
   * @param description the description of the item
   * @param price the price of the item
   * @param allergens the list of allergens present in the item
   * @param calories the calorie count of the item
   * @param dietaryRestrictions the set of dietary restrictions applicable to the item
   * @param available the availability status of the item
   */
  public MenuItem(String name, String description, double price, Set<Allergen> allergens,
      int calories, Set<DietaryRestrictions> dietaryRestrictions, boolean available) {
    this.name = name;
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
  public double getPrice() {
    return price;
  }

  /**
   * Sets the price of the menu item.
   *
   * @param price the price to set
   */
  public void setPrice(double price) {
    this.price = price;
  }

  /**
   * Gets the list of allergens in the menu item.
   *
   * @return the list of allergens
   */
  public Set<Allergen> getAllergens() {
    return allergens;
  }

  /**
   * Sets the list of allergens in the menu item.
   *
   * @param allergens the list of allergens to set
   */
  public void setAllergens(Set<Allergen> allergens) {
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

}
