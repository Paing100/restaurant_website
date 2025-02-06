package rhul.cs2810.model;

import java.util.List;
import java.util.Set;

public class MenuItem {

  private int itemId;
  private String name;
  private Category category;
  private String description;
  private float price;
  private List<String> allergens;
  private int calories;
  private Set<DietaryRestrictions> dietaryRestrictions;
  private boolean available;

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


  public int getItemId() {
    return itemId;
  }

  public void setItemId(int itemId) {
    this.itemId = itemId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Category getCategory() {
    return category;
  }

  public void setCategory(Category category) {
    this.category = category;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public float getPrice() {
    return price;
  }

  public void setPrice(float price) {
    this.price = price;
  }

  public List<String> getAllergens() {
    return allergens;
  }

  public void setAllergens(List<String> allergens) {
    this.allergens = allergens;
  }

  public int getCalories() {
    return calories;
  }

  public void setCalories(int calories) {
    this.calories = calories;
  }

  public Set<DietaryRestrictions> getDietaryRestrictions() {
    return dietaryRestrictions;
  }

  public void setDiretaryRestrictions(Set<DietaryRestrictions> dietaryRestrictions) {
    this.dietaryRestrictions = dietaryRestrictions;
  }

  public boolean isAvailable() {
    return available;
  }

  public void setAvailable(boolean available) {
    this.available = available;
  }


  @Override
  public String toString() {
    return "ID: " + this.itemId + "\nName: " + this.name + "\nCategory: " + this.category
        + "\nDescription: " + this.description + "\nPrice: " + this.price + "\nAllergens: "
        + this.allergens + "\nCalories: " + calories + "\nDietary Restrictions: "
        + this.dietaryRestrictions.toString() + "\nAvailable: " + this.available;
  }


}
