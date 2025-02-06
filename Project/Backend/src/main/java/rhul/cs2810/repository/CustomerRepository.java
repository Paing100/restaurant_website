package rhul.cs2810.repository;

import org.springframework.data.repository.CrudRepository;
import rhul.cs2810.Customer;

public interface CustomerRepository extends CrudRepository<Customer, Long> {

}
