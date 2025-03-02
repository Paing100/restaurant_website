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
    params.put("dietary_restrictions", "VEGAN");

    List<MenuItem> filteredItems = menuItemService.filterMenu(params);

    assertEquals(1, filteredItems.size());
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
    params.put("dietary_restrictions", "VEGETARIAN");
    params.put("allergens", "DAIRY");

    List<MenuItem> filteredItems = menuItemService.filterMenu(params);

    assertEquals(0, filteredItems.size());
  }

  @Test
  void testFilterMenu_NoFilters() {
    Map<String, String> params = new HashMap<>();

    List<MenuItem> filteredItems = menuItemService.filterMenu(params);

    assertEquals(3, filteredItems.size());
  }
}
