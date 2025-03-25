package rhul.cs2810.repository;

import java.util.List;
import java.util.Optional;

// might not be needed? orders stored in customer class

import org.springframework.data.repository.CrudRepository;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.Waiter;

/**
 * Repository for managing Order entities.
 */
public interface OrderRepository extends CrudRepository<Order, Integer> {
  Optional<Order> findById(int orderId);
  List<Order> findByWaiter(Waiter waiter);
}
