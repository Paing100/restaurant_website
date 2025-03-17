package rhul.cs2810;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import rhul.cs2810.model.Employee;

public class EmployeeTest {

  Employee employee;

  @BeforeEach
  void beforeEach() {
    employee = new Employee();
  }

  @Test
  void testGetAndSetFirstName() {
    employee.setFirstName("James");
    assertEquals("James", employee.getFirstName());
  }

  @Test
  void testGetAndSetLastName() {
    employee.setLastName("W");
    assertEquals("W", employee.getLastName());
  }

  @Test
  void testGetAndSetRole() {
    employee.setRole("WAITER");
    assertEquals("WAITER", employee.getRole());
  }

  @Test
  void testGetAndSetEmployeeId() {
    employee.setEmployeeId("1011");
    assertEquals("1011", employee.getEmployeeId());
  }

  @Test
  void testGetAndSetPassword() {
    employee.setPassword("123");
    assertEquals("123", employee.getPassword());
  }

  @Test
  void testNonEmptyConstructor() {
    Employee emp = new Employee("101", "123", "John", "Duran", "KITCHEN");
    assertEquals("101", emp.getEmployeeId());
    assertEquals("123", emp.getPassword());
    assertEquals("John", emp.getFirstName());
    assertEquals("Duran", emp.getLastName());
    assertEquals("KITCHEN", emp.getRole());
  }

}
