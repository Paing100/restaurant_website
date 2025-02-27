package rhul.cs2810.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import rhul.cs2810.model.Employee;
import rhul.cs2810.service.EmployeeService;

/**
 * A class responsible for login related operations.
 */
@RestController
@RequestMapping("/auth")
public class LoginController {
  @Autowired
  private EmployeeService employeeService;

  /**
   * Log an employee in using credentials (employeeId and password)
   *
   * @param employee An Employee object with employeeId and password for login
   * @return ResponseEntity with status OK
   */
  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> login(@RequestBody Employee employee) {
    String employeeIdString = employee.getEmployeeId();
    String passwordString = employee.getPassword();

    Optional<Employee> employeeOptional =
        employeeService.authenticateUser(employeeIdString, passwordString);
    Map<String, String> response = new HashMap<>();

    if (employeeOptional.isPresent()) {
      Employee authenticatedEmployee = employeeOptional.get();

      response.put("message", "Login Successful!");
      response.put("firstName", authenticatedEmployee.getFirstName());
      response.put("role", authenticatedEmployee.getRole());
      return ResponseEntity.ok(response);
    } else {
      // 401 Unauthorized status
      return ResponseEntity.status(401).body(response);
    }
  }

  /**
   * Register a new employee to the system.
   *
   * @param employee An Employee object
   * @return ResponseEntity with status OK
   */
  @PostMapping("/register")
  public ResponseEntity<Map<String, String>> register(@RequestBody Employee employee) {
    boolean created = employeeService.registerUser(employee);
    Map<String, String> response = new HashMap<>();
    if (created) {
      response.put("message", "Register Successful");
      response.put("firstName", employee.getFirstName());
      response.put("role", employee.getRole());
      response.put("employeeId", employee.getEmployeeId());

      return ResponseEntity.ok(response);
    } else {
      // 500 Internal Server Error status
      return ResponseEntity.status(500).body(response);
    }
  }

}
