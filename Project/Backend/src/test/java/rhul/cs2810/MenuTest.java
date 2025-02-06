package rhul.cs2810;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import rhul.cs2810.model.Category;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.Menu;
import rhul.cs2810.model.MenuItem;


public class MenuTest {
  Menu menu;
  MenuItem veganItem;
  MenuItem nonVeganItem;


  @BeforeEach
  void beforeEach() {
    menu = new Menu();
    veganItem = new MenuItem(1, "Vegan Burger", Category.MAIN, "Tasty vegan burger", 10.99F, null,
        300, new HashSet<>(Set.of(DietaryRestrictions.VEGAN)), false);

    nonVeganItem = new MenuItem(2, "Beef Burger", Category.MAIN, "Juicy beef burger", 12.99F, null,
        500, new HashSet<>(), false);
  }

  @Test
  void testZeroMenuItem() {
    assertEquals(0, menu.getMenuItems().size());
  }

  @Test
  void testAddMenuItem() {
    menu.addMenuItem(veganItem);
    menu.addMenuItem(nonVeganItem);

    assertEquals(2, menu.getMenuItems().size());
  }

  @Test
  void testGetCategoryItems() {
    Category category = Category.MAIN;
    menu.addMenuItem(veganItem);
    menu.addMenuItem(nonVeganItem);
    List<MenuItem> items = menu.getCategoryItems(category);
    assertEquals(2, items.size());
  }

  @Test
  void testGetCategoryItemsNotMatch() {
    Category category = Category.DESSERT;
    menu.addMenuItem(veganItem);
    menu.addMenuItem(nonVeganItem);
    List<MenuItem> items = menu.getCategoryItems(category);
    assertEquals(0, items.size());
  }

  @Test
  void testGetDietaryRestirctions() {
    Set<DietaryRestrictions> dietaryRestritionSet =
        new HashSet<>(Set.of(DietaryRestrictions.VEGAN));

    menu.addMenuItem(veganItem);
    menu.addMenuItem(nonVeganItem);
    List<MenuItem> items = menu.getDietaryRestrictions(dietaryRestritionSet);
    assertEquals(1, items.size());
  }



}


