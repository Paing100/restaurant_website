package rhul.cs2810.controller;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import rhul.cs2810.model.Allergen;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.repository.MenuItemRepository;
import rhul.cs2810.service.MenuItemService;

@RestController
public class MenuItemController {
  private final MenuItemRepository menuItemRepository;

  @Autowired
  private MenuItemService menuItemService;

  public MenuItemController(MenuItemRepository menuItemRepository) {
    this.menuItemRepository = menuItemRepository;
  }

  @PostMapping(value = "/Menu/filter")
  public ResponseEntity<List<MenuItem>> filterMenuItems(@RequestBody Map<String, String> params) {
    List<MenuItem> filteredItems = menuItemService.filterMenu(params);
    return ResponseEntity.ok(filteredItems);
  }

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

  @GetMapping(value = "/MenuItems")
  public ResponseEntity<List<MenuItem>> getMenu() {
    Iterable<MenuItem> menuItemsIterable = menuItemRepository.findAll();
    List<MenuItem> menuItems = new ArrayList<>();
    menuItemsIterable.forEach(menuItems::add);
    return ResponseEntity.ok(menuItems);
  }
}
