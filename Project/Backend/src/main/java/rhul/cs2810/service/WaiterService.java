package rhul.cs2810.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import rhul.cs2810.model.Employee;
import rhul.cs2810.model.Waiter;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderStatus;
import rhul.cs2810.repository.EmployeeRepository;
import rhul.cs2810.repository.WaiterRepository;
import rhul.cs2810.repository.OrderRepository;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Service class for handling waiter-related operations.
 * This includes reassigning orders to the default waiter, finding waiters for tables,
 * and getting active tables assigned to a waiter.
 */
@Service
public class WaiterService {

    /**
     * Repository for accessing waiter data.
     */
    @Autowired
    private WaiterRepository waiterRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    /**
     * Repository for accessing order data.
     */
    @Autowired
    private OrderRepository orderRepository;

    /**
     * Reassigns orders to their default waiter when a new waiter is created.
     * This ensures tables are handled by their proper section waiter.
     * @param newWaiter the newly created waiter
     */
    public void reassignOrdersToDefaultWaiter(Waiter newWaiter) {
        int[] defaultTables = newWaiter.getDefaultSectionTables();
        Set<Integer> defaultTableSet = Arrays.stream(defaultTables).boxed().collect(Collectors.toSet());

        StreamSupport.stream(orderRepository.findAll().spliterator(), false)
                .filter(order -> defaultTableSet.contains(order.getTableNum()))
                .filter(order -> order.getOrderStatus() != OrderStatus.DELIVERED)
                .forEach(order -> {
                    order.setWaiter(newWaiter);
                    orderRepository.save(order);
                });
    }

    /**
     * Gets all orders assigned to a specific waiter.
     * @param employeeId the id of the employee.
     * @return list of orders assigned to the waiter
     */
    public List<Order> getWaiterOrders(String employeeId) {
        Employee employee = findEmployee(employeeId);
        Waiter waiter = findWaiter(employee);
      return orderRepository.findByWaiter(waiter);
    }

    /**
     * Finds the appropriate waiter for a given table number.
     * First tries to find the default section waiter, then assigns to the least busy waiter if no default exists.
     * @param tableNum the table number to find a waiter for
     * @return Optional containing the assigned waiter, or empty if no waiter available
     */
    public Optional<Waiter> findWaiterForTable(int tableNum) {
        // Calculate which waiter should handle this table by default
        int defaultWaiterId = ((tableNum - 1) / 5) + 1;
        
        // Try to get the default waiter first
        Optional<Waiter> defaultWaiter = waiterRepository.findById(defaultWaiterId);
        if (defaultWaiter.isPresent()) {
            return defaultWaiter;
        }

        // If no default waiter exists, check if there are any existing active orders for this table
        List<Order> existingTableOrders = StreamSupport.stream(orderRepository.findAll().spliterator(), false)
                .filter(order -> order.getTableNum() == tableNum)
                .filter(order -> order.getOrderStatus() != OrderStatus.DELIVERED)
                .collect(Collectors.toList());

        // If there are existing active orders, use the same waiter
        if (!existingTableOrders.isEmpty()) {
            return Optional.ofNullable(existingTableOrders.get(0).getWaiter());
        }

        // If no existing orders, find the waiter with the least active tables
        return StreamSupport.stream(waiterRepository.findAll().spliterator(), false)
                .min(Comparator.comparingInt(waiter -> getWaiterActiveTables(waiter).size()));
    }

    /**
     * Gets all active table numbers assigned to a waiter.
     * @param waiter the waiter to check
     * @return list of table numbers currently assigned to the waiter
     */
    public List<Integer> getWaiterActiveTables(Waiter waiter) {
        // Get the waiter's default tables
        int[] defaultTables = waiter.getDefaultSectionTables();
        Set<Integer> defaultTableSet = Arrays.stream(defaultTables).boxed().collect(Collectors.toSet());

        return orderRepository.findByWaiter(waiter).stream()
                .filter(order -> {
                    return defaultTableSet.contains(order.getTableNum()) ||
                           (order.getOrderStatus() != OrderStatus.DELIVERED && 
                            order.getOrderStatus() != OrderStatus.CREATED);
                })
                .map(Order::getTableNum)
                .distinct()
                .collect(Collectors.toList());
    }

    public Map<String, Object> getWaiterTables(String employeeId) {
        Employee employee = findEmployee(employeeId);
        Waiter waiter = findWaiter(employee);

        Map<String, Object> response = new HashMap<>();
        response.put("defaultTables", waiter.getDefaultSectionTables());
        response.put("activeTables", this.getWaiterActiveTables(waiter));

        return response;
    }

    private Employee findEmployee(String employeeId) {
        return employeeRepository.findByEmployeeId(employeeId)
          .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
    }

    private Waiter findWaiter(Employee employee) {
        return waiterRepository.findByEmployee(employee)
          .orElseThrow(() -> new IllegalArgumentException("Waiter not found"));
    }

} 
