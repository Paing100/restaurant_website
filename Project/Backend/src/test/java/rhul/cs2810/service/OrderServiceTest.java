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

  @InjectMocks
  private OrderService orderService;

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

    orderService.addItemToOrder(1, 100, 2);

    verify(orderMenuItemRepository, times(1)).save(any(OrderMenuItem.class));
  }

  @Test
  void testAddItemToOrder_OrderNotFound() {
    when(orderRepository.findById(1)).thenReturn(Optional.empty());

    Exception exception =
        assertThrows(IllegalArgumentException.class, () -> orderService.addItemToOrder(1, 100, 2));
    assertEquals("Order with ID 1 not found.", exception.getMessage());
  }

  @Test
  void testAddItemToOrder_MenuItemNotFound() {
    Order mockOrder = new Order();

    when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));
    when(menuItemRepository.findById(100)).thenReturn(Optional.empty());

    Exception exception =
        assertThrows(IllegalArgumentException.class, () -> orderService.addItemToOrder(1, 100, 2));

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
    
    orderService.addItemToOrder(1, 100, 2);
    
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
}
