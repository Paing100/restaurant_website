package rhul.cs2810;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import rhul.cs2810.model.Employee;
import rhul.cs2810.model.Manager;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ManagerTest {

  Manager manager;
  Employee employee;

  @BeforeEach
  void setUp(){
    manager = new Manager();
    employee = new Employee();
  }

  @Test
  void testGetAndSetManagerId(){
    manager.setManagerId(1);
    assertEquals(1, manager.getManagerId());
  }

  @Test
  void testGetAndSetEmployee(){
    manager.setEmployee(employee);
    assertEquals(employee, manager.getEmployee());
  }

  @Test
  void testManagerConstructor(){
    Manager manager1 = new Manager(employee);
    assertEquals(employee, manager1.getEmployee());
  }
}
