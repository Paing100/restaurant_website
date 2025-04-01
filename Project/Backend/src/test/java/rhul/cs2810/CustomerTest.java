package rhul.cs2810;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import rhul.cs2810.model.Customer;
import rhul.cs2810.model.Order;



public class CustomerTest {
  Customer customer;

  @BeforeEach
  void beforeEach() {
    customer = new Customer();
  }

  @Test
  void testGetAndSetName() {
    customer.setName("James");
    assertEquals("James", customer.getName());
  }

  @Test
  void testGetAndSetOrder() {
    Order order = new Order(1, LocalDateTime.now(), customer);
    customer.addOrder(order);
    assertEquals(order.getCustomer(), customer);
    assertTrue(customer.getOrders().stream().anyMatch(o -> order.getOrderId() == o.getOrderId()));
    assertTrue(
        customer.getOrders().stream().anyMatch(o -> order.getOrderPlaced() == o.getOrderPlaced()));
    assertEquals(order.getCustomer().getCustomerId(), customer.getCustomerId());
  }

  @Test
  void testCustomerConstructorName() {
    Customer customer2 = new Customer("Smith");
    assertEquals("Smith", customer2.getName());
  }

  @Test
  void testCustomerConstructorWithEmailAndPassword() {
    Customer customer2 = new Customer("Smith", "smith@email.com", "password123");
    assertEquals("Smith", customer2.getName());
    assertEquals("smith@email.com", customer2.getEmail());
    assertEquals("password123", customer2.getPassword());
  }

  @Test
  void testGetAndSetEmail() {
    customer.setEmail("test@email.com");
    assertEquals("test@email.com", customer.getEmail());
  }

  @Test
  void testGetAndSetPassword() {
    customer.setPassword("testpass123");
    assertEquals("testpass123", customer.getPassword());
  }
}
