package rhul.cs2810;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import rhul.cs2810.model.Allergen;
import rhul.cs2810.model.Customer;
import rhul.cs2810.model.DietaryRestrictions;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderMenuItem;

import static org.junit.jupiter.api.Assertions.*;

public class OrderTest {

  Order order;
  Customer customer;
  MenuItem veganItem;
  MenuItem nonVeganItem;

  @BeforeEach
  public void beforeEach() {
    customer = new Customer("William");
    veganItem = new MenuItem("Vegan Burger", "Tasty vegan burger", 10.99,
        new HashSet<>(Set.of(Allergen.NUTS)), 300, new HashSet<>(Set.of(DietaryRestrictions.VEGAN)),
        false, "vegan.png", 1);

    nonVeganItem =
        new MenuItem("Beef Burger", "Juicy beef burger", 12.99, new HashSet<>(Set.of(Allergen.EGG)),
            500, new HashSet<>(Set.of(DietaryRestrictions.GLUTENFREE)), false, "vegan.png", 1);
    order = new Order(1, LocalDateTime.now(), customer);
  }

  @Test
  void testEmptyConstructor() {
    Order order1 = new Order();
    assertEquals(null, order1.getCustomer());
  }

  @Test
  void testConstructorArguments() {
    LocalDateTime time = LocalDateTime.now();
    Order order2 = new Order(2, time, customer);
    assertEquals(2, order2.getTableNum());
    assertEquals(customer, order2.getCustomer());
    assertEquals(time, time);
  }


  @Test
  void testAddItemsToCart() {
    order.addItemToCart(veganItem, 2);
    assertEquals(1, order.getOrderMenuItems().size());
    assertEquals("Vegan Burger", order.getOrderMenuItems().get(0).getMenuItem().getName());
  }

  @Test
  void testGetAndSetCustomer() {
    Order orderTest = new Order();
    Customer customerTest = new Customer();
    orderTest.setCustomer(customerTest);

    assertEquals(customerTest, orderTest.getCustomer());
  }

  @Test
  void testGetAndSetTableNum() {
    Order orderTest = new Order();
    orderTest.setTableNum(10);
    assertEquals(10, orderTest.getTableNum());
  }

  @Test
  void testGetAndSetOrderPlaced() {
    Order orderTest = new Order();
    LocalDateTime time = LocalDateTime.now();
    orderTest.setOrderPlaced(time);
    assertEquals(time, orderTest.getOrderPlaced());
  }

  @Test
  void testGetAndSetOrderMenuItems() {
    Order orderTest = new Order();
    OrderMenuItem orderMenuItem = new OrderMenuItem(order, veganItem, 2, false);
    List<OrderMenuItem> orderMenuItems = new ArrayList<>();
    orderMenuItems.add(orderMenuItem);
    orderTest.setOrderMenuItems(orderMenuItems);
    assertEquals(orderMenuItems.get(0), orderTest.getOrderMenuItems().get(0));
  }

  @Test
  void testEqualsSameObject(){
    Order order = new Order();
    assertEquals(order, order);
    assertTrue(order.equals(order));
  }

  @Test
  void testEqualsDiffObject(){
    Order order1 = new Order();
    order1.setOrderId(1);
    Order order2 = new Order();
    order2.setOrderId(2);
    assertNotEquals(order1, order2);
    assertFalse(order1.equals(order2));
  }

  @Test
  void testEqualsNullObject(){
    Order order = new Order();
    assertFalse(order.equals(null));
  }

  @Test
  void testEqualsDifferentClass(){
    Order order = new Order();
    Customer customer = new Customer();
    assertFalse(order.equals(customer));
  }

}
