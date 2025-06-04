package rhul.cs2810.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import rhul.cs2810.model.Allergen;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.repository.MenuItemRepository;

/**
 * A class contains the business logic of MenuItem.
 */
@Service
public class MenuItemService {

  @Autowired
  private MenuItemRepository menuItemRepository;

  /**
   * Filters menu items based on the given parameters.
   * 
   * @param params A map containing - "allergens": comma separated lists of allergens -
   *        "dietary_restrictions": comma separated lists of restrictions
   * @return A list of menu items that matches the given parameter
   */
  public List<MenuItem> filterMenu(Map<String, String> params) {
    Set<Allergen> allergens = this.getAllergens(params);
    Set<DietaryRestrictions> dietaryRestrictions = this.getDietaryRestrictions(params);

    List<MenuItem> menuItems = new ArrayList<>();
    menuItemRepository.findAll().forEach(menuItems::add);

    return menuItems.stream()
        .filter(item -> (dietaryRestrictions.isEmpty()
            || item.getDietaryRestrictions().stream().anyMatch(dietaryRestrictions::contains))
            && (allergens.isEmpty() || item.getAllergens().stream().noneMatch(allergens::contains)))
        .collect(Collectors.toList());
  }

  private Set<Allergen> getAllergens(Map<String, String> params) {
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
    return allergens;
  }

  private Set<DietaryRestrictions> getDietaryRestrictions(Map<String, String> params) {
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
    return dietaryRestrictions;
  }

  public MenuItem addMenuItem(Map<String, String> params) {
    Set<Allergen> allergens = this.getAllergens(params);
    Set<DietaryRestrictions> dietaryRestrictions = this.getDietaryRestrictions(params);
    String imagePath = params.get("imagePath");
    String categoryStr = params.get("category");

    MenuItem item = new MenuItem(params.get("name"), params.get("description"),
      Float.parseFloat(params.get("price")), allergens, Integer.parseInt(params.get("calories")),
      dietaryRestrictions, Boolean.parseBoolean(params.get("available")), imagePath,
      categoryStr != null ? Integer.parseInt(categoryStr) : 0);

    item = menuItemRepository.save(item);
    return item;
  }

  public List<MenuItem> getMenu() {
    Iterable<MenuItem> menuItemsIterable = menuItemRepository.findAll();
    List<MenuItem> menuItems = new ArrayList<>();
    menuItemsIterable.forEach(menuItems::add);
    return menuItems;
  }

  public MenuItem getMenuItemById(String id) {
    int idInt = Integer.parseInt(id);
    return menuItemRepository.findById(idInt)
      .orElseThrow(() -> new NoSuchElementException("MenuItem with id " + idInt + " not found"));
  }

  public MenuItem updateMenuItems(String id, MenuItem updateItem){
    int idInt = Integer.parseInt(id);
    Optional<MenuItem> editedMenuItem = menuItemRepository.findById(idInt);
    if (editedMenuItem.isEmpty()) {
      throw new NoSuchElementException("No such menu item exists");
    }
    return createNewMenuItem(updateItem, editedMenuItem.get());
  }
  
  private MenuItem createNewMenuItem(MenuItem updateItem, MenuItem editedMenuItem) {
    editedMenuItem.setName(updateItem.getName());
    editedMenuItem.setDescription(updateItem.getDescription());
    editedMenuItem.setPrice(updateItem.getPrice());
    editedMenuItem.setAllergens(updateItem.getAllergens());
    editedMenuItem.setCalories(updateItem.getCalories());
    editedMenuItem.setDietaryRestrictions(updateItem.getDietaryRestrictions());
    editedMenuItem.setAvailable(updateItem.isAvailable());
    editedMenuItem.setImagePath(updateItem.getImagePath());
    editedMenuItem.setCategory(updateItem.getCategory());
    menuItemRepository.save(editedMenuItem);

    return editedMenuItem;
  }

}
