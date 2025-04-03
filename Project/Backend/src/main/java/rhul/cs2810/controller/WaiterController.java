package rhul.cs2810.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.Waiter;
import rhul.cs2810.model.Employee;
import rhul.cs2810.repository.EmployeeRepository;
import rhul.cs2810.repository.WaiterRepository;
import rhul.cs2810.service.WaiterService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controller class for handling waiter-related API endpoints.
 * Provides endpoints for retrieving waiter tables and orders.
 */
@RestController
@RequestMapping("/api/waiter")
public class WaiterController {
    private final WaiterRepository waiterRepository;
    private final EmployeeRepository employeeRepository;
    private final WaiterService waiterService;

    /**
     * Constructs a new WaiterController.
     *
     * @param waiterRepository the repository for accessing waiter data
     * @param employeeRepository the repository for accessing employee data
     * @param waiterService the service for waiter  operations
     */
    public WaiterController(WaiterRepository waiterRepository, 
                          EmployeeRepository employeeRepository,
                          WaiterService waiterService) {
        this.waiterRepository = waiterRepository;
        this.employeeRepository = employeeRepository;
        this.waiterService = waiterService;
    }

    /**
     * Retrieves the tables assigned to a waiter.
     *
     * @param employeeId the ID of the employee (waiter)
     * @return a ResponseEntity with a map containing the default and active tables.
     */
    @GetMapping("/{employeeId}/tables")
    public ResponseEntity<Map<String, Object>> getWaiterTables(@PathVariable String employeeId) {
        Optional<Employee> employee = employeeRepository.findByEmployeeId(employeeId);
        if (employee.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Waiter> waiter = waiterRepository.findByEmployee(employee.get());
        if (waiter.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("defaultTables", waiter.get().getDefaultSectionTables());
        response.put("activeTables", waiterService.getWaiterActiveTables(waiter.get()));
        
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves the orders assigned to a waiter.
     *
     * @param employeeId the ID of the employee (waiter)
     * @return a ResponseEntity containing a list of orders.
     */
    @GetMapping("/{employeeId}/orders")
    public ResponseEntity<List<Order>> getWaiterOrders(@PathVariable String employeeId) {
        Optional<Employee> employee = employeeRepository.findByEmployeeId(employeeId);
        if (employee.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Waiter> waiter = waiterRepository.findByEmployee(employee.get());
        if (waiter.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Order> orders = waiterService.getWaiterOrders(waiter.get());
        return ResponseEntity.ok(orders);
    }
}