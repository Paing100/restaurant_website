package rhul.cs2810.repository;

import org.springframework.data.repository.CrudRepository;
import rhul.cs2810.model.Waiter;
import rhul.cs2810.model.Employee;
import java.util.Optional;

/**
 * Repository for managing Waiter entities.
 */
public interface WaiterRepository extends CrudRepository<Waiter, Integer> {
    Optional<Waiter> findByEmployee(Employee employee);
} 