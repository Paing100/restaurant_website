package rhul.cs2810.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

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
public class CustomerControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private CustomerRepository customerRepository;

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private EmployeeRepository employeeRepository;

  @Autowired
  private WaiterRepository waiterRepository;

  @BeforeEach
  void setup() {
    customerRepository.deleteAll();
    orderRepository.deleteAll();
    employeeRepository.deleteAll();
    waiterRepository.deleteAll();
    
    Employee waiterEmployee = new Employee();
    waiterEmployee.setEmployeeId("test-waiter");
    waiterEmployee.setPassword("password");
    waiterEmployee.setFirstName("Test");
    waiterEmployee.setLastName("Waiter");
    waiterEmployee.setRole("WAITER");
    employeeRepository.save(waiterEmployee);
    
    Waiter waiter = new Waiter(waiterEmployee);
    waiterRepository.save(waiter);
  }

  @Test
  void addCustomerTest() throws Exception {
    String name = "John Doe";
    int tableNum = 5;

    MvcResult result = mockMvc
        .perform(post("/api/customers/add").param("name", name)
            .param("tableNum", String.valueOf(tableNum)).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk()).andReturn();

    // Parse response
    Customer createdCustomer =
        objectMapper.readValue(result.getResponse().getContentAsString(), Customer.class);

    assertNotNull(createdCustomer);
    assertNotNull(createdCustomer.getCustomerId());
    assertEquals(name, createdCustomer.getName());
    assertNotNull(createdCustomer.getOrders());
    assertTrue(
        createdCustomer.getOrders().stream().anyMatch(order -> tableNum == order.getTableNum()));
  }

  @Test
  void getAllCustomersTest() throws Exception {
    customerRepository.save(new Customer("Alice"));
    customerRepository.save(new Customer("Bob"));

    mockMvc.perform(get("/api/customers/all").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk()).andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(2));
  }

  @Test
  void createNewOrderTest() throws Exception {
    // First, create and save a customer
    Customer customer = new Customer("John Doe");
    customer = customerRepository.save(customer); // Ensure customer exists

    int tableNum = 5;

    // Perform the request to create a new order
    MvcResult result = mockMvc
        .perform(post("/api/customers/{customerId}/newOrder", customer.getCustomerId())
            .param("tableNum", String.valueOf(tableNum)).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk()).andReturn();

    // Parse response
    Order createdOrder =
        objectMapper.readValue(result.getResponse().getContentAsString(), Order.class);

    // Assertions
    assertNotNull(createdOrder);
    assertNotNull(createdOrder.getOrderId()); // CREATED
  }

  @Test
  void createNewOrderCustomerNotFoundTest() throws Exception {
    // Use a customerId that does not exist
    int nonExistentCustomerId = 999;

    int tableNum = 5;


    mockMvc
        .perform(post("/api/customers/{customerId}/newOrder", nonExistentCustomerId)
            .param("tableNum", String.valueOf(tableNum)).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest());
  }

  @Test
  void getCustomerOrdersTest() throws Exception {
    // Create a customer and a couple of orders
    Customer customer = new Customer("John Doe");
    customer = customerRepository.save(customer);

    Order order1 = new Order();
    order1.setTableNum(5);
    order1.setCustomer(customer);
    order1.setOrderStatus(OrderStatus.CREATED);

    Order order2 = new Order();
    order2.setTableNum(10);
    order2.setCustomer(customer);
    order2.setOrderStatus(OrderStatus.CREATED);

    orderRepository.save(order1);
    orderRepository.save(order2);


    mockMvc
        .perform(get("/api/customers/{customerId}/orders", customer.getCustomerId())
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk()).andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(2));
  }

  @Test
  void getCustomerOrdersCustomerNotFoundTest() throws Exception {
    // Try to get orders for a customer that does not exist
    int nonExistentCustomerId = 999;

    mockMvc.perform(get("/api/customers/{customerId}/orders", nonExistentCustomerId)
        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isNotFound());


  }
  @Test
  void addCustomerWithAccountTest() throws Exception {
    String name = "John Doe";
    int tableNum = 5;
    String email = "john@email.com";
    String password = "password123";

    MvcResult result = mockMvc
        .perform(post("/api/customers/add")
            .param("name", name)
            .param("tableNum", String.valueOf(tableNum))
            .param("email", email)
            .param("password", password)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andReturn();

    Customer createdCustomer = objectMapper.readValue(result.getResponse().getContentAsString(), Customer.class);

    assertNotNull(createdCustomer);
    assertEquals(name, createdCustomer.getName());
    assertEquals(email, createdCustomer.getEmail());
    assertNotNull(createdCustomer.getPassword());
    assertTrue(createdCustomer.getPassword().startsWith("$2a$")); // Verify it's a BCrypt hash
  }

  @Test
  void createAccountTest() throws Exception {
    // First create a customer without account
    Customer customer = new Customer("John Doe");
    customer = customerRepository.save(customer);

    String email = "john@email.com";
    String password = "password123";

    MvcResult result = mockMvc
        .perform(post("/api/customers/{customerId}/createAccount", customer.getCustomerId())
            .param("email", email)
            .param("password", password)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andReturn();

    Customer updatedCustomer = objectMapper.readValue(result.getResponse().getContentAsString(), Customer.class);

    assertEquals(email, updatedCustomer.getEmail());
    assertNotNull(updatedCustomer.getPassword());
    assertTrue(updatedCustomer.getPassword().startsWith("$2a$")); // Verify it's a BCrypt hash
  }

  @Test
  void loginCustomerTest() throws Exception {
    // Create a customer with account
    Customer customer = new Customer("John Doe");
    customer.setEmail("john@email.com");
    customer.setPassword("$2a$10$iGS.Ap4WdVTbFeetsvq8Fu/s87ifulBvK1n17JzO81hWbFxkFZr5C"); // Pre-hashed password
    customerRepository.save(customer);

    MvcResult result = mockMvc
        .perform(post("/api/customers/login")
            .param("email", "john@email.com")
            .param("password", "password123")
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andReturn();

    Customer loggedInCustomer = objectMapper.readValue(result.getResponse().getContentAsString(), Customer.class);
    assertEquals(customer.getCustomerId(), loggedInCustomer.getCustomerId());
  }

  @Test
  void loginCustomerFailTest() throws Exception {
    // Create a customer with account
    Customer customer = new Customer("John Doe", "john@email.com", "password123");
    customerRepository.save(customer);

    mockMvc
        .perform(post("/api/customers/login")
            .param("email", "john@email.com")
            .param("password", "wrongpassword")
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isUnauthorized());
  }
}


