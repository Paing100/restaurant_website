package rhul.cs2810.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.*;

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
import rhul.cs2810.model.OrderStatus;
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

    when(orderService.updateOrderStatus(mockOrder.getOrderId(), map)).thenReturn(mockOrder);
    MvcResult result =
      mockMvc
        .perform(post("/api/order/{orderId}/updateOrderStatus", mockOrder.getOrderId())
          .contentType(MediaType.APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(map)).accept(MediaType.APPLICATION_JSON))
        .andReturn();
    assertEquals(HttpStatus.OK.value(), result.getResponse().getStatus());
    verify(orderService, times(1)).updateOrderStatus(1, map);
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

    doNothing().when(orderService).cancelOrder(mockOrder.getOrderId());

    mockMvc.perform(delete("/api/order/1/cancelOrder")).andExpect(status().isOk())
      .andExpect(content().string("Order deleted successfully"));

    verify(orderService, times(1)).cancelOrder(mockOrder.getOrderId());
  }

  @Test
  void testMarkOrderAsPaid_Success() throws Exception {
    Order mockOrder = new Order();
    mockOrder.setOrderId(1);
    mockOrder.setOrderPaid(false);
    doNothing().when(orderService).markOrderAsPaid(mockOrder.getOrderId());

    mockMvc
      .perform(post("/api/order/{orderId}/markAsPaid", 1).contentType(MediaType.APPLICATION_JSON))
      .andExpect(status().isOk())
      .andExpect(content().string("Order marked as paid successfully"));

    verify(orderService, times(1)).markOrderAsPaid(mockOrder.getOrderId());
  }

  @Test
  void testSubmitOrder_OrderNotFound() throws Exception {
    doThrow(new NoSuchElementException("Order not found")).when(orderService).submitOrder(100);
    mockMvc.perform(post("/api/order/{orderId}/submitOrder", 100)).andExpect(status().isNotFound())
      .andExpect(content().string("Order not found"));
  }

  @Test
  void testSubmitOrder_IllegalState() throws Exception {
    doThrow(new IllegalStateException("Order already submitted")).when(orderService).submitOrder(1);
    mockMvc.perform(post("/api/order/{orderId}/submitOrder", 1))
      .andExpect(status().isBadRequest())
      .andExpect(content().string("Order already submitted"));
  }

  @Test
  void testSubmitOrder_GenericException() throws Exception {
    doThrow(new RuntimeException("Unexpected Error")).when(orderService).submitOrder(1);
    mockMvc.perform(post("/api/order/{orderId}/submitOrder", 1))
      .andExpect(status().isInternalServerError())
      .andExpect(content().string("Error submitting order: Unexpected Error"));

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
    Map<String, String> map = new HashMap<>();
    map.put("orderStatus", "CREATED");
    when(orderService.updateOrderStatus(1, map)).thenThrow(
      new NoSuchElementException("Order not found!"));

    mockMvc.perform(
        post("/api/order/{orderId}/updateOrderStatus", 1).contentType(MediaType.APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(map))).andExpect(status().isNotFound())
      .andExpect(content().string("Order not found!"));
  }

  @Test
  void testUpdateOrderStatus_GenericException() throws Exception {
    Map<String, String> map = new HashMap<>();
    map.put("orderStatus", "CREATED");
    doThrow(new RuntimeException("Unexpected Error")).when(orderService).updateOrderStatus(1, map);
    mockMvc.perform(post("/api/order/{orderId}/updateOrderStatus", 1)
        .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(map)))
      .andExpect(status().isInternalServerError())
      .andExpect(content().string("Unexpected Error"));

  }

  @Test
  void testUpdateOrderStatus_ReadyStatus() throws Exception {
    Order mockOrder = new Order();
    mockOrder.setOrderId(1);
    mockOrder.setOrderStatus(OrderStatus.READY);
    Waiter mockWaiter = new Waiter();
    Employee mockEmployee = new Employee();
    mockEmployee.setEmployeeId("123");
    mockWaiter.setEmployee(mockEmployee);
    mockOrder.setWaiter(mockWaiter);

    Map<String, String> map = new HashMap<>();
    map.put("orderStatus", "READY");

    when(orderService.updateOrderStatus(1, map)).thenReturn(mockOrder);

    mockMvc
      .perform(post("/api/order/{orderId}/updateOrderStatus", 1)
        .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(map)))
      .andExpect(status().isOk()).andExpect(content().string("Order Status changed to READY"));
  }

  @Test
  void testMarkOrderAsPaid_OrderNotFound() throws Exception {
    doThrow(new NoSuchElementException("Order not found!")).when(orderService).markOrderAsPaid(1);

    mockMvc.perform(post("/api/order/{orderId}/markAsPaid", 1)).andExpect(status().isNotFound())
      .andExpect(content().string("Order not found!"));
  }

  @Test
  void testMarkOrderAsPaid_GenericException() throws Exception {
    Map<String, String> map = new HashMap<>();
    map.put("orderStatus", "CREATED");
    doThrow(new RuntimeException("Unexpected error")).when(orderService).markOrderAsPaid(1);
    mockMvc.perform(post("/api/order/{orderId}/markAsPaid", 1))
      .andExpect(status().isInternalServerError())
      .andExpect(content().string("Unexpected error"));
  }

  @Test
  void testCancelOrder_OrderNotFound() throws Exception {
    doThrow(new NoSuchElementException("Order not found")).when(orderService).cancelOrder(1);

    mockMvc.perform(delete("/api/order/1/cancelOrder")).andExpect(status().isNotFound())
      .andExpect(content().string("Order not found"));
    verify(orderService, times(1)).cancelOrder(1);
  }

  @Test
  void testCancelOrder_GenericException() throws Exception {
    doThrow(new RuntimeException("Unexpected Error")).when(orderService).cancelOrder(1);
    mockMvc.perform(delete("/api/order/{orderId}/cancelOrder", 1))
      .andExpect(status().isInternalServerError())
      .andExpect(content().string("Unexpected Error"));
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

    doNothing().when(orderService).updateOrderDetails(1, updateRequest);

    mockMvc
      .perform(post("/api/orders/{orderId}/updateOrder", 1)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(updateRequest)))
      .andExpect(status().isOk())
      .andExpect(content().string("Order updated successfully"));
    verify(orderService, times(1)).updateOrderDetails(1, updateRequest);
  }

  @Test
  void testUpdateOrder_OrderNotFound() throws Exception {
    Map<String, Integer> updateRequest = new HashMap<>();
    updateRequest.put("tableNum", 10);

    doThrow(new NoSuchElementException("Order not found")).when(orderService).updateOrderDetails(1, updateRequest);

    mockMvc
      .perform(post("/api/orders/{orderId}/updateOrder", 1)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(updateRequest)))
      .andExpect(status().isNotFound())
      .andExpect(content().string("Order not found"));

    verify(orderService, times(1)).updateOrderDetails(1, updateRequest);
  }

  @Test
  void testUpdateOrder_IllegalArgumentException() throws Exception {
    Map<String, Integer> updateRequest = new HashMap<>();
    updateRequest.put("tableNum", 10);
    doThrow(new IllegalArgumentException("Illegal argument")).when(orderService).updateOrderDetails(1, updateRequest);

    mockMvc.perform(post("/api/orders/{orderId}/updateOrder", 1)
      .contentType(MediaType.APPLICATION_JSON)
      .content(objectMapper.writeValueAsString(updateRequest)))
      .andExpect(status().isBadRequest())
      .andExpect(content().string("Illegal argument"));

    verify(orderService, times(1)).updateOrderDetails(1, updateRequest);
  }

  @Test
  void testUpdateOrder_GenericException() throws Exception {
    Map<String, Integer> updateRequest = new HashMap<>();
    updateRequest.put("tableNum", 10);
    doThrow(new RuntimeException("Unexpected Exception")).when(orderService).updateOrderDetails(1, updateRequest);

    mockMvc.perform(post("/api/orders/{orderId}/updateOrder", 1)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(updateRequest)))
      .andExpect(status().isInternalServerError())
      .andExpect(content().string("Unexpected Exception"));

    verify(orderService, times(1)).updateOrderDetails(1, updateRequest);
  }

  @Test
  void testUpdateOrder_NoTableNumber() throws Exception {
    Order mockOrder = new Order();
    mockOrder.setOrderId(1);

    Map<String, Integer> updateRequest = new HashMap<>();
    updateRequest.put("tableNum", null);

    doThrow(new NoSuchElementException("Table number is required")).when(orderService).updateOrderDetails(1, updateRequest);

    mockMvc
      .perform(post("/api/orders/{orderId}/updateOrder", 1)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(updateRequest)))
      .andExpect(status().isNotFound())
      .andExpect(content().string("Table number is required"));

    verify(orderService, times(1)).updateOrderDetails(1, updateRequest);
  }

  @Test
  void testUpdateOrder_NoWaiterAvailable() throws Exception {
    Order mockOrder = new Order();
    mockOrder.setOrderId(1);
    mockOrder.setTableNum(5);

    Map<String, Integer> updateRequest = new HashMap<>();
    updateRequest.put("tableNum", 10);

    doThrow(new NoSuchElementException("No waiter available for the new table")).when(orderService).updateOrderDetails(1, updateRequest);

    mockMvc
      .perform(post("/api/orders/{orderId}/updateOrder", 1)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(updateRequest)))
      .andExpect(status().isNotFound())
      .andExpect(content().string("No waiter available for the new table"));
    verify(orderService, times(1)).updateOrderDetails(1, updateRequest);
  }

}
