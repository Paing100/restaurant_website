package rhul.cs2810.repository;


import org.springframework.data.repository.CrudRepository;
import rhul.cs2810.model.Order;
import rhul.cs2810.model.OrderMenuItem;
import rhul.cs2810.model.OrderMenuItemId;
import rhul.cs2810.model.MenuItem;



import java.util.List;

/**
 * Repository for managing OrderMenuItem entities.
 */
public interface OrderMenuItemRepository extends CrudRepository<OrderMenuItem, OrderMenuItemId> {


  /**
   * Finds all OrderMenuItems associated with a specific order.
   *
   * @param order the order to search for
   * @return a list of OrderMenuItems
   */
  List<OrderMenuItem> findByOrder(Order order);
}
