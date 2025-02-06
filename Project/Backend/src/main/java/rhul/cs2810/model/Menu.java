package rhul.cs2810.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class Menu {
  List<MenuItem> items;

  public Menu() {
    this.items = new ArrayList<>();
  }

  public List<MenuItem> getMenuItems() {
    return items;
  }

  public void addMenuItem(MenuItem item) {
    items.add(item);
  }

  public List<MenuItem> getCategoryItems(Category category) {
    List<MenuItem> categoryItems = new ArrayList<>();
    for (MenuItem item : items) {
      if (item.getCategory() == category) {
        categoryItems.add(item);
      }
    }
    return categoryItems;
  }

  public List<MenuItem> getDietaryRestrictions(Set<DietaryRestrictions> dietaryRestrictions) {
    List<MenuItem> dietItems = new ArrayList<>();
    for (MenuItem item : items) {
      if (item.getDietaryRestrictions().containsAll(dietaryRestrictions)) {
        dietItems.add(item);
      }
    }
    return dietItems;
  }
}
