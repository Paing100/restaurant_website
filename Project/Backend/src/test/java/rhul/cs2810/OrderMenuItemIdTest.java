package rhul.cs2810;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import rhul.cs2810.model.OrderMenuItemId;

public class OrderMenuItemIdTest {
  OrderMenuItemId orderMenUItemId;

  @Test
  void testConstructor() {
    orderMenUItemId = new OrderMenuItemId(1, 2);
    assertEquals(1, orderMenUItemId.getOrderId());
    assertEquals(2, orderMenUItemId.getItemId());
  }

  @Test
  void testHashCode() {
    OrderMenuItemId test1 = new OrderMenuItemId(1, 2);
    OrderMenuItemId test2 = new OrderMenuItemId(1, 2);
    OrderMenuItemId test3 = new OrderMenuItemId(55, 2);

    assertTrue(test1.hashCode() == test2.hashCode());
    assertFalse(test1.hashCode() == test3.hashCode());
  }

  @Test
  void testEquals() {
    OrderMenuItemId test1 = new OrderMenuItemId(1, 2);
    OrderMenuItemId test2 = new OrderMenuItemId(1, 2);
    OrderMenuItemId test3 = new OrderMenuItemId(55, 2);

    assertTrue(test1.equals(test2));
    assertFalse(test1.equals(test3));
  }

}
