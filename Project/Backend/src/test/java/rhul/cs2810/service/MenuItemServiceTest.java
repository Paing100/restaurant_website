package rhul.cs2810.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import rhul.cs2810.model.Allergen;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.repository.MenuItemRepository;

class MenuItemServiceTest {

  @Mock
  private MenuItemRepository menuItemRepository;

  @InjectMocks
  private MenuItemService menuItemService;

  private List<MenuItem> mockMenuItems;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);

    MenuItem item1 = new MenuItem();
    item1.setName("Salad");
    item1.setDietaryRestrictions(
        EnumSet.of(DietaryRestrictions.VEGAN, DietaryRestrictions.GLUTENFREE));
    item1.setAllergens(EnumSet.noneOf(Allergen.class));

    MenuItem item2 = new MenuItem();
    item2.setName("Cheese Pizza");
    item2.setDietaryRestrictions(EnumSet.of(DietaryRestrictions.VEGETARIAN));
    item2.setAllergens(EnumSet.of(Allergen.DAIRY));

    MenuItem item3 = new MenuItem();
    item3.setName("Grilled Chicken");
    item3.setDietaryRestrictions(EnumSet.noneOf(DietaryRestrictions.class));
    item3.setAllergens(EnumSet.noneOf(Allergen.class));

    mockMenuItems = Arrays.asList(item1, item2, item3);

    when(menuItemRepository.findAll()).thenReturn(mockMenuItems);
  }

  @Test
  void testFilterMenu_WithDietaryRestrictions() {
    Map<String, String> params = new HashMap<>();
    params.put("dietaryRestrictions", "VEGAN");

    List<MenuItem> filteredItems = menuItemService.filterMenu(params);

    assertEquals(2, filteredItems.size());
    assertEquals("Salad", filteredItems.get(0).getName());
  }

  @Test
  void testFilterMenu_WithAllergens() {
    Map<String, String> params = new HashMap<>();
    params.put("allergens", "DAIRY");

    List<MenuItem> filteredItems = menuItemService.filterMenu(params);

    assertEquals(2, filteredItems.size());
    assertTrue(filteredItems.stream().noneMatch(item -> item.getName().equals("Cheese Pizza")));
  }

  @Test
  void testFilterMenu_WithMultipleFilters() {
    Map<String, String> params = new HashMap<>();
    params.put("dietaryRestrictions", "VEGETARIAN");
    params.put("allergens", "DAIRY");

    List<MenuItem> filteredItems = menuItemService.filterMenu(params);

    assertEquals(1, filteredItems.size());
  }

  @Test
  void testFilterMenu_NoFilters() {
    Map<String, String> params = new HashMap<>();

    List<MenuItem> filteredItems = menuItemService.filterMenu(params);

    assertEquals(3, filteredItems.size());
  }

  @Test
  void testAddMenuItem() {
    Map<String, String> params = new HashMap<>();
    params.put("name", "Vegan Burger");
    params.put("description", "Delicious plant-based burger");
    params.put("price", "9.99");
    params.put("calories", "450");
    params.put("available", "true");
    params.put("imagePath", "/images/veganburger.jpg");
    params.put("category", "1");
    params.put("allergens", "dairy");
    params.put("dietaryRestrictions", "vegan");

    Set<Allergen> allergens = EnumSet.of(Allergen.DAIRY);
    Set<DietaryRestrictions> restrictions = EnumSet.of(DietaryRestrictions.VEGAN);

    MenuItem expectedItem = new MenuItem(
      "Vegan Burger", "Delicious plant-based burger", 9.99f,
      allergens, 450, restrictions, true, "/images/veganburger.jpg", 1
    );

    when(menuItemRepository.save(any(MenuItem.class))).thenReturn(expectedItem);
    MenuItem actualItem = menuItemService.addMenuItem(params);
    assertEquals(expectedItem, actualItem);
  }

  @Test
  void testGetMenu() {
    MenuItem item1 = new MenuItem();
    item1.setItemId(1);
    MenuItem item2 = new MenuItem();
    item2.setItemId(2);
    List<MenuItem> expectedList = new ArrayList<>();
    expectedList.add(item1);
    expectedList.add(item2);

    when(menuItemRepository.findAll()).thenReturn(expectedList);
    List<MenuItem> actualList = menuItemService.getMenu();

    assertEquals(expectedList.get(0), actualList.get(0));
    assertEquals(expectedList.get(1), actualList.get(1));
  }

  @Test
  void testGetMenuItemById() {
    MenuItem item1 = new MenuItem();
    item1.setItemId(1);
    when(menuItemRepository.findById(1)).thenReturn(Optional.of(item1));
    MenuItem result = menuItemService.getMenuItemById("1");

    assertEquals(item1.getItemId(), result.getItemId());
  }

  @Test
  void testUpdateMenuItems() {
    MenuItem item1 = new MenuItem();
    item1.setItemId(1);
    item1.setName("A");
    MenuItem item2 = new MenuItem();
    item2.setItemId(2);
    item2.setName("B");

    when(menuItemRepository.findById(1)).thenReturn(Optional.of(item1));
    MenuItem result = menuItemService.updateMenuItems("1", item2);

    assertEquals(result.getName(), item2.getName());
  }

  @Test
  void testUpdateMenuItems_NoSuchElement() {
    MenuItem item1 = new MenuItem();
    item1.setItemId(1);
    item1.setName("A");

    when(menuItemRepository.findById(2)).thenReturn(Optional.empty());
    assertThrows(NoSuchElementException.class, () -> {
      menuItemService.updateMenuItems("2", item1);
    });
  }
}
