package rhul.cs2810;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import rhul.cs2810.model.Notification;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class NotificationTest {

  Notification notification;

  @BeforeEach
  void beforeEach(){
    notification = new Notification();
  }


  @Test
  void testNotificationConstructor(){
    Notification notification1 = new Notification("TYPE", 1, "RECIPIENT", "MESSAGE","1" );
    assertEquals("TYPE", notification1.getType());
    assertEquals(1, notification1.getOrderId());
    assertEquals("RECIPIENT", notification1.getRecipient());
    assertEquals("MESSAGE", notification1.getMessage());
  }

  @Test
  void testGetAndSetType(){
    notification.setType("TYPE1");
    assertEquals("TYPE1", notification.getType());
  }

  @Test
  void testGetAndSetOrderId(){
    notification.setOrderId(1);
    assertEquals(1, notification.getOrderId());
  }

  @Test
  void testGetAndSetRecipient(){
    notification.setRecipient("WAITER");
    assertEquals("WAITER", notification.getRecipient());
  }

  @Test
  void testGetAndSetMessage(){
    notification.setMessage("Hello");
    assertEquals("Hello", notification.getMessage());
  }


}
