package rhul.cs2810.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import rhul.cs2810.model.Customer;
import rhul.cs2810.model.MenuItem;
import rhul.cs2810.model.Order;


/**
 * Configuration class for customising the behaviour of Spring Data REST.
 */
@Configuration
public class RestConfiguration implements RepositoryRestConfigurer {

  @Override
  public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config,
      CorsRegistry cors) {
    config.exposeIdsFor(Customer.class);
    config.exposeIdsFor(Order.class);
    config.exposeIdsFor(MenuItem.class);
  }

}
