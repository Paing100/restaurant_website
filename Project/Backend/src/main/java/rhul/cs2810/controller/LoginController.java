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
    Map<String, String> response = new HashMap<>();
    try {
      response = loginService.register(employee);
      return ResponseEntity.ok(response);
    } catch (IllegalArgumentException e) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Invalid employee data.");
      return ResponseEntity.badRequest().body(error);
    }
  }
}
