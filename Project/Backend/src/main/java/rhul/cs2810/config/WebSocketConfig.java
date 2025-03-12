package rhul.cs2810.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import rhul.cs2810.model.WebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

  private final WebSocketHandler webSocketHandler;

  @Autowired
  public WebSocketConfig(WebSocketHandler webSocketHandler) {
    this.webSocketHandler = webSocketHandler;
  }

  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry.addHandler(webSocketHandler, "/ws/notifications") // use this endpoint
        .setAllowedOrigins("*");
  }
}
