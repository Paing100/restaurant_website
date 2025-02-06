package rhul.cs2810;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.util.ArrayList;
import java.util.EnumSet;
import org.junit.jupiter.api.Test;

public class MenuItemTest {

  @Test
  void getMenuItemElements() {
    MenuItem item = new MenuItem(0, "testman", Category.APPEITIZER, "testDes", (float) 42.22,
        new ArrayList<String>(), 25, EnumSet.noneOf(DietaryRestrictions.class), true);

    assertEquals(item.getItemId(), 0);
    assertTrue(item.getAllergens().isEmpty());
    assertEquals(item.getCategory(), Category.APPEITIZER);
    assertEquals(item.getDescription(), "testDes");
    assertEquals(item.getPrice(), (float) 42.22);
    assertEquals(item.getCalories(), 25);
    assertTrue(item.getDietaryRestrictions().isEmpty());
  }

}
