package rhul.cs2810.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import rhul.cs2810.model.Employee;
import rhul.cs2810.repository.EmployeeRepository;

/**
 * A class containing business logic of the employee login system.
 */
@Service
public class EmployeeService {

  @Autowired
  private EmployeeRepository employeeRepository;

  @Autowired
  private BCryptPasswordEncoder bCryptPasswordEncoder;

  /**
   * A constructor with two parameters.
   *
   * @param userRepository        CRUD repository for Employee class
   * @param bCryptPasswordEncoder Encoder for the password
   */
  @Autowired
  public EmployeeService(EmployeeRepository employeeRepository,
      BCryptPasswordEncoder bCryptPasswordEncoder) {
    this.employeeRepository = employeeRepository;
    this.bCryptPasswordEncoder = bCryptPasswordEncoder;
  }

  /**
   * Authenticate an employee based on employeeId and password.
   *
   * @param employeeId the id of the employee
   * @param password   the password of the employee
   * @return Employee if employeeId matches. Otherwise, empty Optional
   */
  public Optional<Employee> authenticateUser(String employeeId, String password) {
    Optional<Employee> userOptional = employeeRepository.findByEmployeeId(employeeId);

    if (userOptional.isPresent()) {
      Employee user = userOptional.get();
      if (bCryptPasswordEncoder.matches(password, user.getPassword())) {
        return Optional.of(user);
      }
    }
    return Optional.empty();
  }

  /**
   * Register user with all the details or change the password of a user.
   *
   * @param employee An employee object
   * @return true if all details are present or false if not
   */
  public boolean registerUser(Employee employee) {
    String idString = employee.getEmployeeId();
    String passwString = employee.getPassword();
    String firstNameString = employee.getFirstName();
    String lastNameString = employee.getLastName();
    String roleString = employee.getRole();
    if (roleString == null || roleString.trim().isEmpty()) {
        roleString = "WAITER"; // Default role if missing
    } else {
        roleString = roleString.toUpperCase();
    }

    if (idString != null && passwString != null) {
      Optional<Employee> existingUserOptional = employeeRepository.findByEmployeeId(idString);
      if (existingUserOptional.isPresent()) {
        Employee existingEmployee = existingUserOptional.get();
        String encodedPasswordString = bCryptPasswordEncoder.encode(passwString);
        existingEmployee.setPassword(encodedPasswordString);
        employeeRepository.save(existingEmployee);
        System.out.println("Password Overriden");
        return true;
      }
      String encodedPasswordString = bCryptPasswordEncoder.encode(passwString);
      employee.setPassword(encodedPasswordString);
      employee.setFirstName(firstNameString);
      employee.setLastName(lastNameString);
      employee.setRole(roleString);
      try {
        employeeRepository.save(employee);
        return true;
      } catch (Exception e) {
        return false;
      }
    }
    return false;

  }

}
