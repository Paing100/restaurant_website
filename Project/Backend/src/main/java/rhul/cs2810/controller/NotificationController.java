package rhul.cs2810.controller;

import org.aspectj.weaver.ast.Not;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rhul.cs2810.model.Notification;
import rhul.cs2810.service.NotificationService;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {
  private final NotificationService notificationService;

  @Autowired
  public NotificationController(NotificationService notificationService){
    this.notificationService = notificationService;
  }

  @PostMapping("/send")
  public ResponseEntity<Void> sendNotification(@RequestBody Notification notification){
    notificationService.sendNotification(
      notification.getType(),
      notification.getOrderId(),
      notification.getRecipient(),
      notification.getMessage()
    );
    return ResponseEntity.ok().build();
  }

}
