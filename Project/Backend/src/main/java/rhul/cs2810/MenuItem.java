package rhul.cs2810;

import java.util.List;

public class MenuItem {

  private int itemId;
  private String name;
  private ItemCategory categoryId;
  private String description;
  private float price;
  private List<String> allergens;
  private int calories;
  private boolean isHalal;
  private boolean isVegan;
  private boolean isGlutenFree;
  private boolean isVegetarian;
  private boolean available;

  public MenuItem(int itemId, String name, ItemCategory categoryId, String description, float price,
      List<String> allergens, int calories, boolean isHalal, boolean isVegan, boolean isGlutenFree,
      boolean isVegetarian, boolean available) {
    this.itemId = itemId;
    this.name = name;
    this.categoryId = categoryId;
    this.description = description;
    this.price = price;
    this.allergens = allergens;
    this.calories = calories;
    this.isHalal = isHalal;
    this.isVegan = isVegan;
    this.isGlutenFree = isGlutenFree;
    this.isVegetarian = isVegetarian;
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

  public ItemCategory getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(ItemCategory categoryId) {
    this.categoryId = categoryId;
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

  public boolean isHalal() {
    return isHalal;
  }

  public void setHalal(boolean isHalal) {
    this.isHalal = isHalal;
  }

  public boolean isVegan() {
    return isVegan;
  }

  public void setVegan(boolean isVegan) {
    this.isVegan = isVegan;
  }

  public boolean isGlutenFree() {
    return isGlutenFree;
  }

  public void setGlutenFree(boolean isGlutenFree) {
    this.isGlutenFree = isGlutenFree;
  }

  public boolean isVegetarian() {
    return isVegetarian;
  }

  public void setVegetarian(boolean isVegetarian) {
    this.isVegetarian = isVegetarian;
  }

  public boolean isAvailable() {
    return available;
  }

  public void setAvailable(boolean available) {
    this.available = available;
  }

}


// UML diagram not clear - Assumed this was an enum and added it (if incorrect please change)
enum ItemCategory {
}
