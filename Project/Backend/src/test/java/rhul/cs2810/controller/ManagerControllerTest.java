package rhul.cs2810.controller;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
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
import rhul.cs2810.service.OrderService;

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
    Order mockOrder = new Order();
    mockOrder.setOrderStatus(OrderStatus.IN_PROGRESS);
    orderService.saveUpdatedOrder(mockOrder);

    mockMvc.perform(get("/Manager/getOutstandingOrders")).andExpect(status().isOk()).andReturn();
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


}
