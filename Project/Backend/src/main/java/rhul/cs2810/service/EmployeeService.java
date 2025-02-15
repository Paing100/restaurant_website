package rhul.cs2810.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import rhul.cs2810.model.Employee;
import rhul.cs2810.repository.EmployeeRepository;

@Service
public class EmployeeService {
  @Autowired
  private EmployeeRepository employeeRepository;

  @Autowired
  private BCryptPasswordEncoder bCryptPasswordEncoder;

  @Autowired
  public EmployeeService(EmployeeRepository userRepository,
      BCryptPasswordEncoder bCryptPasswordEncoder) {
    this.employeeRepository = userRepository;
    this.bCryptPasswordEncoder = bCryptPasswordEncoder;
  }

  public Optional<Employee> authenticateUser(String userId, String password) {
    Optional<Employee> userOptional = employeeRepository.findByEmployeeId(userId);

    if (userOptional.isPresent()) {
      Employee user = userOptional.get();
      if (bCryptPasswordEncoder.matches(password, user.getPassword())) {
        return Optional.of(user);
      }
    }
    return Optional.empty();
  }

  public boolean registerUser(Employee employee) {
    String idString = employee.getEmployeeId();
    String passwString = employee.getPassword();
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
