package rhul.cs2810.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import rhul.cs2810.model.WebSocketHandler;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class NotificationServiceTest {

  NotificationService notificationService;

  @Mock
  WebSocketHandler webSocketHandler;

  @BeforeEach
  void beforeEach(){
    MockitoAnnotations.openMocks(this);
    notificationService = new NotificationService(webSocketHandler);
  }

  @Test
  void testSendNotification() {
    try (MockedStatic<WebSocketHandler> mockedStatic = mockStatic(WebSocketHandler.class)) {
      notificationService.sendNotification("TYPE", 1, "RECIPIENT", "MESSAGE");
      mockedStatic.verify(() -> WebSocketHandler.sendNotification("TYPE", 1, "RECIPIENT", "MESSAGE"));
    }
  }


}
