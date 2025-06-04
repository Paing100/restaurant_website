package rhul.cs2810.controller;

import java.util.*;

import org.apache.coyote.Response;
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
    MenuItem item = menuItemService.addMenuItem(params);
    return ResponseEntity.ok(item);
  }

  /**
   * Retrieves the menu.
   *
   * @return a list of menu items from the database.
   */
  @GetMapping(value = "/MenuItems")
  public ResponseEntity<List<MenuItem>> getMenu() {
    List<MenuItem> menuItems = menuItemService.getMenu();
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
    try {
      MenuItem menuItem = menuItemService.getMenuItemById(id);
      return ResponseEntity.ok(menuItem);
    }
    catch(NoSuchElementException e) {
      return ResponseEntity.notFound().build();
    }
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
    try {
      MenuItem existingMenuItem = menuItemService.updateMenuItems(id, updateItem);
      return ResponseEntity.ok(existingMenuItem);
    }
    catch (NoSuchElementException e) {
      return ResponseEntity.notFound().build();
    }
  }

}
