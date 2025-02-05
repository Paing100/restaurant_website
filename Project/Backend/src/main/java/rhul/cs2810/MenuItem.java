package rhul.cs2810;

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
  private Set<DiretaryRestrictions> diretaryRestrictions;
  private boolean available;


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

  public Set<DiretaryRestrictions> getDiretaryRestrictions() {
    return diretaryRestrictions;
  }

  public void setDiretaryRestrictions(Set<DiretaryRestrictions> diretaryRestrictions) {
    this.diretaryRestrictions = diretaryRestrictions;
  }

  public boolean isAvailable() {
    return available;
  }

  public void setAvailable(boolean available) {
    this.available = available;
  }
}
