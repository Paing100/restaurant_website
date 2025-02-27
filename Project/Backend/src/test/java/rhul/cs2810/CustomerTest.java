package rhul.cs2810;

import static org.junit.jupiter.api.Assertions.assertEquals;

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
    customer.setOrder(order);
    assertEquals(order.getCustomer(), customer);
    assertEquals(order.getOrderId(), customer.getOrder().getOrderId());
    assertEquals(order.getOrderPlaced(), customer.getOrder().getOrderPlaced());
    assertEquals(order.getCustomer().getCustomerId(), customer.getCustomerId());
  }

  @Test
  void testCustomerConstructorName() {
    Customer customer2 = new Customer("Smith");
    assertEquals("Smith", customer2.getName());
  }


}
