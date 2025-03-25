package rhul.cs2810;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.handler.WebSocketSessionDecorator;
import rhul.cs2810.model.WebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class WebSocketHandlerTest {

   WebSocketHandler webSocketHandler;
   WebSocketSession session;

   @BeforeEach
   void beforeEach(){
      webSocketHandler = new WebSocketHandler();
      session = Mockito.mock(WebSocketSession.class);
   }

   @AfterEach
   void afterEach(){
      webSocketHandler.afterConnectionClosed(session, CloseStatus.NORMAL);
   }

   @Test
   void testAfterConnectionEst(){
      webSocketHandler.afterConnectionEstablished(session);
      assertEquals(1, webSocketHandler.getSessions().size());
   }

   @Test
   void testAfterConnectionClosed(){
      webSocketHandler.afterConnectionEstablished(session);
      assertEquals(1, webSocketHandler.getSessions().size());
      webSocketHandler.afterConnectionClosed(session, CloseStatus.NORMAL);
      assertEquals(0, webSocketHandler.getSessions().size());
   }

   @Test
   void testGetSessions(){
      webSocketHandler.afterConnectionEstablished(session);
      assertEquals(session, webSocketHandler.getSessions().get(0));
   }

   @Test
   void testHandleTextMessage(){
      webSocketHandler.handleTextMessage(session, new TextMessage("MESSAGE"));
   }

   @Test
   void testSendNotification() throws IOException {
      doNothing().when(session).sendMessage(new TextMessage("MESSAGE"));
      when(session.isOpen()).thenReturn(Boolean.TRUE);
      webSocketHandler.afterConnectionEstablished(session);
      WebSocketHandler.sendNotification("TYPE", 1, "RECIPIENT", "MESSAGE","1");
      verify(session, times(1)).sendMessage(any(TextMessage.class));
   }

}
