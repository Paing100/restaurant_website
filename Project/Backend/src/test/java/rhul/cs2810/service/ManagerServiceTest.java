package rhul.cs2810.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import rhul.cs2810.model.Order;

import java.util.List;

import static org.mockito.Mockito.when;

public class ManagerServiceTest {

  @Mock
  OrderService orderService;

  @InjectMocks
  ManagerService managerService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testGetOutstandingOrders() {
    Order order1 = new Order();
    order1.setOrderId(1);
    Order order2 = new Order();
    order2.setOrderId(2);

    when(orderService.getAllOrders()).thenReturn(List.of(order1,order2));
    List<Order> result = managerService.getOutstandingOrders();

    assertArrayEquals(List.of(order1, order2).toArray(), result.toArray());
  }
}
