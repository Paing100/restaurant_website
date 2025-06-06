package rhul.cs2810.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import rhul.cs2810.model.Notification;
import rhul.cs2810.model.WebSocketHandler;
import rhul.cs2810.repository.NotificationRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class NotificationServiceTest {

  @InjectMocks
  NotificationService notificationService;

  @Mock
  WebSocketHandler webSocketHandler;

  @Mock
  NotificationRepository notificationRepository;

  @BeforeEach
  void beforeEach(){
    MockitoAnnotations.openMocks(this);
    //notificationService = new NotificationService(webSocketHandler);
  }

  @Test
  void testSendNotification() {
    try (MockedStatic<WebSocketHandler> mockedStatic = mockStatic(WebSocketHandler.class)) {
      notificationService.sendNotification("TYPE", 1, "RECIPIENT", "MESSAGE", "1");
     verify(webSocketHandler).sendNotification("TYPE", 1, "RECIPIENT", "MESSAGE", "1");
    }
  }

  @Test
  void testProcessNotification() {
    Notification notification = new Notification();
    notification.setType("ORDER_READY");
    notification.setOrderId(101);
    notification.setRecipient("kitchen");
    notification.setMessage("Order #101 is ready.");
    notification.setWaiterId("W123");

    notificationService.processNotification(notification);

    verify(webSocketHandler).sendNotification(eq("ORDER_READY"), eq(101), eq("kitchen"),
      eq("Order #101 is ready."), eq("W123"));
    verify(notificationRepository).save(notification);
  }

  @Test
  void testGetMessages() {
    Notification notification = new Notification();
    notification.setType("ORDER_READY");
    notification.setOrderId(101);
    notification.setRecipient("kitchen");
    notification.setMessage("Order #101 is ready.");
    notification.setWaiterId("W123");

    when(notificationRepository.findAll()).thenReturn(List.of(notification));

    List<Notification> notifications  = notificationService.getMessages();

    Notification result = notifications.get(0);
    assertEquals(1, notifications.size());
    assertEquals(result.getMessage(), "Order #101 is ready.");
    assertEquals(result.getOrderId(), 101);
    verify(notificationRepository,times(1)).findAll();
  }

}
