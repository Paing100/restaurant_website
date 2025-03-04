package rhul.cs2810.controller;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import rhul.cs2810.model.Allergen;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.repository.MenuItemRepository;
import rhul.cs2810.service.MenuItemService;

/**
 * A controller for MenuItem.
 */
@RestController
public class MenuItemController {
  private final MenuItemRepository menuItemRepository;

  @Autowired
  private MenuItemService menuItemService;

  public MenuItemController(MenuItemRepository menuItemRepository) {
    this.menuItemRepository = menuItemRepository;
  }

  /**
   * Filters menu according to user's choice (allergens and/or dietary restrictions)
   *
   * @param params of type Map (string, string)
   * @return a saved List of filtered MenuItem
   */
  @PostMapping(value = "/Menu/filter")
  public ResponseEntity<List<MenuItem>> filterMenuItems(@RequestBody Map<String, String> params) {
    List<MenuItem> filteredItems = menuItemService.filterMenu(params);
    return ResponseEntity.ok(filteredItems);
  }

  /**
   * Adds a menu item.
   *
   * @param params of type Map (String, String)
   * @return a saved menu item
   */
  @PostMapping(value = "/MenuItems/addMenuItem")
  public ResponseEntity<MenuItem> addMenuItem(@RequestBody Map<String, String> params) {
    String allergensString = params.get("allergens");
    String[] allergensArray =
        (allergensString != null) ? allergensString.split(",") : new String[0];
    Set<Allergen> allergens = EnumSet.noneOf(Allergen.class);

    for (String allergenStr : allergensArray) {
      try {
        Allergen allergen = Allergen.valueOf(allergenStr.trim().toUpperCase());
        allergens.add(allergen);
      } catch (IllegalArgumentException e) {
        System.out.println("Invalid allergen: " + allergenStr);
      }
    }

    String dietaryRestrictionsStr = params.get("dietaryRestrictions");
    String[] dietaryRestrictionsArray =
        (dietaryRestrictionsStr != null) ? dietaryRestrictionsStr.split(",") : new String[0];
    Set<DietaryRestrictions> dietaryRestrictions = EnumSet.noneOf(DietaryRestrictions.class);

    for (String dietaryRestrict : dietaryRestrictionsArray) {
      try {
        DietaryRestrictions restrict =
            DietaryRestrictions.valueOf(dietaryRestrict.trim().toUpperCase());
        dietaryRestrictions.add(restrict);
      } catch (IllegalArgumentException e) {
        System.out.println("Invalid dietary restriction: " + dietaryRestrict);
      }
    }

    String imagePath = params.get("imagePath");
    String categoryStr = params.get("category");

    MenuItem item = new MenuItem(params.get("name"), params.get("description"),
        Float.parseFloat(params.get("price")), allergens, Integer.parseInt(params.get("calories")),
        dietaryRestrictions, Boolean.parseBoolean(params.get("available")), imagePath,
        categoryStr != null ? Integer.parseInt(categoryStr) : 0);

    item = menuItemRepository.save(item);
    return ResponseEntity.ok(item);
  }

  /**
   * Retrieves the menu.
   *
   * @return a list of menu items from the database.
   */
  @GetMapping(value = "/MenuItems")
  public ResponseEntity<List<MenuItem>> getMenu() {
    Iterable<MenuItem> menuItemsIterable = menuItemRepository.findAll();
    List<MenuItem> menuItems = new ArrayList<>();
    menuItemsIterable.forEach(menuItems::add);
    return ResponseEntity.ok(menuItems);
  }

  /**
   * Retrieves a specific menu item by id.
   * 
   * @param id of the menu item of type String
   * @return menu item associated with the id
   */
  @GetMapping("/MenuItems/get/{id}")
  public ResponseEntity<MenuItem> getMenuItemById(@PathVariable String id) {
    int idInt = Integer.parseInt(id);
    return menuItemRepository.findById(idInt).map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  /**
   * Updates the info of the menu item.
   *
   * @param id of the menu item
   * @param updateItem that needs to be updated
   * @return a saved edited menu item
   */
  @PutMapping("/MenuItems/edit/{id}")
  public ResponseEntity<MenuItem> updateMenuItems(@PathVariable String id,
      @RequestBody MenuItem updateItem) {
    int idInt = Integer.parseInt(id);
    Optional<MenuItem> editedMenuItem = menuItemRepository.findById(idInt);
    if (editedMenuItem.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    MenuItem existingMenuItem = editedMenuItem.get();
    existingMenuItem.setName(updateItem.getName());
    existingMenuItem.setDescription(updateItem.getDescription());
    existingMenuItem.setPrice(updateItem.getPrice());
    existingMenuItem.setAllergens(updateItem.getAllergens());
    existingMenuItem.setCalories(updateItem.getCalories());
    existingMenuItem.setDietaryRestrictions(updateItem.getDietaryRestrictions());
    existingMenuItem.setAvailable(updateItem.isAvailable());
    existingMenuItem.setImagePath(updateItem.getImagePath());
    existingMenuItem.setCategory(updateItem.getCategory());

    return ResponseEntity.ok(menuItemRepository.save(existingMenuItem));
  }

}
