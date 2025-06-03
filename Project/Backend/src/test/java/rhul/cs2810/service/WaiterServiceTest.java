package rhul.cs2810.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import rhul.cs2810.model.Employee;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderStatus;
import rhul.cs2810.model.Waiter;
import rhul.cs2810.repository.EmployeeRepository;
import rhul.cs2810.repository.OrderRepository;
import rhul.cs2810.repository.WaiterRepository;

class WaiterServiceTest {

    @Mock
    private WaiterRepository waiterRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private WaiterService waiterService;

    @Mock
    private EmployeeRepository employeeRepository;

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
        Employee employee = new Employee();
        employee.setEmployeeId("1");
        Waiter waiter = new Waiter();
        waiter.setEmployee(employee);
        List<Order> expectedOrders = Arrays.asList(new Order(), new Order());
        
        when(orderRepository.findByWaiter(waiter)).thenReturn(expectedOrders);
        when(employeeRepository.findByEmployeeId(employee.getEmployeeId())).thenReturn(Optional.of(employee));
        when(waiterRepository.findByEmployee(employee)).thenReturn(Optional.of(waiter));

        List<Order> actualOrders = waiterService.getWaiterOrders(employee.getEmployeeId());
        
        assertEquals(expectedOrders, actualOrders);
        verify(orderRepository).findByWaiter(waiter);
    }

    @Test
    void testGetWaiterOrders_EmployeeNotFound() {
        Employee employee = new Employee();
        employee.setEmployeeId("1");
        when(employeeRepository.findByEmployeeId(employee.getEmployeeId())).thenReturn(Optional.empty());
        Exception e = assertThrows(IllegalArgumentException.class,
          () -> waiterService.getWaiterTables("1"));

        assertEquals("Employee not found", e.getMessage());
    }

    @Test
    void testGetWaiterOrders_WaiterNotFound() {
        Employee employee = new Employee();
        when(employeeRepository.findByEmployeeId("1")).thenReturn(Optional.of(employee));
        when(waiterRepository.findByEmployee(employee)).thenReturn(Optional.empty());
        Exception e = assertThrows(IllegalArgumentException.class,
          () -> waiterService.getWaiterOrders("1"));
        assertEquals("Waiter not found", e.getMessage());
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

    @Test
    void testGetWaiterTables_EmployeeNotFound() {
        when(employeeRepository.findByEmployeeId("1")).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class,
          () -> waiterService.getWaiterTables("1"));
    }

    @Test
    void testGetWaiterTables_WaiterNotFound() {
        when(employeeRepository.findByEmployeeId("1")).thenReturn(Optional.of(new Employee()));
        when(employeeRepository.findByEmployeeId("1")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
          () -> waiterService.getWaiterTables("1"));
    }

    @Test
    void getsWaiterTables_Successful() {
        Waiter waiter = new Waiter();
        waiter.setWaiterId(1);
        Employee employee = new Employee();
        employee.setEmployeeId("1");
        waiter.setEmployee(employee);

        List<Order> orders = new ArrayList<>();
        Order order1 = new Order();
        order1.setTableNum(6);
        order1.setOrderStatus(OrderStatus.SUBMITTED);
        order1.setWaiter(waiter);
        orders.add(order1);

        Order order2 = new Order();
        order2.setTableNum(7);
        order2.setOrderStatus(OrderStatus.SUBMITTED);
        order2.setWaiter(waiter);
        orders.add(order2);

        when(employeeRepository.findByEmployeeId("1")).thenReturn(Optional.of(employee));
        when(waiterRepository.findByEmployee(employee)).thenReturn(Optional.of(waiter));
        when(orderRepository.findByWaiter(waiter)).thenReturn(orders);

        Map<String, Object> response = waiterService.getWaiterTables("1");

        assertArrayEquals(waiter.getDefaultSectionTables(), (int[]) response.get("defaultTables"));
        assertEquals(List.of(6, 7), response.get("activeTables"));
    }

} 
