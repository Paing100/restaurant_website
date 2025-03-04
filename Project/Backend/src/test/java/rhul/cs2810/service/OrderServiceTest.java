package rhul.cs2810.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import rhul.cs2810.model.Allergen;
import rhul.cs2810.model.Customer;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderMenuItem;
import rhul.cs2810.model.OrderMenuItemId;
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

    Exception exception = assertThrows(IllegalArgumentException.class,
        () -> orderService.addItemToOrder(1, 100, 2));

    assertEquals("Menu item with ID 100 not found.", exception.getMessage());
  }

  @Test
  void testRemoveItemFromOrder() {
    OrderMenuItemId orderMenuItemId = new OrderMenuItemId(1, 100);

    orderService.removeItemFromOrder(1, 100);

    verify(orderMenuItemRepository, times(1)).deleteById(orderMenuItemId);
  }

  @Test
  void testSubmitOrder() {
    Order mockOrder = new Order();
    // first order id is 1, so this test passes
    when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));

    orderService.submitOrder(1);

    //assertTrue(mockOrder.isOrderSubmitted());
    verify(orderRepository, times(1)).save(mockOrder);
  }

  @Test
  void testSubmitOrderNotPresent() {
    Order mockOrder = new Order();

    when(orderRepository.findById(0)).thenReturn(Optional.empty());
    orderService.submitOrder(0);
    // since order is not present, save is called 0 times.
    verify(orderRepository, times(0)).save(mockOrder);
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

}
