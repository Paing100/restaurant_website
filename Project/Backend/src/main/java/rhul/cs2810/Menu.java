package rhul.cs2810;

import java.util.List;
import java.util.Set;

public class Menu {
  List<MenuItem> Items;
  List<MenuItem> categoryItems;
  List<MenuItem> dietItems;

  public Menu() {

  }

  public List<MenuItem> getMenuItems() {
    return Items;
  }

  public List<MenuItem> getCategoryItems(Category category) {
    for (MenuItem item : Items) {
      if (item.getCategory() == category) {
        categoryItems.add(item);
      }
    }
    return categoryItems;
  }

  public List<MenuItem> getDietaryRestrictions(Set<DietaryRestrictions> dietaryRestrictions) {
    for (MenuItem item : Items) {
      if (item.getDietaryRestrictions() == dietaryRestrictions) {
        dietItems.add(item);
      }
    }
    return dietItems;
  }
}
