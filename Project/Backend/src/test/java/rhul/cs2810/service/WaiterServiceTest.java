package rhul.cs2810.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import rhul.cs2810.model.Employee;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderStatus;
import rhul.cs2810.model.Waiter;
import rhul.cs2810.repository.OrderRepository;
import rhul.cs2810.repository.WaiterRepository;

class WaiterServiceTest {

    @Mock
    private WaiterRepository waiterRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private WaiterService waiterService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testReassignOrdersToDefaultWaiter() {
        // Create test waiter
        Employee employee = new Employee();
        employee.setEmployeeId("test-waiter");
        Waiter waiter = new Waiter(employee);
        waiter.setWaiterId(1); // This will make tables 1-5 their default section

        // Create test orders
        Order order1 = new Order();
        order1.setTableNum(1);
        order1.setOrderStatus(OrderStatus.SUBMITTED);
        
        Order order2 = new Order();
        order2.setTableNum(2);
        order2.setOrderStatus(OrderStatus.READY);

        Order order3 = new Order();
        order3.setTableNum(6); // Not in default section
        order3.setOrderStatus(OrderStatus.SUBMITTED);

        when(orderRepository.findAll()).thenReturn(Arrays.asList(order1, order2, order3));

        waiterService.reassignOrdersToDefaultWaiter(waiter);

        verify(orderRepository, times(2)).save(any(Order.class)); // Should only save orders 1 and 2
        assertEquals(waiter, order1.getWaiter());
        assertEquals(waiter, order2.getWaiter());
        assertNull(order3.getWaiter());
    }

    @Test
    void testGetWaiterOrders() {
        Waiter waiter = new Waiter();
        List<Order> expectedOrders = Arrays.asList(new Order(), new Order());
        
        when(orderRepository.findByWaiter(waiter)).thenReturn(expectedOrders);
        
        List<Order> actualOrders = waiterService.getWaiterOrders(waiter);
        
        assertEquals(expectedOrders, actualOrders);
        verify(orderRepository).findByWaiter(waiter);
    }

    @Test
    void testFindWaiterForTableDefaultWaiterExists() {
        int tableNum = 3;
        int expectedWaiterId = 1; // For table 3, waiter 1 should be default (tables 1-5)
        
        Waiter expectedWaiter = new Waiter();
        when(waiterRepository.findById(expectedWaiterId)).thenReturn(Optional.of(expectedWaiter));
        
        Optional<Waiter> result = waiterService.findWaiterForTable(tableNum);
        
        assertTrue(result.isPresent());
        assertEquals(expectedWaiter, result.get());
    }

    @Test
    void testFindWaiterForTableExistingOrders() {
        int tableNum = 3;
        Waiter existingWaiter = new Waiter();
        
        // Default waiter doesn't exist
        when(waiterRepository.findById(1)).thenReturn(Optional.empty());
        
        // But there's an existing active order for this table
        Order existingOrder = new Order();
        existingOrder.setTableNum(tableNum);
        existingOrder.setWaiter(existingWaiter);
        existingOrder.setOrderStatus(OrderStatus.SUBMITTED);
        
        when(orderRepository.findAll()).thenReturn(Arrays.asList(existingOrder));
        
        Optional<Waiter> result = waiterService.findWaiterForTable(tableNum);
        
        assertTrue(result.isPresent());
        assertEquals(existingWaiter, result.get());
    }

    @Test
    void testGetWaiterActiveTables() {
        Waiter waiter = new Waiter();
        waiter.setWaiterId(1); // Default tables will be 1-5
        
        Order order1 = new Order();
        order1.setTableNum(1);
        order1.setOrderStatus(OrderStatus.SUBMITTED);
        
        Order order2 = new Order();
        order2.setTableNum(6); // Not in default section
        order2.setOrderStatus(OrderStatus.SUBMITTED);
        
        Order order3 = new Order();
        order3.setTableNum(7); // Not in default section
        order3.setOrderStatus(OrderStatus.DELIVERED); // Should not be included
        
        when(orderRepository.findByWaiter(waiter)).thenReturn(Arrays.asList(order1, order2, order3));
        
        List<Integer> activeTables = waiterService.getWaiterActiveTables(waiter);
        
        assertTrue(activeTables.contains(1)); // Default section table
        assertTrue(activeTables.contains(6)); // Active order outside default section
        assertFalse(activeTables.contains(7)); // Delivered order should not be included
    }
} 