package rhul.cs2810.repository;

import org.springframework.data.repository.CrudRepository;

import rhul.cs2810.model.Category;

public interface CategoryRepository extends CrudRepository<Category, Long> {

}
