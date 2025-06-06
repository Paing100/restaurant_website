package rhul.cs2810.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rhul.cs2810.model.Notification;
import rhul.cs2810.repository.NotificationRepository;
import rhul.cs2810.service.NotificationService;

/**
 * Controller class for managing notifications.
 * Provides endpoints for sending, retrieving, and deleting notifications.
 */
@RestController
@RequestMapping("/api/notification")
public class NotificationController {
  @Autowired
  private NotificationService notificationService;

  @Autowired
  private NotificationRepository notificationRepository;

  /**
   * Sends a notification and then saves it to the repository.
   *
   * @param notification the notification to be sent
   * @return ResponseEntity indicating the success of the operation
   */
  @PostMapping("/send")
  public ResponseEntity<Void> sendNotification(@RequestBody Notification notification) {
    notificationService.processNotification(notification);
    return ResponseEntity.ok().build();
  }

  /**
   * Retrieves all of the notifications from the repository.
   *
   * @return ResponseEntity which contains a list of all the notifications
   */
  @GetMapping("/getMessages")
  public ResponseEntity<List<Notification>> getMessages() {
    return ResponseEntity.ok(notificationService.getMessages());
  }

  /**
   * Deletes a notification by its ID.
   *
   * @param notiId the ID of the notification to be deleted
   */
  @DeleteMapping("{notiId}/removeMessages")
  public void removeMessages(@PathVariable int notiId) {
    notificationRepository.deleteById(notiId);
  }
}
