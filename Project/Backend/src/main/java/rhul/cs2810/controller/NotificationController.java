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
  private final NotificationService notificationService;

  @Autowired
  private final NotificationRepository notificationRepository;

  /**
   * Creates a new NotificationController.
   *
   * @param notificationService the service for handling notification logic
   * @param notificationRepository the repository for accessing notification data
   */
  @Autowired
  public NotificationController(NotificationService notificationService,
      NotificationRepository notificationRepository) {
    this.notificationService = notificationService;
    this.notificationRepository = notificationRepository;
  }

  /**
   * Sends a notification and then saves it to the repository.
   *
   * @param notification the notification to be sent
   * @return ResponseEntity indicating the success of the operation
   */
  @PostMapping("/send")
  public ResponseEntity<Void> sendNotification(@RequestBody Notification notification) {
    notificationService.sendNotification(notification.getType(), notification.getOrderId(),
        notification.getRecipient(), notification.getMessage(), notification.getWaiterId());
    notificationRepository.save(notification);

    return ResponseEntity.ok().build();
  }

  /**
   * Retrieves all of the notifications from the repository.
   *
   * @return ResponseEntity which contains a list of all the notifications
   */
  @GetMapping("/getMessages")
  public ResponseEntity<List<Notification>> getMessages() {
    Iterable<Notification> notifsIterable = notificationRepository.findAll();
    List<Notification> notifItems = new ArrayList<>();
    notifsIterable.forEach(notifItems::add);
    return ResponseEntity.ok(notifItems);
  }

  /**
   * Deletes a notification by its ID.
   *
   * @param notiId the ID of the notification to be deleted
   */
  @DeleteMapping("{notiId}/removeMessages")
  public void removeMessages(@PathVariable int notiId) {
    // Optional<Notification> notificationOptional = notificationRepository.findById(notiId);
    // if (notificationOptional.isEmpty()){
    // System.out.println("Notification not found");
    // }
    // Notification notification = notificationOptional.get();
    notificationRepository.deleteById(notiId);
  }
}
