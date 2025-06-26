package rhul.cs2810.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import rhul.cs2810.model.*;
import rhul.cs2810.repository.MenuItemRepository;
import rhul.cs2810.repository.OrderMenuItemRepository;
import rhul.cs2810.repository.OrderRepository;

class OrderServiceTest {

  @Mock
  private OrderRepository orderRepository;

  @Mock
  private OrderMenuItemRepository orderMenuItemRepository;

  @Mock
  private MenuItemRepository menuItemRepository;

  @Mock
  private NotificationService notificationService;

  @Mock
  private WaiterService waiterService;

  @InjectMocks
  private OrderService orderService;

  @Mock
  private EntityManager entityManager;

  private List<Order> orders = new ArrayList<>();

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testGetOrder_ExistingOrder() {
    Order mockOrder = new Order();

    when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));

    Order foundOrder = orderService.getOrder(1);

    assertNotNull(foundOrder);
  }

  @Test
  void testGetOrder_NonExistingOrder() {
    when(orderRepository.findById(2)).thenReturn(Optional.empty());

    Order foundOrder = orderService.getOrder(2);

    assertNull(foundOrder);
  }

  @Test
  void testAddItemToOrder_Success() {
    Order mockOrder = new Order();

    MenuItem mockItem = new MenuItem();
    mockItem.setItemId(100);

    when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));
    when(menuItemRepository.findById(100)).thenReturn(Optional.of(mockItem));

    orderService.addItemToOrder(1, 100, 2, "hello");

    verify(orderMenuItemRepository, times(1)).save(any(OrderMenuItem.class));
  }

  @Test
  void testAddItemToOrder_OrderNotFound() {
    when(orderRepository.findById(1)).thenReturn(Optional.empty());

    Exception exception =
        assertThrows(IllegalArgumentException.class, () -> orderService.addItemToOrder(1, 100, 2, "hello"));
    assertEquals("Order with ID 1 not found.", exception.getMessage());
  }

  @Test
  void testAddItemToOrder_MenuItemNotFound() {
    Order mockOrder = new Order();

    when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));
    when(menuItemRepository.findById(100)).thenReturn(Optional.empty());

    Exception exception =
        assertThrows(IllegalArgumentException.class, () -> orderService.addItemToOrder(1, 100, 2, "hello"));

    assertEquals("Menu item with ID 100 not found.", exception.getMessage());
  }

  @Test
  void removeItemFromOrder_success() {
    Order order = new Order();
    order.setOrderId(1);
    order.setOrderStatus(OrderStatus.CREATED);
    int orderId = 1;
    int itemId = 100;

    when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

    orderService.removeItemFromOrder(orderId, itemId);

    verify(orderMenuItemRepository, times(1)).deleteById(new OrderMenuItemId(orderId, itemId));
  }

  @Test
  void removeItemFromOrder_orderNotFound() {
    Order order = new Order();
    order.setOrderId(1);
    order.setOrderStatus(OrderStatus.CREATED);
    int orderId = 1;
    int itemId = 100;

    when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

    Exception exception = assertThrows(IllegalArgumentException.class,
        () -> orderService.removeItemFromOrder(orderId, itemId));

    assertEquals("Order with ID 1 not found.", exception.getMessage());
    verify(orderMenuItemRepository, never()).deleteById(any());
  }

  @Test
  void removeItemFromOrder_orderSubmitted() {
    Order order = new Order();
    order.setOrderId(1);
    order.setOrderStatus(OrderStatus.CREATED);
    int orderId = 1;
    int itemId = 100;

    order.setOrderStatus(OrderStatus.SUBMITTED);
    when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

    Exception exception = assertThrows(IllegalStateException.class,
        () -> orderService.removeItemFromOrder(orderId, itemId));

    assertEquals("Cannot modify a submitted order.", exception.getMessage());
    verify(orderMenuItemRepository, never()).deleteById(any());
  }


  @Test
  void testSubmitOrder() {
    Order mockOrder = new Order();
    mockOrder.setWaiter(new Waiter());
    mockOrder.getWaiter().setEmployee(new Employee());
    mockOrder.setTableNum(1);

    doNothing().when(notificationService).sendNotification(anyString(), anyInt(), anyString(), anyString(), anyString());

    notificationService.sendNotification("READY", 1, "waiter", "message", "1");
    when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));
    orderService.submitOrder(1);

    verify(orderRepository, times(1)).save(mockOrder);
  }


  @Test
  void testGetAllOrders() {
    Order order1 = new Order(1, LocalDateTime.now(), new Customer("Will"));
    order1.addItemToCart(
        new MenuItem("Guacamole", "Classic Mexican dip made with avocados, cilantro, and lime",
            5.99, EnumSet.noneOf(Allergen.class), 150, EnumSet.noneOf(DietaryRestrictions.class),
            true, "src.png", 1),
        1);
    orders.add(order1);

    when(orderRepository.findAll()).thenReturn(orders);

    List<Order> listOrders = orderService.getAllOrders();
    assertEquals("Guacamole", orders.get(0).getOrderMenuItems().get(0).getMenuItem().getName());
    verify(orderRepository, times(1)).findAll();
  }

  @Test
  void testSaveUpdatedOrder() {
    Order order1 = new Order(1, LocalDateTime.now(), new Customer("Will"));
    orderService.saveUpdatedOrder(order1);
    verify(orderRepository, times(1)).save(order1);
  }

  @Test
  void testSubmitOrder_OrderNotFound() {
    when(orderRepository.findById(1)).thenReturn(Optional.empty());
    
    Exception exception = assertThrows(NoSuchElementException.class,
        () -> orderService.submitOrder(1));
    assertEquals("Order not found", exception.getMessage());
    
    verify(orderRepository, never()).save(any(Order.class));
    verify(orderMenuItemRepository, never()).saveAll(anyList());
  }

  @Test
  void testSubmitOrder_UpdatesOrderItemsStatus() {
    Order mockOrder = new Order();
    mockOrder.setWaiter(new Waiter());
    mockOrder.getWaiter().setEmployee(new Employee());
    mockOrder.setTableNum(1);
    List<OrderMenuItem> orderItems = new ArrayList<>();
    OrderMenuItem item1 = new OrderMenuItem();
    OrderMenuItem item2 = new OrderMenuItem();
    orderItems.add(item1);
    orderItems.add(item2);
    
    when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));
    when(orderMenuItemRepository.findByOrder(mockOrder)).thenReturn(orderItems);
    
    orderService.submitOrder(1);
    
    assertTrue(item1.isOrderSubmitted());
    assertTrue(item2.isOrderSubmitted());
    assertEquals(OrderStatus.SUBMITTED, mockOrder.getOrderStatus());
    verify(orderMenuItemRepository).saveAll(orderItems);
  }

  @Test
  void testGetOrderedItems_OrderExists() {
    Order mockOrder = new Order();
    List<OrderMenuItem> expectedItems = new ArrayList<>();
    expectedItems.add(new OrderMenuItem());
    mockOrder.setOrderMenuItems(expectedItems);
    
    when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));
    
    List<OrderMenuItem> result = orderService.getOrderedItems(1);
    
    assertEquals(expectedItems, result);
    verify(orderRepository).findById(1);
  }

  @Test
  void testGetOrderedItems_OrderNotFound() {
    when(orderRepository.findById(1)).thenReturn(Optional.empty());
    
    List<OrderMenuItem> result = orderService.getOrderedItems(1);
    
    assertTrue(result.isEmpty());
    verify(orderRepository).findById(1);
  }

  @Test
  void testAddItemToOrder_WithExistingItems() {
    Order mockOrder = new Order();
    MenuItem mockItem = new MenuItem();
    mockItem.setItemId(100);
    OrderMenuItem existingOrderItem = new OrderMenuItem(mockOrder, mockItem, 1, false);
    List<OrderMenuItem> existingItems = new ArrayList<>();
    existingItems.add(existingOrderItem);
    mockOrder.setOrderMenuItems(existingItems);
    
    when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));
    when(menuItemRepository.findById(100)).thenReturn(Optional.of(mockItem));
    
    orderService.addItemToOrder(1, 100, 2, "hello");
    
    verify(orderMenuItemRepository).save(any(OrderMenuItem.class));
  }

  @Test
  void testGetAllOrders_EmptyList() {
    when(orderRepository.findAll()).thenReturn(new ArrayList<>());
    
    List<Order> result = orderService.getAllOrders();
    
    assertTrue(result.isEmpty());
    verify(orderRepository).findAll();
  }

  @Test
  void testSaveUpdatedOrder_NullOrder() {
    Order nullOrder = null;
    assertThrows(IllegalArgumentException.class, 
        () -> orderService.saveUpdatedOrder(nullOrder));
    
    verify(orderRepository, never()).save(any(Order.class));
  }

  @Test
  void testUpdateOrderStatus(){
    Waiter waiter = new Waiter();
    Employee employee = new Employee();
    employee.setEmployeeId("E001");
    waiter.setEmployee(employee);
    Order order = new Order();
    order.setOrderId(1);
    order.setOrderStatus(OrderStatus.IN_PROGRESS);
    order.setWaiter(waiter);
    order.getWaiter().setEmployee(employee);
    Map<String, String> param = new HashMap<>();
    param.put("orderStatus", String.valueOf(OrderStatus.READY));

    when(orderRepository.findById(1)).thenReturn(Optional.of(order));
    orderService.updateOrderStatus(1, param);
    verify(notificationService).sendNotification("READY", 1, "waiter", "1 is ready to be delivered", "E001");
    assertEquals(order.getOrderStatus(), OrderStatus.READY);
  }

  @Test
  void testUpdateOrderStatus_NullStatus() {
    Order order = new Order();
    order.setOrderId(1);
    order.setOrderStatus(OrderStatus.IN_PROGRESS);
    order.setWaiter(new Waiter());
    order.getWaiter().setEmployee(new Employee());

    when(orderRepository.findById(1)).thenReturn(Optional.of(order));

    Map<String, String> param = new HashMap<>();
    assertThrows(NoSuchElementException.class,
      () -> orderService.updateOrderStatus(1, param));
  }

  @Test
  void testCancelOrder_Successful() {
    Waiter waiter = new Waiter();
    Employee employee = new Employee();
    employee.setEmployeeId("E001");
    waiter.setEmployee(employee);
    Order order = new Order();
    order.setOrderId(1);
    order.setOrderStatus(OrderStatus.IN_PROGRESS);
    order.setWaiter(waiter);
    order.getWaiter().setEmployee(employee);

    Query mockQuery = mock(Query.class);
    when(orderRepository.findById(1)).thenReturn(Optional.of(order));
    when(entityManager.createNativeQuery("DELETE FROM orders WHERE order_id = :orderId")).thenReturn(mockQuery);
    when(mockQuery.setParameter("orderId", 1)).thenReturn(mockQuery);
    when(mockQuery.executeUpdate()).thenReturn(1);

    orderService.cancelOrder(1);
    verify(notificationService).sendNotification("ORDER_CANCELLED", 1, "customer", "#1 is cancelled by waiter", "E001");
    verify(mockQuery).executeUpdate();
  }

  @Test
  void testCancelOrder_OrderNotFound() {
    Waiter waiter = new Waiter();
    Employee employee = new Employee();
    employee.setEmployeeId("E001");
    waiter.setEmployee(employee);
    Order order = new Order();
    order.setOrderId(1);
    order.setOrderStatus(OrderStatus.IN_PROGRESS);
    order.setWaiter(waiter);
    order.getWaiter().setEmployee(employee);

    Query mockQuery = mock(Query.class);

    when(orderRepository.findById(1)).thenReturn(Optional.of(order));
    when(entityManager.createNativeQuery("DELETE FROM orders WHERE order_id = :orderId")).thenReturn(mockQuery);
    when(mockQuery.setParameter("orderId", 1)).thenReturn(mockQuery);
    when(mockQuery.executeUpdate()).thenReturn(0);
    assertThrows(NoSuchElementException.class,
      () -> orderService.cancelOrder(1));
  }

  @Test
  void testMarkOrderAsPaid() {
    Waiter waiter = new Waiter();
    Employee employee = new Employee();
    employee.setEmployeeId("E001");
    waiter.setEmployee(employee);
    Order order = new Order();
    order.setWaiter(waiter);
    order.getWaiter().setEmployee(employee);

    when(orderRepository.findById(1)).thenReturn(Optional.of(order));
    orderService.markOrderAsPaid(1);
    assertTrue(order.isOrderPaid());
  }

  @Test
  void testUpdateOrderDetails_Successful() {
    Waiter waiter = new Waiter();
    Employee employee = new Employee();
    employee.setEmployeeId("E001");
    waiter.setEmployee(employee);
    Order order = new Order();
    order.setOrderId(1);
    order.setWaiter(waiter);
    order.getWaiter().setEmployee(employee);
    order.setTableNum(10);

    Map<String, Integer> map = new HashMap<>();
    map.put("tableNum", 20);

    when(orderRepository.findById(1)).thenReturn(Optional.of(order));
    when(waiterService.findWaiterForTable(10)).thenReturn(Optional.of(waiter));
    when(waiterService.findWaiterForTable(20)).thenReturn(Optional.of(waiter));

    orderService.updateOrderDetails(order.getOrderId(), map);

    assertEquals(20, order.getTableNum());
  }

  @Test
  void testUpdateOrderDetails_NullTableNumber() {
    Order order = new Order();
    order.setOrderId(1);

    when(orderRepository.findById(1)).thenReturn(Optional.of(order));
    Map<String, Integer> map = new HashMap<>();

    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
      () -> orderService.updateOrderDetails(1, map));

    assertEquals("Table number is required", exception.getMessage());
  }

  @Test
  void testUpdateOrderDetails_NoWaiter() {
    Order order = new Order();
    order.setOrderId(1);
    when(orderRepository.findById(1)).thenReturn(Optional.of(order));
    Map<String, Integer> map = new HashMap<>();
    map.put("tableNum", 20);

    when(waiterService.findWaiterForTable(20)).thenReturn(Optional.empty());

    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
      () -> orderService.updateOrderDetails(1, map));

    assertEquals("No waiter available for the new table", exception.getMessage());
  }

  @Test
  void testGetComments() {
    Order order = new Order();
    order.setOrderId(1);
    OrderMenuItem orderMenuItem = new OrderMenuItem();
    OrderMenuItemId orderMenuItemId = new OrderMenuItemId(1, 1);
    orderMenuItem.setOrderMenuItemsId(orderMenuItemId);
    orderMenuItem.setComment("Hello");
    when(orderRepository.findById(1)).thenReturn(Optional.of(order));
    when(orderMenuItemRepository.findByOrder(order)).thenReturn(List.of(orderMenuItem));

    Map<String, String> comments = orderService.getComments(1);
    assertEquals("Hello", comments.get("1 - 1"));
  }

  @Test
  void testGetStatus() {
    Waiter waiter = new Waiter();
    Employee employee = new Employee();
    employee.setEmployeeId("E001");
    waiter.setEmployee(employee);
    Order order = new Order();
    order.setOrderId(1);
    order.setOrderStatus(OrderStatus.IN_PROGRESS);
    order.setWaiter(waiter);
    order.getWaiter().setEmployee(employee);

    when(orderRepository.findById(1)).thenReturn(Optional.of(order));

    String status = orderService.getOrderStatus(1);
    verify(orderRepository, times(1)).findById(1);
    assertEquals(order.getOrderStatus().toString(), status);
  }

  @Test
  void testGetStatus_NotExists() {
    when(orderRepository.findById(1)).thenReturn(Optional.empty());

    Exception exception = assertThrows(NoSuchElementException.class, () -> {
      orderService.getOrderStatus(1);
    });
    verify(orderRepository, times(1)).findById(1);
    assertEquals("No such order exists", exception.getMessage());
  }


}
