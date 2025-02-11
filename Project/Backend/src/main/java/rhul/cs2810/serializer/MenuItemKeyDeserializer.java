package rhul.cs2810.serializer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.KeyDeserializer;
import rhul.cs2810.repository.MenuItemRepository;

@Component // register as bean
public class MenuItemKeyDeserializer extends KeyDeserializer {

  private static MenuItemRepository menuItemRepository; // static reference

  @Autowired // spring injects MenuItemRepository into the constructor
  public MenuItemKeyDeserializer(MenuItemRepository repository) {
    menuItemRepository = repository;
  }

  @Override
  public Object deserializeKey(String key, DeserializationContext ctxt) {
    int itemId = Integer.parseInt(key);
    return menuItemRepository.findById(Long.valueOf(itemId)).orElse(null); // lookup MenuItem by
                                                                           // ID
  }
}
