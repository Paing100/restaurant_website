package rhul.cs2810;

import static org.assertj.core.api.Assertions.assertThat;
import rhul.cs2810.model.MenuItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderMenuItem;

class OrderMenuItemTest {

  private Order order;
  private MenuItem menuItem;
  private OrderMenuItem orderMenuItem;

  @BeforeEach
  void setUp() {
    order = new Order();

    menuItem = new MenuItem();
    menuItem.setItemId(101);
    menuItem.setName("Test Item");

    orderMenuItem = new OrderMenuItem(order, menuItem, 3, false);
  }

  @Test
  void testOrderMenuItemCreation() {
    assertThat(orderMenuItem).isNotNull();
    assertThat(orderMenuItem.getOrder()).isEqualTo(order);
    assertThat(orderMenuItem.getMenuItem()).isEqualTo(menuItem);
    assertThat(orderMenuItem.getQuantity()).isEqualTo(3);
    assertThat(orderMenuItem.getOrderMenuItemsId()).isNotNull();
    assertThat(orderMenuItem.getOrderMenuItemsId().getOrderId()).isEqualTo(0);
    assertThat(orderMenuItem.getOrderMenuItemsId().getItemId()).isEqualTo(101);
  }

  @Test
  void testSetQuantity() {
    orderMenuItem.setQuantity(5);
    assertThat(orderMenuItem.getQuantity()).isEqualTo(5);
  }

  @Test
  void testSetOrder() {
    Order newOrder = new Order();
    orderMenuItem.setOrder(newOrder);
    assertThat(orderMenuItem.getOrder().getOrderId()).isEqualTo(0);
  }

  @Test
  void testSetMenuItem() {
    MenuItem newItem = new MenuItem();
    newItem.setItemId(202);
    orderMenuItem.setMenuItem(newItem);
    assertThat(orderMenuItem.getMenuItem().getItemId()).isEqualTo(202);
  }
}
