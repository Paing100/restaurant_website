package rhul.cs2810.controller;


import java.util.EnumSet;
import java.util.Map;
import java.util.Set;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import rhul.cs2810.model.Allergen;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.repository.MenuItemRepository;


/**
 * A Controller for Menu Items.
 */
@RestController
public class MenuItemController {
  private final MenuItemRepository menuItemRepository;


  /**
   * A constructor for the MenuItemController.
   *
   * @param menuItemRepository the repository for menu items
   * @param categoryRepository the repository for categories
   */
  public MenuItemController(MenuItemRepository menuItemRepository) {
    this.menuItemRepository = menuItemRepository;

  }

  /**
   * A response entity for adding items.
   *
   * @param params input parameters given to read off of.
   */
  @PostMapping(value = "/MenuItems/addMenuItem")
  public ResponseEntity<MenuItem> addMenuItem(@RequestBody Map<String, String> params) {

    String str[] = params.get("allergens").split(",");
    Set<Allergen> allergens = EnumSet.noneOf(Allergen.class);
    for (String allergenStr : str) {
      Allergen allergen = Allergen.valueOf(allergenStr);
      allergens.add(allergen);
    }

    String[] str2 = params.get("dietaryRestrictions").split(","); // get string params, split into
                                                                  // enums
    Set<DietaryRestrictions> dietaryRestrictions = EnumSet.noneOf(DietaryRestrictions.class);
    for (String dietaryRestrict : str2) {
      DietaryRestrictions restrict = DietaryRestrictions.valueOf(dietaryRestrict);
      dietaryRestrictions.add(restrict);
    }

    MenuItem item =
        new MenuItem(String.valueOf(params.get("name")), String.valueOf(params.get("description")),
            Float.valueOf(params.get("price")), allergens, Integer.valueOf(params.get("calories")),
            dietaryRestrictions, Boolean.valueOf(params.get("available")));

    item = menuItemRepository.save(item);

    return ResponseEntity.ok(item);
  }

}
