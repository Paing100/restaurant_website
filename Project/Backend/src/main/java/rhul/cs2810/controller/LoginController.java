package rhul.cs2810.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import rhul.cs2810.model.Employee;
import rhul.cs2810.service.LoginService;

/**
 * A class responsible for login related operations.
 */
@RestController
@RequestMapping("/auth")
public class LoginController {
  @Autowired
  private LoginService loginService;

  /**
   * Log an employee in using credentials (employeeId and password)
   *
   * @param employee An Employee object with employeeId and password for login
   * @return ResponseEntity with status OK
   */
  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> login(@RequestBody Employee employee) {
    try {
      Map<String, String> response = loginService.login(employee);
      return ResponseEntity.ok(response);
    }
    catch (NoSuchElementException e) {
      return ResponseEntity.notFound().build();
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
    boolean created = loginService.registerUser(employee);
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
