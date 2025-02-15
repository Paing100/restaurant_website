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

@RestController
@RequestMapping("/auth")
public class LoginController {
  @Autowired
  private EmployeeService employeeService;

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
      response.put("message", "Invalid Credentials");
      // 401 Unauthorized status
      return ResponseEntity.status(401).body(response);
    }
  }

  @PostMapping("/register")
  public ResponseEntity<Map<String, String>> register(@RequestBody Employee employee) {
    boolean created = employeeService.registerUser(employee);
    Map<String, String> response = new HashMap<>();
    if (created) {
      response.put("message", "Register Successful");
      response.put("firstName", employee.getFirstName());
      response.put("role", employee.getRole());
      return ResponseEntity.ok(response);
    } else {
      response.put("message", "Something went wrong!");
      // 500 Internal Server Error status
      return ResponseEntity.status(500).body(response);
    }
  }

}
