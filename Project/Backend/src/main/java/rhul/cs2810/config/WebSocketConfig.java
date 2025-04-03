package rhul.cs2810.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import rhul.cs2810.model.WebSocketHandler;

/**
 * Configuration class for WebSocket support in the application.
 * This class enables WebSocket communication and registers WebSocket handlers.
 */
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

  private final WebSocketHandler webSocketHandler;

  /**
   * Constructor for WebSocketConfig.
   *
   * @param webSocketHandler the WebSocketHandler to handle WebSocket connections
   */
  @Autowired
  public WebSocketConfig(WebSocketHandler webSocketHandler) {
    this.webSocketHandler = webSocketHandler;
  }

  /**
   * Registers WebSocket handlers and their corresponding endpoints.
   *
   * @param registry the WebSocketHandlerRegistry to register handlers
   */
  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry.addHandler(webSocketHandler, "/ws/notifications") // use this endpoint
        .setAllowedOrigins("*");
  }
}
