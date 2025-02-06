package rhul.cs2810.repository;


import org.springframework.data.repository.CrudRepository;
import rhul.cs2810.MenuItem;

/**
 * a repository that manages grade instances.
 */
public interface MenuItemRepository extends CrudRepository<MenuItem, Long> {

}

