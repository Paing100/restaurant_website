package rhul.cs2810.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Represents a menu containing a list of menu items.
 */
public class Menu {

  /** The list of menu items available. */
  List<MenuItem> items;

  /**
   * Constructs an empty menu.
   */
  public Menu() {
    this.items = new ArrayList<>();
  }

  /**
   * Returns the list of menu items.
   *
   * @return the list of menu items
   */
  public List<MenuItem> getMenuItems() {
    return items;
  }

  /**
   * Adds a menu item to the menu.
   *
   * @param item the menu item to add
   */
  public void addMenuItem(MenuItem item) {
    items.add(item);
  }

  /**
   * Retrieves all menu items belonging to a specific category.
   *
   * @param category the category to filter by
   * @return a list of menu items in the specified category
   */
  public List<MenuItem> getCategoryItems(Category category) {
    List<MenuItem> categoryItems = new ArrayList<>();
    for (MenuItem item : items) {
      if (item.getCategory() == category) {
        categoryItems.add(item);
      }
    }
    return categoryItems;
  }

  /**
   * Filters menu items based on dietary restrictions.
   *
   * @param dietaryRestrictions the set of dietary restrictions to filter by
   * @return a list of menu items that meet the given dietary restrictions
   */
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
