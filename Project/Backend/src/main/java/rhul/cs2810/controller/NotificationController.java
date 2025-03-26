package rhul.cs2810.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rhul.cs2810.model.Notification;
import rhul.cs2810.repository.NotificationRepository;
import rhul.cs2810.service.NotificationService;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {
  private final NotificationService notificationService;

  @Autowired
  private final NotificationRepository notificationRepository;

  @Autowired
  public NotificationController(NotificationService notificationService,
      NotificationRepository notificationRepository, NotificationRepository notificationRepository1) {
    this.notificationService = notificationService;
    this.notificationRepository = notificationRepository1;
  }

  @PostMapping("/send")
  public ResponseEntity<Void> sendNotification(@RequestBody Notification notification) {
    notificationService.sendNotification(notification.getType(), notification.getOrderId(),
        notification.getRecipient(), notification.getMessage(), notification.getWaiterId());
    notificationRepository.save(notification);

    return ResponseEntity.ok().build();
  }

  @GetMapping("/getMessages")
  public ResponseEntity<List<Notification>> getMessages() {
    Iterable<Notification> notifsIterable = notificationRepository.findAll();
    List<Notification> notifItems = new ArrayList<>();
    notifsIterable.forEach(notifItems::add);
    return ResponseEntity.ok(notifItems);
  }

  @DeleteMapping("{notiId}/removeMessages")
  public void removeMessages(@PathVariable int notiId) {
//    Optional<Notification> notificationOptional = notificationRepository.findById(notiId);
//    if (notificationOptional.isEmpty()){
//      System.out.println("Notification not found");
//    }
//    Notification notification = notificationOptional.get();
    notificationRepository.deleteById(notiId);
  }
}
