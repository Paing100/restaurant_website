package rhul.cs2810.controller;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderStatus;
import rhul.cs2810.repository.MenuItemRepository;
import rhul.cs2810.service.ManagerService;
import rhul.cs2810.service.OrderService;
import rhul.cs2810.model.Employee;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class ManagerControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Mock
  private OrderService orderService;

  @Mock
  private ManagerService managerService;

  @Autowired
  private MenuItemRepository menuItemRepository;

  List<MenuItem> menuItems;

  @BeforeEach
  void beforeEach() {
    menuItems = new ArrayList<MenuItem>();
    menuItemRepository.findAll().forEach(menuItems::add);

  }

  @Test
  void testGetOutstandingOrders() throws JsonProcessingException, Exception {
    Order mockOrder1 = new Order();
    mockOrder1.setOrderId(1);
    Order mockOrder2 = new Order();
    mockOrder2.setOrderId(2);

    when(managerService.getOutstandingOrders()).thenReturn(List.of(mockOrder1, mockOrder2));
    mockMvc.perform(get("/Manager/getOutstandingOrders"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.length()").value(2))
      .andExpect(jsonPath("$[0].orderId").value(1))
      .andExpect(jsonPath("$[1].orderId").value(2));
    verify(managerService,times(1)).getOutstandingOrders();
  }

  @Test
  void testCalculateRecommendedPrice() throws JsonProcessingException, Exception {

    MvcResult result = mockMvc
        .perform(
            get("/Manager/calculateRecommendedPrice").param("cost", "100.0").param("margin", "0.6"))
        .andExpect(status().isOk()).andReturn();
    double givenPrice = Double.parseDouble(result.getResponse().getContentAsString());

  }

  @Test
  void testShowAllStock() throws JsonProcessingException, Exception {
    MenuItem itemReduce = menuItemRepository.findById(1).orElse(null);
    itemReduce.setAvailable(false);
    itemReduce = menuItemRepository.save(itemReduce);
    MvcResult result =
        mockMvc.perform(get("/Manager/showAllStock")).andExpect(status().isOk()).andReturn();

    String content = result.getResponse().getContentAsString();
    assertTrue(content.contains("Birria Tacos"));
    assertTrue(content.contains("OUT OF STOCK"));
  }

  @Test
  void testGetAllEmployeeData() throws Exception {
    MvcResult result = mockMvc
        .perform(get("/Manager/getAllEmployeeData"))
        .andExpect(status().isOk())
        .andReturn();

    List<Employee> employees = objectMapper.readValue(
        result.getResponse().getContentAsString(),
        objectMapper.getTypeFactory().constructCollectionType(List.class, Employee.class)
    );
    assertTrue(employees != null);
  }

  @Test
  void testCalculateRecommendedPrice_ZeroCost() throws Exception {
    MvcResult result = mockMvc
        .perform(get("/Manager/calculateRecommendedPrice")
            .param("cost", "0.0")
            .param("margin", "0.6"))
        .andExpect(status().isOk())
        .andReturn();
    
    double calculatedPrice = Double.parseDouble(result.getResponse().getContentAsString());
    assertEquals(0.0, calculatedPrice);
  }

  @Test
  void testCalculateRecommendedPrice_ZeroMargin() throws Exception {
    MvcResult result = mockMvc
        .perform(get("/Manager/calculateRecommendedPrice")
            .param("cost", "100.0")
            .param("margin", "0.0"))
        .andExpect(status().isOk())
        .andReturn();
    
    double calculatedPrice = Double.parseDouble(result.getResponse().getContentAsString());
    assertEquals(100.0, calculatedPrice);
  }

  @Test
  void testShowAllStock_AllAvailable() throws Exception {
    // Set all items to available
    menuItems.forEach(item -> {
      item.setAvailable(true);
      menuItemRepository.save(item);
    });

    MvcResult result = mockMvc
        .perform(get("/Manager/showAllStock"))
        .andExpect(status().isOk())
        .andReturn();

    String content = result.getResponse().getContentAsString();
    assertTrue(content.contains("AVAILABLE"));
    assertTrue(!content.contains("OUT OF STOCK"));
  }

  @Test
  void testShowAllStock_AllOutOfStock() throws Exception {
    // Set all items to unavailable
    menuItems.forEach(item -> {
      item.setAvailable(false);
      menuItemRepository.save(item);
    });

    MvcResult result = mockMvc
        .perform(get("/Manager/showAllStock"))
        .andExpect(status().isOk())
        .andReturn();

    String content = result.getResponse().getContentAsString();
    assertTrue(content.contains("OUT OF STOCK"));
    assertTrue(!content.contains("AVAILABLE"));
  }
}
