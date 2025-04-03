package rhul.cs2810.service;

import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import rhul.cs2810.model.Employee;
import rhul.cs2810.model.Waiter;
import rhul.cs2810.repository.EmployeeRepository;
import rhul.cs2810.repository.WaiterRepository;

/**
 * A class containing business logic of the employee login system.
 */
@Service
public class EmployeeService {

  @Autowired
  private EmployeeRepository employeeRepository;

  @Autowired
  private WaiterRepository waiterRepository;

  @Autowired
  private BCryptPasswordEncoder bCryptPasswordEncoder;

  @Autowired
  private WaiterService waiterService;

  /**
   * A constructor with parameters.
   *
   * @param employeeRepository CRUD repository for Employee class
   * @param waiterRepository CRUD repository for Waiter class
   * @param bCryptPasswordEncoder Encoder for the password
   * @param waiterService Service for waiter management
   */
  @Autowired
  public EmployeeService(EmployeeRepository employeeRepository,
      WaiterRepository waiterRepository,
      BCryptPasswordEncoder bCryptPasswordEncoder,
      WaiterService waiterService) {
    this.employeeRepository = employeeRepository;
    this.waiterRepository = waiterRepository;
    this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    this.waiterService = waiterService;
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

    if (employee == null || employee.getEmployeeId() == null || employee.getPassword() == null){
      return false;
    }

    String roleString = validateRole(employee.getRole());
    employee.setRole(roleString);
    
    Optional<Employee> existingUserOptional = employeeRepository.findByEmployeeId(employee.getEmployeeId());
    if (existingUserOptional.isPresent()) {
      Employee existingEmployee = existingUserOptional.get();
      updateExistingEmployee(existingEmployee, employee);
      System.out.println("Password Overriden");
    }
    else{
      saveNewEmployee(employee);
      
      if ("WAITER".equals(employee.getRole())) {
        Waiter waiter = new Waiter(employee);
        waiter = waiterRepository.save(waiter);
        waiterService.reassignOrdersToDefaultWaiter(waiter);
      }
    }
    return true;
  }

  /**
   * Validates the role of the employee. If the role is null or empty, it defaults to "WAITER".
   * 
   * @param role the role of the employee
   * @return the validated role
   */
  private String validateRole(String role){
    if (role == null || role.trim().isEmpty()) {
      return "WAITER";
    }
    return role.trim().toUpperCase();
  }

  /**
   * Updates the existing employee with new details.
   * 
   * @param existingEmployee the existing employee
   * @param newEmployee the new employee with updated details
   */
  private void updateExistingEmployee(Employee existingEmployee, Employee newEmployee){
    String encodedPasswordString = bCryptPasswordEncoder.encode(newEmployee.getPassword());
    existingEmployee.setPassword(encodedPasswordString);
    existingEmployee.setEmployeeId(newEmployee.getEmployeeId());
    existingEmployee.setFirstName(newEmployee.getFirstName());
    existingEmployee.setLastName(newEmployee.getLastName());
    existingEmployee.setRole(newEmployee.getRole());
    employeeRepository.save(existingEmployee);
  }

  /**
   * Saves a new employee to the database.
   * 
   * @param employee the new employee to be saved
   */
  private void saveNewEmployee(Employee employee){
    String encodedPasswordString = bCryptPasswordEncoder.encode(employee.getPassword());
    employee.setPassword(encodedPasswordString);
    employee.setFirstName(employee.getFirstName());
    employee.setLastName(employee.getLastName());
    employee.setEmployeeId(employee.getEmployeeId());
    employee.setRole(employee.getRole());
    employeeRepository.save(employee);
  }
}
