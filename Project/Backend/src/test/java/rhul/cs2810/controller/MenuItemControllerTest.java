package rhul.cs2810.controller;

import static net.bytebuddy.matcher.ElementMatchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.*;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import rhul.cs2810.model.Allergen;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.repository.MenuItemRepository;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class MenuItemControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private MenuItemRepository menuItemRepository;

  @BeforeEach
  void setUp() {
    menuItemRepository.deleteAll(); // Clear repository before each test
  }

  @AfterEach
  void tearDown() {
    menuItemRepository.deleteAll(); // Ensure clean state after each test
  }

  @Test
  void testGetMenuItemById() throws JsonProcessingException, Exception {
    MenuItem menuItem =
      new MenuItem("Guacamole", "Classic Mexican dip made with avocados, cilantro, and lime", 5.99,
        EnumSet.noneOf(Allergen.class), 150, EnumSet.noneOf(DietaryRestrictions.class), true,
        "guac.src", 1);
    MenuItem savedMenuItem = menuItemRepository.save(menuItem);

    MvcResult action = mockMvc.perform(
        get("/MenuItems/get/{id}", savedMenuItem.getItemId()).accept(MediaType.APPLICATION_JSON))
      .andExpect(status().isOk()).andExpect(jsonPath("$.name").value(menuItem.getName()))
      .andReturn();
  }

  @Test
  void addMenuItemTest() throws Exception {
    Map<String, String> params = new HashMap<>();
    params.put("name", "Big Stew Pot");
    params.put("description", "It's a big stew pot.");
    params.put("price", "20.0");
    params.put("allergens", "EGG,DAIRY");
    params.put("calories", "700");
    params.put("dietaryRestrictions", "GLUTENFREE");
    params.put("available", "true");
    params.put("imagePath", "/images/stew.jpg");
    params.put("category", "1");

    MvcResult action = mockMvc.perform(
        post("/MenuItems/addMenuItem").contentType(MediaType.APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(params)).accept(MediaType.APPLICATION_JSON))
      .andExpect(status().isOk()).andReturn();

    // Deserialize response
    MenuItem testItem =
      objectMapper.readValue(action.getResponse().getContentAsString(), MenuItem.class);

    assertNotNull(testItem, "Returned MenuItem should not be null");
    assertEquals("Big Stew Pot", testItem.getName(), "Name mismatch");
    assertEquals("It's a big stew pot.", testItem.getDescription(), "Description mismatch");
    assertEquals(20.0, testItem.getPrice(), "Price mismatch");
    assertEquals(700, testItem.getCalories(), "Calories mismatch");
    assertFalse(testItem.getAllergens().isEmpty(), "Allergens list should not be empty");
    assertEquals("/images/stew.jpg", testItem.getImagePath(), "Image path mismatch");
    assertEquals(1, testItem.getCategory(), "Category mismatch");
  }

  @Test
  void getMenuTest() throws Exception {
    menuItemRepository.save(
      new MenuItem("Guacamole", "Classic dip", 5.99, null, 150, null, true, null, 1));
    menuItemRepository.save(
      new MenuItem("Chili", "Spicy stew", 10.99, null, 300, null, true, null, 2));

    MvcResult action = mockMvc.perform(get("/MenuItems").contentType(MediaType.APPLICATION_JSON))
      .andExpect(status().isOk()).andReturn();

    List<?> menuItems =
      objectMapper.readValue(action.getResponse().getContentAsString(), List.class);

    assertEquals(2, menuItems.size(), "Menu should contain exactly 2 items");
  }

  @Test
  void testUpdateMenuItem() throws Exception {
    MenuItem menuItem =
      new MenuItem("Guacamole", "Classic Mexican dip made with avocados, cilantro, and lime", 5.99,
        EnumSet.noneOf(Allergen.class), 150, EnumSet.noneOf(DietaryRestrictions.class), true,
        "guac.src", 1);

    MenuItem savedMenuItem = menuItemRepository.save(menuItem);

    MenuItem updatedMenuItem =
      new MenuItem("Guacamole", "Updated description", 6.99, EnumSet.noneOf(Allergen.class), 180,
        EnumSet.noneOf(DietaryRestrictions.class), true, "guac_updated.src",
        savedMenuItem.getItemId());

    MvcResult action = mockMvc.perform(
        put("/MenuItems/edit/{id}", savedMenuItem.getItemId()).contentType(MediaType.APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(updatedMenuItem))).andExpect(status().isOk())
      .andExpect(jsonPath("$.name").value(updatedMenuItem.getName()))
      .andExpect(jsonPath("$.description").value(updatedMenuItem.getDescription()))
      .andExpect(jsonPath("$.price").value(updatedMenuItem.getPrice())).andReturn();
  }

  @Test
  void testFilterMenu() throws Exception {
    Map<String, String> params = new HashMap<>();
    params.put("allergens", "DAIRY");

    MenuItem menuItem1 =
      new MenuItem("Guacamole", "Classic Mexican dip made with avocados, cilantro, and lime", 5.99,
        EnumSet.noneOf(Allergen.class), 150, EnumSet.noneOf(DietaryRestrictions.class), true,
        "guac.src", 1);

    MenuItem menuItem2 =
      new MenuItem("Something", "It's good", 5.99, Collections.singleton(Allergen.DAIRY), 150,
        Collections.singleton(DietaryRestrictions.VEGAN), true, "guac.src", 1);

    MenuItem savedMenuItem1 = menuItemRepository.save(menuItem1);
    MenuItem savedMenuItem2 = menuItemRepository.save(menuItem2);

    MvcResult action = mockMvc.perform(post("/Menu/filter")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(params)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$").isArray())
      .andExpect(jsonPath("$[*]").isNotEmpty())
      .andExpect(jsonPath("$[*].allergens").exists())
      .andExpect(jsonPath("$[0].name").value("Guacamole"))
      .andReturn();

  }
}
