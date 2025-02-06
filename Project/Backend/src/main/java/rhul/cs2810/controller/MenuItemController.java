package rhul.cs2810.controller;


import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import rhul.cs2810.model.Category;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.repository.CategoryRepository;
import rhul.cs2810.repository.MenuItemRepository;


/**
 * A Controller for Menu Items.
 */
@RestController
public class MenuItemController {
  private final MenuItemRepository menuItemRepository;
  private final CategoryRepository categoryRepository;


  /**
   * A constructor for the MenuItemController.
   *
   * @param menuItemRepository the repository for menu items
   * @param categoryRepository the repository for categories
   */
  public MenuItemController(MenuItemRepository menuItemRepository,
      CategoryRepository categoryRepository) {
    this.menuItemRepository = menuItemRepository;
    this.categoryRepository = categoryRepository;

  }

  /**
   * A response entity for adding items.
   *
   * @param params input parameters given to read off of.
   */
  @PostMapping(value = "/MenuItems/addMenuItem")
  public ResponseEntity<MenuItem> addMenuItem(@RequestBody Map<String, String> params) {

    Category category =
        categoryRepository.findById(Long.valueOf(params.get("categoryId"))).orElse(null);

    String str = params.get("allergens");
    List<String> allergens = Arrays.asList(str.split(",")); // so format would be "gluten, nuts,
                                                            // fish"

    String[] str2 = params.get("dietaryRestrictions").split(","); // get string params, split into
                                                                  // enums
    Set<DietaryRestrictions> dietaryRestrictions = EnumSet.noneOf(DietaryRestrictions.class);
    for (String dietaryRestrict : str2) {
      DietaryRestrictions restrict = DietaryRestrictions.valueOf(dietaryRestrict);
      dietaryRestrictions.add(restrict);
    }

    MenuItem item = new MenuItem(Integer.valueOf(params.get("item_id")),
        String.valueOf(params.get("name")), category, String.valueOf(params.get("description")),
        Float.valueOf(params.get("price")), allergens, Integer.valueOf(params.get("calories")),
        dietaryRestrictions, Boolean.valueOf(params.get("available")));

    item = menuItemRepository.save(item);

    return ResponseEntity.ok(item);
  }

}
