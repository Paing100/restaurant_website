package rhul.cs2810.controller;

import static net.bytebuddy.matcher.ElementMatchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.*;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import rhul.cs2810.model.*;
import rhul.cs2810.repository.CustomerRepository;
import rhul.cs2810.repository.MenuItemRepository;
import rhul.cs2810.repository.OrderMenuItemRepository;
import rhul.cs2810.repository.OrderRepository;
import rhul.cs2810.service.MenuItemService;

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
  @Autowired
  private OrderRepository orderRepository;
  @Autowired
  private CustomerRepository customerRepository;
  @Autowired
  private OrderMenuItemRepository orderMenuItemRepository;

  @Mock
  private MenuItemService menuItemService;


  @BeforeEach
  void setUp() {
    menuItemRepository.deleteAll(); // Clear repository before each test
  }

  @AfterEach
  void tearDown() {
    menuItemRepository.deleteAll(); // Ensure clean state after each test
  }

//  @Test
//  void testGetMenuItemById() throws JsonProcessingException, Exception {
//    MenuItem menuItem =
//      new MenuItem("Guacamole", "Classic Mexican dip made with avocados, cilantro, and lime", 5.99,
//        EnumSet.noneOf(Allergen.class), 150, EnumSet.noneOf(DietaryRestrictions.class), true,
//        "guac.src", 1);
//    MenuItem savedMenuItem = menuItemRepository.save(menuItem);
//
//    when(menuItemService.getMenuItemById("1")).thenReturn(menuItem);
//
//    MvcResult action = mockMvc.perform(
//        get("/MenuItems/get/{id}", "1").accept(MediaType.APPLICATION_JSON))
//      .andExpect(status().isOk()).andExpect(jsonPath("$.name").value(menuItem.getName()))
//      .andReturn();
//  }

  @Test
  void testGetMenuItemById_NoSuchElement() throws NoSuchElementException, Exception {
    when(menuItemService.getMenuItemById("1")).thenThrow(new NoSuchElementException());
    mockMvc.perform(get("/MenuItems/get/{id}", "1")
        .accept(MediaType.APPLICATION_JSON))
      .andExpect(status().isNotFound());
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

    MenuItem mockItem = new MenuItem(
      "Big Stew Pot",
      "It's a big stew pot.",
      20.0f,
      EnumSet.of(Allergen.EGG, Allergen.DAIRY),
      700,
      EnumSet.of(DietaryRestrictions.GLUTENFREE),
      true,
      "/images/stew.jpg",
      1
    );

    when(menuItemService.addMenuItem(params)).thenReturn(mockItem);

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

//  @Test
//  void getMenuTest() throws Exception {
//    List<MenuItem> mockMenu = List.of(
//      new MenuItem("Guacamole", "Classic dip", 5.99, null, 150, null, true, null, 1),
//      new MenuItem("Chili", "Spicy stew", 10.99, null, 300, null, true, null, 2)
//    );
//    when(menuItemService.getMenu()).thenReturn(mockMenu);
//
//    MvcResult action = mockMvc.perform(get("/MenuItems").contentType(MediaType.APPLICATION_JSON))
//      .andExpect(status().isOk()).andReturn();
//
//    List<?> menuItems =
//      objectMapper.readValue(action.getResponse().getContentAsString(), List.class);
//
//    assertEquals(2, menuItems.size(), "Menu should contain exactly 2 items");
//  }

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

    when(menuItemService.filterMenu(params)).thenReturn(List.of(savedMenuItem1, savedMenuItem2));

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

  @Test
  void testEndOfDay() throws Exception {
    Customer customer = new Customer();
    customer.setName("James");
    customer = customerRepository.save(customer);
    Order order = new Order();
    order.setCustomer(customer);
    order.setTableNum(1);
    order.setOrderStatus(OrderStatus.CREATED);
    orderRepository.save(order);

    MenuItem menuItem = new MenuItem();
    menuItem.setName("Burger");
    menuItem.setPrice(10.0);
    menuItem = menuItemRepository.save(menuItem);

    OrderMenuItemId orderMenuItemId = new OrderMenuItemId(order.getOrderId(), menuItem.getItemId());

    OrderMenuItem orderMenuItem = new OrderMenuItem();
    orderMenuItem.setOrderMenuItemsId(orderMenuItemId);
    orderMenuItem.setOrder(order);
    orderMenuItem.setQuantity(1);
    orderMenuItem = orderMenuItemRepository.save(orderMenuItem);
    System.out.println("ID: " + orderMenuItem);

    assertEquals(1, orderRepository.count());
    assertEquals(1, customerRepository.count());
    assertEquals(1, orderMenuItemRepository.count());

    MvcResult result = mockMvc.perform(
      post("/Manager/endOfDay").contentType(MediaType.APPLICATION_JSON)
    ).andReturn();

    assertEquals(0, orderRepository.count());
    assertEquals(0, customerRepository.count());
    assertEquals(0, orderMenuItemRepository.count());
  }
}
