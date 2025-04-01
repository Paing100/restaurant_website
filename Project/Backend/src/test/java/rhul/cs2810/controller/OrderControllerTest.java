package rhul.cs2810.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import rhul.cs2810.model.Employee;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.Waiter;
import rhul.cs2810.service.NotificationService;
import rhul.cs2810.service.OrderService;
import rhul.cs2810.service.WaiterService;

@AutoConfigureMockMvc
class OrderControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Mock
  private EntityManager entityManager;

  @Mock
  private OrderService orderService;

  @Mock
  private NotificationService notificationService;

  @Mock
  private WaiterService waiterService;

  @InjectMocks
  private OrderController orderController;

  @Mock
  private ObjectMapper objectMapper;

  List<Order> listOrders = new ArrayList<>();

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
    Order mockOrder = new Order();
    mockOrder.setOrderId(1);
    Waiter mockWaiter = new Waiter();
    Employee mockEmployee = new Employee();
    mockEmployee.setEmployeeId("123");
    mockWaiter.setEmployee(mockEmployee);
    mockOrder.setWaiter(mockWaiter);

    when(orderService.getOrder(mockOrder.getOrderId())).thenReturn(mockOrder);
    doNothing().when(orderService).submitOrder(1);

    mockMvc
        .perform(
            post("/api/order/{orderId}/submitOrder", mockOrder.getOrderId()).param("orderId", "1"))
        .andExpect(status().isOk()).andExpect(content().string("Order submitted successfully"));

    verify(orderService, times(1)).submitOrder(1);
  }

  @Test
  void testGetAllOrders() throws Exception {
    mockMvc.perform(get("/api/order/getAllOrders")).andExpect(status().isOk());

    verify(orderService, times(1)).getAllOrders();
  }

  @Test
  void testUpdatedOrderStatus() throws Exception {
    Order mockOrder = new Order();
    mockOrder.setOrderId(1);
    Waiter mockWaiter = new Waiter();
    Employee mockEmployee = new Employee();
    mockEmployee.setEmployeeId("123");
    mockWaiter.setEmployee(mockEmployee);
    mockOrder.setWaiter(mockWaiter);

    Map<String, String> map = new HashMap<>();
    map.put("orderStatus", "CREATED");

    when(orderService.getOrder(mockOrder.getOrderId())).thenReturn(mockOrder);
    doNothing().when(notificationService).sendNotification(anyString(), anyInt(), anyString(),
        anyString(), anyString());
    doNothing().when(orderService).saveUpdatedOrder(mockOrder);
    MvcResult result =
        mockMvc
            .perform(post("/api/order/{orderId}/updateOrderStatus", mockOrder.getOrderId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(map)).accept(MediaType.APPLICATION_JSON))
            .andReturn();
    assertEquals(HttpStatus.OK.value(), result.getResponse().getStatus());
    verify(orderService, times(1)).saveUpdatedOrder(mockOrder);
  }

  @Test
  void testCancelOrder() throws Exception {
    Order mockOrder = new Order();
    mockOrder.setOrderId(1);
    Waiter mockWaiter = new Waiter();
    Employee mockEmployee = new Employee();
    mockEmployee.setEmployeeId("123");
    mockWaiter.setEmployee(mockEmployee);
    mockOrder.setWaiter(mockWaiter);

    when(orderService.getOrder(1)).thenReturn(mockOrder);
    Query mockQuery = Mockito.mock(Query.class);
    when(entityManager.createNativeQuery(anyString())).thenReturn(mockQuery);
    when(mockQuery.setParameter(anyString(), any())).thenReturn(mockQuery);
    when(mockQuery.executeUpdate()).thenReturn(1);
    doNothing().when(notificationService).sendNotification(anyString(), anyInt(), anyString(),
        anyString(), anyString());

    mockMvc.perform(delete("/api/order/1/cancelOrder")).andExpect(status().isOk())
        .andExpect(content().string("Order deleted successfully"));

    verify(orderService, times(1)).getOrder(1);
    verify(notificationService, times(1)).sendNotification(anyString(), anyInt(), anyString(),
        anyString(), anyString());
    verify(mockQuery, times(1)).executeUpdate();
  }

  @Test
  void testMarkOrderAsPaid_Success() throws Exception {
    Order mockOrder = new Order();
    mockOrder.setOrderId(1);
    mockOrder.setOrderPaid(false);
    when(orderService.getOrder(1)).thenReturn(mockOrder);
    doNothing().when(orderService).saveUpdatedOrder(mockOrder);

    mockMvc
        .perform(post("/api/order/{orderId}/markAsPaid", 1).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().string("Order marked as paid successfully"));

    verify(orderService, times(1)).getOrder(1);
    verify(orderService, times(1)).saveUpdatedOrder(mockOrder);
  }

  @Test
  void testSubmitOrder_OrderNotFound() throws Exception {
    when(orderService.getOrder(1)).thenReturn(null);

    mockMvc.perform(post("/api/order/{orderId}/submitOrder", 1)).andExpect(status().isNotFound())
        .andExpect(content().string("Order not found"));
  }

  @Test
  void testSubmitOrder_IllegalStateException() throws Exception {
    Order mockOrder = new Order();
    mockOrder.setOrderId(1);
    Waiter mockWaiter = new Waiter();
    Employee mockEmployee = new Employee();
    mockEmployee.setEmployeeId("123");
    mockWaiter.setEmployee(mockEmployee);
    mockOrder.setWaiter(mockWaiter);

    when(orderService.getOrder(1)).thenReturn(mockOrder);
    doNothing().when(orderService).saveUpdatedOrder(mockOrder);
    doNothing().when(orderService).submitOrder(1);
    doNothing().when(notificationService).sendNotification(anyString(), anyInt(), anyString(),
        anyString(), anyString());

    mockMvc.perform(post("/api/order/{orderId}/submitOrder", 1)).andExpect(status().isOk())
        .andExpect(content().string("Order submitted successfully"));
  }

  @Test
  void testUpdateOrderStatus_OrderNotFound() throws Exception {
    when(orderService.getOrder(1)).thenReturn(null);

    Map<String, String> map = new HashMap<>();
    map.put("orderStatus", "CREATED");

    mockMvc
        .perform(post("/api/order/{orderId}/updateOrderStatus", 1)
            .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(map)))
        .andExpect(status().isNotFound()).andExpect(content().string("Order not found!"));
  }

  @Test
  void testUpdateOrderStatus_ReadyStatus() throws Exception {
    Order mockOrder = new Order();
    mockOrder.setOrderId(1);
    Waiter mockWaiter = new Waiter();
    Employee mockEmployee = new Employee();
    mockEmployee.setEmployeeId("123");
    mockWaiter.setEmployee(mockEmployee);
    mockOrder.setWaiter(mockWaiter);

    Map<String, String> map = new HashMap<>();
    map.put("orderStatus", "READY");

    when(orderService.getOrder(1)).thenReturn(mockOrder);
    doNothing().when(notificationService).sendNotification(anyString(), anyInt(), anyString(),
        anyString(), anyString());
    doNothing().when(orderService).saveUpdatedOrder(mockOrder);

    mockMvc
        .perform(post("/api/order/{orderId}/updateOrderStatus", 1)
            .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(map)))
        .andExpect(status().isOk()).andExpect(content().string("Order Status changed to READY"));
  }

  @Test
  void testMarkOrderAsPaid_OrderNotFound() throws Exception {
    when(orderService.getOrder(1)).thenReturn(null);

    mockMvc.perform(post("/api/order/{orderId}/markAsPaid", 1)).andExpect(status().isNotFound())
        .andExpect(content().string("Order not found!"));
  }

  @Test
  void testCancelOrder_OrderNotFound() throws Exception {
    when(orderService.getOrder(1)).thenReturn(null);

    mockMvc.perform(delete("/api/order/1/cancelOrder")).andExpect(status().isNotFound())
        .andExpect(content().string("Order not found"));

    verify(orderService, times(1)).getOrder(1);
    verify(notificationService, never()).sendNotification(anyString(), anyInt(), anyString(),
        anyString(), anyString());
  }

  @Test
  void testUpdateOrder_Success() throws Exception {
    Order mockOrder = new Order();
    mockOrder.setOrderId(1);
    mockOrder.setTableNum(5);
    Waiter mockWaiter = new Waiter();
    Employee mockEmployee = new Employee();
    mockEmployee.setEmployeeId("123");
    mockWaiter.setEmployee(mockEmployee);
    mockOrder.setWaiter(mockWaiter);

    Map<String, Integer> updateRequest = new HashMap<>();
    updateRequest.put("tableNum", 10);

    when(orderService.getOrder(1)).thenReturn(mockOrder);
    when(waiterService.findWaiterForTable(10)).thenReturn(Optional.of(mockWaiter));
    doNothing().when(orderService).saveUpdatedOrder(mockOrder);

    mockMvc
        .perform(post("/api/orders/{orderId}/updateOrder", 1)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(content().string("Order updated successfully"));

    verify(orderService, times(1)).getOrder(1);
    verify(waiterService, times(1)).findWaiterForTable(10);
    verify(orderService, times(1)).saveUpdatedOrder(mockOrder);
  }

  @Test
  void testUpdateOrder_OrderNotFound() throws Exception {
    Map<String, Integer> updateRequest = new HashMap<>();
    updateRequest.put("tableNum", 10);

    when(orderService.getOrder(1)).thenReturn(null);

    mockMvc
        .perform(post("/api/orders/{orderId}/updateOrder", 1)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(updateRequest)))
        .andExpect(status().isNotFound())
        .andExpect(content().string("Order not found"));

    verify(orderService, times(1)).getOrder(1);
    verify(waiterService, never()).findWaiterForTable(anyInt());
    verify(orderService, never()).saveUpdatedOrder(any(Order.class));
  }

  @Test
  void testUpdateOrder_NoTableNumber() throws Exception {
    Order mockOrder = new Order();
    mockOrder.setOrderId(1);
    
    Map<String, Integer> updateRequest = new HashMap<>();
    // No tableNum in request

    when(orderService.getOrder(1)).thenReturn(mockOrder);

    mockMvc
        .perform(post("/api/orders/{orderId}/updateOrder", 1)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(updateRequest)))
        .andExpect(status().isBadRequest())
        .andExpect(content().string("Table number is required"));

    verify(orderService, times(1)).getOrder(1);
    verify(waiterService, never()).findWaiterForTable(anyInt());
    verify(orderService, never()).saveUpdatedOrder(any(Order.class));
  }

  @Test
  void testUpdateOrder_NoWaiterAvailable() throws Exception {
    Order mockOrder = new Order();
    mockOrder.setOrderId(1);
    mockOrder.setTableNum(5);

    Map<String, Integer> updateRequest = new HashMap<>();
    updateRequest.put("tableNum", 10);

    when(orderService.getOrder(1)).thenReturn(mockOrder);
    when(waiterService.findWaiterForTable(10)).thenReturn(Optional.empty());

    mockMvc
        .perform(post("/api/orders/{orderId}/updateOrder", 1)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(updateRequest)))
        .andExpect(status().isBadRequest())
        .andExpect(content().string("No waiter available for the new table"));

    verify(orderService, times(1)).getOrder(1);
    verify(waiterService, times(1)).findWaiterForTable(10);
    verify(orderService, never()).saveUpdatedOrder(any(Order.class));
  }
}
