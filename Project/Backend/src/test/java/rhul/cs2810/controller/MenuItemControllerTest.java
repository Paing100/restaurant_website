package rhul.cs2810.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.Disabled;
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
import rhul.cs2810.model.Customer;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.model.Order;
import rhul.cs2810.repository.CustomerRepository;
import rhul.cs2810.repository.MenuItemRepository;
import rhul.cs2810.repository.OrderRepository;

@Disabled
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
public class MenuItemControllerTest {

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
  MenuItem menuItem;
  Customer customer;

  @Test
  void addMenuItemTest() throws JsonProcessingException, Exception {
    Map<String, String> params = new HashMap<String, String>();
    params.put("name", "big stew pot");
    params.put("description", "its a beeg stew pot");
    params.put("price", "20");
    params.put("allergens", "EGG,DAIRY");
    params.put("calories", "700");
    params.put("dietary_restrictions", "GLUTENFREE");
    params.put("available", "true");

    MvcResult action = mockMvc
        .perform(MockMvcRequestBuilders.post("/MenuItems/addMenuItem")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(params)).accept(MediaType.APPLICATION_JSON))
        .andReturn();
    assertEquals(HttpStatus.OK.value(), action.getResponse().getStatus()); // testing for 200/201
    MenuItem testItem =
        objectMapper.readValue(action.getResponse().getContentAsString(), MenuItem.class);
    assertEquals(testItem.getDescription(), "its a beeg stew pot");
    assertTrue(testItem.getAllergens().isEmpty() == false);

    orderRepository.deleteAll();
    menuItemRepository.deleteAll();
  }

}
