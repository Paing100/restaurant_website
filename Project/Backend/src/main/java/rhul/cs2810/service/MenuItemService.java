package rhul.cs2810.service;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
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
    Set<DietaryRestrictions> dietaryRestrictions = EnumSet.noneOf(DietaryRestrictions.class);
    if (params.containsKey("dietary_restrictions")
        && !params.get("dietary_restrictions").isEmpty()) {
      String[] dietaryStr = params.get("dietary_restrictions").split(",");
      for (String dietaryRestrict : dietaryStr) {
        DietaryRestrictions restrict =
            DietaryRestrictions.valueOf((dietaryRestrict.trim().replace("-", "").toUpperCase()));
        dietaryRestrictions.add(restrict);
      }
    }

    Set<Allergen> allergens = EnumSet.noneOf(Allergen.class);
    if (params.containsKey("allergens") && !params.get("allergens").isEmpty()) {
      String[] allergensStr = params.get("allergens").split(",");
      for (String allergen : allergensStr) {
        Allergen allergy = Allergen.valueOf(allergen.trim().toUpperCase());
        allergens.add(allergy);
      }
    }

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

}
