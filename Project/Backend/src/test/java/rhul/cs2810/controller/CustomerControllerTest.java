package rhul.cs2810.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import rhul.cs2810.model.Allergen;
import rhul.cs2810.model.Customer;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.model.Order;
import rhul.cs2810.repository.CustomerRepository;
import rhul.cs2810.repository.MenuItemRepository;
import rhul.cs2810.repository.OrderRepository;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
public class CustomerControllerTest {
  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private MenuItemRepository menuItemRepository;

  @Autowired
  private CustomerRepository customerRepository;

  Order order;
  ArrayList<MenuItem> menuItems;
  Customer customer;

  @BeforeEach
  void beforeEach() {
    MenuItem item = new MenuItem("Guacamole",
        "Classic Mexican dip made with avocados, cilantro, and lime", 5.99,
        EnumSet.noneOf(Allergen.class), 150, EnumSet.noneOf(DietaryRestrictions.class), true);
    MenuItem item2 = new MenuItem("evil guac", "classic evil guac with milk, cilantro, and lime",
        5.99, EnumSet.of(Allergen.DAIRY), 150, EnumSet.of(DietaryRestrictions.VEGAN), true);
    item = menuItemRepository.save(item);
    item2 = menuItemRepository.save(item2);

    orderRepository.deleteAll();
    customerRepository.deleteAll(); // this is supposed to clear everything...

  }

  @Test
  void addCustomerTest() throws JsonProcessingException, Exception {
    Map<String, String> params = new HashMap<String, String>();
    params.put("customer_id", "1");

    MvcResult action = mockMvc
        .perform(MockMvcRequestBuilders.post("/Customers/addCustomer")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(params)).accept(MediaType.APPLICATION_JSON))
        .andReturn();
    assertEquals(HttpStatus.OK.value(), action.getResponse().getStatus()); // testing for 200/201
    Customer testCustomer =
        objectMapper.readValue(action.getResponse().getContentAsString(), Customer.class);
    assertEquals(1, testCustomer.getCustomerID()); // this works here...
    assertEquals(1, testCustomer.getOrder().getOrderId());

    Map<String, String> params2 = new HashMap<String, String>();
    params2.put("customer_id", "2");

    MvcResult action2 = mockMvc
        .perform(MockMvcRequestBuilders.post("/Customers/addCustomer")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(params2)).accept(MediaType.APPLICATION_JSON))
        .andReturn();
    assertEquals(HttpStatus.OK.value(), action2.getResponse().getStatus()); // testing for 200/201
    Customer testCustomer2 =
        objectMapper.readValue(action2.getResponse().getContentAsString(), Customer.class);

    assertEquals(2, testCustomer2.getCustomerID()); // this works here...
    assertEquals(2, testCustomer2.getOrder().getOrderId());

    orderRepository.deleteAll();
    customerRepository.deleteAll(); // this is supposed to clear everything...


  }

  @Test
  void addItemTest() throws JsonProcessingException, Exception {
    Map<String, String> params = new HashMap<String, String>();
    params.put("customer_id", "1"); // THIS IS ONE
    MvcResult action = mockMvc
        .perform(MockMvcRequestBuilders.post("/Customers/addCustomer")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(params)).accept(MediaType.APPLICATION_JSON))
        .andReturn();
    assertEquals(HttpStatus.OK.value(), action.getResponse().getStatus()); // testing for 200/201
    Customer testCustomer =
        objectMapper.readValue(action.getResponse().getContentAsString(), Customer.class);
    assertEquals(3, testCustomer.getCustomerID()); // so why is this 3????????????????????????????

    Map<String, String> params2 = new HashMap<String, String>();
    params2.put("customer_id", "3"); // why????
    params2.put("item_id", "1");

    MvcResult action2 = mockMvc
        .perform(MockMvcRequestBuilders.post("/Customers/addItemToCart")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(params2)).accept(MediaType.APPLICATION_JSON))
        .andReturn();
    assertEquals(HttpStatus.OK.value(), action2.getResponse().getStatus()); // testing for 200/201
    Customer testCustomer2 =
        objectMapper.readValue(action2.getResponse().getContentAsString(), Customer.class);
    assertTrue(testCustomer2.getOrder().getOrderedItems().isEmpty() != true);

    // WHY DOES IT WORK THIS WAY


    // customerRepository.deleteAll();

  }

  @Test
  void filterTest() throws JsonProcessingException, Exception {
    Map<String, String> params = new HashMap<String, String>();
    params.put("customer_id", "4"); //
    MvcResult action = mockMvc
        .perform(MockMvcRequestBuilders.post("/Customers/addCustomer")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(params)).accept(MediaType.APPLICATION_JSON))
        .andReturn();
    assertEquals(HttpStatus.OK.value(), action.getResponse().getStatus()); // testing for 200/201
    Customer testCustomer =
        objectMapper.readValue(action.getResponse().getContentAsString(), Customer.class);
    assertEquals(4, testCustomer.getCustomerID());

    Map<String, String> params2 = new HashMap<String, String>();
    params2.put("customer_id", "3"); // why????
    params2.put("item_id", "1");

    MvcResult action2 = mockMvc
        .perform(MockMvcRequestBuilders.post("/Customers/addItemToCart")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(params2)).accept(MediaType.APPLICATION_JSON))
        .andReturn();
    assertEquals(HttpStatus.OK.value(), action2.getResponse().getStatus()); // testing for 200/201
    Customer testCustomer2 =
        objectMapper.readValue(action2.getResponse().getContentAsString(), Customer.class);
    assertTrue(testCustomer2.getOrder().getOrderedItems().isEmpty() != true);

    // WHY DOES IT WORK THIS WAY


    // customerRepository.deleteAll();

  }



}
