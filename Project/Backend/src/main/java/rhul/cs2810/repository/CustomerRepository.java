package rhul.cs2810.repository;

import org.springframework.data.repository.CrudRepository;
import rhul.cs2810.model.Customer;

/**
 * Repository for managing Customer entities.
 */
public interface CustomerRepository extends CrudRepository<Customer, Integer> {
  Customer findByName(String name);
  Customer findByEmail(String email);
}
