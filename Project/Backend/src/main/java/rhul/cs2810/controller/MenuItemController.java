package rhul.cs2810.controller;


import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
      try {
        Allergen allergen = Allergen.valueOf(allergenStr.trim().toUpperCase());
        allergens.add(allergen);
      } catch (IllegalArgumentException e) {
        System.out.println("Invalid allergen: " + allergenStr);
      }
    }


    String[] str2 = params.get("dietary_restrictions").split(","); // get string params, split into
                                                                   // enums
    Set<DietaryRestrictions> dietaryRestrictions = EnumSet.noneOf(DietaryRestrictions.class);
    for (String dietaryRestrict : str2) {
      try {
        DietaryRestrictions restrict =
            DietaryRestrictions.valueOf(dietaryRestrict.trim().toUpperCase());
        dietaryRestrictions.add(restrict);
      } catch (IllegalArgumentException e) {
        System.out.println("Invalid dietary restriction: " + dietaryRestrict);
      }
    }


    MenuItem item =
        new MenuItem(String.valueOf(params.get("name")), String.valueOf(params.get("description")),
            Float.valueOf(params.get("price")), allergens, Integer.valueOf(params.get("calories")),
            dietaryRestrictions, Boolean.valueOf(params.get("available")));

    item = menuItemRepository.save(item);

    return ResponseEntity.ok(item);
  }

  @GetMapping(value = "/MenuItems")
  public ResponseEntity<List<MenuItem>> getMenu() {
    Iterable<MenuItem> menuItemsIterable = menuItemRepository.findAll();
    List<MenuItem> menuItems = new ArrayList<>();
    menuItemsIterable.forEach(menuItems::add);
    return ResponseEntity.ok(menuItems);
  }

}
