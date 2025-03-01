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

}
