package rhul.cs2810;

import java.util.List;
import java.util.Set;

public class Menu {
  List<MenuItem> Items;
  List<MenuItem> categoryItems;
  List<MenuItem> dietItems;

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

  public List<MenuItem> getDiretaryRestrictions(Set<DiretaryRestrictions> diretaryRestrictions) {
    for (MenuItem item : Items) {
      if (item.getDiretaryRestrictions() == diretaryRestrictions) {
        dietItems.add(item);
      }
    }
    return dietItems;
  }
}
