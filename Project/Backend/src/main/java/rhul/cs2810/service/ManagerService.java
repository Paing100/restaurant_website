package rhul.cs2810.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rhul.cs2810.model.Order;
import rhul.cs2810.repository.EmployeeRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class ManagerService {

  @Autowired
  private OrderService orderService;

  @Autowired
  private EmployeeRepository employeeRepository;


  public List<Order> getOutstandingOrders() {
    return orderService.getAllOrders();
  }

}
