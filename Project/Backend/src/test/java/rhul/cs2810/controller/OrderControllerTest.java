package rhul.cs2810.controller;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

import rhul.cs2810.model.Order;
import rhul.cs2810.service.OrderService;

class OrderControllerTest {

  private MockMvc mockMvc;

  @Mock
  private OrderService orderService;

  @InjectMocks
  private OrderController orderController;

  private ObjectMapper objectMapper;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(orderController).build();
    objectMapper = new ObjectMapper();
  }

  @Test
  void testGetOrder() throws Exception {
    Order mockOrder = new Order();

    when(orderService.getOrder(1)).thenReturn(mockOrder);

    mockMvc.perform(get("/api/orders/1/getOrder")).andExpect(status().isOk());

    verify(orderService, times(1)).getOrder(1);
  }

  @Test
  void testAddItemToOrder() throws Exception {
    mockMvc.perform(post("/api/orders/1/addItems").param("itemId", "101").param("quantity", "2"))
        .andExpect(status().isOk()).andExpect(content().string("Item added to order"));

    verify(orderService, times(1)).addItemToOrder(1, 101, 2);
  }

  @Test
  void testRemoveItemFromOrder() throws Exception {
    mockMvc.perform(delete("/api/orders/1/removeItems").param("itemId", "101"))
        .andExpect(status().isOk()).andExpect(content().string("Item removed from order"));

    verify(orderService, times(1)).removeItemFromOrder(1, 101);
  }

  @Test
  void testSubmitOrder() throws Exception {
    mockMvc.perform(post("/api/Order/1/submitOrder")).andExpect(status().isOk())
        .andExpect(content().string("Order submitted successfully"));

    verify(orderService, times(1)).submitOrder(1);
  }

}
