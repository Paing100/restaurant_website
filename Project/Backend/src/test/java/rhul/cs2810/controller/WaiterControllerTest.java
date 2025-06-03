package rhul.cs2810.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import rhul.cs2810.model.Customer;
import rhul.cs2810.model.Employee;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderStatus;
import rhul.cs2810.model.Waiter;
import rhul.cs2810.repository.CustomerRepository;
import rhul.cs2810.repository.EmployeeRepository;
import rhul.cs2810.repository.OrderRepository;
import rhul.cs2810.repository.WaiterRepository;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class WaiterControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private WaiterRepository waiterRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private Employee createTestWaiter(String employeeId) {
        Employee waiterEmployee = new Employee();
        waiterEmployee.setEmployeeId(employeeId);
        waiterEmployee.setPassword("password");
        waiterEmployee.setFirstName("Test");
        waiterEmployee.setLastName("Waiter");
        waiterEmployee.setRole("WAITER");
        return employeeRepository.save(waiterEmployee);
    }

    private Customer createTestCustomer() {
        Customer customer = new Customer();
        customer.setName("Test Customer");
        return customerRepository.save(customer);
    }

    @BeforeEach
    void setup() {
        employeeRepository.deleteAll();
        waiterRepository.deleteAll();
        orderRepository.deleteAll();
        customerRepository.deleteAll();
    }

    @Test
    void getWaiterTablesTest() throws Exception {
        // Create test waiter
        Employee waiterEmployee = createTestWaiter("test-waiter");
        Waiter waiter = new Waiter(waiterEmployee);
        waiter = waiterRepository.save(waiter);

        // Create test customer and order
        Customer customer = createTestCustomer();
        Order order = new Order();
        order.setTableNum(1);
        order.setWaiter(waiter);
        order.setOrderStatus(OrderStatus.SUBMITTED);
        order.setCustomer(customer);
        orderRepository.save(order);

        MvcResult result = mockMvc.perform(get("/api/waiter/{employeeId}/tables", "test-waiter")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.defaultTables").exists())
                .andExpect(jsonPath("$.activeTables").exists())
                .andReturn();

    }

    @Test
    void getWaiterTablesEmployeeNotFoundTest() throws Exception {
        mockMvc.perform(get("/api/waiter/{employeeId}/tables", "non-existent")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Employee not found"));
    }

//    @Test
//    void getWaiterTablesWaiterNotFoundTest() throws Exception {
//        Employee employee = new Employee();
//        employee.setEmployeeId("test-employee");
//
//        when(employeeRepository.findByEmployeeId("test-employee")).thenReturn(Optional.of(employee));
//        when(waiterRepository.findByEmployee(employee)).thenReturn(Optional.empty());
//
//        mockMvc.perform(get("/api/waiter/{employeeId}/tables", "test-employee")
//            .contentType(MediaType.APPLICATION_JSON))
//          .andExpect(status().isNotFound())
//          .andExpect(content().string("Waiter not found"));
//    }


    @Test
    void getWaiterOrdersTest() throws Exception {
        // Create test waiter
        Employee waiterEmployee = createTestWaiter("test-waiter");
        Waiter waiter = new Waiter(waiterEmployee);
        waiter = waiterRepository.save(waiter);

        // Create test customers and orders
        Customer customer1 = createTestCustomer();
        Order order1 = new Order();
        order1.setTableNum(1);
        order1.setWaiter(waiter);
        order1.setOrderStatus(OrderStatus.SUBMITTED);
        order1.setCustomer(customer1);
        orderRepository.save(order1);

        Customer customer2 = new Customer();
        customer2.setName("Test Customer 2");
        customer2 = customerRepository.save(customer2);
        
        Order order2 = new Order();
        order2.setTableNum(2);
        order2.setWaiter(waiter);
        order2.setOrderStatus(OrderStatus.READY);
        order2.setCustomer(customer2);
        orderRepository.save(order2);

        MvcResult result = mockMvc.perform(get("/api/waiter/{employeeId}/orders", "test-waiter")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].tableNum").exists())
                .andExpect(jsonPath("$[0].orderStatus").exists())
                .andReturn();

        List<Order> orders = objectMapper.readValue(result.getResponse().getContentAsString(),
                new TypeReference<List<Order>>() {});
        
        assertEquals(2, orders.size());
        assertTrue(orders.stream().anyMatch(o -> o.getTableNum() == 1));
        assertTrue(orders.stream().anyMatch(o -> o.getTableNum() == 2));
    }

    @Test
    void getWaiterOrdersEmployeeNotFoundTest() throws Exception {
        mockMvc.perform(get("/api/waiter/{employeeId}/orders", "non-existent")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void getWaiterOrdersWaiterNotFoundTest() throws Exception {
        // Create employee but not waiter
        Employee employee = new Employee();
        employee.setEmployeeId("test-employee");
        employee.setPassword("password");
        employee.setFirstName("Test");
        employee.setLastName("Employee");
        employee.setRole("KITCHEN");
        employeeRepository.save(employee);

        mockMvc.perform(get("/api/waiter/{employeeId}/orders", "test-employee")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void getWaiterOrdersEmptyListTest() throws Exception {
        // Create waiter with no orders
        Employee waiterEmployee = createTestWaiter("test-waiter");
        Waiter waiter = new Waiter(waiterEmployee);
        waiterRepository.save(waiter);

        MvcResult result = mockMvc.perform(get("/api/waiter/{employeeId}/orders", "test-waiter")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn();

        List<Order> orders = objectMapper.readValue(result.getResponse().getContentAsString(),
                new TypeReference<List<Order>>() {});
        
        assertTrue(orders.isEmpty());
    }

} 
