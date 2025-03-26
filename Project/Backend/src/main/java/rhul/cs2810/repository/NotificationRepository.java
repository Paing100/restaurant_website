package rhul.cs2810.repository;


import org.springframework.data.repository.CrudRepository;
import rhul.cs2810.model.Notification;

/**
 * Repository for managing notification entities.
 */
public interface NotificationRepository extends CrudRepository<Notification, Integer> {

}
