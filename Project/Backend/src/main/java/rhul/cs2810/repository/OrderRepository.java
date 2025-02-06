package rhul.cs2810.repository;

// might not be needed? orders stored in customer class

import org.springframework.data.repository.CrudRepository;
import jakarta.persistence.criteria.Order;


public interface OrderRepository extends CrudRepository<Order, Long> {

}
