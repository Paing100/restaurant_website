package rhul.cs2810;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import rhul.cs2810.model.MenuItem;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderMenuItem;
import rhul.cs2810.model.OrderMenuItemId;
import rhul.cs2810.repository.MenuItemRepository;
import rhul.cs2810.repository.OrderMenuItemRepository;
import rhul.cs2810.repository.OrderRepository;
import rhul.cs2810.service.OrderService;

class OrderServiceTest {

  @Mock
  private OrderRepository orderRepository;

  @Mock
  private OrderMenuItemRepository orderMenuItemRepository;

  @Mock
  private MenuItemRepository menuItemRepository;

  @InjectMocks
  private OrderService orderService;

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

    Exception exception = assertThrows(IllegalArgumentException.class, 
        () -> orderService.addItemToOrder(1, 100, 2));

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
  void testRemoveItemFromOrder() {
    OrderMenuItemId orderMenuItemId = new OrderMenuItemId(1, 100);

    orderService.removeItemFromOrder(1, 100);

    verify(orderMenuItemRepository, times(1)).deleteById(orderMenuItemId);
  }

  @Test
  void testSubmitOrder() {
    Order mockOrder = new Order();

    orderService.submitOrder(mockOrder);

    verify(orderRepository, times(1)).save(mockOrder);
  }
}
