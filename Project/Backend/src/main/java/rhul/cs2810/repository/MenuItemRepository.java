package rhul.cs2810.repository;


import org.springframework.data.repository.CrudRepository;
import rhul.cs2810.model.MenuItem;

/**
 * Repository for managing Menu Item entities.
 */
public interface MenuItemRepository extends CrudRepository<MenuItem, Integer> {

}

