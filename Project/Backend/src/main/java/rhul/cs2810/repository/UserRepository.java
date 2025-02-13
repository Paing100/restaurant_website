package rhul.cs2810.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import rhul.cs2810.model.User;

/**
 * Repository for managing authentication of user entities.
 */
public interface UserRepository extends CrudRepository<User, Long> {
  Optional<User> findByUserId(String userId);
}
