package rhul.cs2810.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import rhul.cs2810.model.Employee;

/**
 * Repository for managing authentication of user entities.
 */
public interface EmployeeRepository extends CrudRepository<Employee, Long> {
  public Optional<Employee> findByEmployeeId(String userId);
}
